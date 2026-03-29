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

// ─── Category + keyword retrieval with graph traversal ──────────

// Maps common query terms to categories
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  work: ['work', 'job', 'toast', 'plume', 'intern', 'internship', 'career', 'company', 'role', 'swe', 'engineer'],
  technical: ['tech', 'stack', 'language', 'framework', 'skill', 'code', 'project', 'github', 'repo', 'build', 'built'],
  background: ['school', 'education', 'university', 'college', 'degree', 'uw', 'madison', 'gpa', 'course'],
  personal: ['hobby', 'interest', 'club', 'award', 'hackathon', 'cheesehacks', 'fun', 'free time', 'outside'],
  meta: ['contact', 'email', 'linkedin', 'social', 'reach', 'website'],
}

function inferCategories(query: string): string[] {
  const q = query.toLowerCase()
  const matched: string[] = []

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      matched.push(category)
    }
  }

  return matched
}

function formatNodes(nodes: KnowledgeNode[]): string {
  if (nodes.length === 0) {
    return '(No knowledge loaded yet. Run `npm run ingest` to populate.)'
  }

  return nodes.map((node) => {
    const heading = `[${node.key}] (${node.category})`
    const bullets = node.facts.map((f) => `- ${f}`).join('\n')
    return `${heading}\n${bullets}`
  }).join('\n\n')
}

/**
 * Retrieve relevant knowledge nodes for a query.
 *
 * 1. Infer categories from query keywords
 * 2. Score nodes by keyword hits in their facts
 * 3. Follow connections on top-scoring nodes to pull related context
 * 4. Fall back to full graph for broad questions
 */
export function queryGraph(query: string): string {
  const allNodes = loadGraph()

  if (allNodes.length === 0) {
    return formatNodes([])
  }

  const nodeMap = new Map(allNodes.map((n) => [n.key, n]))

  // Broad questions → return everything
  const broad = /tell me about (yourself|you)|who are you|what do you do|introduce|about ashwin/i
  if (broad.test(query)) {
    return formatNodes(allNodes)
  }

  // 1. Infer categories
  const categories = inferCategories(query)

  // 2. Score each node by keyword relevance
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
  const scored = allNodes.map((node) => {
    const text = [node.key, node.category, ...node.facts].join(' ').toLowerCase()
    let score = terms.reduce((s, t) => s + (text.includes(t) ? 1 : 0), 0)

    // Boost nodes whose category matched
    if (categories.includes(node.category)) score += 2

    return { node, score }
  })

  // 3. Take nodes that scored above threshold
  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)

  if (matched.length === 0) {
    return formatNodes(allNodes)
  }

  // 4. Follow connections from top results to pull related nodes
  const selected = new Map<string, KnowledgeNode>()
  const topKeys = matched.slice(0, 8)

  for (const { node } of topKeys) {
    selected.set(node.key, node)

    for (const connKey of node.connections ?? []) {
      const connected = nodeMap.get(connKey)
      if (connected) {
        selected.set(connected.key, connected)
      }
    }
  }

  return formatNodes([...selected.values()])
}
