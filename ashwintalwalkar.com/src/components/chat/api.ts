import type { Message, AIResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL

export async function sendMessage(messages: Message[]): Promise<AIResponse> {
  // Send only the text content for context
  const history = messages.map((msg) => ({
    role: msg.role,
    content: typeof msg.content === 'string'
      ? msg.content
      : msg.content.map((b) => {
          if (b.type === 'text') return b.content
          if (b.type === 'list') return b.items.join(', ')
          if (b.type === 'card') return `${b.title}: ${b.description}`
          if (b.type === 'code') return b.code
          return ''
        }).join(' '),
  }))

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  })

  if (!res.ok) {
    throw new Error('Failed to get response')
  }

  const data: AIResponse = await res.json()
  return { blocks: data.blocks, suggestions: data.suggestions, steps: data.steps }
}
