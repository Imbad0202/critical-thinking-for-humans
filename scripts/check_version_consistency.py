#!/usr/bin/env python3
"""Release-doc alignment lint (installed before the first tag, per policy).

Invariants:
1. CHANGELOG.md exists with a [Unreleased] or [X.Y.Z] heading.
2. Latest versioned heading (if any) has a non-empty body (>= 100 chars).
3. README version badge (badge/version-vX.Y.Z) matches the latest CHANGELOG
   version; pre-first-release, no version badge may exist.
4. README.md, SKILL.md, and docs/*.md reference no X.Y.Z version newer than
   the latest CHANGELOG version (pre-first-release: none at all).
5. docs/ARCHITECTURE.md header `# Architecture (vX.Y.Z)` equals the latest
   CHANGELOG version exactly. Invariant 4 only catches *forward* drift (a
   future version); a header pinned to an older release passes 4 but is still
   stale, so it gets its own equality check.

Exit 0 aligned; 1 violations; 2 invocation error.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEADING = re.compile(r"^## \[(Unreleased|\d+\.\d+\.\d+)\]", re.MULTILINE)
BADGE = re.compile(r"badge/version-v(\d+\.\d+\.\d+)")
VERSION_REF = re.compile(r"\bv(\d+\.\d+\.\d+)\b")
ARCH_HEADER = re.compile(r"^# Architecture \(v(\d+\.\d+\.\d+)\)", re.MULTILINE)


def semver(s: str) -> tuple[int, ...]:
    return tuple(int(p) for p in s.split("."))


def main(root: Path = ROOT) -> int:
    failures = 0
    changelog = root / "CHANGELOG.md"
    if not changelog.exists():
        print("FAIL [changelog-exists] CHANGELOG.md missing")
        return 1
    text = changelog.read_text(encoding="utf-8")
    headings = HEADING.findall(text)
    if not headings:
        print("FAIL [changelog-heading] no [Unreleased] or [X.Y.Z] heading")
        return 1
    print("PASS [changelog-heading]")
    versions = [h for h in headings if h != "Unreleased"]
    latest = max(versions, key=semver) if versions else None

    if latest:
        m = re.search(rf"^## \[{re.escape(latest)}\][^\n]*\n(.*?)(?=^## |\Z)",
                      text, re.MULTILINE | re.DOTALL)
        body = m.group(1).strip() if m else ""
        if len(body) >= 100:
            print(f"PASS [changelog-body] {latest}")
        else:
            print(f"FAIL [changelog-body] entry for {latest} has "
                  f"{len(body)} chars (< 100)")
            failures += 1

    readme = (root / "README.md").read_text(encoding="utf-8")
    badges = BADGE.findall(readme)
    if latest is None:
        if badges:
            print(f"FAIL [readme-badge] version badge v{badges[0]} present "
                  "but nothing is released")
            failures += 1
        else:
            print("PASS [readme-badge] (pre-first-release, no badge)")
    elif badges and badges[0] == latest:
        print("PASS [readme-badge]")
    else:
        print(f"FAIL [readme-badge] badge {badges or 'missing'} != "
              f"latest CHANGELOG version {latest}")
        failures += 1

    scan = [root / "README.md", root / "SKILL.md",
            *sorted((root / "docs").glob("*.md"))]
    ceiling = semver(latest) if latest else None
    for path in scan:
        rel = path.relative_to(root)
        future = sorted({
            v for v in VERSION_REF.findall(path.read_text(encoding="utf-8"))
            if ceiling is None or semver(v) > ceiling
        })
        if future:
            kind = "unreleased" if ceiling is None else "future"
            print(f"FAIL [no-future-versions:{rel}] references {kind} "
                  f"version(s): {', '.join('v' + v for v in future)}")
            failures += 1
        else:
            print(f"PASS [no-future-versions:{rel}]")

    arch = root / "docs" / "ARCHITECTURE.md"
    if latest and arch.exists():
        m = ARCH_HEADER.search(arch.read_text(encoding="utf-8"))
        if not m:
            print("FAIL [arch-header] docs/ARCHITECTURE.md has no "
                  "'# Architecture (vX.Y.Z)' header")
            failures += 1
        elif m.group(1) == latest:
            print("PASS [arch-header]")
        else:
            print(f"FAIL [arch-header] header v{m.group(1)} != "
                  f"latest CHANGELOG version {latest}")
            failures += 1

    print(f"\n{'ALIGNED' if not failures else f'{failures} violation(s)'}")
    return 1 if failures else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
