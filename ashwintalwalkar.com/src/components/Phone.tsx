import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import type { ChatSurface } from '../lib/agent'
import { strings } from '../strings'
import styles from './Phone.module.css'

export type Message = {
  id: string
  from: 'me' | 'ai'
  text: string
  /** Agent-built A2UI for this bubble. Rendered instead of `text` when set. */
  surface?: ChatSurface
  pending?: boolean
}

export type PhoneProps = {
  messages: Message[]
  /** A2UI surface of follow-up suggestions, shown under the newest bubble. */
  suggestions?: ChatSurface
  onSend: (text: string) => void
  busy?: boolean
  /** Shown top right in the status bar, e.g. "● online". */
  status?: string
  /** Lets the parent scroll the phone into view. */
  ref?: RefObject<HTMLDivElement | null>
}

// Downloads along with the agent client (see Ask.tsx), which has always loaded
// by the time there is a surface to render.
const A2uiSurface = lazy(() =>
  import('@a2ui/react/v0_9').then((a2ui) => ({ default: a2ui.A2uiSurface })),
)

const WIDE_MIN_WIDTH = 820
const RISE_PX = 120
// Top padding of .msgs in Phone.module.css
const LIST_PADDING_PX = 6

// Rises and straightens as it scrolls in: progress 0 is the resting pose, 1 is upright.
function applyPose(progress: number, el: HTMLElement) {
  const wide = window.innerWidth > WIDE_MIN_WIDTH
  const rest = 1 - progress
  const rotateY = (wide ? -28 : -12) * rest + (wide ? -6 : 0) * progress
  const rotateX = (wide ? 10 : 6) * rest + 2 * progress
  el.style.transform = `translateY(${rest * RISE_PX}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
}

function bubbleClass(message: Message) {
  if (message.from === 'me') return `${styles.m} ${styles.me}`
  return message.pending ? `${styles.m} ${styles.ai} ${styles.think}` : `${styles.m} ${styles.ai}`
}

/**
 * Presentational chat phone. It owns only the draft in the input and its own
 * scroll pose; the conversation and what happens on send belong to the parent.
 */
export default function Phone({
  messages,
  suggestions,
  onSend,
  busy = false,
  status = strings.phone.status,
  ref,
}: PhoneProps) {
  const { title, inputPlaceholder, inputLabel, sendLabel, sendGlyph } = strings.phone
  const ownRef = useRef<HTMLDivElement>(null)
  const phoneRef = ref ?? ownRef
  const listRef = useRef<HTMLDivElement>(null)
  const newestRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')

  useScrollProgress(phoneRef, applyPose)

  // Keep the newest bubble in view: scroll to the bottom, but never past the
  // top of a bubble too tall to fit. A2UI surfaces fill in after this render,
  // so follow the bubble as it grows.
  useEffect(() => {
    const list = listRef.current
    const newest = newestRef.current
    if (!list || !newest) return

    const settle = () => {
      const bottom = list.scrollHeight - list.clientHeight
      const bubbleTop = newest.offsetTop - list.offsetTop - LIST_PADDING_PX
      list.scrollTop = Math.min(bottom, bubbleTop)
    }

    const observer = new ResizeObserver(settle)
    observer.observe(newest)
    if (newest.nextElementSibling) observer.observe(newest.nextElementSibling)
    settle()
    return () => observer.disconnect()
  }, [messages, suggestions])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = draft.trim()
    if (busy || !text) return
    setDraft('')
    onSend(text)
  }

  return (
    <div className={styles.phone} ref={phoneRef}>
      <div className={styles.notch} />
      <div className={styles.screen}>
        <div className={styles.bar}>
          <b>{title}</b>
          <span className={styles.on}>{status}</span>
        </div>
        <div className={styles.msgs} ref={listRef} role="log" aria-live="polite">
          {messages.map((message, i) => (
            <div
              key={message.id}
              className={bubbleClass(message)}
              ref={i === messages.length - 1 ? newestRef : undefined}
            >
              {message.surface ? (
                <Suspense fallback={message.text}>
                  <A2uiSurface surface={message.surface} />
                </Suspense>
              ) : (
                message.text
              )}
            </div>
          ))}
          {suggestions && (
            <div className={styles.suggestions}>
              <Suspense>
                <A2uiSurface surface={suggestions} />
              </Suspense>
            </div>
          )}
        </div>
        <form className={styles.compose} onSubmit={submit}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={inputPlaceholder}
            autoComplete="off"
            aria-label={inputLabel}
          />
          <button type="submit" disabled={busy} aria-label={sendLabel}>
            {sendGlyph}
          </button>
        </form>
      </div>
      <div className={styles.glare} />
    </div>
  )
}
