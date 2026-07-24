#!/usr/bin/env python3
"""Fail fast when the fixed Web demo drifts from its declared local sources."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
REQUIRED_VERCEL_IGNORE_RULES = {".private/", ".env*"}
REQUIRED_GIT_IGNORE_RULES = {"web/.private/", ".env*", "!.env.example"}


def fail(message: str) -> None:
    print(f"FAIL [web-content] {message}", file=sys.stderr)
    raise SystemExit(1)


def check_deployment_boundary(web: Path) -> None:
    """Keep local-only records out of Vercel uploads and local HTTP serving."""
    gitignore_path = web.parent / ".gitignore"
    gitignore_rules = {
        line.strip()
        for line in gitignore_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }
    missing_git_rules = sorted(REQUIRED_GIT_IGNORE_RULES - gitignore_rules)
    if missing_git_rules:
        fail(f".gitignore missing protected rules: {', '.join(missing_git_rules)}")

    ignore_path = web / ".vercelignore"
    if not ignore_path.is_file():
        fail("missing web/.vercelignore deployment boundary")

    rules = {
        line.strip()
        for line in ignore_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }
    missing_rules = sorted(REQUIRED_VERCEL_IGNORE_RULES - rules)
    if missing_rules:
        fail(f"web/.vercelignore missing protected rules: {', '.join(missing_rules)}")
    unsafe_negations = sorted(rule for rule in rules if rule.startswith("!"))
    if unsafe_negations:
        fail(
            "web/.vercelignore uses re-inclusion rules that could reopen protected paths: "
            + ", ".join(unsafe_negations)
        )

    server_docs = [
        web.parent / "README.md",
        web / "README.md",
        *sorted((web / "docs").glob("*.md")),
        *sorted((web / "tests").glob("*.py")),
    ]
    for path in server_docs:
        for line_number, line in enumerate(
            path.read_text(encoding="utf-8").splitlines(), start=1
        ):
            if (
                "python -m http.server" in line
                and "--bind 127.0.0.1" not in line
            ):
                rel = path.relative_to(web.parent).as_posix()
                fail(f"{rel}:{line_number} documents an externally bound local server")


def main() -> None:
    required = [
        WEB / ".vercelignore",
        WEB / "index.html",
        WEB / "src/casebook.css",
        WEB / "standalone/game-app.js",
        WEB / "standalone/game-feedback.js",
        WEB / "standalone/game-music.js",
        WEB / "content/demo-cases.js",
        WEB / "assets/audio/gaslight-inquiry.mp3",
        WEB / "assets/art/manifest.json",
        WEB / "api/daily.mjs",
        WEB / "api/answer.mjs",
        WEB / "api/cron/publish-daily.mjs",
        WEB / "server/daily-service.mjs",
        WEB / "content/daily/rotation.json",
        WEB / "content/daily/schema/daily-case-public.v1.schema.json",
        WEB / "package.json",
        WEB / "package-lock.json",
        WEB / "vercel.json",
    ]
    missing = [path.relative_to(ROOT).as_posix() for path in required if not path.is_file()]
    if missing:
        fail(f"missing runtime files: {', '.join(missing)}")

    check_deployment_boundary(WEB)

    index = (WEB / "index.html").read_text(encoding="utf-8")
    if "/dist/" in index or '"./dist/' in index:
        fail("web/index.html depends on ignored dist output; a clean clone would break")

    for relative in re.findall(r'(?:href|src)="\./([^"?#]+)', index):
        target = WEB / relative
        if not target.is_file():
            fail(f"entry references missing file: web/{relative}")

    content_files = [WEB / "content/demo-cases.js", *sorted((WEB / "content/locales").glob("*/*.js"))]
    content = "\n".join(path.read_text(encoding="utf-8") for path in content_files)
    registry = (WEB / "content/demo-cases.js").read_text(encoding="utf-8")
    plugin = json.loads((ROOT / ".claude-plugin/plugin.json").read_text(encoding="utf-8"))
    match = re.search(r"skillVersion:\s*'([^']+)'", registry)
    if not match:
        fail("demo content does not declare skillVersion")
    if match.group(1) != plugin.get("version"):
        fail(f"demo skillVersion {match.group(1)} != plugin version {plugin.get('version')}")

    mode_ids = re.findall(r"^\s{4}(drill|scene|expedition|detective):\s*\{", registry, flags=re.MULTILINE)
    if sorted(set(mode_ids)) != ["detective", "drill", "expedition", "scene"]:
        fail(f"four-mode registry incomplete: {sorted(set(mode_ids))}")

    declared_sources = sorted(set(re.findall(r"'(modes/[^']+\.md|shared/[^']+\.md|expeditions/[^']+\.md)'", content)))
    if not declared_sources:
        fail("demo cases declare no canonical source paths")
    missing_sources = [source for source in declared_sources if not (ROOT / source).is_file()]
    if missing_sources:
        fail(f"declared canonical sources missing: {', '.join(missing_sources)}")

    art_manifest = json.loads((WEB / "assets/art/manifest.json").read_text(encoding="utf-8"))
    manifest_paths = {item.get("file") for item in art_manifest.get("assets", [])}
    referenced_art = set(re.findall(r"(?:background|background:|backgrounds/)['`\"]?[:(]?\s*['`\"]([^'`\"]+\.webp)", content))
    for filename in referenced_art:
        if not any(path and path.endswith(f"/{filename}") for path in manifest_paths):
            fail(f"content references art absent from manifest: {filename}")

    thumbnails = sorted(set(re.findall(r"thumbnail:\s*'([^']+\.webp)'", content)))
    if len(thumbnails) != 4:
        fail(f"expected four unique optimized selector thumbnails, found {len(thumbnails)}")
    for thumbnail in thumbnails:
        if not (WEB / "assets/art" / thumbnail).is_file():
            fail(f"missing optimized selector thumbnail: {thumbnail}")

    print(f"PASS [web-content] 4 modes; {len(declared_sources)} canonical sources; clean-clone entry intact")


if __name__ == "__main__":
    main()
