import { extractText } from 'unpdf'
import type { Connector } from './types'
import { cached } from './cache'
import { RESUME_PDF_URL } from './config'

const CACHE_KEY = 'resume'
const TTL = 24 * 60 * 60_000 // 24 hours

async function fetchResume(pdfUrl: string): Promise<string> {
  const res = await fetch(pdfUrl)
  if (!res.ok) throw new Error(`Failed to fetch resume PDF (${res.status})`)

  const buffer = new Uint8Array(await res.arrayBuffer())
  const { text: pages } = await extractText(buffer)
  const text = pages.join('\n').trim()

  console.log(`  Extracted ${text.length} chars from PDF`)

  // Throwing keeps an empty result out of the cache, so the next call retries
  if (!text) throw new Error('Resume PDF has no extractable text')
  return text
}

export const resumeConnector: Connector = {
  name: 'resume',
  description: "Ashwin's resume — jobs with dates, education with GPA and honors, skills, and projects",
  schema: {
    type: 'object',
    properties: {},
  },
  handler: () => cached(CACHE_KEY, TTL, () => fetchResume(RESUME_PDF_URL)),
}
