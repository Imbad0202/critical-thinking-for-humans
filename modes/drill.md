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

### 2. `weaken`

Find what most undermines the argument. The gap is always one of the five
causal attacks: `alternative_cause`, `reverse_causation`, `coincidence_timing`,
`sample_selection`, `proxy_mismatch`. Name the attack after giving the answer.

### 3. `sufficiency`

Judge whether the evidence licenses the conclusion. Note:
"cannot be determined" is a legitimate and rewarded answer — never a weak one.
Choosing it correctly when evidence is genuinely insufficient is the skill being tested, not a fallback.
Canonical structure ID for this type: `evidence_sufficiency` — log hits and misses under that ID.

---

## Item Generation Pipeline

Execute in order before presenting any item.

**a. Read domain + difficulty from the active profile (intake answers or passport).**
Pull the user's registered domain and current tier (intro / standard / advanced).

**b. Pick a target structure.**
Weight toward the user's miss-log weak spots (highest miss rate first). On cold
start (no miss log), rotate through the structure list.

**c. Build the fixed logical skeleton.**
Construct: situation / evidence / conclusion / ONE pre-designed gap. The gap is
the target structure. The skeleton must be fully resolved before any domain
wrapping begins — no post-hoc gap hunting.

**d. Wrap in domain with novel anchors.**
Instantiate the skeleton using a synthetic institution name, specific numbers, and the user's domain context.

**e. Write the stem in plain language.**
Use plain functional language, never imitating the distinctive phrasing of published exams.
Standard stems like "Which option most weakens this conclusion?" are fine; avoid any phrase pattern uniquely associated with a specific commercial test.

**f. Build four distractors from the distractor menu (shared/structures.md).**
Assign each distractor a pattern ID from the distractor menu. Add a one-line
internal note (not shown to the user) on why that distractor tempts — what
makes it feel correct. Internal notes are never displayed when the item is presented; they appear only in the post-answer dissection.

**g. Reverse-solve check.**
independently re-solve the item; if a second defensible answer exists, discard and regenerate.
Re-solve with fresh eyes: evaluate each option against the item's structure taxonomy in turn, WITHOUT reference to the already-assigned key — an option survives if a competent solver could defend it. If a second option survives, discard and regenerate from step (c).

**h. Memorization self-check.**
Could this item be recognized as or confused with any published test item?
If yes, discard and regenerate from step (b).

---

## Session Flow

1. **Present item.** Show situation, evidence, conclusion (and options at
   standard/advanced tier; at intro, pre-teach the target structure vocabulary
   before showing the item).

2. **Commit gate.** the user commits an answer before any analysis is shown.
   No hints, no analysis, no commentary on the options — silence until commitment.

3. **Full dissection.** After commitment:
   - State the key and whether the user's answer was right or wrong (redline 4:
     a wrong answer is never called right).
   - Explain why the key holds: map the key option onto the logical skeleton.
   - For every distractor (all options except the key): explain why it tempts, and name its distractor
     pattern ID (e.g., `out_of_scope`, `premise_restatement`).

4. **Name the skeleton.** name the transferable structure by its canonical ID
   and state its domain-general shape in one sentence. Example: "`sample_selection`
   — the sample excludes the cases most likely to refute the claim."

5. **Log to passport.** Record hit or miss for the target structure ID.

---

## Speed-Bump Items

Some items are engineered to bait the intuitive (System 1) answer. If the user
misses: run the four-step reveal from shared/scaffolding.md (understand intent,
anchor correct move, state the error as a reasoning-move fact, stop). Then state:
"The trap is engineered — the item is designed to bait intuitive answers, not to test this person specifically." Locate the error in the reasoning move, not the person.

---

## Difficulty Knobs

| Tier | Options | Pre-teach | Gap clarity | Announcement |
|------|---------|-----------|-------------|--------------|
| intro | 3 | Yes — introduce the target structure's vocabulary before the item | Single, explicit | Item type named |
| standard | 5 | No | Single | Item type named |
| advanced | 5 | No | Subtler; compound flaws allowed (two structure IDs) | Item type NOT announced |

At **advanced**: compound flaws means two structure IDs are both active in the same item — name both in the post-answer dissection.

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
skill measure found no effect. Structure: `proxy_mismatch`.

Distractor logic:
- (B) `irrelevant_comparison` — compares completion across participation regimes; a comparison that never touches whether skills improved.
- (C) `true_but_irrelevant` — survey integrity concern, not a skill-outcome attack.
- (D) `out_of_scope` — enrollment numbers never engage the evidential gap.
- (E) `weak_proxy_trap` — more activity and satisfaction data dressed as outcome evidence; reinforces the mismatch rather than exposing it — it adds activity data without attacking the conclusion.

Transferable structure: `proxy_mismatch` — the metric measured is not the outcome
actually claimed; activity or satisfaction stands in for the real result.
