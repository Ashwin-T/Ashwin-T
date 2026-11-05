import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { ActionPayload, AgentSession, ChatSurface, Reply } from '../lib/agent'
import { logEvent } from '../lib/firebase'
import { strings } from '../strings'
import Phone, { type Message } from './Phone'
import styles from './Ask.module.css'

// The agent client and the A2UI renderer are the heaviest code on the page, so
// they live in their own chunk that loads after first paint.
let session: Promise<AgentSession> | undefined

function loadSession(): Promise<AgentSession> {
  session ??= import('../lib/agent')
    .then((agent) => agent.createAgentSession())
    .catch((e) => {
      session = undefined // let the next message retry the download
      throw e
    })
  return session
}

export default function Ask() {
  const { eyebrow, heading, lede, chips } = strings.ask

  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', from: 'ai', text: strings.phone.greeting },
  ])
  // True while a reply is in flight, so the phone locks its send button.
  const [busy, setBusy] = useState(false)
  // Follow-up questions from the agent's latest reply.
  const [suggestions, setSuggestions] = useState<ChatSurface>()
  const phoneRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const reducedMotion = useReducedMotion()

  // `action` is set when the question came from a tapped A2UI suggestion.
  const send = async (text: string, action?: ActionPayload) => {
    const question = text.trim()
    if (!question || busy) return

    const n = nextId.current++
    const pendingId = `ai-${n}`
    setMessages((prev) => [
      ...prev,
      { id: `me-${n}`, from: 'me', text: question },
      { id: pendingId, from: 'ai', text: strings.phone.pending, pending: true },
    ])

    setSuggestions(undefined)
    setBusy(true)

    let reply: Reply = {}
    try {
      const agent = await loadSession()
      reply = await (action ? agent.act(action) : agent.ask(question))
    } catch {
      // An empty reply becomes the error bubble below.
    }

    // Swap the pending bubble for the reply.
    const answer = reply.text ?? (reply.answer ? '' : strings.phone.error)
    setMessages((prev) =>
      prev.map((m) =>
        m.id === pendingId
          ? { ...m, text: answer, surface: reply.answer, pending: false }
          : m,
      ),
    )
    setSuggestions(reply.suggestions)
    setBusy(false)
  }

  // A suggestion inside the phone was tapped.
  const onAction = useEffectEvent((action: ActionPayload) => {
    const { question } = action.context
    if (action.name !== 'ask' || typeof question !== 'string') return
    logEvent('chat_suggestion_clicked', { suggestion: question })
    send(question, action)
  })

  // Starts the download on mount, then listens for taps for as long as we're mounted.
  useEffect(() => {
    let mounted = true
    let unsubscribe = () => {}
    loadSession().then(
      (agent) => {
        if (mounted) unsubscribe = agent.onAction((action) => onAction(action))
      },
      () => {}, // send() retries and reports the failure
    )
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const sendTyped = (text: string) => {
    logEvent('chat_message_sent', { message: text.slice(0, 100) })
    send(text)
  }

  const sendChip = (question: string) => {
    logEvent('chat_suggestion_clicked', { suggestion: question })
    send(question)
    phoneRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  return (
    <section className={`wrap ${styles.finale}`} id="ask">
      <div className={styles.copy}>
        <span className="eyebrow">{eyebrow}</span>
        <h2>
          {heading.before}
          <span className="b">{heading.accent}</span>
        </h2>
        <p>{lede}</p>
        <div className={styles.chips}>
          {chips.map((chip) => (
            <button key={chip.question} type="button" onClick={() => sendChip(chip.question)}>
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.phoneWrap}>
        <Phone
          ref={phoneRef}
          messages={messages}
          suggestions={suggestions}
          onSend={sendTyped}
          busy={busy}
          status={strings.phone.status}
        />
      </div>
    </section>
  )
}
