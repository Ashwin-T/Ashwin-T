import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from './prompt'

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

  // Use the latest user message to query relevant knowledge
  const latestUserMsg = [...body.messages].reverse().find((m) => m.role === 'user')?.content ?? ''

  // Map frontend roles to Claude API roles
  const claudeMessages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const client = new Anthropic()
  const systemPrompt = buildSystemPrompt(latestUserMsg)

  let rawText = await callClaude(client, systemPrompt, claudeMessages)

  // Try to parse, if invalid JSON retry once with the error
  let parsed: { blocks: unknown[]; suggestions?: string[] }
  try {
    parsed = JSON.parse(rawText)
  } catch (err) {
    console.warn(`[chat] Invalid JSON from Claude, retrying. Error: ${err}`)
    console.warn(`[chat] Raw response: ${rawText.slice(0, 200)}`)

    const retryMessages: Anthropic.MessageParam[] = [
      ...claudeMessages,
      { role: 'assistant', content: rawText },
      { role: 'user', content: `Your response was not valid JSON. Parse error: ${err}. Please return ONLY a valid JSON object matching the schema.` },
    ]

    rawText = await callClaude(client, systemPrompt, retryMessages)

    try {
      parsed = JSON.parse(rawText)
    } catch {
      // Give up after retry, wrap raw text
      parsed = { blocks: [{ type: 'text', content: rawText }] }
    }
  }

  return c.json(parsed)
})

async function callClaude(
  client: Anthropic,
  systemPrompt: string,
  messages: Anthropic.MessageParam[],
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  let rawText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip markdown fences if Claude wraps the JSON
  rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  return rawText
}

// ─── Ingest cron (runs on startup + every 24h) ─────────────────
// NOTE: bad practice to run ingest in the same process — ideally a separate cron service
async function runIngest() {
  try {
    console.log('[ingest] Starting knowledge ingest...')
    await import('./knowledge/ingest')
    console.log('[ingest] Done.')
  } catch (e) {
    console.error('[ingest] Failed:', e)
  }
}

runIngest()
setInterval(runIngest, 24 * 60 * 60_000)

// ─── Server ─────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 8787
console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })
