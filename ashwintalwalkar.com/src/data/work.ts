import { strings } from '../strings'

export type WorkEntry = {
  id: string
  years: string
  company: string
  role: string
  blurb: string
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
