import { useState, useRef, useEffect } from 'react'
import styles from './Chat.module.css'
import type { Message } from './types'
import { sendMessage } from './api'
import BlockRenderer from './components/BlockRenderer'
import { logEvent } from '../../lib/firebase'

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'ai',
    content: `An interactive introduction: Let's talk. Ask me anything or click on the suggestions below to get started!`,
  },
]
// const CONST_SUGGESTIONS = []

const INITIAL_SUGGESTIONS = [
  'What makes ashwintalwalkar.com special?',
  'What other interests do you have?',
  'What are you working on right now?',
]

const SPAM_LIMIT = 10

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInteracted = useRef(false)

  const isSpamLimited = messageCount >= SPAM_LIMIT

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (hasInteracted.current) {
      scrollToBottom()
    }
  }, [messages, isLoading])

  const fetchResponse = async (updatedMessages: Message[]) => {
    setIsLoading(true)
    try {
      const { blocks: blocks, suggestions: newSuggestions, steps: steps } = await sendMessage(updatedMessages)
      console.log('Received steps from API:', steps)
      setMessages((prev) => [...prev, { role: 'ai', content: blocks }])
      if (newSuggestions?.length) {
        setSuggestions(newSuggestions)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, something went wrong. Try again!' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => {
    if (!input.trim() || isLoading || isSpamLimited) return

    hasInteracted.current = true
    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setMessageCount((prev) => prev + 1)
    logEvent('chat_message_sent', { message: input.slice(0, 100) })
    fetchResponse(updatedMessages)
  }

  const handleSuggestion = (suggestion: string) => {
    if (isLoading || isSpamLimited) return

    hasInteracted.current = true
    const userMessage: Message = { role: 'user', content: suggestion }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setMessageCount((prev) => prev + 1)
    logEvent('chat_suggestion_clicked', { suggestion })
    fetchResponse(updatedMessages)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section id="chat" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.subtitle}>curious?</span>
        <h2 className={styles.title}>
          <span style = {{color: "var(--color-black-600)"}}>just </span>
          <span style={{ color: "var(--color-blue-600)" }}>ask.</span>
        </h2>
        <span className={styles.subtitle2}>dynamically powered by me (& Claude)</span>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${msg.role === 'user' ? styles.messageRight : ''}`}
            >
              {msg.role === 'ai' && (
                <div className={`${styles.avatar} ${styles.avatarAI}`}>AT</div>
              )}
              <div
                className={`${styles.bubble} ${msg.role === 'ai' ? styles.bubbleAI : styles.bubbleUser}`}
              >
                {typeof msg.content === 'string'
                  ? msg.content
                  : <BlockRenderer blocks={msg.content} />
                }
              </div>
              {msg.role === 'user' && (
                <div className={`${styles.avatar} ${styles.avatarUser}`}>You</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className={styles.message}>
              <div className={`${styles.avatar} ${styles.avatarAI}`}>AT</div>
              <div className={`${styles.bubble} ${styles.bubbleAI}`}>
                <span className={styles.typing}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder={isSpamLimited ? "Message limit reached" : "Ask me anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isSpamLimited}
          />
          <button
            className={`${styles.sendButton} ${isLoading || isSpamLimited ? styles.sendButtonDisabled : ''}`}
            onClick={handleSend}
            disabled={isLoading || isSpamLimited}
          >
            <svg
              className={styles.sendIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.suggestions}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            className={`${styles.suggestion} ${isLoading || isSpamLimited ? styles.suggestionDisabled : ''}`}
            onClick={() => handleSuggestion(suggestion)}
            disabled={isLoading || isSpamLimited}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  )
}
