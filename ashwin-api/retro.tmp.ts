import 'dotenv/config'
import { runAgentLoop } from './src/agent'
const textOf = (c: any) => [c.text, c.title, c.subtitle, c.description, ...(c.items ?? [])].filter(Boolean).join(' ')
const words = (s: string) => s.split(/\s+/).filter(Boolean).length
async function main() {
  let right = 0, total = 0
  for (const q of ['What is RetroSpecs?', 'Tell me about RetroSpecs', 'What is RetroSpecs?', 'What did you build at CheeseHacks?', 'Tell me about RetroSpecs', 'What is RetroSpecs?']) {
    const t = Date.now()
    const r = await runAgentLoop([{ role: 'user', content: q }])
    const a = r.components.slice(1).map(textOf).join(' | ')
    const ok = /alzheimer|memory assistant/i.test(a)
    total++; if (ok) right++
    console.log(`${ok ? 'RIGHT' : 'WRONG'} [${((Date.now() - t) / 1000).toFixed(1)}s] ${q}  steps=${JSON.stringify(r.steps)}\n   ${a.slice(0, 200)}`)
  }
  console.log(`RetroSpecs correct: ${right}/${total}\n--- controls ---`)
  for (const q of ['What was your GPA?', 'What do you do for fun?', 'What are you working on right now?', 'What is your favorite color?']) {
    const t = Date.now()
    const r = await runAgentLoop([{ role: 'user', content: q }])
    const a = r.components.slice(1).map(textOf).join(' | ')
    console.log(`[${((Date.now() - t) / 1000).toFixed(1)}s, ${words(a)} words] ${q}  steps=${JSON.stringify(r.steps)}\n   ${a.slice(0, 200)}`)
  }
  process.exit(0)
}
main()
