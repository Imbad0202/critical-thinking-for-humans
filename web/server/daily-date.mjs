export const DAILY_TIME_ZONE = 'Asia/Taipei'
export const DAILY_TIME_ZONE_OFFSET = '+08:00'

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAILY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/

export const isValidDate = (value) => value instanceof Date && Number.isFinite(value.getTime())

export function taipeiDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (!isValidDate(date)) throw new TypeError('Expected a valid date')

  const parts = dateFormatter.formatToParts(date)
  const read = (type) => parts.find((part) => part.type === type)?.value
  return `${read('year')}-${read('month')}-${read('day')}`
}

export function isDateKey(value) {
  if (typeof value !== 'string') return false
  const match = dateKeyPattern.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const candidate = new Date(Date.UTC(year, month - 1, day))

  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() === month - 1
    && candidate.getUTCDate() === day
}

export function addCalendarDays(dateKey, amount) {
  if (!isDateKey(dateKey)) throw new TypeError('Expected YYYY-MM-DD')
  if (!Number.isSafeInteger(amount)) throw new TypeError('Expected an integer day offset')

  const [year, month, day] = dateKey.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + amount))
  return next.toISOString().slice(0, 10)
}

export function calendarDayDifference(dateKey, anchorDateKey) {
  if (!isDateKey(dateKey) || !isDateKey(anchorDateKey)) {
    throw new TypeError('Expected YYYY-MM-DD date keys')
  }

  const toEpochDay = (key) => {
    const [year, month, day] = key.split('-').map(Number)
    return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000)
  }

  return toEpochDay(dateKey) - toEpochDay(anchorDateKey)
}

export function secondsUntilNextTaipeiDay(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (!isValidDate(date)) throw new TypeError('Expected a valid date')

  const tomorrow = addCalendarDays(taipeiDateKey(date), 1)
  const nextMidnight = Date.parse(`${tomorrow}T00:00:00${DAILY_TIME_ZONE_OFFSET}`)
  return Math.max(0, Math.floor((nextMidnight - date.getTime()) / 1000))
}

export function normalizedModulo(value, divisor) {
  if (!Number.isSafeInteger(value) || !Number.isSafeInteger(divisor) || divisor <= 0) {
    throw new TypeError('Expected safe integers and a positive divisor')
  }
  return ((value % divisor) + divisor) % divisor
}
