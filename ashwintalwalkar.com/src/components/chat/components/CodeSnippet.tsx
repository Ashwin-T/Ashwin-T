import styles from './components.module.css'

interface CodeSnippetProps {
  code: string
  language?: string
}

export default function CodeSnippet({ code, language }: CodeSnippetProps) {
  return (
    <div className={styles.codeWrapper}>
      {language && <span className={styles.codeLanguage}>{language}</span>}
      <pre className={styles.codeSnippet}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
