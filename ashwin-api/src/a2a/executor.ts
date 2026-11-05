import { randomUUID } from 'node:crypto'
import { Role, type Message, type Part } from '@a2a-js/sdk'
import {
  AgentEvent,
  type AgentExecutor,
  type ExecutionEventBus,
  type RequestContext,
} from '@a2a-js/sdk/server'
import { runAgentLoop } from '../agent'
import {
  A2UI_EXTENSION_URI,
  A2UI_MIME_TYPE,
  A2UI_VERSION,
  ASK_ACTION,
  CATALOG_ID,
  buildMessages,
  componentsToText,
} from '../a2ui/catalog'
import { appendTurn, getHistory } from './conversations'

// ─── Reading the request ────────────────────────────────────────

function isA2uiPart(part: Part): boolean {
  return part.mediaType === A2UI_MIME_TYPE || part.metadata?.mimeType === A2UI_MIME_TYPE
}

/** The visitor's question: typed text, or the question behind a clicked suggestion. */
function readQuestion(message: Message): string {
  const lines: string[] = []

  for (const part of message.parts) {
    if (part.content?.$case === 'text') {
      lines.push(part.content.value)
    } else if (part.content?.$case === 'data' && isA2uiPart(part)) {
      const events = Array.isArray(part.content.value) ? part.content.value : [part.content.value]
      for (const event of events) {
        if (event?.error) console.warn('[a2ui] Client reported an error:', event.error)

        const question = event?.action?.name === ASK_ACTION && event.action.context?.question
        if (typeof question === 'string') lines.push(question)
      }
    }
  }

  return lines.join('\n').trim()
}

/** True when the client says it can render the chat catalog. */
function clientSupportsCatalog(ctx: RequestContext): boolean {
  const capabilities =
    ctx.userMessage.metadata?.a2uiClientCapabilities ?? ctx.request.metadata?.a2uiClientCapabilities
  const catalogIds = capabilities?.[A2UI_VERSION]?.supportedCatalogIds
  return Array.isArray(catalogIds) && catalogIds.includes(CATALOG_ID)
}

// ─── Executor ───────────────────────────────────────────────────

export class AshwinAgentExecutor implements AgentExecutor {
  async execute(ctx: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const { contextId } = ctx
    const question = readQuestion(ctx.userMessage)
    const messageId = randomUUID()

    const reply = (parts: Part[], extra: Partial<Message> = {}) => {
      eventBus.publish(
        AgentEvent.message({
          messageId,
          contextId,
          taskId: '',
          role: Role.ROLE_AGENT,
          parts,
          metadata: undefined,
          extensions: [],
          referenceTaskIds: [],
          ...extra,
        }),
      )
      eventBus.finished()
    }

    if (!question) {
      reply([textPart("I didn't catch a question in that. Ask me anything!")])
      return
    }

    const result = await runAgentLoop([
      ...getHistory(contextId),
      { role: 'user', content: question },
    ])
    appendTurn(contextId, question, result.raw)

    const metadata = { steps: result.steps }

    if (!clientSupportsCatalog(ctx)) {
      reply([textPart(componentsToText(result.components))], { metadata })
      return
    }

    if (ctx.context.requestedExtensions?.includes(A2UI_EXTENSION_URI)) {
      ctx.context.addActivatedExtension(A2UI_EXTENSION_URI)
    }

    reply([a2uiPart(buildMessages(messageId, result.components, result.suggestions))], {
      metadata,
      extensions: [A2UI_EXTENSION_URI],
    })
  }

  // Every answer is a single Message, so there is never a task to cancel
  async cancelTask(): Promise<void> {}
}

// ─── Parts ──────────────────────────────────────────────────────

function textPart(text: string): Part {
  return {
    content: { $case: 'text', value: text },
    metadata: undefined,
    filename: '',
    mediaType: 'text/plain',
  }
}

function a2uiPart(messages: unknown[]): Part {
  return {
    content: { $case: 'data', value: messages },
    metadata: { mimeType: A2UI_MIME_TYPE },
    filename: '',
    mediaType: A2UI_MIME_TYPE,
  }
}
