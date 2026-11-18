import { createOpenAiChatHandler } from '../openai/chat.js';

const object = (value) =>
  value && typeof value === 'object' && !Array.isArray(value);

export const GROQ_DEFAULT_CHAT_MODEL = 'openai/gpt-oss-20b';

/**
 * Groq's OpenAI-compatible Chat Completions endpoint, used for typed chat only.
 * The shared adapter validates history/tool calls and keeps the API key server-side.
 */
export function createGroqChatHandler({
  annotationGuidance,
  tools = GEV_REALTIME_TOOLS,
  overpassConfigured = () => resolveOverpassUpstreams().length > 0,
  resolveApiKey = () => process.env.GROQ_API_KEY,
  resolveChatModel = () =>
    process.env.GROQ_CHAT_MODEL || GROQ_DEFAULT_CHAT_MODEL,
  ...options
} = {}) {
  return createOpenAiChatHandler({
    ...options,
    provider: 'groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    includeStore: false,
    customRefuse: () => null,
    resolveApiKey,
    resolveChatModel,
    resolveProviderRateLimit: () => process.env.GEV_RATELIMIT_GROQ_PER_MIN,
    tools,
    annotationGuidance,
    overpassConfigured,
  });
}
