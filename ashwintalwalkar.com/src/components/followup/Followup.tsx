import styles from './Followup.module.css'

export default function Followup() {
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat')
    chatSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button className={styles.ctaButton} onClick={scrollToChat}>
      {'Chat With Me \u2192'}
    </button>
  )
}
