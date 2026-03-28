# ashwin-api

Backend for the AI chat on [ashwintalwalkar.com](https://ashwintalwalkar.com). Visitors ask questions about Ashwin and get structured, rich responses powered by Claude Haiku and a knowledge graph built from multiple data sources.

## How it works

```
Google Doc / Resume PDF / LinkedIn / GitHub
        │           │          │         │
        └───────────┴──────────┴─────────┘
                        │
                   npm run ingest
                        │
                  Claude Haiku (structurer)
                        │
                  JSON node files
                   (knowledge graph)
                        │
                   Flattened into
                   system prompt
                        │
              POST /chat ──► Claude Haiku ──► { blocks, suggestions }
```

**Ingestion:** Raw data from any source gets dumped into Claude Haiku, which parses it into structured knowledge nodes (JSON files). No brittle regex — the AI handles all the parsing.

**Serving:** When a user sends a message, the full knowledge graph is flattened into Claude's system prompt. Claude responds as Ashwin using only facts from the graph, returning structured JSON that the React frontend renders into UI components (text, lists, cards, code blocks).

## Stack

- **Hono** — lightweight web framework
- **Claude Haiku** (`claude-haiku-4-5-20251001`) — powers both ingestion parsing and chat responses
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
| `npm run ingest` | Fetch all sources and rebuild knowledge graph |
| `npm run dev` | Start server with hot reload (port 8787) |
| `npm start` | Start server (port 8787) |

## Ingestion sources

Run `npm run ingest` to pull from all configured sources. Each source produces JSON node files in `src/knowledge/nodes/` (gitignored).

| Source | What it pulls | Config |
|--------|--------------|--------|
| **Google Doc** | Anything you write — edit from your phone, re-ingest anytime | `GOOGLE_DOC_URL` |
| **GitHub** | Repos, READMEs, languages, commits, activity | `GITHUB_USERNAME` |
| **Resume PDF** | Jobs, education, skills, projects — parsed from PDF | `RESUME_PDF_URL` |
| **LinkedIn** | Jobs, education, awards, clubs, skills, volunteer work | `LINKEDIN_URL` or `LINKEDIN_EXPORT_DIR` |

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
├── index.ts                        # Hono server, /chat endpoint, rate limiter
├── prompt.ts                       # Builds system prompt from knowledge graph
└── knowledge/
    ├── types.ts                    # KnowledgeNode, Category types
    ├── graph.ts                    # Loads + flattens JSON nodes
    ├── config.ts                   # Env var config
    ├── ingest.ts                   # CLI: runs all ingestions
    ├── nodes/                      # Generated JSON (gitignored)
    └── ingestions/
        ├── structurer.ts           # Universal AI parser (Haiku)
        ├── google-doc.ts           # Google Doc fetcher
        ├── github.ts               # GitHub API scraper
        ├── resume.ts               # PDF text extractor
        └── linkedin.ts             # LinkedIn scraper + export parser
```
