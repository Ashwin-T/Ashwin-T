import { strings } from '../strings'
import styles from './Nav.module.css'

export default function Nav() {
  const { logo, links } = strings.nav

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
      </div>
    </nav>
  )
}
