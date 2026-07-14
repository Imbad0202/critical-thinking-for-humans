import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ContentProviderError,
  createBlobPrivateProvider,
} from '../server/content-provider.mjs'

const DATE = '2026-07-12'
const PREFIX = 'test-daily'
const TOKEN = 'test-token'
const PUBLISHED_PATH = `${PREFIX}/published/${DATE}.json`
const SCHEDULED_PATH = `${PREFIX}/scheduled/${DATE}.json`

const scheduledRecord = Object.freeze({
  schemaVersion: 1,
  contentId: 'measurement-gap',
  publishDate: DATE,
  answers: [{
    itemId: 'measurement-gap',
    correctOptionId: 'A',
    hitFeedback: '命中代理指標與真正結果之間的落差。',
    missFeedback: '回到主張實際量到的結果。',
  }],
})

function blobResult(record) {
  const body = JSON.stringify(record)
  return {
    statusCode: 200,
    stream: new Response(body).body,
    blob: { size: new TextEncoder().encode(body).byteLength },
  }
}

function createRacingBlob({ racedRecord, putError = new Error('create-only write lost') }) {
  const reads = []
  const puts = []
  let publishedReads = 0

  const blob = {
    async get(pathname, options) {
      reads.push({ pathname, options })
      if (pathname === PUBLISHED_PATH) {
        publishedReads += 1
        return publishedReads === 1 || !racedRecord ? null : blobResult(racedRecord)
      }
      assert.equal(pathname, SCHEDULED_PATH)
      return blobResult(scheduledRecord)
    },
    async put(pathname, body, options) {
      puts.push({ pathname, body, options })
      throw putError
    },
  }

  return { blob, putError, puts, reads }
}

function providerFor(blob) {
  return createBlobPrivateProvider({ blob, token: TOKEN, prefix: PREFIX })
}

test('Blob published reads bypass cached misses during the publication transition', async () => {
  const reads = []
  let published = null
  const blob = {
    async get(pathname, options) {
      reads.push({ pathname, options })
      return published ? blobResult(published) : null
    },
    async put() {
      throw new Error('not used')
    },
  }
  const provider = providerFor(blob)

  assert.equal(await provider.getPublished(DATE), null)
  published = scheduledRecord
  assert.deepEqual(await provider.getPublished(DATE), scheduledRecord)
  assert.deepEqual(reads, [
    {
      pathname: PUBLISHED_PATH,
      options: { access: 'private', token: TOKEN, useCache: false },
    },
    {
      pathname: PUBLISHED_PATH,
      options: { access: 'private', token: TOKEN, useCache: false },
    },
  ])
})

test('Blob publish writes a validated scheduled record when no publication exists', async () => {
  const reads = []
  const puts = []
  const validated = []
  const blob = {
    async get(pathname, options) {
      reads.push({ pathname, options })
      return pathname === PUBLISHED_PATH ? null : blobResult(scheduledRecord)
    },
    async put(pathname, body, options) {
      puts.push({ pathname, body, options })
    },
  }

  const result = await providerFor(blob).publish(DATE, {
    validate: async (record) => validated.push(record),
  })

  assert.deepEqual(result, { record: scheduledRecord, status: 'published' })
  assert.deepEqual(validated, [scheduledRecord])
  assert.equal(reads.every(({ options }) => options.useCache === false), true)
  assert.deepEqual(puts, [{
    pathname: PUBLISHED_PATH,
    body: JSON.stringify(scheduledRecord),
    options: {
      access: 'private',
      token: TOKEN,
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: false,
    },
  }])
})

test('Blob publish accepts canonical same-content existing and scheduled records', async () => {
  const existingRecord = {
    answers: structuredClone(scheduledRecord.answers),
    publishDate: scheduledRecord.publishDate,
    contentId: scheduledRecord.contentId,
    schemaVersion: scheduledRecord.schemaVersion,
  }
  const validated = []
  const blob = {
    async get(pathname) {
      return blobResult(pathname === PUBLISHED_PATH ? existingRecord : scheduledRecord)
    },
    async put() {
      throw new Error('not used')
    },
  }

  const result = await providerFor(blob).publish(DATE, {
    validate: async (record) => validated.push(record),
  })

  assert.equal(result.status, 'already-published')
  assert.deepEqual(result.record, existingRecord)
  assert.deepEqual(validated, [existingRecord, scheduledRecord])
})

test('Blob publish accepts an existing record after its scheduled source is removed', async () => {
  const blob = {
    async get(pathname) {
      return pathname === PUBLISHED_PATH ? blobResult(scheduledRecord) : null
    },
    async put() {
      throw new Error('not used')
    },
  }

  assert.deepEqual(await providerFor(blob).publish(DATE), {
    record: scheduledRecord,
    status: 'already-published',
  })
})

test('Blob publish rejects an existing publication that differs from its scheduled record', async () => {
  const existingRecord = structuredClone(scheduledRecord)
  existingRecord.answers[0].hitFeedback = '已發布但與排程內容不同。'
  const reads = []
  const blob = {
    async get(pathname, options) {
      reads.push({ pathname, options })
      if (pathname === PUBLISHED_PATH) return blobResult(existingRecord)
      assert.equal(pathname, SCHEDULED_PATH)
      return blobResult(scheduledRecord)
    },
    async put() {
      throw new Error('not used')
    },
  }

  await assert.rejects(providerFor(blob).publish(DATE), (error) => {
    assert.equal(error instanceof ContentProviderError, true)
    assert.equal(error.code, 'BLOB_PUBLISH_CONFLICT')
    return true
  })
  assert.equal(reads.every(({ options }) => options.useCache === false), true)
})

test('Blob publish treats a canonical same-content race as idempotent success', async () => {
  const racedRecord = {
    answers: [{
      missFeedback: scheduledRecord.answers[0].missFeedback,
      hitFeedback: scheduledRecord.answers[0].hitFeedback,
      correctOptionId: scheduledRecord.answers[0].correctOptionId,
      itemId: scheduledRecord.answers[0].itemId,
    }],
    publishDate: scheduledRecord.publishDate,
    contentId: scheduledRecord.contentId,
    schemaVersion: scheduledRecord.schemaVersion,
  }
  const { blob, puts, reads } = createRacingBlob({ racedRecord })
  const validated = []

  const result = await providerFor(blob).publish(DATE, {
    validate: async (record) => validated.push(record),
  })

  assert.equal(result.status, 'already-published')
  assert.deepEqual(result.record, racedRecord)
  assert.deepEqual(validated, [scheduledRecord, racedRecord])
  assert.deepEqual(reads, [
    {
      pathname: PUBLISHED_PATH,
      options: { access: 'private', token: TOKEN, useCache: false },
    },
    {
      pathname: SCHEDULED_PATH,
      options: { access: 'private', token: TOKEN, useCache: false },
    },
    {
      pathname: PUBLISHED_PATH,
      options: { access: 'private', token: TOKEN, useCache: false },
    },
  ])
  assert.deepEqual(puts, [{
    pathname: PUBLISHED_PATH,
    body: JSON.stringify(scheduledRecord),
    options: {
      access: 'private',
      token: TOKEN,
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: false,
    },
  }])
})

test('Blob publish rejects a same-id and same-date race with different content', async () => {
  const racedRecord = structuredClone(scheduledRecord)
  racedRecord.answers[0].hitFeedback = '另一個仍符合 schema 的答案內容。'
  const { blob, putError } = createRacingBlob({ racedRecord })
  const validated = []

  await assert.rejects(
    providerFor(blob).publish(DATE, {
      validate: async (record) => validated.push(record),
    }),
    (error) => {
      assert.equal(error instanceof ContentProviderError, true)
      assert.equal(error.code, 'BLOB_PUBLISH_CONFLICT')
      assert.equal(error.cause, putError)
      return true
    },
  )
  assert.deepEqual(validated, [scheduledRecord, racedRecord])
})

test('Blob publish revalidates raced content before accepting it', async () => {
  const racedRecord = structuredClone(scheduledRecord)
  const { blob } = createRacingBlob({ racedRecord })
  const validationError = new Error('raced record no longer matches its public case')
  let validationCount = 0

  await assert.rejects(
    providerFor(blob).publish(DATE, {
      validate: async () => {
        validationCount += 1
        if (validationCount === 2) throw validationError
      },
    }),
    (error) => error === validationError,
  )
  assert.equal(validationCount, 2)
})

test('Blob publish preserves an explicit write failure when no race winner exists', async () => {
  const { blob, putError } = createRacingBlob({ racedRecord: null })

  await assert.rejects(providerFor(blob).publish(DATE), (error) => {
    assert.equal(error instanceof ContentProviderError, true)
    assert.equal(error.code, 'BLOB_WRITE_FAILED')
    assert.equal(error.cause, putError)
    return true
  })
})

test('Blob publish preserves both write and race-read failures for diagnosis', async () => {
  const putError = new Error('create-only write failed')
  const readError = new Error('winner read failed')
  let publishedReads = 0
  const blob = {
    async get(pathname) {
      if (pathname === SCHEDULED_PATH) return blobResult(scheduledRecord)
      publishedReads += 1
      if (publishedReads === 1) return null
      throw readError
    },
    async put() {
      throw putError
    },
  }

  await assert.rejects(providerFor(blob).publish(DATE), (error) => {
    assert.equal(error instanceof ContentProviderError, true)
    assert.equal(error.code, 'BLOB_WRITE_FAILED')
    assert.equal(error.cause instanceof AggregateError, true)
    assert.equal(error.cause.errors[0], putError)
    assert.equal(error.cause.errors[1] instanceof ContentProviderError, true)
    assert.equal(error.cause.errors[1].code, 'BLOB_READ_FAILED')
    assert.equal(error.cause.errors[1].cause, readError)
    return true
  })
})
