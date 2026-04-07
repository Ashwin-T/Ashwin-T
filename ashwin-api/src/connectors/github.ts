import type { Connector, KnowledgeNode } from './types'
import { get, set } from './cache'
import { GITHUB_USERNAME } from './config'

const CACHE_KEY = 'github'
const TTL = 6 * 60 * 60_000 // 6 hours

// ─── GitHub API types ───────────────────────────────────────────

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  fork: boolean
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
}

interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: { date: string }
  }
}

interface GitHubLanguages {
  [lang: string]: number
}

// ─── Helpers ────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: { Accept: 'application/vnd.github.v3.raw' } },
    )
    if (!res.ok) return null
    const text = await res.text()
    return text.slice(0, 500).trim()
  } catch {
    return null
  }
}

async function fetchRecentCommits(owner: string, repo: string, count = 5): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${count}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    )
    if (!res.ok) return []
    const commits = (await res.json()) as GitHubCommit[]
    return commits.map((c) => {
      const date = formatDate(c.commit.author.date)
      const msg = c.commit.message.split('\n')[0]
      return `${date}: ${msg}`
    })
  } catch {
    return []
  }
}

async function fetchLanguages(owner: string, repo: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    )
    if (!res.ok) return []
    const langs = (await res.json()) as GitHubLanguages
    const total = Object.values(langs).reduce((a, b) => a + b, 0)
    return Object.entries(langs)
      .sort(([, a], [, b]) => b - a)
      .map(([lang, bytes]) => `${lang} (${Math.round((bytes / total) * 100)}%)`)
  } catch {
    return []
  }
}

// ─── Ingestion ──────────────────────────────────────────────────

async function ingest(username: string): Promise<KnowledgeNode[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github.v3+json' } },
  )

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

  const repos = (await res.json()) as GitHubRepo[]
  const ownRepos = repos.filter((r) => !r.fork)

  const allLanguages = new Set<string>()
  for (const repo of ownRepos) {
    if (repo.language) allLanguages.add(repo.language)
  }

  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
  const recentlyActive = ownRepos
    .filter((r) => new Date(r.pushed_at).getTime() > ninetyDaysAgo)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 5)

  const activityFacts =
    recentlyActive.length > 0
      ? [`Currently active on: ${recentlyActive.map((r) => `${r.name} (${formatDate(r.pushed_at)})`).join(', ')}.`]
      : []

  const nodes: KnowledgeNode[] = [
    {
      key: 'github_overview',
      category: 'technical',
      facts: [
        `Has ${ownRepos.length} public repositories on GitHub (github.com/${username}).`,
        `Languages used across repos: ${[...allLanguages].join(', ')}.`,
        ...activityFacts,
      ],
      connections: ownRepos.map((r) => `github_${r.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`),
    },
  ]

  const topRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)

  console.log(`  Fetching details for ${topRepos.length} repos...`)

  for (const repo of topRepos) {
    const [readme, commits, languages] = await Promise.all([
      fetchReadme(username, repo.name),
      fetchRecentCommits(username, repo.name),
      fetchLanguages(username, repo.name),
    ])

    const facts: string[] = []
    facts.push(`Repository: ${repo.name}`)
    facts.push(`URL: ${repo.html_url}`)
    if (repo.description) facts.push(`Description: ${repo.description}`)

    const created = formatDate(repo.created_at)
    const lastActive = formatDate(repo.pushed_at)
    facts.push(`Created: ${created}, last active: ${lastActive}`)

    if (repo.topics.length > 0) facts.push(`Topics: ${repo.topics.join(', ')}`)
    if (languages.length > 0) facts.push(`Tech stack: ${languages.join(', ')}`)
    if (readme) facts.push(`README excerpt: ${readme}`)
    if (commits.length > 0) facts.push(`Recent commits: ${commits.join('; ')}`)

    const key = `github_${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
    nodes.push({
      key,
      category: 'technical',
      facts,
      connections: ['github_overview', 'skills', 'projects'],
    })
  }

  return nodes
}

// ─── Connector ──────────────────────────────────────────────────

async function load(): Promise<KnowledgeNode[]> {
  const cached = get(CACHE_KEY)
  if (cached) return cached as KnowledgeNode[]

  const nodes = await ingest(GITHUB_USERNAME)
  set(CACHE_KEY, nodes, TTL)
  return nodes
}

export const githubConnector: Connector = {
  name: 'github',
  description: "Ashwin's public personal GitHub profile — repos, languages, tech stack, recent commits, and activity. ashwintalwalkar.com data also resides within Ashwin-T",
  schema: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description: 'optional repo name, language, or topic to filter by',
      },
    },
  },
  handler: async (input: any = {}) => {
    const nodes = await load()
    if (!input?.filter) return nodes

    const f = input.filter.toLowerCase()
    return nodes.filter(
      (n) =>
        n.key.toLowerCase().includes(f) ||
        n.facts.some((fact) => fact.toLowerCase().includes(f)),
    )
  },
}
