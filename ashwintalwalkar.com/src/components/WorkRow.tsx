import type { CSSProperties } from 'react'
import type { WorkEntry } from '../data/work'
import styles from './WorkRow.module.css'

type WorkRowProps = { entry: WorkEntry }

const LIGHT_INK = '#ffffff'
const DARK_INK = '#0f1222'

// WCAG relative luminance of a 6-digit hex color.
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// White or dark text, whichever reads better on the brand color.
function inkFor(fill: string) {
  if (!/^#[0-9a-f]{6}$/i.test(fill)) return LIGHT_INK
  const l = luminance(fill)
  const withLight = 1.05 / (l + 0.05)
  const withDark = (l + 0.05) / (luminance(DARK_INK) + 0.05)
  return withLight >= withDark ? LIGHT_INK : DARK_INK
}

/** One expanding row. Opens on hover, and on keyboard focus since it is tabbable. */
export default function WorkRow({ entry }: WorkRowProps) {
  const { years, company, role, blurb, tags, highlight, color } = entry

  // Read by WorkRow.module.css, which picks the pair for the active theme.
  // Without a color the row falls back to the site blue.
  const fill = typeof color === 'string' ? { light: color, dark: color } : color
  const brand = fill
    ? ({
        '--brand-light': fill.light,
        '--ink-light': inkFor(fill.light),
        '--brand-dark': fill.dark,
        '--ink-dark': inkFor(fill.dark),
      } as CSSProperties)
    : undefined

  return (
    <article
      className={highlight ? `${styles.job} ${styles.hi}` : styles.job}
      style={brand}
      tabIndex={0}
    >
      <span className={styles.yr}>{years}</span>
      <div className={styles.main}>
        <div className={styles.line}>
          <div className={styles.co}>{company}</div>
          <div className={styles.role}>{role}</div>
        </div>
        <div className={styles.more}>
          <div>
            <div className={styles.in}>
              <p>{blurb}</p>
              <ul>
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
