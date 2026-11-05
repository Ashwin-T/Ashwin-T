import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTP_EXTENSION_HEADER } from '@a2a-js/sdk'
import { warmCache } from './connectors/registry'
import { A2A_PATH } from './a2a/agent-card'
import { a2a } from './a2a/routes'

const app = new Hono()

app.use('/*', cors({ origin: '*', exposeHeaders: [HTTP_EXTENSION_HEADER] }))

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

app.use(A2A_PATH, async (c, next) => {
  const ip = getIP(c)
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
  } else {
    entry.count++
    if (entry.count > RATE_LIMIT) {
      return c.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32000, message: "You're sending too many messages. Try again in a minute!" },
        },
        429
      )
    }
  }

  await next()
})

// ─── Routes ─────────────────────────────────────────────────────

app.get('/', (c) => c.text('We Are Healthy'))

// A2A: agent card at /.well-known/agent-card.json, JSON-RPC at /a2a
app.route('/', a2a)

// ─── Warm cache on startup, refresh every 24h ───────────────────
warmCache()
setInterval(() => warmCache(), 24 * 60 * 60_000)

// ─── Server ─────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 8787
console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })
