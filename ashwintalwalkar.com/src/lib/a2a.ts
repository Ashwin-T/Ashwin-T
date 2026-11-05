/**
 * A small A2A (Agent2Agent) v1.0 client for the JSON-RPC binding: discovers the
 * agent through its agent card, then talks to it with `SendMessage`.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'
const A2A_VERSION = '1.0'

export const A2UI_EXTENSION = 'https://a2ui.org/a2a-extension/a2ui/v0.9'
export const A2UI_MIME_TYPE = 'application/a2ui+json'

export type Part = {
  text?: string
  data?: unknown
  mediaType?: string
  metadata?: Record<string, unknown>
}

export type AgentMessage = {
  messageId: string
  contextId?: string
  parts: Part[]
  metadata?: Record<string, unknown>
}

type AgentCard = {
  supportedInterfaces?: { url: string; protocolBinding: string; protocolVersion: string }[]
}

let endpoint: Promise<string> | undefined

// The agent card says where the JSON-RPC interface lives. Fetched once per page load.
function discover(): Promise<string> {
  endpoint ??= fetch(`${API_URL}/.well-known/agent-card.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Agent card request failed (${res.status})`)
      return res.json() as Promise<AgentCard>
    })
    .then((card) => {
      const jsonRpc = card.supportedInterfaces?.find(
        (i) => i.protocolBinding === 'JSONRPC' && i.protocolVersion === A2A_VERSION,
      )
      if (!jsonRpc) throw new Error('Agent offers no A2A 1.0 JSON-RPC interface')
      return jsonRpc.url
    })
    .catch((e) => {
      endpoint = undefined // let the next message retry discovery
      throw e
    })
  return endpoint
}

export function isA2uiPart(part: Part): boolean {
  return part.mediaType === A2UI_MIME_TYPE || part.metadata?.mimeType === A2UI_MIME_TYPE
}

export function a2uiPart(messages: unknown[]): Part {
  return { data: messages, mediaType: A2UI_MIME_TYPE, metadata: { mimeType: A2UI_MIME_TYPE } }
}

/** Sends one user message and resolves with the agent's reply. */
export async function sendMessage(message: {
  parts: Part[]
  contextId?: string
  metadata?: Record<string, unknown>
}): Promise<AgentMessage> {
  const res = await fetch(await discover(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'A2A-Version': A2A_VERSION,
      'A2A-Extensions': A2UI_EXTENSION,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: crypto.randomUUID(),
      method: 'SendMessage',
      params: {
        message: { messageId: crypto.randomUUID(), role: 'ROLE_USER', ...message },
      },
    }),
  })

  if (!res.ok) throw new Error(`Agent request failed (${res.status})`)

  const { result, error } = await res.json()
  if (error) throw new Error(error.message)
  // This agent answers with a Message. A Task here means the turn failed.
  if (!result?.message) throw new Error('Agent did not reply with a message')
  return result.message
}
