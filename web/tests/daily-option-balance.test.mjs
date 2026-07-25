import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const SOURCE_CASE_FIXTURES = [
  ['2026-07-19', 'daily-2026-07-19-sponsored-column.json'],
  ['2026-07-20', 'daily-2026-07-20-vendor-study.json'],
  ['2026-07-21', 'daily-2026-07-21-secondhand-chain.json'],
  ['2026-07-22', 'daily-2026-07-22-single-source-echo.json'],
  ['2026-07-23', 'daily-2026-07-23-borrowed-authority.json'],
  ['2026-07-24', 'daily-2026-07-24-hearsay-ladder.json'],
  ['2026-07-25', 'daily-2026-07-25-lone-dissenter.json'],
]

const MIN_OUTLIER_GAP = 8
const MIN_OUTLIER_RATIO = 1.25

function optionTextLength(value) {
  return Array.from(value.normalize('NFKC').replace(/\s/gu, '')).length
}

function optionLengthCue(mode, optionTexts) {
  if (mode === 'scene') return null

  const lengths = optionTexts
    .map(optionTextLength)
    .sort((left, right) => right - left)
  assert.ok(lengths.length >= 2, 'an option group needs at least two choices')

  const longest = lengths[0]
  const runnerUp = lengths[1]
  const gap = longest - runnerUp
  const ratio = longest / runnerUp
  return {
    flagged: gap >= MIN_OUTLIER_GAP && ratio >= MIN_OUTLIER_RATIO,
    gap,
    lengths,
    ratio,
  }
}

test('option-length metric normalizes NFKC, removes whitespace, and counts code points', () => {
  assert.equal(optionTextLength('Ａ B　Ｃ🙂'), 4)
})

test('option-length cue catches only a conspicuous unique longest choice', () => {
  assert.equal(
    optionLengthCue('drill', ['甲'.repeat(30), '乙'.repeat(20), '丙'.repeat(19)]).flagged,
    true,
  )
  assert.equal(
    optionLengthCue('drill', ['甲'.repeat(10), '乙'.repeat(4), '丙'.repeat(4)]).flagged,
    false,
    'a large ratio alone must not penalize short natural phrasing',
  )
  assert.equal(
    optionLengthCue('detective', ['甲'.repeat(60), '乙'.repeat(50), '丙'.repeat(49)]).flagged,
    false,
    'an absolute gap alone must not penalize proportionally similar long phrasing',
  )
  assert.equal(
    optionLengthCue('scene', ['甲'.repeat(30), '乙'.repeat(20), '丙'.repeat(19)]),
    null,
    'Scene lenses have no preferred answer and are outside this gate',
  )
})

test('the seven source-credibility cases have no conspicuous longest option', async () => {
  const seenDates = []

  for (const [expectedDate, filename] of SOURCE_CASE_FIXTURES) {
    const fixtureUrl = new URL(`../content/daily/cases/${filename}`, import.meta.url)
    const dailyCase = JSON.parse(await readFile(fixtureUrl, 'utf8'))
    seenDates.push(dailyCase.publishDate)

    assert.equal(dailyCase.publishDate, expectedDate, filename)
    assert.equal(dailyCase.content.kind, 'choice-sequence', filename)

    for (const item of dailyCase.content.items) {
      const result = optionLengthCue(
        dailyCase.mode,
        item.options.map((option) => option.text),
      )
      assert.equal(
        result.flagged,
        false,
        `${expectedDate}/${item.id}: option lengths ${result.lengths.join(', ')} `
          + `(longest-runner-up gap ${result.gap}, ratio ${result.ratio.toFixed(2)})`,
      )
    }
  }

  assert.deepEqual(
    seenDates,
    SOURCE_CASE_FIXTURES.map(([date]) => date),
    'the regression gate must cover exactly 2026-07-19 through 2026-07-25',
  )
})
