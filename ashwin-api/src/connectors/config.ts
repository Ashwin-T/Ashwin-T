// dotenv is loaded by the entrypoint (index.ts)

export const GOOGLE_DOC_URL = process.env.GOOGLE_DOC_URL || ''
export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Ashwin-T'
// Optional. Without it the GitHub API allows only 60 requests an hour per IP
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
export const RESUME_PDF_URL = process.env.RESUME_PDF_URL || ''
export const LINKEDIN_URL = process.env.LINKEDIN_URL || ''
export const LINKEDIN_EXPORT_DIR = process.env.LINKEDIN_EXPORT_DIR || ''
