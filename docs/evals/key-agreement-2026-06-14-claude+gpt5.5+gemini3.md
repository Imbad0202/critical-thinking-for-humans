# Cross-Model Key Agreement (Stability) — 2026-06-14 · claude + gpt-5.5 + gemini-3

First result run of protocol 1 (`README.md`). Reports **stability /
reproducibility only**. It does **not** establish that any key is correct — for
that, the human validity anchor (`README.md` protocol 1b) is still unrun. Read
the "What this number is not" section before quoting the headline.

## Method

- **Author model (generated items + keys):** claude-opus-4-8, 2026-06-14
- **Judge models (solved cold, keys withheld):** gpt-5.5 (reasoning effort
  xhigh, via `codex exec`); gemini-3.1-pro-preview (via gemini CLI,
  `--approval-mode plan`). Each judge solved the items through its own vendor
  CLI — no model role-played another (the independence condition `README.md`
  requires).
- **Item count / structure coverage:** 24 items; **all twelve structures, 2 per
  structure** (`necessary_assumption`, `alternative_cause`, `reverse_causation`,
  `coincidence_timing`, `sample_selection`, `proxy_mismatch`,
  `evidence_sufficiency`, `base_rate_neglect`, `regression_to_mean`,
  `simpson_paradox`, `circular_reasoning`, `hasty_generalization`).
- **Tier(s):** mixed — 5 intro, 11 standard, 8 advanced.
- **Domain(s):** synthetic only — municipal transit, workplace training, retail,
  public health, education research, corporate management, city governance,
  consumer tech, professional certification, product reviews, nonprofit
  programs, software management, marketing, clinical research, security
  screening, fraud detection, sports, education policy, hospital quality, hiring
  analytics, consumer marketing, organizational policy, retail strategy,
  consumer opinion. All institution names are invented; no real schools,
  people, or internal references appear.

### Confound control: option order randomized

The author generated every item with its key in option (A). Left uncorrected,
that invites a position bias — a judge that simply favors (A) would manufacture
false agreement. Before the judges saw anything, each item's options were
**deterministically shuffled** (seeded by item id, so the run is reproducible).
After shuffling, the key sits at A×5, B×6, C×5, D×3, E×5. Both judges solved the
shuffled items; the table below reports each judge's pick in the **shuffled**
letter space against the shuffled key position.

## Epistemic status

**Stability, not validity.** High agreement means the key is *typical* of how
current frontier models read the item — not that it is *correct*. The judges
(gpt-5.5, gemini-3) and the author (claude-opus-4-8) are all current large
language models trained on heavily overlapping web-scale corpora; they share
systematic blind spots, and the items most likely to survive a cross-model vote
are precisely the ones all three read the same way. No human-expert key stands
behind this number. A correctness claim requires the human validity anchor
(protocol 1b), which has no run yet. **This file makes no validity claim.**

## Results

| # | Structure | Tier | Author key | gpt-5.5 | gemini-3 | Verdict |
|---|-----------|------|-----------|---------|----------|---------|
| 1 | `necessary_assumption` | standard | E | E | E | unanimous |
| 2 | `necessary_assumption` | intro | A | A | A | unanimous |
| 3 | `alternative_cause` | standard | C | C | C | unanimous |
| 4 | `alternative_cause` | intro | B | B | B | unanimous |
| 5 | `reverse_causation` | standard | A | A | A | unanimous |
| 6 | `reverse_causation` | advanced | D | D | D | unanimous |
| 7 | `coincidence_timing` | standard | E | E | E | unanimous |
| 8 | `coincidence_timing` | intro | A | A | A | unanimous |
| 9 | `sample_selection` | standard | D | D | D | unanimous |
| 10 | `sample_selection` | intro | B | B | B | unanimous |
| 11 | `proxy_mismatch` | advanced | C | C | C | unanimous |
| 12 | `proxy_mismatch` | standard | C | C | C | unanimous |
| 13 | `evidence_sufficiency` | standard | B | B | B | unanimous |
| 14 | `evidence_sufficiency` | advanced | D | D | D | unanimous |
| 15 | `base_rate_neglect` | advanced | E | E | E | unanimous |
| 16 | `base_rate_neglect` | standard | A | A | A | unanimous |
| 17 | `regression_to_mean` | advanced | C | C | C | unanimous |
| 18 | `regression_to_mean` | standard | B | B | B | unanimous |
| 19 | `simpson_paradox` | advanced | E | E | E | unanimous |
| 20 | `simpson_paradox` | advanced | E | E | E | unanimous |
| 21 | `circular_reasoning` | standard | B | B | B | unanimous |
| 22 | `circular_reasoning` | advanced | A | A | A | unanimous |
| 23 | `hasty_generalization` | standard | B | B | B | unanimous |
| 24 | `hasty_generalization` | intro | C | C | C | unanimous |

- **Unanimous (both judges = author key):** 24 / 24
- **Split or contested:** 0 / 24
- **Judge–judge agreement (gpt-5.5 == gemini-3, key aside):** 24 / 24

Each judge was also asked for a one-clause reason. On every item both reasons
named the structure the item was built to test (e.g. item 16 base-rate neglect:
gpt-5.5 "low fraud base rate and false positives undermine the inference",
gemini-3 "exposes base rate neglect where false positives overwhelm true
positives"). The agreement is not letter-matching luck — the judges reached the
key through the intended reasoning.

## What this number is not — why 100% is a finding, not a victory

A clean sweep is the result this protocol is *most* obligated to be suspicious
of, for three reasons:

1. **It is consistent with a ceiling effect, not with key correctness.** Five of
   the 24 items (#3, #6, #12, #16, #23) were built with a deliberately
   *borderline* distractor — an option carrying partial merit, planted to see
   whether the judges would split. None did. That does not show the distractors
   are clean; it shows this difficulty band sits inside the shared comfort zone
   of three frontier models. The items hard enough to split such judges are
   harder than anything generated here. A 100% rate at this difficulty is weak
   evidence about the keys and strong evidence about where the items fall.

2. **Shared training distribution is the whole caveat.** The standard
   methodology position is that inter-model agreement measures reproducibility,
   never ground truth, *because* the models share data and therefore share
   failure modes. The failure mode most likely to survive a unanimous
   cross-model vote is the one all three get wrong identically — and this run
   cannot see it. 24/24 is exactly what a correlated blind spot would also
   produce.

3. **The author model is one of the three.** Items were generated by
   claude-opus-4-8 and judged by gpt-5.5 and gemini-3. Different vendors, yes —
   but all three are contemporary LLMs. This is cross-*model* independence, not
   cross-*paradigm* independence. A human cold-solver (protocol 1b) is the only
   judge in the stack that is not a language model, and that run does not exist.

So the reportable claim is narrow: **on 24 synthetic items spanning all twelve
structures at intro/standard/advanced tiers, two independent frontier models
each reproduced the author model's key on every item, including five items
seeded with a partial-merit distractor.** That is a stability ceiling, not a
correctness result.

## Split / contested items (full text — the finding)

**There were none.** Per protocol, this section reproduces non-unanimous items in
full so a reader can judge whether "single defensible answer" was the author's
claim or a cross-model fact. With zero splits, there is nothing here to
adjudicate — and that absence is itself the limitation above, not a strength.

In place of split items, the five **deliberately-borderline** items are
reproduced below (as the judges saw them, options shuffled), because they are the
closest this run came to a split and the best available evidence that the test
was not hard enough to find one.

### Item 3 — `alternative_cause` · standard · retail operations

**Stem:** Brightway Grocers installed self-checkout kiosks in March. Quarterly
revenue rose 12% by June. The chain concluded the kiosks drove the revenue
increase. Which option most weakens this conclusion?

- (A) Self-checkout kiosks reduce labor costs for the chain.
- (B) The kiosks were more expensive to install than Brightway had budgeted.
- (C) A large competing supermarket two blocks away closed permanently in April, sending its customers to Brightway.  **← author key**
- (D) Some customers find self-checkout kiosks confusing to use.
- (E) Revenue at Brightway also rose 12% in the same quarter last year, before kiosks existed.

**Planted borderline distractor:** (E) — points at seasonality/regression, a
*different* valid attack on the causal claim, planted to tempt a judge toward a
"this rise is normal" reading instead of the alternative-cause key.
**Author key:** (C) — a named independent third factor (competitor closing).
**gpt-5.5:** C — "provides an alternate cause for the revenue increase".
**gemini-3:** C — "Provides a strong alternative cause for the revenue increase".
**Verdict:** unanimous; neither judge took the seasonality bait.

### Item 6 — `reverse_causation` · advanced · corporate management

**Stem:** An analyst notes that companies with the largest in-house legal
departments also face the most lawsuits each year. She concludes that maintaining
a large legal department provokes lawsuits against a company. Which option most
weakens this conclusion?

- (A) Some small companies also face occasional lawsuits.
- (B) In-house lawyers are generally paid less than law-firm partners.
- (C) Large legal departments are expensive to maintain.
- (D) Companies that anticipate or already face heavy litigation deliberately build large legal departments to handle the caseload.  **← author key**
- (E) Companies with large legal departments tend to be larger overall.

**Planted borderline distractor:** (E) — company size as a third factor is a
real confound (an alternative-cause attack), planted because it is a *defensible*
weakener, just not the reverse-causation key the item targets.
**Author key:** (D) — heavy litigation (the outcome) causes the large legal
department (the supposed cause); the arrow is reversed.
**gpt-5.5:** D — "reverses the proposed causal direction".
**gemini-3:** D — "Reverses the causal relationship between the two variables".
**Verdict:** unanimous; both judges preferred the reversed-arrow reading over the
size-confound distractor. (This is the item where a split would have been most
informative — both "size confounds" and "arrow reversed" are arguably
defensible weakeners. The judges agreeing does not retire that ambiguity; it
means two LLMs resolve it the same way. A human anchor is the test that could
say whether (E) is genuinely also-defensible.)

### Item 12 — `proxy_mismatch` · standard · software engineering management

**Stem:** A software team's manager reports that the team closed 340 support
tickets last month, up from 210 the month before, and concludes that customer
satisfaction with the product has improved. Which option most weakens this
conclusion?

- (A) The team hired two additional support staff last month.
- (B) Some tickets were closed faster than others.
- (C) The rise in closed tickets reflects a surge in new bugs from a recent release, and post-resolution customer satisfaction scores actually fell.  **← author key**
- (D) Closing a ticket requires a supervisor's sign-off.
- (E) The support team uses a well-regarded ticketing system.

**Planted borderline distractor:** (A) — more staff explains more closures
(alternative cause for the throughput), planted because it engages the data
without touching the satisfaction claim, the kind of near-miss that can split
judges.
**Author key:** (C) — tickets-closed is a throughput proxy, not satisfaction;
(C) shows the proxy moving opposite to the claimed outcome.
**gpt-5.5:** C — "shows more ticket closures coincided with worse satisfaction".
**gemini-3:** C — "Demonstrates that more closed tickets meant more bugs and lower satisfaction".
**Verdict:** unanimous; neither judge mistook the staffing distractor for the
satisfaction attack.

### Item 16 — `base_rate_neglect` · standard · fraud detection

**Stem:** A bank's fraud model identifies a transaction as fraudulent, and the
model catches 90% of real fraud. A manager argues this flagged transaction is
therefore probably fraud. Which option most weakens this conclusion?

- (A) Only about 1 in 5,000 transactions is actually fraudulent, and the model also flags 3% of the many legitimate transactions.  **← author key**
- (B) Fraudulent transactions are usually for large amounts.
- (C) Customers dislike having legitimate transactions flagged.
- (D) The bank processes millions of transactions daily.
- (E) The model was trained on last year's data.

**Planted borderline distractor:** (D) — transaction volume is part of *why* the
base rate bites, so it has partial relevance, planted to tempt a judge into
picking the contributing fact over the full base-rate statement.
**Author key:** (A) — the low base rate plus the false-positive rate is the
complete base-rate-neglect attack.
**gpt-5.5:** A — "low fraud base rate and false positives undermine the inference".
**gemini-3:** A — "exposes base rate neglect where false positives overwhelm true positives".
**Verdict:** unanimous; both judges chose the complete statement over the
partial-volume distractor.

### Item 23 — `hasty_generalization` · standard · retail strategy

**Stem:** A clothing chain raised prices 5% in three of its downtown stores and
found that foot traffic in all three held steady over the next month. The chain
concluded it can raise prices 5% across all 600 of its stores nationwide without
losing customers. Which option most weakens this conclusion?

- (A) The price increase was implemented over a single weekend.
- (B) The three downtown stores serve mostly affluent commuters, whereas most of the chain's 600 stores are in suburban and rural areas with far more price-sensitive shoppers.  **← author key**
- (C) Competitors also raised prices recently.
- (D) The chain's downtown stores carry the same merchandise as its other stores.
- (E) Foot traffic is measured by an electronic door counter.

**Planted borderline distractor:** (D) — "same merchandise" makes the stores look
*more* comparable, a reversal planted to tempt a judge into reading it as
relevant to representativeness.
**Author key:** (B) — three non-representative (affluent) stores cannot support a
nationwide claim; the sample is too narrow.
**gpt-5.5:** B — "three affluent downtown stores are not representative".
**gemini-3:** B — "shows the sample is unrepresentative of the broader population".
**Verdict:** unanimous; neither judge took the same-merchandise reversal.

## Notes / unresolved questions

- **The headline is a stability ceiling, not a key-validity result.** 24/24
  reproducibility at intro/standard/advanced tiers tells us these keys are
  reproducible across two frontier vendors; it tells us nothing about whether the
  keys are correct, and the ceiling effect means it cannot even bound the
  difficulty at which they would start to diverge.
- **Difficulty was not high enough to find a split.** A useful next run would
  push advanced-tier subtlety (and compound flaws) until at least some items
  split the judges — the split items are the data this protocol exists to
  surface, and this run produced none.
- **Validity remains entirely unrun.** Protocol 1b (human cold-solve) is the only
  path to a correctness claim and still has no result file. Until it does, the
  evals directory — and this file specifically — makes no claim that any drill
  key is right, only that it is reproducible across these two models at this
  difficulty.
- **Reproducibility of this run:** items, blind/shuffled versions, the shuffle
  seed (1000 + item id), both judges' raw outputs, and the comparison were
  generated programmatically; the synthetic items and keys live in the run's
  working set. Re-running the same items through the same CLIs should reproduce
  the verdicts modulo judge nondeterminism.
