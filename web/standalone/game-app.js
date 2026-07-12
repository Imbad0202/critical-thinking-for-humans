import { createWorld } from './webgl.js'
import { createGameFeedback } from './game-feedback.js'
import { createGameMusic } from './game-music.js'
import { contentManifest, getDemoContent } from '../content/demo-cases.js'
import { getUiCopy, interpolate, resolveLocale, supportedLocales } from '../content/ui-copy.js'

const passportKey = 'critical-thinking-for-humans.casebook.v3'
const legacyPassportKey = 'critical-thinking-for-humans.casebook.v2'
const localeKey = 'critical-thinking-for-humans.casebook.locale'
const domainKey = 'critical-thinking-for-humans.casebook.domain'
const modeIds = Object.freeze(['drill', 'scene', 'expedition', 'detective'])
const domainIds = Object.freeze(['all', 'education', 'health', 'public', 'science', 'work'])
const dailyEndpoint = new URL('../api/daily', import.meta.url)
const answerEndpoint = new URL('../api/answer', import.meta.url)
const dailyModeEnglish = Object.freeze({ drill: 'DRILL', scene: 'SCENE', expedition: 'EXPEDITION', detective: 'DETECTIVE' })

const readInitialLocale = () => {
  const urlLocale = new URLSearchParams(window.location.search).get('lang')
  if (urlLocale) return resolveLocale(urlLocale)
  try {
    const saved = localStorage.getItem(localeKey)
    if (saved) return resolveLocale(saved)
  } catch { /* localStorage can be unavailable in hardened browsers. */ }
  return resolveLocale(navigator.languages?.[0] || navigator.language || 'en')
}

const readInitialDomain = () => {
  const urlDomain = new URLSearchParams(window.location.search).get('domain')
  if (domainIds.includes(urlDomain)) return urlDomain
  try {
    const saved = localStorage.getItem(domainKey)
    return domainIds.includes(saved) ? saved : null
  } catch { return null }
}

const todayKey = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const get = (type) => parts.find((part) => part.type === type)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

const dayNumber = () => Math.max(1, Math.floor((Date.now() - new Date('2026-01-01T00:00:00+08:00')) / 86400000) + 1)

const emptyProfile = () => ({
  version: 3,
  xp: 0,
  clues: 0,
  streak: 0,
  lastCompleted: null,
  dailyModes: {},
  dailyCases: {},
  completedSessions: [],
  modeCompletions: { drill: 0, scene: 0, expedition: 0, detective: 0 },
  structures: [],
  sfx: true,
  music: true,
  musicVolume: 0.34,
})

const migrateProfile = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return emptyProfile()
  if (parsed.version === 3) return {
    ...emptyProfile(), ...parsed,
    modeCompletions: { ...emptyProfile().modeCompletions, ...parsed.modeCompletions },
  }
  if (parsed.version === 2) return {
    ...emptyProfile(),
    xp: Number(parsed.xp) || 0,
    clues: Number(parsed.clues) || 0,
    streak: Number(parsed.streak) || 0,
    lastCompleted: parsed.lastCompleted || null,
    structures: Array.isArray(parsed.structures) ? parsed.structures : [],
    sfx: parsed.sound !== false,
  }
  return emptyProfile()
}

const readProfile = () => {
  try {
    const raw = localStorage.getItem(passportKey) || localStorage.getItem(legacyPassportKey)
    return migrateProfile(JSON.parse(raw || 'null'))
  } catch {
    return emptyProfile()
  }
}

const state = {
  locale: readInitialLocale(),
  domain: readInitialDomain(),
  screen: 'select',
  modal: null,
  selectedMode: null,
  phase: 'briefing',
  step: 0,
  answer: null,
  results: [],
  earnedXp: 0,
  profile: readProfile(),
  sceneObservation: '',
  scenePosition: null,
  sceneBlindspot: '',
  sceneCommitment: null,
  sceneDecisionReason: '',
  completedSummary: null,
  daily: {
    status: 'loading',
    envelope: null,
    error: null,
    phase: 'briefing',
    step: 0,
    answer: null,
    results: [],
    earnedXp: 0,
    submitting: false,
    requestId: 0,
    summary: null,
  },
}

const copy = () => getUiCopy(state.locale)
const localizedContent = () => getDemoContent(state.locale)
const gameModes = () => localizedContent().gameModes
const modeList = () => localizedContent().modeList
const modeTitle = (mode) => mode?.title || mode?.zh || mode?.label || ''
const scopedModeList = () => {
  if (!state.domain) return []
  if (state.domain === 'all') return modeList()
  return modeList().flatMap((mode) => {
    if (!mode.domains?.includes(state.domain)) return []
    if (mode.id !== 'drill') return [mode]
    const items = mode.items.filter((item) => item.domain === state.domain)
    if (!items.length) return []
    const strings = copy()
    return [{
      ...mode,
      items,
      duration: state.locale === 'zh-TW' ? '3 分鐘' : '3 min',
      description: interpolate(strings.domains.drillExcerpt, {
        domain: strings.domains.labels[state.domain], count: items.length,
      }),
      mechanic: interpolate(strings.domains.drillMechanic, { count: items.length }),
    }]
  })
}
const scopedGameModes = () => Object.fromEntries(scopedModeList().map((mode) => [mode.id, mode]))

const app = document.querySelector('#app')
const worldRoot = document.querySelector('#world-root')
const world = {
  status: 'deferred',
  pendingMode: 'detective',
  instance: null,
  setActiveMode(mode) {
    this.pendingMode = mode
    worldRoot.dataset.activeMode = mode
    this.instance?.setActiveMode(mode)
  },
  activate() {
    if (this.instance || state.screen !== 'select') return
    this.instance = createWorld(worldRoot)
    this.status = this.instance.status
    this.instance.setActiveMode(this.pendingMode)
    document.querySelector('[data-world-status]')?.replaceChildren(this.status.toUpperCase())
  },
}
const feedback = createGameFeedback({ root: app, muted: !state.profile.sfx })
const music = createGameMusic({ enabled: state.profile.music, volume: state.profile.musicVolume })
feedback.arm(app)
music.arm(app)

const requestWorldActivation = () => {
  const activate = () => world.activate()
  if ('requestIdleCallback' in window) window.requestIdleCallback(activate, { timeout: 900 })
  else window.setTimeout(activate, 220)
}
window.addEventListener('pointermove', requestWorldActivation, { once: true, passive: true })
window.addEventListener('focusin', requestWorldActivation, { once: true, passive: true })

const artUrl = (path) => new URL(`../assets/art/${path}`, import.meta.url).href
const characterFolders = {
  lin_wuhua: 'lin-wuhua',
  cheng_yanzhou: 'cheng-yanzhou',
  ada_bell: 'ada-bell',
  oscar_vale: 'oscar-vale',
}

const writeProfile = () => {
  localStorage.setItem(passportKey, JSON.stringify(state.profile))
}

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;')

const dailyDatePattern = /^\d{4}-\d{2}-\d{2}$/
const dailySlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const dailyChoicePattern = /^[A-Z][A-Z0-9]{0,2}$/
const dailyBackgroundPattern = /^web\/assets\/art\/backgrounds\/[a-z0-9-]+\.webp$/
const forbiddenDailyFields = new Set([
  'answer', 'answerkey', 'correct', 'correctanswer', 'correctoption', 'correctoptionid',
  'explanation', 'feedback', 'hint', 'key', 'miss', 'rationale', 'reveal', 'reward',
  'score', 'solution', 'success', 'verdict', 'verdicts',
])
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isDailyText = (value, max = 50_000) => typeof value === 'string' && value.length > 0 && value.length <= max
const hasExactDailyKeys = (value, keys) => isRecord(value)
  && Object.keys(value).length === keys.length
  && keys.every((key) => Object.hasOwn(value, key))
const isValidDailyDate = (value) => {
  if (!dailyDatePattern.test(value || '')) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
}
const hasForbiddenDailyField = (value) => {
  if (Array.isArray(value)) return value.some(hasForbiddenDailyField)
  if (!isRecord(value)) return false
  return Object.entries(value).some(([key, child]) => {
    const normalized = key.toLowerCase().replaceAll(/[^a-z]/g, '')
    return forbiddenDailyFields.has(normalized) || hasForbiddenDailyField(child)
  })
}

const validateDailyChoiceItem = (item) => hasExactDailyKeys(item, [
  'id', 'chapter', 'location', 'speaker', 'role', 'characterId', 'backgroundAsset',
  'briefing', 'evidenceTitle', 'evidence', 'prompt', 'options',
])
  && dailySlugPattern.test(item.id)
  && ['chapter', 'location', 'speaker', 'role', 'briefing', 'evidenceTitle', 'evidence', 'prompt'].every((key) => isDailyText(item[key]))
  && typeof item.characterId === 'string'
  && dailyBackgroundPattern.test(item.backgroundAsset)
  && Array.isArray(item.options)
  && item.options.length >= 2
  && item.options.length <= 6
  && item.options.every((option) => hasExactDailyKeys(option, ['id', 'text']) && dailyChoicePattern.test(option.id) && isDailyText(option.text))

const validateDailyScene = (content) => hasExactDailyKeys(content, ['kind', 'scene', 'lenses', 'positions', 'commitments'])
  && content.kind === 'multi-lens-scene'
  && hasExactDailyKeys(content.scene, ['location', 'speaker', 'role', 'characterId', 'backgroundAsset', 'text'])
  && ['location', 'speaker', 'role', 'text'].every((key) => isDailyText(content.scene[key]))
  && typeof content.scene.characterId === 'string'
  && dailyBackgroundPattern.test(content.scene.backgroundAsset)
  && Array.isArray(content.lenses)
  && content.lenses.length === 6
  && content.lenses.every((lens) => hasExactDailyKeys(lens, ['id', 'label', 'reading', 'prompt', 'options'])
    && typeof lens.id === 'string'
    && ['label', 'reading', 'prompt'].every((key) => isDailyText(lens[key]))
    && Array.isArray(lens.options)
    && lens.options.length >= 2
    && lens.options.every((option) => isDailyText(option)))
  && Array.isArray(content.positions)
  && content.positions.length === 3
  && content.positions.every((position) => isDailyText(position))
  && Array.isArray(content.commitments)
  && content.commitments.length === 3
  && content.commitments.every((commitment) => hasExactDailyKeys(commitment, ['id', 'text', 'objection'])
    && dailyChoicePattern.test(commitment.id)
    && isDailyText(commitment.text)
    && isDailyText(commitment.objection))

const validateDailyEnvelope = (payload) => {
  if (!hasExactDailyKeys(payload, ['schemaVersion', 'date', 'timeZone', 'rotationId', 'contentId', 'answerable', 'gradingAvailable', 'case'])
    || payload.schemaVersion !== 1 || !isValidDailyDate(payload.date)) return null
  if (payload.timeZone !== 'Asia/Taipei' || !dailySlugPattern.test(payload.contentId)) return null
  if (typeof payload.answerable !== 'boolean' || typeof payload.gradingAvailable !== 'boolean') return null
  const dailyCase = payload.case
  const dailyCaseKeys = [
    '$schema', 'schemaVersion', 'id', 'publishDate', 'locale', 'visibility', 'mode',
    'title', 'canonicalSourcePaths', 'content',
  ]
  if (!(hasExactDailyKeys(dailyCase, dailyCaseKeys) || hasExactDailyKeys(dailyCase, [...dailyCaseKeys, 'domain']))
    || dailyCase.schemaVersion !== 1 || dailyCase.id !== payload.contentId) return null
  if (hasForbiddenDailyField(dailyCase)) return null
  if (!isValidDailyDate(dailyCase.publishDate) || dailyCase.visibility !== 'public' || !isDailyText(dailyCase.locale)) return null
  if (!Array.isArray(dailyCase.canonicalSourcePaths) || dailyCase.canonicalSourcePaths.length < 2 || !dailyCase.canonicalSourcePaths.every((path) => isDailyText(path))) return null
  if (!['drill', 'scene', 'expedition', 'detective'].includes(dailyCase.mode) || !isDailyText(dailyCase.title)) return null
  if (dailyCase.domain !== undefined && !domainIds.slice(1).includes(dailyCase.domain)) return null
  if (!isRecord(dailyCase.content)) return null
  if (dailyCase.mode === 'scene') {
    if (!validateDailyScene(dailyCase.content) || payload.gradingAvailable) return null
  } else if (!hasExactDailyKeys(dailyCase.content, ['kind', 'items'])
    || dailyCase.content.kind !== 'choice-sequence'
    || !Array.isArray(dailyCase.content.items)
    || dailyCase.content.items.length < 1
    || dailyCase.content.items.length > 20
    || !dailyCase.content.items.every(validateDailyChoiceItem)
    || (payload.answerable && !payload.gradingAvailable)) return null
  return payload
}

const dailyBackgroundUrl = (path) => {
  if (!dailyBackgroundPattern.test(path || '')) return artUrl('backgrounds/society-reading-room-rain-night.webp')
  return artUrl(`backgrounds/${path.split('/').at(-1)}`)
}

const dailyCharacterUrl = (characterId, phase = 'briefing', outcome = null) => {
  const folder = characterFolders[characterId]
  if (!folder) return ''
  const pose = phase === 'reveal'
    ? outcome === 'hit' ? 'success' : outcome === 'miss' ? 'concern-recover' : 'explain-clue'
    : 'neutral-listen'
  return artUrl(`characters/${folder}/${pose}.webp`)
}

const formatDailyDate = (dateKey) => {
  const date = new Date(`${dateKey}T12:00:00+08:00`)
  return new Intl.DateTimeFormat(state.locale === 'zh-TW' ? 'zh-Hant-TW' : 'en-US', {
    timeZone: 'Asia/Taipei', month: 'long', day: 'numeric', weekday: 'short',
  }).format(date)
}

const completedToday = () => state.profile.dailyModes[todayKey()] || []
const rank = () => Math.max(1, Math.floor(state.profile.xp / 120) + 1)
const xpInRank = () => state.profile.xp % 120
const currentMode = () => scopedGameModes()[state.selectedMode] || null
const dailyLocaleMatches = () => {
  const locale = state.daily.envelope?.case?.locale
  return !locale || resolveLocale(locale) === state.locale
}

const applyLocaleMeta = () => {
  const strings = copy()
  document.documentElement.lang = state.locale === 'zh-TW' ? 'zh-Hant-TW' : 'en'
  document.documentElement.dataset.locale = state.locale
  document.title = strings.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', strings.meta.description)
}

const announce = (message) => {
  const live = document.createElement('span')
  live.className = 'sr-only'
  live.setAttribute('role', 'status')
  live.textContent = message
  app.append(live)
  window.setTimeout(() => live.remove(), 2200)
}

const showToast = (target, message) => {
  if (!target) return
  target.querySelector('.game-toast')?.remove()
  const toast = document.createElement('div')
  toast.className = 'game-toast'
  toast.setAttribute('role', 'status')
  toast.textContent = message
  target.append(toast)
  window.setTimeout(() => toast.remove(), 5600)
}

const languageToggle = (dark = false) => {
  const strings = copy()
  return `<div class="language-switch${dark ? ' language-switch--dark' : ''}" role="group" aria-label="${strings.language.label}">
    ${supportedLocales.map((locale) => `<button type="button" data-locale="${locale}" lang="${locale === 'zh-TW' ? 'zh-Hant-TW' : 'en'}" aria-pressed="${state.locale === locale}">${locale === 'zh-TW' ? strings.language.zh : strings.language.en}</button>`).join('')}
  </div>`
}

const brand = () => {
  const strings = copy()
  return `
  <button class="case-brand" type="button" data-action="select">
    <span class="case-brand__seal" aria-hidden="true">${strings.brand.seal}</span>
    <span><strong>${strings.brand.name}</strong><small>${strings.brand.subtitle}</small></span>
  </button>`
}

const audioButtons = (dark = false) => {
  const strings = copy()
  return `
  <button class="round-icon${dark ? ' round-icon--dark' : ''}" type="button" data-action="toggle-music" aria-pressed="${state.profile.music}" aria-label="${state.profile.music ? strings.audio.musicOn : strings.audio.musicOff}">
    <span aria-hidden="true">${state.profile.music ? '♫' : '♩'}</span>
  </button>
  <button class="round-icon${dark ? ' round-icon--dark' : ''}" type="button" data-action="toggle-sfx" aria-pressed="${state.profile.sfx}" aria-label="${state.profile.sfx ? strings.audio.sfxOn : strings.audio.sfxOff}">
    <span aria-hidden="true">${state.profile.sfx ? '◖' : '×'}</span>
  </button>`
}

const topStats = () => {
  const strings = copy()
  return `
  <div class="game-topbar__stats" aria-label="${strings.stats.label}">
    <span class="game-stat game-stat--flame"><i aria-hidden="true">♠</i><span><small>${strings.stats.streak}</small><strong>${state.profile.streak} ${strings.stats.day}</strong></span></span>
    <span class="game-stat"><i aria-hidden="true">⌕</i><span><small>${strings.stats.clues}</small><strong>${state.profile.clues}</strong></span></span>
    <span class="game-stat game-stat--rank"><i aria-hidden="true">${rank()}</i><span><small>${strings.stats.rank}</small><strong>${state.profile.xp} XP</strong></span></span>
  </div>`
}

const modalButtons = () => {
  const strings = copy()
  return `
  <div class="game-topbar__actions">
    ${languageToggle()}
    ${audioButtons()}
    <button class="round-icon" type="button" data-action="audio-settings" aria-label="${strings.audio.settings}"><span aria-hidden="true">⚙</span></button>
    <button class="round-icon" type="button" data-action="providers" aria-label="${strings.home.routeLabel}"><span aria-hidden="true">⌁</span></button>
    <button class="passport-compact" type="button" data-action="passport" aria-label="${strings.stats.passportLabel}"><span aria-hidden="true"></span><strong>${strings.stats.passport}</strong></button>
  </div>`
}

const dailyIsCompleted = () => {
  const envelope = state.daily.envelope
  if (!envelope || !isRecord(state.profile.dailyCases)) return false
  const cases = state.profile.dailyCases[envelope.date]
  return Array.isArray(cases) && cases.includes(envelope.contentId)
}

const dailyDomain = () => {
  const declared = state.daily.envelope?.case?.domain
  if (domainIds.slice(1).includes(declared)) return declared
  const id = state.daily.envelope?.contentId || ''
  if (id.includes('measurement-gap')) return 'education'
  if (id.includes('base-rate')) return 'health'
  if (id.includes('category-break') || id.includes('scope-boundary')) return 'science'
  if (id.includes('raven-ai-audit')) return 'work'
  if (id.includes('unanswered-reply') || id.includes('alternative-cause')) return 'public'
  return null
}

const domainModeCount = (domain) => {
  if (domain === 'all') return modeList().length
  return modeList().filter((mode) => mode.domains?.includes(domain)).length
}

const renderDomainChooser = () => {
  const strings = copy()
  if (state.domain) {
    const label = strings.domains.labels[state.domain]
    return `<section class="domain-chooser domain-chooser--complete" data-domain="${state.domain}" aria-labelledby="domain-title">
      <div class="domain-summary">
        <div><span class="section-code">${strings.domains.complete}</span><h2 id="domain-title">${interpolate(strings.domains.selected, { domain: label })}</h2></div>
        <p>${strings.domains.descriptions[state.domain]} <strong>${interpolate(strings.domains.available, { count: domainModeCount(state.domain) })}</strong></p>
        <button type="button" data-action="change-domain">${strings.domains.change}</button>
      </div>
    </section>`
  }
  return `<section class="domain-chooser" aria-labelledby="domain-title">
    <div class="domain-chooser__heading"><div><span class="section-code">${strings.domains.code}</span><h2 id="domain-title">${strings.domains.title}</h2></div><p>${strings.domains.intro}</p></div>
    <div class="domain-grid" role="group" aria-label="${strings.domains.title}">
      ${domainIds.map((domain, index) => `<button type="button" data-domain="${domain}" aria-pressed="false"><span>${String(index + 1).padStart(2, '0')}</span><strong>${strings.domains.labels[domain]}</strong><p>${strings.domains.descriptions[domain]}</p><small>${interpolate(strings.domains.available, { count: domainModeCount(domain) })}</small><i aria-hidden="true">○</i></button>`).join('')}
    </div>
    <p class="domain-chooser__prompt" role="status">${strings.domains.chooseFirst}</p>
  </section>`
}

const renderDailyFeature = () => {
  const strings = copy()
  const envelope = state.daily.envelope
  const dailyCase = envelope?.case
  const complete = dailyIsCompleted()
  const localeMismatch = Boolean(dailyCase && !dailyLocaleMatches())
  const featureState = localeMismatch ? 'locale-unavailable' : complete ? 'complete' : state.daily.status
  const content = dailyCase?.content
  const backgroundPath = content?.kind === 'choice-sequence'
    ? content.items[0]?.backgroundAsset
    : content?.scene?.backgroundAsset
  const statusCopy = localeMismatch
    ? strings.daily.localeUnavailable
    : featureState === 'loading'
      ? strings.daily.loading
    : featureState === 'ready'
      ? dailyCase.mode === 'scene' ? strings.daily.readyScene : interpolate(strings.daily.readyChoice, { count: content.items.length })
      : featureState === 'complete'
        ? strings.daily.complete
        : dailyCase
          ? strings.daily.unavailableCase
          : strings.daily.unavailable
  const action = featureState === 'ready' || featureState === 'complete'
    ? `<button class="daily-feature__action" type="button" data-action="start-daily"><span>${complete ? strings.daily.reopen : strings.daily.open}</span><i aria-hidden="true">→</i></button>`
    : featureState === 'loading'
      ? `<button class="daily-feature__action" type="button" disabled><span>${strings.daily.receiving}</span><i aria-hidden="true">···</i></button>`
      : `<div class="daily-feature__actions"><button class="daily-feature__action" type="button" data-action="start-daily" disabled><span>${strings.daily.disabled}</span><i aria-hidden="true">×</i></button>${localeMismatch ? '' : `<button class="daily-feature__retry" type="button" data-action="retry-daily" aria-label="${strings.daily.retryLabel}">↻</button>`}</div>`

  const safeTitle = localeMismatch ? strings.daily.dispatch : dailyCase?.title

  return `
    <section class="daily-feature" data-state="${featureState}" aria-labelledby="daily-feature-title" aria-busy="${featureState === 'loading'}">
      ${backgroundPath ? `<img class="daily-feature__backdrop" src="${dailyBackgroundUrl(backgroundPath)}" alt="" aria-hidden="true" decoding="async" loading="lazy">` : ''}
      <div class="daily-feature__veil" aria-hidden="true"></div>
      <div class="daily-feature__dispatch">
        <span class="daily-feature__seal" aria-hidden="true">${complete ? '✓' : state.locale === 'zh-TW' ? '密' : '?'}</span>
        <div><span class="section-code">${strings.daily.dispatch} · ${dailyCase ? escapeHtml(dailyModeEnglish[dailyCase.mode]) : strings.daily.connecting}</span><small>${envelope ? escapeHtml(formatDailyDate(envelope.date)) : strings.daily.timezone}</small></div>
      </div>
      <div class="daily-feature__copy">
        <span class="daily-feature__eyebrow">${featureState === 'unavailable' ? strings.daily.preview : complete ? strings.daily.closed : strings.daily.duration}</span>
        <h2 id="daily-feature-title">${safeTitle ? escapeHtml(safeTitle) : strings.daily.arriving}</h2>
        <p>${escapeHtml(statusCopy)}</p>
      </div>
      <div class="daily-feature__meta">
        <span><small>${strings.daily.mode}</small><strong>${dailyCase ? escapeHtml(strings.daily.labels[dailyCase.mode]) : strings.daily.waiting}</strong></span>
        <span><small>${strings.daily.ruling}</small><strong>${envelope?.gradingAvailable ? strings.daily.sealed : dailyCase?.mode === 'scene' && envelope?.answerable ? strings.daily.neutral : strings.daily.notEnabled}</strong></span>
      </div>
      ${action}
    </section>`
}

const renderSelector = () => {
  const strings = copy()
  worldRoot.style.display = 'block'
  world.setActiveMode(scopedModeList()[0]?.id || 'detective')
  const done = completedToday()
  const availableModes = scopedModeList()
  const date = new Intl.DateTimeFormat(state.locale === 'zh-TW' ? 'zh-Hant-TW' : 'en-US', {
    timeZone: 'Asia/Taipei', month: 'long', day: 'numeric', weekday: 'short',
  }).format(new Date())

  app.innerHTML = `
    <main class="mode-gateway">
      <div class="casebook-grain" aria-hidden="true"></div>
      <header class="game-topbar gateway-topbar">
        ${brand()}${topStats()}${modalButtons()}
      </header>

      <section class="gateway-hero" aria-labelledby="gateway-title">
        <div class="gateway-hero__copy">
          <div class="eyebrow-row"><span class="case-chip">${strings.home.practice} · NO. ${String(dayNumber()).padStart(3, '0')}</span><span>${date}</span></div>
          <p class="gateway-hero__overline">${strings.home.overline}</p>
          <h1 id="gateway-title">${strings.home.titleBefore}<br><em>${strings.home.titleEmphasis}</em></h1>
          <p>${strings.home.intro}</p>
        </div>
        <aside class="gateway-daily" aria-label="${strings.home.circuitLabel}">
          <span class="section-code">${strings.home.circuit}</span>
          <strong>${done.length} / 4</strong>
          <p>${done.length === 4 ? strings.home.circuitDone : strings.home.circuitOpen}</p>
          <div>${modeIds.map((id) => `<i${done.includes(id) ? ' data-done' : ''} title="${escapeHtml(modeTitle(gameModes()[id]))}">${done.includes(id) ? '✓' : gameModes()[id].order}</i>`).join('')}</div>
        </aside>
      </section>

      ${renderDomainChooser()}

      ${state.domain ? `<section class="mode-choice-section" aria-labelledby="mode-choice-title" data-domain="${state.domain}">
        <div class="section-title-row gateway-section-title"><div><span class="section-code">${strings.domains.stepTwo} · ${strings.domains.labels[state.domain]}</span><h2 id="mode-choice-title">${strings.home.sectionTitle}</h2></div><p>${strings.home.sectionNote}</p></div>
        <div class="mode-choice-grid">
          ${availableModes.map((mode) => `
            <button class="mode-choice-card" type="button" data-mode="${mode.id}">
              <img src="${artUrl(mode.thumbnail)}" alt="" aria-hidden="true" decoding="async" loading="eager">
              <span class="mode-choice-card__shade" aria-hidden="true"></span>
              <span class="mode-choice-card__number">${mode.order}</span>
              <span class="mode-choice-card__status">${done.includes(mode.id) ? strings.home.completed : mode.duration}</span>
              <span class="mode-choice-card__body">
                <small>${mode.label} · ${mode.topic}</small>
                <strong>${modeTitle(mode)}</strong>
                <em>${mode.tagline}</em>
                <span>${mode.description}</span>
                <b>${mode.mechanic}<i aria-hidden="true">→</i></b>
              </span>
            </button>`).join('')}
        </div>
        ${availableModes.length ? '' : `<p class="domain-empty">${strings.domains.noCases}</p>`}
      </section>` : ''}

      ${state.domain && (state.domain === 'all' || dailyDomain() === state.domain) ? renderDailyFeature() : ''}

      <section class="entry-route-strip" aria-label="${strings.home.routeLabel}">
        <span class="section-code">${strings.routes.code}</span>
        <p>${strings.home.routesSummary}</p>
        <button type="button" data-action="providers">${strings.home.routeButton}</button>
      </section>

      <footer class="game-footer"><span>${strings.home.privacyFooter}</span><span>WEBGL <i data-world-status>${world.status.toUpperCase()}</i> · CONTENT SCHEMA ${contentManifest.schemaVersion}</span></footer>
      ${renderModal()}
    </main>`
}

const modeBoundaryNote = (mode) => {
  if (mode.id === 'drill' && mode.items.length !== 3) return interpolate(copy().domains.drillBoundary, { count: mode.items.length })
  return copy().brief.boundaries[mode.id]
}

const renderBrief = () => {
  const strings = copy()
  const mode = currentMode()
  if (!mode) { state.screen = 'select'; renderSelector(); return }
  worldRoot.style.display = 'none'
  app.innerHTML = `
    <main class="mode-brief" data-mode="${mode.id}">
      <img class="mode-brief__backdrop" src="${artUrl(`backgrounds/${mode.background}`)}" alt="" aria-hidden="true">
      <div class="mode-brief__veil" aria-hidden="true"></div>
      <header class="brief-topbar"><button class="round-icon round-icon--dark" type="button" data-action="select" aria-label="${strings.common.back}"><span aria-hidden="true">←</span></button><span>${mode.label} · ${strings.common.fixedDemo.toUpperCase()}</span><div class="brief-topbar__tools">${languageToggle(true)}${audioButtons(true)}</div></header>
      <section class="mode-brief__panel" aria-labelledby="brief-title">
        <span class="mode-brief__index">${mode.order}</span>
        <div class="mode-brief__copy">
          <span class="section-code">${mode.label} · ${mode.topic}</span>
          <h1 id="brief-title">${escapeHtml(modeTitle(mode))}<br><em>${escapeHtml(mode.tagline)}</em></h1>
          <p>${mode.description}</p>
          <dl><div><dt>${strings.brief.route}</dt><dd>${mode.mechanic}</dd></div><div><dt>${strings.brief.duration}</dt><dd>${mode.duration}</dd></div><div><dt>${strings.brief.source}</dt><dd>${mode.source.map(escapeHtml).join(' · ')}</dd></div></dl>
          ${mode.caseFrame ? `<section class="case-frame" aria-label="${strings.brief.caseFrameTitle}"><h2>${strings.brief.caseFrameTitle}</h2><dl><div><dt>${strings.brief.frameClaim}</dt><dd>${escapeHtml(mode.caseFrame.claim)}</dd></div><div><dt>${strings.brief.frameSuccess}</dt><dd>${escapeHtml(mode.caseFrame.successCriterion)}</dd></div><div><dt>${strings.brief.frameStandard}</dt><dd>${escapeHtml(mode.caseFrame.decisionStandard)}</dd></div><div><dt>${strings.brief.frameEvidence}</dt><dd>${escapeHtml(mode.caseFrame.evidenceFrame)}</dd></div></dl></section>` : ''}
          <div class="mode-boundary"><span aria-hidden="true">!</span><p>${modeBoundaryNote(mode)}</p></div>
          ${mode.sourceNote ? `<p class="mode-source-note">${escapeHtml(mode.sourceNote)}</p>` : ''}
          <div class="mode-brief__actions"><button class="secondary-game-button" type="button" data-action="select">${strings.brief.chooseAnother}</button><button class="case-cta" type="button" data-action="start-mode"><span>${interpolate(strings.brief.enter, { mode: modeTitle(mode) })}</span><i aria-hidden="true">→</i></button></div>
        </div>
        <img class="mode-brief__character" src="${artUrl(`characters/${characterFolders[mode.character]}/explain-clue.webp`)}" alt="" aria-hidden="true" decoding="async">
      </section>
    </main>`
}

const characterArt = (item, reveal = false, hit = false) => {
  const folder = characterFolders[item.character]
  if (!folder) return ''
  const pose = reveal ? (hit ? 'success' : 'concern-recover') : 'neutral-listen'
  return artUrl(`characters/${folder}/${pose}.webp`)
}

const renderDissection = (item) => {
  const strings = copy()
  if (!Array.isArray(item.dissection) || item.dissection.length === 0) return ''
  return `<section class="option-review" aria-label="${strings.play.whyOptions}">
    <h3>${strings.play.whyOptions}</h3>
    <div>${item.dissection.map((entry) => {
      const isKey = entry.id === item.correct
      const isChosen = entry.id === state.answer
      return `<article data-key="${isKey}" data-chosen="${isChosen}"><span>${entry.id}</span><div><strong>${escapeHtml(entry.label)}</strong><p>${escapeHtml(entry.copy)}</p></div>${isChosen ? `<small>${strings.play.chosen}</small>` : ''}</article>`
    }).join('')}</div>
  </section>`
}

const playHeader = (mode, step, total) => `
  <header class="play-hud">
    <button class="round-icon round-icon--dark" type="button" data-action="exit-play" aria-label="${copy().common.exitMode}"><span aria-hidden="true">←</span></button>
    <div class="play-hud__title"><span>${mode.label} · ${mode.topic}</span><strong>${modeTitle(mode)}</strong></div>
    <div class="play-progress" aria-label="${copy().common.progress} ${step + 1} / ${total}">${Array.from({ length: total }, (_, index) => `<i${index < step ? ' data-done' : index === step ? ' data-current' : ''}>${index < step ? '✓' : index + 1}</i>`).join('')}</div>
    <div class="play-hud__reward"><span>+${state.earnedXp} XP</span></div>
    ${languageToggle(true)}
    ${audioButtons(true)}
  </header>`

const renderGradedReveal = (mode, item) => {
  const strings = copy()
  const result = state.results.at(-1)
  const hit = result?.hit
  const verdict = item.verdicts?.[state.answer]
  const heading = mode.id === 'expedition'
    ? verdict
    : hit ? item.keyLabel || strings.play.keyFound : interpolate(strings.play.answerIs, { answer: item.correct })
  return `
    <div class="play-ruling" data-result="${hit ? 'hit' : 'miss'}" data-style="${mode.id}">
      <span class="play-ruling__stamp">${mode.id === 'expedition' ? escapeHtml(verdict) : hit ? strings.play.hit : strings.play.review}</span>
      <div><span class="section-code">${escapeHtml(item.structureLabel)}</span><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(hit ? item.success : item.miss)}</p></div>
    </div>
    ${item.finalCaution ? `<div class="reasoning-boundary"><strong>!</strong><p>${escapeHtml(item.finalCaution)}</p></div>` : ''}
    ${renderDissection(item)}
    <div class="play-reward-row"><span><i aria-hidden="true">✦</i> +${result?.xp || 0} XP</span><span><i aria-hidden="true">⌕</i> ${escapeHtml(item.structureLabel)}</span><small>${mode.id === 'expedition' ? strings.play.forecastNote : strings.play.practiceNote}</small></div>
    <p class="challenge-note">${escapeHtml(mode.challengeNote || strings.play.challengeNote)}</p>
    <div class="play-actions"><button class="hint-link" type="button" data-action="explain">${strings.play.explainAgain}</button><button class="dialogue-next" type="button" data-action="next-step">${state.step === mode.items.length - 1 ? strings.play.summary : strings.play.next} <i aria-hidden="true">→</i></button></div>`
}

const renderGradedPlay = () => {
  const strings = copy()
  const mode = currentMode()
  const item = mode.items[state.step]
  const reveal = state.phase === 'reveal'
  const hit = state.answer === item.correct
  worldRoot.style.display = 'none'
  app.innerHTML = `
    <main class="mode-play" data-mode="${mode.id}">
      <img class="play-backdrop" src="${artUrl(`backgrounds/${item.background}`)}" alt="" aria-hidden="true">
      <div class="play-backdrop__veil" aria-hidden="true"></div>
      ${playHeader(mode, state.step, mode.items.length)}
      <section class="play-stage" aria-labelledby="play-speaker">
        <aside class="play-evidence"${state.phase === 'briefing' ? ' data-sealed' : ''}>
          <span class="play-evidence__pin" aria-hidden="true"></span><span class="section-code">${item.chapter}</span>
          <h2>${escapeHtml(item.evidenceTitle)}</h2><p>${escapeHtml(item.evidence)}</p><small>${interpolate(strings.play.fixedVersion, { version: contentManifest.skillVersion })}</small>
        </aside>
        <div class="play-character" aria-label="${item.speaker}，${item.role}"><img src="${characterArt(item, reveal, hit)}" alt="" aria-hidden="true" decoding="async"><span aria-hidden="true"></span></div>
        <div class="play-dialogue">
          <div class="speaker-plate"><span>${item.role}</span><strong id="play-speaker">${item.speaker}</strong></div>
          ${state.phase === 'briefing' ? `
            <p class="play-copy">${escapeHtml(item.briefing)}</p>
            <div class="play-actions"><span>${strings.play.sealed}</span><button class="dialogue-next" type="button" data-action="inspect">${strings.play.inspect} <i aria-hidden="true">→</i></button></div>
          ` : state.phase === 'question' ? `
            <p class="play-prompt">${escapeHtml(item.prompt)}</p>
            <div class="play-choices">${item.options.map(([id, optionCopy]) => `<button type="button" data-answer="${id}"${state.answer === id ? ' data-selected' : ''}><span>${id}</span><strong>${escapeHtml(optionCopy)}</strong><i aria-hidden="true">${state.answer === id ? '●' : '○'}</i></button>`).join('')}</div>
            <div class="play-actions"><button class="hint-link" type="button" data-action="hint">${strings.play.hint}</button><button class="dialogue-next" type="button" data-action="lock-answer"${state.answer ? '' : ' disabled'}>${mode.id === 'expedition' ? strings.play.lockPrediction : strings.play.lockAnswer} <i aria-hidden="true">→</i></button></div>
          ` : renderGradedReveal(mode, item)}
        </div>
      </section>
    </main>`
  if (reveal) requestAnimationFrame(() => {
    const target = document.querySelector('.play-ruling')
    if (mode.id === 'expedition') feedback.cue.clue(target, { stamp: item.verdicts?.[state.answer], count: 8 })
    else if (hit) feedback.cue.success(target)
    else feedback.cue.wrong(target)
  })
}

const renderSceneObservation = (mode, scene) => {
  const strings = copy()
  return `
  <div class="scene-observation">
    <span class="section-code">${strings.scene.observeCode}</span>
    <h2>${strings.scene.observeTitle}</h2>
    <p>${escapeHtml(scene.observationPrompt || strings.scene.observeBody)}</p>
    <blockquote>${escapeHtml(scene.scene)}</blockquote>
    <label for="scene-observation">${strings.scene.observationLabel}</label>
    <textarea id="scene-observation" rows="3" maxlength="500" placeholder="${strings.scene.observationPlaceholder}">${escapeHtml(state.sceneObservation)}</textarea>
    <div class="play-actions"><small>${strings.scene.localOnly}</small><button class="dialogue-next" type="button" data-action="submit-observation"${state.sceneObservation.trim() ? '' : ' disabled'}>${strings.scene.saveObservation} <i aria-hidden="true">→</i></button></div>
  </div>`
}

const renderSceneLens = (mode, scene) => {
  const strings = copy()
  const lens = scene.lenses[state.step]
  const reveal = state.phase === 'lens-reveal'
  const selectedFeedback = lens.optionFeedback?.[Number(state.answer)] || lens.feedback
  return `
    <div class="scene-lens">
      <div class="scene-lens__counter"><span>${String(state.step + 1).padStart(2, '0')}</span><small>/ 06</small></div>
      <span class="section-code">${strings.scene.angleCode} ${String(state.step + 1).padStart(2, '0')}</span>
      <h2>${escapeHtml(lens.label)}</h2>
      <p class="scene-lens__reading">${escapeHtml(lens.reading)}</p>
      <p class="play-prompt">${escapeHtml(lens.prompt)}</p>
      <div class="play-choices play-choices--scene">${lens.options.map((optionCopy, index) => `<button type="button" data-answer="${index}"${state.answer === String(index) ? ' data-selected' : ''}${reveal ? ' disabled' : ''}><span>${index + 1}</span><strong>${escapeHtml(optionCopy)}</strong><i aria-hidden="true">${state.answer === String(index) ? '●' : '○'}</i></button>`).join('')}</div>
      ${reveal ? `<div class="scene-neutral-feedback"><span aria-hidden="true">◉</span><p><strong>${strings.scene.reviewed}</strong>${escapeHtml(selectedFeedback)}</p></div><div class="play-actions"><span>${strings.scene.noPreferred}</span><button class="dialogue-next" type="button" data-action="next-lens">${state.step === 5 ? strings.scene.nextSelf : strings.scene.nextAngle} <i aria-hidden="true">→</i></button></div>` : `<div class="play-actions"><button class="hint-link" type="button" data-action="scene-hint">${strings.scene.angleHint}</button><button class="dialogue-next" type="button" data-action="lock-lens"${state.answer === null ? ' disabled' : ''}>${strings.scene.reviewAngle} <i aria-hidden="true">→</i></button></div>`}
    </div>`
}

const renderSceneCamera = (scene) => {
  const strings = copy()
  return `
  <div class="scene-camera">
    <span class="section-code">${strings.scene.cameraCode}</span><h2>${strings.scene.cameraTitle}</h2><p>${escapeHtml(scene.positionPrompt || strings.scene.cameraBody)}</p>
    <div class="play-choices">${scene.positions.map((position, index) => `<button type="button" data-position="${index}"${state.scenePosition === index ? ' data-selected' : ''}><span>${index + 1}</span><strong>${escapeHtml(position)}</strong><i aria-hidden="true">${state.scenePosition === index ? '●' : '○'}</i></button>`).join('')}</div>
    <label for="scene-blindspot">${strings.scene.blindspotLabel}</label><textarea id="scene-blindspot" rows="2" maxlength="300" placeholder="${strings.scene.blindspotPlaceholder}">${escapeHtml(state.sceneBlindspot)}</textarea>
    <div class="play-actions"><span>${strings.scene.revisable}</span><button class="dialogue-next" type="button" data-action="submit-camera"${state.scenePosition === null || !state.sceneBlindspot.trim() ? ' disabled' : ''}>${strings.scene.savePosition} <i aria-hidden="true">→</i></button></div>
  </div>`
}

const renderSceneCommitment = (scene) => {
  const strings = copy()
  return `
  <div class="scene-commitment">
    <span class="section-code">${strings.scene.commitmentCode}</span><h2>${strings.scene.commitmentTitle}</h2><p>${escapeHtml(scene.commitmentPrompt || strings.scene.commitmentBody)}</p>
    <div class="play-choices">${scene.commitments.map((commitment, index) => `<button type="button" data-commitment="${index}"${state.sceneCommitment === index ? ' data-selected' : ''}><span>${index + 1}</span><strong>${escapeHtml(commitment.text)}</strong><i aria-hidden="true">${state.sceneCommitment === index ? '●' : '○'}</i></button>`).join('')}</div>
    <label for="scene-decision-reason">${strings.scene.reasonLabel}</label><textarea id="scene-decision-reason" rows="2" maxlength="400" placeholder="${strings.scene.reasonPlaceholder}">${escapeHtml(state.sceneDecisionReason)}</textarea>
    <div class="play-actions"><span>${strings.scene.noPreference}</span><button class="dialogue-next" type="button" data-action="pressure-test"${state.sceneCommitment === null || !state.sceneDecisionReason.trim() ? ' disabled' : ''}>${strings.scene.pressure} <i aria-hidden="true">→</i></button></div>
  </div>`
}

const renderScenePressure = (scene) => {
  const strings = copy()
  const commitment = scene.commitments[state.sceneCommitment]
  return `
    <div class="scene-pressure">
      <span class="section-code">${strings.scene.objectionCode}</span><h2>${strings.scene.objectionTitle}</h2>
      <blockquote>${escapeHtml(commitment.objection)}</blockquote><p>${strings.scene.objectionBody}</p>
      <div class="play-actions"><button class="secondary-game-button" type="button" data-action="revise-commitment">${strings.scene.revise}</button><button class="dialogue-next" type="button" data-action="hold-commitment">${strings.scene.hold} <i aria-hidden="true">→</i></button></div>
    </div>`
}

const renderScenePlay = () => {
  const strings = copy()
  const mode = currentMode()
  const scene = mode.scene
  const progressStep = state.phase === 'observation' ? 0 : state.phase === 'camera' || state.phase === 'commitment' || state.phase === 'pressure' ? 6 : state.step
  worldRoot.style.display = 'none'
  app.innerHTML = `
    <main class="mode-play mode-play--scene" data-mode="scene">
      <img class="play-backdrop" src="${artUrl(`backgrounds/${scene.background}`)}" alt="" aria-hidden="true"><div class="play-backdrop__veil" aria-hidden="true"></div>
      ${playHeader(mode, progressStep, 6)}
      <section class="scene-stage" aria-labelledby="scene-title">
        <aside class="scene-case-card"><span class="section-code">${strings.scene.fixedProcess}</span><h1 id="scene-title">${escapeHtml(scene.title)}</h1><p>${escapeHtml(scene.location)}</p><div class="scene-lamps" aria-label="${interpolate(strings.scene.lampLabel, { count: Math.min(state.step + (state.phase === 'lens-reveal' ? 1 : 0), 6) })}">${scene.lenses.map((lens, index) => `<i${index < state.step || (index === state.step && state.phase === 'lens-reveal') || ['camera', 'commitment', 'pressure'].includes(state.phase) ? ' data-lit' : ''} title="${escapeHtml(lens.label)}">${index + 1}</i>`).join('')}</div><small>${strings.scene.lampNote}</small></aside>
        <div class="scene-workbench">
          ${state.phase === 'observation' ? renderSceneObservation(mode, scene) : state.phase === 'lens' || state.phase === 'lens-reveal' ? renderSceneLens(mode, scene) : state.phase === 'camera' ? renderSceneCamera(scene) : state.phase === 'commitment' ? renderSceneCommitment(scene) : renderScenePressure(scene)}
        </div>
        <div class="scene-character"><img src="${artUrl(`characters/${characterFolders[scene.character]}/${state.phase === 'pressure' ? 'skeptical' : 'neutral-listen'}.webp`)}" alt="" aria-hidden="true"></div>
      </section>
    </main>`
}

const dailyPlayHeader = (mode, step, total) => `
  <header class="play-hud daily-play__hud">
    <button class="round-icon round-icon--dark" type="button" data-action="exit-daily" aria-label="${copy().common.exitDaily}"><span aria-hidden="true">←</span></button>
    <div class="play-hud__title"><span>${copy().daily.dispatch} · ${dailyModeEnglish[mode]}</span><strong>${copy().daily.dispatch}</strong></div>
    <div class="play-progress" aria-label="${copy().common.progress} ${step + 1} / ${total}">${Array.from({ length: total }, (_, index) => `<i${index < step ? ' data-done' : index === step ? ' data-current' : ''}>${index < step ? '✓' : index + 1}</i>`).join('')}</div>
    <div class="play-hud__reward"><span>+${state.daily.earnedXp} XP</span></div>
    ${languageToggle(true)}
    ${audioButtons(true)}
  </header>`

const renderDailyRuling = (result, isLast) => {
  const strings = copy()
  const outcome = result?.outcome || 'neutral'
  const reveal = result?.reveal || {}
  const heading = reveal.heading || (outcome === 'neutral' ? strings.scene.reviewed : outcome === 'hit' ? strings.play.hit : strings.play.review)
  const feedbackCopy = reveal.feedback || strings.scene.noPreferred
  return `
    <div class="daily-ruling play-ruling" data-result="${outcome}">
      <span class="play-ruling__stamp">${outcome === 'hit' ? strings.play.hit : outcome === 'miss' ? strings.play.review : strings.scene.reviewed}</span>
      <div><span class="section-code">${escapeHtml(reveal.structureLabel || (outcome === 'neutral' ? 'PROCESS · NOT A SCORE' : 'PRIVATE RULING'))}</span><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(feedbackCopy)}</p></div>
    </div>
    <div class="play-reward-row"><span><i aria-hidden="true">✦</i> +${Number(result?.xp) || 0} XP</span>${reveal.structureLabel ? `<span><i aria-hidden="true">⌕</i> ${escapeHtml(reveal.structureLabel)}</span>` : ''}<small>${outcome === 'neutral' ? strings.scene.noPreferred : strings.play.practiceNote}</small></div>
    <div class="play-actions"><span>${reveal.verdict ? escapeHtml(reveal.verdict) : strings.play.practiceNote}</span><button class="dialogue-next" type="button" data-action="next-daily">${isLast ? strings.play.summary : strings.play.next} <i aria-hidden="true">→</i></button></div>`
}

const renderDailyChoicePlay = (envelope) => {
  const strings = copy()
  const daily = state.daily
  const dailyCase = envelope.case
  const items = dailyCase.content.items
  const item = items[daily.step]
  const result = daily.results.at(-1)
  const reveal = daily.phase === 'reveal'
  const outcome = result?.outcome || null
  const character = dailyCharacterUrl(item.characterId, daily.phase, outcome)
  return `
    <main class="daily-play mode-play" data-mode="${escapeHtml(dailyCase.mode)}" data-case-id="${escapeHtml(envelope.contentId)}" data-date="${escapeHtml(envelope.date)}">
      <img class="play-backdrop" src="${dailyBackgroundUrl(item.backgroundAsset)}" alt="" aria-hidden="true"><div class="play-backdrop__veil" aria-hidden="true"></div>
      ${dailyPlayHeader(dailyCase.mode, daily.step, items.length)}
      <section class="play-stage" aria-labelledby="daily-play-speaker">
        <aside class="play-evidence"${daily.phase === 'briefing' ? ' data-sealed' : ''}>
          <span class="play-evidence__pin" aria-hidden="true"></span><span class="section-code">${escapeHtml(item.chapter)}</span>
          <h2>${escapeHtml(item.evidenceTitle)}</h2><p>${escapeHtml(item.evidence)}</p><small>${strings.daily.publicPrivate}</small>
        </aside>
        <div class="play-character" aria-label="${escapeHtml(item.speaker)}，${escapeHtml(item.role)}">${character ? `<img src="${character}" alt="" aria-hidden="true" decoding="async">` : ''}<span aria-hidden="true"></span></div>
        <div class="play-dialogue">
          <div class="speaker-plate"><span>${escapeHtml(item.role)}</span><strong id="daily-play-speaker">${escapeHtml(item.speaker)}</strong></div>
          ${daily.phase === 'briefing' ? `
            <p class="play-copy">${escapeHtml(item.briefing)}</p>
            <div class="play-actions"><span>${strings.play.sealed}</span><button class="dialogue-next" type="button" data-action="inspect-daily">${strings.play.inspect} <i aria-hidden="true">→</i></button></div>
          ` : daily.phase === 'question' || daily.phase === 'submitting' ? `
            <p class="play-prompt">${escapeHtml(item.prompt)}</p>
            <div class="play-choices">${item.options.map((option) => `<button type="button" data-daily-answer="${option.id}"${daily.answer === option.id ? ' data-selected' : ''}${daily.submitting ? ' disabled' : ''}><span>${option.id}</span><strong>${escapeHtml(option.text)}</strong><i aria-hidden="true">${daily.answer === option.id ? '●' : '○'}</i></button>`).join('')}</div>
            ${daily.error ? `<p class="daily-inline-error" role="alert">${escapeHtml(daily.error)}</p>` : ''}
            <div class="play-actions"><span>${strings.daily.answerOnly}</span><button class="dialogue-next" type="button" data-action="lock-daily-answer"${daily.answer && !daily.submitting ? '' : ' disabled'}>${daily.submitting ? strings.daily.checking : strings.play.lockAnswer} <i aria-hidden="true">→</i></button></div>
          ` : renderDailyRuling(result, daily.step === items.length - 1)}
        </div>
      </section>
    </main>`
}

const renderDailyScenePlay = (envelope) => {
  const strings = copy()
  const daily = state.daily
  const dailyCase = envelope.case
  const content = dailyCase.content
  const scene = content.scene
  const lens = content.lenses[daily.step]
  const result = daily.results.at(-1)
  const character = dailyCharacterUrl(scene.characterId, daily.phase, 'neutral')
  return `
    <main class="daily-play mode-play mode-play--scene" data-mode="scene" data-case-id="${escapeHtml(envelope.contentId)}" data-date="${escapeHtml(envelope.date)}">
      <img class="play-backdrop" src="${dailyBackgroundUrl(scene.backgroundAsset)}" alt="" aria-hidden="true"><div class="play-backdrop__veil" aria-hidden="true"></div>
      ${dailyPlayHeader('scene', daily.step, content.lenses.length)}
      <section class="scene-stage daily-scene-stage" aria-labelledby="daily-scene-title">
        <aside class="scene-case-card"><span class="section-code">${strings.daily.sceneExcerpt}</span><h1 id="daily-scene-title">${escapeHtml(dailyCase.title)}</h1><p>${escapeHtml(scene.location)}</p><div class="scene-lamps" aria-label="${interpolate(strings.scene.lampLabel, { count: daily.step + (daily.phase === 'reveal' ? 1 : 0) })}">${content.lenses.map((item, index) => `<i${index < daily.step || (index === daily.step && daily.phase === 'reveal') ? ' data-lit' : ''} title="${escapeHtml(item.label)}">${index + 1}</i>`).join('')}</div><small>${strings.scene.lampNote}</small></aside>
        <div class="scene-workbench daily-scene-workbench">
          ${daily.phase === 'briefing' ? `<div class="scene-observation"><span class="section-code">${strings.scene.observeCode}</span><h2>${strings.daily.sceneRead}</h2><blockquote>${escapeHtml(scene.text)}</blockquote><div class="play-actions"><span>${strings.daily.sceneNoText}</span><button class="dialogue-next" type="button" data-action="inspect-daily">${strings.daily.firstAngle} <i aria-hidden="true">→</i></button></div></div>` : daily.phase === 'question' ? `<div class="scene-lens"><div class="scene-lens__counter"><span>${String(daily.step + 1).padStart(2, '0')}</span><small>/ ${String(content.lenses.length).padStart(2, '0')}</small></div><span class="section-code">${strings.scene.angleCode} ${String(daily.step + 1).padStart(2, '0')}</span><h2>${escapeHtml(lens.label)}</h2><p class="scene-lens__reading">${escapeHtml(lens.reading)}</p><p class="play-prompt">${escapeHtml(lens.prompt)}</p><div class="play-choices play-choices--scene">${lens.options.map((option, index) => `<button type="button" data-daily-answer="${index}"${daily.answer === String(index) ? ' data-selected' : ''}><span>${index + 1}</span><strong>${escapeHtml(option)}</strong><i aria-hidden="true">${daily.answer === String(index) ? '●' : '○'}</i></button>`).join('')}</div><div class="play-actions"><span>${strings.scene.noPreferred}</span><button class="dialogue-next" type="button" data-action="lock-daily-answer"${daily.answer === null ? ' disabled' : ''}>${strings.scene.reviewAngle} <i aria-hidden="true">→</i></button></div></div>` : renderDailyRuling(result, daily.step === content.lenses.length - 1)}
        </div>
        <div class="scene-character">${character ? `<img src="${character}" alt="" aria-hidden="true">` : ''}</div>
      </section>
    </main>`
}

const renderDailyPlay = () => {
  const envelope = state.daily.envelope
  if (!envelope?.answerable || !dailyLocaleMatches()) { state.screen = 'select'; renderSelector(); return }
  worldRoot.style.display = 'none'
  app.innerHTML = envelope.case.content.kind === 'multi-lens-scene'
    ? renderDailyScenePlay(envelope)
    : renderDailyChoicePlay(envelope)
  if (state.daily.phase === 'reveal') requestAnimationFrame(() => {
    const result = state.daily.results.at(-1)
    const target = document.querySelector('.daily-ruling')
    if (result?.outcome === 'hit') feedback.cue.success(target)
    else if (result?.outcome === 'miss') feedback.cue.wrong(target)
    else feedback.cue.clue(target, { stamp: copy().scene.reviewed, count: 7 })
  })
}

const renderDailyComplete = () => {
  const strings = copy()
  const envelope = state.daily.envelope
  if (!envelope) { state.screen = 'select'; renderSelector(); return }
  const dailyCase = envelope.case
  const content = dailyCase.content
  const background = content.kind === 'choice-sequence' ? content.items[0].backgroundAsset : content.scene.backgroundAsset
  const hits = state.daily.results.filter((result) => result.outcome === 'hit').length
  const neutral = dailyCase.mode === 'scene'
  worldRoot.style.display = 'none'
  app.innerHTML = `
    <main class="daily-complete mode-complete" data-case-id="${escapeHtml(envelope.contentId)}" data-date="${escapeHtml(envelope.date)}">
      <img class="mode-complete__backdrop" src="${dailyBackgroundUrl(background)}" alt="" aria-hidden="true"><div class="mode-complete__veil" aria-hidden="true"></div>
      <section class="mode-complete__report" aria-labelledby="daily-complete-title">
        <img class="mode-complete__seal" src="${artUrl('effects/case-solved-wax-seal.webp')}" alt="" aria-hidden="true">
        <span class="section-code">${strings.completion.dailyCode} · ${escapeHtml(formatDailyDate(envelope.date))}</span>
        <h1 id="daily-complete-title">${neutral ? strings.completion.dailySceneTitle : strings.completion.dailyTitle}</h1>
        <p>${neutral ? strings.completion.dailySceneBody : strings.completion.dailyBody}</p>
        <div class="mode-complete__stats"><article><small>${neutral ? strings.completion.reviewedAngles : strings.completion.hits}</small><strong>${neutral ? `${state.daily.results.length} / 6` : `${hits} / ${state.daily.results.length}`}</strong></article><article><small>${strings.completion.dailyCase}</small><strong>${escapeHtml(strings.daily.labels[dailyCase.mode])}</strong></article><article><small>${strings.common.xpEarned}</small><strong>${state.daily.summary?.awardedXp || 0} XP</strong></article></div>
        <div class="mode-complete__actions"><button class="secondary-game-button" type="button" data-action="start-daily">${strings.completion.reread}</button><button class="case-cta" type="button" data-action="exit-daily"><span>${strings.completion.lobby}</span><i aria-hidden="true">→</i></button></div>
      </section>
    </main>`
  requestAnimationFrame(() => feedback.cue.streak(document.querySelector('.mode-complete__seal'), Math.max(1, state.profile.streak)))
}

const renderComplete = () => {
  const strings = copy()
  const mode = currentMode()
  const summary = state.completedSummary || {}
  worldRoot.style.display = 'none'
  const details = mode.id === 'scene'
    ? strings.completion.sceneDetails
    : mode.id === 'expedition'
      ? strings.completion.expeditionDetails.map(([label, value]) => [label, interpolate(value, { hits: summary.hits || 0, total: mode.items.length })])
      : [[strings.completion.hits, `${summary.hits || 0} / ${mode.items.length}`], [strings.completion.clues, `${mode.items.length}`], [strings.completion.mode, modeTitle(mode)]]
  const title = strings.completion[`${mode.id}Title`]
  const body = strings.completion[`${mode.id}Body`]
  app.innerHTML = `
    <main class="mode-complete" data-mode="${mode.id}">
      <img class="mode-complete__backdrop" src="${artUrl(`backgrounds/${mode.background}`)}" alt="" aria-hidden="true"><div class="mode-complete__veil" aria-hidden="true"></div>
      <section class="mode-complete__report" aria-labelledby="complete-title">
        <img class="mode-complete__seal" src="${artUrl('effects/case-solved-wax-seal.webp')}" alt="" aria-hidden="true">
        <span class="section-code">${mode.label} · ${strings.completion.sessionCode}</span>
        <h1 id="complete-title">${title}</h1>
        <p>${body}</p>
        <div class="mode-complete__stats">${details.map(([label, value]) => `<article><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></article>`).join('')}<article><small>${strings.common.xpEarned}</small><strong>${state.earnedXp} XP</strong></article></div>
        <div class="mode-complete__actions"><button class="secondary-game-button" type="button" data-action="replay">${strings.completion.replay}</button><button class="case-cta" type="button" data-action="select"><span>${strings.completion.choose}</span><i aria-hidden="true">→</i></button></div>
      </section>
    </main>`
  requestAnimationFrame(() => feedback.cue.streak(document.querySelector('.mode-complete__seal'), Math.max(1, completedToday().length)))
}

const renderPassport = () => {
  const strings = copy()
  return `
  <div class="game-modal-backdrop" data-backdrop="close"><aside class="game-drawer" role="dialog" aria-modal="true" aria-labelledby="passport-title">
    <header><div><span class="section-code">${strings.passport.code}</span><h2 id="passport-title">${strings.passport.title}</h2></div><button class="round-icon round-icon--dark" type="button" data-action="close" aria-label="${strings.common.close}"><span aria-hidden="true">×</span></button></header>
    <section class="drawer-rank"><span class="drawer-rank__seal">${rank()}</span><div><small>${strings.stats.rank}</small><strong>${interpolate(strings.stats.level, { level: rank() })} · ${state.profile.xp} XP</strong><div><i style="width:${Math.round(xpInRank() / 120 * 100)}%"></i></div><span>${interpolate(strings.stats.toNext, { xp: 120 - xpInRank() })}</span></div></section>
    <section class="drawer-stats"><div><span>${strings.stats.streak}</span><strong>${state.profile.streak} ${strings.stats.day}</strong></div><div><span>${strings.stats.sessions}</span><strong>${state.profile.completedSessions.length}</strong></div><div><span>${strings.stats.clues}</span><strong>${state.profile.clues}</strong></div></section>
    <section class="drawer-structures"><span class="section-code">${strings.passport.modeCount}</span><div>${modeList().map((mode) => `<span>${escapeHtml(modeTitle(mode))} · ${state.profile.modeCompletions[mode.id] || 0}</span>`).join('')}</div></section>
    <section class="drawer-privacy"><strong>${strings.passport.localTitle}</strong><p>${strings.passport.localBody}</p></section>
    <footer><button type="button" class="danger-link" data-action="reset-profile">${strings.passport.delete}</button></footer>
  </aside></div>`
}

const renderProviders = () => {
  const strings = copy()
  return `
  <div class="game-modal-backdrop" data-backdrop="close"><section class="game-dialog game-dialog--wide" role="dialog" aria-modal="true" aria-labelledby="provider-title">
    <header><div><span class="section-code">${strings.routes.code}</span><h2 id="provider-title">${strings.routes.title}</h2></div><button class="round-icon round-icon--dark" type="button" data-action="close" aria-label="${strings.common.close}"><span aria-hidden="true">×</span></button></header>
    <div class="route-dialog-grid"><article><span>01</span><h3>${strings.routes.cliTitle}</h3><p>${strings.routes.cliBody}</p></article><article><span>02</span><h3>${strings.routes.zipTitle}</h3><p>${strings.routes.zipBody}</p></article><article><span>03</span><h3>${strings.routes.webTitle}</h3><p>${strings.routes.webBody}</p></article></div>
    <div class="truth-card"><span aria-hidden="true">!</span><div><strong>${strings.routes.warningTitle}</strong><p>${strings.routes.warningBody}</p></div></div>
    <footer><button class="case-cta" type="button" data-action="close"><span>${strings.routes.confirm}</span><i aria-hidden="true">→</i></button></footer>
  </section></div>`
}

const renderAudioSettings = () => {
  const strings = copy()
  return `
  <div class="game-modal-backdrop" data-backdrop="close"><section class="game-dialog audio-dialog" role="dialog" aria-modal="true" aria-labelledby="audio-title">
    <header><div><span class="section-code">${strings.audio.code}</span><h2 id="audio-title">${strings.audio.title}</h2></div><button class="round-icon round-icon--dark" type="button" data-action="close" aria-label="${strings.common.close}"><span aria-hidden="true">×</span></button></header>
    <div class="audio-setting-row"><div><strong>${strings.audio.music}</strong><p>${strings.audio.musicDescription}</p></div><button type="button" data-action="toggle-music" aria-pressed="${state.profile.music}">${state.profile.music ? strings.common.on : strings.common.off}</button></div>
    <label class="audio-volume" for="music-volume"><span><strong>${strings.audio.volume}</strong><output>${Math.round(state.profile.musicVolume * 100)}%</output></span><input id="music-volume" type="range" min="0" max="1" step="0.01" value="${state.profile.musicVolume}"></label>
    <div class="audio-setting-row"><div><strong>${strings.audio.sfx}</strong><p>${strings.audio.sfxDescription}</p></div><button type="button" data-action="toggle-sfx" aria-pressed="${state.profile.sfx}">${state.profile.sfx ? strings.common.on : strings.common.off}</button></div>
    <p class="prototype-note">${strings.audio.browserNote}</p>
  </section></div>`
}

const renderModal = () => state.modal === 'passport' ? renderPassport() : state.modal === 'providers' ? renderProviders() : state.modal === 'audio' ? renderAudioSettings() : ''

const render = () => {
  applyLocaleMeta()
  if (state.screen === 'select') renderSelector()
  else if (state.screen === 'brief') renderBrief()
  else if (state.screen === 'play') {
    if (state.selectedMode === 'scene') renderScenePlay()
    else renderGradedPlay()
  } else if (state.screen === 'daily') renderDailyPlay()
  else if (state.screen === 'daily-complete') renderDailyComplete()
  else renderComplete()
  if (state.modal) requestAnimationFrame(() => app.querySelector('[role="dialog"] button')?.focus())
}

const captureFocusToken = () => {
  const active = document.activeElement
  if (!(active instanceof HTMLElement) || !app.contains(active)) return null
  if (active.id) return { id: active.id }
  for (const attribute of ['data-domain', 'data-mode', 'data-locale', 'data-action']) {
    const value = active.getAttribute(attribute)
    if (value === null) continue
    const matches = [...app.querySelectorAll(`[${attribute}]`)].filter((element) => element.getAttribute(attribute) === value)
    return { attribute, value, index: matches.indexOf(active) }
  }
  return null
}

const renderPreservingFocus = () => {
  const token = captureFocusToken()
  render()
  if (!token) return
  if (token.id) { document.getElementById(token.id)?.focus(); return }
  const matches = [...app.querySelectorAll(`[${token.attribute}]`)].filter((element) => element.getAttribute(token.attribute) === token.value)
  matches[Math.max(0, token.index)]?.focus()
}

const loadDailyCase = async () => {
  const requestId = state.daily.requestId + 1
  state.daily.requestId = requestId
  state.daily.status = 'loading'
  state.daily.error = null
  if (state.screen === 'select') renderPreservingFocus()

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 2200)
  try {
    const response = await fetch(dailyEndpoint, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      credentials: 'same-origin',
    })
    if (!response.ok) throw new Error('DAILY_UNAVAILABLE')
    const envelope = validateDailyEnvelope(await response.json())
    if (!envelope) throw new Error('DAILY_INVALID')
    if (state.daily.requestId !== requestId) return
    state.daily.envelope = envelope
    state.daily.status = envelope.answerable ? 'ready' : 'unavailable'
    state.daily.error = envelope.answerable ? null : 'PRIVATE_RULING_UNAVAILABLE'
  } catch (error) {
    if (state.daily.requestId !== requestId) return
    state.daily.envelope = null
    state.daily.status = 'unavailable'
    state.daily.error = error?.name === 'AbortError' ? 'DAILY_TIMEOUT' : 'DAILY_UNAVAILABLE'
  } finally {
    window.clearTimeout(timeout)
    if (state.daily.requestId === requestId && state.screen === 'select') renderPreservingFocus()
  }
}

const startDaily = () => {
  if (!state.daily.envelope?.answerable || !dailyLocaleMatches()) return
  state.daily.requestId += 1
  state.daily.phase = 'briefing'
  state.daily.step = 0
  state.daily.answer = null
  state.daily.results = []
  state.daily.earnedXp = 0
  state.daily.submitting = false
  state.daily.error = null
  state.daily.summary = null
  state.screen = 'daily'
  state.modal = null
  world.setActiveMode(state.daily.envelope.case.mode)
  window.scrollTo({ top: 0, behavior: 'instant' })
  render()
  feedback.sound.paper()
}

const chooseDailyAnswer = (value) => {
  if (state.screen !== 'daily' || state.daily.phase !== 'question' || state.daily.submitting) return
  const envelope = state.daily.envelope
  const content = envelope?.case?.content
  const valid = content?.kind === 'multi-lens-scene'
    ? Number.isSafeInteger(Number(value)) && Number(value) >= 0 && Number(value) < content.lenses[state.daily.step].options.length
    : content?.items?.[state.daily.step]?.options?.some((option) => option.id === value)
  if (!valid) return
  state.daily.answer = value
  state.daily.error = null
  app.querySelectorAll('[data-daily-answer]').forEach((button) => button.toggleAttribute('data-selected', button.dataset.dailyAnswer === value))
  app.querySelector('[data-action="lock-daily-answer"]')?.removeAttribute('disabled')
  feedback.sound.paper()
}

const validateDailyRuling = (payload, { envelope, item, answer }) => {
  if (!isRecord(payload) || payload.schemaVersion !== 1 || payload.date !== envelope.date || payload.timeZone !== 'Asia/Taipei') return null
  if (payload.caseId !== envelope.contentId || payload.itemId !== item.id || payload.selectedOptionId !== answer) return null
  if (!['hit', 'miss'].includes(payload.outcome) || !Number.isSafeInteger(payload.xp) || payload.xp < 0 || payload.xp > 1000) return null
  if (!isRecord(payload.reveal)) return null
  for (const key of ['heading', 'feedback']) if (!isDailyText(payload.reveal[key])) return null
  for (const key of ['verdict', 'structure', 'structureLabel', 'reward', 'hint']) {
    if (payload.reveal[key] !== null && payload.reveal[key] !== undefined && !isDailyText(payload.reveal[key])) return null
  }
  return payload
}

const lockDailyAnswer = async () => {
  const daily = state.daily
  const envelope = daily.envelope
  if (state.screen !== 'daily' || daily.phase !== 'question' || daily.answer === null || daily.submitting || !envelope?.answerable) return
  const content = envelope.case.content

  if (content.kind === 'multi-lens-scene') {
    const lens = content.lenses[daily.step]
    daily.results.push({
      itemId: lens.id,
      selectedOptionId: daily.answer,
      outcome: 'neutral',
      xp: 5,
      reveal: { heading: copy().scene.reviewed, feedback: lens.reading, structureLabel: lens.label },
    })
    daily.earnedXp += 5
    daily.phase = 'reveal'
    render()
    announce(copy().scene.angleAnnounce)
    return
  }

  const item = content.items[daily.step]
  const answer = daily.answer
  const requestId = daily.requestId + 1
  daily.requestId = requestId
  daily.submitting = true
  daily.phase = 'submitting'
  daily.error = null
  render()

  try {
    const response = await fetch(answerEndpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ contentId: envelope.contentId, itemId: item.id, answer, date: envelope.date }),
    })
    if (!response.ok) {
      const requestError = new Error('RULING_UNAVAILABLE')
      requestError.code = response.status === 409 ? 'CONTENT_CONFLICT' : 'RULING_UNAVAILABLE'
      throw requestError
    }
    const ruling = validateDailyRuling(await response.json(), { envelope, item, answer })
    if (!ruling) throw new Error('RULING_INVALID')
    if (daily.requestId !== requestId || state.screen !== 'daily') return
    daily.results.push(ruling)
    daily.earnedXp += ruling.xp
    daily.submitting = false
    daily.phase = 'reveal'
    render()
    announce(interpolate(ruling.outcome === 'hit' ? copy().daily.hitAnnounce : copy().daily.missAnnounce, { xp: ruling.xp }))
  } catch (error) {
    if (daily.requestId !== requestId || state.screen !== 'daily') return
    daily.submitting = false
    daily.phase = 'question'
    if (error?.code === 'CONTENT_CONFLICT') {
      daily.status = 'unavailable'
      daily.error = copy().daily.caseExpired
    } else {
      daily.error = copy().daily.rulingError
    }
    render()
    announce(error?.code === 'CONTENT_CONFLICT' ? copy().daily.expiredAnnounce : copy().daily.errorAnnounce)
  }
}

const markPracticeDate = (dateKey) => {
  if (!isValidDailyDate(dateKey)) return
  if (state.profile.lastCompleted === dateKey) return
  const previous = state.profile.lastCompleted
  const delta = previous
    ? Math.round((Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${previous}T00:00:00Z`)) / 86400000)
    : null
  if (previous && delta < 0) return
  state.profile.streak = delta === 1 ? state.profile.streak + 1 : 1
  state.profile.lastCompleted = dateKey
}

const finishDaily = () => {
  const daily = state.daily
  const envelope = daily.envelope
  if (!envelope) return
  if (!isRecord(state.profile.dailyCases)) state.profile.dailyCases = {}
  const cases = new Set(Array.isArray(state.profile.dailyCases[envelope.date]) ? state.profile.dailyCases[envelope.date] : [])
  const firstCompletion = !cases.has(envelope.contentId)
  cases.add(envelope.contentId)
  markPracticeDate(envelope.date)

  const awardedXp = firstCompletion ? daily.earnedXp + 20 : 0
  const structures = daily.results.map((result) => result.reveal?.structure).filter(Boolean)
  state.profile.xp += awardedXp
  if (firstCompletion) state.profile.clues += daily.results.length
  state.profile.dailyCases[envelope.date] = [...cases]
  state.profile.structures = [...new Set([...state.profile.structures, ...structures])]
  state.profile.completedSessions = [...state.profile.completedSessions, {
    mode: envelope.case.mode,
    route: 'daily',
    contentId: envelope.contentId,
    authoritativeDate: envelope.date,
    date: new Date().toISOString(),
    contentSchema: envelope.schemaVersion,
  }].slice(-100)
  daily.summary = { awardedXp, firstCompletion }
  writeProfile()
  state.screen = 'daily-complete'
  render()
}

const nextDaily = () => {
  const daily = state.daily
  const content = daily.envelope?.case?.content
  const total = content?.kind === 'multi-lens-scene' ? content.lenses.length : content?.items?.length
  if (!total || daily.phase !== 'reveal') return
  if (daily.step >= total - 1) { finishDaily(); return }
  daily.step += 1
  daily.answer = null
  daily.error = null
  daily.phase = content.kind === 'multi-lens-scene' ? 'question' : 'briefing'
  render()
  feedback.sound.clue()
}

const exitDaily = () => {
  state.daily.requestId += 1
  state.daily.submitting = false
  state.daily.error = null
  state.screen = 'select'
  window.scrollTo({ top: 0, behavior: 'instant' })
  render()
}

const syncViewUrl = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', state.locale)
  if (state.domain) url.searchParams.set('domain', state.domain)
  else url.searchParams.delete('domain')
  window.history.replaceState({}, '', url)
}

const setLocale = (locale) => {
  const next = resolveLocale(locale)
  if (next === state.locale) return
  state.locale = next
  try { localStorage.setItem(localeKey, next) } catch { /* Keep the in-memory preference. */ }
  if ((state.screen === 'daily' || state.screen === 'daily-complete') && !dailyLocaleMatches()) state.screen = 'select'
  applyLocaleMeta()
  syncViewUrl()
  render()
  app.querySelector(`.language-switch [data-locale="${next}"]`)?.focus()
  announce(copy().language.changed)
  feedback.sound.paper()
}

const chooseDomain = (domain) => {
  if (!domainIds.includes(domain)) return
  state.domain = domain
  state.selectedMode = null
  state.results = []
  try { localStorage.setItem(domainKey, domain) } catch { /* Keep the in-memory preference. */ }
  syncViewUrl()
  const firstMode = scopedModeList()[0]
  if (firstMode) world.setActiveMode(firstMode.id)
  render()
  const nextStep = document.querySelector('#mode-choice-title')
  nextStep?.setAttribute('tabindex', '-1')
  nextStep?.focus({ preventScroll: true })
  nextStep?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  announce(interpolate(copy().domains.selected, { domain: copy().domains.labels[domain] }))
  feedback.sound.paper()
}

const chooseMode = (modeId) => {
  if (!scopedGameModes()[modeId]) return
  state.selectedMode = modeId
  state.screen = 'brief'
  state.modal = null
  world.setActiveMode(modeId)
  window.scrollTo({ top: 0, behavior: 'instant' })
  render()
  feedback.sound.paper()
}

const startMode = () => {
  const mode = currentMode()
  if (!mode) return
  state.screen = 'play'
  state.step = 0
  state.answer = null
  state.results = []
  state.earnedXp = 0
  state.completedSummary = null
  state.sceneObservation = ''
  state.scenePosition = null
  state.sceneBlindspot = ''
  state.sceneCommitment = null
  state.sceneDecisionReason = ''
  state.phase = mode.id === 'scene' ? 'observation' : 'briefing'
  window.scrollTo({ top: 0, behavior: 'instant' })
  render()
  feedback.sound.paper()
}

const chooseAnswer = (value) => {
  const validPhase = state.selectedMode === 'scene' ? state.phase === 'lens' : state.phase === 'question'
  if (!validPhase) return
  state.answer = value
  app.querySelectorAll('[data-answer]').forEach((button) => button.toggleAttribute('data-selected', button.dataset.answer === value))
  app.querySelector('[data-action="lock-answer"], [data-action="lock-lens"]')?.removeAttribute('disabled')
  feedback.sound.paper()
}

const lockAnswer = () => {
  const mode = currentMode()
  if (!state.answer || state.phase !== 'question') return
  const item = mode.items[state.step]
  const hit = state.answer === item.correct
  const xp = hit ? 18 : 8
  state.earnedXp += xp
  state.results.push({ id: item.id, answer: state.answer, hit, xp, structure: item.structure, verdict: item.verdicts?.[state.answer] || null })
  state.phase = 'reveal'
  render()
  const resultLabel = mode.id === 'expedition' ? item.verdicts[state.answer] : hit ? copy().play.hit : copy().play.unlocked
  announce(interpolate(copy().play.earned, { result: resultLabel, xp }))
}

const finishMode = () => {
  const mode = currentMode()
  const today = todayKey()
  const modesToday = new Set(state.profile.dailyModes[today] || [])
  const firstModeCompletionToday = !modesToday.has(mode.id)
  modesToday.add(mode.id)

  markPracticeDate(today)
  if (firstModeCompletionToday) state.earnedXp += 20

  const structures = mode.id === 'scene' ? mode.scene.lenses.map((lens) => lens.id) : state.results.map((result) => result.structure)
  state.profile.xp += state.earnedXp
  state.profile.clues += mode.id === 'scene' ? 6 : state.results.length
  state.profile.dailyModes[today] = [...modesToday]
  state.profile.modeCompletions[mode.id] = (state.profile.modeCompletions[mode.id] || 0) + 1
  state.profile.structures = [...new Set([...state.profile.structures, ...structures])]
  state.profile.completedSessions = [...state.profile.completedSessions, { mode: mode.id, date: new Date().toISOString(), contentSchema: contentManifest.schemaVersion }].slice(-100)
  state.completedSummary = { hits: state.results.filter((result) => result.hit).length, firstModeCompletionToday }
  writeProfile()
  state.screen = 'complete'
  render()
}

app.addEventListener('input', (event) => {
  if (event.target.id === 'scene-observation') {
    state.sceneObservation = event.target.value
    app.querySelector('[data-action="submit-observation"]')?.toggleAttribute('disabled', !event.target.value.trim())
  } else if (event.target.id === 'scene-blindspot') {
    state.sceneBlindspot = event.target.value
    app.querySelector('[data-action="submit-camera"]')?.toggleAttribute('disabled', state.scenePosition === null || !event.target.value.trim())
  } else if (event.target.id === 'scene-decision-reason') {
    state.sceneDecisionReason = event.target.value
    app.querySelector('[data-action="pressure-test"]')?.toggleAttribute('disabled', state.sceneCommitment === null || !event.target.value.trim())
  } else if (event.target.id === 'music-volume') {
    state.profile.musicVolume = Number(event.target.value)
    music.setVolume(state.profile.musicVolume)
    event.target.closest('label')?.querySelector('output')?.replaceChildren(`${Math.round(state.profile.musicVolume * 100)}%`)
    writeProfile()
  }
})

app.addEventListener('click', (event) => {
  const localeButton = event.target.closest('.language-switch [data-locale]')
  if (localeButton) { setLocale(localeButton.dataset.locale); return }
  const domainButton = event.target.closest('.domain-grid [data-domain]')
  if (domainButton) { chooseDomain(domainButton.dataset.domain); return }
  const modeCard = event.target.closest('.mode-choice-card[data-mode]')
  if (modeCard) { chooseMode(modeCard.dataset.mode); return }
  const dailyAnswer = event.target.closest('[data-daily-answer]')
  if (dailyAnswer) { chooseDailyAnswer(dailyAnswer.dataset.dailyAnswer); return }
  const answer = event.target.closest('[data-answer]')
  if (answer) { chooseAnswer(answer.dataset.answer); return }
  const position = event.target.closest('[data-position]')
  if (position) {
    state.scenePosition = Number(position.dataset.position)
    app.querySelectorAll('[data-position]').forEach((button) => button.toggleAttribute('data-selected', button === position))
    app.querySelector('[data-action="submit-camera"]')?.toggleAttribute('disabled', !state.sceneBlindspot.trim())
    feedback.sound.paper(); return
  }
  const commitment = event.target.closest('[data-commitment]')
  if (commitment) {
    state.sceneCommitment = Number(commitment.dataset.commitment)
    app.querySelectorAll('[data-commitment]').forEach((button) => button.toggleAttribute('data-selected', button === commitment))
    app.querySelector('[data-action="pressure-test"]')?.toggleAttribute('disabled', !state.sceneDecisionReason.trim())
    feedback.sound.paper(); return
  }
  const backdrop = event.target.closest('[data-backdrop="close"]')
  if (backdrop && event.target === backdrop) { state.modal = null; render(); return }
  const button = event.target.closest('[data-action]')
  if (!button || button.disabled) return
  const action = button.dataset.action

  if (action === 'select') { state.screen = 'select'; state.modal = null; state.results = []; render(); feedback.sound.paper() }
  else if (action === 'change-domain') {
    state.domain = null
    state.selectedMode = null
    state.results = []
    try { localStorage.removeItem(domainKey) } catch { /* Keep the in-memory reset. */ }
    syncViewUrl(); render()
    const chooser = document.querySelector('#domain-title')
    chooser?.setAttribute('tabindex', '-1')
    chooser?.focus({ preventScroll: true })
    chooser?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    announce(copy().domains.chooseFirst)
    feedback.sound.paper()
  }
  else if (action === 'start-daily') startDaily()
  else if (action === 'retry-daily') loadDailyCase()
  else if (action === 'exit-daily') { exitDaily(); feedback.sound.paper() }
  else if (action === 'inspect-daily') { state.daily.phase = 'question'; state.daily.answer = null; render(); feedback.cue.clue(document.querySelector('.play-evidence, .daily-scene-workbench')) }
  else if (action === 'lock-daily-answer') lockDailyAnswer()
  else if (action === 'next-daily') nextDaily()
  else if (action === 'start-mode') startMode()
  else if (action === 'exit-play') { state.screen = 'brief'; state.results = []; render() }
  else if (action === 'inspect') { state.phase = 'question'; render(); feedback.cue.clue(document.querySelector('.play-evidence')) }
  else if (action === 'lock-answer') lockAnswer()
  else if (action === 'next-step') {
    const mode = currentMode()
    if (state.step >= mode.items.length - 1) finishMode()
    else { state.step += 1; state.phase = 'briefing'; state.answer = null; render(); feedback.sound.clue() }
  }
  else if (action === 'hint') showToast(document.querySelector('.play-dialogue'), currentMode().items[state.step].hint)
  else if (action === 'explain') {
    const item = currentMode().items[state.step]
    showToast(document.querySelector('.play-dialogue'), state.answer === item.correct ? item.success : item.miss)
  }
  else if (action === 'submit-observation') { state.phase = 'lens'; state.step = 0; state.answer = null; render(); feedback.cue.clue(document.querySelector('.scene-lens')) }
  else if (action === 'scene-hint') showToast(document.querySelector('.scene-workbench'), copy().scene.hintToast)
  else if (action === 'lock-lens') {
    const lens = currentMode().scene.lenses[state.step]
    state.results.push({ id: lens.id, answer: state.answer, hit: null, xp: 5, structure: lens.id })
    state.earnedXp += 5
    state.phase = 'lens-reveal'
    render()
    feedback.cue.clue(document.querySelector('.scene-neutral-feedback'), { stamp: copy().scene.reviewed, count: 7 })
  }
  else if (action === 'next-lens') {
    if (state.step >= 5) { state.phase = 'camera'; state.step = 6 }
    else { state.step += 1; state.phase = 'lens' }
    state.answer = null; render(); feedback.sound.paper()
  }
  else if (action === 'submit-camera') { state.phase = 'commitment'; state.earnedXp += 8; render(); feedback.sound.clue() }
  else if (action === 'pressure-test') { state.phase = 'pressure'; render(); feedback.cue.clue(document.querySelector('.scene-pressure'), { stamp: '!', count: 6 }) }
  else if (action === 'revise-commitment') { state.phase = 'commitment'; state.sceneCommitment = null; state.sceneDecisionReason = ''; render() }
  else if (action === 'hold-commitment') { state.earnedXp += 15; finishMode() }
  else if (action === 'replay') startMode()
  else if (action === 'passport') { state.modal = 'passport'; render() }
  else if (action === 'providers') { state.modal = 'providers'; render() }
  else if (action === 'audio-settings') { state.modal = 'audio'; render() }
  else if (action === 'close') { state.modal = null; render() }
  else if (action === 'toggle-sfx') {
    state.profile.sfx = !state.profile.sfx
    feedback.setMuted(!state.profile.sfx)
    writeProfile(); render()
    if (state.profile.sfx) feedback.sound.paper()
  }
  else if (action === 'toggle-music') {
    state.profile.music = !state.profile.music
    music.setEnabled(state.profile.music)
    writeProfile(); render()
  }
  else if (action === 'reset-profile') {
    localStorage.removeItem(passportKey); localStorage.removeItem(legacyPassportKey)
    state.profile = emptyProfile(); feedback.setMuted(false); music.setEnabled(true); music.setVolume(state.profile.musicVolume)
    state.modal = null; render()
  }
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.modal) { state.modal = null; render(); return }
  if (event.key !== 'Tab' || !state.modal) return
  const dialog = app.querySelector('[role="dialog"]')
  const focusable = dialog ? [...dialog.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')] : []
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
})

render()
loadDailyCase()
