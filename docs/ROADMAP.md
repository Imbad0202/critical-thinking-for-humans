# Roadmap

_Last updated: 2026-07-25._

## Current posture

There is no active feature milestone. Keep `main` tested and open fresh,
scoped issues only when a concrete defect, user observation, or external
evidence justifies the work.

The v1.5.0 release consolidates these changes since v1.4.0:

- the source-case option-length cue repair (PR #35);
- promotion of `source_credibility` to the fourteenth loggable structure
  plus credibility-specific generation and behavior gates (issue #36,
  PR #37);
- serialized local Passport checkpoint writes (issue #38, PR #39);
- the motte-and-bailey Scene lens (issue #42, PR #43);
- the gambler's-fallacy Scene lens (issue #44, PR #45);
- strict steelman-before-correction ordering for caricatured Scene positions,
  added after the v1.5.0 release gate exposed an ordering failure.

## v1.5.0 release evidence

- The complete behavioral Gate 1–13 run is recorded in
  [`evals/behavior-probes-2026-07-25-v1.5.0.md`](evals/behavior-probes-2026-07-25-v1.5.0.md).
  It includes Gate 13A–13E, disposable Passport traces, the Scene
  steelman-ordering failure found during the run, its fix, and the required
  final-candidate retests.
- The exact release commit must still pass the automated test, invariant,
  mutation, build, archive-integrity, public-boundary, and version/tag checks
  in local and remote CI before the signed tag is pushed.
- The run is behavioral evidence in Codex, not a human-validity anchor or an
  attestation for Claude Code, claude.ai, or the portable artifact.

## Standing, evidence-gated work

### Scene fallacy lenses (#11)

Keep the fallacy-recognition track's current twelve-lens ruling surface.
Additional lenses are a low-priority, one-at-a-time backlog; each needs its
own defect test, reverse-guard, boundary text, invariant and mutation coverage,
Gate 10 probe, and overlay synchronization. The current off-list candidate is
red herring. Do not batch-expand the set merely to make it exhaustive.

### Local Passport reliability

The checkpoint helper now serializes concurrent writers and fails closed on
unsafe paths or an unavailable Node.js 22+ prerequisite. The following are
possible follow-ups, not accepted milestones:

- add idempotent checkpoint IDs before attempting to eliminate the
  lost-success-acknowledgement duplicate-retry window or make directory-sync
  failures fatal;
- validate the full event envelope (`schema_version`, `ts`, and `type`) in the
  helper if malformed semantic records appear in real use;
- consider a bundled cross-platform writer only if removing the local
  Node.js 22+ prerequisite becomes a demonstrated need.

Each follow-up should start as a separate issue with a reproducible failure or
clear user need.

## Deliberately not scheduled

Issue #20's R4 proposal, a per-mode constructive-alignment matrix, remains
unscheduled. Its runtime context cost is high and its current value overlaps
existing mode contracts. Revisit it only through a fresh scoped issue backed
by concrete evidence; it is not unfinished work under #20.

## Completed landmarks

- The PR2 workstream, merged through PR #17, closed the CI, browser-smoke, and
  release-artifact integrity gaps.
- The verified Calma–Davies/Peregrine implementation wave (#21–#26 and #30–#33)
  shipped in v1.4.0 through PR #34.
- The seven-case source-credibility pilot (#27) produced the decision to add
  the fourteenth structure, implemented through #36/#37.
- The pilot's option-length cue was repaired through PR #35.
- Local Passport concurrent checkpoint writes were hardened through #38/#39.
