export type Category = 'personal' | 'work' | 'technical' | 'background' | 'meta'

export interface KnowledgeNode {
  key: string
  category: Category
  facts: string[]
  connections?: string[]
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  lastUpdated: string
}
