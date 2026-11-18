import { createGroqChatHandler } from './groq/chat.js';

/** Server-only Groq Chat Completions endpoint; no voice or token routes. */
function groqChatProxy({ annotationGuidance, realtime = {} } = {}) {
  const handler = createGroqChatHandler({ ...realtime, annotationGuidance });
  function install(middlewares) {
    middlewares.use('/api/groq/chat', handler);
  }
  return {
    name: 'groq-chat-proxy',
    configureServer(server) {
      install(server.middlewares);
    },
    configurePreviewServer(server) {
      install(server.middlewares);
    },
  };
}

export { groqChatProxy };
