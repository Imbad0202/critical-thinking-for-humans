const DEFAULT_LIMIT = 30
const DEFAULT_WINDOW_MS = 60_000

export function requestRateLimitKey(request) {
  const forwarded = request.headers.get('x-vercel-forwarded-for')
    ?? request.headers.get('x-forwarded-for')
    ?? request.headers.get('x-real-ip')
  const candidate = forwarded?.split(',')[0]?.trim()
  if (candidate && candidate.length <= 128) return candidate
  return 'unknown-client'
}

export function createFixedWindowRateLimiter({
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
  now = () => Date.now(),
  maxBuckets = 10_000,
} = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new TypeError('limit must be positive')
  if (!Number.isSafeInteger(windowMs) || windowMs < 1000) throw new TypeError('windowMs is too small')
  const buckets = new Map()

  const prune = (timestamp) => {
    if (buckets.size < maxBuckets) return
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= timestamp) buckets.delete(key)
      if (buckets.size < maxBuckets) break
    }
    if (buckets.size >= maxBuckets) buckets.delete(buckets.keys().next().value)
  }

  return Object.freeze({
    consume(key) {
      if (typeof key !== 'string' || key.length === 0 || key.length > 128) {
        throw new TypeError('invalid rate-limit key')
      }
      const timestamp = now()
      let bucket = buckets.get(key)
      if (!bucket || bucket.resetAt <= timestamp) {
        if (!bucket) prune(timestamp)
        bucket = { used: 0, resetAt: timestamp + windowMs }
        buckets.set(key, bucket)
      }
      bucket.used += 1

      const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - timestamp) / 1000))
      const remaining = Math.max(0, limit - bucket.used)
      return {
        allowed: bucket.used <= limit,
        retryAfter: resetSeconds,
        headers: {
          'RateLimit-Policy': `${limit};w=${Math.ceil(windowMs / 1000)}`,
          'RateLimit-Limit': String(limit),
          'RateLimit-Remaining': String(remaining),
          'RateLimit-Reset': String(resetSeconds),
        },
      }
    },
  })
}
