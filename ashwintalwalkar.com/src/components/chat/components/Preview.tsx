import styles from './Preview.module.css'
import { TextBlock, Highlight, List, CodeSnippet, Link, Card } from './index'

export default function Preview() {
  return (
    <div className={styles.preview}>
      <h2 className={styles.title}>Chat Components Preview</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>TextBlock</h3>
        <div className={styles.demo}>
          <TextBlock>
            This is a basic text block. It's used for regular paragraphs and responses.
          </TextBlock>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Highlight</h3>
        <div className={styles.demo}>
          <TextBlock>
            I work at <Highlight>Toast</Highlight> building features for <Highlight>Toast Now</Highlight> and <Highlight>Toast IQ</Highlight>.
          </TextBlock>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>List</h3>
        <div className={styles.demo}>
          <TextBlock>Here are some things I'm into:</TextBlock>
          <List items={[
            'Building side projects',
            'Learning new technologies',
            'Playing basketball',
          ]} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>CodeSnippet</h3>
        <div className={styles.demo}>
          <TextBlock>This site is built with React and Vite:</TextBlock>
          <CodeSnippet
            language="tsx"
            code={`export default function App() {
  return (
    <Loading>
      <Hero />
      <Chat />
    </Loading>
  )
}`}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Link</h3>
        <div className={styles.demo}>
          <TextBlock>
            Check out my <Link href="https://github.com/ashwin-t">GitHub</Link> for more projects.
          </TextBlock>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Card</h3>
        <div className={styles.demo}>
          <Card
            title="Toast"
            subtitle="SWE I"
            description="Building features for Toast Now and Toast IQ, helping restaurants run better."
            link="https://toasttab.com"
          />
          <Card
            title="ashwintalwalkar.com"
            subtitle="This site!"
            description="A dynamic portfolio powered by AI. Ask me anything and I'll respond in real-time."
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Combined Example</h3>
        <div className={styles.demo}>
          <TextBlock>
            Great question! This site is built with <Highlight>React</Highlight> and <Highlight>Vite</Highlight>,
            and the chat is powered by <Highlight>Claude</Highlight>.
          </TextBlock>
          <TextBlock>Here's how it works:</TextBlock>
          <List items={[
            'You type a question',
            'It gets sent to an AI backend',
            'I respond dynamically based on my knowledge',
          ]} />
          <TextBlock>
            Check out the <Link href="https://github.com/ashwin-t">source code</Link> if you're curious!
          </TextBlock>
        </div>
      </section>
    </div>
  )
}
