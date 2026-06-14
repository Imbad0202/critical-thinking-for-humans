#!/usr/bin/env python3
"""Manifest parse lint — the manifests must be machine-readable.

A critical-thinking skill that cannot itself pass "can a machine read your
manifest?" is a contradiction in terms. This gate parses every file a strict
loader or marketplace validator will parse, and fails on the kind of error
(an unquoted YAML value whose colon reads as a second mapping key, a raw
control character in a JSON string) that renders visually fine on GitHub but
breaks discovery and install.

Invariants:
1. Each SKILL.md (root + every platform overlay) has a YAML frontmatter block
   that parses, with non-empty `name` and `description` string fields.
2. .claude-plugin/plugin.json parses as JSON with `name` and `version`.
3. .claude-plugin/marketplace.json parses as JSON with `name` and `plugins`.
4. The same SKILL.md inside the built claude.ai zip parses too (caught only if
   the zip exists; the zip build runs after this gate in CI).

Exit 0 all parse; 1 a manifest is unreadable; 2 invocation error
(including PyYAML missing — this gate requires a real YAML parser, never a
hand-rolled one, since a half parser is exactly what lets a broken file pass).
"""
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse_frontmatter(text: str, yaml_mod):
    """Return the parsed frontmatter dict, or raise.

    The closing delimiter must be matched as a whole `---` line, not a `---`
    substring: a folded scalar value may legitimately contain `---`, and
    splitting on the substring would treat that as the end of frontmatter,
    parsing only a prefix (or passing a file that never actually closes).
    """
    lines = text.splitlines()
    if not lines or lines[0].rstrip() != "---":
        raise ValueError("no YAML frontmatter (first line is not ---)")
    for i in range(1, len(lines)):
        if lines[i].rstrip() == "---":
            return yaml_mod.safe_load("\n".join(lines[1:i]))
    raise ValueError("frontmatter not closed by a --- line")


def check_skill_md(rel: str, text: str, yaml_mod) -> list[str]:
    errors = []
    try:
        d = parse_frontmatter(text, yaml_mod)
    except Exception as exc:
        return [f"{rel}: frontmatter does not parse — "
                f"{type(exc).__name__}: {exc}"]
    if not isinstance(d, dict):
        return [f"{rel}: frontmatter is not a mapping (got {type(d).__name__})"]
    for field in ("name", "description"):
        val = d.get(field)
        if not isinstance(val, str) or not val.strip():
            errors.append(f"{rel}: `{field}` missing or not a non-empty string")
    return errors


def check_json(rel: str, raw: bytes, required: tuple[str, ...]) -> list[str]:
    try:
        d = json.loads(raw)
    except Exception as exc:
        return [f"{rel}: does not parse as JSON — "
                f"{type(exc).__name__}: {exc}"]
    if not isinstance(d, dict):
        return [f"{rel}: top-level value is not an object"]
    return [f"{rel}: missing required key `{k}`"
            for k in required if k not in d]


def main(root: Path = ROOT) -> int:
    try:
        import yaml as yaml_mod
    except ImportError:
        print("ERROR: PyYAML not installed; this gate needs a real YAML "
              "parser (pip install pyyaml)", file=sys.stderr)
        return 2

    failures: list[str] = []

    skill_mds = [root / "SKILL.md", *sorted(root.glob("platforms/*/SKILL.md"))]
    for path in skill_mds:
        if not path.exists():
            continue
        rel = str(path.relative_to(root))
        errs = check_skill_md(rel, path.read_text(encoding="utf-8"), yaml_mod)
        failures += errs
        print(f"{'FAIL' if errs else 'PASS'} [skill-frontmatter:{rel}]")

    json_checks = [
        (".claude-plugin/plugin.json", ("name", "version")),
        (".claude-plugin/marketplace.json", ("name", "plugins")),
    ]
    for relpath, required in json_checks:
        path = root / relpath
        if not path.exists():
            print(f"FAIL [manifest-json:{relpath}] missing")
            failures.append(f"{relpath}: missing")
            continue
        errs = check_json(relpath, path.read_bytes(), required)
        failures += errs
        print(f"{'FAIL' if errs else 'PASS'} [manifest-json:{relpath}]")

    zip_path = root / "dist" / "critical-thinking-for-humans-claude-ai.zip"
    if zip_path.exists():
        try:
            with zipfile.ZipFile(zip_path) as zf:
                names = [n for n in zf.namelist() if n.endswith("SKILL.md")]
                # An empty match means the build shipped a zip with no manifest
                # (layout change, renamed/omitted SKILL.md). That must FAIL, not
                # vacuously pass — a zip whose SKILL.md is gone is exactly the
                # broken artifact this gate exists to catch.
                if not names:
                    print("FAIL [zip-frontmatter] zip contains no SKILL.md "
                          "member")
                    failures.append("zip: no SKILL.md member")
                for name in names:
                    text = zf.read(name).decode("utf-8")
                    errs = check_skill_md(f"zip:{name}", text, yaml_mod)
                    failures += errs
                    print(f"{'FAIL' if errs else 'PASS'} "
                          f"[zip-frontmatter:{name}]")
        except Exception as exc:
            print(f"FAIL [zip-readable] {type(exc).__name__}: {exc}")
            failures.append(f"zip unreadable: {exc}")
    else:
        print("SKIP [zip-frontmatter] (zip not built yet; built after this "
              "gate in CI)")

    if failures:
        for f in failures:
            print(f"  - {f}")
        print(f"\n{len(failures)} unreadable manifest(s)")
        return 1
    print("\nALL MANIFESTS PARSE")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
