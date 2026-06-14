# Changelog

All notable changes to critical-thinking-for-humans are documented here. Headings
follow `## [X.Y.Z] - YYYY-MM-DD`; the latest versioned heading must equal the
git tag being cut (enforced by `scripts/check_version_consistency.py`).

## [1.0.1] - 2026-06-14

Research-grade hardening after cross-model critique. No behavior change to the
four modes; this release sharpens honesty and adds manifest-validity CI.

- **Manifest parse fix.** `SKILL.md` (root and the claude-ai overlay) wraps its
  `description` in a `>-` block scalar so the embedded `Triggers:` colon is
  literal text. The prior unquoted value parsed as a second YAML mapping key and
  failed strict parsers and marketplace frontmatter validation.
- **New `scripts/check_manifests.py` + CI** (pre-build and post-build): parses
  every SKILL.md frontmatter, `plugin.json`, `marketplace.json`, and the
  SKILL.md inside the shipped zip. A missing root manifest, an absent zip
  member, or an unclosed frontmatter line now fails the gate.
- **Honest positioning.** The transfer claim is stated as the open hypothesis it
  is (grounded in the contested far-transfer literature and a moderate,
  heterogeneous meta-analytic effect), not a settled result. The README and
  `modes/drill.md` now state plainly that a drill key is written and self-audited
  by one model with no independent sign-off.
- **Drill challenge window.** A new Session Flow step: after the dissection the
  coach stops, invites a challenge to the key, and resolves it before the
  passport write, so a key it cannot defend on the merits never enters the
  longitudinal stats. Locked by the invariant lint.
- **`docs/evals/`** evidence framework (templates only): the headline metric is
  cross-model agreement, not single-model self-scored accuracy. No empirical
  effectiveness claim until a result file exists.
- README prose normalized (em dashes removed); invariant-locked sentences kept
  verbatim.

## [1.0.0] - 2026-06-14

First public release.

- Four modes: drill (judge stance), scene (Socratic stance, synthetic +
  BYOM), expedition (guide stance, verified packs only), detective
  (guide-and-judge stance, runtime-generated multi-layer case).
- Thirteen redlines, shared scaffolding (four-step reveal, safe words,
  stuck detection), twelve canonical reasoning structures (seven causal-inductive
  + three statistical: base_rate_neglect, regression_to_mean, simpson_paradox
  + two formal/inductive: circular_reasoning, hasty_generalization),
  manipulation-recognition domain with taxonomy.
- **Scene fallacy-recognition track** — a second, isolated track inside scene
  for five formal/persuasive fallacies (false dilemma, ad hominem, strawman,
  fallacious appeal, equivocation) the frame palette cannot key. One submode per round
  (frames stay never-ranked; the fallacy track judges argument *form*, not the
  position). Three rulings — `fallacy` / `not_fallacy` / `insufficient_context` —
  with a mandatory per-lens defect test (relevance for ad hominem/appeal,
  omitted-option/fidelity/term-stability for the others) and a reverse-guard so a
  sound argument is never mislabeled a fallacy (redline 4 applied directly).
  Synthetic-first material, charitable reconstruction before any political
  strawman ruling, `scene_process.fallacies_examined` logging, Gate 10 probes.
  Independently reviewed before implementation, all findings addressed.
- Local passport (`~/.ct-gym/events.jsonl`) plus claude.ai platform overlay
  and zip build.
- Expedition packs (16, cross-domain). Phase 1-2: boolean-pythagorean-triples
  (combinatorics/SAT), katago-adversarial (games/ML robustness),
  alphatensor-matmul (algorithms), erdos-discrepancy (number theory;
  machine-vs-human-proof contrast), keller-dimension-7 (geometry, ACL2
  formally-verified), alphafold-casp14 (structural biology; first forecaster
  pack). Phase 3: busy-beaver-5 (computability; first climber pack, Coq),
  alphaproof-imo-2024 (formal-ML; Lean, audits the silver-medal framing vs
  three-day compute), lams-problem (design theory; audit a nonexistence
  result), chromatic-number-plane-5 (geometry; forecaster on a lower bound
  whose parent problem is still open). Phase 3 remainder: schur-number-5
  (combinatorics; 2 PB proof), ramsey-4-5-hol4 (graph theory; belief vs
  kernel-verification), alphageometry-imo (geometry/ML; human-readable vs
  machine-formal), pentago-solved (games; strongly solved, climber), plus two
  contested-by-design packs — funsearch-cap-set (a lower bound on an OPEN
  problem, with the 2.2202 figure re-attributed to a human) and
  alphaevolve-48-mult (48 multiplications but only over the complex numbers;
  Waksman 1970 did 46 over commutative rings). 16 packs total. Each
  first-party verified against its source — re-verification caught the
  survey's wrong ~1 TB / CRAY figures for Lam's problem and confirmed the
  AlphaEvolve 48 is complex-only. Pack discovery by `pack_id`, runtime pack
  boundary, Gate 8 behavioral probes. Every numeric claim re-verified against
  its source before commit; the candidate pool in
  expeditions/ROADMAP.md is now exhausted.
- Drill quality floor for weak models: per-structure slot templates (step c),
  a mandatory option-audit table before release (step g — discard, never
  patch, on any partial-merit distractor), and a weak-model fallback ladder
  (step g2 — degrade then refuse rather than ship a muddled item).
- Legal-exposure hardening (independently reviewed, no high-risk issue found):
  disclaimer now disclaims Anthropic affiliation, states
  example names are fictional, adds an efficacy non-guarantee and an
  educational-use / non-advice clause; SKILL.md gains an all-modes Scope
  boundary (no legal/medical/financial/psychological/safety advice) synced to
  the claude.ai overlay; one KataGo pack phrase tightened to stay within its
  cited source.
- Verification harness: invariant lint (section-scoped), pack schema lint,
  verbatim-block sync, version-consistency lint, mutation tests, CI.
- Detective mode (the fourth mode): a single runtime-generated case worked as
  a multi-layer escape room — 2 layers (intro) / 4 (standard, advanced), one
  main flaw per layer in v1, 0-N eggs, and a single-line key chain where each
  layer's solution yields a concrete fact the next layer's lock needs. Built on
  reverse-design generation (keys first, material last) with a G2 ablation gate
  (hide the prior key, prove the next lock is underdetermined), a G0 frame
  stipulation (claim / success criterion / decision standard / evidence frame)
  that keeps judging off value frames (redline 1), a mechanical-vs-soft
  pre-flight, and an inspect-before-rule stance so a correct user objection is
  never auto-ruled a false positive (redline 4). New `detective_process`
  passport event (+ claude.ai tally), Gate 9 behavioral probes, and a README
  note recommending an opus-class or stronger model. Independently reviewed
  before implementation, all findings addressed.
- **Detective generation silence** — the G0–G6 reverse-design (key chain,
  per-layer answers, ablation, eggs, final truth) is internal-only and never
  reaches the visible chat: the first user-visible message begins directly with
  the case frame, no preamble of any kind — no generation summary, no layer
  count, no pipeline-existence announcement. The four case-frame facts are the
  only G0 content shown; keys/eggs/final truth surface solely through the
  per-layer loop as each layer resolves. New `Gate 9F` leak probe verifies this
  on a fresh session (a static invariant pass is not sufficient — it requires the
  live behavioral run).
