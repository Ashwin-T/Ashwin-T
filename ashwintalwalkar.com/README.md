# ashwintalwalkar.com

My personal website, but not the boring kind. No walls of text, no scrolling through sections you don't care about. Instead — just ask me anything.

The site is built around an AI-powered chat interface that lets visitors have a real conversation to learn about my work, interests, and what I'm up to. Think of it as a resume that talks back.

## How it works

You land on the site, see a chat box, and get a simple prompt:

> *"An interactive introduction: Let's talk. Ask me anything or click on the suggestions below to get started!"*

Ask anything you'd like. Responses aren't just plain text—they come back as rich, structured content like cards, lists, code snippets, and inline links.

When you ask a question, Claude decides which data sources to pull from (GitHub, LinkedIn, resume, personal notes), fetches only what's relevant via tool use, and responds as me with structured JSON that the frontend renders into UI components.

## Architecture

```
Frontend (React)                          Backend (Hono)
┌─────────────────┐                      ┌──────────────────────────────┐
│                 │   POST /chat         │                              │
│  Chat UI        │ ──────────────────►  │  Claude Haiku (agentic loop) │
│  (blocks,       │                      │       │                      │
│   cards,        │  { blocks,           │       ├── github connector   │
│   lists,        │    suggestions }     │       ├── linkedin connector │
│   code)         │ ◄──────────────────  │       ├── resume connector   │
│                 │                      │       └── google_doc connector│
└─────────────────┘                      └──────────────────────────────┘
```

Each backend connector is a self-contained data source that fetches, parses, and caches data in memory. Claude calls them on demand via tool use — no knowledge is stuffed into the system prompt. Adding a new data source is just writing a new connector file.

## Frontend

- **React 19** + **TypeScript 5.9** + **Vite 8**
- React Compiler enabled for optimized re-renders
- Chat responses rendered as structured blocks (text, cards, lists, code)
- CSS Modules for scoped styling
- Spam protection (10 messages per session)

```
src/
├── components/
│   ├── chat/       # Chat interface + block renderer
│   ├── hero/       # Name, location, current role
│   ├── nowCard/    # What I'm working on / watching / doing
│   ├── followup/   # Follow-up prompts
│   ├── loading/    # Loading states
│   ├── logo/       # Logo
│   └── footer/     # Footer
├── lib/api.ts      # API layer
├── App.tsx
└── main.tsx
```

## Backend

- **Hono** — lightweight web framework
- **Claude Haiku** (`claude-haiku-4-5-20251001`) — agentic tool-use loop for chat
- **@anthropic-ai/sdk** — Claude API client
- **unpdf** — PDF text extraction for resume connector

| Connector | Data source | Cache TTL |
|-----------|------------|-----------|
| `github` | GitHub API — repos, languages, commits, activity | 6 hours |
| `linkedin` | LinkedIn — jobs, education, awards, skills | 24 hours |
| `resume` | Resume PDF — parsed and structured by AI | 24 hours |
| `google_doc` | Google Doc — personal notes, hobbies, interests | 12 hours |

```
src/
├── index.ts                # Hono server, /chat endpoint, agentic loop
├── prompt.ts               # Static system prompt
└── connectors/
    ├── types.ts            # Connector + KnowledgeNode types
    ├── cache.ts            # In-memory TTL cache
    ├── config.ts           # Env var config
    ├── registry.ts         # Register, execute, warmCache
    ├── structurer.ts       # Universal AI parser (Haiku)
    ├── github.ts           # GitHub API connector
    ├── linkedin.ts         # LinkedIn connector (profile + export)
    ├── resume.ts           # Resume PDF connector
    └── google-doc.ts       # Google Doc connector
```

## Running locally

```bash
# Frontend
cd ashwintalwalkar.com
npm install
npm run dev
```

Set `VITE_API_URL` to point to your backend (defaults to `http://localhost:8787`).

```bash
# Backend
cd ashwin-api
npm install
cp .env.example .env  # fill in your keys
npm run dev
```