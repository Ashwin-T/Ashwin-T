import styles from './components.module.css'

interface TextBlockProps {
  children: React.ReactNode
}

export default function TextBlock({ children }: TextBlockProps) {
  return <p className={styles.textBlock}>{children}</p>
}
