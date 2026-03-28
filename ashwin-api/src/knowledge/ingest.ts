/**
 * CLI script: fetches all sources and writes JSON node files.
 *
 * Usage: npm run ingest
 * Env vars: GOOGLE_DOC_URL, RESUME_PDF_URL, LINKEDIN_URL, LINKEDIN_EXPORT_DIR
 */

import 'dotenv/config'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ingestGoogleDoc } from './ingestions/google-doc'
import { ingestGitHub } from './ingestions/github'
import { ingestResume } from './ingestions/resume'
import {
  ingestLinkedInProfile,
  ingestLinkedInExport,
} from './ingestions/linkedin'
import {
  GOOGLE_DOC_URL,
  GITHUB_USERNAME,
  RESUME_PDF_URL,
  LINKEDIN_URL,
  LINKEDIN_EXPORT_DIR,
} from './config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const NODES_DIR = join(__dirname, 'nodes')

mkdirSync(NODES_DIR, { recursive: true })

function writeNodes(filename: string, data: unknown) {
  const path = join(NODES_DIR, filename)
  writeFileSync(path, JSON.stringify(data, null, 2))
  console.log(`  ✓ ${filename}`)
}

async function main() {
  console.log('Ingesting knowledge...\n')

  // Google Doc
  if (GOOGLE_DOC_URL) {
    try {
      console.log('📄 Google Doc')
      const nodes = await ingestGoogleDoc(GOOGLE_DOC_URL)
      writeNodes('google-doc.json', nodes)
      console.log(`  ${nodes.length} nodes ingested\n`)
    } catch (e) {
      console.error(`  ✗ Google Doc failed: ${e}\n`)
    }
  } else {
    console.log('📄 Google Doc — skipped (no GOOGLE_DOC_URL)\n')
  }

  // GitHub
  if (GITHUB_USERNAME) {
    try {
      console.log('🐙 GitHub')
      const nodes = await ingestGitHub(GITHUB_USERNAME)
      writeNodes('github.json', nodes)
      console.log(`  ${nodes.length} nodes ingested\n`)
    } catch (e) {
      console.error(`  ✗ GitHub failed: ${e}\n`)
    }
  }

  // Resume PDF
  if (RESUME_PDF_URL) {
    try {
      console.log('📋 Resume PDF')
      const nodes = await ingestResume(RESUME_PDF_URL)
      writeNodes('resume.json', nodes)
      console.log(`  ${nodes.length} nodes ingested\n`)
    } catch (e) {
      console.error(`  ✗ Resume failed: ${e}\n`)
    }
  } else {
    console.log('📋 Resume PDF — skipped (no RESUME_PDF_URL)\n')
  }

  // LinkedIn
  if (LINKEDIN_EXPORT_DIR) {
    try {
      console.log('💼 LinkedIn (data export)')
      const nodes = await ingestLinkedInExport(LINKEDIN_EXPORT_DIR)
      writeNodes('linkedin.json', nodes)
      console.log(`  ${nodes.length} nodes ingested\n`)
    } catch (e) {
      console.error(`  ✗ LinkedIn export failed: ${e}\n`)
    }
  } else if (LINKEDIN_URL) {
    try {
      console.log('💼 LinkedIn (public profile)')
      const nodes = await ingestLinkedInProfile(LINKEDIN_URL)
      writeNodes('linkedin.json', nodes)
      console.log(`  ${nodes.length} nodes ingested\n`)
    } catch (e) {
      console.error(`  ✗ LinkedIn failed: ${e}\n`)
    }
  } else {
    console.log('💼 LinkedIn — skipped (no LINKEDIN_URL or LINKEDIN_EXPORT_DIR)\n')
  }

  console.log('Done! Knowledge nodes written to src/knowledge/nodes/')
}

main()
