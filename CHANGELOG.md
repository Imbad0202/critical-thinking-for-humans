# Changelog

All notable changes to critical-thinking-gym are documented here. Headings
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
- Expedition packs: boolean-pythagorean-triples (combinatorics/SAT, verified
  against arXiv:1605.00723) and katago-adversarial (games/ML robustness,
  verified against arXiv:2211.00241 + arXiv:2406.12843) — first cross-domain
  pair. Pack discovery by `pack_id`, runtime pack boundary, Gate 8 behavioral
  probes. Cross-domain candidate roadmap in expeditions/ROADMAP.md.
- Verification harness: invariant lint (section-scoped), pack schema lint,
  verbatim-block sync, version-consistency lint, mutation tests, CI.
