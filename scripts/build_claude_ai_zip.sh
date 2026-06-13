#!/usr/bin/env bash
# Build the claude.ai-uploadable skill zip from canonical files + platform overlay.
# The repo stays the single source of truth: never edit the zip or a staged copy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
DEST="$STAGE/critical-thinking-for-humans"
mkdir -p "$DEST"

# 1. Canonical payload (runtime files only — no README/docs/scripts).
cp "$ROOT/SKILL.md" "$DEST/"
cp -R "$ROOT/modes" "$ROOT/shared" "$ROOT/passport" "$DEST/"
# TEMPLATE.md describes the regenerable markdown view of the local event log;
# the claude.ai edition has neither, so it ships without it.
rm "$DEST/passport/TEMPLATE.md"

# 2. Platform overlay — whole-file replacements win over canonical.
cp -R "$ROOT/platforms/claude-ai/." "$DEST/"

# 3. Invariant gate, then forbid local-filesystem vocabulary anywhere in the build.
python3 "$ROOT/scripts/check_invariants.py" >/dev/null || {
  echo "check_invariants.py failed — fix invariants before building" >&2; exit 1; }
if grep -rn -e '~/.ct-gym' -e 'events\.jsonl' -e 'on disk' "$DEST"; then
  echo "local-filesystem vocabulary leaked into the claude.ai build (lines above)" >&2
  exit 1
fi

# 4. Zip.
mkdir -p "$ROOT/dist"
OUT="$ROOT/dist/critical-thinking-for-humans-claude-ai.zip"
rm -f "$OUT"
(cd "$STAGE" && zip -rqX "$OUT" critical-thinking-for-humans -x '*.DS_Store')
unzip -l "$OUT"
