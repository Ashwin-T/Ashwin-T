import type { CSSProperties, MouseEvent } from 'react'
import type { LinkedText, WorkEntry } from '../data/work'
import styles from './WorkRow.module.css'

type WorkRowProps = {
  entry: WorkEntry
  /** Touch screens only: whether this row is the open one. */
  open?: boolean
  /** Touch screens only: called when the row is tapped. Its presence switches hover off. */
  onToggle?: () => void
}

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

// The page background per theme. Mirrors --bg in tokens.css.
const PAGE = { light: '#f7f8fb', dark: '#0b0d16' }
// Enough for the large company name to read against the page.
const MIN_NAME_CONTRAST = 3

// WCAG contrast ratio between two 6-digit hex colors, from 1 to 21.
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// White or dark text, whichever reads better on the brand color.
function inkFor(fill: string) {
  if (!/^#[0-9a-f]{6}$/i.test(fill)) return LIGHT_INK
  return contrast(fill, LIGHT_INK) >= contrast(fill, DARK_INK) ? LIGHT_INK : DARK_INK
}

// The highlighted company name at rest. The light fill is the main brand color, so it
// is used wherever it reads against the page; otherwise the dark fill stands in.
function nameFor(fill: { light: string; dark: string }, page: string) {
  return contrast(fill.light, page) >= MIN_NAME_CONTRAST ? fill.light : fill.dark
}

// One paragraph of the open panel: plain text, or text with a link in the middle.
function Line({ text }: { text: string | LinkedText }) {
  if (typeof text === 'string') return <p>{text}</p>

  return (
    <p>
      {text.before}
      <a href={text.link.href} target="_blank" rel="noopener noreferrer">
        {text.link.label}
      </a>
      {text.after}
    </p>
  )
}

/**
 * One expanding row. With a mouse it opens on hover. It also opens on keyboard focus,
 * since it is tabbable. On touch screens the parent passes `open` and `onToggle`
 * instead, and the row opens and closes by tap.
 */
export default function WorkRow({ entry, open = false, onToggle }: WorkRowProps) {
  const { years, company, role, blurb, note, tags, highlight, color } = entry

  // Read by WorkRow.module.css, which picks the set for the active theme.
  // Without a color the row falls back to the site blue.
  const fill = typeof color === 'string' ? { light: color, dark: color } : color
  const brand = fill
    ? ({
        '--brand-light': fill.light,
        '--ink-light': inkFor(fill.light),
        '--name-light': nameFor(fill, PAGE.light),
        '--brand-dark': fill.dark,
        '--ink-dark': inkFor(fill.dark),
        '--name-dark': nameFor(fill, PAGE.dark),
      } as CSSProperties)
    : undefined

  const className = [
    styles.job,
    highlight && styles.hi,
    onToggle && styles.tappable,
    open && styles.open,
  ]
    .filter(Boolean)
    .join(' ')

  // A tap on a link inside the row follows the link and leaves the row as it is.
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!(e.target as HTMLElement).closest('a')) onToggle?.()
  }

  return (
    <article
      className={className}
      style={brand}
      tabIndex={0}
      onClick={onToggle ? handleClick : undefined}
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
              <div className={styles.text}>
                <Line text={blurb} />
                {note && <Line text={note} />}
              </div>
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
