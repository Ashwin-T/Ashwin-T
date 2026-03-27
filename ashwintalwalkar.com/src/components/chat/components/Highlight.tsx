import styles from './components.module.css'

interface HighlightProps {
  children: React.ReactNode
}

export default function Highlight({ children }: HighlightProps) {
  return <span className={styles.highlight}>{children}</span>
}
