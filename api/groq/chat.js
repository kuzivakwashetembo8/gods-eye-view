import { createGroqChatHandler } from '../../server/providers/groq/chat.js';

// Vercel supplies the request body as a stream when bodyParser is disabled.
// Require an exact HTTPS same-origin browser request before the API key is used.
function allowSameOrigin(req) {
  const host = String(req.headers?.host || '').toLowerCase();
  const origin = String(req.headers?.origin || '');
  if (!host || !origin || /[\s/?#@\\]/.test(host)) return false;
  try {
    const parsed = new URL(origin);
    return (
      parsed.protocol === 'https:' &&
      parsed.host.toLowerCase() === host &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname === '/' &&
      !parsed.search &&
      !parsed.hash &&
      (!req.headers?.['sec-fetch-site'] ||
        ['same-origin', 'none'].includes(req.headers['sec-fetch-site']))
    );
  } catch {
    return false;
  }
}

export const config = { api: { bodyParser: false } };

export default createGroqChatHandler({
  resolveRequestOrigin: allowSameOrigin,
});
