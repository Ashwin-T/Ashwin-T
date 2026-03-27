import styles from './components.module.css'

interface CardProps {
  title: string
  subtitle?: string
  description: string
  link?: string
}

export default function Card({ title, subtitle, description, link }: CardProps) {
  const content = (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
      </div>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
        {content}
      </a>
    )
  }

  return content
}
