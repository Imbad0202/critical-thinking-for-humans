import { secondsUntilNextTaipeiDay } from './daily-date.mjs'

export class RequestBodyError extends Error {
  constructor(code, status = 400) {
    super(code)
    this.name = 'RequestBodyError'
    this.code = code
    this.status = status
  }
}

const baseHeaders = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
})

export function jsonResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...baseHeaders, ...headers },
  })
}

export function errorResponse(code, message, {
  status = 500,
  retryAfter,
  headers = {},
} = {}) {
  const responseHeaders = {
    'Cache-Control': 'no-store',
    ...headers,
  }
  if (retryAfter !== undefined) responseHeaders['Retry-After'] = String(retryAfter)

  return jsonResponse({ error: { code, message } }, { status, headers: responseHeaders })
}

export function methodNotAllowed(allowedMethods) {
  return errorResponse('METHOD_NOT_ALLOWED', '不支援此請求方式。', {
    status: 405,
    headers: { Allow: allowedMethods.join(', ') },
  })
}

export function publicDailyCacheHeaders(now = new Date(), { maxAge } = {}) {
  const dayTtl = secondsUntilNextTaipeiDay(now)
  const ttl = Number.isSafeInteger(maxAge) && maxAge >= 0 ? Math.min(dayTtl, maxAge) : dayTtl
  return {
    'Cache-Control': `public, max-age=0, s-maxage=${ttl}, must-revalidate`,
    Vary: 'Accept-Encoding',
  }
}

export const privateApiHeaders = Object.freeze({
  'Cache-Control': 'no-store',
  'RateLimit-Policy': '30;w=60',
})

export async function readJsonBody(request, { maxBytes = 4096 } = {}) {
  const declaredLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError('PAYLOAD_TOO_LARGE', 413)
  }

  let text = ''
  let reader
  try {
    reader = request.body?.getReader()
    if (!reader) throw new RequestBodyError('INVALID_BODY')
    const decoder = new TextDecoder()
    let bytesRead = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytesRead += value.byteLength
      if (bytesRead > maxBytes) {
        // Stop reading at the limit even when Content-Length is absent or false.
        await reader.cancel().catch(() => {})
        throw new RequestBodyError('PAYLOAD_TOO_LARGE', 413)
      }
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
  } catch (error) {
    if (error instanceof RequestBodyError) throw error
    throw new RequestBodyError('INVALID_BODY')
  } finally {
    reader?.releaseLock()
  }

  if (!text.trim()) throw new RequestBodyError('INVALID_BODY')

  try {
    return JSON.parse(text)
  } catch {
    throw new RequestBodyError('INVALID_JSON')
  }
}
