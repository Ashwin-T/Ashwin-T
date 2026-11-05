import type { Connector } from './types'
import { cached } from './cache'
import { GOOGLE_DOC_URL } from './config'

const CACHE_KEY = 'google-doc'
const TTL = 12 * 60 * 60_000 // 12 hours

function toExportUrl(shareUrl: string): string {
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error(`Could not extract doc ID from: ${shareUrl}`)
  return `https://docs.google.com/document/d/${match[1]}/export?format=txt`
}

async function fetchDoc(shareUrl: string): Promise<string> {
  const exportUrl = toExportUrl(shareUrl)
  const res = await fetch(exportUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch Google Doc (${res.status}). Is the doc set to "Anyone with the link"?`)
  }

  const text = (await res.text()).trim()
  console.log(`  Fetched ${text.length} chars from Google Doc`)

  // Throwing keeps an empty doc out of the cache, so the next call retries
  if (!text) throw new Error('Google Doc came back empty')
  return text
}

export const googleDocConnector: Connector = {
  name: 'google_doc',
  description: "Ashwin's personal notes — hobbies, interests, personal details, and anything he's written about himself",
  schema: {
    type: 'object',
    properties: {},
  },
  handler: () => cached(CACHE_KEY, TTL, () => fetchDoc(GOOGLE_DOC_URL)),
}
