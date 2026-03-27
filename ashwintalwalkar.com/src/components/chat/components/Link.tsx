import styles from './components.module.css'

interface LinkProps {
  href: string
  children: React.ReactNode
}

export default function Link({ href, children }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {children}
    </a>
  )
}
