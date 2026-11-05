import { useEffect, useRef } from 'react'
import { usePointer } from '../hooks/usePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { strings } from '../strings'
import styles from './Hero.module.css'

const TILT_Y_DEG = 14
const TILT_X_DEG = 10

export default function Hero() {
  const { eyebrow, firstName, lastName, lede, primaryCta, secondaryCta } = strings.hero
  const nameRef = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  // The whole name leans toward the cursor. Written straight to the element, no re-render.
  usePointer((p) => {
    const el = nameRef.current
    if (!el) return
    el.style.transform = p.active
      ? `rotateY(${p.nx * TILT_Y_DEG}deg) rotateX(${-p.ny * TILT_X_DEG}deg)`
      : ''
  }, !reducedMotion)

  // If reduced motion is switched on mid-visit, drop any tilt already applied.
  useEffect(() => {
    if (reducedMotion && nameRef.current) nameRef.current.style.transform = ''
  }, [reducedMotion])

  return (
    <header className={`wrap ${styles.hero}`} id="top">
      <div className={styles.hey}>{eyebrow}</div>
      <h1 className={styles.name} ref={nameRef}>
        <span className={styles.first}>
          {firstName.before}
          <em>{firstName.accent}</em>
        </span>
        <span className={styles.last} data-t={lastName}>
          {lastName}
        </span>
      </h1>
      <div className={styles.below}>
        <p className={styles.lede}>
          {lede.before}
          <b>{lede.bold}</b>
          {lede.after}
        </p>
        <div className={styles.cta}>
          <a className="btn fill" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          <a className="btn" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
      </div>
    </header>
  )
}
