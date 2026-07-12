#!/usr/bin/env node

import { contentManifest, getDemoContent } from '../content/demo-cases.js'
import { supportedLocales, uiCopy } from '../content/ui-copy.js'

const fail = (message) => {
  console.error(`FAIL [web-i18n] ${message}`)
  process.exit(1)
}

const expect = (condition, message) => { if (!condition) fail(message) }
const ids = (values) => values.map(({ id }) => id)
const sorted = (values) => [...values].sort()
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right)
const modeIds = ['drill', 'scene', 'expedition', 'detective']
const domainIds = ['education', 'health', 'public', 'science', 'work']

expect(contentManifest.schemaVersion === 2, 'content schema must be v2')
expect(same([...supportedLocales], ['zh-TW', 'en']), 'supported locale list drifted')
expect(same([...contentManifest.locales], ['zh-TW', 'en']), 'content locale list drifted')
expect(uiCopy['zh-TW'] && uiCopy.en, 'UI copy is incomplete')

const zh = getDemoContent('zh-TW')
const en = getDemoContent('en')
expect(same(ids(zh.modeList), modeIds), 'zh-TW mode order is incomplete')
expect(same(ids(en.modeList), modeIds), 'English mode order is incomplete')

for (const modeId of modeIds) {
  const zhMode = zh.gameModes[modeId]
  const enMode = en.gameModes[modeId]
  expect(zhMode && enMode, `${modeId} missing a locale`)
  expect(Boolean(zhMode.title || zhMode.zh) && Boolean(enMode.title || enMode.zh), `${modeId} missing a display title`)
  expect(same(zhMode.source, enMode.source), `${modeId} source paths differ by locale`)
  expect(same(zhMode.domains, enMode.domains), `${modeId} domain tags differ by locale`)
  expect(zhMode.domains.every((domain) => domainIds.includes(domain)), `${modeId} has an unsupported domain tag`)
  expect(zhMode.thumbnail === enMode.thumbnail && zhMode.background === enMode.background, `${modeId} assets differ by locale`)

  if (modeId === 'scene') {
    expect(same(ids(zhMode.scene.lenses), ids(enMode.scene.lenses)), 'Scene lens IDs differ by locale')
    expect(zhMode.scene.positions.length === enMode.scene.positions.length, 'Scene positions differ by locale')
    expect(zhMode.scene.commitments.length === enMode.scene.commitments.length, 'Scene commitments differ by locale')
    zhMode.scene.lenses.forEach((lens, index) => {
      const peer = enMode.scene.lenses[index]
      expect(lens.options.length === peer.options.length, `Scene ${lens.id} option count differs`)
      expect(lens.optionFeedback.length === lens.options.length, `zh-TW Scene ${lens.id} feedback count differs`)
      expect(peer.optionFeedback.length === peer.options.length, `English Scene ${lens.id} feedback count differs`)
    })
    continue
  }

  expect(same(ids(zhMode.items), ids(enMode.items)), `${modeId} item IDs differ by locale`)
  zhMode.items.forEach((item, index) => {
    const peer = enMode.items[index]
    expect(item.correct === peer.correct, `${modeId}/${item.id} key differs by locale`)
    expect(item.structure === peer.structure, `${modeId}/${item.id} structure differs by locale`)
    expect(same(item.options.map(([id]) => id), peer.options.map(([id]) => id)), `${modeId}/${item.id} option IDs differ`)
    expect(same(sorted(item.dissection.map(({ id }) => id)), sorted(item.options.map(([id]) => id))), `zh-TW ${modeId}/${item.id} dissection is incomplete`)
    expect(same(sorted(peer.dissection.map(({ id }) => id)), sorted(peer.options.map(([id]) => id))), `English ${modeId}/${item.id} dissection is incomplete`)
  })
}

const collectStrings = (value, result = []) => {
  if (typeof value === 'string') result.push(value)
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, result))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, result))
  return result
}

const englishContent = collectStrings(en.gameModes)
expect(!englishContent.some((value) => /[\u3400-\u9fff]/u.test(value)), 'English mode content contains Han text')

const zhContent = [...collectStrings(zh.gameModes), ...collectStrings(uiCopy['zh-TW'])]
const bannedZhTokens = ['heterotypic', 'bridging domains', 'held-out', 'Forecaster', 'runtime-generated', 'canonical Detective']
for (const token of bannedZhTokens) {
  expect(!zhContent.some((value) => value.includes(token)), `zh-TW learner copy contains untranslated token: ${token}`)
}

console.log('PASS [web-i18n] locale parity, domain routing, per-option feedback, and language guards')
