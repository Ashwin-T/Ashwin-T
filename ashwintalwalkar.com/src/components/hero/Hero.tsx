import styles from './Hero.module.css'
import Followup from '../followup/Followup'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.top}>
        <div className={styles.bgTextTop}>ASHWIN</div>
        <div className={styles.topBio}>ASHWINTALWALKAR.COM &bull; SAN FRANCISCO, CALIFORNIA</div>
      </div>


      <div className={styles.content}>
        <span className={styles.greeting}>hey i'm</span>
        <h1 className={styles.name}>
          <span className={styles.black}>Ash</span>
           <span className={styles.blue}>win</span>
        </h1>
        <Followup />
      </div>

      
      <div className={styles.bottom}>
        <div className={styles.bgTextBottom}>TALWALKAR</div>
        <div className={styles.bottomBio}>SWE I @ Toast &bull; Toast Now & Toast IQ</div>
      </div>
    </section>
  )
}