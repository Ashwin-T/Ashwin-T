import type { Connector } from './types'
import { githubConnector } from './github'
import { linkedinConnector } from './linkedin'
import { resumeConnector } from './resume'
import { googleDocConnector } from './google-doc'
import {
  GITHUB_USERNAME,
  LINKEDIN_URL,
  LINKEDIN_EXPORT_DIR,
  RESUME_PDF_URL,
  GOOGLE_DOC_URL,
} from './config'

const connectors = new Map<string, Connector>()

function register(c: Connector) {
  connectors.set(c.name, c)
}

export function getAll(): Connector[] {
  return [...connectors.values()]
}

export async function execute(name: string, input: unknown): Promise<unknown> {
  const c = connectors.get(name)
  if (!c) throw new Error(`Unknown connector: ${name}`)
  return c.handler(input)
}

// Only register connectors whose env vars are configured
if (GITHUB_USERNAME) register(githubConnector)
if (LINKEDIN_URL || LINKEDIN_EXPORT_DIR) register(linkedinConnector)
if (RESUME_PDF_URL) register(resumeConnector)
if (GOOGLE_DOC_URL) register(googleDocConnector)

// Pre-populate cache so the first chat request isn't slow
export async function warmCache() {
  console.log('[connectors] Warming cache...')
  for (const c of connectors.values()) {
    try {
      await c.handler({})
      console.log(`  + ${c.name}`)
    } catch (e) {
      console.warn(`  x ${c.name}: ${e}`)
    }
  }
  console.log('[connectors] Cache warm.')
}
