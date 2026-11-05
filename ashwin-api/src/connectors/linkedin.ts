import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Connector } from './types'
import { cached } from './cache'
import { LINKEDIN_URL, LINKEDIN_EXPORT_DIR } from './config'

const CACHE_KEY = 'linkedin'
const TTL = 24 * 60 * 60_000 // 24 hours

// ─── HTML helpers ───────────────────────────────────────────────

function extractJsonLd(html: string): string[] {
  const results: string[] = []
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1])
      results.push(JSON.stringify(data, null, 2))
    } catch {
      // malformed JSON-LD, skip
    }
  }
  return results
}

function extractAllMeta(html: string): string[] {
  const results: string[] = []
  const regex = /<meta[^>]*(?:name|property|itemprop)="([^"]*)"[^>]*content="([^"]*)"[^>]*>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const key = match[1]
    const value = match[2]
    if (value.length > 5) results.push(`${key}: ${value}`)
  }
  const regex2 = /<meta[^>]*content="([^"]*)"[^>]*(?:name|property|itemprop)="([^"]*)"[^>]*>/gi
  while ((match = regex2.exec(html)) !== null) {
    const value = match[1]
    const key = match[2]
    if (value.length > 5) results.push(`${key}: ${value}`)
  }
  return [...new Set(results)]
}

function extractTitle(html: string): string {
  const match = html.match(/<title>([^<]+)<\/title>/)
  return match ? match[1].trim() : ''
}

function extractVisibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractInitialState(html: string): string[] {
  const results: string[] = []
  const patterns = [
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/,
    /data-state="([^"]+)"/,
    /<code[^>]*id="bpr-guid[^"]*"[^>]*><!--([\s\S]*?)--><\/code>/g,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      try {
        const decoded = match[1]
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
        results.push(decoded.slice(0, 5000))
      } catch {
        // skip
      }
    }
  }
  return results
}

// ─── Ingestion: public profile ──────────────────────────────────

async function ingestProfile(profileUrl: string): Promise<string> {
  const res = await fetch(profileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!res.ok) throw new Error(`LinkedIn fetch failed (${res.status})`)

  const html = await res.text()
  const parts: string[] = []

  const title = extractTitle(html)
  if (title) parts.push(`Page title: ${title}`)

  const meta = extractAllMeta(html)
  if (meta.length > 0) {
    parts.push('--- Meta tags ---')
    parts.push(...meta)
  }

  const jsonLd = extractJsonLd(html)
  if (jsonLd.length > 0) {
    parts.push('--- Structured data (JSON-LD) ---')
    parts.push(...jsonLd)
  }

  const state = extractInitialState(html)
  if (state.length > 0) {
    parts.push('--- Embedded data ---')
    parts.push(...state)
  }

  const visibleText = extractVisibleText(html)
  if (visibleText.length > 100) {
    parts.push('--- Visible page text ---')
    parts.push(visibleText.slice(0, 3000))
  }

  if (parts.length === 0) {
    throw new Error('Could not extract any data from LinkedIn. Try the data export method (LINKEDIN_EXPORT_DIR).')
  }

  const rawText = parts.join('\n')
  console.log(`  Extracted ${rawText.length} chars from LinkedIn profile`)
  return rawText
}

// ─── Ingestion: data export ─────────────────────────────────────

async function ingestExport(exportDir: string): Promise<string> {
  const csvFiles = [
    'Profile.csv', 'Positions.csv', 'Education.csv', 'Skills.csv',
    'Certifications.csv', 'Languages.csv', 'Honors.csv',
    'Organizations.csv', 'Projects.csv', 'Publications.csv',
    'Recommendations Given.csv', 'Recommendations Received.csv',
    'Registration.csv', 'Endorsement Received Info.csv',
  ]

  const parts: string[] = []
  for (const file of csvFiles) {
    const path = join(exportDir, file)
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8')
      parts.push(`--- ${file} ---\n${content}`)
    }
  }

  if (parts.length === 0) throw new Error(`No LinkedIn CSVs found in ${exportDir}`)

  const rawText = parts.join('\n\n')
  console.log(`  Read ${parts.length} CSV files (${rawText.length} chars)`)
  return rawText
}

// ─── Connector ──────────────────────────────────────────────────

export const linkedinConnector: Connector = {
  name: 'linkedin',
  description: "Ashwin's work history, education, skills, awards, volunteer roles, and clubs from LinkedIn",
  schema: {
    type: 'object',
    properties: {},
  },
  handler: () =>
    cached(CACHE_KEY, TTL, () =>
      LINKEDIN_EXPORT_DIR ? ingestExport(LINKEDIN_EXPORT_DIR) : ingestProfile(LINKEDIN_URL),
    ),
}
