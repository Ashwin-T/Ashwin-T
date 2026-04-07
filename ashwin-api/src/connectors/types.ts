export type Category = 'personal' | 'work' | 'technical' | 'background' | 'meta'

export interface KnowledgeNode {
  key: string
  category: Category
  facts: string[]
  connections?: string[]
}

export interface Connector {
  name: string
  description: string
  schema: object
  handler: (input: any) => Promise<unknown>
}
