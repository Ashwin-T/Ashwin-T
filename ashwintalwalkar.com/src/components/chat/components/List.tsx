import styles from './components.module.css'

interface ListProps {
  items: React.ReactNode[]
  ordered?: boolean
}

export default function List({ items, ordered = false }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={`${styles.list} ${ordered ? styles.orderedList : ''}`}>
      {items.map((item, idx) => (
        <li key={idx} className={styles.listItem}>{item}</li>
      ))}
    </Tag>
  )
}
