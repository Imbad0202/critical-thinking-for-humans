#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  validatePrivateRecord,
  validatePrivateRecordAgainstCase,
  validatePublicCase,
} from '../server/daily-schema.mjs'
import { createBlobPrivateProvider } from '../server/content-provider.mjs'

const WEB_ROOT = fileURLToPath(new URL('../', import.meta.url))
const PRIVATE_DIR = join(WEB_ROOT, '.private', 'daily')
const PUBLIC_CASE_DIR = join(WEB_ROOT, 'content', 'daily', 'cases')
const MAX_RECORD_BYTES = 1_000_000
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

class OperatorError extends Error {
  constructor(message) {
    super(message)
    this.name = 'OperatorError'
  }
}

function helpText() {
  return `Daily private-case uploader

Usage:
  node scripts/upload-daily.mjs --dry-run
  node scripts/upload-daily.mjs [--date YYYY-MM-DD]
  node scripts/upload-daily.mjs --date YYYY-MM-DD --publish

Options:
  --dry-run           Validate every selected record without network access.
  --date YYYY-MM-DD   Validate/upload only that dated file.
  --publish           Promote one validated scheduled record immediately.
  -h, --help          Show this help.

Input:
  .private/daily/YYYY-MM-DD.json

Upload destination:
  <DAILY_BLOB_PREFIX or daily>/scheduled/YYYY-MM-DD.json

Credentials for a real upload:
  BLOB_READ_WRITE_TOKEN or VERCEL_OIDC_TOKEN

The command never prints record bodies, prompts, feedback, or answer keys.
Existing Blob records are not overwritten. An identical record is treated as
already uploaded; different content at the same date is a safe conflict.`
}

function parseArgs(argv) {
  const options = { date: null, dryRun: false, help: false, publish: false }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '-h' || argument === '--help') {
      options.help = true
    } else if (argument === '--dry-run') {
      options.dryRun = true
    } else if (argument === '--publish') {
      options.publish = true
    } else if (argument === '--date') {
      const date = argv[index + 1]
      if (!date || !DATE_PATTERN.test(date)) {
        throw new OperatorError('--date requires YYYY-MM-DD.')
      }
      if (options.date) throw new OperatorError('--date may only be provided once.')
      options.date = date
      index += 1
    } else {
      throw new OperatorError('Unknown option; run with --help for supported arguments.')
    }
  }

  if (options.publish && !options.date) {
    throw new OperatorError('--publish requires one explicit --date.')
  }
  if (options.publish && options.dryRun) {
    throw new OperatorError('--publish cannot be combined with --dry-run.')
  }

  return options
}

async function readJson(path, label) {
  let bytes
  try {
    bytes = await readFile(path)
  } catch (error) {
    if (error?.code === 'ENOENT') throw new OperatorError(`${label} was not found.`)
    throw new OperatorError(`${label} could not be read.`)
  }

  if (bytes.byteLength > MAX_RECORD_BYTES) {
    throw new OperatorError(`${label} exceeds the 1 MB record limit.`)
  }

  try {
    return JSON.parse(bytes.toString('utf8'))
  } catch {
    throw new OperatorError(`${label} is not valid JSON.`)
  }
}

async function selectedPrivateFiles(date) {
  let entries
  try {
    entries = await readdir(PRIVATE_DIR, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new OperatorError('No private input directory. Create web/.private/daily first.')
    }
    throw new OperatorError('The private input directory could not be read.')
  }

  const jsonEntries = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  for (const entry of jsonEntries) {
    if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(entry.name)) {
      throw new OperatorError('Every private JSON filename must be YYYY-MM-DD.json.')
    }
  }

  const selected = jsonEntries
    .filter((entry) => !date || entry.name === `${date}.json`)
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => join(PRIVATE_DIR, entry.name))

  if (selected.length === 0) {
    const scope = date ? `${date}.json` : 'any YYYY-MM-DD.json files'
    throw new OperatorError(`No private records selected; expected ${scope} in web/.private/daily.`)
  }
  return selected
}

async function loadPublicCases() {
  let entries
  try {
    entries = await readdir(PUBLIC_CASE_DIR, { withFileTypes: true })
  } catch {
    throw new OperatorError('Committed public daily cases could not be read.')
  }

  const cases = new Map()
  for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith('.json'))) {
    const dailyCase = await readJson(join(PUBLIC_CASE_DIR, entry.name), 'A committed public case')
    try {
      validatePublicCase(dailyCase)
    } catch {
      throw new OperatorError('A committed public daily case failed schema validation.')
    }
    if (cases.has(dailyCase.id)) throw new OperatorError('Committed public daily case IDs are not unique.')
    cases.set(dailyCase.id, dailyCase)
  }
  return cases
}

function validationFailure(date, error) {
  const path = typeof error?.path === 'string' ? ` at ${error.path}` : ''
  return new OperatorError(`Private record ${date} failed schema validation${path}.`)
}

async function validateInputs(files) {
  const publicCases = await loadPublicCases()
  const records = []

  for (const path of files) {
    const fileDate = basename(path, '.json')
    const record = await readJson(path, `Private record ${fileDate}`)
    let publicCase
    try {
      validatePrivateRecord(record)
      if (record.publishDate !== fileDate) {
        throw new OperatorError(`Private record ${fileDate} has a mismatched publishDate.`)
      }

      publicCase = record.case ?? publicCases.get(record.contentId)
      if (!publicCase) {
        throw new OperatorError(
          `Private record ${fileDate} has no matching committed public case; embed its public case bundle.`,
        )
      }
      validatePrivateRecordAgainstCase(record, publicCase)
    } catch (error) {
      if (error instanceof OperatorError) throw error
      throw validationFailure(fileDate, error)
    }
    records.push({ date: fileDate, record, publicCase })
  }

  return records
}

function normalizePrefix(value = 'daily') {
  if (!/^[a-z0-9][a-z0-9/_-]*$/.test(value) || value.includes('..')) {
    throw new OperatorError('DAILY_BLOB_PREFIX is invalid.')
  }
  return value.replace(/\/+$/, '')
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

async function readExisting(blob, pathname, options) {
  let result
  try {
    result = await blob.get(pathname, options)
  } catch {
    throw new OperatorError('Vercel Blob could not check an existing scheduled record.')
  }
  if (!result || result.statusCode === 404) return null
  if (result.statusCode !== 200 || !result.stream) {
    throw new OperatorError('Vercel Blob returned an unexpected read result.')
  }
  if (Number(result.blob?.size) > MAX_RECORD_BYTES) {
    throw new OperatorError('The existing scheduled Blob record exceeds the 1 MB limit.')
  }

  const raw = await new Response(result.stream).text()
  if (new TextEncoder().encode(raw).byteLength > MAX_RECORD_BYTES) {
    throw new OperatorError('The existing scheduled Blob record exceeds the 1 MB limit.')
  }
  try {
    return JSON.parse(raw)
  } catch {
    throw new OperatorError('The existing scheduled Blob record is invalid JSON.')
  }
}

async function loadBlobSdk() {
  try {
    const blob = await import('@vercel/blob')
    if (typeof blob.get !== 'function' || typeof blob.put !== 'function') throw new Error('invalid SDK')
    return blob
  } catch {
    throw new OperatorError('The @vercel/blob package is unavailable; run npm ci from web/.')
  }
}

async function uploadRecord(blob, { date, record }, prefix, options) {
  const pathname = `${prefix}/scheduled/${date}.json`
  const existing = await readExisting(blob, pathname, options)
  if (existing) {
    if (canonicalJson(existing) === canonicalJson(record)) return 'already-uploaded'
    throw new OperatorError(`Scheduled record ${date} already exists with different content; nothing was overwritten.`)
  }

  try {
    await blob.put(pathname, JSON.stringify(record), {
      ...options,
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: 'application/json; charset=utf-8',
    })
  } catch {
    // Treat a same-content race as an idempotent success without revealing data.
    try {
      const raced = await readExisting(blob, pathname, options)
      if (raced && canonicalJson(raced) === canonicalJson(record)) return 'already-uploaded'
    } catch {
      // Preserve the intentionally terse write error below.
    }
    throw new OperatorError(`Vercel Blob rejected scheduled record ${date}; it was not uploaded.`)
  }
  return 'uploaded'
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    process.stdout.write(`${helpText()}\n`)
    return
  }

  const files = await selectedPrivateFiles(options.date)
  const records = await validateInputs(files)
  process.stdout.write(`Validated ${records.length} private record(s): ${records.map(({ date }) => date).join(', ')}.\n`)

  if (options.dryRun) {
    process.stdout.write('Dry run complete; no network request was made.\n')
    return
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token && !process.env.VERCEL_OIDC_TOKEN) {
    throw new OperatorError('No Blob credential found; set BLOB_READ_WRITE_TOKEN or VERCEL_OIDC_TOKEN.')
  }

  const blob = await loadBlobSdk()
  const prefix = normalizePrefix(process.env.DAILY_BLOB_PREFIX ?? 'daily')
  const blobOptions = { access: 'private', ...(token ? { token } : {}) }
  for (const record of records) {
    const status = await uploadRecord(blob, record, prefix, blobOptions)
    process.stdout.write(`${status === 'uploaded' ? 'Uploaded' : 'Already uploaded'} ${record.date}.\n`)
  }

  if (options.publish) {
    const selected = records[0]
    const provider = createBlobPrivateProvider({ blob, token, prefix })
    const result = await provider.publish(selected.date, {
      validate: async (record) => validatePrivateRecordAgainstCase(record, selected.publicCase),
    })
    if (!result) throw new OperatorError(`Scheduled record ${selected.date} was not found.`)
    process.stdout.write(`${result.status === 'published' ? 'Published' : 'Already published'} ${selected.date}.\n`)
  }
}

main().catch((error) => {
  const message = error instanceof OperatorError
    ? error.message
    : `Daily upload failed (${error?.name ?? 'unknown error'}).`
  process.stderr.write(`Error: ${message}\n`)
  process.exitCode = 1
})
