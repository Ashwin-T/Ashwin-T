import { useState } from 'react'
import { work } from '../data/work'
import { useCanHover } from '../hooks/useCanHover'
import { strings } from '../strings'
import WorkRow from './WorkRow'
import styles from './Work.module.css'

// On touch screens one row starts open, so it is clear the rows open at all.
const FIRST_OPEN = (work.find((entry) => entry.highlight) ?? work[0])?.id ?? null

export default function Work() {
  const { heading, hint, hintTouch } = strings.work
  const canHover = useCanHover()
  // Only used on touch screens, where a tap opens a row and a second tap closes it.
  const [openId, setOpenId] = useState<string | null>(FIRST_OPEN)

  return (
    <section className={`wrap ${styles.block}`} id="work">
      <div className={styles.head}>
        <h2>
          {heading.before}
          <span className="b">{heading.accent}</span>
        </h2>
        <span className="eyebrow">{canHover ? hint : hintTouch}</span>
      </div>
      <div className={styles.rows}>
        {work.map((entry) =>
          canHover ? (
            <WorkRow key={entry.id} entry={entry} />
          ) : (
            <WorkRow
              key={entry.id}
              entry={entry}
              open={openId === entry.id}
              onToggle={() => setOpenId((id) => (id === entry.id ? null : entry.id))}
            />
          ),
        )}
      </div>
    </section>
  )
}
