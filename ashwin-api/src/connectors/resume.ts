import { extractText } from 'unpdf'
import type { Connector, KnowledgeNode } from './types'
import { get, set } from './cache'
import { structureWithAI } from './structurer'
import { RESUME_PDF_URL } from './config'

const CACHE_KEY = 'resume'
const TTL = 24 * 60 * 60_000 // 24 hours

async function ingest(pdfUrl: string): Promise<KnowledgeNode[]> {
  const res = await fetch(pdfUrl)
  if (!res.ok) throw new Error(`Failed to fetch resume PDF (${res.status})`)

  const buffer = new Uint8Array(await res.arrayBuffer())
  const { text: pages } = await extractText(buffer)
  const text = pages.join('\n')

  console.log(`  Extracted ${text.length} chars from PDF`)
  return structureWithAI(text, 'resume')
}

async function load(): Promise<KnowledgeNode[]> {
  const cached = get(CACHE_KEY)
  if (cached) return cached as KnowledgeNode[]

  const nodes = await ingest(RESUME_PDF_URL)
  set(CACHE_KEY, nodes, TTL)
  return nodes
}

export const resumeConnector: Connector = {
  name: 'resume',
  description: "Ashwin's resume — jobs, education, skills, and qualifications",
  schema: {
    type: 'object',
    properties: {
      section: {
        type: 'string',
        enum: ['work', 'technical', 'background', 'all'],
        description: 'filter by category',
      },
    },
  },
  handler: async (input: any = {}) => {
    const nodes = await load()
    const section = input?.section ?? 'all'
    return section === 'all' ? nodes : nodes.filter((n) => n.category === section)
  },
}
