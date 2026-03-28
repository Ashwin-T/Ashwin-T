import Anthropic from '@anthropic-ai/sdk'
import type { KnowledgeNode } from '../types'

/**
 * Universal AI structurer — takes any raw text dump and has Claude Haiku
 * parse it into structured knowledge nodes.
 *
 * Every ingestor just needs to produce raw text + a source label.
 * This does the rest.
 */

let _client: Anthropic
function getClient() {
  if (!_client) _client = new Anthropic()
  return _client
}

const STRUCTURE_PROMPT = `You are a knowledge graph parser. Given raw text from a data source about a person, extract structured knowledge nodes.

Return ONLY a valid JSON array of nodes. No markdown fences, no explanation.

Each node must have this shape:
{
  "key": "short_snake_case_key",
  "category": "personal" | "work" | "technical" | "background" | "meta",
  "facts": ["fact 1", "fact 2"],
  "connections": ["related_key_1"]
}

Rules:
- Create logical groupings (e.g. separate nodes for each job, each project, education, skills, etc.)
- Each fact should be a complete, standalone sentence
- Be specific — include dates, company names, technologies, details
- Don't fabricate — only extract what's in the raw text
- Keep facts concise but informative
- Use descriptive keys like "toast_swe" not just "job1"
- Connections should reference other node keys you create`

export async function structureWithAI(
  rawText: string,
  sourceLabel: string,
  extraInstruction?: string
): Promise<KnowledgeNode[]> {
  const system = extraInstruction
    ? `${STRUCTURE_PROMPT}\n\nAdditional instructions:\n${extraInstruction}`
    : STRUCTURE_PROMPT

  const response = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system,
    messages: [
      {
        role: 'user',
        content: `Source: ${sourceLabel}\n\nRaw text:\n${rawText}`,
      },
    ],
  })

  let text = response.content[0].type === 'text' ? response.content[0].text : '[]'

  // Strip markdown fences if Haiku wraps the JSON
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  try {
    const nodes: KnowledgeNode[] = JSON.parse(text)
    // Prefix keys with source to avoid collisions
    const prefix = sourceLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')
    return nodes.map((n) => ({
      ...n,
      key: `${prefix}_${n.key}`,
    }))
  } catch {
    console.error(`  AI returned invalid JSON, raw output:\n${text.slice(0, 200)}`)
    return []
  }
}
