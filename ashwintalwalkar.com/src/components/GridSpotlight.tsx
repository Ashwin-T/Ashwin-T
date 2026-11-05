import { useEffect, useRef } from 'react'
import { usePointer } from '../hooks/usePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './GridSpotlight.module.css'

const EASE = 0.12

/**
 * Fixed 64px grid, visible only inside a soft circle that trails the cursor.
 * Under reduced motion the circle stays at its resting spot (30% / 40%).
 */
export default function GridSpotlight() {
  const gridRef = useRef<HTMLDivElement>(null)
  const target = useRef<{ x: number; y: number } | null>(null)
  const reducedMotion = useReducedMotion()

  usePointer((p) => {
    if (p.active) target.current = { x: p.x, y: p.y }
  }, !reducedMotion)

  useEffect(() => {
    const el = gridRef.current
    if (!el || reducedMotion) return

    // Start where the CSS fallback puts the circle so the first move eases from there.
    let gx = window.innerWidth * 0.3
    let gy = window.innerHeight * 0.4
    let frame = 0

    const tick = () => {
      const t = target.current
      if (t) {
        const dx = t.x - gx
        const dy = t.y - gy
        // Skip the style write once the circle has caught up with the cursor.
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          gx += dx * EASE
          gy += dy * EASE
          el.style.setProperty('--gx', `${gx}px`)
          el.style.setProperty('--gy', `${gy}px`)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      el.style.removeProperty('--gx')
      el.style.removeProperty('--gy')
    }
  }, [reducedMotion])

  return <div ref={gridRef} className={styles.grid} aria-hidden="true" />
}
