import { strings } from '../strings'

/** A sentence with one linked phrase in it, rendered as: before + link + after. */
export type LinkedText = {
  before: string
  link: { label: string; href: string }
  after: string
}

export type WorkEntry = {
  id: string
  years: string
  company: string
  role: string
  /** Plain text, or text with one linked phrase. */
  blurb: string | LinkedText
  /** Optional second line under the blurb. */
  note?: string | LinkedText
  tags: string[]
  highlight?: boolean
  /**
   * The place's brand color as a 6-digit hex. Fills the row on hover.
   * One hex covers both themes; { light, dark } gives a fill per theme.
   * Site blue when omitted.
   */
  color?: string | { light: string; dark: string }
}

// The entries themselves are written in src/strings.ts with the rest of the copy.
export const work: WorkEntry[] = strings.work.entries
