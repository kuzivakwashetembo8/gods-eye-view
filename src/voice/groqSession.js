import { createTextChat } from './textChat.js';

/** Groq is a text-only adapter; it deliberately never initializes audio. */
export function createGroqSession(options) {
  const chat = createTextChat({ ...options, provider: 'groq' });
  let textOnly = false;
  return {
    capabilities: { textOnlyOnly: true, pushToTalk: false },
    start(settings) {
      if (!settings?.textOnly)
        throw new Error(
          'Groq supports typed chat only; voice is unavailable.',
        );
      textOnly = true;
      return chat.start();
    },
    getStartOptions: () => (textOnly ? { textOnly: true } : {}),
    stop: (settings) => chat.stop(settings),
    cancelTurn: () => textOnly && chat.cancelTurn(),
    sendText: (text) => textOnly && chat.sendText(text),
    sendMapEvent: (event) => textOnly && chat.sendMapEvent(event),
  };
}
