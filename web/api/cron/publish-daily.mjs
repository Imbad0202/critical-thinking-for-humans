import {
  createPrivateProviderResolver,
  createStaticPublicProvider,
} from '../../server/content-provider.mjs'
import {
  DAILY_TIME_ZONE,
  addCalendarDays,
  taipeiDateKey,
} from '../../server/daily-date.mjs'
import { DailyServiceError, publishScheduledDaily } from '../../server/daily-service.mjs'
import {
  errorResponse,
  jsonResponse,
  methodNotAllowed,
  privateApiHeaders,
} from '../../server/http.mjs'

const defaultStaticProvider = createStaticPublicProvider()

export function constantTimeStringEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false
  const leftBytes = new TextEncoder().encode(left)
  const rightBytes = new TextEncoder().encode(right)
  const length = Math.max(leftBytes.length, rightBytes.length)
  let difference = leftBytes.length ^ rightBytes.length
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0)
  }
  return difference === 0
}

export function hasValidCronAuthorization(request, secret) {
  if (typeof secret !== 'string' || secret.length < 16 || secret.length > 4096) return false
  return constantTimeStringEqual(request.headers.get('authorization'), `Bearer ${secret}`)
}

export function publishDateFor(now, offsetValue = '0') {
  if (!/^-?\d+$/.test(String(offsetValue))) throw new TypeError('Invalid publish offset')
  const offset = Number(offsetValue)
  if (!Number.isSafeInteger(offset) || offset < -1 || offset > 7) throw new TypeError('Invalid publish offset')
  return addCalendarDays(taipeiDateKey(now), offset)
}

export function createPublishDailyHandler({
  env = globalThis.process?.env ?? {},
  clock = () => new Date(),
  staticProvider = defaultStaticProvider,
  resolvePrivateProvider = createPrivateProviderResolver({ env }),
} = {}) {
  return async function publishDailyHandler(request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET'])
    if (!hasValidCronAuthorization(request, env.CRON_SECRET)) {
      return errorResponse('UNAUTHORIZED', '未授權。', {
        status: 401,
        headers: privateApiHeaders,
      })
    }

    let date
    try {
      date = publishDateFor(clock(), env.DAILY_PUBLISH_OFFSET_DAYS ?? '1')
      const privateProvider = await resolvePrivateProvider()
      const result = await publishScheduledDaily({
        dateKey: date,
        baseUrl: request.url,
        privateProvider,
        staticProvider,
      })

      return jsonResponse({
        schemaVersion: 1,
        date,
        timeZone: DAILY_TIME_ZONE,
        contentId: result.record.contentId,
        status: result.status,
      }, { headers: privateApiHeaders })
    } catch (error) {
      if (error instanceof DailyServiceError && error.code === 'SCHEDULED_CASE_NOT_FOUND') {
        return errorResponse(error.code, '找不到排定案件。', {
          status: 404,
          headers: privateApiHeaders,
        })
      }
      return errorResponse('PUBLISH_UNAVAILABLE', '每日發布暫時無法執行。', {
        status: 503,
        retryAfter: 300,
        headers: privateApiHeaders,
      })
    }
  }
}

export const GET = createPublishDailyHandler()

export default {
  fetch(request) {
    return GET(request)
  },
}
