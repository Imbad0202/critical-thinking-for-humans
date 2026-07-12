import {
  gradeAnswer,
  validatePrivateRecordAgainstCase,
} from './daily-schema.mjs'

export class DailyServiceError extends Error {
  constructor(code, status) {
    super(code)
    this.name = 'DailyServiceError'
    this.code = code
    this.status = status
  }
}

async function publicCaseForRecord({ record, dateKey, baseUrl, staticProvider }) {
  if (record.case) return { case: record.case, rotationId: null }
  const fallback = await staticProvider.getDaily(dateKey, { baseUrl })
  if (fallback.case.id !== record.contentId) throw new DailyServiceError('CONTENT_MISMATCH', 503)
  return fallback
}

export async function resolveDailyCase({
  dateKey,
  baseUrl,
  privateProvider,
  staticProvider,
}) {
  const record = privateProvider ? await privateProvider.getPublished(dateKey) : null
  const publicResult = record
    ? await publicCaseForRecord({ record, dateKey, baseUrl, staticProvider })
    : await staticProvider.getDaily(dateKey, { baseUrl })

  if (record) validatePrivateRecordAgainstCase(record, publicResult.case)
  const isScene = publicResult.case.content.kind === 'multi-lens-scene'

  return {
    case: publicResult.case,
    rotationId: publicResult.rotationId ?? null,
    answerable: Boolean(record),
    gradingAvailable: Boolean(record && !isScene),
  }
}

export async function adjudicateDailyAnswer({
  dateKey,
  baseUrl,
  submission,
  privateProvider,
  staticProvider,
}) {
  if (!privateProvider) throw new DailyServiceError('GRADING_UNAVAILABLE', 503)
  const record = await privateProvider.getPublished(dateKey)
  if (!record) throw new DailyServiceError('GRADING_UNAVAILABLE', 503)
  if (record.contentId !== submission.contentId) throw new DailyServiceError('CONTENT_CONFLICT', 409)

  const publicResult = await publicCaseForRecord({ record, dateKey, baseUrl, staticProvider })
  validatePrivateRecordAgainstCase(record, publicResult.case)
  if (publicResult.case.content.kind === 'multi-lens-scene') {
    throw new DailyServiceError('CASE_NOT_GRADED', 422)
  }

  const item = publicResult.case.content.items.find(({ id }) => id === submission.itemId)
  if (!item) throw new DailyServiceError('ITEM_NOT_FOUND', 404)
  if (!item.options.some(({ id }) => id === submission.selectedOptionId)) {
    throw new DailyServiceError('INVALID_OPTION', 400)
  }

  const answerEntry = record.answers.find(({ itemId }) => itemId === submission.itemId)
  if (!answerEntry) throw new DailyServiceError('ITEM_NOT_FOUND', 404)
  return gradeAnswer(answerEntry, submission.selectedOptionId)
}

export async function publishScheduledDaily({
  dateKey,
  baseUrl,
  privateProvider,
  staticProvider,
}) {
  if (!privateProvider?.writable || typeof privateProvider.publish !== 'function') {
    throw new DailyServiceError('PUBLISH_PROVIDER_UNAVAILABLE', 503)
  }

  const result = await privateProvider.publish(dateKey, {
    validate: async (record) => {
      const publicResult = await publicCaseForRecord({ record, dateKey, baseUrl, staticProvider })
      validatePrivateRecordAgainstCase(record, publicResult.case)
    },
  })
  if (!result) throw new DailyServiceError('SCHEDULED_CASE_NOT_FOUND', 404)
  return result
}
