import type { Connector, KnowledgeNode } from './types'
import { get, set } from './cache'
import { structureWithAI } from './structurer'
import { GOOGLE_DOC_URL } from './config'

const CACHE_KEY = 'google-doc'
const TTL = 12 * 60 * 60_000 // 12 hours

function toExportUrl(shareUrl: string): string {
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error(`Could not extract doc ID from: ${shareUrl}`)
  return `https://docs.google.com/document/d/${match[1]}/export?format=txt`
}

async function ingest(shareUrl: string): Promise<KnowledgeNode[]> {
  const exportUrl = toExportUrl(shareUrl)
  const res = await fetch(exportUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch Google Doc (${res.status}). Is the doc set to "Anyone with the link"?`)
  }

  const text = await res.text()
  console.log(`  Fetched ${text.length} chars from Google Doc`)
  return structureWithAI(text, 'gdoc')
}

async function load(): Promise<KnowledgeNode[]> {
  const cached = get(CACHE_KEY)
  if (cached) return cached as KnowledgeNode[]

  const nodes = await ingest(GOOGLE_DOC_URL)
  set(CACHE_KEY, nodes, TTL)
  return nodes
}

export const googleDocConnector: Connector = {
  name: 'google_doc',
  description: "Ashwin's personal notes — hobbies, interests, personal details, and anything he's written about himself",
  schema: {
    type: 'object',
    properties: {},
  },
  handler: async () => load(),
}
