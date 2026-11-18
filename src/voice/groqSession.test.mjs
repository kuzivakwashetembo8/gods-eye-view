import test from 'node:test';
import assert from 'node:assert/strict';
import { createGroqSession } from './groqSession.js';

test('Groq session is text-only and uses the Groq chat endpoint', async () => {
  const events = [];
  const requests = [];
  const actions = [];
  const session = createGroqSession({
    emit: (event) => events.push(event),
    runAction: async (name, args) => {
      actions.push({ name, args });
      return { ok: true };
    },
    fetchImpl: async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body) });
      return Response.json({
        content: { role: 'assistant', content: 'Ready.' },
        finishReason: 'stop',
        usage: { prompt_tokens: 2, completion_tokens: 2, total_tokens: 4 },
      });
    },
  });
  assert.equal(session.capabilities.textOnlyOnly, true);
  assert.throws(() => session.start(), /typed chat only/);
  session.start({ textOnly: true });
  assert.equal(session.getStartOptions().textOnly, true);
  assert.equal(session.sendText('Hello'), true);
  for (
    let i = 0;
    i < 8 && !events.some((event) => event.type === 'completion');
    i++
  )
    await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests[0].url, '/api/groq/chat');
  assert.deepEqual(requests[0].body.messages, [
    { role: 'user', content: 'Hello' },
  ]);
  assert.equal(actions.length, 0);
  assert.ok(events.some((event) => event.type === 'completion'));
  session.stop();
});
