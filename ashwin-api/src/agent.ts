import Anthropic from '@anthropic-ai/sdk'
import { getAll, execute } from './connectors/registry'
import { SYSTEM_PROMPT } from './prompt'
import {
  REPLY_SCHEMA,
  normalizeComponents,
  textComponents,
  type A2uiComponent,
} from './a2ui/catalog'

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOOL_ROUNDS = 5
// The connector every context starts with: Ashwin's own notes
const OPENING_TOOL = 'google_doc'
// A normal reply is a few hundred tokens. The cap only bounds cost: a reply
// that hits it is cut off mid-JSON and has to be repaired.
const MAX_TOKENS = 4096
const FALLBACK_TEXT = "Sorry, I couldn't come up with an answer. Try asking again!"
const REPAIR_PROMPT =
  'Your last reply could not be read. A reply must be a single valid JSON object matching the Response Format, with nothing before or after it. Send the same answer again as only that JSON object, and keep it short enough to finish.'

export interface AgentResult {
  components: A2uiComponent[]
  suggestions: string[]
  steps: string[]
  // The reply as clean JSON, kept as the assistant turn in the conversation history
  raw: string
}

type Reply = Omit<AgentResult, 'steps'>

// ─── Agentic loop ───────────────────────────────────────────────

export async function runAgentLoop(messages: Anthropic.MessageParam[]): Promise<AgentResult> {
  const client = new Anthropic()

  const tools: Anthropic.Tool[] = getAll().map((conn) => ({
    name: conn.name,
    description: conn.description,
    input_schema: conn.schema as Anthropic.Tool.InputSchema,
  }))

  // `answerNow` stops Claude from calling more tools, so the reply has to be the answer
  const ask = (messages: Anthropic.MessageParam[], answerNow = false) =>
    client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      ...(tools.length > 0 && { tools }),
      ...(tools.length > 0 && answerNow && { tool_choice: { type: 'none' as const } }),
      // The API holds the reply to the schema: always complete, valid JSON
      output_config: { format: { type: 'json_schema' as const, schema: REPLY_SCHEMA } },
      messages,
    })

  const steps: string[] = []
  let rounds = 0

  // Calls Claude and runs the tools it asks for, until it answers
  const converse = async (messages: Anthropic.MessageParam[]) => {
    let response = await ask(messages)

    while (response.stop_reason === 'tool_use' && rounds < MAX_TOOL_ROUNDS) {
      rounds++

      const toolCalls = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      )

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolCalls.map(async (call) => {
          try {
            const result = await execute(call.name, call.input)
            steps.push(call.name)
            return {
              type: 'tool_result' as const,
              tool_use_id: call.id,
              content: toolContent(result),
            }
          } catch (e) {
            steps.push(`${call.name}:error`)
            return {
              type: 'tool_result' as const,
              tool_use_id: call.id,
              content: `Error: ${e instanceof Error ? e.message : String(e)}`,
              is_error: true as const,
            }
          }
        }),
      )

      messages = [
        ...messages,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults },
      ]

      response = await ask(messages)
    }

    // Out of tool rounds and still asking for more: answer from what's been gathered
    if (response.stop_reason === 'tool_use') {
      response = await ask(messages, true)
    }

    return { response, messages }
  }

  const first = await converse(await withOpeningCall(messages, steps))
  let reply = parseReply(first.response)

  // The schema can't cover a reply cut off by max_tokens or a refusal. Those
  // never go to the visitor: Claude gets one chance to send it again, then the
  // visitor gets the fallback
  if (!reply) {
    const said = replyText(first.response)
    console.warn(
      `[agent] Unreadable reply (stop_reason: ${first.response.stop_reason}), asking for a repair:
${said.slice(0, 200)}`,
    )
    steps.push('repair')

    const second = await converse([
      ...first.messages,
      ...(said ? [{ role: 'assistant' as const, content: said }] : []),
      { role: 'user', content: REPAIR_PROMPT },
    ])
    reply = parseReply(second.response)

    if (!reply) {
      console.error(
        `[agent] Repair failed, sending fallback:
${replyText(second.response).slice(0, 200)}`,
      )
      steps.push('repair:error')
    }
  }

  return { ...(reply ?? toReply(textComponents(FALLBACK_TEXT), [])), steps }
}

// Tools return either their source text or structured data
function toolContent(result: unknown): string {
  return typeof result === 'string' ? result : JSON.stringify(result)
}

// ─── Opening tool call ──────────────────────────────────────────

/**
 * Starts the context with a call to the opening tool, placed right after the
 * first message as if Claude had made it, so its result is in view for the
 * whole conversation before Claude decides what else to look up.
 */
async function withOpeningCall(
  messages: Anthropic.MessageParam[],
  steps: string[],
): Promise<Anthropic.MessageParam[]> {
  if (!getAll().some((conn) => conn.name === OPENING_TOOL)) return messages

  let result: unknown
  try {
    result = await execute(OPENING_TOOL, {})
  } catch (e) {
    // Carry on without it. Claude can still try the tool itself
    console.warn(`[agent] Opening ${OPENING_TOOL} call failed: ${e}`)
    steps.push(`${OPENING_TOOL}:error`)
    return messages
  }
  steps.push(OPENING_TOOL)

  const id = `opening_${OPENING_TOOL}`
  const [firstMessage, ...rest] = messages
  return [
    firstMessage,
    { role: 'assistant', content: [{ type: 'tool_use', id, name: OPENING_TOOL, input: {} }] },
    {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: id, content: toolContent(result) }],
    },
    ...rest,
  ]
}

// ─── Reading the reply ──────────────────────────────────────────

function replyText(response: Anthropic.Message): string {
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

/**
 * Finds the JSON object in Claude's reply, tolerating markdown fences or stray
 * text around it. Returns undefined when there is no complete object.
 */
function extractJson(text: string): Record<string, unknown> | undefined {
  const end = text.lastIndexOf('}')

  // Try each "{" as the start. The first one that parses to an object wins
  for (
    let start = text.indexOf('{');
    start !== -1 && start < end;
    start = text.indexOf('{', start + 1)
  ) {
    try {
      const value = JSON.parse(text.slice(start, end + 1))
      if (value && typeof value === 'object' && !Array.isArray(value)) return value
    } catch {
      // Not valid from here, keep looking
    }
  }
  return undefined
}

function isJson(text: string): boolean {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}

function toReply(components: A2uiComponent[], suggestions: string[]): Reply {
  return { components, suggestions, raw: JSON.stringify({ components, suggestions }) }
}

/**
 * Turns Claude's reply into validated components, or undefined when the reply
 * can't be trusted: cut off, malformed JSON, or JSON with nothing renderable.
 */
export function parseReply(response: Anthropic.Message): Reply | undefined {
  const text = replyText(response)
  const parsed = extractJson(text)

  if (!parsed) {
    // Plain prose with no JSON in it is still a complete answer
    const isProse =
      text.length > 0 && !/[{}]/.test(text) && !isJson(text) && response.stop_reason !== 'max_tokens'
    return isProse ? toReply(textComponents(text), []) : undefined
  }

  const components = normalizeComponents(parsed.components)
  if (components.length === 0) return undefined

  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions.filter((s): s is string => typeof s === 'string' && s.length > 0)
    : []

  return toReply(components, suggestions)
}
