import styles from './components.module.css'

interface ListProps {
  items: React.ReactNode[]
}

export default function List({ items }: ListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item, idx) => (
        <li key={idx} className={styles.listItem}>{item}</li>
      ))}
    </ul>
  )
}
