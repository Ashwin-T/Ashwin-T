import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Anthropic from '@anthropic-ai/sdk'
import { getAll, execute, warmCache } from './connectors/registry'
import { SYSTEM_PROMPT } from './prompt'

const app = new Hono()

app.use('/*', cors())

// ─── Rate limiter ───────────────────────────────────────────────
const RATE_LIMIT = 20        // max requests per window
const RATE_WINDOW_MS = 60_000 // 1 minute

const hits = new Map<string, { count: number; resetAt: number }>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip)
  }
}, 5 * 60_000)

function getIP(c: { req: { header: (name: string) => string | undefined } }): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  )
}

app.use('/chat', async (c, next) => {
  const ip = getIP(c)
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
  } else {
    entry.count++
    if (entry.count > RATE_LIMIT) {
      return c.json(
        { blocks: [{ type: 'text', content: "You're sending too many messages. Try again in a minute!" }] },
        429
      )
    }
  }

  await next()
})

// ─── Routes ─────────────────────────────────────────────────────

app.get('/', (c) => c.text('We Are Healthy'))

app.post('/chat', async (c) => {
  const body = await c.req.json<{
    messages: { role: 'ai' | 'user'; content: string }[]
  }>()

  const claudeMessages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const tools: Anthropic.Tool[] = getAll().map((conn) => ({
    name: conn.name,
    description: conn.description,
    input_schema: conn.schema as Anthropic.Tool.InputSchema,
  }))

  const result = await runAgentLoop(claudeMessages, tools)
  return c.json(result)
})

// ─── Agentic loop ───────────────────────────────────────────────

const MAX_TOOL_ROUNDS = 5

async function runAgentLoop(
  messages: Anthropic.MessageParam[],
  tools: Anthropic.Tool[],
) {
  const client = new Anthropic()

  let response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    ...(tools.length > 0 && { tools }),
    messages,
  })

  let rounds = 0
  while (response.stop_reason === 'tool_use' && rounds < MAX_TOOL_ROUNDS) {
    rounds++

    const toolCalls = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    )

    const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolCalls.map(async (call) => {
        try {
          const result = await execute(call.name, call.input)
          return {
            type: 'tool_result' as const,
            tool_use_id: call.id,
            content: JSON.stringify(result),
          }
        } catch (e) {
          return {
            type: 'tool_result' as const,
            tool_use_id: call.id,
            content: `Error: ${e instanceof Error ? e.message : String(e)}`,
            is_error: true as const,
          }
        }
      }),
    )

    messages = [
      ...messages,
      { role: 'assistant', content: response.content },
      { role: 'user', content: toolResults },
    ]

    response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      ...(tools.length > 0 && { tools }),
      messages,
    })
  }

  return formatResponse(response)
}

function formatResponse(response: Anthropic.Message) {
  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === 'text',
  )

  let rawText = textBlock?.text ?? ''

  // Strip markdown fences if Claude wraps the JSON
  rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  try {
    return JSON.parse(rawText)
  } catch {
    return { blocks: [{ type: 'text', content: rawText }] }
  }
}

// ─── Warm cache on startup, refresh every 24h ───────────────────
warmCache()
setInterval(() => warmCache(), 24 * 60 * 60_000)

// ─── Server ─────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 8787
console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })
