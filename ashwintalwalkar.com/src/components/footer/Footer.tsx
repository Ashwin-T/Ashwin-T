import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerLeft}>ashwintalwalkar.com</span>
      <div className={styles.footerLinks}>
        <a
          href="https://www.linkedin.com/in/ashwin-talwalkar/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          linkedIn
        </a>
        <a
          href="https://github.com/ashwin-t"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          github
        </a>
        <a href="mailto:atalwalkar719@gmail.com" className={styles.footerLink}>
          email
        </a>
         <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          resume
        </a>
      </div>
    </footer>
  )
}
