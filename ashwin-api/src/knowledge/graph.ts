import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { KnowledgeNode } from './types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const NODES_DIR = join(__dirname, 'nodes')

/**
 * Load all knowledge nodes from JSON files in the nodes/ directory.
 */
export function loadGraph(): KnowledgeNode[] {
  if (!existsSync(NODES_DIR)) return []

  const files = readdirSync(NODES_DIR).filter((f) => f.endsWith('.json'))
  const nodes: KnowledgeNode[] = []

  for (const file of files) {
    const raw = readFileSync(join(NODES_DIR, file), 'utf-8')
    const data = JSON.parse(raw)

    // A file can contain a single node or an array of nodes
    if (Array.isArray(data)) {
      nodes.push(...data)
    } else {
      nodes.push(data)
    }
  }

  return nodes
}

/**
 * Flatten all nodes into a context string for the system prompt.
 */
export function flattenGraph(): string {
  const nodes = loadGraph()

  if (nodes.length === 0) {
    return '(No knowledge loaded yet. Run `npm run ingest` to populate.)'
  }

  const sections = nodes.map((node) => {
    const heading = `[${node.key}] (${node.category})`
    const bullets = node.facts.map((f) => `- ${f}`).join('\n')
    return `${heading}\n${bullets}`
  })

  return sections.join('\n\n')
}
