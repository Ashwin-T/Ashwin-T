import { useTheme } from '../hooks/useTheme'
import { strings } from '../strings'
import styles from './Nav.module.css'

// Shown in dark mode: click for light.
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

// Shown in light mode: click for dark.
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

export default function Nav() {
  const { logo, links, theme: themeLabels } = strings.nav
  const [theme, toggleTheme] = useTheme()
  const label = theme === 'dark' ? themeLabels.toLight : themeLabels.toDark

  return (
    <nav className={`wrap ${styles.nav}`}>
      <a className={styles.logo} href="#top">
        {logo.before}
        <span>{logo.accent}</span>
        {logo.after}
      </a>
      <div className={styles.links}>
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <button
          type="button"
          className={styles.theme}
          onClick={toggleTheme}
          aria-label={label}
          title={label}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}
