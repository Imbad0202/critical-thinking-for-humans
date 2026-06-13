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
- First expedition pack: boolean-pythagorean-triples (first-party verified
  against arXiv:1605.00723), pack discovery by `pack_id`, runtime pack
  boundary, Gate 8 behavioral probes.
- Verification harness: invariant lint (section-scoped), pack schema lint,
  verbatim-block sync, version-consistency lint, mutation tests, CI.
