# Cross-Model Key Agreement (Stability) — TEMPLATE (no run yet)

Copy to `key-agreement-<date>-<model-set>.md` and fill. See `README.md` for the
protocol and what this may/may not claim. This protocol reports **stability /
reproducibility only**. For a correctness claim, use the human validity anchor
(`README.md` protocol 1b) — not this file, however high the agreement.

## Method

- **Author model (generated items + keys):** _e.g. claude-opus-4-8, <date>_
- **Judge models (solved cold, keys withheld):** _e.g. gpt-5.5 (xhigh), gemini-3-pro_
- **Item count / structure coverage:** _N items; which of the 12 structures_
- **Tier(s):** _intro / standard / advanced_
- **Domain(s):** _the field(s) items were generated in_

## Epistemic status

Stability, not validity. High agreement means the key is *typical* of how
current models read the item, not that it is *correct* — the models share
training data and so share blind spots. No human-expert key stands behind this
number. A correctness claim requires the human validity anchor (protocol 1b).

## Results

| # | Structure | Author key | Judge A | Judge B | Verdict |
|---|-----------|-----------|---------|---------|---------|
| 1 | _ | _ | _ | _ | unanimous / split / contested |

- **Unanimous:** _n / N_
- **Split or contested:** _n / N_

## Split / contested items (full text — the finding)

> Reproduce each non-unanimous item in full: stem, options, author key, each
> judge's pick and reasoning. These are where the key is the author model's
> claim, not a cross-model fact.

## Notes / unresolved questions
