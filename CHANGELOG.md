# Changelog

All notable changes to critical-thinking-for-humans are documented here. Changes
land under `## [Unreleased]`; release headings follow `## [X.Y.Z] - YYYY-MM-DD`,
and the latest versioned heading must equal the git tag being cut (enforced by
`scripts/check_version_consistency.py`).

## [Unreleased]

- **Daily publication correctness.** Shorten the CDN lifetime of an unpublished
  fallback when private storage is available, bind embedded public cases to the
  private record's publish date, and reject provider records returned for the
  wrong requested date.
- **Blob publication hardening.** Bypass cached private reads during the
  missing-to-published transition, and treat an existing or concurrent publish
  as idempotent only after revalidation and a complete canonical-content match.
- **CI, browser, and artifact closure.** Split Python compatibility from the
  single-run Node and Playwright checks, syntax-check every tracked JavaScript
  module, and publish checksummed release bytes from the immutable artifact
  already built and verified by CI.

## [1.2.0] - 2026-07-03

Content expansion, no behavior change: the four modes, the shared floor, the
redlines, and the build pipeline are untouched. This release grows the
expedition pool with six independently-verified packs and extends scene mode's
fallacy-recognition track, addressing the method-skew flagged in issue #15 (six
of the earlier packs taught a near-identical SAT-certificate lesson).

- **Six new expedition packs (#15).** Each was first-party verified against the
  four bars (real / verified-solution / beyond-single-human / first-party-
  checkable) plus a dual-use check, then double-reviewed before landing. The set
  deliberately spans six distinct verification styles across six domains to
  counter the earlier SAT skew: `3d-euler-blowup` (certified interval numerics,
  fluid PDE), `casp16-rna` (blind-assessment negative result, RNA structure),
  `connect-four-bdd-oracle` (symbolic BDD strong-solve, games), `erdos-728-gpt5`
  (two-track AI-math verification), `serine-hydrolase-design` (forecaster,
  prediction-vs-experiment de novo enzyme chemistry), and
  `imandra-marabou-checker` (auditor, verify-the-verifier formal methods). Each
  pack bakes in its honest scope so no headline overclaims survive the reveal.
- **Scene fallacy-recognition track grown 5→10 lenses.** Added `false_analogy`,
  `whataboutism`, `slippery_slope`, `genetic`, and `no_true_scotsman`, each with
  a defect test, reverse-guard, invariant needles, mutation coverage, and a GATE
  probe.
- **No runtime rule, redline, or router change.** Lint suite green (invariants
  325/325, pack-schema 22/22, verbatim blocks 6/6), pytest 30 passed, both build
  targets clean.

## [1.1.2] - 2026-07-03

Licensing correction, no behavior change: the four modes, the shared floor, and
the build pipeline are untouched.

- **Scripts MIT dual-license withdrawn.** v1.1.1 additionally offered the code
  under `scripts/` under MIT. That grant ends here: `scripts/LICENSE` is
  deleted and the README License section now states a single license. The
  entire repository, code included, is licensed under CC BY-NC 4.0 only.
  Copies obtained under MIT while v1.1.1 was current keep that grant (MIT is
  irrevocable for already-distributed copies); no new MIT grant is made from
  this release forward.

## [1.1.1] - 2026-07-02

Release-engineering pass: publish automation, manifest-version enforcement, and
a fuller claude.ai edition. No behavior change to the four modes' stance,
redlines, or item pipeline.

- **Expedition packs ship in the claude.ai zip.** `build_claude_ai_zip.sh` now
  copies `expeditions/` (16 packs plus PACK-SCHEMA.md; ROADMAP.md excluded as
  planning material), so expedition can run on claude.ai instead of always
  taking the honest no-pack refusal. The claude.ai passport overlay already
  recorded completed expeditions, so no schema change. Stated caveat (README):
  the expedition path is less battle-tested on claude.ai; if the platform does
  not expose the bundled pack files, the mode degrades to the no-pack refusal.
- **Release workflow.** New `.github/workflows/release.yml`: pushing a `v*` tag
  re-runs the checks workflow via `workflow_call`, adds two release-only gates
  (tag-to-CHANGELOG equality and README Last-Updated freshness), builds both
  artifacts, and attaches them to the GitHub Release. The portable edition is
  now downloadable without a local build.
- **Portable build joins CI.** `checks.yml` now runs `build_portable.sh`, so
  its wording gates (no filesystem/router vocabulary may survive the rewrite)
  fire on every push rather than only on a maintainer's machine.
- **Version lint: four new checks** in `check_version_consistency.py`, each
  with a mutation test proving it fails on drift: `.claude-plugin/plugin.json`
  and `marketplace.json` versions must equal the latest CHANGELOG version; the
  README must carry a matching "What's new in vX.Y.Z" section and a
  `**Last Updated:**` stamp (freshness enforced at release time via
  `--release`); and `--tag` asserts the tag being cut equals the CHANGELOG.
- **Gate probe harness (advisory).** New `scripts/gate_probe_harness.sh` runs a
  small subset of single-turn Gate probes headlessly and greps transcripts for
  mechanical failure markers (e.g. Gate 9F generation-silence leaks). It
  supplements `docs/GATE-checklist.md`; multi-turn, judgment-heavy probes stay
  manual, and a grep-clean transcript still requires human review.
- **Scripts dual-licensed.** Code under `scripts/` is additionally offered
  under MIT (`scripts/LICENSE`); repository content stays CC BY-NC 4.0. New
  README License section.
- `.gitignore` now excludes `.local-plans/`, `.context/`, and `.pytest_cache/`
  in the tracked file, so the exclusion holds on every clone rather than
  depending on one machine's local git excludes.

## [1.1.0] - 2026-06-17

A fourteenth redline. Behavioral change to every judging mode (drill, detective,
and factual claims anywhere).

- **RL14 — "Concede on the merits, never to please."** Detective's only runtime
  safety net (the coach concedes when the user catches a flaw the answer key
  missed) previously lived only in `modes/detective.md`, below redline level and
  with no guard against sliding from stubbornness into sycophancy. RL14 makes it
  a floor-level, two-way constraint: never defend a challenged judgement by
  authority (a self-authored key — and the frame it is judged against — carries
  the same blind spot, so neither is self-evidently right), and never concede to
  be agreeable (a concession not anchored to the specific step where the user's
  reasoning is established is fabricated, withheld like a false defense). The
  ruling must be *produced, not felt*: a four-fact reconstruction (user's claim /
  key's claim / the frame criterion and whether it is itself sound / the verdict
  reading off the first three) written in the visible turn. A wrong key gets a
  short admission, not a balanced-sounding tribunal. An explicit residual-limit
  paragraph states what prompt text cannot enforce — reverse-fitted theater — and
  names the real backstop: the user keeps the floor to challenge again.
- **Translation discipline** baked into the redline: the force lives in three
  pivot words whose obvious Chinese renderings collapse it — a concession is
  改判／承認錯誤 not 讓步／妥協, reasoning that holds is 成立 not 有道理／說得通,
  the merits are 理據／論證本身 not 優點.
- **Connected edits.** `shared/redlines.md` + claude-ai mirror (RL14 text,
  thirteen→fourteen); `modes/detective.md` inspect step annotated with the
  same-model blind-spot warning + RL14 cross-refs; `modes/expedition.md`,
  `shared/scaffolding.md` (+mirror), `docs/ARCHITECTURE.md` (thirteen→fourteen,
  RL14 row in the redline table); `scripts/check_invariants.py` gains RL14
  invariants (auto-mirrored via the overlay map). Reviewed dual-track (codex
  gpt-5.5 + gemini 3.1-pro) across three rounds; lint 299/299.

## [1.0.2] - 2026-06-14

Positioning and eval-honesty pass after a second round of cross-model critique.
Documentation only; no behavior change to the four modes.

- **Positioning: a practice environment, not a transfer claim.** The README no
  longer sells itself as a fix for carry-over. It is a place to practice the
  move; whether a named move transfers stays the field's open question, stated
  once rather than as a repeated hedge. The "rigor does not transfer on its own"
  motivation is kept (a true phenomenon, not a promise). Removed the
  "trained into its blind spot" harm framing: under a practice-environment
  framing a wrong key is a move to push back on, and the user judges their own
  level.
- **Eval metric honesty: stability vs validity.** Cross-model agreement is
  documented as a *stability / reproducibility* measure only (models share
  training data, so they share blind spots), never as correctness. Added
  protocol 1b — a human validity anchor: a person competent in the twelve
  structures cold-solves a frozen sample, human-agreement is the primary
  validity number, cross-model agreement demoted to a secondary stability
  statistic. No run yet, so no validity claim. New
  `docs/evals/human-validity-anchor-TEMPLATE.md`.
- **SKILL.md description em-dash** (root + claude-ai overlay): the one
  user-facing string the prior voice pass missed, changed to a colon. Trigger
  keywords untouched; routing unchanged.

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
