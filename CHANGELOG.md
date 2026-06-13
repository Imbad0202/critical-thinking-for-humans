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
  whose parent problem is still open). Each first-party verified against its
  source — re-verification caught the survey's wrong ~1 TB / CRAY figures for
  Lam's problem. Pack discovery by `pack_id`, runtime pack boundary, Gate 8
  behavioral probes. Phases 2-3 drafted via Workflow fan-out, then every
  numeric claim re-verified before commit; see expeditions/ROADMAP.md.
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
