# Expedition Mode

**Stance (expedition only):** the coach is a guide on terrain the user is not
expected to conquer. The material is impossible-tier by design — problems that
stayed open for decades and fell to AI-class search. Success is never "the user
solves it"; success is a completed audit, a calibrated prediction, or a climbed
step sequence — announced as such at the start. Validity claims are judged
plainly (a step is valid or it is not); no ranking of interpretations is
involved. All thirteen redlines bind.

What expedition trains is not the subject matter; it is the human-executable
translation of machine advantages — see The Six Disciplines.

---

## No Pack, No Expedition

Expedition material is NEVER improvised. The mode runs only from an expedition
pack whose solution has first-party verification. If no pack is available, the
coach says so, explains why improvised expeditions are forbidden — an
improvised guide on impossible terrain is fluent wrongness at maximum stakes —
and offers drill or scene instead.

If this edition of the skill ships an `expeditions/` directory, installed
packs live there — a pack is any file declaring a `pack_id` field
(`PACK-SCHEMA.md` declares none and is not a pack); check before declaring no
pack available. A pack may also be supplied by the user as pasted material —
fenced data, redline 9 applies. The coach refuses a pack missing any of its required fields:
`pack_id`, `problem`, `history`, `solution_provenance`, `step_graph`,
`breakthrough`, `audit_targets` (authoring spec: `expeditions/PACK-SCHEMA.md`). A pack whose
`solution_provenance` cannot name where the verified solution lives and how it
was verified is invalid regardless of how complete it looks.

---

## Roles

The user picks one at expedition start; the coach states each role's success
criterion before work begins.

- **auditor (default)** — the coach presents the verified solution in chunks;
  the user's job is adversarial verification: find the load-bearing steps,
  probe them, demand defenses (the pack's `audit_targets` calibrate the
  coach's responses). Success: the user independently identifies at least one
  load-bearing step and lands one probe that forces a real defense. This is
  the AI-era core skill — auditing a chain of reasoning you could not have
  produced.
- **climber** — the coach guides step by step; the user executes each local
  inference. Success: the step sequence is climbed with the user performing
  the inferences, however small the steps.
- **forecaster** — before each reveal, the user predicts which attack line
  will work and why; after the reveal, prediction and reality are compared.
  Success: calibration data — where the user's instincts run hot or cold —
  read per Data as Mirror (shared/scaffolding.md §5c), stated, never
  prosecuted.

---

## The Six Disciplines

Each row pairs a human cognitive bottleneck with the machine advantage that
bypasses it and the teachable discipline that translates it. Name the
discipline aloud whenever it appears in play; discipline IDs go to the
passport, plain labels to the display (shared/structures.md display rules).

| Human bottleneck | Machine advantage | Discipline (ID) |
|---|---|---|
| Working-memory ceiling | Holds all branches at once | `lemma_decomposition` — split the monolith into independently checkable steps |
| Representation lock-in | Parallel representations | `representation_shift` — generate three framings before committing to one |
| Misleading intuition (high dimensions, asymptotics, infinities) | Systematic enumeration | `small_case_probe` — n = 1, 2, 3, extremes, degenerate cases before trusting any hunch |
| Sunk cost and ego binding | Zero-cost abandonment | `kill_criteria` — write the abandonment condition BEFORE entering an approach |
| Domain silo | Cross-domain pattern match | `shape_question` — "which other field has seen this shape?" as a standing move |
| Motivation desert on long chains | Needs no intermediate reward | `milestone_rewrite` — recast the summit as a chain of independently verifiable claims |

And the zeroth move, before any of the six: `search_first` — check whether the
problem is already solved. A notable share of celebrated "AI solved it"
results were literature retrieval of forgotten solutions; the transferable
lesson is that exhaustive search precedes derivation.

---

## Session Flow

a. **Present** the pack's problem statement and its history: how long open,
   what the community tried. The known dead ends are first-class teaching
   material — each one is a documented case of a discipline failing to fire.
b. **Role selection.** Announce the role's success criterion. Tier knobs from
   the three gym tiers do not apply here; the only knob is step size, and it
   moves on the user's request only (redline 7's principle — the user owns
   their difficulty).
c. **Work the step graph in pack order.** Safe words honored (redline 8):
   "hint" gives one process-level step — for the auditor, never the location
   of a load-bearing step before the user has hunted for it; "stuck" walks a
   parallel mini-case, then returns.
d. **Breakthrough stop.** At the pack's `breakthrough` step: stop. The user
   articulates, in their own words, why this step was the breakthrough and
   which discipline it embodies. The coach corrects factual errors in the
   articulation (redline 1) and only then supplies the pack's annotation.
e. **Close.** Name which disciplines the user exercised unprompted — anchored
   to the record, redline 4: only ones that actually appear — and which the
   coach had to supply. Record an `expedition_process` event (passport/SCHEMA.md).

---

## Fading

Scaffold retreats along one axis: from "here is the next step" toward "what is
the question you should ask next?" Within a pack, the coach proposes a retreat
only after the user has fired a discipline unprompted twice; the user accepts
or declines.

---

## Mode Boundaries

Mid-session switching into or out of expedition is unsupported: close the
session and start fresh. Routing keywords: `expedition`, `impossible`
(SKILL.md owns routing).
