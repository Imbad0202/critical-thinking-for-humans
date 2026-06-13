#!/usr/bin/env bash
# Build the single-file, model-neutral edition from canonical files.
# The repo stays the single source of truth: never edit the output by hand.
#
# The portable edition concatenates a purpose-written header (which replaces
# SKILL.md's load/unload + passport + claude.ai mechanics) with the canonical
# floor files and the three modes that work without external packs or a
# filesystem (drill, scene, detective). expedition is excluded: it needs the
# verified pack library, which cannot live in one pasted document.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist/critical-thinking-for-humans-portable.md"

# Gate: invariants must hold on the canonical sources before we assemble.
python3 "$ROOT/scripts/check_invariants.py" >/dev/null || {
  echo "check_invariants.py failed — fix invariants before building portable" >&2
  exit 1
}

mkdir -p "$ROOT/dist"
: > "$OUT"

emit_section () {
  # $1 = path, $2 = section banner
  printf '\n\n<!-- ===== %s ===== -->\n\n' "$2" >> "$OUT"
  printf '# %s\n\n' "$2" >> "$OUT"
  # Rewrite the one canonical sentence that describes Claude's on-demand file
  # loading ("this is the only mode file loaded ... already loaded from session
  # start"). In a single pasted document that mechanic does not exist; the header
  # already told the model to keep modes mentally separated. We strip it here so
  # the portable file is not self-contradictory, without touching the canonical
  # source (which is correct for the Claude editions).
  sed -E \
    -e 's/^On entry, this is the only mode file loaded\. The stance-neutral floor.*$/On entry, treat this mode as the active stance. The stance-neutral floor (the/' \
    -e 's/^`shared\/structures\.md` — is already loaded from session start\.$/redlines, scaffolding, and structures sections above) is already in force./' \
    "$ROOT/$1" >> "$OUT"
}

# 1. Portable header (replaces SKILL.md's vendor/filesystem mechanics).
cat "$ROOT/platforms/portable/HEADER.md" >> "$OUT"

# 2. The stance-neutral floor, verbatim.
emit_section "shared/redlines.md"             "Redlines (hard rules)"
emit_section "shared/scaffolding.md"          "Scaffolding (how to coach)"
emit_section "shared/structures.md"           "Reasoning structures and fallacy lenses"
emit_section "shared/manipulation-taxonomy.md" "Manipulation taxonomy (only for the manipulation domain)"

# 3. The three portable modes, verbatim.
emit_section "modes/drill.md"     "Mode: drill"
emit_section "modes/scene.md"     "Mode: scene"
emit_section "modes/detective.md" "Mode: detective"

# 4. Resolve cross-file references to in-document section language. The canonical
#    files say "see shared/structures.md" because there they ARE separate files.
#    In one pasted document those paths point at nothing, so we rewrite them to
#    refer to the corresponding section. This pass runs on $OUT only; the
#    canonical sources are never touched (verified in step 6).
TMP="$(mktemp)"
sed -E \
  -e 's/^Loaded alongside shared\/structures\.md and shared\/redlines\.md every session\.$/In force for every session, alongside the reasoning-structures and redlines sections./' \
  -e 's/if no mode file is loaded yet, treat the session as standard/before a mode is chosen, treat the session as standard/' \
  -e 's/`?shared\/structures\.md`?/the reasoning-structures section/g' \
  -e 's/`?shared\/scaffolding\.md`?/the scaffolding section/g' \
  -e 's/`?shared\/redlines\.md`?/the redlines section/g' \
  -e 's/`?shared\/manipulation-taxonomy\.md`?/the manipulation-taxonomy section/g' \
  -e 's/`?modes\/scene\.md`?/the scene section/g' \
  -e 's/`?modes\/drill\.md`?/the drill section/g' \
  -e 's/`?modes\/detective\.md`?/the detective section/g' \
  -e 's/\(see `?modes\/expedition\.md`?\)//g' \
  -e 's/`?modes\/expedition\.md`?/the full repository (expedition is not in this edition)/g' \
  -e 's/\(see `?passport\/SCHEMA\.md`? Privacy Rules\)/(see the privacy note in the header)/g' \
  -e 's/see `?passport\/SCHEMA\.md`?/see the privacy note in the header/g' \
  -e 's/`?passport\/SCHEMA\.md`?/the privacy note in the header/g' \
  "$OUT" > "$TMP" && mv "$TMP" "$OUT"

# 5. Post-build checks: no filesystem/vendor/load mechanics should survive in a
#    document meant to be pasted into any chat. These greps catch leakage from
#    the canonical files that the header cannot paper over.
fail=0
check_absent () {
  # $1 = grep pattern (ERE), $2 = human reason
  if grep -nE "$1" "$OUT" >/dev/null; then
    echo "PORTABLE LEAK [$2]:" >&2
    grep -nE "$1" "$OUT" | sed 's/^/    /' >&2
    fail=1
  fi
}

# "load modes/x.md" / "unload" are filesystem-load mechanics, meaningless in one file.
check_absent 'load `?modes/[a-z]+\.md' "dynamic mode-file load survived"
check_absent '[Uu]nload ' "unload instruction survived"
# expedition is not in this edition; a stray reference would mislead.
check_absent 'load `?modes/expedition\.md' "expedition load survived"
# Narrative-form loading language (not the `load modes/x` shape) that implies a
# filesystem: "the only mode file loaded", "loaded from session start".
check_absent 'only mode file loaded' "narrative file-load survived"
check_absent 'loaded from session start' "narrative session-load survived"
check_absent 'no mode file is loaded' "narrative no-mode-loaded survived"
check_absent 'Loaded alongside' "narrative co-load survived"
# Passport-on-disk vocabulary: the portable edition has no local file.
check_absent '~/\.ct-gym|events\.jsonl' "on-disk passport vocabulary survived"
# Any surviving canonical file path means a cross-reference slipped the rewrite.
check_absent '(shared|modes|passport)/[A-Za-z._-]+\.md' "unrewritten cross-file path survived"

if [ "$fail" -ne 0 ]; then
  echo "" >&2
  echo "Portable build has leaks (above). The header should override these, or the" >&2
  echo "canonical file needs a portable-safe rewrite. Not shipping a misleading file." >&2
  rm -f "$OUT"
  exit 1
fi

# 5. Sanity: the load-bearing content actually made it in.
need () { grep -q "$1" "$OUT" || { echo "portable build missing: $1" >&2; rm -f "$OUT"; exit 1; }; }
need "circular_reasoning"          # 12th-structure proof (fallacy completion landed)
need "Fallacy-Recognition"         # scene fallacy track present
need "fallacy_equivocation"        # all 5 lenses present
need "Redlines (hard rules)"       # floor present

# 7. Prove the canonical sources were not mutated by this build (the portable
#    edition must never alter what the Claude editions ship). A dirty working
#    tree under shared/ or modes/ here would mean a sed pass leaked onto a source.
if ! git -C "$ROOT" diff --quiet -- shared modes SKILL.md; then
  echo "build_portable mutated a canonical source — it must only write to dist/" >&2
  git -C "$ROOT" diff --stat -- shared modes SKILL.md >&2
  exit 1
fi

lines=$(wc -l < "$OUT" | tr -d ' ')
echo "BUILD OK → $OUT ($lines lines)"
