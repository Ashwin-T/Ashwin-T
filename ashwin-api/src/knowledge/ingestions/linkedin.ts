import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { structureWithAI } from './structurer'
import type { KnowledgeNode } from '../types'

/**
 * LinkedIn ingestion — extracts everything possible from the public profile.
 *
 * Pulls from:
 * - JSON-LD structured data (richest source)
 * - All meta tags (og:, name=, property=)
 * - Page title
 * - Visible text content stripped from HTML
 *
 * Also supports LinkedIn data export (ZIP → CSVs) for maximum depth.
 */

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
  // Match content from any meta tag with content attribute
  const regex = /<meta[^>]*(?:name|property|itemprop)="([^"]*)"[^>]*content="([^"]*)"[^>]*>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const key = match[1]
    const value = match[2]
    if (value.length > 5) {
      results.push(`${key}: ${value}`)
    }
  }
  // Also match reversed order (content before name)
  const regex2 = /<meta[^>]*content="([^"]*)"[^>]*(?:name|property|itemprop)="([^"]*)"[^>]*>/gi
  while ((match = regex2.exec(html)) !== null) {
    const value = match[1]
    const key = match[2]
    if (value.length > 5) {
      results.push(`${key}: ${value}`)
    }
  }
  return [...new Set(results)] // dedupe
}

function extractTitle(html: string): string {
  const match = html.match(/<title>([^<]+)<\/title>/)
  return match ? match[1].trim() : ''
}

function extractVisibleText(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function extractInitialState(html: string): string[] {
  const results: string[] = []
  // LinkedIn embeds data in various script tags with initial state
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
        results.push(decoded.slice(0, 5000)) // cap size
      } catch {
        // skip
      }
    }
  }
  return results
}

// ─── Option A: Public profile ───────────────────────────────────

export async function ingestLinkedInProfile(
  profileUrl: string
): Promise<KnowledgeNode[]> {
  const res = await fetch(profileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })

  if (!res.ok) {
    throw new Error(`LinkedIn fetch failed (${res.status})`)
  }

  const html = await res.text()
  const parts: string[] = []

  // 1. Title
  const title = extractTitle(html)
  if (title) parts.push(`Page title: ${title}`)

  // 2. All meta tags
  const meta = extractAllMeta(html)
  if (meta.length > 0) {
    parts.push('--- Meta tags ---')
    parts.push(...meta)
  }

  // 3. JSON-LD structured data (often has the richest info)
  const jsonLd = extractJsonLd(html)
  if (jsonLd.length > 0) {
    parts.push('--- Structured data (JSON-LD) ---')
    parts.push(...jsonLd)
  }

  // 4. Embedded initial state
  const state = extractInitialState(html)
  if (state.length > 0) {
    parts.push('--- Embedded data ---')
    parts.push(...state)
  }

  // 5. Visible text (truncated — can be noisy)
  const visibleText = extractVisibleText(html)
  if (visibleText.length > 100) {
    parts.push('--- Visible page text ---')
    parts.push(visibleText.slice(0, 3000))
  }

  if (parts.length === 0) {
    throw new Error(
      'Could not extract any data from LinkedIn. Try the data export method (LINKEDIN_EXPORT_DIR).'
    )
  }

  const rawText = parts.join('\n')
  console.log(`  Extracted ${rawText.length} chars from LinkedIn profile`)
  console.log(`  Sources: title=${!!title}, meta=${meta.length}, jsonLd=${jsonLd.length}, state=${state.length}, text=${visibleText.length > 100}`)

  return structureWithAI(
    rawText,
    'linkedin',
    `Extract EVERYTHING about this person from the LinkedIn data: jobs (with titles, companies, dates, descriptions), education (school, degree, dates, activities), skills, certifications, volunteer work, awards, publications, languages, interests, recommendations, and any other details. Be thorough — capture every piece of information available.`
  )
}

// ─── Option B: LinkedIn data export ─────────────────────────────

export async function ingestLinkedInExport(
  exportDir: string
): Promise<KnowledgeNode[]> {
  const csvFiles = [
    'Profile.csv',
    'Positions.csv',
    'Education.csv',
    'Skills.csv',
    'Certifications.csv',
    'Languages.csv',
    'Honors.csv',
    'Organizations.csv',
    'Projects.csv',
    'Publications.csv',
    'Recommendations Given.csv',
    'Recommendations Received.csv',
    'Registration.csv',
    'Connections.csv',
    'Endorsement Received Info.csv',
  ]

  const parts: string[] = []

  for (const file of csvFiles) {
    const path = join(exportDir, file)
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8')
      parts.push(`--- ${file} ---\n${content}`)
    }
  }

  if (parts.length === 0) {
    throw new Error(`No LinkedIn CSVs found in ${exportDir}`)
  }

  const rawText = parts.join('\n\n')
  console.log(`  Read ${parts.length} CSV files (${rawText.length} chars)`)

  return structureWithAI(
    rawText,
    'linkedin',
    `Extract EVERYTHING from this LinkedIn data export: every job (title, company, dates, description), education (school, degree, field, dates, activities), all skills, certifications, volunteer roles, awards/honors, publications, projects, languages, organizations, and recommendations. Be exhaustive.`
  )
}
