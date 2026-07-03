# Expedition Pack Schema

A pack is one curated impossible-tier problem with a verified solution,
authored offline. Packs are the only fuel expedition mode accepts
(modes/expedition.md: No Pack, No Expedition). This file is the authoring
spec; it ships with the repo, not with runtime builds.

---

## Required Fields

- `pack_id` — slug, stable across revisions.
- `problem` — full statement, plus an accessibility note: what background the
  user needs to follow the expedition at all.
- `history` — how long the problem stayed open, who posed it, what the
  community tried. Known dead ends are first-class teaching material: list
  each with WHY it fails, not just that it does.
- `solution_provenance` — where the verified solution lives (publication or
  verified writeup), its date, and HOW it was verified: peer review, formal
  proof check, independent replication. A pack without provenance is invalid.
- `step_graph` — the solution decomposed into ordered, independently checkable
  steps; each step tagged with the discipline it exemplifies
  (modes/expedition.md, The Six Disciplines).
- `breakthrough` — which step is the breakthrough, and a one-sentence account
  of why it eluded the community for as long as it did.
- `audit_targets` — for the auditor role: the 3–5 load-bearing steps worth
  probing, each with the strongest known objection and that objection's
  resolution.

---

## Role-Conditional Fields

`audit_targets` is auditor-shaped: it carries the objection/resolution a probe
turns on. A forecaster pack asks the user to *predict* rather than probe, and
the grading it needs — what forecast counts as well-calibrated, over-confident,
or under-confident — has no auditor field to live in. Without it the coach must
improvise the grade, in a mode whose core rule is no improvisation beyond pack
content.

- `calibration_key` — **required when the pack declares a forecaster role fit**
  (the pack states it is a forecaster exercise, e.g. alphafold-casp14,
  chromatic-number-plane-5); omit otherwise. Per forecast target (`- **F<n>`),
  three parts: the **calibrated** answer band (the range or claim a
  well-calibrated forecast lands in), what an **over-confident** forecast looks
  like, and what an **under-confident** one looks like. This is the scoring
  rubric the coach reads instead of inventing; the forecast *prompts* stay in
  `audit_targets`, the *grading* lives here. The band is stated as a range or
  a "credit for / miscalibrated if" pair, never a single point answer that
  collapses calibration back into right/wrong.

Climber packs (busy-beaver-5) need no analogous field: the only knob is step
size, which the step_graph already carries, and there is no forecast to grade.

---

## Authoring Rules

- Solved problems only — verified solutions, never open conjectures. An open
  problem cannot be guided honestly; the guide would be improvising, and
  improvised expeditions are forbidden.
- First-party verification before authoring: the author has read the actual
  solution source, not a press summary of it. Press accounts of "AI solved X"
  are regularly wrong about what was solved and by what means.
- Original prose throughout; cite the source, never reproduce its text
  (redline 6's principle applied to research literature).
- Every step must survive scene mode's material pre-flight (modes/scene.md,
  Non-Social Material).
- Dual-use check before publishing a pack: the step graph teaches reasoning
  disciplines, not capabilities. A pack whose content is itself hazardous
  (regardless of pedagogical frame) is not authored.
