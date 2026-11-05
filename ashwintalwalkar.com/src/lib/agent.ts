import type { ReactCatalogComponent } from '@a2ui/react/v0_9'
import { MessageProcessor, type ActionPayload, type SurfaceModel } from '@a2ui/web_core/v0_9'
import { CATALOG_ID, chatCatalog } from '../components/ChatCatalog'
import { a2uiPart, isA2uiPart, sendMessage, type Part } from './a2a'

const A2UI_VERSION = 'v0.9'

// The agent names the surface holding its follow-up suggestions with this prefix.
const SUGGESTIONS_PREFIX = 'suggestions-'

/** A piece of agent-built UI, ready to hand to `<A2uiSurface>`. */
export type ChatSurface = SurfaceModel<ReactCatalogComponent>

export type Reply = {
  /** Plain-text answer, when the agent replied without A2UI. */
  text?: string
  answer?: ChatSurface
  /** Follow-up questions the visitor can tap. */
  suggestions?: ChatSurface
}

export type { ActionPayload }

export type AgentSession = ReturnType<typeof createAgentSession>

type A2uiMessage = { createSurface?: { surfaceId?: string } }

/**
 * One conversation with the agent: A2A carries the messages, A2UI describes
 * the UI in the replies. The agent keeps the history, keyed by the contextId
 * it hands back on the first reply.
 */
export function createAgentSession() {
  const listeners = new Set<(action: ActionPayload) => void>()
  const processor = new MessageProcessor<ReactCatalogComponent>([chatCatalog], (action) => {
    for (const listener of listeners) listener(action)
  })

  let contextId: string | undefined
  let staleSuggestions: string | undefined

  async function send(parts: Part[]): Promise<Reply> {
    const message = await sendMessage({
      parts,
      contextId,
      metadata: {
        a2uiClientCapabilities: { [A2UI_VERSION]: { supportedCatalogIds: [CATALOG_ID] } },
      },
    })
    contextId = message.contextId || contextId

    // The last turn's suggestions are off screen by now
    if (staleSuggestions) {
      processor.processMessages([
        { version: A2UI_VERSION, deleteSurface: { surfaceId: staleSuggestions } },
      ])
      staleSuggestions = undefined
    }

    const reply: Reply = {}
    for (const part of message.parts) {
      if (typeof part.text === 'string') {
        reply.text = reply.text ? `${reply.text}\n\n${part.text}` : part.text
      } else if (isA2uiPart(part) && Array.isArray(part.data)) {
        const messages = part.data as A2uiMessage[]
        processor.processMessages(part.data)

        for (const { createSurface } of messages) {
          const surface = createSurface?.surfaceId && processor.getSurface(createSurface.surfaceId)
          if (!surface) continue

          if (surface.id.startsWith(SUGGESTIONS_PREFIX)) {
            reply.suggestions = surface
            staleSuggestions = surface.id
          } else {
            reply.answer = surface
          }
        }
      }
    }
    return reply
  }

  return {
    /** Asks a typed question. */
    ask: (question: string) => send([{ text: question }]),

    /** Reports an A2UI action (a tapped suggestion) back to the agent. */
    act: ({ name, surfaceId, sourceComponentId, timestamp, context }: ActionPayload) =>
      send([
        a2uiPart([
          {
            version: A2UI_VERSION,
            action: { name, surfaceId, sourceComponentId, timestamp, context },
          },
        ]),
      ]),

    /** Subscribes to actions fired from any surface. Returns the unsubscribe. */
    onAction(listener: (action: ActionPayload) => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
