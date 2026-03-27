import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from './prompt'

type Bindings = {
  ANTHROPIC_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.post('/chat', async (c) => {
  const body = await c.req.json<{
    messages: { role: 'ai' | 'user'; content: string }[]
  }>()

  // Map frontend roles to Claude API roles
  const claudeMessages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const client = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: buildSystemPrompt(),
    messages: claudeMessages,
  })

  const rawText =
    response.content[0].type === 'text' ? response.content[0].text : ''

  // Try to parse as JSON; fall back to wrapping raw text in a text block
  let parsed: { blocks: unknown[] }
  try {
    parsed = JSON.parse(rawText)
  } catch {
    parsed = { blocks: [{ type: 'text', content: rawText }] }
  }

  return c.json(parsed)
})

export default app
