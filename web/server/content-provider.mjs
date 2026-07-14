import {
  validatePrivateRecord,
  validatePublicCase,
  validateRotation,
} from './daily-schema.mjs'
import {
  calendarDayDifference,
  isDateKey,
  normalizedModulo,
} from './daily-date.mjs'

const STATIC_ROOT = new URL('../content/daily/', import.meta.url)
const MAX_PRIVATE_RECORD_BYTES = 1_000_000

export class ContentProviderError extends Error {
  constructor(code, cause) {
    super(code, cause ? { cause } : undefined)
    this.name = 'ContentProviderError'
    this.code = code
  }
}

export function selectRotationEntry(rotation, dateKey) {
  validateRotation(rotation)
  if (!isDateKey(dateKey)) throw new ContentProviderError('DATE_KEY_INVALID')
  const offset = calendarDayDifference(dateKey, rotation.cycleAnchorDate)
  return rotation.entries[normalizedModulo(offset, rotation.entries.length)]
}

function parseJson(text, code) {
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new ContentProviderError(code, error)
  }
}

async function defaultReadLocalJson(relativePath) {
  const { readFile } = await import('node:fs/promises')
  return JSON.parse(await readFile(new URL(relativePath, STATIC_ROOT), 'utf8'))
}

function staticUrl(baseUrl, relativePath) {
  const base = new URL(baseUrl)
  if (!['http:', 'https:'].includes(base.protocol)) throw new ContentProviderError('STATIC_ORIGIN_INVALID')
  return new URL(`/content/daily/${relativePath}`, base.origin)
}

export function createStaticPublicProvider({
  readLocalJson = defaultReadLocalJson,
  fetchImpl = globalThis.fetch,
} = {}) {
  let rotationPromise
  const casePromises = new Map()

  async function readJson(relativePath, baseUrl) {
    try {
      return await readLocalJson(relativePath)
    } catch (error) {
      if (error?.name === 'SyntaxError') throw new ContentProviderError('STATIC_CONTENT_INVALID', error)
      if (typeof fetchImpl !== 'function' || !baseUrl) throw new ContentProviderError('STATIC_CONTENT_UNAVAILABLE', error)
    }

    let response
    try {
      response = await fetchImpl(staticUrl(baseUrl, relativePath), {
        headers: { Accept: 'application/json' },
        redirect: 'error',
      })
    } catch (error) {
      throw new ContentProviderError('STATIC_CONTENT_UNAVAILABLE', error)
    }
    if (!response.ok) throw new ContentProviderError('STATIC_CONTENT_UNAVAILABLE')
    return parseJson(await response.text(), 'STATIC_CONTENT_INVALID')
  }

  async function getRotation(baseUrl) {
    rotationPromise ??= readJson('rotation.json', baseUrl).then((rotation) => validateRotation(rotation))
    try {
      return await rotationPromise
    } catch (error) {
      rotationPromise = undefined
      throw error
    }
  }

  async function getCase(path, baseUrl) {
    if (!casePromises.has(path)) {
      casePromises.set(path, readJson(path, baseUrl).then((dailyCase) => validatePublicCase(dailyCase)))
    }
    try {
      return await casePromises.get(path)
    } catch (error) {
      casePromises.delete(path)
      throw error
    }
  }

  return Object.freeze({
    kind: 'static-public',
    async getDaily(dateKey, { baseUrl } = {}) {
      const rotation = await getRotation(baseUrl)
      const entry = selectRotationEntry(rotation, dateKey)
      const dailyCase = await getCase(entry.path, baseUrl)
      if (dailyCase.id !== entry.caseId || dailyCase.publishDate !== entry.date) {
        throw new ContentProviderError('STATIC_CONTENT_MISMATCH')
      }
      return { case: dailyCase, rotationId: rotation.id }
    },
  })
}

function parseEnvRecords(raw) {
  const parsed = parseJson(raw, 'ENV_CONTENT_INVALID')
  const records = Array.isArray(parsed?.records) ? parsed.records : [parsed]
  if (Array.isArray(parsed?.records)) {
    if (parsed.schemaVersion !== 1 || Object.keys(parsed).some((key) => !['schemaVersion', 'records'].includes(key))) {
      throw new ContentProviderError('ENV_CONTENT_INVALID')
    }
  }
  records.forEach((record) => validatePrivateRecord(record))
  const dates = records.map((record) => record.publishDate)
  if (new Set(dates).size !== dates.length) throw new ContentProviderError('ENV_CONTENT_DUPLICATE_DATE')
  return records
}

export function createEnvPrivateProvider(raw) {
  if (typeof raw !== 'string' || raw.length === 0) throw new ContentProviderError('ENV_CONTENT_MISSING')
  let records
  const getRecords = () => (records ??= parseEnvRecords(raw))

  return Object.freeze({
    kind: 'env-private',
    writable: false,
    async getPublished(dateKey) {
      if (!isDateKey(dateKey)) throw new ContentProviderError('DATE_KEY_INVALID')
      return getRecords().find((record) => record.publishDate === dateKey) ?? null
    },
    async publish() {
      throw new ContentProviderError('PROVIDER_READ_ONLY')
    },
  })
}

function blobOptions(token, extra = {}) {
  return token ? { access: 'private', token, ...extra } : { access: 'private', ...extra }
}

async function readBlobRecord(blob, pathname, token, options = {}) {
  let result
  try {
    result = await blob.get(pathname, blobOptions(token, options))
  } catch (error) {
    throw new ContentProviderError('BLOB_READ_FAILED', error)
  }
  if (!result) return null
  if (result.statusCode === 404) return null
  if (result.statusCode !== 200 || !result.stream) throw new ContentProviderError('BLOB_READ_FAILED')
  if (Number(result.blob?.size) > MAX_PRIVATE_RECORD_BYTES) throw new ContentProviderError('BLOB_RECORD_TOO_LARGE')

  const raw = await new Response(result.stream).text()
  if (new TextEncoder().encode(raw).byteLength > MAX_PRIVATE_RECORD_BYTES) {
    throw new ContentProviderError('BLOB_RECORD_TOO_LARGE')
  }
  const record = parseJson(raw, 'BLOB_CONTENT_INVALID')
  validatePrivateRecord(record)
  return record
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function normalizeBlobPrefix(value = 'daily') {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9/_-]*$/.test(value) || value.includes('..')) {
    throw new ContentProviderError('BLOB_PREFIX_INVALID')
  }
  return value.replace(/\/+$/, '')
}

export function createBlobPrivateProvider({ blob, token, prefix = 'daily' }) {
  if (!blob || typeof blob.get !== 'function' || typeof blob.put !== 'function') {
    throw new ContentProviderError('BLOB_SDK_INVALID')
  }
  const safePrefix = normalizeBlobPrefix(prefix)
  const pathFor = (state, dateKey) => `${safePrefix}/${state}/${dateKey}.json`

  return Object.freeze({
    kind: 'vercel-blob-private',
    writable: true,
    getPublished(dateKey) {
      if (!isDateKey(dateKey)) throw new ContentProviderError('DATE_KEY_INVALID')
      // A date transitions from missing to published at most once. Bypass the
      // Blob CDN so a cached miss cannot outlive /api/daily's short fallback TTL.
      return readBlobRecord(blob, pathFor('published', dateKey), token, { useCache: false })
    },
    async publish(dateKey, { validate } = {}) {
      if (!isDateKey(dateKey)) throw new ContentProviderError('DATE_KEY_INVALID')
      const freshRead = { useCache: false }
      const publishedPath = pathFor('published', dateKey)
      const scheduledPath = pathFor('scheduled', dateKey)
      const existing = await readBlobRecord(blob, publishedPath, token, freshRead)
      const scheduled = await readBlobRecord(blob, scheduledPath, token, freshRead)
      if (existing) {
        if (existing.publishDate !== dateKey) throw new ContentProviderError('BLOB_CONTENT_MISMATCH')
        if (validate) await validate(existing)
        if (scheduled) {
          if (scheduled.publishDate !== dateKey) throw new ContentProviderError('BLOB_CONTENT_MISMATCH')
          if (validate) await validate(scheduled)
          if (canonicalJson(existing) !== canonicalJson(scheduled)) {
            throw new ContentProviderError('BLOB_PUBLISH_CONFLICT')
          }
        }
        return { record: existing, status: 'already-published' }
      }

      if (!scheduled) return null
      if (scheduled.publishDate !== dateKey) throw new ContentProviderError('BLOB_CONTENT_MISMATCH')
      if (validate) await validate(scheduled)

      try {
        await blob.put(
          publishedPath,
          JSON.stringify(scheduled),
          blobOptions(token, {
            contentType: 'application/json; charset=utf-8',
            addRandomSuffix: false,
            allowOverwrite: false,
          }),
        )
        return { record: scheduled, status: 'published' }
      } catch (error) {
        // A concurrent cron invocation may have won the create-only write.
        let raced
        try {
          raced = await readBlobRecord(blob, publishedPath, token, freshRead)
        } catch (readError) {
          throw new ContentProviderError(
            'BLOB_WRITE_FAILED',
            new AggregateError([error, readError], 'Blob write failed and the race winner could not be read'),
          )
        }
        if (!raced) throw new ContentProviderError('BLOB_WRITE_FAILED', error)
        if (raced.publishDate !== dateKey) throw new ContentProviderError('BLOB_CONTENT_MISMATCH')
        if (validate) await validate(raced)
        if (canonicalJson(raced) !== canonicalJson(scheduled)) {
          throw new ContentProviderError('BLOB_PUBLISH_CONFLICT', error)
        }
        return { record: raced, status: 'already-published' }
      }
    },
  })
}

export async function createPrivateProvider({
  env = globalThis.process?.env ?? {},
  // Loaded only when Blob is selected; public-only deployments never touch it.
  loadBlob = () => import('@vercel/blob'),
} = {}) {
  const mode = env.DAILY_CONTENT_PROVIDER ?? 'auto'
  if (!['auto', 'none', 'env', 'blob'].includes(mode)) {
    throw new ContentProviderError('PROVIDER_MODE_INVALID')
  }
  if (mode === 'none') return null

  if (mode === 'env' || (mode === 'auto' && env.DAILY_PRIVATE_CONTENT_JSON)) {
    return createEnvPrivateProvider(env.DAILY_PRIVATE_CONTENT_JSON)
  }

  // OIDC can exist on deployments that have no Blob store, so auto mode only
  // selects Blob for the store-specific token. OIDC users opt in with mode=blob.
  const hasBlobStoreToken = Boolean(env.BLOB_READ_WRITE_TOKEN)
  if (mode === 'blob' || (mode === 'auto' && hasBlobStoreToken)) {
    let blob
    try {
      blob = await loadBlob()
    } catch (error) {
      throw new ContentProviderError('BLOB_SDK_UNAVAILABLE', error)
    }
    return createBlobPrivateProvider({
      blob,
      token: env.BLOB_READ_WRITE_TOKEN,
      prefix: env.DAILY_BLOB_PREFIX ?? 'daily',
    })
  }

  return null
}

export function createPrivateProviderResolver(options = {}) {
  let pending
  return async () => {
    pending ??= createPrivateProvider(options)
    try {
      return await pending
    } catch (error) {
      pending = undefined
      throw error
    }
  }
}
