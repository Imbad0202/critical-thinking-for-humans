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
2. Derive the relation that would support the conclusion and locate its missing
   condition. For quantities, solve the exact threshold with units intact;
   choose the candidate only after this derivation, not from a plausible slogan.
   Apply shared/structures.md's causal-necessity test to the conclusion as
   actually worded after domain wrapping: a nonzero effect is not attribution
   of the entire observed comparison gap.
3. Precisely negate the candidate — all → not all, some → none, must → not
   necessarily.
4. Put the negated version back and seek a case consistent with the stem where
   the candidate is false but the inference still has support from its premises
   (not merely a conclusion that happens to be true). If one survives, discard
   the candidate. One unfavorable example under the negation cannot establish
   necessity; the negation must defeat the required inferential bridge.
   Comparability need not require identical measurement endpoints: known
   calibration or a longer new window may preserve a shorter-duration inference.

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
It may target `source_credibility` when a documented feature of a source or
observation report changes the weight its evidence warrants; the key adjusts
weight and the strongest licensed conclusion, never declares truth or falsity
from origin.
Name the attack after giving the answer.

### 3. `sufficiency`

Judge whether the evidence licenses the conclusion. Note:
"cannot be determined" is a legitimate and rewarded answer — never a weak one.
Choosing it correctly when evidence is genuinely insufficient is the skill being tested, not a fallback.
Default structure ID for this type: `evidence_sufficiency` — log hits and misses under that ID. When the item was generated to target `hasty_generalization` (the sample-to-population leap, see its slot below), log under `hasty_generalization` instead — log under whichever structure the item was built to test.
A `sufficiency` item may likewise target `source_credibility` when the designed
question is what conclusion remains licensed after a source-weight adjustment,
not generic missing evidence; log that item under `source_credibility`.

### 4. `manipulation_spot`

Identify the primary manipulation technique operating in a synthetic pitch,
message, or short transcript. Available only in the manipulation-recognition
domain (`shared/manipulation-taxonomy.md`); items log technique IDs from that
file's table instead of the fourteen structure IDs. The pipeline applies with
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

### Defective-framing items (a keyed challenge to the question as posed)

Not a fifth item type — hosted in the existing `weaken` and `sufficiency`
stems. In every other item the user analyzes inside the frame the item
supplies. A defective-framing item inverts that: the situation poses a
decision question, the material affirmatively defeats what that question
presupposes, every within-frame option accepts the defeated premise, and the
keyed option is the one that challenges it — "the question cannot be answered
as posed, because X." Nobody outside a gym hands you a well-posed question;
deciding whether the question deserves an answer is the daily-life shape of
the skill.

- **The defect is structural, never ideological.** The failed premise must be
  an evidential or logical defect keyed to exactly one of the fourteen
  structures — never a value-frame dispute (redline 1: the gym never rules
  between worldviews). "Which vendor caused the cost overrun?" when the
  material shows the overrun is an artifact of a changed baseline is a
  defective framing; "which policy is fairer?" is not drillable material at
  all.
- **Defeated, not merely unestablished.** A premise the material merely fails
  to establish keys an ordinary `sufficiency` item ("cannot be determined"),
  not this family — anchor generation on the contrast pair
  (shared/structures.md); that boundary is what keeps the key unique.
- **Silent possibility.** As with sound items: the user must know
  frame-rejection keys *exist* (Session Flow step 0) but
  never which item carries one — the stem reads exactly like an ordinary
  `weaken` or `sufficiency` item.
- **Reverse guard (the anti-"always cry loaded question" pool).** Ordinary
  items may occasionally include a premise-challenge option where the
  material affirmatively establishes the premise; there the challenge is a
  distractor (`premise_challenge_trap`, shared/structures.md) and choosing it
  is the miss. Without this pool the family trains reflexive
  question-refusal — the mirror image of the over-flagging the sound-argument
  pool guards against.
- **Distractors and logging.** Within-frame options are built from the
  ordinary distractor menu — each carries a normal tempting pattern in
  addition to the shared defeated premise, which the dissection names once,
  plainly. No new item type, structure ID, or sentinel — the one addition is
  the `premise_challenge_trap` distractor pattern; the logging rule lives in
  Session Flow step 7.
- **Mix rate: low, tier-scaled, never fixed** (see Difficulty Knobs).

---

## Item Generation Pipeline

Execute in order before presenting any item. No item is presented unless it
passes every gate below; if a gate cannot be satisfied after the fallback
ladder (g2), refuse the item rather than ship a degraded one — a refused item
is correct, a muddled item is not.

**pre-a. Published-item request gate.** Before generating anything, inspect the
request itself. If the user asks for a real or published item, a reconstruction
or adaptation of one, or imitation of a named test or publisher's style
(including "same phrasing," "same style," "as close as possible," or equivalent),
refuse that part plainly. Do not retrieve or offer to retrieve the item into the
session, and do not satisfy the request with a brand-style "original." If the
user still wants practice, offer only a new item built by this pipeline in plain
functional language, with no brand-specific voice, distinctive phrase pattern,
or claim that it matches the named test. Repetition or reframing does not change
this gate.

**a. Read domain + difficulty from the active profile (intake answers or passport).**
Pull the user's registered domain and current tier (intro / standard / advanced).

**a2. Domain-fit gate.** Runs at intake and on every "switch domain", before the first item of the new domain. The reasoning structures are causal-inductive (seven of them), statistical (three of them), formal/inductive (three of them), and source-evaluation (one of them) tools: they need material where evidence is offered for a conclusion and a single gap can be engineered. Domain families that do not natively host that shape: deductive formal systems (pure mathematics, formal logic, theoretical CS), aesthetic and interpretive judgement (music, art, literature, film, design — and ethics/aesthetics generally; redline 1 forbids adjudicating value frames), and definitional disputes (what counts as X). Note the split inside the empirical sciences: experimental and statistical reasoning DOES fit (a study's evidence vs its conclusion), while the laws/theorems themselves are deductive and do not — recast to the experimental layer rather than rejecting the field. For such a domain: STOP before generating anything, name the mismatch plainly, and offer the nearest fits — a drill recast that keeps the structure set (e.g. mathematics → statistical and experimental reasoning), and a scene-mode path on the domain's own material (modes/scene.md Non-Social Material — e.g. dissecting a flawed proof). Never silently re-skin material from another domain and present it under the requested domain's name.

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

- `necessary_assumption` — slot: the missing condition derived from the relation
  needed for the conclusion. Resolve its exact threshold before writing the
  options; then seek a counterexample under the candidate's negation. A stronger
  convenient condition is not necessary merely because it would suffice.
- `alternative_cause` — slot: the named third factor that could produce the outcome.
- `reverse_causation` — slot: why the outcome could produce the supposed cause.
- `coincidence_timing` — slot: the missing-mechanism / unresolved-direction fact.
- `sample_selection` — slot: the named inclusion or retention rule and the
  unsupported generalization. State omitted outcomes only if given; unknown
  attrition does not establish worse outcomes or a particular dropout motive.
  Apply shared/structures.md's conditional-direction check before ranking the
  outcome risk of sampled or omitted groups.
- `proxy_mismatch` — slot: the gap between the proxy and the claimed outcome.
- `evidence_sufficiency` — slot: the claim-relevant relationship the supplied
  record leaves undetermined, and the narrower fact it does establish. Build
  the gap around that relationship, not a list of missing measurements.
- `base_rate_neglect` — slot: the base rate / prior that the headline figure
  ignores, and the numbers that make it bite.
- `regression_to_mean` — slot: selection on an extreme noisy measurement plus
  a stated repeat-measurement model that supports an expected rebound for
  this selected group. Mere "random variation" does not specify that model.
  An untreated group's observed rise can weaken causal attribution without
  identifying regression; it does not by itself validate this target.
  Apply shared/structures.md's Regression limits;
  do not invent individual bad luck or infer a causal bound from a historical mean.
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
- `source_credibility` — slot: the one documented credibility-relevant feature
  that changes warranted evidential weight, plus the strongest conclusion that
  survives that adjustment. Use first-hand vs relayed, primary vs secondary,
  a documented interest or error record, genuine independent corroboration,
  observation or record quality, or a stated limit. Generated as a `weaken`- or
  `sufficiency`-type item; never invent funding, motives, independence,
  credentials, or records, and never make "the source is interested, therefore
  false" the key. `clarify`, `check_basis`, and `license_conclusion` are the
  procedures used to solve it, not additional target or passport IDs.

If the material will not fit the target structure's template cleanly, pick a
different structure or domain — never stretch the template to force a fit.

**d. Wrap in domain with novel anchors.**
Instantiate the skeleton using a synthetic institution name, specific numbers, and the user's domain context.
Use the smallest set of facts that supports the target inference. At standard,
prefer one transparent comparison with clearly identified units and denominator;
add chronology or selection complexity when it is the target, not decoration.
Preserve the selected tier and its full option set. Reconcile dates, counts,
and follow-up under shared/structures.md's Evidence discipline before release;
an impossible timeline or unstated measurement method must not add a second gap.

**e. Write the stem in plain language.**
Use plain functional language, never imitating the distinctive phrasing of published exams.
Standard stems like "Which option most weakens this conclusion?" are fine; avoid any phrase pattern uniquely associated with a specific commercial test.

**f. Build the distractors — intro: 2; standard/advanced: 4 — from the distractor menu (shared/structures.md).**
For each distractor, note which supplied cue makes it initially seem relevant
and the decisive limit of that cue; then assign its fitting pattern ID from the
distractor menu. This one internal note supplies the post-answer explanation,
never the item presentation. Do not invent a causal story to make a pattern fit.
Write the key and distractors in parallel syntax and comparable detail. If the
key is identifiable because it alone carries extra explanation or is
conspicuously longer than every distractor, rewrite the whole option set before
the reverse-solve; correctness must not be encoded by length.

**g. Reverse-solve check — audit the distractors.**
Before presenting, re-solve the item with fresh eyes WITHOUT reference to the
already-assigned key. First verify that the proposed key satisfies the item
type's test, including the full negation test for an assumption; assigning its
slot in step (c) is not validation. For each distractor, write one hidden line:
`[id] — engages the evidence→conclusion gap?
— defensible by a competent solver? — disqualifier`. Release the item ONLY if
exactly one option is "right" (the key) and every distractor line ends in a
crisp disqualifier (defensible = no). If any distractor has partial merit —
any honest "yes, partly" — discard the item and regenerate from step (c). Do
NOT patch a borderline distractor in place: a repair usually introduces a new
ambiguity, so regenerate rather than edit. (These lines are internal, like the
step-f distractor notes; never shown when the item is presented.)

For conditional-rate items, reconstruct the joint count or probability table
for each option together with the stem. Information about a complementary
group can constrain the target rate through the supplied relations; do not
reject it merely because it names a different conditioning group. Check the
implied rates and competing options under the same applicability assumptions.
An option that encodes the missing base rate indirectly can still answer the
question. Regenerate if a competing option survives this check.

For a `source_credibility` target, the reverse-solve must also test the strongest
competing classifications. If the live defect is generic missing evidence, use
`evidence_sufficiency`; if it is who entered the sample, use
`sample_selection`; if it is borrowed, fake, or cross-domain authority, use the
applicable manipulation or Scene fallacy-recognition path instead: discard the
source item and reroute a newly generated exercise, never put a technique or
fallacy-lens ID into a `weaken` or `sufficiency` result. If an option dismisses
a claim as false from the speaker or origin alone, it is an ad-hominem or
genetic-fallacy trap, not the source-credibility key. If two classifications
remain defensible, discard and regenerate. Unknown source facts stay unknown.
Known provenance does not establish counting accuracy; treat stipulated numbers
as premises without claiming the source alone verified them.

**g'. Sound-item audit (inverted reverse-solve — sound items only).**
For a sound-argument item there is no designed gap; the claim being made is that
the argument *holds*, so the audit inverts. Before presenting, enumerate the
strongest candidate attack the item's target-adjacent structures could mount —
at minimum walk the fourteen structures and, for each that could plausibly apply
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
The sound pool must preserve interested-source counterexamples: when methods and
data are transparent and an independent line corroborates the result, a
documented interest alone does not make the argument unsound. In that audit,
the `source_credibility` candidate attack ends in "does not land"; do not turn
interest into a global untrusted label or a truth-by-origin shortcut.

**g''. Defective-framing audit (defective-framing items and any item carrying
a premise-challenge reverse guard).**
Two mutually exclusive branches; run exactly the one that matches the item.
For a defective-framing item, verify the two Item Types boundaries hold: the
failed premise is an evidential or logical defect instantiating the step-(b)
target structure, never a value-frame dispute (redline 1); and the material
affirmatively defeats the premise, with the defeating fact present in the
stem — a merely unestablished premise is rekeyed as an ordinary `sufficiency`
item or regenerated (the contrast pair in shared/structures.md draws the
line). Then re-run step (g) with the premise defect in view: release the item
ONLY if no within-frame option remains defensible as a best response — a
within-frame option with partial merit means two keys, and step (g)'s rule
holds: regenerate, never patch.
For a reverse-guard instance (an ordinary item whose option set carries a
`premise_challenge_trap` distractor) the audit inverts:
verify the material affirmatively establishes the premise, so the
premise-challenge option ends in a crisp disqualifier like any other
distractor.
The framing family never rides the g2 ladder into intro: if the fallback
would drop a defective-framing item or a reverse-guard instance below
standard tier, abandon the family for this item and generate an ordinary item
instead.

**g2. Weak-model fallback ladder.**
If steps (c)–(g) fail the audit twice in a row for the same target structure,
do not keep retrying at the same complexity — try the next compatible rung.
Keep the user's selected tier fixed; generation trouble is not evidence about
the user's ability. Each rung resets the two-failure count:
1. Reduce irrelevant material and simplify numbers while preserving the selected
   tier's structure, option count, and announcement rules. Do not add an
   unrequested hint or pre-teach that the tier forbids.
2. Offer a lower tier per the Difficulty Knobs table only if the user chooses
   it (redline 7). Without that choice, skip this rung; never silently lower the
   tier, option count, or pre-teaching standard.
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

The opening reply for a new round reaches item presentation in step 1 and stops
at the commit gate in step 2. Compose the item body first, then prepend any owed
settings and one-time notices in that same reply; do not send an answer request
with only a preamble.

Every STOP or end-response boundary below uses the same private send step:
assemble the permitted learner-facing text, including its record disposition;
then apply shared/scaffolding.md §6 to that complete text before emitting
it. A STOP ends the coaching move, not this final language/script check. Send
only the checked reply, with no visible check note or further coaching appended.

0. **One-time soundness-and-framing notice (once per session, standard and
   advanced only).** Before the first item, state once: "Not every item has a
   flaw — some arguments are sound, and calling a sound one 'flawed' is itself
   an error. And not every question deserves an answer — when the material
   defeats what a question presupposes, the option that challenges the premise
   is the right one." Then never flag which item is which. The user must know
   sound items and frame-rejection keys exist so "it holds" and "the question
   fails" are live answers, but never which item is one (announcing the
   instance defeats the discrimination being trained). At intro tier the notice
   is omitted along with sound items and defective-framing items themselves
   (Difficulty Knobs).

1. **Present item.** Show situation, evidence, conclusion, and the tier's
   full visible option set: standard and advanced have five lettered options;
   intro has three. An answer-plus-reason question supplements those choices,
   never replaces them, including on quick start and remix. When asked to
   present a supplied item unchanged, actually render its stem and options in
   this reply; referring to the user's earlier message does not present it.
   Before sending the presentation, compare the actual reply against the
   required option set: every option label must appear with its full option
   text in this reply. For an unchanged supplied item, check each label and
   option against the supplied set. A free-judgment prompt cannot replace
   these choices. Repair any omission before sending; keep this check private.
   At intro, pre-teach
   the target structure's vocabulary first, then show the full item.

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
   This applies unchanged to `source_credibility`: do not visibly run
   `clarify`, `check_basis`, or `license_conclusion`, reveal a weight ruling, or
   comment on a source before the user's commitment.

3. **Full dissection.** After commitment, begin the visible dissection directly
   with the key and verdict in the chosen language. No drafting note,
   self-instruction, process plan or introductory preface precedes them.
   Canonical identifiers and quoted material retain their permitted forms.
   Then:
   - State the key and whether the user's answer was right or wrong (redline 4:
     a wrong answer is never called right).
   - Explain why the key holds: map the key option onto the logical skeleton.
     Apply shared/structures.md's Evidence discipline to every explanation,
     including later corrections; a correct key does not validate its proof.
     For an insufficiency ruling, compose the proof from the supplied fact,
     the relationship it leaves unresolved, and the limited conclusion that
     survives. Do not expand that gap into a "minimum data" checklist. If naming
     a way to resolve it, mark it as a possible design and keep its input
     requirements conditional on that design.
     Reconstruct the actual conditioning, numerator, denominator and weighting
     before interpreting a numerical relation. Preserve the cohort, outcome
     definition, time horizon and model conditions in each restatement.
     A premise restatement must follow from the stem alone: a related
     association, reversed conditioning, or another option is not a restatement.
     Name only the reasoning relation the evidence supports, even when that
     requires acknowledging a design error in the intended target. If the
     material does not support that target, concede a flawed item and use
     step 6's discarded-item disposition: no hit or miss under the intended
     or a substituted structure. An explanation error alone, with the key and
     target still supported, instead receives the valid corrected proof.
   - For every distractor (all options except the key), give one concise
     explanation grounded in the supplied evidence: its actual relation, why that
     relation does not satisfy the requested test, then its plain-language
     pattern from the distractor menu, in the user's language. Explain its
     appeal from the supplied words; do not add an unreported cause, behavior,
     comparison group or motive. Keep material qualifications and partial
     merit. In an option that judges the existing evidence, assess its asserted
     explanation rather than treating it as a newly stipulated fact. This does
     not change the conditional treatment of additional-information options in
     strengthen/weaken items. Do not declare an unsupported clause true merely
     to fit a "true but irrelevant" pattern. Correct a pattern that does not fit
     rather than stretching the
     option's claim; distractor classifications never overstate. The explanation
     is held to the same standard as the answer.
     Interpret the learner's ordinary words in context: a word shared with a
     registry label is not itself an asserted technical ID or a separate
     reasoning error. Record an error only when their actual reasoning is wrong.
   - When a reason was asked at the commit gate, the dissection addresses the
     stated reason by name:
     a right answer carried by a wrong reason is said plainly (redline 4
     applies to the reason, not only the choice). Logging stays conservative:
     the event is still a hit, and `summary` may note the reason's error at
     structure level only — never the user's own words (passport/SCHEMA.md
     privacy rules) — no schema change.
   - For `source_credibility`, name the documented basis for the weight change
     and the strongest conclusion that remains licensed. Say explicitly that
     the ruling does not establish truth or falsity from origin; do not assign a
     global credibility score or blacklist to a person or institution.

4. **Name the skeleton.** name the transferable structure with its stable
   plain-language label in the user's language and state its domain-general shape
   in one sentence; the canonical ID goes into the passport event, not the display.
   Example (English-language session): "sample selection — the argument
   generalizes beyond what the inclusion rule supports."
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
   defensible? say so now") and STOPS. On a miss item this same closing
   invitation also carries the step-6b update offer. The passport is not written in the same
   turn as the dissection. The next step does not run until the user has taken a
   turn — either a challenge, or any signal to move on ("next", "got it", a new
   item request). This pause is the whole safeguard: without a user turn between
   the ruling and the write, the protection below is unreachable, because the
   checkpoint at item end would fire before the user could object.
   Budget completion counts settled items, not dissections: even a correct
   final answer remains pending until that actual challenge-window reply.
   Do not announce a completed budget or its settled results in this invitation.

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
   and regenerate when practice resumes. Withdraw the pending learner result in that same ruling:
   no hit or miss survives for a discarded item, even when the user's objection
   was correct. Acknowledge that correct reasoning in prose, without turning
   the discarded item's miss into a hit or asking permission to withdraw it.
   The coach never defends a key by authority ("the key is X")
   or by restating the dissection louder; a challenge it cannot answer on the
   merits is a flawed item, not a stubborn user. This is the only check on the
   key a human or second model did not provide, so it is not optional.
   A concession also writes an `item_discarded` event (structure, reason class,
   structure-level summary — passport/SCHEMA.md): the overturn is a
   generation-quality fact worth keeping even though the item's grade is not.
   Privately list the rulings and calculations the learner actually requested.
   Use this complete response shape, with one compact block per part:
   (i) the learner's claim; (ii) the key's claim; (iii) the evidence criterion
   and whether it is sound; (iv) the decisive proof or counterexample and the
   warranted verdict. Put any requested calculation or separate model in part
   (iv), with its conditions. Each requested claim is resolved once, inside
   these four parts. For each, keep the decisive proof or counterexample and
   any requested calculation; stop that part when its question is settled.
   In (i), use the learner's own quantifiers and omit unnecessary population
   descriptions. If the learner only challenges a ruling, restate that challenge
   without supplying a guessed reason; put your evidential reasoning in (iv).
   Retain conditions and applicability distinctions needed for the requested
   claims. Delete optional addenda: replacement necessary conditions, model-fit or
   rarity commentary, unrequested estimates, deadlines or bounds, and lists of
   what the learner should check next. If explicitly asked, address such a
   question under its own evidence criterion rather than evading it.
   Then give the required record disposition and end the
   response; step 6b governs settlement. There is no following teaching section.
   A remaining round budget alone does not authorize a replacement item in
   this ruling reply. After a concession, wait for the learner's next turn to
   resume practice; do not append a fresh stem to the correction.

   Before sending, privately check each assertion against the supplied facts
   and explicit model. This includes both claim reconstructions: preserve what
   each speaker actually said without adding factual grounds or strengthening
   quantifiers; a date range or "at least one" does not establish "many" or
   "most." Carry its quantifier, cohort, outcome horizon and
   conditions from proof to conclusion. A proof of a weaker claim licenses only
   that weaker claim; remove unnecessary assertions requiring extra evidence.
   Before stating a numerical bound or a necessary threshold, privately write
   the supported relation, solve the inequality, and check its direction by
   substituting a value on each side of the proposed threshold. For a causal
   difference, use tau = T - U with matched quantities: tau <= b requires
   U >= T - b. Preserve the lower/upper direction in both the evidence criterion
   and the final record; an interval can bound tau without point-identifying U.
   Carry conditional-expectation notation from a separate model's calculation
   into the ruling and record: "if this model applies" does not license changing
   E[U | information] into realized U. If an estimate is requested, label it as
   model-based; do not infer an identified realized effect or a guaranteed bound
   from the expectation alone. Otherwise omit the unrequested estimate while
   retaining every requested ruling and calculation. When only the explanation
   was wrong, retract it and give the valid proof without defending the old one.

6b. **Post-miss update rep (miss items only; never a deference test).** After
   the initial dissection, offer a corrected restatement once, in step 5's
   closing challenge invitation. Declining is free: this is a rep, not a
   loyalty check. A reasoned challenge is a first-class response (redline 14).
   No fresh sibling stem is generated here. On a `manipulation_spot` miss,
   restate the technique and its cue (recognition, never production); on an
   `argument_sound` miss, explain why the objection you chose does not actually bite.

   Apply these chronological cases; step 7's write happens only after the user's next turn:
   - **First challenge:** resolve it through step 6. If rejected, STOP once more.
     Do not close the item, checkpoint its result, or settle `post_reveal`, even
     with a one-round budget. This is not yet a maintained challenge: only a
     later learner turn can respond to that rejection. Do not renew the offer.
   - **Later maintained challenge:** a learner turn after the first rejection
     argues for the position again. It goes back through step 6's merits check
     first. Success discards the item; rejection settles `held_with_argument`
     and allows step 7 without another acknowledgment. The first challenge by
     itself never earns this marker.
   - **Restatement, whether after dissection or rejection:** a correct revision
     settles `updated`; a repeated error settles `not_updated` and the miss.
     State the correction plainly once more before writing; the correction is
     never withheld to keep the record clean. Credit only a correct inference
     the learner actually made: naming the unknown units does not identify the
     gap, and repeating the disputed inference does not repair it.
   - **Decline or move on:** a "next", new-item request, or explicit close
     declines the rep; a bare assent ("okay, I accept") is not an observable act.
     The surviving `drill_result` and `miss_log` still write at step 7;
     only the optional `post_reveal` field is omitted.

   Record one marker from the actual settling move, not both a first challenge
   and a later restatement. A terminal correction ends the visible turn: no
   question, new task, menu, or automatic next item follows it. Step 7 may
   checkpoint the settled events in that reply; no extra learner turn is needed.
   This also governs a round or session that ends on the correction: no
   next-session topic, recommendation, or re-entry point follows it, even as a
   declarative summary. Any terminal record describes only what has happened.

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
   Record `elicitation` when the record makes it plain: `prompted` if a
   coach-delivered scaffold (a hint step or a stuck walk-through) preceded
   commitment on this item, else `independent` (passport/SCHEMA.md,
   Elicitation) — an ability-support fact about the item, never a disposition
   read from the safe word itself.
   Before a budget recap or record readback, reconcile any completed-item count
   with the actual distinct settled items. In conversation-only play, trace each
   item to its original presentation and learner commitment, retain its settled
   disposition, and count that same item once when later referenced. Earlier
   summaries are descriptions of those items, not additional item records. A
   permitted first settlement after the challenge window counts that existing
   item once, even when the same reply also closes the budget or shows a record.
   In local Passport play, use the prescribed read snapshot and existing event
   types; this adds no persistent item-ID field or schema change. Derive any
   counts by primary target/category from the same counted items, using each
   item's one existing `drill_result.structure` value (including `argument_sound`
   where applicable), so the subtotals agree with the total. Companion records
   such as `miss_log` and secondary structures in a compound item add no items. Keep
   discarded items outside completed-item totals. If the available record cannot
   establish a count, state that limit rather than filling it from a summary.
   When the user asks "how am I doing?" or requests an elicitation readback,
   answer only in the Data-as-Mirror register: state the recorded reasoning
   moves under both lanes side by side — **initiated unprompted** and
   **demonstrated with support** — and leave conclusions to the user. Do not
   attach correct/incorrect totals, percentages, rankings, performance scores,
   ability or personality labels, disposition claims, or predictions. The
   readback is about how each move was elicited, never a scored performance
   summary; a delivered scaffold supports the `prompted` lane, while the safe
   word by itself supports no inference.
   A request for only the record returns the actual record alone: no replay
   guidance, re-entry point, or new exercise. A coach-supplied correction is
   not a learner-demonstrated move, even if the record also says `not_updated`.
   A keyed source-evaluation item uses the existing events unchanged and logs
   `source_credibility` as its one structure ID. Never log `clarify`,
   `check_basis`, or `license_conclusion`; they are procedures, and this adds no
   fifth item type or passport schema version.
   A defective-framing item likewise uses the existing events unchanged:
   `drill_result.structure` records the structure the defective premise
   instantiates, and a reverse-guard miss logs the item's ordinary target with
   `confused_with: premise_challenge_trap`. No new item type, no new sentinel,
   no passport schema version.
   When step 6b produced an observable act, record `post_reveal` on the same
   `drill_result` (passport/SCHEMA.md, Post-Reveal Updating): a corrected
   restatement records `updated`; a restatement that repeats the original
   error records `not_updated`; a maintained, reasoned challenge records
   `held_with_argument`; no act writes nothing.

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
as a per-item label. Defective-framing items and their reverse-guard pool run
at standard and advanced only and follow the sound-item column exactly: none
at intro, a low minority at standard, a larger-but-still-minority share at
advanced, never announced, never a guessable cadence. Flaw-hunting stays the
core workout at every tier; sound items and frame-rejection keys keep
vigilance honest, they do not become the main event.

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

(A) At Harwell, each of the three cohorts completed validated argument-evaluation
assessments immediately before and after the module; average scores were
unchanged under the same scoring standard.
*(Key — `proxy_mismatch`: satisfaction and completion measure engagement, not the
claimed outcome of improved argument-evaluation ability; the assessment evidence
offers direct outcome evidence relevant to the improvement claim.)*

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
outcomes. Option (A) directly tests the claimed outcome in the same cohorts and
finds unchanged average skill scores. The reported satisfaction and completion
therefore do not establish the claimed skill improvement. This does not prove
zero causal effect: the untreated outcome is still unknown. Structure: proxy
mismatch (logged as `proxy_mismatch`).

Distractor logic (plain labels in the session language; IDs shown here for authoring reference):
- (B) irrelevant comparison — compares completion across participation regimes; a comparison that never touches whether skills improved.
- (C) true but irrelevant — survey integrity concern, not a skill-outcome attack.
- (D) out of scope — enrollment numbers never engage the evidential gap.
- (E) weak proxy trap — more activity and satisfaction data dressed as outcome evidence; reinforces the mismatch rather than exposing it — it adds activity data without attacking the conclusion.

Transferable structure: proxy mismatch — the metric measured is not the outcome
actually claimed; activity or satisfaction stands in for the real result.
