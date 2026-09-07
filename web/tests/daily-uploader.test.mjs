import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'

const run = promisify(execFile)
const webRoot = new URL('../', import.meta.url)
const publicCase = JSON.parse(await readFile(new URL(
  'content/daily/cases/daily-2026-07-12-measurement-gap.json', webRoot,
), 'utf8'))

test('uploader dry-run accepts only records that the dated Daily service can resolve', async (t) => {
  // Run the real CLI in an isolated tree; never read or write an operator's inputs.
  const root = await mkdtemp(join(tmpdir(), 'daily-upload-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'scripts'), { recursive: true })
  await mkdir(join(root, '.private', 'daily'), { recursive: true })
  await cp(new URL('scripts/upload-daily.mjs', webRoot), join(root, 'scripts', 'upload-daily.mjs'))
  await cp(new URL('server/', webRoot), join(root, 'server'), { recursive: true })
  await cp(new URL('content/daily/', webRoot), join(root, 'content', 'daily'), { recursive: true })

  const invoke = (...args) => run(process.execPath, [join(root, 'scripts', 'upload-daily.mjs'), ...args], {
    cwd: root,
    env: { BLOB_READ_WRITE_TOKEN: 'isolated-test-token' },
  })
  const saveRecord = async (date, { embed = false } = {}) => {
    const record = {
      schemaVersion: 1,
      contentId: publicCase.id,
      publishDate: date,
      answers: [{
        itemId: publicCase.content.items[0].id,
        correctOptionId: 'A',
        hitFeedback: 'private-test-hit',
        missFeedback: 'private-test-miss',
      }],
      ...(embed ? { case: { ...publicCase, publishDate: date } } : {}),
    }
    await writeFile(join(root, '.private', 'daily', `${date}.json`), JSON.stringify(record))
  }

  for (const date of ['2026-07-12', '2026-07-26']) {
    await saveRecord(date)
    const { stdout, stderr } = await invoke('--dry-run', '--date', date)
    assert.match(stdout, /Dry run complete; no network request was made/)
    assert.equal(stderr, '')
    assert.doesNotMatch(stdout, /private-test-|correctOptionId/)
  }

  await saveRecord('2026-07-13')
  await assert.rejects(invoke('--dry-run', '--date', '2026-07-13'), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stderr, /does not match that date's public rotation/)
    assert.doesNotMatch(error.stdout + error.stderr, /private-test-|correctOptionId/)
    return true
  })

  await saveRecord('2026-07-13', { embed: true })
  assert.match((await invoke('--dry-run', '--date', '2026-07-13')).stdout, /Dry run complete/)

  await assert.rejects(invoke('--dry-run', '--date', '2026-02-30'), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stderr, /requires a valid YYYY-MM-DD calendar date/)
    return true
  })

  // Simulate a create-only race: only a fresh read can see the winning upload.
  const mockPackage = join(root, 'node_modules', '@vercel', 'blob')
  await mkdir(mockPackage, { recursive: true })
  await writeFile(join(mockPackage, 'package.json'), JSON.stringify({
    name: '@vercel/blob', type: 'module', exports: './index.mjs',
  }))
  await writeFile(join(mockPackage, 'index.mjs'), `
    import { readFile } from 'node:fs/promises'
    let raced = false
    export async function get(pathname, options) {
      if (!raced || options.useCache !== false) return null
      const body = await readFile(new URL('../../../.private/daily/2026-07-12.json', import.meta.url), 'utf8')
      return { statusCode: 200, stream: new Response(body).body }
    }
    export async function put() {
      raced = true
      throw new Error('another uploader won the create-only write')
    }
  `)
  const { stdout, stderr } = await invoke('--date', '2026-07-12')
  assert.match(stdout, /Already uploaded 2026-07-12/)
  assert.equal(stderr, '')
  assert.doesNotMatch(stdout, /private-test-|correctOptionId|isolated-test-token/)
})
