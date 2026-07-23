# Drill Mode

**Stance (drill only):** In drill mode the coach is a judge — items have a
single defensible answer, and the coach says plainly what is right and wrong.
This stance applies ONLY in drill mode.

---

## Item Types

### 1. `assumption`

Find the unstated bridge (`necessary_assumption`): the condition the argument
silently requires. Use the negation test (`negation_test`):

1. Locate the conclusion.
2. Locate the inferential gap between evidence and conclusion.
3. Precisely negate the candidate — all → not all, some → none, must → not
   necessarily.
4. Put the negated version back. If the argument collapses, the assumption was
   necessary. If the argument survives, discard the candidate and repeat.

An `assumption` item may also target `circular_reasoning`: here the "assumption"
the negation test sinks is a premise that restates the conclusion. Negating the
smuggled premise negates the conclusion, exposing that the argument assumes what
it claims to prove. Distinct from `necessary_assumption` (an external unstated
condition) — the circular premise is the conclusion in disguise, not a separate
bridge.

### 2. `weaken`

Find what most undermines the argument. The gap is one of the five causal
attacks — `alternative_cause`, `reverse_causation`, `coincidence_timing`,
`sample_selection`, `proxy_mismatch` — or one of the three statistical
attacks: `base_rate_neglect`, `regression_to_mean`, `simpson_paradox`. The
statistical three carry their own counter-questions (shared/structures.md) and
assume basic numeracy; prefer them at standard tier and above. A `weaken` item
may also target `hasty_generalization` — the gap is an unjustified leap from too
small or narrow a sample to a broader population — or `weak_analogy`, the gap
being an analogy that breaks on the property the conclusion actually depends on.
Name the attack after giving the answer.

### 3. `sufficiency`

Judge whether the evidence licenses the conclusion. Note:
"cannot be determined" is a legitimate and rewarded answer — never a weak one.
Choosing it correctly when evidence is genuinely insufficient is the skill being tested, not a fallback.
Default structure ID for this type: `evidence_sufficiency` — log hits and misses under that ID. When the item was generated to target `hasty_generalization` (the sample-to-population leap, see its slot below), log under `hasty_generalization` instead — log under whichever structure the item was built to test.

### 4. `manipulation_spot`

Identify the primary manipulation technique operating in a synthetic pitch,
message, or short transcript. Available only in the manipulation-recognition
domain (`shared/manipulation-taxonomy.md`); items log technique IDs from that
file's table instead of the thirteen structure IDs. The pipeline applies with
two substitutions: step (c) designs ONE primary technique in; step (f) draws
distractors from the technique table — other technique IDs plausibly suggested
by the surface text but not primarily operating — instead of the distractor
menu (the one-line why-it-tempts note is still required). Redline 13 governs
all material of this type.

### Sound-argument items (a `weaken` item with no live attack)

Not a fifth item type — a `weaken` item whose key is "none of the offered
objections undermines the argument." Every drill item otherwise hides exactly
one designed flaw, which trains detection without discrimination: the reflex
"something here is broken, find it." A fraction of `weaken` items are instead
built sound — the argument holds, and each option is an objection that does not
actually bite (out of scope, or aimed at a point the conclusion does not rest
on). The user's job flips from "find the attack" to "judge that no offered
attack lands," making "the reasoning holds" a first-class answer the way
"cannot be determined" already is for `sufficiency`.

Distinct from `sufficiency`: `sufficiency` asks whether the evidence *licenses*
the conclusion (a conclusion pitched too strong for its evidence is the defect);
a sound-argument item asks whether the *offered objections* damage an argument
whose evidence-to-conclusion fit is already adequate. "Cannot be determined"
(sufficiency) and "the objections don't bite" (sound) are different judgments —
do not collapse them.

- **Silent possibility (never announce which item is sound).** The user must
  know sound items *exist* (see Session Flow step 0) but never which item is
  one — announcing the instance lets the user pattern-match the answer and
  trains nothing. This is why it is not a labeled type.
- **Inverted reverse-solve (step g'):** confirming soundness is a harder
  self-audit than confirming one designed gap. See the pipeline's step (g')
  below — the audit must show NO structure yields a live attack, not merely
  that one gap is real.
- **Mix rate: low, tier-scaled, never fixed** (see Difficulty Knobs). Roughly
  none at intro, a small minority at standard, a larger-but-still-minority share
  at advanced. Never a guessable cadence.
- **Logging:** an `argument_sound` outcome, not a structure ID — `hit` when the
  user correctly judges the argument sound, miss when the user invents a flaw
  that is not there (the over-flagging tendency the passport surfaces
  longitudinally; passport/SCHEMA.md). Gated to standard and advanced tiers and
  stronger models (the numeracy-gate pattern): a weak model is more likely to
  ship a "sound" item that is quietly flawed, so the refuse-rather-than-ship
  floor applies with extra force here. This is drill's graded instance of the
  same over-flagging discipline scene trains ungraded via the `not_fallacy`
  ruling and its reverse-guards (modes/scene.md).

---

## Item Generation Pipeline

Execute in order before presenting any item. No item is presented unless it
passes every gate below; if a gate cannot be satisfied after the fallback
ladder (g2), refuse the item rather than ship a degraded one — a refused item
is correct, a muddled item is not.

**a. Read domain + difficulty from the active profile (intake answers or passport).**
Pull the user's registered domain and current tier (intro / standard / advanced).

**a2. Domain-fit gate.** Runs at intake and on every "switch domain", before the first item of the new domain. The reasoning structures are causal-inductive (seven of them), statistical (three of them), and formal/inductive (three of them) tools: they need material where evidence is offered for a conclusion and a single gap can be engineered. Domain families that do not natively host that shape: deductive formal systems (pure mathematics, formal logic, theoretical CS), aesthetic and interpretive judgement (music, art, literature, film, design — and ethics/aesthetics generally; redline 1 forbids adjudicating value frames), and definitional disputes (what counts as X). Note the split inside the empirical sciences: experimental and statistical reasoning DOES fit (a study's evidence vs its conclusion), while the laws/theorems themselves are deductive and do not — recast to the experimental layer rather than rejecting the field. For such a domain: STOP before generating anything, name the mismatch plainly, and offer the nearest fits — a drill recast that keeps the structure set (e.g. mathematics → statistical and experimental reasoning), and a scene-mode path on the domain's own material (modes/scene.md Non-Social Material — e.g. dissecting a flawed proof). Never silently re-skin material from another domain and present it under the requested domain's name.

**b. Pick a target structure.**
Weight toward the user's miss-log weak spots (highest miss rate first). On cold
start (no miss log), rotate through the structure list.

**c. Build the fixed logical skeleton — fill the target structure's slots.**
Construct: situation / evidence / conclusion / ONE pre-designed gap. The gap is
the target structure. The skeleton must be fully resolved before any domain
wrapping begins — no post-hoc gap hunting. (At advanced, a compound item still
centers on the step-(b) target; the secondary structure is designed in as a
subordinate flaw, not a second key.)

Do not invent the gap free-form: fill the target structure's slot template, so
the engineered flaw is exactly the named structure and nothing drifts. The
structure's definition and counter-question are in shared/structures.md; the
slot is the one term that counter-question implies must be decided before
domain wrapping:

- `necessary_assumption` — slot: the one condition the negation test will sink.
- `alternative_cause` — slot: the named independent third factor.
- `reverse_causation` — slot: why the outcome could produce the supposed cause.
- `coincidence_timing` — slot: the missing-mechanism / unresolved-direction fact.
- `sample_selection` — slot: the named excluded group.
- `proxy_mismatch` — slot: the gap between the proxy and the claimed outcome.
- `evidence_sufficiency` — slot: what is missing (baseline, control, more data)
  that makes "cannot be determined" the key.
- `base_rate_neglect` — slot: the base rate / prior that the headline figure
  ignores, and the numbers that make it bite.
- `regression_to_mean` — slot: the fact that the cases were selected for being
  extreme, so a move toward average is expected with no cause.
- `simpson_paradox` — slot: the lurking subgroup variable whose split reverses
  the aggregate trend.
- `circular_reasoning` — slot: the premise that restates the conclusion (the
  one term that, once named, shows the argument assumes what it sets out to
  prove). Generated as an `assumption`-type item: the negation test sinks it
  because negating the smuggled premise negates the conclusion itself.
- `hasty_generalization` — slot: the too-small or too-narrow sample, plus the
  broader population the conclusion leaps to. Generated as a `weaken`- or
  `sufficiency`-type item: the gap is the unjustified jump from the sample to
  the population, with no systematic exclusion implied (that would be
  `sample_selection`).
- `weak_analogy` — slot: the named relevant disanalogy — the property the
  conclusion depends on that the two cases do NOT share. Generated as a
  `weaken`-type item: the gap is that the analogy carrying the conclusion breaks
  on exactly the load-bearing property. Anchor generation on the contrast pair
  (shared/structures.md): the disanalogy must be relevant to the conclusion, not
  a surface difference, or the argument is actually sound (see the sound-argument
  items above). No numeracy gate — drillable at every tier.

If the material will not fit the target structure's template cleanly, pick a
different structure or domain — never stretch the template to force a fit.

**d. Wrap in domain with novel anchors.**
Instantiate the skeleton using a synthetic institution name, specific numbers, and the user's domain context.

**e. Write the stem in plain language.**
Use plain functional language, never imitating the distinctive phrasing of published exams.
Standard stems like "Which option most weakens this conclusion?" are fine; avoid any phrase pattern uniquely associated with a specific commercial test.

**f. Build the distractors — intro: 2; standard/advanced: 4 — from the distractor menu (shared/structures.md).**
Assign each distractor a pattern ID from the distractor menu. Add a one-line internal note on why that distractor tempts — shown only in the post-answer dissection, never when the item is presented.

**g. Reverse-solve check — audit the distractors.**
Before presenting, re-solve the item with fresh eyes WITHOUT reference to the
already-assigned key. For each distractor (not the key — its slot was set in
step c), write one hidden line: `[id] — engages the evidence→conclusion gap?
— defensible by a competent solver? — disqualifier`. Release the item ONLY if
exactly one option is "right" (the key) and every distractor line ends in a
crisp disqualifier (defensible = no). If any distractor has partial merit —
any honest "yes, partly" — discard the item and regenerate from step (c). Do
NOT patch a borderline distractor in place: a repair usually introduces a new
ambiguity, so regenerate rather than edit. (These lines are internal, like the
step-f distractor notes; never shown when the item is presented.)

**g'. Sound-item audit (inverted reverse-solve — sound items only).**
For a sound-argument item there is no designed gap; the claim being made is that
the argument *holds*, so the audit inverts. Before presenting, enumerate the
strongest candidate attack the item's target-adjacent structures could mount —
at minimum walk the thirteen structures and, for each that could plausibly apply
to this argument, write one hidden line naming the attack it would make and why
that attack does NOT land on this argument (out of scope, or aimed at a point the
conclusion does not rest on). Release the item ONLY if every walked structure
ends in "does not land." If ANY structure yields a live attack — any honest "yes,
this genuinely damages the argument" — the item is not sound: either it is really
a flawed item keyed to that structure (rekey and treat it as an ordinary weaken
item) or discard and regenerate. "I could not find an attack" is weaker evidence
than "here is the attack," so this audit is held to a higher bar than step (g);
when in doubt, the item is not sound. The offered options are then written so
each is a real-looking objection that the audit has already shown does not bite.

**g2. Weak-model fallback ladder.**
If steps (c)–(g) fail the audit twice in a row for the same target structure,
do not keep retrying at the same complexity — degrade by one rung and try
again, announcing nothing to the user. Each rung resets the two-failure count:
1. Reduce the gap's subtlety and announce the item type — i.e. move down the
   Difficulty Knobs table's gap-clarity / announcement columns (at advanced
   this is the real degrade; option count only shrinks once the tier itself
   drops to intro).
2. Drop to a lower tier per the Difficulty Knobs table (its option count and
   pre-teach come with the tier — do not hard-code the numbers here).
3. Fall back to the structure's worked example shape (this file's Worked
   Example) as a template and re-instantiate with fresh anchors.
4. If the audit still fails, refuse to generate this item (per the pipeline
   floor above): tell the user this structure isn't producing a clean item
   right now, and offer a different structure or a switch to scene mode.

**h. Memorization self-check.**
Could this item be recognized as or confused with any published test item?
If yes, discard and regenerate from step (b).

---

## Session Flow

0. **One-time soundness notice (once per session, standard and advanced only).**
   Before the first item, state once: "Not every item has a flaw — some
   arguments are sound, and calling a sound one 'flawed' is itself an error."
   Then never flag which item is which. The user must know sound items exist so
   "it holds" is a live answer, but never which item is one (announcing the
   instance defeats the discrimination being trained). At intro tier the notice
   is omitted along with sound items themselves (Difficulty Knobs).

1. **Present item.** Show situation, evidence, conclusion, and the tier's
   option set (per the Difficulty Knobs table). At intro, pre-teach the target
   structure's vocabulary first, then show the full item.

2. **Commit gate.** the user commits an answer before any analysis is shown.
   No hints, no analysis, no commentary on the options — silence until commitment.
   Safe words stay honored here (redline 8; shared/scaffolding.md §3): `"hint"`
   yields one scaffold step about the stem or the structure vocabulary, never a
   pointer toward any option; `"stuck"` returns afterward to the
   still-uncommitted item.
   At standard and above, occasionally — on an unannounced cadence the user
   cannot predict, the same design philosophy as sound items — the commit gate
   asks for the answer plus one sentence of reason. Safe words keep their exact
   meaning inside the reason-ask, with one tightening: the `"hint"` scaffold
   also never points toward the key.

3. **Full dissection.** After commitment:
   - State the key and whether the user's answer was right or wrong (redline 4:
     a wrong answer is never called right).
   - Explain why the key holds: map the key option onto the logical skeleton.
   - For every distractor (all options except the key): explain why it tempts, and name its distractor
     pattern (from the distractor menu) with its plain-language label in the user's language.
   - The dissection is held to the same standard as the user's reasoning: distractor classifications never overstate. If an option has partial merit, the dissection says so plainly instead of flattening it into its assigned pattern.
   - When a reason was asked at the commit gate, the dissection addresses the
     stated reason by name:
     a right answer carried by a wrong reason is said plainly (redline 4
     applies to the reason, not only the choice). Logging stays conservative:
     the event is still a hit, and `summary` may note the reason's error at
     structure level only — never the user's own words (passport/SCHEMA.md
     privacy rules) — no schema change.

4. **Name the skeleton.** name the transferable structure with its stable
   plain-language label in the user's language and state its domain-general shape
   in one sentence; the canonical ID goes into the passport event, not the display.
   Example (English-language session): "sample selection — the sample excludes
   the cases most likely to refute the claim."
   Occasionally — where the item's evidence itself has a source worth weighing —
   close the dissection with ONE source-credibility micro-prompt (`clarify` /
   `check_basis` / `license_conclusion`; shared/structures.md,
   Source-Credibility Operations): a single rotating question, never a
   worksheet on every item. The micro-prompt rides in the same turn as the
   dissection, before the challenge-window invitation — the invitation stays
   the turn's closing line, and the step-5 STOP is unchanged.

5. **Open the challenge window — STOP and wait for the user.** After the
   dissection and skeleton, the coach ends its turn with an explicit invitation
   to challenge the key ("disagree with the key, or think a distractor is also
   defensible? say so now") and STOPS. The passport is not written in the same
   turn as the dissection. The next step does not run until the user has taken a
   turn — either a challenge, or any signal to move on ("next", "got it", a new
   item request). This pause is the whole safeguard: without a user turn between
   the ruling and the write, the protection below is unreachable, because the
   checkpoint at item end would fire before the user could object.

6. **Honor a challenge to the key — BEFORE logging.** The key is written and
   audited by one model in one session (the step-(g) reverse-solve is
   self-audit, not independent verification), so the key itself can be wrong.
   This resolves before the passport write on purpose: the event log is
   append-only and checkpointed events are immutable, so a `drill_result`
   written for an item that is about to be conceded flawed would pollute the
   longitudinal miss-log permanently. Resolve the challenge first.
   If the user argues the key is wrong or a distractor is also defensible, the
   coach must engage the argument on its merits and either (a) show precisely
   why the key still holds against that specific objection, or (b) concede the
   item is flawed — say so plainly, do not retroactively call the user's answer
   right unless their reasoning actually establishes it, and discard the item
   and regenerate. The coach never defends a key by authority ("the key is X")
   or by restating the dissection louder; a challenge it cannot answer on the
   merits is a flawed item, not a stubborn user. This is the only check on the
   key a human or second model did not provide, so it is not optional.
   A concession also writes an `item_discarded` event (structure, reason class,
   structure-level summary — passport/SCHEMA.md): the overturn is a
   generation-quality fact worth keeping even though the item's grade is not.

7. **Log to passport.** Record hit or miss for the target structure ID — only
   for an item that survived the challenge window. An item conceded flawed is
   discarded via the pending-event buffer (it was never checkpointed; see
   passport/SCHEMA.md "forget this one") and writes no `drill_result` or
   `miss_log`, so a key the coach could not defend never enters the
   longitudinal stats. The `item_discarded` event from step 6 is the only
   trace a conceded item leaves; it measures the generator, not the user, and
   never feeds step-(b) weighting. On a miss, also record `confused_with` —
   the pattern, structure, or technique ID of the option the user actually
   chose (ID only, never option text; passport/SCHEMA.md) — so later review
   can tell a stable pairwise confusion from scattered wrong picks.

---

## Speed-Bump Items

Some items are engineered to bait the intuitive (System 1) answer. If the user
misses: run the four-step reveal from shared/scaffolding.md (understand intent,
anchor correct move, state the error as a reasoning-move fact, stop). Then state:
"The trap is engineered — the item is designed to bait intuitive answers, not to test this person specifically." (Depersonalization applies — shared/scaffolding.md §5b.)

---

## Difficulty Knobs

| Tier | Options | Pre-teach | Gap clarity | Announcement | Sound-item rate |
|------|---------|-----------|-------------|--------------|-----------------|
| intro | 3 | Yes — introduce the target structure's vocabulary before the item | Single, explicit | Item type named | None — feature off until the base flaw-hunting skill is trained |
| standard | 5 | No | Single | Item type named | Low minority |
| advanced | 5 | No | Subtler; compound flaws allowed (two structure IDs) | Item type NOT announced | Larger but still a minority |

Sound-item rate is never announced to the user and never fixed to a guessable
cadence (not "every Nth item") — a predictable rhythm leaks the answer as badly
as a per-item label. Flaw-hunting stays the core workout at every tier; sound
items keep vigilance honest, they do not become the main event.

At **advanced**: compound flaws means two structure IDs are both active in the same item — name both in the post-answer dissection. Logging stays singular: the step-(b) target structure is the `drill_result.structure`; the secondary ID is named in the dissection and may appear in `summary`, never as a second event.

---

## Worked Example (Quality Bar)

This example is original (not adapted from any published item).

---

**Domain:** higher education quality assurance  
**Target structure:** `proxy_mismatch`  
**Tier:** standard (5 options, no pre-teach)

---

**Situation:**  
Harwell Institute, a mid-sized professional school with 2,400 enrolled students,
introduced a mandatory peer-feedback module in its postgraduate program three
years ago. Each student completes six structured peer reviews per semester.

**Evidence:**  
An internal audit found that 91% of students rated the peer-feedback module
"useful" or "very useful" in their end-of-semester survey. Completion rates
held at 97% across all three cohorts.

**Conclusion:**  
The peer-feedback module has demonstrably improved students' ability to evaluate
academic arguments.

**Stem:**  
Which option most weakens this conclusion?

**Options:**

(A) A follow-up study at two comparable institutions that adopted similar modules
showed no significant change in argument-evaluation scores on standardized
assessments after one year.
*(Key — `proxy_mismatch`: satisfaction and completion measure engagement, not the
claimed outcome of improved argument-evaluation ability; the follow-up evidence
shows the metric does not track the claim.)*

(B) The module's completion rate would have been higher if participation were
truly voluntary rather than mandatory.
*(`irrelevant_comparison` — compares completion across participation regimes — a comparison that never touches whether skills improved.)*

(C) Several faculty members who designed the module also administered the
satisfaction survey.
*(`true_but_irrelevant` — raises a procedural concern about survey integrity, but
does not address whether the skill outcome was achieved.)*

(D) Harwell Institute's postgraduate enrollment grew by 18% over the same three
years.
*(`out_of_scope` — enrollment growth is topically adjacent but has no logical
bearing on whether the module improved argument evaluation.)*

(E) Students who completed more than the required six peer reviews per semester
reported higher satisfaction scores.
*(`weak_proxy_trap` — offers more activity and satisfaction data dressed as outcome evidence; tempts by sounding like confirmatory evidence when it only deepens the proxy problem.)*

---

**Post-answer dissection (shown only after commitment):**

Key: **(A)**

The conclusion claims the module improved a specific cognitive skill. The evidence
measures satisfaction and completion — activity and attitude proxies, not skill
outcomes. Option (A) directly attacks that gap: an external study using an actual
skill measure found no effect. Structure: proxy mismatch (logged as `proxy_mismatch`).

Distractor logic (plain labels in the session language; IDs shown here for authoring reference):
- (B) irrelevant comparison — compares completion across participation regimes; a comparison that never touches whether skills improved.
- (C) true but irrelevant — survey integrity concern, not a skill-outcome attack.
- (D) out of scope — enrollment numbers never engage the evidential gap.
- (E) weak proxy trap — more activity and satisfaction data dressed as outcome evidence; reinforces the mismatch rather than exposing it — it adds activity data without attacking the conclusion.

Transferable structure: proxy mismatch — the metric measured is not the outcome
actually claimed; activity or satisfaction stands in for the real result.
