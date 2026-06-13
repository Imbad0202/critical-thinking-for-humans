# Changelog

All notable changes to critical-thinking-for-humans are documented here. Headings
follow `## [X.Y.Z] - YYYY-MM-DD`; the latest versioned heading must equal the
git tag being cut (enforced by `scripts/check_version_consistency.py`). No
release has been tagged yet — everything to date sits under Unreleased.

## [Unreleased]

- Three modes: drill (judge stance), scene (Socratic stance, synthetic +
  BYOM), expedition (guide stance, verified packs only).
- Thirteen redlines, shared scaffolding (four-step reveal, safe words,
  stuck detection), seven canonical reasoning structures, manipulation-
  recognition domain with taxonomy.
- Local passport (`~/.ct-gym/events.jsonl`) plus claude.ai platform overlay
  and zip build.
- Expedition packs (10, cross-domain). Phase 1-2: boolean-pythagorean-triples
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
  boundary, Gate 8 behavioral probes. Phases 2-3 drafted via Workflow fan-out,
  then every numeric claim re-verified before commit; the candidate pool in
  expeditions/ROADMAP.md is now exhausted.
- Drill quality floor for weak models: per-structure slot templates (step c),
  a mandatory option-audit table before release (step g — discard, never
  patch, on any partial-merit distractor), and a weak-model fallback ladder
  (step g2 — degrade then refuse rather than ship a muddled item).
- Legal-exposure hardening (cross-model review, codex + independent agent, no
  HIGH-risk found): disclaimer now disclaims Anthropic affiliation, states
  example names are fictional, adds an efficacy non-guarantee and an
  educational-use / non-advice clause; SKILL.md gains an all-modes Scope
  boundary (no legal/medical/financial/psychological/safety advice) synced to
  the claude.ai overlay; one KataGo pack phrase tightened to stay within its
  cited source.
- Verification harness: invariant lint (section-scoped), pack schema lint,
  verbatim-block sync, version-consistency lint, mutation tests, CI.
