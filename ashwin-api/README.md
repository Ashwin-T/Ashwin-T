# ashwin-api

Backend for the AI chat on [ashwintalwalkar.com](https://ashwintalwalkar.com). Visitors ask questions about Ashwin and get structured, rich responses powered by Claude and a connector-based architecture that pulls from multiple data sources on demand.

## How it works

```
POST /chat
    │
    ▼
Claude Haiku (agentic loop)
    │
    ├── calls github connector ──► GitHub API (cached 6h)
    ├── calls linkedin connector ──► LinkedIn data (cached 24h)
    ├── calls resume connector ──► Resume PDF (cached 24h)
    └── calls google_doc connector ──► Google Doc (cached 12h)
    │
    ▼
{ blocks, suggestions }
```

**Connectors:** Each data source is a self-contained connector that Claude can call via tool use. Connectors fetch, parse, and cache their data in memory with configurable TTLs. On server startup, all connectors warm their caches.

**Chat:** When a user sends a message, Claude decides which connectors to call based on the question, fetches only the relevant data, and responds as Ashwin with structured JSON that the React frontend renders into UI components (text, lists, cards, code blocks).

## Stack

- **Hono** — lightweight web framework
- **Claude Haiku** (`claude-haiku-4-5-20251001`) — powers chat responses with agentic tool use
- **@anthropic-ai/sdk** — Claude API client
- **unpdf** — PDF text extraction for resume ingestion

## Setup

```bash
npm install
```

Create a `.env` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_USERNAME=Ashwin-T
GOOGLE_DOC_URL=https://docs.google.com/document/d/YOUR_DOC_ID/edit
RESUME_PDF_URL=https://your-site.com/resume.pdf
LINKEDIN_URL=https://linkedin.com/in/your-profile
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot reload (port 8787) |
| `npm start` | Start server (port 8787) |

## Connectors

Each connector is a self-contained file that handles fetching, parsing, caching, and serving data. Connectors are registered at startup and exposed to Claude as tools.

| Connector | What it pulls | Cache TTL | Config |
|-----------|--------------|-----------|--------|
| **github** | Repos, READMEs, languages, commits, activity | 6 hours | `GITHUB_USERNAME` |
| **linkedin** | Jobs, education, awards, clubs, skills, volunteer work | 24 hours | `LINKEDIN_URL` or `LINKEDIN_EXPORT_DIR` |
| **resume** | Jobs, education, skills, projects — parsed from PDF | 24 hours | `RESUME_PDF_URL` |
| **google_doc** | Anything you write — hobbies, interests, personal notes | 12 hours | `GOOGLE_DOC_URL` |

Only connectors with configured env vars are registered. Adding a new data source is just writing a new connector file and calling `register()`.

### Google Doc format

Just write whatever you want — bullet points, paragraphs, stream of consciousness. Claude Haiku structures it automatically. Make the doc "Anyone with the link can view."

### LinkedIn

**Public profile** (default): Scrapes meta tags, JSON-LD, and page text. Gets jobs, education, awards, clubs, skills.

**Data export** (richer): Download your data from LinkedIn Settings > "Get a copy of your data", set `LINKEDIN_EXPORT_DIR` to the extracted folder.

## API

### `POST /chat`

```json
// Request
{
  "messages": [
    { "role": "user", "content": "what do you work on?" }
  ]
}

// Response
{
  "blocks": [
    { "type": "text", "content": "I'm a **Software Engineer** at Toast..." },
    { "type": "card", "title": "Toast", "subtitle": "SWE I", "description": "Working on Toast Now and Toast IQ" }
  ],
  "suggestions": [
    "What tech stack do you use at Toast?",
    "What did you do before Toast?",
    "What projects have you built?"
  ]
}
```

**Rate limited:** 20 requests/minute per IP.

### `GET /`

Health check — returns `We Are Healthy`.

## Architecture

```
src/
├── index.ts                    # Hono server, /chat endpoint, agentic loop
├── prompt.ts                   # Static system prompt
└── connectors/
    ├── types.ts                # Connector + KnowledgeNode types
    ├── cache.ts                # In-memory TTL cache
    ├── config.ts               # Env var config
    ├── registry.ts             # Register, execute, warmCache
    ├── structurer.ts           # Universal AI parser (Haiku)
    ├── github.ts               # GitHub API connector
    ├── linkedin.ts             # LinkedIn connector (profile + export)
    ├── resume.ts               # Resume PDF connector
    └── google-doc.ts           # Google Doc connector
```
