import { Hono } from 'hono'
import { stream } from 'hono/streaming'
import {
  A2A_VERSION_HEADER,
  AGENT_CARD_PATH,
  Extensions,
  HTTP_EXTENSION_HEADER,
  SSE_HEADERS,
  formatSSEErrorEvent,
  formatSSEEvent,
} from '@a2a-js/sdk'
import {
  DefaultRequestHandler,
  InMemoryTaskStore,
  JsonRpcTransportHandler,
  UnauthenticatedUser,
  defaultServerCallContextBuilder,
  validateVersion,
} from '@a2a-js/sdk/server'
import { A2A_PATH, PUBLIC_URL, buildAgentCard } from './agent-card'
import { AshwinAgentExecutor } from './executor'

const agentCard = buildAgentCard()
const requestHandler = new DefaultRequestHandler(
  agentCard,
  new InMemoryTaskStore(),
  new AshwinAgentExecutor(),
)
const jsonRpc = new JsonRpcTransportHandler(requestHandler)

// The pre-1.0 name of the extensions header, still sent by some A2UI clients
const LEGACY_EXTENSION_HEADER = 'X-A2A-Extensions'

// JSON-RPC "Internal error"
const INTERNAL_ERROR = -32603

function errorResponse(id: unknown, error: unknown) {
  return {
    jsonrpc: '2.0',
    id: typeof id === 'string' || typeof id === 'number' ? id : null,
    error: JsonRpcTransportHandler.mapToJSONRPCError(error),
  }
}

export const a2a = new Hono()

// ─── Agent card ─────────────────────────────────────────────────

a2a.get(`/${AGENT_CARD_PATH}`, (c) => {
  c.header('Cache-Control', 'public, max-age=3600')
  if (PUBLIC_URL) return c.json(agentCard)

  // No PUBLIC_URL configured — advertise the origin this request came in on
  const url = new URL(c.req.url)
  const proto = c.req.header('x-forwarded-proto')?.split(',')[0].trim() || url.protocol.replace(':', '')
  const host = c.req.header('x-forwarded-host') || c.req.header('host') || url.host
  return c.json(buildAgentCard(`${proto}://${host}`))
})

// ─── JSON-RPC ───────────────────────────────────────────────────

a2a.post(A2A_PATH, async (c) => {
  const raw = await c.req.text()
  let body: string | Record<string, unknown> = raw
  try {
    body = JSON.parse(raw)
  } catch {
    // Left as a string: jsonRpc.handle reports the parse error
  }
  const id = typeof body === 'object' ? body?.id : null

  try {
    const context = defaultServerCallContextBuilder({
      extensions: Extensions.parseServiceParameter(
        c.req.header(HTTP_EXTENSION_HEADER) ?? c.req.header(LEGACY_EXTENSION_HEADER),
      ),
      user: new UnauthenticatedUser(),
      headers: c.req.header(),
      requestedVersion: c.req.header(A2A_VERSION_HEADER) || undefined,
    })
    validateVersion(context.requestedVersion, agentCard, 'JSONRPC')

    const result = await jsonRpc.handle(body, context)

    if (!(Symbol.asyncIterator in result)) {
      if (context.activatedExtensions) {
        c.header(HTTP_EXTENSION_HEADER, Extensions.toServiceParameter(context.activatedExtensions))
      }
      return c.json(result)
    }

    // Streaming method: pull the first event before committing to SSE, so an
    // immediate failure can still be returned as a plain JSON-RPC error
    const events = result[Symbol.asyncIterator]()
    const first = await events.next()

    if (context.activatedExtensions) {
      c.header(HTTP_EXTENSION_HEADER, Extensions.toServiceParameter(context.activatedExtensions))
    }
    for (const [name, value] of Object.entries(SSE_HEADERS)) c.header(name, value)

    return stream(c, async (sse) => {
      try {
        for (let next = first; !next.done; next = await events.next()) {
          await sse.write(formatSSEEvent(next.value))
        }
      } catch (e) {
        console.error('[a2a] Error during SSE streaming:', e)
        await sse.write(formatSSEErrorEvent(errorResponse(id, e)))
      }
    })
  } catch (e) {
    const response = errorResponse(id, e)
    // Protocol errors (bad version, bad params) are the client's; only log ours
    if (response.error.code === INTERNAL_ERROR) {
      console.error('[a2a] Error handling JSON-RPC request:', e)
    }
    return c.json(response, response.error.code === INTERNAL_ERROR ? 500 : 200)
  }
})
