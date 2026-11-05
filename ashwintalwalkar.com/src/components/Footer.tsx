import { strings } from '../strings'
import styles from './Footer.module.css'

export default function Footer() {
  const { siteName, links, email } = strings.footer

  return (
    <footer className={`wrap ${styles.footer}`}>
      <span>{siteName}</span>
      <span className={styles.r}>
        {links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener">
            {link.label}
          </a>
        ))}
        <span>{email}</span>
      </span>
    </footer>
  )
}
