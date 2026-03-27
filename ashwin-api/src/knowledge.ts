/**
 * Knowledge graph for Ashwin Talwalkar.
 *
 * Each node has a category, a list of facts, and optional connections
 * to other node keys. To add knowledge: drop a new entry into GRAPH.
 */

export type Category = 'personal' | 'work' | 'technical' | 'background' | 'meta'

export interface KnowledgeNode {
  category: Category
  facts: string[]
  connections?: string[]
}

const GRAPH: Record<string, KnowledgeNode> = {
  identity: {
    category: 'personal',
    facts: [
      'Full name is Ashwin Talwalkar, goes by Ash.',
      'Based in San Francisco, California.',
    ],
    connections: ['interests', 'skills', 'website'],
  },

  toast: {
    category: 'work',
    facts: [
      'Software Engineer I at Toast.',
      'Works on Toast Now and Toast IQ products.',
      'Toast is a restaurant technology platform.',
    ],
    connections: ['skills'],
  },

  skills: {
    category: 'technical',
    facts: [
      'Proficient in React, TypeScript, and modern frontend development.',
      'Experienced with backend development and API design.',
      'Interested in AI/ML and building AI-powered applications.',
    ],
    connections: ['toast', 'projects', 'website'],
  },

  education: {
    category: 'background',
    facts: [
      'Studied Computer Science.',
    ],
    connections: ['skills'],
  },

  projects: {
    category: 'technical',
    facts: [
      'Builds side projects exploring new technologies.',
      'Created ashwintalwalkar.com as a personal portfolio and playground.',
    ],
    connections: ['website', 'skills'],
  },

  interests: {
    category: 'personal',
    facts: [
      'Interested in technology, software engineering, and AI.',
      'Enjoys building things and experimenting with new tools.',
    ],
    connections: ['skills', 'projects'],
  },

  website: {
    category: 'meta',
    facts: [
      'ashwintalwalkar.com is built with React, TypeScript, and Vite.',
      'The chat feature is powered by Claude Haiku via a knowledge graph system.',
      'The site uses a blur loading animation and custom UI components.',
      'Designed and built entirely by Ashwin.',
    ],
    connections: ['skills', 'projects'],
  },
}

/**
 * Flatten the entire knowledge graph into a single context string
 * suitable for injection into a system prompt.
 */
export function flattenGraph(): string {
  const sections: string[] = []

  for (const [key, node] of Object.entries(GRAPH)) {
    const heading = `[${key}] (${node.category})`
    const bullets = node.facts.map((f) => `- ${f}`).join('\n')
    sections.push(`${heading}\n${bullets}`)
  }

  return sections.join('\n\n')
}
