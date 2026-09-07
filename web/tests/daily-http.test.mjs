import assert from 'node:assert/strict'
import test from 'node:test'

import { createAnswerHandler } from '../api/answer.mjs'
import { readJsonBody } from '../server/http.mjs'

function streamedRequest(stream, headers = {}) {
  return new Request('https://casebook.test/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: stream,
    duplex: 'half',
  })
}

test('answer API cancels oversized streams before reading the rest or resolving storage', async () => {
  for (const headers of [{}, { 'Content-Length': '1' }]) {
    let pulls = 0
    let cancelled = false
    let resolvedStorage = false
    const stream = new ReadableStream({
      pull(controller) {
        pulls += 1
        if (pulls === 1) controller.enqueue(new Uint8Array(4097))
        else controller.error(new Error('the oversized remainder must not be read'))
      },
      cancel() { cancelled = true },
    }, { highWaterMark: 0 })
    const handler = createAnswerHandler({
      rateLimiter: { consume: () => ({ allowed: true, headers: {} }) },
      resolvePrivateProvider: async () => { resolvedStorage = true; return null },
    })

    const response = await handler(streamedRequest(stream, headers))

    assert.equal(response.status, 413)
    assert.equal((await response.json()).error.code, 'INVALID_REQUEST')
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal(pulls, 1)
    assert.equal(cancelled, true)
    assert.equal(resolvedStorage, false)
  }
})

test('JSON body limit counts incoming UTF-8 bytes and preserves split characters', async () => {
  const expected = { text: '中文🙂' }
  const bytes = new TextEncoder().encode(JSON.stringify(expected))
  const makeStream = () => new ReadableStream({
    start(controller) {
      for (const byte of bytes) controller.enqueue(Uint8Array.of(byte))
      controller.close()
    },
  })

  assert.deepEqual(
    await readJsonBody(streamedRequest(makeStream()), { maxBytes: bytes.length }),
    expected,
  )
  await assert.rejects(
    readJsonBody(streamedRequest(makeStream()), { maxBytes: bytes.length - 1 }),
    { name: 'RequestBodyError', code: 'PAYLOAD_TOO_LARGE', status: 413 },
  )
})

test('JSON reader reports malformed, empty, and failed streams as invalid requests', async () => {
  for (const [body, code] of [['{', 'INVALID_JSON'], ['', 'INVALID_BODY'], ['  ', 'INVALID_BODY']]) {
    const request = new Request('https://casebook.test/api/answer', { method: 'POST', body })
    await assert.rejects(readJsonBody(request), { name: 'RequestBodyError', code, status: 400 })
  }

  const stream = new ReadableStream({ start(controller) { controller.error(new Error('disconnected')) } })
  await assert.rejects(readJsonBody(streamedRequest(stream)), {
    name: 'RequestBodyError', code: 'INVALID_BODY', status: 400,
  })
})
