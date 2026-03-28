export interface TextBlockData {
  type: 'text'
  content: string
}

export interface ListData {
  type: 'list'
  items: string[]
}

export interface CardData {
  type: 'card'
  title: string
  subtitle?: string
  description: string
  link?: string
}

export interface CodeSnippetData {
  type: 'code'
  code: string
  language?: string
}

export type Block = TextBlockData | ListData | CardData | CodeSnippetData

export interface AIResponse {
  blocks: Block[]
  suggestions?: string[]
}

export interface Message {
  role: 'ai' | 'user'
  content: string | Block[]
}
