import styles from './NowCard.module.css'

export interface NowData {
  work: string
  watching: string
  hobby: string
}

interface NowCardProps {
  data: NowData
}

export default function NowCard({ data }: NowCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.indicator} />
        <span className={styles.title}>Right Now</span>
      </div>
      <div className={styles.content}>
        <div className={styles.labels}>
          <span className={styles.label}>Work</span>
          <span className={styles.label}>Watching</span>
          <span className={styles.label}>Main Hobby</span>
        </div>
        <div className={styles.values}>
          <span className={styles.value}>{data.work}</span>
          <span className={styles.value}>{data.watching}</span>
          <span className={styles.value}>{data.hobby}</span>
        </div>
      </div>
    </div>
  )
}
