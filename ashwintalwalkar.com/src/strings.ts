import type { WorkEntry } from './data/work'

/**
 * Every piece of copy on the site lives here. Edit this file to change text,
 * links, work history, or chat suggestions. No component holds a string.
 *
 * The only text outside this file is the browser tab title in index.html.
 */

// `color` is each place's own brand color (6-digit hex). The row fills with it on hover.
// Give one hex for both themes, or { light, dark } for a fill per theme.
// `blurb` is plain text, or { before, link, after } to link one phrase in it.
// `note` is an optional second line under the blurb, in the same two forms.
const workEntries: WorkEntry[] = [
  {
    id: 'toast',
    years: '2026 —',
    company: 'Toast',
    color: { light: '#D4340B', dark: '#D4340B' }, // toasttab.com accent red-orange; Toast POS dark-mode orange
    role: 'Software Engineer I',
    // Rendered as: before + link + after
    blurb: {
      before: 'Working on ',
      link: { label: 'Toast IQ', href: 'https://pos.toasttab.com/products/toast-iq' },
      after:
        ', the AI-powered conversational assistant and intelligence suite built into the Toast POS restaurant and retail platform!',
    },
    tags: ['Kotlin', 'Android'],
    highlight: true,
  },
  {
    id: 'luminys',
    years: '2025',
    company: 'Luminys',
    color: { light: '#00B5E2', dark: '#1B365D' }, // Luminys Blue and Reflex Blue, from the Luminys palette
    role: 'SWE Intern',
    blurb:
      'CRM-to-database integration in Python and Postgres with batch and real-time processing, then an Android shipping app with barcode scanning and automated UPS tracking.',
    tags: ['Python', 'PostgreSQL', 'Android'],
  },
  {
    id: 'plume',
    years: '2023 – 24',
    company: 'Plume',
    color: { light: '#390477', dark: '#8622F8' }, // plume.com deep purple; its bright accent, which reads on dark
    role: 'SWE Intern · Palo Alto',
    blurb:
      'Data pipelines and Hidden Markov Models on AWS, Flink, Spark and Databricks. Pushed model accuracy up 5% with simulated annealing.',
    tags: ['AWS', 'Flink', 'Spark', 'Python'],
  },
  {
    id: 'uw-madison',
    years: '2021 – 25',
    company: 'UW–Madison',
    color: '#C5050C', // Badger Red, from brand.wisc.edu
    role: 'B.S. Computer Science',
    blurb:
      "Dean's List all four years. President of Data Science for Sustainable Development, leading dev teams building full-stack projects for nonprofits like Leap VA and UW's Office of Sustainability.",
    // Rendered on its own line as: before + link + after
    note: {
      before: 'Won CheeseHacks 2024 with ',
      link: { label: 'RetroSpecs', href: 'https://github.com/RetroSpecs-Suite' },
      after: ", smart glasses that help people with Alzheimer's recall their day.",
    },
    tags: ['Go Badgers'],
  },
]

export const strings = {
  nav: {
    // Rendered as: before + accent (blue) + after
    logo: { before: 'ash', accent: 'win', after: '.' },
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Ask', href: '#ask' },
    ],
    // Screen reader label and tooltip on the light/dark toggle
    theme: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
  },

  hero: {
    eyebrow: "hey i'm",
    // Rendered as: before + accent (blue)
    firstName: { before: 'Ash', accent: 'win' },
    lastName: 'Talwalkar',
    // Rendered as: before + bold + after
    lede: {
      before: 'Software engineer at ',
      bold: 'Toast',
      after:
        ', working on Toast IQ! Former Wisconsin Badger. Now in the Bay',
    },
    primaryCta: { label: 'Chat with me →', href: '#ask' },
    secondaryCta: { label: "So Far", href: '#work' },
  },

  work: {
    // Rendered as: before + accent (blue)
    heading: { before: 'So ', accent: 'far.' },
    hint: 'Hover on a row',
    // Shown instead of `hint` on touch screens, where rows open by tap
    hintTouch: 'Tap on a row',
    entries: workEntries,
  },

  ask: {
    eyebrow: 'Curious?',
    // Rendered as: before + accent (blue)
    heading: { before: 'Just ', accent: 'ask.' },
    lede: 'Dynamically powered by me (and Claude). Ask about any of my interests, work, side projects, or some of my favorite things',
    // label is the chip text, question is what gets sent to the chat
    chips: [
      { label: 'Working on right now?', question: 'What are you working on right now?' },
      { label: 'Personal interests?', question: 'What are your personal interests?' },
      { label: 'Fun fact?', question: "What's a fun fact about you?" },
    ],
  },

  phone: {
    title: 'ashwin',
    status: '● online',
    greeting: "Hey, it's Ashwin. Well, an AI version. Ask me anything.",
    pending: 'typing…',
    error: 'Sorry, something went wrong. Try again!',
    inputPlaceholder: 'Seriously you can type here..',
    inputLabel: 'Your question',
    sendLabel: 'Send',
    sendGlyph: '↑',
  },

  footer: {
    siteName: 'ashwintalwalkar.com',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashwin-talwalkar/' },
      { label: 'GitHub', href: 'https://github.com/ashwin-t' },
      { label: 'Resume', href: '/resume.pdf' },
    ],
    email: 'atalwalkar719@gmail.com',
  },
}
