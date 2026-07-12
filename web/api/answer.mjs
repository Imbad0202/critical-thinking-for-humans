import {
  createPrivateProviderResolver,
  createStaticPublicProvider,
} from '../server/content-provider.mjs'
import { DAILY_TIME_ZONE, taipeiDateKey } from '../server/daily-date.mjs'
import { DailyServiceError, adjudicateDailyAnswer } from '../server/daily-service.mjs'
import { SchemaValidationError, parseAnswerSubmission } from '../server/daily-schema.mjs'
import {
  RequestBodyError,
  errorResponse,
  jsonResponse,
  methodNotAllowed,
  privateApiHeaders,
  readJsonBody,
} from '../server/http.mjs'
import {
  createFixedWindowRateLimiter,
  requestRateLimitKey,
} from '../server/rate-limit.mjs'

const defaultStaticProvider = createStaticPublicProvider()
const defaultPrivateProvider = createPrivateProviderResolver()
const defaultRateLimiter = createFixedWindowRateLimiter()

const serviceMessages = Object.freeze({
  GRADING_UNAVAILABLE: '今日案件尚未開放判分。',
  CONTENT_CONFLICT: '案件已更新，請重新載入。',
  ITEM_NOT_FOUND: '找不到這道題目。',
  INVALID_OPTION: '選項格式不正確。',
  CASE_NOT_GRADED: '這個案件採中性探索，不進行對錯判分。',
})

export function createAnswerHandler({
  clock = () => new Date(),
  staticProvider = defaultStaticProvider,
  resolvePrivateProvider = defaultPrivateProvider,
  rateLimiter = defaultRateLimiter,
} = {}) {
  return async function answerHandler(request) {
    if (request.method !== 'POST') return methodNotAllowed(['POST'])

    const rate = rateLimiter.consume(requestRateLimitKey(request))
    const responseHeaders = { ...privateApiHeaders, ...rate.headers }
    if (!rate.allowed) {
      return errorResponse('RATE_LIMITED', '請稍候再試。', {
        status: 429,
        retryAfter: rate.retryAfter,
        headers: responseHeaders,
      })
    }

    const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
    if (!/^application\/json(?:\s*;|$)/.test(contentType)) {
      return errorResponse('UNSUPPORTED_MEDIA_TYPE', '請以 JSON 送出答案。', {
        status: 415,
        headers: responseHeaders,
      })
    }

    let submission
    try {
      submission = parseAnswerSubmission(await readJsonBody(request))
    } catch (error) {
      if (error instanceof RequestBodyError || error instanceof SchemaValidationError) {
        return errorResponse('INVALID_REQUEST', '答案資料格式不正確。', {
          status: error.status ?? 400,
          headers: responseHeaders,
        })
      }
      return errorResponse('INVALID_REQUEST', '答案資料格式不正確。', {
        status: 400,
        headers: responseHeaders,
      })
    }

    const now = clock()
    const date = taipeiDateKey(now)
    if (submission.date && submission.date !== date) {
      return errorResponse('CONTENT_CONFLICT', serviceMessages.CONTENT_CONFLICT, {
        status: 409,
        headers: responseHeaders,
      })
    }

    try {
      const privateProvider = await resolvePrivateProvider()
      const result = await adjudicateDailyAnswer({
        dateKey: date,
        baseUrl: request.url,
        submission,
        privateProvider,
        staticProvider,
      })

      return jsonResponse({
        schemaVersion: 1,
        date,
        timeZone: DAILY_TIME_ZONE,
        caseId: submission.contentId,
        itemId: submission.itemId,
        selectedOptionId: submission.selectedOptionId,
        outcome: result.outcome,
        xp: result.xp,
        reveal: result.reveal,
      }, { headers: responseHeaders })
    } catch (error) {
      if (error instanceof DailyServiceError) {
        return errorResponse(error.code, serviceMessages[error.code] ?? '無法判定此答案。', {
          status: error.status,
          retryAfter: error.status === 503 ? 60 : undefined,
          headers: responseHeaders,
        })
      }
      return errorResponse('GRADING_UNAVAILABLE', serviceMessages.GRADING_UNAVAILABLE, {
        status: 503,
        retryAfter: 60,
        headers: responseHeaders,
      })
    }
  }
}

export const POST = createAnswerHandler()

export default {
  fetch(request) {
    return POST(request)
  },
}
