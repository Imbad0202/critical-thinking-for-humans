#!/usr/bin/env python3
"""Verbatim-block sync between canonical files and the claude.ai overlay.

The STANCE RESET blocks are specified as "emit this block verbatim" — the
overlay copy in platforms/claude-ai/SKILL.md must stay byte-identical to the
canonical SKILL.md blocks. Same for the fixed intake contract sentence, which
must appear in all four carrier files. Sentence-presence lint cannot catch a
drifted line INSIDE a block; this check compares whole blocks.

Exit 0 in sync; 1 drift; 2 invocation error.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FENCE_BLOCK = re.compile(r"```\n(.*?)```", re.DOTALL)
CONTRACT = ("This tool will point out flaws in your reasoning. "
            "That is what you came here for.")
CONTRACT_FILES = [
    "SKILL.md",
    "platforms/claude-ai/SKILL.md",
    "shared/scaffolding.md",
    "platforms/claude-ai/shared/scaffolding.md",
]


def stance_blocks(text: str) -> list[str]:
    return [b for b in FENCE_BLOCK.findall(text) if "STANCE RESET" in b]


def main(root: Path = ROOT) -> int:
    failures = 0

    canonical = (root / "SKILL.md").read_text(encoding="utf-8")
    overlay = (root / "platforms/claude-ai/SKILL.md").read_text(
        encoding="utf-8")
    blocks = stance_blocks(canonical)
    if len(blocks) != 2:
        print(f"FAIL [stance-block-count] SKILL.md has {len(blocks)} "
              "STANCE RESET blocks; expected 2")
        failures += 1
    for i, block in enumerate(blocks, 1):
        if block in overlay:
            print(f"PASS [stance-block-{i}-verbatim]")
        else:
            print(f"FAIL [stance-block-{i}-verbatim] block drifted in "
                  "platforms/claude-ai/SKILL.md")
            failures += 1

    for rel in CONTRACT_FILES:
        # Hard-wrapped prose differs only in line breaks; collapse whitespace
        # so the check is verbatim-in-words, not verbatim-in-wrapping.
        flat = re.sub(r"\s+", " ", (root / rel).read_text(encoding="utf-8"))
        if CONTRACT in flat:
            print(f"PASS [contract-sentence:{rel}]")
        else:
            print(f"FAIL [contract-sentence:{rel}] intake contract sentence "
                  "missing or drifted")
            failures += 1

    total = len(blocks) + len(CONTRACT_FILES) + (1 if len(blocks) != 2 else 0)
    print(f"\n{total - failures}/{total} checks green")
    return 1 if failures else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
