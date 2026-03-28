import { structureWithAI } from './structurer'
import type { KnowledgeNode } from '../types'

/**
 * Google Doc ingestion.
 *
 * Just write whatever you want in the doc — bullet points, paragraphs,
 * headings, stream of consciousness. Claude Haiku will parse and
 * structure it into knowledge nodes.
 *
 * Make the doc viewable via "Anyone with the link" for this to work.
 */

/**
 * Convert a Google Docs share URL to a plain text export URL.
 */
export function toExportUrl(shareUrl: string): string {
  const match = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error(`Could not extract doc ID from: ${shareUrl}`)
  return `https://docs.google.com/document/d/${match[1]}/export?format=txt`
}

/**
 * Fetch a Google Doc and have Claude Haiku structure it into knowledge nodes.
 */
export async function ingestGoogleDoc(
  shareUrl: string
): Promise<KnowledgeNode[]> {
  const exportUrl = toExportUrl(shareUrl)
  const res = await fetch(exportUrl)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Google Doc (${res.status}). Is the doc set to "Anyone with the link"?`
    )
  }

  const text = await res.text()
  console.log(`  Fetched ${text.length} chars from Google Doc`)
  return structureWithAI(text, 'gdoc')
}
