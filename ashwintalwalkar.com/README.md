# ashwintalwalkar.com

My personal website, but not the boring kind. No walls of text, no scrolling through sections you don't care about. Instead — just ask me anything.

The site is built around an AI-powered chat interface that lets visitors have a real conversation to learn about my work, interests, and what I'm up to. Think of it as a resume that talks back.

## How it works

You land on the site, see a chat box, and get a simple prompt:

> *"Forget the resume and section by section info. What do you actually want to know about me?"*

Ask anything you’d like. Responses aren’t just plain text—they come back as rich, structured content like cards, lists, code snippets, and inline links.

All of this is powered by a background cron job that builds a knowledge graph from the data I ingest (currently my GitHub, resume, LinkedIn, and personal notes). When you ask a question, Claude reads from that graph to generate a more informed, contextual answer.

## Tech

- **React 19** + **TypeScript 5.9** + **Vite 8**
- React Compiler enabled for optimized re-renders
- Chat responses rendered as structured blocks (text, cards, lists, code)
- Backend powered by Claude, returning block-based content via `POST /chat`
- CSS Modules for scoped styling
- Spam protection (10 messages per session)

## Running locally

```bash
npm install
npm run dev
```

Set `VITE_API_URL` to point to your backend (defaults to `http://localhost:8787`).

## Structure

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
