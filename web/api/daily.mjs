import {
  createPrivateProviderResolver,
  createStaticPublicProvider,
} from '../server/content-provider.mjs'
import { DAILY_TIME_ZONE, taipeiDateKey } from '../server/daily-date.mjs'
import { resolveDailyCase } from '../server/daily-service.mjs'
import {
  errorResponse,
  jsonResponse,
  methodNotAllowed,
  publicDailyCacheHeaders,
} from '../server/http.mjs'

const defaultStaticProvider = createStaticPublicProvider()
const defaultPrivateProvider = createPrivateProviderResolver()

export function createDailyHandler({
  clock = () => new Date(),
  staticProvider = defaultStaticProvider,
  resolvePrivateProvider = defaultPrivateProvider,
} = {}) {
  return async function dailyHandler(request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])
    const now = clock()
    const date = taipeiDateKey(now)

    try {
      let privateProvider = null
      let degraded = false
      try {
        privateProvider = await resolvePrivateProvider()
      } catch {
        degraded = true
      }

      let result
      try {
        result = await resolveDailyCase({
          dateKey: date,
          baseUrl: request.url,
          privateProvider,
          staticProvider,
        })
      } catch (error) {
        if (!privateProvider) throw error
        degraded = true
        result = await resolveDailyCase({
          dateKey: date,
          baseUrl: request.url,
          privateProvider: null,
          staticProvider,
        })
      }

      return jsonResponse({
        schemaVersion: 1,
        date,
        timeZone: DAILY_TIME_ZONE,
        rotationId: result.rotationId,
        contentId: result.case.id,
        answerable: result.answerable,
        gradingAvailable: result.gradingAvailable,
        case: result.case,
      }, { headers: publicDailyCacheHeaders(now, { maxAge: degraded ? 60 : undefined }) })
    } catch {
      return errorResponse('DAILY_CASE_UNAVAILABLE', '今日案件暫時無法載入。', {
        status: 503,
        retryAfter: 60,
      })
    }
  }
}

export const GET = createDailyHandler()

export default {
  fetch(request) {
    return GET(request)
  },
}
