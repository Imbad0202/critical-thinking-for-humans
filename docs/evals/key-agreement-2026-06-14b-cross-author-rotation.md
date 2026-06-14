# Cross-Model Key Agreement (Stability) — 2026-06-14 (run B) · cross-author rotation

Second run of protocol 1 (`README.md`), designed to remove the author-bias
limitation of run A (`key-agreement-2026-06-14-claude+gpt5.5+gemini3.md`, where
all items came from one author model). Still reports **stability /
reproducibility only** — no validity claim. Read "What changed and what it
proves" before quoting the headline.

## Method

- **Authors (rotated):** each of the three models generated 8 items —
  claude-opus-4-8 (items C1–C8), gpt-5.5 / `codex exec` high effort (X1–X8),
  gemini-3.1-pro-preview (G1–G8). 24 items total.
- **Judges (the other two per batch, cold-solve, keys withheld):**
  - C-batch (Claude-authored) → judged by gpt-5.5 and gemini-3.
  - X-batch (GPT-5.5-authored) → judged by claude-opus-4-8 and gemini-3.
  - G-batch (Gemini-authored) → judged by claude-opus-4-8 and gpt-5.5.
  - **The author never judges its own batch.** Every item has two independent
    judges from different vendors than the author.
- **Difficulty:** all 24 items generated at **advanced** tier (5 options, subtle
  gap, item type not announced, each batch instructed to plant at least one
  genuinely tempting near-miss distractor). The whole point of this run was to
  try to produce a split.
- **Confound control:** option order **deterministically shuffled** before
  judging (seed per batch+item), so no key sits preferentially at (A). Judges
  saw shuffled options; verdicts compare each judge's pick to the shuffled key
  position. (Exception: Claude judged the G-batch from the unshuffled item file,
  so its picks are recorded in original-letter space and compared to the
  original key; a programmatic check confirmed both judges selected the *same
  option text* on every G item — see "Verification" below.)
- **Structure coverage:** all twelve structures appear; each author spread its 8
  items across 8 distinct structures.
- **Domains:** synthetic only; invented institution names, no real orgs/people.

## Epistemic status

**Stability, not validity.** This run removes *author bias* (no single model
both wrote and was graded on the set) but does **not** remove the deeper caveat:
all three are contemporary frontier LLMs trained on overlapping corpora, so they
share systematic blind spots. Rotating which LLM writes does not add a non-LLM
judge. A correctness claim still requires the human validity anchor (protocol
1b), which has no run. **This file makes no validity claim.**

## Results

### C-batch — authored by Claude · judged by GPT-5.5 + Gemini-3

| # | Structure | Key (shuf) | GPT-5.5 | Gemini-3 | Verdict |
|---|---|---|---|---|---|
| C1 | `evidence_sufficiency` | D | D ✓ | D ✓ | unanimous |
| C2 | `reverse_causation` | E | E ✓ | E ✓ | unanimous |
| C3 | `base_rate_neglect` | E | E ✓ | E ✓ | unanimous |
| C4 | `regression_to_mean` | D | D ✓ | D ✓ | unanimous |
| C5 | `coincidence_timing` | D | D ✓ | D ✓ | unanimous |
| C6 | `circular_reasoning` | C | C ✓ | C ✓ | unanimous |
| C7 | `hasty_generalization` | D | D ✓ | D ✓ | unanimous |
| C8 | `necessary_assumption` | C | C ✓ | C ✓ | unanimous |

### X-batch — authored by GPT-5.5 · judged by Claude + Gemini-3

| # | Structure | Key (shuf) | Claude | Gemini-3 | Verdict |
|---|---|---|---|---|---|
| X1 | `necessary_assumption` | B | B ✓ | B ✓ | unanimous |
| X2 | `alternative_cause` | E | E ✓ | E ✓ | unanimous |
| X3 | `reverse_causation` | B | B ✓ | B ✓ | unanimous |
| X4 | `sample_selection` | C | C ✓ | C ✓ | unanimous |
| X5 | `proxy_mismatch` | E | E ✓ | E ✓ | unanimous |
| X6 | `base_rate_neglect` | D | D ✓ | D ✓ | unanimous |
| X7 | `regression_to_mean` | A | A ✓ | A ✓ | unanimous |
| X8 | `simpson_paradox` | C | C ✓ | C ✓ | unanimous |

### G-batch — authored by Gemini-3 · judged by Claude + GPT-5.5

(Claude's letters differ from the key-shuf column because Claude solved this
batch in original-letter order; both judges picked the same option text — see
Verification.)

| # | Structure | Key (shuf) | Claude | GPT-5.5 | Verdict |
|---|---|---|---|---|---|
| G1 | `necessary_assumption` | D | B ✓ | D ✓ | unanimous |
| G2 | `base_rate_neglect` | E | D ✓ | E ✓ | unanimous |
| G3 | `simpson_paradox` | E | B ✓ | E ✓ | unanimous |
| G4 | `sample_selection` | A | E ✓ | A ✓ | unanimous |
| G5 | `alternative_cause` | E | B ✓ | E ✓ | unanimous |
| G6 | `reverse_causation` | C | C ✓ | C ✓ | unanimous |
| G7 | `evidence_sufficiency` | A | E ✓ | A ✓ | unanimous |
| G8 | `regression_to_mean` | A | D ✓ | A ✓ | unanimous |

- **Unanimous (both judges = author key):** 24 / 24
- **Split or contested:** 0 / 24

## Verification

- **Cross-letter check (G-batch):** because Claude judged G in original-letter
  space and GPT-5.5 in shuffled space, a script confirmed that on all 8 G items
  the two judges' picks resolve to the *same option text* (the key option),
  e.g. G1: Claude "B" (original) and GPT-5.5 "D" (shuffled) both point at "the
  server farms did not experience a significant decrease in workload." The
  agreement is on content, not letters.
- **Reason check:** every judge gave a one-clause reason that named the
  structure the item targets (e.g. X8 Simpson's: Gemini "the subgroup data
  reverses the aggregate"; Claude "R higher in both risk subgroups despite Q
  higher overall"). Not letter-matching luck.

## What changed and what it proves

Run A's weakness was that Claude both authored and sat in the judged set. This
run fixes that: **three different vendors took turns authoring, and no model
graded its own items.** The result did not move — 24/24, same as run A.

That makes the stability finding *stronger* and the validity gap *no smaller*:

1. **Author bias is now ruled out as the explanation.** A clean sweep survived
   rotating the author across three vendors at advanced difficulty. The
   reproducibility is not an artifact of one model grading its own house style.
2. **The ceiling effect is now better evidenced, not weaker.** Each batch was
   explicitly instructed to plant a tempting near-miss, and Claude's batch in
   particular seeded competing-reading distractors (a sector confound against a
   reverse-causation key in C2; a misstated statistic in C3; later-supplied
   evidence "rescuing" a circular argument in C6; a small-N reading competing
   with an outcome-conditioning flaw in C7). None split the judges. Two frontier
   models resolve these the same way the author intended — which is what a shared
   training distribution predicts, and exactly the case `README.md` warns cannot
   be promoted to "the key is right."
3. **The twelve structures are a dense region of model competence.** These are
   classic informal-logic patterns (alternative cause, base-rate neglect,
   Simpson's, regression to the mean, survivorship, circularity…). Frontier
   models are heavily trained on this material. A 100% cross-model rate is as
   consistent with "this is the models' strongest home turf" as with "the keys
   are correct" — and only a non-LLM judge can separate those two readings.

So the reportable claim, now on firmer ground: **across 24 advanced synthetic
items spanning all twelve structures, authored in rotation by three independent
frontier vendors and each judged by the other two with options shuffled, every
item was unanimous.** That is strong evidence of cross-model *stability* on this
task space, and zero evidence about *validity*.

## What would actually move this number

- **Harder items still did not split the judges** at advanced tier. Producing a
  split likely requires either compound/adversarial items engineered
  specifically against model consensus, or items in structures the field itself
  treats as contested — not more of the same canonical patterns.
- **Validity remains entirely unrun.** Protocol 1b (human cold-solve) is the
  only path to a correctness claim. Two independent stability runs (A and B) now
  agree at 100%; that ceiling is precisely why the human anchor is the only
  informative next measurement. Until 1b has a result file, neither this run nor
  run A claims any drill key is correct — only that the keys are reproducible
  across these three models at this difficulty.
