# Groq typed-chat provider integration

- **Date:** 2026-11-18
- **Time:** 20:35:14
- **Timezone:** Africa/Johannesburg (UTC+02:00)
- **Title:** Add Groq as a typed-chat-only AI provider
- **Developer:** GPT-6
- **Repository:** `kuzivakwashetembo8/gods-eye-view`
- **Branch:** `feature/groq-typed-chat`
- **Scope decision:** Typed chat only. Groq does not provide voice, Live sessions, microphone capture, or Realtime credentials in this integration.

## Summary

Added Groq Cloud Chat Completions using the OpenAI-compatible endpoint:

- API base: `https://api.groq.com/openai/v1`
- Chat endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Secret: `GROQ_API_KEY` (server-side only)
- Model setting: `GROQ_CHAT_MODEL`
- Default model: `openai/gpt-oss-20b`

The selected default model is documented by Groq as supporting tool use, while parallel tool use is not supported. Requests therefore disable parallel tool calls. The model can be changed through `GROQ_CHAT_MODEL`; check Groq's current model catalogue before choosing another model.

The integration reuses God's Eye View's validated OpenAI-compatible chat request/response handling, conversation history validation, tool schemas, map actions, usage accounting, request-size bounds, same-origin checks, upstream timeout/redirect protections, and per-IP throttling. Groq is offered in the AI Provider selector as **Groq · typed chat only**. The voice/microphone control is hidden while Groq is selected.

## Configuration

Add the following to the local ignored `.env` file, or paste the API key into Provider Settings:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_CHAT_MODEL=openai/gpt-oss-20b
```

Optional per-IP typed-chat limit:

```dotenv
GEV_RATELIMIT_GROQ_CHAT_PER_MIN=30
```

Do not prefix the key with `VITE_`. It must never be bundled into browser code. Groq requires its own API key and billing/quota configuration; OpenAI and Gemini keys do not authenticate Groq.

## Files touched

### Server and provider integration

- `server/providers/openai/chat.js` — generalized the existing OpenAI-compatible server adapter so it can accept a provider ID, endpoint, storage flag, and provider-specific refusal policy; allowed namespaced model IDs; disabled parallel tool calls for Groq while preserving OpenAI's OAuth lock.
- `server/providers/groq/chat.js` — added the Groq adapter, server-side key/model resolution, Groq endpoint, and shared tool/context configuration.
- `server/providers/groq.js` — registered the same-origin `/api/groq/chat` middleware for development and preview servers only.
- `server/providers/local.js` — registered the Groq chat plugin in the local provider stack.

### Client and provider settings

- `src/keySetupCore.mjs` — added the `GROQ_API_KEY` registry entry and Groq Console key URL; this makes the key available in Provider Settings without exposing it to the client.
- `src/voice/textProtocol.js` — added the OpenAI-compatible Groq request, history, tool-result, and response protocol.
- `src/voice/groqSession.js` — added a typed-only session adapter; it rejects voice starts and never initializes audio.
- `src/voice/providerCapabilities.js` — labelled Groq as typed-chat-only in the provider catalogue and declared that it cannot resume voice.
- `src/voice/commands.js` — registered the Groq session factory.
- `src/voice/providerCommands.js` — prevents an active voice session from being resumed when switching to Groq; typed-chat sessions remain resumable.
- `src/voice/providerCommands.test.mjs` — verifies that switching from active voice to Groq does not attempt microphone startup.
- `src/voice/sessionCommands.js` — hides the microphone control for text-only providers and provides typed-chat-only status/help text.
- `src/ui/views/panels/VoiceControl.vue` — passes the button's hidden state through to the rendered control, changes the provider note for Groq, hides voice-only preferences, and removes voice-only preview prompts when Groq is selected.
- `src/standalone/tools.js` — enabled Groq in the standalone AI Provider list.

### Tests

- `src/textChatServer.test.mjs` — added Groq server-handler coverage for the endpoint, default model, tool calls, usage, auth header, no-store omission, and non-parallel tool-call configuration.
- `src/voice/textChat.test.mjs` — added Groq to the shared typed-chat orchestration tests.
- `src/voice/groqSession.test.mjs` — added text-only session coverage and verified that voice startup is rejected.
- `src/keySetupCore.test.mjs` — verifies the Groq key is registered as a server-only Provider Settings credential.

### Configuration and documentation

- `.env.example` — documented Groq key, model, and rate-limit variables.
- `SECURITY.md` — documented server-only handling of `GROQ_API_KEY`.
- `README.md` — documented Groq's typed-chat-only capability, API-key table entry, and configuration.
- `src/i18n/same-as-english.json` — marked the new Groq UI messages as intentionally untranslated for the existing locale catalogs.
- `documentations/README.md` — created the implementation log index.
- `documentations/2026-11-18-groq-typed-chat.md` — this detailed change record.

## Security and behavior notes

- The browser sends chat content to the same-origin `/api/groq/chat` route. Only the server calls Groq and attaches the bearer API key.
- The existing same-origin admission, bounded request/response handling, timeout, redirect refusal, sanitized errors, rejected-key cooldown, and rate limiter are reused.
- The key setup status endpoint reports presence only; it does not return the key or any suffix.
- Groq does not use the OpenAI Realtime or Gemini Live routes. The voice button is hidden while Groq is selected.
- The existing OpenAI OAuth policy remains in force for OpenAI typed chat; it does not block Groq.

## Verification status

Automated tests were added/extended but **were not executed in this GitHub editing session**. No build, test suite, live Groq API call, or manual UI verification is claimed. Before merging, run the repository's supported Node version and execute:

```bash
npm test
npm run format:check
npm run i18n
npm run build
```

Then configure a real `GROQ_API_KEY` locally and verify: selecting Groq opens typed chat; a text reply works; a map-action tool call executes and returns a paired result; voice controls remain unavailable; missing/invalid keys and rate limits fail safely.

## External technical references

- [Groq Tool Use Overview](https://console.groq.com/docs/tool-use/overview) — supported tool-use models and parallel tool-call capability.
- [Groq Supported Models](https://console.groq.com/docs/models) — model IDs and model catalogue endpoint.
- [Groq GPT-OSS 20B model card](https://console.groq.com/docs/model/openai/gpt-oss-20b) — model capabilities and default model details.


## Production deployment shortcut

**Date:** 2026-11-18  
**Time:** 21:17 (Africa/Johannesburg, UTC+02:00)  
**Title:** Expose Groq typed chat on Vercel  
**Developer:** GPT-6

### Why this was needed

The Vite middleware provider routes are available in local development but are not deployed as Vercel Functions. The production frontend therefore returned 404 for `/api/groq/chat`.

### Additional files changed

- `api/groq/chat.js` — adds a Vercel Node serverless function for `POST /api/groq/chat`. Disables automatic body parsing so the existing bounded streaming request reader remains in control. Requires an exact HTTPS same-origin request and rejects cross-site Fetch Metadata.
- `server/providers/common/textChat.js` — adds the injectable `resolveRequestOrigin` policy. Existing local OpenAI/Gemini/Groq middleware keeps the original local-host and proxy-header policy; the Vercel Groq function supplies its HTTPS same-origin policy.

### Deployment notes

- The Vercel function reuses the existing Groq adapter, server-side `GROQ_API_KEY`, model selection, request validation, response parsing, and rate limiter.
- No API key or other secret is embedded in client code.
- The production endpoint still needs a live POST smoke test after the deployment becomes READY. A GET request should return 405, not 404.
