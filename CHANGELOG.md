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
- Expedition packs (6, cross-domain): boolean-pythagorean-triples
  (combinatorics/SAT), katago-adversarial (games/ML robustness),
  alphatensor-matmul (algorithms), erdos-discrepancy (number theory; the
  machine-vs-human-proof contrast pack), keller-dimension-7 (geometry, ACL2
  formally-verified), and alphafold-casp14 (structural biology; first
  forecaster-role pack). Each first-party verified against its source. Pack
  discovery by `pack_id`, runtime pack boundary, Gate 8 behavioral probes.
  Phase 2 packs drafted via Workflow fan-out, then every numeric claim
  re-verified against the primary source before commit; see
  expeditions/ROADMAP.md.
- Drill quality floor for weak models: per-structure slot templates (step c),
  a mandatory option-audit table before release (step g — discard, never
  patch, on any partial-merit distractor), and a weak-model fallback ladder
  (step g2 — degrade then refuse rather than ship a muddled item).
- Verification harness: invariant lint (section-scoped), pack schema lint,
  verbatim-block sync, version-consistency lint, mutation tests, CI.
