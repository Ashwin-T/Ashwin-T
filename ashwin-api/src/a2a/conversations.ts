import type Anthropic from '@anthropic-ai/sdk'

// Conversation history per A2A contextId. In memory only — a restart starts
// every conversation fresh, which the agent handles like a first message.

const TTL = 60 * 60_000 // 1 hour since the last message
const MAX_MESSAGES = 20
const MAX_CONVERSATIONS = 1000

interface Conversation {
  messages: Anthropic.MessageParam[]
  expiresAt: number
}

const store = new Map<string, Conversation>()

export function getHistory(contextId: string): Anthropic.MessageParam[] {
  const entry = store.get(contextId)
  if (!entry) return []
  if (Date.now() > entry.expiresAt) {
    store.delete(contextId)
    return []
  }
  return entry.messages
}

export function appendTurn(contextId: string, user: string, assistant: string) {
  const messages: Anthropic.MessageParam[] = [
    ...getHistory(contextId),
    { role: 'user', content: user },
    { role: 'assistant', content: assistant },
  ]

  // Re-insert so the Map's insertion order tracks recency
  store.delete(contextId)
  store.set(contextId, {
    messages: messages.slice(-MAX_MESSAGES),
    expiresAt: Date.now() + TTL,
  })

  // Evict the least recently used conversations once over capacity
  for (const id of store.keys()) {
    if (store.size <= MAX_CONVERSATIONS) break
    store.delete(id)
  }
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [id, entry] of store) {
    if (now > entry.expiresAt) store.delete(id)
  }
}, 5 * 60_000).unref()
