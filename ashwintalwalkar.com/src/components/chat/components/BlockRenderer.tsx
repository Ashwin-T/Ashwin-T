import type { Block } from '../types'
import { TextBlock, Highlight, List, CodeSnippet, Card, Link } from './index'

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Match **bold**, `code`, and [text](url)
  const regex = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      nodes.push(<Highlight key={match.index}>{match[1]}</Highlight>)
    } else if (match[2]) {
      nodes.push(<Highlight key={match.index}>{match[2]}</Highlight>)
    } else if (match[3] && match[4]) {
      nodes.push(<Link key={match.index} href={match[4]}>{match[3]}</Link>)
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

interface BlockRendererProps {
  blocks: Block[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={idx}>{parseInline(block.content)}</TextBlock>
          case 'list':
            return <List key={idx} items={block.items} />
          case 'card':
            return (
              <Card
                key={idx}
                title={block.title}
                subtitle={block.subtitle}
                description={block.description}
                link={block.link}
              />
            )
          case 'code':
            return (
              <CodeSnippet
                key={idx}
                code={block.code}
                language={block.language}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
