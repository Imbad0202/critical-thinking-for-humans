# Web Casebook demo

The Web Casebook is the no-CLI, bilingual browser entry point for
`critical-thinking-for-humans`. It uses the same canonical mode documents as
design constraints, but it is not the full conversational Skill runtime.

The current browser edition contains four authored, replayable excerpts:

- **Quick Reasoning Drills** — three beginner items with an explanation for every option.
- **Six ways to examine one scene** — observation, six angles, a provisional view, a reasoned decision, and a serious objection.
- **Expedition Dossier** — a three-forecast Forecaster excerpt grounded in the verified AlphaFold 2 at CASP14 pack.
- **Case Audit Demo** — a two-step beginner dependency in which the `12%` value found in step one is required in step two.

These excerpts are synthetic and AI-authored. They have structural and source
checks, but no claim is made that a human subject-matter reviewer has certified
their answer keys. The UI points disagreements back to the CLI/Skill challenge
flow instead of presenting the fixed key as authority.

## Run locally

From the repository root:

```bash
python -m http.server 4173 --directory web
```

Open `http://127.0.0.1:4173/`.

No build, API key, package install, or model call is required for the four fixed
demos. `index.html` loads committed ES modules and source CSS directly, so a
clean clone works as a static site.

## What is implemented

- **Real domain gate.** A first-time player chooses Mixed, Education, Health &
  medicine, Public affairs, Science & technology, or Work & business. The
  choice changes the available mode cards and, for Drill, the actual question
  list. Daily fixtures carry explicit domain metadata, with a legacy slug
  fallback for older records. The choice is stored locally and shareable with
  `?domain=`.
- **Real i18n.** `中文 / EN` changes the interface, mode descriptions, case
  text, options, feedback, accessibility labels, document language, title, and
  description. The choice is stored locally and shareable with `?lang=`.
- **Taiwan-oriented Traditional Chinese.** zh-TW copy is separately authored in
  natural Taiwan usage; it is not a literal browser translation of the English.
- **Commit-before-reveal.** Graded excerpts show no analysis until an answer is
  locked, then explain every option. A miss costs no lives and never blocks the
  next item.
- **Scene privacy.** Observation, blind-spot, and decision-reason text remain in
  the current tab and are never written to the Passport.
- **Retro visual-novel presentation.** Generated backgrounds and character
  poses, evidence cards, dialogue panels, state-specific effects, original
  background music, and separate music/SFX controls.
- **Local Passport.** XP, streak, completion dates, modes, and reasoning IDs are
  stored in `localStorage`; free-form text is excluded.
- **Responsive and accessible controls.** Tested at 320×568, 390×844,
  768×1024, 844×390, 1440×1000, and 2560×1440. Meaningful visible copy has a
  14px floor, enabled controls have a 44px target, keyboard focus is visible,
  modals trap focus, reduced motion is respected, and WebGL has a 2D fallback.

The Daily feature currently serves zh-TW cases only. When the interface is in
English it states that boundary and disables the Daily action rather than
mixing Chinese case text into an English session. The four fixed demos remain
fully bilingual.

## Three entry points remain distinct

| Entry | Runtime | Current scope |
|---|---|---|
| CLI / plugin | Dynamic AI conversation | All four canonical modes, pack library, local Passport, free-form challenges |
| Skill ZIP / chat | Dynamic AI conversation on a supported host | Four modes in the Claude.ai ZIP; platform-specific Passport behavior |
| Web Casebook | Static browser content plus optional Daily API | Four fixed bilingual excerpts; no model call |

A ChatGPT Plus, Claude Pro, Google AI Pro, or SuperGrok subscription generally
does not provide inference credit to an independent website. The demo never
asks for an account password, cookie, or session token. A future model-connected
edition must use a provider-approved OAuth/API flow or product-funded usage.

## Daily cases and Vercel

The public repository includes the Daily mechanism, public schemas, a
fourteen-day zh-TW example rotation, Vercel Functions, Cron configuration, and
an upload CLI. Public prompts contain no answers, hints, or reveal text.
Unpublished private records and credentials belong in ignored `.private/` files
and Private Vercel Blob.

The first seven checked-in prompts deliberately mirror the public fixed demos,
so a reader can infer their keys from the locale modules. They test the API's
selected-ruling and no-payload-leak behavior; they are not an anti-cheat bank.
The second seven prompts are an independently authored source-credibility case
family whose answer records never ship in the repository — they follow the
production pattern: keys exist only in private records uploaded to Private
Blob. Any production scored rotation must keep working this way.

Set the Vercel Root Directory to `web` and follow
[`docs/DAILY_DEPLOYMENT.md`](docs/DAILY_DEPLOYMENT.md). Before upload:

```bash
cd web
npm ci
npm run daily:upload -- --dry-run
```

Private Blob records are intentionally create-only. Updating a scheduled or
published answer record requires an explicit migration plan; the uploader will
not silently overwrite a date.

## Local data

```text
critical-thinking-for-humans.casebook.v3       # Passport
critical-thinking-for-humans.casebook.locale   # zh-TW or en
critical-thinking-for-humans.casebook.domain   # selected domain
```

Clearing browser data removes all three. If a future release adds cloud sync,
the UI's local-only language and privacy disclosure must change in the same
release.

## Content layout

```text
content/demo-cases.js                 bilingual registry and schema metadata
content/ui-copy.js                    interface strings
content/locales/zh-TW/*.js            Taiwan Traditional Chinese mode excerpts
content/locales/en/*.js               English mode excerpts
content/daily/cases/*.json            public zh-TW Daily prompts
.private/daily/*.json                 ignored private rulings
```

The locale modules name their canonical mode, shared structure, or Expedition
pack sources. A Skill update does not silently rewrite a web answer. Maintainers
must re-author and re-test an excerpt when the canonical behavior changes.

## Verification

```bash
cd web
npm run check
npm run check:i18n
npm run test:daily
npm run daily:sync-public -- --check
npm run daily:upload -- --dry-run

cd ..
python scripts/check_web_content.py
python scripts/check_daily_cases.py

# with the local static server running in another terminal
python -m pip install -r web/tests/requirements-e2e.txt
python -m playwright install chromium
CASEBOOK_BASE_URL=http://127.0.0.1:4173/ python web/tests/e2e_smoke.py

# deeper browser suites
CASEBOOK_BASE_URL=http://127.0.0.1:4173/ python web/tests/e2e_modes.py
CASEBOOK_BASE_URL=http://127.0.0.1:4173/ python web/tests/e2e_daily.py
```

The focused smoke is the pull-request gate: it covers the static fallback,
a completed Drill, and one mocked server-backed Daily ruling. The deeper E2E
suite covers both languages, the first-run domain gate, filtered
content, all four finishable excerpts, option dissections, Scene privacy,
Passport persistence, audio loading, horizontal overflow, the 14px text floor,
and 44px touch targets.
