import { A2A_PROTOCOL_VERSION, type AgentCard } from '@a2a-js/sdk'
import { getAll } from '../connectors/registry'
import { A2UI_EXTENSION_URI, A2UI_MIME_TYPE, CATALOG_ID } from '../a2ui/catalog'

export const A2A_PATH = '/a2a'

// Where this server is reachable from the outside. When unset, the card route
// falls back to the origin of the request that asked for it.
export const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '')

const port = Number(process.env.PORT) || 8787

export function buildAgentCard(baseUrl = PUBLIC_URL || `http://localhost:${port}`): AgentCard {
  return {
    name: 'Ashwin Talwalkar',
    description:
      'Answers questions about Ashwin Talwalkar — his work, projects, background, and interests — speaking as Ashwin. Powers the chat on ashwintalwalkar.com.',
    supportedInterfaces: [
      {
        url: `${baseUrl}${A2A_PATH}`,
        protocolBinding: 'JSONRPC',
        tenant: '',
        protocolVersion: A2A_PROTOCOL_VERSION,
      },
    ],
    provider: { organization: 'Ashwin Talwalkar', url: 'https://ashwintalwalkar.com' },
    version: '2.0.0',
    capabilities: {
      streaming: true,
      pushNotifications: false,
      extensions: [
        {
          uri: A2UI_EXTENSION_URI,
          description: 'Answers are rendered as A2UI v0.9 surfaces for clients that support the chat catalog. Other clients get plain text.',
          required: false,
          params: {
            supportedCatalogIds: [CATALOG_ID],
            acceptsInlineCatalogs: false,
          },
        },
      ],
    },
    securitySchemes: {},
    securityRequirements: [],
    defaultInputModes: ['text/plain', A2UI_MIME_TYPE],
    defaultOutputModes: ['text/plain', A2UI_MIME_TYPE],
    skills: [
      {
        id: 'ask-ashwin',
        name: 'Ask Ashwin',
        description: `Ask anything about Ashwin. Answers are grounded in live data sources: ${getAll()
          .map((c) => c.name)
          .join(', ')}.`,
        tags: ['portfolio', 'career', 'projects', ...getAll().map((c) => c.name)],
        examples: [
          'What are you working on right now?',
          'What projects have you built?',
          'What other interests do you have?',
        ],
        inputModes: [],
        outputModes: [],
        securityRequirements: [],
      },
    ],
    signatures: [],
  }
}
