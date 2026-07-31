# Changelog

All notable changes to critical-thinking-for-humans are documented here. Changes
land under `## [Unreleased]`; release headings follow `## [X.Y.Z] - YYYY-MM-DD`,
and the latest versioned heading must equal the git tag being cut (enforced by
`scripts/check_version_consistency.py`).

## [Unreleased]

- **Scene configure track (#49).** A third scene track inverts the gym's
  default order: the user designs the information request and verification
  plan for a synthetic decision before any analysis appears, then the case
  reveals which asks were load-bearing (each keyed to one of the fourteen
  structures), which were noise, and what the plan missed — with each miss
  writing a standalone `miss_log` that feeds drill's per-structure
  weighting. Reverse-designed cases (decision stipulated first, information
  key with ablation test, menu or open ask by tier), with noise entries
  keyed to the existing distractor-menu patterns so the reveal re-invokes
  drill's vocabulary; a decline-and-route
  floor when reasonable plans genuinely diverge (a contestable key grades
  taste and calls it information design); an anti-checklist guard that
  scores generic best-practice lines as noise while judging specificity
  charitably; a select-all guard naming the noise share of an
  ask-for-everything plan; an unkeyed-ask inspection rule mirroring
  detective's unregistered-flaw honesty, with a conceded key writing the
  same `item_discarded` event as a drill overturn. v1 ships exactly one
  case family
  (program-effectiveness decisions) under the one-at-a-time backlog
  discipline (docs/ROADMAP.md); the restraint pool (cases already settled
  by the material on the table) and the post-reveal and elicitation
  carriers for configure are recorded as explicit deferrals.
  `scene_process` gains a third mutually exclusive field set
  (`configure_caught` / `configure_missed` / `configure_noise` /
  `configure_unkeyed`), additive, `schema_version` unchanged. `configure`
  routing keyword, Gate 16 probes, claude.ai block `configure` line, and
  invariant needles with mutation coverage land with it.

- **Post-reveal updating (#48).** Seeing a flaw and moving on it are different
  capabilities; the Passport now keeps them separate, under one shared state
  vocabulary. Drill adds a post-miss update rep (restate the skeleton,
  corrected, in your own words — no throwaway sibling stem; the miss-log
  weighting already brings the structure back as a fully audited item) logged
  as an optional `post_reveal` marker; scene's closing pressure test records
  where the commitment landed relative to the pre-objection position
  (`updated / refined / held_with_argument / held`); detective counts
  corrections carried into the next layer versus dead framings re-run after
  their reveal, stated together with the related `false_positives` count.
  Expedition is deliberately deferred, with the reason recorded in the
  schema. All markers are behavior-anchored observable acts, never
  self-report; a reasoned hold is a first-class outcome, never a failure, and
  no update pressure is ever applied. Fields are optional and additive in the
  Elicitation style, so `schema_version` stays 1 (the issue's "schema bump"
  is realized as additive fields per the #26 precedent, not a version
  change). Sensitive BYOM stays excluded by default. Gate 15 probes, the
  claude.ai block's `updating` line, template display, and invariant needles
  with mutation coverage land with it.

- **Keyed reject-the-framing move (#47).** Drill gains a defective-framing
  item family hosted in the existing `weaken`/`sufficiency` machinery: the
  material affirmatively defeats what the item's question presupposes (a new
  contrast pair in shared/structures.md draws the line against ordinary
  `sufficiency`), the unique key is the option that challenges the premise,
  and the result logs under the structure the defect instantiates — no new
  item type, structure ID, sentinel, or Passport schema. A `premise_challenge_trap`
  reverse-guard pool trains against reflexive question-refusal the same way
  sound items train against over-flagging. Detective gains the reframe layer:
  a local question whose premise the material defeats, unlocked only by
  naming that failure, with the concrete key falling out of the rejected
  framing; the stipulated G0 frame itself is never the thing rejected
  (redline 1 boundary). Gate 14 probes, invariant needles with mutation
  coverage, and build-carrier checks land with it.

## [1.5.0] - 2026-07-25

- **Twelfth Scene fallacy lens (#44).** Add `fallacy_gamblers_fallacy`
  with a history-dependence test that distinguishes unsupported local
  compensation in an unchanged independent process from real depletion,
  negative dependence, state change, parameter learning, future-block
  probability, and regression to the mean. Unknown generator rules return
  `insufficient_context`; unsupported continuation raises a distinct off-list
  hot-hand question. The per-lens `not_fallacy` ruling now explicitly avoids
  certifying the whole argument. Gate 10M, invariant/mutation coverage, and
  artifact-carrier checks carry the contract without a Passport schema or
  taxonomy change.
- **Eleventh Scene fallacy lens (#42).** Add `fallacy_motte_and_bailey`
  with a fallback-substitution test that requires a stronger claim, a narrower
  fallback, and observable evidence that the stronger claim or its conclusion
  remains in force. Explicit narrowing or withdrawal is legitimate when the
  stronger conclusion is abandoned, materially weakened, or independently
  supported without substituting the fallback; a later unsupported return still
  triggers the lens. Incomplete passages return `insufficient_context`.
  Nearby-lens boundaries plus no-motive and accountable-advocate guards prevent
  overreach. Gate 10L and invariant/mutation coverage carry the contract without
  a Passport schema change.
- **Concurrent local Passport checkpoints (#38).** Route every Claude Code
  checkpoint and deletion through one bundled writer with an exclusive sidecar
  lock, lock-before-reread ordering, whole-batch atomic replacement, and
  fail-closed pending-event retention. A deletion-generation token prevents old
  sessions from restoring pre-deletion batches; strict JSON validation,
  no-follow regular-file checks, and locked orphan-temp cleanup harden the local
  privacy boundary. Real multi-process tests cover simultaneous writers, cold
  start, malformed input and tails, lock contention, deletion and SIGKILL
  recovery, permissions, and failed replacement without changing the event
  schema. The local writer explicitly requires Node.js 22+; its preflight exits
  before touching Passport data when that runtime is unavailable, while the
  coaching session continues with recording paused.
- **Source credibility becomes the 14th canonical structure (#36).** Add
  `source_credibility` as a loggable Drill and Detective target while retaining
  the existing cross-mode `clarify`, `check_basis`, and
  `license_conclusion` as procedures rather than duplicate tally IDs. Existing
  `drill_result`, `miss_log`, `item_discarded`, and
  `detective_process.structures_hit` events carry it without a Passport schema
  bump or a fifth Drill item type.
- **Credibility-specific generation and behavior gates.** Require uniquely
  defensible weight judgments across tiers, including sound interested sources;
  refuse to invent motives, funding, independence, credentials, or records;
  preserve the genetic- and ad-hominem-fallacy reverse guards; and protect
  Detective's first-defect-call and answer-chain silence. New invariants,
  mutation coverage, eval templates, and manual probes keep those boundaries
  load-bearing.
- **Source-family answer-cue repair (#35).** Rebalance the seven public
  source-credibility Daily cases so the correct option is no longer revealed by
  conspicuously greater length, tighten the 2026-07-19 prompt, and add a
  keyless regression test for the length cue. Private answer records remain
  local and outside version control.
- **Scene steelman ordering.** Require the coach to reconstruct a caricatured
  position as a complete claim with its strongest stated reason before
  correcting the caricature; merely listing objection fragments no longer
  satisfies the steelman duty. An invariant and mutation check keep the
  ordering load-bearing.

## [1.4.0] - 2026-07-24

- **Feynman-register expedition discipline (#29).** Require plain-language
  anchors to preserve every load-bearing condition: inventory the precise claim
  first, add rather than replace technical terms, pass a domain-literate
  back-translation, and reverify every touched factual sentence against its
  cited primary source. Re-audit the 22-pack baseline under that protocol,
  repair factual, scope, and register drift, and record the evidence ledger in
  `expeditions/REGISTER-AUDIT.md`.
- **Jacobian counterexample expedition (#28).** Add the 23rd verified pack around
  the degree-seven map over \(\mathbb C^3\) whose Jacobian determinant is
  identically \(-2\) and whose three displayed inputs collide. Keep the exact
  algebra separate from the public attribution to Fable—which does not identify
  a model version—and the unpublished discovery process, and retain the
  date-bounded boundary that \(n=2\) remains open.
- **Source-credibility Daily family (#30).** Extend the zh-TW Daily rotation from
  seven to fourteen days with seven independently authored source-credibility
  cases. Public fixtures contain prompts and choices only; their private answer
  records stay outside the public repository.
- **Drill-quality signals and blind probe (#31).** Add `item_discarded` records
  for successful challenge-window concessions, IDs-only `confused_with` data on
  misses, and a two-fresh-session blind key-agreement probe whose agreement is
  explicitly advisory rather than proof.
- **Source credibility and reason ownership (#32).** Add non-loggable,
  cross-mode Source-Credibility Operations; occasionally require a one-sentence
  reason with standard-plus drill commitments; and add repair-and-decide closes
  that preserve safe-word exits. Gate 11 covers the new runtime behavior.
- **Ability/support separation (#33).** Add optional `not_elicited`, `prompted`,
  and `independent` elicitation fields without bumping `schema_version`; absence
  or lack of opportunity never counts as a learner deficit. Show independent
  and supported performance in separate Passport lanes, guarded by Gate 12.

## [1.3.0] - 2026-07-14

- **Bilingual Web Casebook.** Add a third, no-model-call entry point with four
  finishable fixed excerpts for Drill, Scene, Expedition, and Detective;
  English and Taiwan-oriented Traditional Chinese UI/content; responsive
  visual-novel presentation; original art and music; and a local-first browser
  Passport. The web path is explicitly an authored demonstration rather than a
  runtime-generated full Skill session.
- **Daily Dispatch.** Add an optional server-backed zh-TW Daily case path with
  public prompt fixtures, private answer records, Vercel handlers, publication
  cron support, schema/leak guards, deployment tooling, and a static fallback
  that leaves all four fixed modes usable when the API is absent.
- **Traditional Chinese copy pass.** Rewrite the Web Casebook's zh-TW case text
  into plainer Taiwan usage without changing its reasoning structures or
  answers.
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
- **First-party expedition provenance (#10).** Verify AlphaProof's official
  five-problem manual Lean formalization directly in the now-open Nature full
  text, including its parallel auto-formalization nuance; recover all 13 Busy
  Beaver sporadic holdouts and their standard identifiers from the pinned
  Coq-BB5 v1.0.0 proof artifact.
- **Release-document closure.** Add the missing RL14 two-direction behavioral
  probe, correct stale reasoning-structure and expedition-roadmap prose, and
  align all release metadata for v1.3.0.

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
