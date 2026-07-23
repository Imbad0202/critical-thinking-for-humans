import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { createAnswerHandler } from '../api/answer.mjs'
import { createPublishDailyHandler } from '../api/cron/publish-daily.mjs'
import { createDailyHandler } from '../api/daily.mjs'
import { secondsUntilNextTaipeiDay, taipeiDateKey } from '../server/daily-date.mjs'
import { createStaticPublicProvider } from '../server/content-provider.mjs'
import { validatePrivateRecord } from '../server/daily-schema.mjs'
import {
  DailyServiceError,
  publishScheduledDaily,
  resolveDailyCase,
} from '../server/daily-service.mjs'


const DATE = '2026-07-12'
const NOW = new Date('2026-07-12T04:00:00.000Z')
const CASE_URL = new URL(
  '../content/daily/cases/daily-2026-07-12-measurement-gap.json',
  import.meta.url,
)
const publicCase = JSON.parse(await readFile(CASE_URL, 'utf8'))

const privateRecord = Object.freeze({
  schemaVersion: 1,
  contentId: publicCase.id,
  publishDate: DATE,
  case: publicCase,
  answers: [{
    itemId: 'measurement-gap',
    correctOptionId: 'A',
    hitFeedback: '命中代理指標與真正結果之間的落差。',
    missFeedback: '回到主張實際量到的結果。',
    hitHeading: '推理命中',
    missHeading: '線索已更新',
    hint: '比較代理指標與真正結果。',
    structure: 'proxy_mismatch',
    structureLabel: '指標錯置',
    reward: '裂紋量尺',
    xp: { hit: 40, miss: 15 },
  }],
})

const privateProvider = Object.freeze({
  kind: 'test-private',
  writable: false,
  async getPublished(dateKey) {
    return dateKey === DATE ? privateRecord : null
  },
})

const allowAllRateLimiter = Object.freeze({
  consume() {
    return { allowed: true, retryAfter: 60, headers: {} }
  },
})

const staticProvider = createStaticPublicProvider()
const clock = () => NOW
const resolveNoPrivateProvider = async () => null
const resolvePrivateProvider = async () => privateProvider

function keysOf(value, into = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => keysOf(item, into))
  } else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      into.push(key)
      keysOf(nested, into)
    }
  }
  return into
}

async function json(response) {
  const body = await response.json()
  return { response, body }
}

function answerRequest(body) {
  return new Request('https://casebook.test/api/answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
}

test('Taipei day changes at +08:00 midnight and cache never crosses it', () => {
  assert.equal(taipeiDateKey('2026-07-12T15:59:59.999Z'), '2026-07-12')
  assert.equal(taipeiDateKey('2026-07-12T16:00:00.000Z'), '2026-07-13')
  assert.equal(secondsUntilNextTaipeiDay('2026-07-12T15:59:59.750Z'), 0)
  assert.equal(secondsUntilNextTaipeiDay('2026-07-12T15:59:58.750Z'), 1)
})

test('GET /api/daily serves a public preview without grading when private storage is absent', async () => {
  const handler = createDailyHandler({ clock, staticProvider, resolvePrivateProvider: resolveNoPrivateProvider })
  const { response, body } = await json(await handler(new Request('https://casebook.test/api/daily')))

  assert.equal(response.status, 200)
  assert.equal(body.date, DATE)
  assert.equal(body.timeZone, 'Asia/Taipei')
  assert.equal(body.contentId, publicCase.id)
  assert.equal(body.answerable, false)
  assert.equal(body.gradingAvailable, false)
  assert.deepEqual(body.case, publicCase)
  assert.equal(keysOf(body.case).includes('correctOptionId'), false)
  assert.equal(
    response.headers.get('cache-control'),
    `public, max-age=0, s-maxage=${secondsUntilNextTaipeiDay(NOW)}, must-revalidate`,
  )
  assert.match(response.headers.get('cache-control'), /must-revalidate/)
  assert.doesNotMatch(response.headers.get('cache-control'), /stale-while-revalidate/)
})

test('GET /api/daily marks a privately published choice case answerable', async () => {
  const handler = createDailyHandler({ clock, staticProvider, resolvePrivateProvider })
  const { response, body } = await json(await handler(new Request('https://casebook.test/api/daily')))

  assert.equal(response.status, 200)
  assert.equal(body.date, DATE)
  assert.equal(body.answerable, true)
  assert.equal(body.gradingAvailable, true)
  assert.equal(body.case.id, privateRecord.contentId)
  assert.equal(keysOf(body.case).includes('correctOptionId'), false)
  assert.equal(
    response.headers.get('cache-control'),
    `public, max-age=0, s-maxage=${secondsUntilNextTaipeiDay(NOW)}, must-revalidate`,
  )
})

test('GET /api/daily briefly caches a missing private publication so it can become answerable', async () => {
  let publishedRecord = null
  const transitioningProvider = {
    async getPublished(dateKey) {
      return dateKey === DATE ? publishedRecord : null
    },
  }
  const handler = createDailyHandler({
    clock,
    staticProvider,
    resolvePrivateProvider: async () => transitioningProvider,
  })

  const preview = await json(await handler(new Request('https://casebook.test/api/daily')))
  assert.equal(preview.body.answerable, false)
  assert.equal(
    preview.response.headers.get('cache-control'),
    'public, max-age=0, s-maxage=60, must-revalidate',
  )

  publishedRecord = privateRecord
  const published = await json(await handler(new Request('https://casebook.test/api/daily')))
  assert.equal(published.body.answerable, true)
  assert.equal(
    published.response.headers.get('cache-control'),
    `public, max-age=0, s-maxage=${secondsUntilNextTaipeiDay(NOW)}, must-revalidate`,
  )
})

test('private records require an embedded case to use the same publish date', () => {
  assert.throws(
    () => validatePrivateRecord({ ...privateRecord, publishDate: '2026-07-13' }),
    {
      name: 'SchemaValidationError',
      message: '$.case.publishDate: must equal publishDate',
    },
  )
})

test('Daily service rejects a provider record for a different requested date', async () => {
  const wrongDate = '2026-07-11'
  const wrongDateRecord = {
    ...privateRecord,
    publishDate: wrongDate,
    case: { ...publicCase, publishDate: wrongDate },
  }

  await assert.rejects(
    resolveDailyCase({
      dateKey: DATE,
      baseUrl: 'https://casebook.test/api/daily',
      privateProvider: { async getPublished() { return wrongDateRecord } },
      staticProvider,
    }),
    (error) => error instanceof DailyServiceError
      && error.code === 'CONTENT_MISMATCH'
      && error.status === 503,
  )
})

test('Daily service allows cyclic static cases to keep their canonical publish date', async () => {
  const rotationUrl = new URL('../content/daily/rotation.json', import.meta.url)
  const rotation = JSON.parse(await readFile(rotationUrl, 'utf8'))
  const wrapDay = new Date(`${rotation.cycleAnchorDate}T00:00:00Z`)
  wrapDay.setUTCDate(wrapDay.getUTCDate() + rotation.entries.length)
  const cyclicDate = wrapDay.toISOString().slice(0, 10)
  const { case: _embeddedCase, ...cyclicRecord } = {
    ...privateRecord,
    publishDate: cyclicDate,
  }
  const result = await resolveDailyCase({
    dateKey: cyclicDate,
    baseUrl: 'https://casebook.test/api/daily',
    privateProvider: { async getPublished() { return cyclicRecord } },
    staticProvider,
  })

  assert.equal(result.answerable, true)
  assert.equal(result.case.id, cyclicRecord.contentId)
  assert.equal(result.case.publishDate, DATE)
  assert.equal(cyclicRecord.publishDate, cyclicDate)
})

test('Daily publish rejects a wrong-date provider result even if the provider skips validation', async () => {
  const wrongDateRecord = {
    ...privateRecord,
    publishDate: '2026-07-11',
    case: { ...publicCase, publishDate: '2026-07-11' },
  }

  await assert.rejects(
    publishScheduledDaily({
      dateKey: DATE,
      baseUrl: 'https://casebook.test/api/cron/publish-daily',
      privateProvider: {
        writable: true,
        async publish() {
          return { record: wrongDateRecord, status: 'published' }
        },
      },
      staticProvider,
    }),
    (error) => error instanceof DailyServiceError
      && error.code === 'CONTENT_MISMATCH'
      && error.status === 503,
  )
})

test('POST /api/answer returns only the selected ruling, never the answer key or verdict map', async () => {
  const handler = createAnswerHandler({
    clock,
    staticProvider,
    resolvePrivateProvider,
    rateLimiter: allowAllRateLimiter,
  })
  const request = answerRequest({
    contentId: publicCase.id,
    itemId: 'measurement-gap',
    answer: 'C',
  })
  const { response, body } = await json(await handler(request))

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(body.date, DATE)
  assert.equal(body.caseId, publicCase.id)
  assert.equal(body.itemId, 'measurement-gap')
  assert.equal(body.selectedOptionId, 'C')
  assert.equal(body.outcome, 'miss')
  assert.equal(body.xp, 15)
  assert.equal(body.reveal.feedback, privateRecord.answers[0].missFeedback)
  const responseKeys = new Set(keysOf(body))
  for (const forbidden of ['answers', 'answerKey', 'correct', 'correctOptionId', 'solution', 'verdicts']) {
    assert.equal(responseKeys.has(forbidden), false, forbidden)
  }
})

test('POST /api/answer rejects a stale optional date before grading', async () => {
  const handler = createAnswerHandler({
    clock,
    staticProvider,
    resolvePrivateProvider,
    rateLimiter: allowAllRateLimiter,
  })
  const request = answerRequest({
    contentId: publicCase.id,
    itemId: 'measurement-gap',
    answer: 'A',
    date: '2026-07-11',
  })
  const { response, body } = await json(await handler(request))

  assert.equal(response.status, 409)
  assert.equal(body.error.code, 'CONTENT_CONFLICT')
})

test('POST /api/answer accepts canonical aliases but rejects conflicts', async () => {
  const handler = createAnswerHandler({
    clock,
    staticProvider,
    resolvePrivateProvider,
    rateLimiter: allowAllRateLimiter,
  })
  const aliasResult = await json(await handler(answerRequest({
    caseId: publicCase.id,
    itemId: 'measurement-gap',
    selectedOptionId: 'A',
  })))
  assert.equal(aliasResult.response.status, 200)
  assert.equal(aliasResult.body.outcome, 'hit')

  const conflictResult = await json(await handler(answerRequest({
    contentId: publicCase.id,
    caseId: 'different-case',
    itemId: 'measurement-gap',
    answer: 'A',
  })))
  assert.equal(conflictResult.response.status, 400)
  assert.equal(conflictResult.body.error.code, 'INVALID_REQUEST')
})

test('GET cron rejects missing or weak authorization before resolving storage', async () => {
  let resolved = false
  const handler = createPublishDailyHandler({
    env: { CRON_SECRET: 'too-short' },
    clock,
    staticProvider,
    resolvePrivateProvider: async () => { resolved = true; return privateProvider },
  })
  const { response, body } = await json(await handler(new Request('https://casebook.test/api/cron/publish-daily', {
    headers: { Authorization: 'Bearer too-short' },
  })))

  assert.equal(response.status, 401)
  assert.equal(body.error.code, 'UNAUTHORIZED')
  assert.equal(resolved, false)
})

test('GET cron publishes the next Taipei day and exposes no private record', async () => {
  const tomorrow = '2026-07-13'
  const scheduled = {
    ...privateRecord,
    publishDate: tomorrow,
    case: { ...publicCase, publishDate: tomorrow },
  }
  const writableProvider = {
    writable: true,
    async publish(dateKey, { validate }) {
      assert.equal(dateKey, tomorrow)
      await validate(scheduled)
      return { record: scheduled, status: 'published' }
    },
  }
  const secret = 'test-cron-secret-at-least-16-characters'
  const handler = createPublishDailyHandler({
    env: { CRON_SECRET: secret },
    clock,
    staticProvider,
    resolvePrivateProvider: async () => writableProvider,
  })
  const { response, body } = await json(await handler(new Request('https://casebook.test/api/cron/publish-daily', {
    headers: { Authorization: `Bearer ${secret}` },
  })))

  assert.equal(response.status, 200)
  assert.deepEqual(body, {
    schemaVersion: 1,
    date: tomorrow,
    timeZone: 'Asia/Taipei',
    contentId: publicCase.id,
    status: 'published',
  })
  assert.equal(keysOf(body).includes('answers'), false)
})
