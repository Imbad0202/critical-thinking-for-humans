#!/usr/bin/env node

/** Keep the seven public zh-TW Daily demo prompts aligned with locale content.
 *
 * This script writes public prompts only. It never creates, reads, or prints a
 * private answer record. Production Daily cases may use a separate editorial
 * source; these seven fixtures intentionally mirror the fixed browser demos.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { getDemoContent } from '../content/demo-cases.js'

const root = new URL('../', import.meta.url)
const checkOnly = process.argv.includes('--check')
const bundle = getDemoContent('zh-TW')

const specs = [
  ['2026-07-12', 'daily-2026-07-12-measurement-gap', 'drill', ['measurement-gap'], 'education'],
  ['2026-07-13', 'daily-2026-07-13-unanswered-reply', 'scene', [], 'public'],
  ['2026-07-14', 'daily-2026-07-14-category-break', 'expedition', ['category-break'], 'science'],
  ['2026-07-15', 'daily-2026-07-15-raven-ai-audit', 'detective', ['same-team-baseline', 'compare-with-baseline'], 'work'],
  ['2026-07-16', 'daily-2026-07-16-base-rate', 'drill', ['base-rate'], 'health'],
  ['2026-07-17', 'daily-2026-07-17-scope-boundary', 'expedition', ['scope-boundary'], 'science'],
  ['2026-07-18', 'daily-2026-07-18-alternative-cause', 'drill', ['alternative-cause'], 'public'],
]

const backgroundAsset = (filename) => `web/assets/art/backgrounds/${filename}`

const publicChoiceItem = (item) => ({
  id: item.id,
  chapter: item.chapter,
  location: item.location,
  speaker: item.speaker,
  role: item.role,
  characterId: item.character,
  backgroundAsset: backgroundAsset(item.background),
  briefing: item.briefing,
  evidenceTitle: item.evidenceTitle,
  evidence: item.evidence,
  prompt: item.prompt,
  options: item.options.map(([id, text]) => ({ id, text })),
})

const publicScene = (mode) => {
  const scene = mode.scene
  return {
    kind: 'multi-lens-scene',
    scene: {
      location: scene.location,
      speaker: scene.speaker,
      role: scene.role,
      characterId: scene.character,
      backgroundAsset: backgroundAsset(scene.background),
      text: scene.scene,
    },
    lenses: scene.lenses.map(({ id, label, reading, prompt, options }) => ({ id, label, reading, prompt, options })),
    positions: scene.positions,
    commitments: scene.commitments.map(({ text, objection }, index) => ({
      id: String.fromCharCode(65 + index), text, objection,
    })),
  }
}

const publicCase = ([publishDate, id, modeId, itemIds, domain]) => {
  const mode = bundle.gameModes[modeId]
  const items = mode.items?.filter((item) => itemIds.includes(item.id)) || []
  if (modeId !== 'scene' && items.length !== itemIds.length) throw new Error(`Missing items for ${id}`)
  return {
    $schema: '../schema/daily-case-public.v1.schema.json',
    schemaVersion: 1,
    id,
    publishDate,
    locale: 'zh-Hant-TW',
    visibility: 'public',
    mode: modeId,
    domain,
    title: modeId === 'scene' ? mode.scene.title : items[0].evidenceTitle,
    canonicalSourcePaths: [`web/content/locales/zh-TW/${modeId}.js`, ...mode.source],
    content: modeId === 'scene'
      ? publicScene(mode)
      : { kind: 'choice-sequence', items: items.map(publicChoiceItem) },
  }
}

let drift = false
for (const spec of specs) {
  const value = `${JSON.stringify(publicCase(spec), null, 2)}\n`
  const target = new URL(`content/daily/cases/${spec[1]}.json`, root)
  if (checkOnly) {
    const current = await readFile(target, 'utf8')
    if (current !== value) {
      drift = true
      console.error(`DRIFT ${fileURLToPath(target)}`)
    }
  } else {
    await writeFile(target, value, 'utf8')
    console.log(`SYNC ${fileURLToPath(target)}`)
  }
}

if (drift) process.exitCode = 1
else console.log(`PASS ${specs.length} public Daily demo cases${checkOnly ? ' are synchronized' : ' synchronized'}`)
