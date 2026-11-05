import type { WorkEntry } from './data/work'

/**
 * Every piece of copy on the site lives here. Edit this file to change text,
 * links, work history, or chat suggestions. No component holds a string.
 *
 * The only text outside this file is the browser tab title in index.html.
 */

// `color` is each place's own brand color (6-digit hex). The row fills with it on hover.
// Give one hex for both themes, or { light, dark } for a fill per theme.
const workEntries: WorkEntry[] = [
  {
    id: 'toast',
    years: '2026 —',
    company: 'Toast',
    color: { light: '#FBD9B6', dark: '#8F5F3D' }, // Toast POS button color ORANGE_1, light and dark mode
    role: 'Software Engineer I',
    blurb:
      'Working on Toast IQ, the AI-powered conversational assistant and intelligence suite built into the Toast POS restaurant and retail platform!',
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
    color: { light: '#7C5CDF', dark: '#9377F3' }, // Plume Signature Violet, light and dark mode
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
      "Dean's List all four years. President of Data Science for Sustainable Development, leading dev teams building full-stack projects for nonprofits like Leap VA and UW's Office of Sustainability. Won CheeseHacks 2024 with RetroSpecs, smart glasses that help people with Alzheimer's recall their day.",
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
        ', working on Toast IQ!. Former Badger. Now in the Bay',
    },
    primaryCta: { label: 'Chat with me →', href: '#ask' },
    secondaryCta: { label: "So Far", href: '#work' },
  },

  work: {
    // Rendered as: before + accent (blue)
    heading: { before: 'So ', accent: 'far.' },
    hint: 'Hover a row',
    entries: workEntries,
  },

  ask: {
    eyebrow: 'Curious?',
    // Rendered as: before + accent (blue)
    heading: { before: 'Just ', accent: 'ask.' },
    lede: 'Dynamically powered by me (and Claude). Ask about any of my interets, work, side projects, or some of my favorite thinfs',
    // label is the chip text, question is what gets sent to the chat
    chips: [
      { label: 'Working on right now?', question: 'What are you working on right now?' },
      { label: 'Other interests?', question: 'What other interests do you have?' },
      { label: "Cooler than your brother's?", question: "Is your website cooler than your brother's?" },
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
