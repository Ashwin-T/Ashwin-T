// A2UI v0.9 — the chat catalog shared with the ashwintalwalkar.com renderer.
// The frontend registers a catalog with the same id and component names.

export const A2UI_VERSION = 'v0.9'
export const A2UI_EXTENSION_URI = 'https://a2ui.org/a2a-extension/a2ui/v0.9'
export const A2UI_MIME_TYPE = 'application/a2ui+json'
export const CATALOG_ID = 'https://ashwintalwalkar.com/a2ui/chat/v1/catalog.json'

// Name of the action a SuggestionChip sends back when clicked
export const ASK_ACTION = 'ask'

export interface A2uiComponent {
  id: string
  component: string
  [prop: string]: unknown
}

export type A2uiMessage = { version: typeof A2UI_VERSION } & Record<string, unknown>

// ─── Validation ─────────────────────────────────────────────────

const isString = (v: unknown): v is string => typeof v === 'string' && v.length > 0
const isOptionalString = (v: unknown) => v === undefined || typeof v === 'string'

// Content components Claude may generate, with a check for their props
const CONTENT_COMPONENTS: Record<string, (c: A2uiComponent) => boolean> = {
  Text: (c) => isString(c.text),
  ItemList: (c) => Array.isArray(c.items) && c.items.length > 0 && c.items.every(isString),
  Card: (c) =>
    isString(c.title) &&
    isOptionalString(c.subtitle) &&
    isOptionalString(c.description) &&
    isOptionalString(c.link),
  CodeBlock: (c) => isString(c.code) && isOptionalString(c.language),
}

// ─── Reply schema ───────────────────────────────────────────────

const string = { type: 'string' }

function component(name: string, props: Record<string, unknown>, required: string[]) {
  return {
    type: 'object',
    properties: { id: string, component: { const: name }, ...props },
    required: ['id', 'component', ...required],
    additionalProperties: false,
  }
}

/**
 * JSON Schema for Claude's reply, enforced by the API (structured outputs), so
 * the reply is always complete, parseable JSON built from catalog components.
 * What a schema can't express (unique ids, children that exist) is still
 * checked by normalizeComponents below.
 */
export const REPLY_SCHEMA = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: {
        anyOf: [
          component('Column', { children: { type: 'array', items: string } }, ['children']),
          component('Text', { text: string }, ['text']),
          component(
            'ItemList',
            { items: { type: 'array', items: string }, ordered: { type: 'boolean' } },
            ['items'],
          ),
          component(
            'Card',
            { title: string, subtitle: string, description: string, link: string },
            ['title'],
          ),
          component('CodeBlock', { code: string, language: string }, ['code']),
        ],
      },
    },
    suggestions: { type: 'array', items: string },
  },
  required: ['components'],
  additionalProperties: false,
}

/**
 * Turns Claude's component list into one the renderer is guaranteed to accept:
 * drops anything that isn't in the catalog and rebuilds the root Column so it
 * only references components that exist.
 */
export function normalizeComponents(raw: unknown): A2uiComponent[] {
  if (!Array.isArray(raw)) return []

  const content = new Map<string, A2uiComponent>()
  let rootChildren: string[] | undefined

  for (const c of raw) {
    if (!c || typeof c !== 'object' || !isString(c.id)) continue

    if (c.id === 'root') {
      if (Array.isArray(c.children)) rootChildren = c.children.filter(isString)
      continue
    }

    const isValid = CONTENT_COMPONENTS[c.component]
    if (isValid?.(c) && !content.has(c.id)) content.set(c.id, c)
  }

  if (content.size === 0) return []

  // Keep Claude's ordering, then append anything it forgot to reference
  const ordered = [...new Set(rootChildren ?? [])].filter((id) => content.has(id))
  for (const id of content.keys()) {
    if (!ordered.includes(id)) ordered.push(id)
  }

  return [
    { id: 'root', component: 'Column', children: ordered },
    ...ordered.map((id) => content.get(id)!),
  ]
}

export function textComponents(text: string): A2uiComponent[] {
  return [
    { id: 'root', component: 'Column', children: ['text'] },
    { id: 'text', component: 'Text', text },
  ]
}

// ─── Messages ───────────────────────────────────────────────────

function surfaceMessages(surfaceId: string, components: A2uiComponent[]): A2uiMessage[] {
  return [
    { version: A2UI_VERSION, createSurface: { surfaceId, catalogId: CATALOG_ID } },
    { version: A2UI_VERSION, updateComponents: { surfaceId, components } },
  ]
}

export function answerSurfaceId(turnId: string) {
  return `answer-${turnId}`
}

export function suggestionsSurfaceId(turnId: string) {
  return `suggestions-${turnId}`
}

/** One surface for the answer, plus one for the follow-up suggestions if any. */
export function buildMessages(
  turnId: string,
  components: A2uiComponent[],
  suggestions: string[],
): A2uiMessage[] {
  const messages = surfaceMessages(answerSurfaceId(turnId), components)
  if (suggestions.length === 0) return messages

  const chips: A2uiComponent[] = suggestions.map((question, i) => ({
    id: `suggestion-${i}`,
    component: 'SuggestionChip',
    label: question,
    action: { event: { name: ASK_ACTION, context: { question } } },
  }))

  return [
    ...messages,
    ...surfaceMessages(suggestionsSurfaceId(turnId), [
      { id: 'root', component: 'Row', children: chips.map((c) => c.id) },
      ...chips,
    ]),
  ]
}

// ─── Plain text ─────────────────────────────────────────────────

/** Markdown rendering of an answer, for A2A clients that don't speak A2UI. */
export function componentsToText(components: A2uiComponent[]): string {
  return components
    .map((c) => {
      switch (c.component) {
        case 'Text':
          return c.text as string
        case 'ItemList':
          return (c.items as string[])
            .map((item, i) => (c.ordered === true ? `${i + 1}. ${item}` : `- ${item}`))
            .join('\n')
        case 'Card': {
          const heading = c.subtitle ? `**${c.title}** (${c.subtitle})` : `**${c.title}**`
          return [heading, c.description, c.link].filter(Boolean).join('\n')
        }
        case 'CodeBlock':
          return `\`\`\`${c.language ?? ''}\n${c.code}\n\`\`\``
        default:
          return ''
      }
    })
    .filter(Boolean)
    .join('\n\n')
}
