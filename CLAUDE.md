# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Claude Code skill that trains a human user's critical thinking. The product is
the Markdown itself: `SKILL.md`, `modes/`, and `shared/` are prompt files that
program model behavior at runtime, so editing their prose is a behavior change,
not a docs change. The only conventional code is the lint/build tooling under
`scripts/` (Python stdlib + bash; PyYAML for `check_manifests.py`, pytest for
the test suite).

## Commands

The full check suite, in CI order (`.github/workflows/checks.yml` is canonical):

```bash
python3 scripts/check_manifests.py           # manifests parse (needs: pip install pyyaml)
python3 scripts/check_invariants.py          # load-bearing sentences present
python3 scripts/check_pack_schema.py         # expedition pack structure
python3 scripts/check_verbatim_blocks.py     # STANCE RESET blocks byte-identical across overlay
python3 scripts/check_version_consistency.py # release-doc alignment (8 invariants; see its docstring)
python3 -m pytest scripts/ -q                # mutation + unit tests (needs: pip install pytest)
bash scripts/build_claude_ai_zip.sh          # → dist/…-claude-ai.zip (gates inside)
python3 scripts/check_manifests.py           # re-run post-build: parses the SKILL.md inside the zip
bash scripts/build_portable.sh               # → dist/…-portable.md (wording gates inside)
```

Run a single test: `python3 -m pytest scripts/test_lints_mutation.py -q -k <name>`

Release-time gates (also run by the tag workflow):
`python3 scripts/check_version_consistency.py --release --tag vX.Y.Z`

Behavioral gate probes: `scripts/gate_probe_harness.sh [--model M]` runs a few
single-turn probes in fresh `claude -p` sessions. It is advisory, spends real
tokens, and its grep can only prove FAIL, never PASS — the full manual protocol
is `docs/GATE-checklist.md`.

Python compatibility: contributors run the lints under bare `python3`, which may
be 3.9 (see PR #7). No PEP 604 `X | Y` annotations — use `typing.Optional` /
`typing.Union`. CI runs the whole suite on both 3.9 and 3.12, so a 3.9 break
fails the push.

## Architecture

**Runtime layout.** Every session loads the stance-neutral floor first —
`shared/redlines.md` (14 hard rules), `shared/scaffolding.md`,
`shared/structures.md` (the 12 keyed reasoning structures) — then `SKILL.md`
routes to exactly one mode file: `modes/drill.md` (judge stance),
`modes/scene.md` (Socratic), `modes/expedition.md` (guide; runs only from
verified packs in `expeditions/`), or `modes/detective.md` (guide-and-judge).
User progress lives in a local passport at `~/.ct-gym/` (spec:
`passport/SCHEMA.md`). `docs/ARCHITECTURE.md` is the visual map; where it and a
runtime file disagree, the runtime file wins.

**Three build targets, one source of truth.** The repo runs directly as the
Claude Code skill. `build_claude_ai_zip.sh` assembles the claude.ai zip by
copying canonical runtime files and then applying **whole-file overlays** from
`platforms/claude-ai/` (SKILL.md, shared/redlines.md, shared/scaffolding.md,
passport/SCHEMA.md — the delta is storage: no local filesystem on claude.ai).
`build_portable.sh` concatenates a single-file edition (drill + scene +
detective only) with sed rewrites of filesystem/router language. `dist/` is
generated output — never hand-edit it.

**The overlay sync rule.** Editing a canonical file that has a
`platforms/claude-ai/` counterpart means reviewing/updating that overlay in the
same commit. `check_verbatim_blocks.py` enforces the strictest cases: the two
STANCE RESET blocks must stay word-identical between `SKILL.md` and its overlay,
and the intake contract sentence across its four carrier files.

**The invariant system.** `check_invariants.py` holds a table of load-bearing
sentences (CHECKS) and forbidden phrases (FORBIDDEN) and asserts their literal
presence/absence in carrier files, including the overlay copies. Consequences:

- Rewording a rule sentence in `shared/` or `modes/` fails CI even if the
  meaning is preserved. Either keep the sentence or update the table entry and
  every overlay copy together.
- The invariant, pack-schema, verbatim-block, and version linters each have
  mutation tests in `scripts/test_lints_mutation.py` proving they can actually
  fail (`check_manifests.py` is the one without). A new invariant needs a
  matching mutation.
- Lint green is presence-only. It does not prove runtime behavior; behavior
  changes to `modes/` or `shared/` need the manual probes in
  `docs/GATE-checklist.md` before release.

**Redlines win.** The 14 redlines in `shared/redlines.md` bind every mode; when
any instruction conflicts with a redline, the redline wins. Detective adds a
mode-local "generation silence" rule (the case's answer key must never reach the
visible chat — Gate 9F guards this).

**Expedition packs.** A pack is any `expeditions/*.md` declaring a `pack_id`;
author against `expeditions/PACK-SCHEMA.md`. The schema lint checks shape only —
verifying pack content against its cited sources is a human authoring duty.
`expeditions/ROADMAP.md` is planning and stays out of builds.

## Releases

Pushing a `v*` tag runs `release.yml`: the full check suite, then release-only
gates, then builds and attaches both artifacts to the GitHub Release.

A version bump touches all of: the `CHANGELOG.md` entry (body ≥ 100 chars; its
version must equal the tag), the README version badge + `## What's new in
vX.Y.Z` + `**Last Updated:**` stamp (must be within 7 days at tag time), the
`# Architecture (vX.Y.Z)` header, and both `.claude-plugin/*.json` manifests.
`check_version_consistency.py` fails on any drift, including references to
future versions in README.md, SKILL.md, and top-level `docs/*.md` (nested
docs are not scanned).

Fetch and sync with the remote before starting release work.

## Conventions

- License is CC BY-NC 4.0 for everything, including `scripts/` (the v1.1.1 MIT
  dual-license was withdrawn in v1.1.2). Do not add per-file license headers.
- `.local-plans/` and `.context/` are gitignored and machine-local (design
  plans, eval material) — they do not follow the repo across machines.
- Runtime Markdown is written in a deliberate, honest register — match the
  surrounding wrapping and voice; it is load-bearing, not filler.
