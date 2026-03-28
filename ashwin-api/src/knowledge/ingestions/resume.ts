import { extractText } from 'unpdf'
import { structureWithAI } from './structurer'
import type { KnowledgeNode } from '../types'

/**
 * Resume PDF ingestion.
 * Fetches a PDF from a URL, extracts raw text, and sends it to
 * Claude Haiku for structuring into knowledge nodes.
 */
export async function ingestResume(pdfUrl: string): Promise<KnowledgeNode[]> {
  const res = await fetch(pdfUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch resume PDF (${res.status})`)
  }

  const buffer = new Uint8Array(await res.arrayBuffer())
  const { text: pages } = await extractText(buffer)
  const text = pages.join('\n')

  console.log(`  Extracted ${text.length} chars from PDF`)
  return structureWithAI(text, 'resume')
}
