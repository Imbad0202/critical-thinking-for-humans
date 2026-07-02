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
6. Package metadata: .claude-plugin/plugin.json `version` and every plugin
   `version` in .claude-plugin/marketplace.json equal the latest CHANGELOG
   version. Invariant 4 never sees these files (they are JSON, not scanned
   docs), so an unbumped manifest ships a stale version to the marketplace
   with a green CI unless checked here.
7. README carries a `## What's new in vX.Y.Z` section whose version equals
   the latest CHANGELOG version.
8. README carries a `**Last Updated:** YYYY-MM-DD` stamp. With --release the
   date must also be within 7 days of today (tag-time freshness; not checked
   on ordinary pushes, which legitimately leave the stamp alone).

Flags (release-time gates, run by the tag workflow):
  --release      enable the Last-Updated freshness window (invariant 8b)
  --tag vX.Y.Z   assert the tag being cut equals the latest CHANGELOG version

Exit 0 aligned; 1 violations; 2 invocation error.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEADING = re.compile(r"^## \[(Unreleased|\d+\.\d+\.\d+)\]", re.MULTILINE)
BADGE = re.compile(r"badge/version-v(\d+\.\d+\.\d+)")
VERSION_REF = re.compile(r"\bv(\d+\.\d+\.\d+)\b")
ARCH_HEADER = re.compile(r"^# Architecture \(v(\d+\.\d+\.\d+)\)", re.MULTILINE)
WHATS_NEW = re.compile(r"^## What's new in v(\d+\.\d+\.\d+)", re.MULTILINE)
LAST_UPDATED = re.compile(r"\*\*Last Updated:\*\* (\d{4}-\d{2}-\d{2})")


def semver(s: str) -> tuple[int, ...]:
    return tuple(int(p) for p in s.split("."))


def main(root: Path = ROOT, release: bool = False, tag: str | None = None) -> int:
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

    plugin = root / ".claude-plugin" / "plugin.json"
    if latest and plugin.exists():
        v = json.loads(plugin.read_text(encoding="utf-8")).get("version")
        if v == latest:
            print("PASS [plugin-version]")
        else:
            print(f"FAIL [plugin-version] plugin.json version {v!r} != "
                  f"latest CHANGELOG version {latest}")
            failures += 1

    market = root / ".claude-plugin" / "marketplace.json"
    if latest and market.exists():
        plugins = json.loads(market.read_text(encoding="utf-8")).get(
            "plugins", [])
        stale = [p.get("version") for p in plugins
                 if p.get("version") != latest]
        if plugins and not stale:
            print("PASS [marketplace-version]")
        else:
            print(f"FAIL [marketplace-version] marketplace.json plugin "
                  f"version(s) {stale or '(none listed)'} != "
                  f"latest CHANGELOG version {latest}")
            failures += 1

    if latest:

        m = WHATS_NEW.search(readme)
        if not m:
            print("FAIL [readme-whats-new] README has no "
                  "\"## What's new in vX.Y.Z\" section")
            failures += 1
        elif m.group(1) == latest:
            print("PASS [readme-whats-new]")
        else:
            print(f"FAIL [readme-whats-new] section v{m.group(1)} != "
                  f"latest CHANGELOG version {latest}")
            failures += 1

        m = LAST_UPDATED.search(readme)
        if not m:
            print("FAIL [readme-last-updated] README has no "
                  "'**Last Updated:** YYYY-MM-DD' stamp")
            failures += 1
        else:
            print("PASS [readme-last-updated]")
            if release:
                age = abs((date.today() - date.fromisoformat(m.group(1))).days)
                if age <= 7:
                    print("PASS [readme-last-updated-fresh]")
                else:
                    print(f"FAIL [readme-last-updated-fresh] stamp "
                          f"{m.group(1)} is {age} days from today (> 7); "
                          "update it before tagging")
                    failures += 1

    if tag is not None:
        want = tag.removeprefix("v")
        if latest and want == latest:
            print("PASS [tag-matches-changelog]")
        else:
            print(f"FAIL [tag-matches-changelog] tag {tag} != latest "
                  f"CHANGELOG version {latest or '(nothing released)'}")
            failures += 1

    print(f"\n{'ALIGNED' if not failures else f'{failures} violation(s)'}")
    return 1 if failures else 0


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Release-doc alignment lint")
    parser.add_argument("--release", action="store_true",
                        help="enable release-time gates (Last-Updated "
                             "freshness window)")
    parser.add_argument("--tag", metavar="vX.Y.Z",
                        help="assert this tag equals the latest CHANGELOG "
                             "version")
    ns = parser.parse_args()  # exits 2 on unknown/malformed arguments
    try:
        sys.exit(main(release=ns.release, tag=ns.tag))
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
