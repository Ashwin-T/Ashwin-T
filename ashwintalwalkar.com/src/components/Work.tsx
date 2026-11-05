import { work } from '../data/work'
import { strings } from '../strings'
import WorkRow from './WorkRow'
import styles from './Work.module.css'

export default function Work() {
  const { heading, hint } = strings.work

  return (
    <section className={`wrap ${styles.block}`} id="work">
      <div className={styles.head}>
        <h2>
          {heading.before}
          <span className="b">{heading.accent}</span>
        </h2>
        <span className="eyebrow">{hint}</span>
      </div>
      <div className={styles.rows}>
        {work.map((entry) => (
          <WorkRow key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  )
}
