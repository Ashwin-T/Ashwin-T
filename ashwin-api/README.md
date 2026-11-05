  # ashwin-api

  Backend for the AI chat on [ashwintalwalkar.com](https://ashwintalwalkar.com). Visitors ask questions about Ashwin and get structured, rich responses powered by Claude and a connector-based architecture that pulls from multiple data sources on demand. Agentic Pattern

  ## How it works

  ```
  A2A client (the website, or any other agent)
      │
      │  GET  /.well-known/agent-card.json     discover the agent
      │  POST /a2a   SendMessage (JSON-RPC)    ask a question
      ▼
  Claude Haiku (agentic loop)
      │
      ├── calls github connector ──► GitHub API (cached 6h)
      ├── calls linkedin connector ──► LinkedIn data (cached 24h)
      ├── calls resume connector ──► Resume PDF (cached 24h)
      └── calls google_doc connector ──► Google Doc (cached 12h)
      │
      ▼
  A2A Message
      ├── A2UI surfaces (answer + follow-up suggestions)   for clients that render A2UI
      └── plain markdown text                              for everyone else
  ```

  **Connectors:** Each data source is a self-contained connector that Claude can call via tool use. Each connector fetches its source and returns it as is (the doc's text, the resume's text, the LinkedIn page data, GitHub repo facts), with no AI pre-processing in between. Results go through one shared in-memory cache with a TTL per connector, so a source is fetched once and reused until it expires. On server startup, all connectors warm their caches.

  **A2A:** The server is an [Agent2Agent](https://a2a-protocol.org/) v1.0 agent. It publishes an agent card, speaks the JSON-RPC binding, and keeps each conversation's history under the A2A `contextId` (in memory, for an hour after the last message).

  **A2UI:** Every context starts with the `google_doc` connector already called, so the personal notes are always in view. Claude then decides which other connectors to call, fetches only the relevant data, and answers as Ashwin with an [A2UI](https://a2ui.org/) v0.9 component list (text, lists, cards, code blocks). The reply is held to a JSON schema by the Claude API (structured outputs), so it is always complete, parseable JSON. The server validates it, wraps it into A2UI surfaces, and sends it through the A2UI extension for A2A. Follow-up suggestions are a second surface of chips whose `ask` action comes back to the agent as the next question. Clients that don't declare support for the chat catalog get the same answer as markdown text.

  ## Stack

  - **Hono** — lightweight web framework
  - **Claude Haiku** (`claude-haiku-4-5-20251001`) — powers chat responses with agentic tool use
  - **@anthropic-ai/sdk** — Claude API client
  - **@a2a-js/sdk** — A2A v1.0 server (request handling, JSON-RPC transport)
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
  PUBLIC_URL=https://your-api-host.com
  ```

  `PUBLIC_URL` is the address the agent card advertises for the A2A endpoint. If it's unset, the card uses the origin of whichever request asked for it.

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
  | **resume** | Jobs, education, skills, projects — text extracted from the PDF | 24 hours | `RESUME_PDF_URL` |
  | **google_doc** | Anything you write — hobbies, interests, personal notes | 12 hours | `GOOGLE_DOC_URL` |

  Only connectors with configured env vars are registered. Adding a new data source is just writing a new connector file and calling `register()`.

  ### Google Doc format

  Just write whatever you want — bullet points, paragraphs, stream of consciousness. Claude reads the doc's text directly. Make the doc "Anyone with the link can view."

  ### LinkedIn

  **Public profile** (default): Scrapes meta tags, JSON-LD, and page text. Gets jobs, education, awards, clubs, skills.

  **Data export** (richer): Download your data from LinkedIn Settings > "Get a copy of your data", set `LINKEDIN_EXPORT_DIR` to the extracted folder.

  ## API

  ### `GET /.well-known/agent-card.json`

  The A2A agent card: where the JSON-RPC interface lives, the agent's skill, and the A2UI extension with the catalog it can generate.

  ### `POST /a2a`

  A2A v1.0 over JSON-RPC. Requests must send `A2A-Version: 1.0`. `SendMessage` returns the answer as a single Message; `SendStreamingMessage` returns the same Message as a one-event SSE stream.

  ```bash
  curl -X POST http://localhost:8787/a2a \
    -H "Content-Type: application/json" \
    -H "A2A-Version: 1.0" \
    -d '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "SendMessage",
      "params": {
        "message": {
          "messageId": "m1",
          "role": "ROLE_USER",
          "parts": [{ "text": "what do you work on?" }]
        }
      }
    }'
  ```

  ```json
  {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "message": {
        "messageId": "be01ba33-...",
        "contextId": "d00ac8b7-...",
        "role": "ROLE_AGENT",
        "parts": [{ "text": "I'm a **Software Engineer** at Toast...", "mediaType": "text/plain" }],
        "metadata": { "steps": ["linkedin"] }
      }
    }
  }
  ```

  Send the returned `contextId` on the next message to continue the conversation. `metadata.steps` lists the connectors Claude called, plus `repair` when Claude's first reply wasn't valid JSON and it had to send it again.

  **A2UI replies.** To get UI instead of text, activate the extension and declare the chat catalog:

  ```
  A2A-Extensions: https://a2ui.org/a2a-extension/a2ui/v0.9
  ```

  ```json
  "message": {
    "messageId": "m2",
    "role": "ROLE_USER",
    "parts": [{ "text": "what projects have you built?" }],
    "metadata": {
      "a2uiClientCapabilities": {
        "v0.9": { "supportedCatalogIds": ["https://ashwintalwalkar.com/a2ui/chat/v1/catalog.json"] }
      }
    }
  }
  ```

  The reply then carries one data part (`application/a2ui+json`) holding the A2UI messages:

  ```json
  [
    { "version": "v0.9", "createSurface": { "surfaceId": "answer-<id>", "catalogId": "https://ashwintalwalkar.com/a2ui/chat/v1/catalog.json" } },
    { "version": "v0.9", "updateComponents": { "surfaceId": "answer-<id>", "components": [
      { "id": "root", "component": "Column", "children": ["intro", "hiro"] },
      { "id": "intro", "component": "Text", "text": "Here are a couple I'm proud of:" },
      { "id": "hiro", "component": "Card", "title": "hIIRO", "subtitle": "Voice-controlled AI assistant", "link": "https://github.com/Ashwin-T/hIIro" }
    ] } },
    { "version": "v0.9", "createSurface": { "surfaceId": "suggestions-<id>", "catalogId": "..." } },
    { "version": "v0.9", "updateComponents": { "surfaceId": "suggestions-<id>", "components": [
      { "id": "root", "component": "Row", "children": ["suggestion-0"] },
      { "id": "suggestion-0", "component": "SuggestionChip", "label": "What tech stack do you use?",
        "action": { "event": { "name": "ask", "context": { "question": "What tech stack do you use?" } } } }
    ] } }
  ]
  ```

  **Chat catalog** (`src/a2ui/catalog.ts`, mirrored by the frontend's `ChatCatalog.tsx`):

  | Component | Props |
  |-----------|-------|
  | `Column`, `Row` | `children` |
  | `Text` | `text` (supports `**bold**`, `` `code` ``, `[links](url)`) |
  | `ItemList` | `items`, `ordered` |
  | `Card` | `title`, `subtitle`, `description`, `link` |
  | `CodeBlock` | `code`, `language` |
  | `SuggestionChip` | `label`, `action` |

  **Rate limited:** 20 requests/minute per IP.

  ### `GET /`

  Health check — returns `We Are Healthy`.

  ## Architecture

  ```
  src/
  ├── index.ts                    # Hono server, rate limiter, cache warming
  ├── agent.ts                    # Agentic loop (Claude + connector tools)
  ├── prompt.ts                   # Static system prompt
  ├── a2a/
  │   ├── agent-card.ts           # A2A agent card
  │   ├── routes.ts               # /.well-known/agent-card.json + /a2a (JSON-RPC)
  │   ├── executor.ts             # A2A message in → agent loop → A2A message out
  │   └── conversations.ts        # History per contextId (in-memory, TTL)
  ├── a2ui/
  │   └── catalog.ts              # Chat catalog: validation, surfaces, text fallback
  └── connectors/
      ├── types.ts                # Connector + KnowledgeNode types
      ├── cache.ts                # Shared TTL cache for all connectors
      ├── config.ts               # Env var config
      ├── registry.ts             # Register, execute, warmCache
      ├── github.ts               # GitHub API connector
      ├── linkedin.ts             # LinkedIn connector (profile + export)
      ├── resume.ts               # Resume PDF connector
      └── google-doc.ts           # Google Doc connector
  ```
