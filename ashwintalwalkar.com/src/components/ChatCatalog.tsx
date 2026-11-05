import { Fragment, type ReactNode } from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { Catalog, CommonSchemas } from '@a2ui/web_core/v0_9'
import { z } from 'zod'
import styles from './ChatCatalog.module.css'

/**
 * The A2UI catalog the agent builds its replies from. The agent (ashwin-api)
 * knows the same catalog id and component names, so a change here has to be
 * mirrored in its src/a2ui/catalog.ts and src/prompt.ts.
 */
export const CATALOG_ID = 'https://ashwintalwalkar.com/a2ui/chat/v1/catalog.json'

// ─── Inline formatting ──────────────────────────────────────────

// The agent's text is untrusted: only ever link out to the web or to mail.
const SAFE_HREF = /^(https?:|mailto:)/i

// Renders **bold**, `code`, and [text](url). Everything else stays plain text.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))

    if (match[1]) {
      nodes.push(<strong key={match.index}>{match[1]}</strong>)
    } else if (match[2]) {
      nodes.push(<code key={match.index}>{match[2]}</code>)
    } else if (SAFE_HREF.test(match[4])) {
      nodes.push(
        <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>,
      )
    } else {
      nodes.push(match[3])
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

// ─── Layout ─────────────────────────────────────────────────────

type ChildRef = string | { id: string; basePath: string }

function renderChildren(
  children: ChildRef[],
  buildChild: (id: string, basePath?: string) => ReactNode,
) {
  return children.map((child) =>
    typeof child === 'string' ? (
      <Fragment key={child}>{buildChild(child)}</Fragment>
    ) : (
      <Fragment key={`${child.basePath}/${child.id}`}>
        {buildChild(child.id, child.basePath)}
      </Fragment>
    ),
  )
}

const Column = createComponentImplementation(
  { name: 'Column', schema: z.object({ children: CommonSchemas.ChildList }) },
  ({ props, buildChild }) => (
    <div className={styles.column}>{renderChildren(props.children, buildChild)}</div>
  ),
)

const Row = createComponentImplementation(
  { name: 'Row', schema: z.object({ children: CommonSchemas.ChildList }) },
  ({ props, buildChild }) => (
    <div className={styles.row}>{renderChildren(props.children, buildChild)}</div>
  ),
)

// ─── Content ────────────────────────────────────────────────────

const Text = createComponentImplementation(
  { name: 'Text', schema: z.object({ text: CommonSchemas.DynamicString }) },
  ({ props }) => (
    <p className={styles.text}>{renderInline(props.text ?? '')}</p>
  ),
)

const ItemList = createComponentImplementation(
  {
    name: 'ItemList',
    schema: z.object({
      items: CommonSchemas.DynamicStringList,
      ordered: z.boolean().optional(),
    }),
  },
  ({ props }) => {
    const Tag = props.ordered ? 'ol' : 'ul'
    return (
      <Tag className={styles.list}>
        {(props.items ?? []).map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    )
  },
)

const Card = createComponentImplementation(
  {
    name: 'Card',
    schema: z.object({
      title: CommonSchemas.DynamicString,
      subtitle: CommonSchemas.DynamicString.optional(),
      description: CommonSchemas.DynamicString.optional(),
      link: CommonSchemas.DynamicString.optional(),
    }),
  },
  ({ props }) => {
    const body = (
      <>
        <span className={styles.cardTitle}>{props.title}</span>
        {props.subtitle && <span className={styles.cardSubtitle}>{props.subtitle}</span>}
        {props.description && <span className={styles.cardDescription}>{props.description}</span>}
      </>
    )

    return props.link && SAFE_HREF.test(props.link) ? (
      <a
        className={`${styles.card} ${styles.cardLink}`}
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    ) : (
      <div className={styles.card}>{body}</div>
    )
  },
)

const CodeBlock = createComponentImplementation(
  {
    name: 'CodeBlock',
    schema: z.object({
      code: CommonSchemas.DynamicString,
      language: CommonSchemas.DynamicString.optional(),
    }),
  },
  ({ props }) => (
    <div className={styles.code}>
      {props.language && <span className={styles.codeLanguage}>{props.language}</span>}
      <pre>
        <code>{props.code}</code>
      </pre>
    </div>
  ),
)

// ─── Input ──────────────────────────────────────────────────────

// A follow-up question. Clicking it sends its action back to the agent.
const SuggestionChip = createComponentImplementation(
  {
    name: 'SuggestionChip',
    schema: z.object({ label: CommonSchemas.DynamicString, action: CommonSchemas.Action }),
  },
  ({ props }) => (
    <button type="button" className={styles.chip} onClick={() => props.action()}>
      {props.label}
    </button>
  ),
)

export const chatCatalog = new Catalog(CATALOG_ID, 'v0.9', [
  Column,
  Row,
  Text,
  ItemList,
  Card,
  CodeBlock,
  SuggestionChip,
])
