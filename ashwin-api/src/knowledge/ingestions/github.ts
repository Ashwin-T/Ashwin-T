import type { KnowledgeNode } from '../types'

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Fetch a repo's README content (plain text), truncated.
 */
async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    )
    if (!res.ok) return null
    const text = await res.text()
    // Truncate to first ~500 chars to keep context manageable
    return text.slice(0, 500).trim()
  } catch {
    return null
  }
}

/**
 * Fetch recent commits for a repo.
 */
async function fetchRecentCommits(
  owner: string,
  repo: string,
  count = 5
): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${count}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    )
    if (!res.ok) return []
    const commits: GitHubCommit[] = await res.json()
    return commits.map((c) => {
      const date = formatDate(c.commit.author.date)
      const msg = c.commit.message.split('\n')[0] // first line only
      return `${date}: ${msg}`
    })
  } catch {
    return []
  }
}

/**
 * Fetch language breakdown for a repo.
 */
async function fetchLanguages(
  owner: string,
  repo: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    )
    if (!res.ok) return []
    const langs: GitHubLanguages = await res.json()
    const total = Object.values(langs).reduce((a, b) => a + b, 0)
    return Object.entries(langs)
      .sort(([, a], [, b]) => b - a)
      .map(([lang, bytes]) => `${lang} (${Math.round((bytes / total) * 100)}%)`)
  } catch {
    return []
  }
}

/**
 * Fetch public repos from GitHub and build detailed knowledge nodes.
 * Creates one node per repo (with README, commits, languages) plus
 * an overview node.
 */
export async function ingestGitHub(
  username: string
): Promise<KnowledgeNode[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  )

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  const repos: GitHubRepo[] = await res.json()
  const ownRepos = repos.filter((r) => !r.fork)

  // Collect all languages across repos
  const allLanguages = new Set<string>()
  for (const repo of ownRepos) {
    if (repo.language) allLanguages.add(repo.language)
  }

  // Recent activity — repos pushed to in the last 90 days
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
  const recentlyActive = ownRepos
    .filter((r) => new Date(r.pushed_at).getTime() > ninetyDaysAgo)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 5)

  const activityFacts =
    recentlyActive.length > 0
      ? [
          `Currently active on: ${recentlyActive.map((r) => `${r.name} (${formatDate(r.pushed_at)})`).join(', ')}.`,
        ]
      : []

  // Overview node
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

  // Per-repo deep dive — fetch README, commits, and languages for each
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

    if (repo.topics.length > 0) {
      facts.push(`Topics: ${repo.topics.join(', ')}`)
    }

    if (languages.length > 0) {
      facts.push(`Tech stack: ${languages.join(', ')}`)
    }

    if (readme) {
      facts.push(`README excerpt: ${readme}`)
    }

    if (commits.length > 0) {
      facts.push(`Recent commits: ${commits.join('; ')}`)
    }

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
