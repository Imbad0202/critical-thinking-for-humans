/**
 * Fixed bilingual browser-demo content.
 *
 * These authored excerpts are constrained by the canonical files named in each
 * mode, but they do not execute the full conversational Skill runtime. The web
 * UI must describe them as fixed demos or excerpts, never as generated or
 * human-reviewed full sessions.
 */

import { drillMode as drillZhTW } from './locales/zh-TW/drill.js'
import { sceneMode as sceneZhTW } from './locales/zh-TW/scene.js'
import { expeditionMode as expeditionZhTW } from './locales/zh-TW/expedition.js'
import { detectiveMode as detectiveZhTW } from './locales/zh-TW/detective.js'
import { drillMode as drillEn } from './locales/en/drill.js'
import { sceneMode as sceneEn } from './locales/en/scene.js'
import { expeditionMode as expeditionEn } from './locales/en/expedition.js'
import { detectiveMode as detectiveEn } from './locales/en/detective.js'

export const contentManifest = Object.freeze({
  schemaVersion: 2,
  skillVersion: '1.2.0',
  defaultLocale: 'en',
  locales: Object.freeze(['zh-TW', 'en']),
  kind: 'bilingual-fixed-demo',
  generatedAt: '2026-07-12',
})

const createBundle = (locale, modes) => {
  const drillDomains = Object.freeze({
    'measurement-gap': 'education',
    'base-rate': 'health',
    'alternative-cause': 'public',
  })
  const gameModes = Object.freeze({
    drill: {
      ...modes.drill,
      domains: Object.freeze(['education', 'health', 'public']),
      items: Object.freeze(modes.drill.items.map((item) => Object.freeze({ ...item, domain: drillDomains[item.id] }))),
    },
    scene: { ...modes.scene, domains: Object.freeze(['public']) },
    expedition: { ...modes.expedition, domains: Object.freeze(['science']) },
    detective: { ...modes.detective, domains: Object.freeze(['work']) },
  })
  return Object.freeze({ locale, gameModes, modeList: Object.freeze(Object.values(gameModes)) })
}

const localizedBundles = Object.freeze({
  'zh-TW': createBundle('zh-TW', {
    drill: drillZhTW,
    scene: sceneZhTW,
    expedition: expeditionZhTW,
    detective: detectiveZhTW,
  }),
  en: createBundle('en', {
    drill: drillEn,
    scene: sceneEn,
    expedition: expeditionEn,
    detective: detectiveEn,
  }),
})

export const getDemoContent = (locale = contentManifest.defaultLocale) => (
  String(locale).toLowerCase().startsWith('zh') ? localizedBundles['zh-TW'] : localizedBundles.en
)

// Backward-compatible zh-TW exports for local tooling and downstream demos.
export const gameModes = localizedBundles['zh-TW'].gameModes
export const modeList = localizedBundles['zh-TW'].modeList
export const sceneDemo = gameModes.scene.scene
