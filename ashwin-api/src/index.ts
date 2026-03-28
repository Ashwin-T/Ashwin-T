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

  // Map frontend roles to Claude API roles
  const claudeMessages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const client = new Anthropic()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: claudeMessages,
  })

  let rawText =
    response.content[0].type === 'text' ? response.content[0].text : ''

  // Strip markdown fences if Claude wraps the JSON
  rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  // Try to parse as JSON; fall back to wrapping raw text in a text block
  let parsed: { blocks: unknown[]; suggestions?: string[] }
  try {
    parsed = JSON.parse(rawText)
  } catch {
    parsed = { blocks: [{ type: 'text', content: rawText }] }
  }

  return c.json(parsed)
})

const port = 8787
console.log(`Server running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
