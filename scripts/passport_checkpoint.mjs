#!/usr/bin/env node

import {
  chmodSync,
  closeSync,
  constants,
  existsSync,
  fsyncSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { randomUUID } from 'node:crypto'
import { homedir } from 'node:os'
import { isAbsolute, join, parse } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { TextDecoder } from 'node:util'

const EX_USAGE = 64
const EX_DATAERR = 65
const EX_IOERR = 74
const EX_TEMPFAIL = 75
const EX_PROTOCOL = 76
const UUID_V4_SOURCE =
  '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
const UUID_V4_PATTERN = new RegExp(`^${UUID_V4_SOURCE}$`)
const HELPER_TEMP_PATTERN = new RegExp(
  `^\\.(?:events\\.jsonl|generation)\\.tmp\\.[1-9][0-9]*\\.${UUID_V4_SOURCE}$`,
)

const usage = `usage: passport_checkpoint.sh [options] generation|read|append|delete

  generation  Print the current Passport generation, creating it if absent.
  read        Print a locked, no-follow snapshot of events.jsonl.
  append      Validate and commit one JSONL checkpoint batch from stdin.
  delete      Rotate the generation and delete Passport data under the lock.

Options:
  --data-dir DIR          Override ~/.ct-gym (maintainer fixtures only).
  --lock-timeout SECONDS  Bounded lock wait (default: 10).
  --generation TOKEN      Session generation required by read and append.
`

class PassportError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const fail = (code, message) => {
  throw new PassportError(code, message)
}

const parseArgs = (argv) => {
  let dataDir = null
  let lockTimeoutText = '10'
  let expectedGeneration = ''
  let command = ''

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const takeValue = (name) => {
      index += 1
      if (index >= argv.length) fail(EX_USAGE, `${name} needs a value`)
      return argv[index]
    }

    if (arg === '--data-dir') dataDir = takeValue('--data-dir')
    else if (arg.startsWith('--data-dir=')) dataDir = arg.slice(11)
    else if (arg === '--lock-timeout') {
      lockTimeoutText = takeValue('--lock-timeout')
    } else if (arg.startsWith('--lock-timeout=')) {
      lockTimeoutText = arg.slice(15)
    } else if (arg === '--generation') {
      expectedGeneration = takeValue('--generation')
    } else if (arg.startsWith('--generation=')) {
      expectedGeneration = arg.slice(13)
    } else if (['generation', 'read', 'append', 'delete'].includes(arg)) {
      if (command) fail(EX_USAGE, 'choose exactly one command')
      command = arg
    } else if (arg === '-h' || arg === '--help') {
      process.stdout.write(usage)
      process.exit(0)
    } else {
      fail(EX_USAGE, `unknown argument: ${arg}`)
    }
  }

  if (!command) {
    fail(EX_USAGE, 'missing generation, read, append, or delete command')
  }
  if (!/^[0-9]+$/.test(lockTimeoutText)) {
    fail(EX_USAGE, '--lock-timeout needs a non-negative integer')
  }
  const lockTimeout = Number(lockTimeoutText)
  if (!Number.isSafeInteger(lockTimeout)) {
    fail(EX_USAGE, '--lock-timeout needs a non-negative safe integer')
  }
  if (['read', 'append'].includes(command) && !expectedGeneration) {
    fail(EX_USAGE, `${command} requires --generation from this session's startup`)
  }
  if (!['read', 'append'].includes(command) && expectedGeneration) {
    fail(EX_USAGE, '--generation applies only to read and append')
  }

  if (dataDir === null) dataDir = join(homedir(), '.ct-gym')
  else if (!dataDir) fail(EX_USAGE, '--data-dir must not be empty')
  if (!isAbsolute(dataDir)) fail(EX_USAGE, '--data-dir must be an absolute path')
  mkdirSync(dataDir, { recursive: true, mode: 0o700 })
  const dataDirStat = lstatSync(dataDir)
  if (dataDirStat.isSymbolicLink() || !dataDirStat.isDirectory()) {
    fail(EX_USAGE, '--data-dir must be a real directory, not a symlink')
  }
  dataDir = realpathSync(dataDir)
  if (dataDir === parse(dataDir).root) {
    fail(EX_USAGE, '--data-dir must not be the filesystem root')
  }
  chmodSync(dataDir, 0o700)

  return { command, dataDir, expectedGeneration, lockTimeout }
}

const state = {
  activeTemp: '',
  committed: false,
  lockDir: '',
  lockHeld: false,
  lockOwner: '',
  ownerToken: `pid=${process.pid};token=${randomUUID()}`,
}

const safeUnlink = (path) => {
  try {
    unlinkSync(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

const releaseLock = () => {
  if (!state.lockHeld) return
  try {
    let owner = ''
    try {
      owner = readFileSync(state.lockOwner, 'utf8').trim()
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    if (owner === state.ownerToken) {
      safeUnlink(state.lockOwner)
      rmdirSync(state.lockDir)
    } else if (!existsSync(state.lockOwner)) {
      rmdirSync(state.lockDir)
    } else {
      process.stderr.write(
        'passport_checkpoint: lock owner changed; manual recovery may be required\n',
      )
    }
  } catch (error) {
    process.stderr.write(
      `passport_checkpoint: lock cleanup needs manual recovery (${error.code || 'error'})\n`,
    )
  } finally {
    state.lockHeld = false
  }
}

const cleanup = () => {
  if (state.activeTemp) {
    try {
      safeUnlink(state.activeTemp)
    } catch {
      // The next locked operation removes exact helper-owned orphan temps.
    }
    state.activeTemp = ''
  }
  releaseLock()
}

const signals = [['SIGHUP', 129], ['SIGINT', 130], ['SIGTERM', 143]]
for (const [signal, code] of signals) {
  process.on(signal, () => {
    cleanup()
    process.exit(state.committed ? 0 : code)
  })
}

const acquireLock = async (lockDir, lockOwner, timeoutSeconds) => {
  const deadline = Date.now() + timeoutSeconds * 1000
  while (true) {
    try {
      mkdirSync(lockDir, { mode: 0o700 })
      state.lockDir = lockDir
      state.lockOwner = lockOwner
      state.lockHeld = true
      writeFileSync(lockOwner, `${state.ownerToken}\n`, {
        encoding: 'utf8',
        flag: 'wx',
        mode: 0o600,
      })
      return
    } catch (error) {
      if (state.lockHeld) throw error
      if (error.code !== 'EEXIST') throw error
      let lockStat
      try {
        lockStat = lstatSync(lockDir)
      } catch (statError) {
        if (statError.code === 'ENOENT') continue
        throw statError
      }
      if (!lockStat.isDirectory()) fail(EX_IOERR, 'lock path is not a directory')
      if (Date.now() >= deadline) {
        fail(EX_TEMPFAIL, 'lock wait timed out; no Passport files changed')
      }
      await delay(100)
    }
  }
}

const cleanupOrphanTemps = (dataDir) => {
  for (const entry of readdirSync(dataDir, { withFileTypes: true })) {
    if (!HELPER_TEMP_PATTERN.test(entry.name)) continue
    const candidate = join(dataDir, entry.name)
    const candidateStat = lstatSync(candidate)
    if (candidateStat.isFile() && !candidateStat.isSymbolicLink()) {
      unlinkSync(candidate)
    }
  }
}

const readRegularFile = (path, label) => {
  let pathStat
  try {
    pathStat = lstatSync(path)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
  if (pathStat.isSymbolicLink() || !pathStat.isFile()) {
    fail(EX_IOERR, `${label} is not a regular file`)
  }

  const noFollow = constants.O_NOFOLLOW || 0
  const descriptor = openSync(path, constants.O_RDONLY | noFollow)
  try {
    if (!fstatSync(descriptor).isFile()) {
      fail(EX_IOERR, `${label} is not a regular file`)
    }
    return readFileSync(descriptor)
  } finally {
    closeSync(descriptor)
  }
}

const syncDirectory = (dataDir) => {
  let descriptor
  try {
    descriptor = openSync(dataDir, constants.O_RDONLY)
    fsyncSync(descriptor)
  } catch (error) {
    if (!['EINVAL', 'ENOTSUP', 'EPERM'].includes(error.code)) {
      process.stderr.write(
        `passport_checkpoint: directory sync warning (${error.code || 'error'})\n`,
      )
    }
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
  }
}

const atomicReplace = (
  dataDir,
  target,
  prefix,
  content,
  markCommitted = false,
) => {
  const noFollow = constants.O_NOFOLLOW || 0
  const temp = join(dataDir, `${prefix}.${process.pid}.${randomUUID()}`)
  state.activeTemp = temp
  const descriptor = openSync(
    temp,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | noFollow,
    0o600,
  )
  try {
    writeFileSync(descriptor, content)
    fsyncSync(descriptor)
  } finally {
    closeSync(descriptor)
  }
  chmodSync(temp, 0o600)
  renameSync(temp, target)
  state.activeTemp = ''
  if (markCommitted) state.committed = true
  syncDirectory(dataDir)
}

const decodeGeneration = (buffer) => {
  const token = buffer.toString('utf8').replace(/\n$/, '')
  if (!UUID_V4_PATTERN.test(token)) {
    fail(EX_IOERR, 'invalid Passport generation')
  }
  return token
}

const writeGeneration = (paths) => {
  const token = randomUUID()
  atomicReplace(
    paths.dataDir,
    paths.generation,
    '.generation.tmp',
    Buffer.from(`${token}\n`, 'utf8'),
  )
  return token
}

const readOrCreateGeneration = (paths) => {
  const current = readRegularFile(paths.generation, 'generation')
  return current === null ? writeGeneration(paths) : decodeGeneration(current)
}

const validateBatch = (buffer) => {
  let text
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    fail(EX_DATAERR, 'append needs valid UTF-8 JSON objects, one per line')
  }
  if (text.endsWith('\n')) text = text.slice(0, -1)
  const lines = text.split('\n')
  if (!text || lines.some((line) => !line)) {
    fail(EX_DATAERR, 'append needs valid UTF-8 JSON objects, one per line')
  }
  for (const line of lines) {
    let value
    try {
      value = JSON.parse(line)
    } catch {
      fail(EX_DATAERR, 'append needs valid UTF-8 JSON objects, one per line')
    }
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      fail(EX_DATAERR, 'append needs valid UTF-8 JSON objects, one per line')
    }
  }
  return Buffer.from(`${lines.join('\n')}\n`, 'utf8')
}

const removePassportFile = (path, label) => {
  let pathStat
  try {
    pathStat = lstatSync(path)
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }
  if (pathStat.isDirectory()) fail(EX_IOERR, `${label} is a directory`)
  rmSync(path, { force: true })
}

const main = async () => {
  const options = parseArgs(process.argv.slice(2))
  const paths = {
    dataDir: options.dataDir,
    events: join(options.dataDir, 'events.jsonl'),
    generation: join(options.dataDir, 'generation'),
    lockDir: join(options.dataDir, '.events.write-lock'),
    lockOwner: join(options.dataDir, '.events.write-lock', 'owner'),
    passport: join(options.dataDir, 'passport.md'),
  }

  let batch = null
  if (options.command === 'append') {
    batch = validateBatch(readFileSync(0))
  }

  await acquireLock(paths.lockDir, paths.lockOwner, options.lockTimeout)
  cleanupOrphanTemps(paths.dataDir)

  if (options.command === 'generation') {
    const token = readOrCreateGeneration(paths)
    state.committed = true
    process.stdout.write(`${token}\n`)
    return
  }

  if (['read', 'append'].includes(options.command)) {
    const currentGeneration = readOrCreateGeneration(paths)
    if (options.expectedGeneration !== currentGeneration) {
      fail(
        EX_PROTOCOL,
        'PASSPORT_GENERATION_MISMATCH: stale session operation was refused',
      )
    }
  }

  if (options.command === 'read') {
    const existing = readRegularFile(paths.events, 'events.jsonl')
    state.committed = true
    releaseLock()
    if (existing !== null) writeFileSync(1, existing)
    return
  }

  if (options.command === 'append') {
    const existing =
      readRegularFile(paths.events, 'events.jsonl') || Buffer.alloc(0)
    const separator =
      existing.length > 0 && existing[existing.length - 1] !== 0x0a
        ? Buffer.from('\n')
        : Buffer.alloc(0)
    atomicReplace(
      paths.dataDir,
      paths.events,
      '.events.jsonl.tmp',
      Buffer.concat([existing, separator, batch]),
      true,
    )
    return
  }

  // Rotate first: every already-open session is stale before any data file is
  // removed, so a pre-delete pending batch cannot recreate deleted data.
  writeGeneration(paths)
  removePassportFile(paths.events, 'events.jsonl')
  removePassportFile(paths.passport, 'passport.md')
  cleanupOrphanTemps(paths.dataDir)
  syncDirectory(paths.dataDir)
  state.committed = true
}

try {
  await main()
} catch (error) {
  const code = error instanceof PassportError ? error.code : EX_IOERR
  const message =
    error instanceof PassportError
      ? error.message
      : `I/O failure (${error.code || error.name || 'error'})`
  process.stderr.write(`passport_checkpoint: ${message}\n`)
  cleanup()
  process.exit(code)
}

cleanup()
