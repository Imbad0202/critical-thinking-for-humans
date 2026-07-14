# Roadmap

## Completed — PR2: CI, browser, and artifact closure

**Status:** Implemented after PR1 (Daily correctness and regression coverage).

### Scope

- Split Python compatibility checks into their own version matrix.
- Run Node and browser checks once, outside the Python matrix.
- Syntax-check every tracked JavaScript and MJS file.
- Add a focused Playwright smoke test to pull-request CI.
- Build release artifacts once, then verify, checksum, and upload those exact bytes.
- Make the release workflow publish the already-verified artifacts instead of rebuilding them.
- Remove duplicate builds across matrix jobs, checks, and releases.

### Acceptance criteria

- Python versions are tested independently without repeating Node, browser, or artifact work.
- Pull requests fail on syntax errors in any tracked `.js` or `.mjs` file.
- Pull requests run and pass the documented Playwright smoke path.
- Each release artifact is produced exactly once and has a recorded checksum.
- The bytes attached to a release match the artifact verified by CI, as confirmed by checksum.
- No workflow job rebuilds an artifact that an earlier job already produced.
