import {
  DAILY_TIME_ZONE,
  calendarDayDifference,
  isDateKey,
} from './daily-date.mjs'

export class SchemaValidationError extends Error {
  constructor(path, reason) {
    super(`${path}: ${reason}`)
    this.name = 'SchemaValidationError'
    this.path = path
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const tokenPattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/
const choiceIdPattern = /^[A-Z][A-Z0-9]{0,2}$/
const localePattern = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/
const backgroundPattern = /^web\/assets\/art\/backgrounds\/[a-z0-9-]+\.webp$/
const sourcePathPattern = /^(?:modes|shared|expeditions|web\/content)\/[A-Za-z0-9._/-]+\.(?:md|js)$/
const staticCasePathPattern = /^cases\/([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/

const publicCaseKeys = [
  '$schema',
  'schemaVersion',
  'id',
  'publishDate',
  'locale',
  'visibility',
  'mode',
  'title',
  'canonicalSourcePaths',
  'content',
]

const isRecord = (value) => value !== null
  && typeof value === 'object'
  && !Array.isArray(value)

function fail(path, reason) {
  throw new SchemaValidationError(path, reason)
}

function record(value, path) {
  if (!isRecord(value)) fail(path, 'expected an object')
  return value
}

function exactKeys(value, required, optional, path) {
  record(value, path)
  const allowed = new Set([...required, ...optional])
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(`${path}.${key}`, 'unexpected property')
  }
  for (const key of required) {
    if (!Object.hasOwn(value, key)) fail(`${path}.${key}`, 'required property is missing')
  }
}

function text(value, path, { maxLength = 50_000 } = {}) {
  if (typeof value !== 'string' || value.length === 0 || value.length > maxLength) {
    fail(path, 'expected non-empty text')
  }
  return value
}

function pattern(value, regex, path) {
  if (typeof value !== 'string' || !regex.test(value)) fail(path, 'invalid format')
  return value
}

function array(value, path, { min = 0, max = 1000 } = {}) {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    fail(path, 'invalid array length')
  }
  return value
}

function unique(values, path) {
  if (new Set(values).size !== values.length) fail(path, 'values must be unique')
}

function validateOption(value, path) {
  exactKeys(value, ['id', 'text'], [], path)
  pattern(value.id, choiceIdPattern, `${path}.id`)
  text(value.text, `${path}.text`)
}

function validateChoiceItem(value, path) {
  const fields = [
    'id', 'chapter', 'location', 'speaker', 'role', 'characterId',
    'backgroundAsset', 'briefing', 'evidenceTitle', 'evidence', 'prompt', 'options',
  ]
  exactKeys(value, fields, [], path)
  pattern(value.id, slugPattern, `${path}.id`)
  for (const key of ['chapter', 'location', 'speaker', 'role', 'briefing', 'evidenceTitle', 'evidence', 'prompt']) {
    text(value[key], `${path}.${key}`)
  }
  pattern(value.characterId, tokenPattern, `${path}.characterId`)
  pattern(value.backgroundAsset, backgroundPattern, `${path}.backgroundAsset`)
  array(value.options, `${path}.options`, { min: 2, max: 6 })
    .forEach((option, index) => validateOption(option, `${path}.options[${index}]`))
  unique(value.options.map((option) => option.id), `${path}.options`)
}

function validateChoiceSequence(value, path) {
  exactKeys(value, ['kind', 'items'], [], path)
  if (value.kind !== 'choice-sequence') fail(`${path}.kind`, 'unexpected content kind')
  array(value.items, `${path}.items`, { min: 1, max: 20 })
    .forEach((item, index) => validateChoiceItem(item, `${path}.items[${index}]`))
  unique(value.items.map((item) => item.id), `${path}.items`)
}

function validateSceneHeader(value, path) {
  const fields = ['location', 'speaker', 'role', 'characterId', 'backgroundAsset', 'text']
  exactKeys(value, fields, [], path)
  for (const key of ['location', 'speaker', 'role', 'text']) text(value[key], `${path}.${key}`)
  pattern(value.characterId, tokenPattern, `${path}.characterId`)
  pattern(value.backgroundAsset, backgroundPattern, `${path}.backgroundAsset`)
}

function validateLens(value, path) {
  exactKeys(value, ['id', 'label', 'reading', 'prompt', 'options'], [], path)
  pattern(value.id, tokenPattern, `${path}.id`)
  for (const key of ['label', 'reading', 'prompt']) text(value[key], `${path}.${key}`)
  array(value.options, `${path}.options`, { min: 2, max: 12 })
    .forEach((option, index) => text(option, `${path}.options[${index}]`))
}

function validateCommitment(value, path) {
  exactKeys(value, ['id', 'text', 'objection'], [], path)
  pattern(value.id, choiceIdPattern, `${path}.id`)
  text(value.text, `${path}.text`)
  text(value.objection, `${path}.objection`)
}

function validateMultiLensScene(value, path) {
  exactKeys(value, ['kind', 'scene', 'lenses', 'positions', 'commitments'], [], path)
  if (value.kind !== 'multi-lens-scene') fail(`${path}.kind`, 'unexpected content kind')
  validateSceneHeader(value.scene, `${path}.scene`)
  array(value.lenses, `${path}.lenses`, { min: 6, max: 6 })
    .forEach((lens, index) => validateLens(lens, `${path}.lenses[${index}]`))
  unique(value.lenses.map((lens) => lens.id), `${path}.lenses`)
  array(value.positions, `${path}.positions`, { min: 3, max: 3 })
    .forEach((position, index) => text(position, `${path}.positions[${index}]`))
  array(value.commitments, `${path}.commitments`, { min: 3, max: 3 })
    .forEach((commitment, index) => validateCommitment(commitment, `${path}.commitments[${index}]`))
  unique(value.commitments.map((commitment) => commitment.id), `${path}.commitments`)
}

export function validatePublicCase(value, path = '$') {
  exactKeys(value, publicCaseKeys, ['domain'], path)
  if (value.$schema !== '../schema/daily-case-public.v1.schema.json') fail(`${path}.$schema`, 'unsupported schema')
  if (value.schemaVersion !== 1) fail(`${path}.schemaVersion`, 'unsupported schema version')
  pattern(value.id, slugPattern, `${path}.id`)
  if (!isDateKey(value.publishDate)) fail(`${path}.publishDate`, 'invalid date')
  pattern(value.locale, localePattern, `${path}.locale`)
  if (value.visibility !== 'public') fail(`${path}.visibility`, 'must be public')
  if (!['drill', 'scene', 'expedition', 'detective'].includes(value.mode)) fail(`${path}.mode`, 'unsupported mode')
  if (value.domain !== undefined && !['education', 'health', 'public', 'science', 'work'].includes(value.domain)) {
    fail(`${path}.domain`, 'unsupported domain')
  }
  text(value.title, `${path}.title`)

  array(value.canonicalSourcePaths, `${path}.canonicalSourcePaths`, { min: 2, max: 20 })
    .forEach((source, index) => pattern(source, sourcePathPattern, `${path}.canonicalSourcePaths[${index}]`))
  unique(value.canonicalSourcePaths, `${path}.canonicalSourcePaths`)

  if (value.mode === 'scene') validateMultiLensScene(value.content, `${path}.content`)
  else validateChoiceSequence(value.content, `${path}.content`)
  return value
}

export function clonePublicCase(value) {
  validatePublicCase(value)
  return JSON.parse(JSON.stringify(value))
}

export function validateRotation(value, path = '$') {
  const fields = ['schemaVersion', 'id', 'timeZone', 'strategy', 'cycleAnchorDate', 'entries']
  exactKeys(value, fields, [], path)
  if (value.schemaVersion !== 1) fail(`${path}.schemaVersion`, 'unsupported schema version')
  pattern(value.id, slugPattern, `${path}.id`)
  if (value.timeZone !== DAILY_TIME_ZONE) fail(`${path}.timeZone`, 'unsupported time zone')
  if (value.strategy !== 'cyclic') fail(`${path}.strategy`, 'unsupported rotation strategy')
  if (!isDateKey(value.cycleAnchorDate)) fail(`${path}.cycleAnchorDate`, 'invalid date')

  array(value.entries, `${path}.entries`, { min: 1, max: 366 }).forEach((entry, index) => {
    const entryPath = `${path}.entries[${index}]`
    exactKeys(entry, ['date', 'caseId', 'path'], [], entryPath)
    if (!isDateKey(entry.date)) fail(`${entryPath}.date`, 'invalid date')
    if (calendarDayDifference(entry.date, value.cycleAnchorDate) !== index) {
      fail(`${entryPath}.date`, 'entries must be consecutive from cycleAnchorDate')
    }
    pattern(entry.caseId, slugPattern, `${entryPath}.caseId`)
    const pathMatch = typeof entry.path === 'string' ? staticCasePathPattern.exec(entry.path) : null
    if (!pathMatch || pathMatch[1] !== entry.caseId) fail(`${entryPath}.path`, 'invalid or mismatched case path')
  })
  unique(value.entries.map((entry) => entry.caseId), `${path}.entries.caseId`)
  unique(value.entries.map((entry) => entry.path), `${path}.entries.path`)
  return value
}

function validateAnswerEntry(value, path) {
  const required = ['itemId', 'correctOptionId', 'hitFeedback', 'missFeedback']
  const optional = [
    'hitHeading', 'missHeading', 'hint', 'structure', 'structureLabel', 'reward',
    'verdicts', 'xp',
  ]
  exactKeys(value, required, optional, path)
  pattern(value.itemId, slugPattern, `${path}.itemId`)
  pattern(value.correctOptionId, choiceIdPattern, `${path}.correctOptionId`)
  for (const key of ['hitFeedback', 'missFeedback']) text(value[key], `${path}.${key}`)
  for (const key of ['hitHeading', 'missHeading', 'hint', 'structureLabel', 'reward']) {
    if (value[key] !== undefined) text(value[key], `${path}.${key}`)
  }
  if (value.structure !== undefined) pattern(value.structure, tokenPattern, `${path}.structure`)

  if (value.verdicts !== undefined) {
    record(value.verdicts, `${path}.verdicts`)
    const verdictKeys = Object.keys(value.verdicts)
    if (verdictKeys.length < 2 || verdictKeys.length > 6) fail(`${path}.verdicts`, 'invalid verdict map')
    verdictKeys.forEach((key) => {
      pattern(key, choiceIdPattern, `${path}.verdicts.${key}`)
      text(value.verdicts[key], `${path}.verdicts.${key}`)
    })
  }

  if (value.xp !== undefined) {
    exactKeys(value.xp, ['hit', 'miss'], [], `${path}.xp`)
    for (const key of ['hit', 'miss']) {
      if (!Number.isSafeInteger(value.xp[key]) || value.xp[key] < 0 || value.xp[key] > 1000) {
        fail(`${path}.xp.${key}`, 'invalid XP value')
      }
    }
  }
}

export function validatePrivateRecord(value, path = '$') {
  exactKeys(value, ['schemaVersion', 'contentId', 'publishDate', 'answers'], ['case'], path)
  if (value.schemaVersion !== 1) fail(`${path}.schemaVersion`, 'unsupported schema version')
  pattern(value.contentId, slugPattern, `${path}.contentId`)
  if (!isDateKey(value.publishDate)) fail(`${path}.publishDate`, 'invalid date')
  array(value.answers, `${path}.answers`, { min: 0, max: 20 })
    .forEach((answer, index) => validateAnswerEntry(answer, `${path}.answers[${index}]`))
  unique(value.answers.map((answer) => answer.itemId), `${path}.answers`)
  if (value.case !== undefined) {
    validatePublicCase(value.case, `${path}.case`)
    if (value.case.id !== value.contentId) fail(`${path}.case.id`, 'must equal contentId')
  }
  return value
}

export function validatePrivateRecordAgainstCase(privateRecord, publicCase) {
  validatePrivateRecord(privateRecord)
  validatePublicCase(publicCase)
  if (privateRecord.contentId !== publicCase.id) fail('$.contentId', 'does not match public case')

  if (publicCase.content.kind === 'multi-lens-scene') {
    if (privateRecord.answers.length !== 0) fail('$.answers', 'scene cases must not contain answer keys')
    return privateRecord
  }

  const items = new Map(publicCase.content.items.map((item) => [item.id, item]))
  if (privateRecord.answers.length !== items.size) fail('$.answers', 'must key every public item exactly once')
  for (const answer of privateRecord.answers) {
    const item = items.get(answer.itemId)
    if (!item) fail('$.answers', 'contains an unknown item')
    const optionIds = new Set(item.options.map((option) => option.id))
    if (!optionIds.has(answer.correctOptionId)) fail('$.answers', 'correct option is not public')
    if (answer.verdicts) {
      const verdictIds = Object.keys(answer.verdicts)
      if (verdictIds.length !== optionIds.size || verdictIds.some((id) => !optionIds.has(id))) {
        fail('$.answers', 'verdict map must cover the public options exactly')
      }
    }
  }
  return privateRecord
}

export function parseAnswerSubmission(value) {
  exactKeys(value, ['itemId'], ['contentId', 'caseId', 'answer', 'selectedOptionId', 'date'], '$')
  const contentId = value.contentId ?? value.caseId
  const selectedOptionId = value.answer ?? value.selectedOptionId
  pattern(contentId, slugPattern, '$.contentId')
  pattern(value.itemId, slugPattern, '$.itemId')
  pattern(selectedOptionId, choiceIdPattern, '$.answer')
  if (value.contentId !== undefined && value.caseId !== undefined && value.contentId !== value.caseId) {
    fail('$.caseId', 'conflicts with contentId')
  }
  if (value.answer !== undefined && value.selectedOptionId !== undefined && value.answer !== value.selectedOptionId) {
    fail('$.selectedOptionId', 'conflicts with answer')
  }
  if (value.date !== undefined && !isDateKey(value.date)) fail('$.date', 'invalid date')
  return { contentId, itemId: value.itemId, selectedOptionId, date: value.date }
}

export function gradeAnswer(answerEntry, selectedOptionId) {
  validateAnswerEntry(answerEntry, '$')
  pattern(selectedOptionId, choiceIdPattern, '$.selectedOptionId')
  const hit = selectedOptionId === answerEntry.correctOptionId
  return {
    outcome: hit ? 'hit' : 'miss',
    xp: answerEntry.xp?.[hit ? 'hit' : 'miss'] ?? (hit ? 40 : 15),
    reveal: {
      heading: hit
        ? (answerEntry.hitHeading ?? '推理命中')
        : (answerEntry.missHeading ?? '線索已更新'),
      feedback: hit ? answerEntry.hitFeedback : answerEntry.missFeedback,
      verdict: answerEntry.verdicts?.[selectedOptionId] ?? null,
      structure: answerEntry.structure ?? null,
      structureLabel: answerEntry.structureLabel ?? null,
      reward: hit ? (answerEntry.reward ?? null) : null,
      hint: hit ? null : (answerEntry.hint ?? null),
    },
  }
}
