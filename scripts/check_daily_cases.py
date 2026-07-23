#!/usr/bin/env python3
"""Validate browser-safe daily case fixtures.

Checks the v1 schema contract, the fourteen-day cyclic rotation, case IDs and
dates, canonical local sources, referenced background assets, and a recursive
denylist of answer/reveal-like field names. The structural checks mirror the
checked-in JSON Schema using only the Python standard library; when the
optional ``jsonschema`` package is present, full Draft 2020-12 validation is
also run.

Exit 0: all checks pass; 1: content/schema violations; 2: invocation error.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DAILY = ROOT / "web/content/daily"
SCHEMA_PATH = DAILY / "schema/daily-case-public.v1.schema.json"
ROTATION_PATH = DAILY / "rotation.json"
CASES_DIR = DAILY / "cases"

SCHEMA_REF = "../schema/daily-case-public.v1.schema.json"
MODES = {"drill", "scene", "expedition", "detective"}
DOMAINS = {"education", "health", "public", "science", "work"}
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
TOKEN = re.compile(r"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$")
CHOICE_ID = re.compile(r"^[A-Z][A-Z0-9]{0,2}$")
ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
BACKGROUND = re.compile(
    r"^web/assets/art/backgrounds/[a-z0-9-]+\.webp$"
)

TOP_FIELDS = {
    "$schema",
    "schemaVersion",
    "id",
    "publishDate",
    "locale",
    "visibility",
    "mode",
    "domain",
    "title",
    "canonicalSourcePaths",
    "content",
}
CHOICE_CONTENT_FIELDS = {"kind", "items"}
CHOICE_ITEM_FIELDS = {
    "id",
    "chapter",
    "location",
    "speaker",
    "role",
    "characterId",
    "backgroundAsset",
    "briefing",
    "evidenceTitle",
    "evidence",
    "prompt",
    "options",
}
OPTION_FIELDS = {"id", "text"}
SCENE_CONTENT_FIELDS = {"kind", "scene", "lenses", "positions", "commitments"}
SCENE_FIELDS = {
    "location",
    "speaker",
    "role",
    "characterId",
    "backgroundAsset",
    "text",
}
LENS_FIELDS = {"id", "label", "reading", "prompt", "options"}
COMMITMENT_FIELDS = {"id", "text", "objection"}

# These fields belong only in private grading records or post-commit API
# responses. Tokenization catches camelCase, snake_case, and kebab-case forms.
FORBIDDEN_FIELD_TOKENS = {
    "answer",
    "correct",
    "expected",
    "explanation",
    "feedback",
    "grade",
    "grading",
    "hint",
    "key",
    "miss",
    "rationale",
    "reveal",
    "reward",
    "score",
    "scoring",
    "solution",
    "success",
    "verdict",
}

MODE_SOURCE = {
    "drill": "modes/drill.md",
    "scene": "modes/scene.md",
    "expedition": "modes/expedition.md",
    "detective": "modes/detective.md",
}

MODE_LOCALE_SOURCE = {
    "drill": "web/content/locales/zh-TW/drill.js",
    "scene": "web/content/locales/zh-TW/scene.js",
    "expedition": "web/content/locales/zh-TW/expedition.js",
    "detective": "web/content/locales/zh-TW/detective.js",
}


def add(errors: list[str], where: str, message: str) -> None:
    errors.append(f"[{where}] {message}")


def load_json(path: Path, errors: list[str]) -> Any | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        add(errors, path.relative_to(ROOT).as_posix(), "file is missing")
    except json.JSONDecodeError as exc:
        add(
            errors,
            path.relative_to(ROOT).as_posix(),
            f"invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}",
        )
    return None


def exact_fields(
    value: Any, expected: set[str], where: str, errors: list[str]
) -> bool:
    if not isinstance(value, dict):
        add(errors, where, "must be an object")
        return False
    actual = set(value)
    missing = sorted(expected - actual)
    extra = sorted(actual - expected)
    if missing:
        add(errors, where, f"missing field(s): {', '.join(missing)}")
    if extra:
        add(errors, where, f"unknown field(s): {', '.join(extra)}")
    return not missing and not extra


def nonempty_text(value: Any, where: str, errors: list[str]) -> bool:
    if not isinstance(value, str) or not value.strip():
        add(errors, where, "must be a non-empty string")
        return False
    return True


def parse_date(value: Any, where: str, errors: list[str]) -> date | None:
    if not isinstance(value, str) or not ISO_DATE.fullmatch(value):
        add(errors, where, "must be an ISO YYYY-MM-DD date")
        return None
    try:
        return date.fromisoformat(value)
    except ValueError:
        add(errors, where, f"is not a real calendar date: {value!r}")
        return None


def field_tokens(name: str) -> set[str]:
    spaced = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", name)
    return {part.lower() for part in re.split(r"[^A-Za-z0-9]+", spaced) if part}


def check_forbidden_fields(value: Any, where: str, errors: list[str]) -> None:
    if isinstance(value, dict):
        for key, nested in value.items():
            matched = field_tokens(key) & FORBIDDEN_FIELD_TOKENS
            if matched:
                add(
                    errors,
                    f"{where}.{key}",
                    "public payload uses private/reveal-like field token(s): "
                    + ", ".join(sorted(matched)),
                )
            check_forbidden_fields(nested, f"{where}.{key}", errors)
    elif isinstance(value, list):
        for index, nested in enumerate(value):
            check_forbidden_fields(nested, f"{where}[{index}]", errors)


def check_schema_shape(schema: Any, errors: list[str]) -> None:
    where = SCHEMA_PATH.relative_to(ROOT).as_posix()
    if not isinstance(schema, dict):
        add(errors, where, "schema root must be an object")
        return
    if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
        add(errors, where, "must declare JSON Schema Draft 2020-12")
    if schema.get("$id") != "daily-case-public.v1.schema.json":
        add(errors, where, "must carry the stable versioned v1 $id")
    if schema.get("type") != "object" or schema.get("additionalProperties") is not False:
        add(errors, where, "root must be a closed object schema")

    required = schema.get("required")
    if not isinstance(required, list) or set(required) != TOP_FIELDS - {"domain"}:
        add(errors, where, "root required fields do not match the v1 contract")
    properties = schema.get("properties")
    if not isinstance(properties, dict) or set(properties) != TOP_FIELDS:
        add(errors, where, "root properties do not match the v1 contract")
        return
    if properties.get("schemaVersion", {}).get("const") != 1:
        add(errors, where, "schemaVersion must be pinned to 1")
    if properties.get("visibility", {}).get("const") != "public":
        add(errors, where, "visibility must be pinned to public")
    if set(properties.get("mode", {}).get("enum", [])) != MODES:
        add(errors, where, "mode enum must contain exactly the four game modes")
    if set(properties.get("domain", {}).get("enum", [])) != DOMAINS:
        add(errors, where, "domain enum must contain exactly the five case domains")

    defs = schema.get("$defs")
    expected_defs = {
        "slug",
        "token",
        "choiceId",
        "nonEmptyText",
        "backgroundAsset",
        "option",
        "choiceItem",
        "choiceSequence",
        "sceneHeader",
        "lens",
        "commitment",
        "multiLensScene",
    }
    if not isinstance(defs, dict) or not expected_defs.issubset(defs):
        add(errors, where, "schema lacks one or more required v1 definitions")
        return
    for definition in (
        "option",
        "choiceItem",
        "choiceSequence",
        "sceneHeader",
        "lens",
        "commitment",
        "multiLensScene",
    ):
        if defs.get(definition, {}).get("additionalProperties") is not False:
            add(errors, where, f"$defs/{definition} must reject unknown fields")

    scene = defs.get("multiLensScene", {}).get("properties", {})
    for field, count in (("lenses", 6), ("positions", 3), ("commitments", 3)):
        spec = scene.get(field, {})
        if spec.get("minItems") != count or spec.get("maxItems") != count:
            add(errors, where, f"scene {field} must contain exactly {count} entries")

    try:
        from jsonschema import Draft202012Validator  # type: ignore[import-not-found]
    except ImportError:
        return
    try:
        Draft202012Validator.check_schema(schema)
    except Exception as exc:  # jsonschema raises a hierarchy of schema errors
        add(errors, where, f"Draft 2020-12 meta-schema validation failed: {exc}")


def check_background(value: Any, where: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not BACKGROUND.fullmatch(value):
        add(errors, where, "must be a canonical background asset path")
        return
    if not (ROOT / value).is_file():
        add(errors, where, f"referenced background does not exist: {value}")


def check_choice_item(item: Any, where: str, errors: list[str]) -> str | None:
    if not exact_fields(item, CHOICE_ITEM_FIELDS, where, errors):
        if not isinstance(item, dict):
            return None
    assert isinstance(item, dict)
    item_id = item.get("id")
    if not isinstance(item_id, str) or not SLUG.fullmatch(item_id):
        add(errors, f"{where}.id", "must be a kebab-case slug")
        item_id = None
    for field in (
        "chapter",
        "location",
        "speaker",
        "role",
        "briefing",
        "evidenceTitle",
        "evidence",
        "prompt",
    ):
        nonempty_text(item.get(field), f"{where}.{field}", errors)
    character = item.get("characterId")
    if not isinstance(character, str) or not TOKEN.fullmatch(character):
        add(errors, f"{where}.characterId", "must be a snake_case token")
    check_background(item.get("backgroundAsset"), f"{where}.backgroundAsset", errors)

    options = item.get("options")
    if not isinstance(options, list) or not 2 <= len(options) <= 6:
        add(errors, f"{where}.options", "must contain 2-6 choices")
    else:
        option_ids: list[str] = []
        for index, option in enumerate(options):
            option_where = f"{where}.options[{index}]"
            if not exact_fields(option, OPTION_FIELDS, option_where, errors):
                if not isinstance(option, dict):
                    continue
            assert isinstance(option, dict)
            option_id = option.get("id")
            if not isinstance(option_id, str) or not CHOICE_ID.fullmatch(option_id):
                add(errors, f"{option_where}.id", "must be an uppercase choice ID")
            else:
                option_ids.append(option_id)
            nonempty_text(option.get("text"), f"{option_where}.text", errors)
        if len(option_ids) != len(set(option_ids)):
            add(errors, f"{where}.options", "choice IDs must be unique")
    return item_id


def check_choice_content(content: Any, where: str, errors: list[str]) -> None:
    if not exact_fields(content, CHOICE_CONTENT_FIELDS, where, errors):
        if not isinstance(content, dict):
            return
    assert isinstance(content, dict)
    if content.get("kind") != "choice-sequence":
        add(errors, f"{where}.kind", "must be choice-sequence")
    items = content.get("items")
    if not isinstance(items, list) or not items:
        add(errors, f"{where}.items", "must be a non-empty array")
        return
    item_ids = [
        item_id
        for index, item in enumerate(items)
        if (item_id := check_choice_item(item, f"{where}.items[{index}]", errors))
    ]
    if len(item_ids) != len(set(item_ids)):
        add(errors, f"{where}.items", "item IDs must be unique within a case")


def check_scene_content(content: Any, where: str, errors: list[str]) -> None:
    if not exact_fields(content, SCENE_CONTENT_FIELDS, where, errors):
        if not isinstance(content, dict):
            return
    assert isinstance(content, dict)
    if content.get("kind") != "multi-lens-scene":
        add(errors, f"{where}.kind", "must be multi-lens-scene")

    scene = content.get("scene")
    if exact_fields(scene, SCENE_FIELDS, f"{where}.scene", errors):
        assert isinstance(scene, dict)
        for field in ("location", "speaker", "role", "text"):
            nonempty_text(scene.get(field), f"{where}.scene.{field}", errors)
        character = scene.get("characterId")
        if not isinstance(character, str) or not TOKEN.fullmatch(character):
            add(errors, f"{where}.scene.characterId", "must be a snake_case token")
        check_background(
            scene.get("backgroundAsset"), f"{where}.scene.backgroundAsset", errors
        )

    lenses = content.get("lenses")
    if not isinstance(lenses, list) or len(lenses) != 6:
        add(errors, f"{where}.lenses", "must contain exactly six lenses")
    else:
        lens_ids: list[str] = []
        for index, lens in enumerate(lenses):
            lens_where = f"{where}.lenses[{index}]"
            if not exact_fields(lens, LENS_FIELDS, lens_where, errors):
                if not isinstance(lens, dict):
                    continue
            assert isinstance(lens, dict)
            lens_id = lens.get("id")
            if not isinstance(lens_id, str) or not TOKEN.fullmatch(lens_id):
                add(errors, f"{lens_where}.id", "must be a snake_case token")
            else:
                lens_ids.append(lens_id)
            for field in ("label", "reading", "prompt"):
                nonempty_text(lens.get(field), f"{lens_where}.{field}", errors)
            options = lens.get("options")
            if not isinstance(options, list) or len(options) < 2:
                add(errors, f"{lens_where}.options", "must contain at least two choices")
            else:
                for option_index, option in enumerate(options):
                    nonempty_text(
                        option, f"{lens_where}.options[{option_index}]", errors
                    )
        if len(lens_ids) != len(set(lens_ids)):
            add(errors, f"{where}.lenses", "lens IDs must be unique")

    positions = content.get("positions")
    if not isinstance(positions, list) or len(positions) != 3:
        add(errors, f"{where}.positions", "must contain exactly three positions")
    else:
        for index, position in enumerate(positions):
            nonempty_text(position, f"{where}.positions[{index}]", errors)

    commitments = content.get("commitments")
    if not isinstance(commitments, list) or len(commitments) != 3:
        add(errors, f"{where}.commitments", "must contain exactly three commitments")
    else:
        commitment_ids: list[str] = []
        for index, commitment in enumerate(commitments):
            commitment_where = f"{where}.commitments[{index}]"
            if not exact_fields(
                commitment, COMMITMENT_FIELDS, commitment_where, errors
            ):
                if not isinstance(commitment, dict):
                    continue
            assert isinstance(commitment, dict)
            commitment_id = commitment.get("id")
            if not isinstance(commitment_id, str) or not CHOICE_ID.fullmatch(
                commitment_id
            ):
                add(errors, f"{commitment_where}.id", "must be an uppercase choice ID")
            else:
                commitment_ids.append(commitment_id)
            nonempty_text(commitment.get("text"), f"{commitment_where}.text", errors)
            nonempty_text(
                commitment.get("objection"),
                f"{commitment_where}.objection",
                errors,
            )
        if len(commitment_ids) != len(set(commitment_ids)):
            add(errors, f"{where}.commitments", "commitment IDs must be unique")


def check_sources(case: dict[str, Any], where: str, errors: list[str]) -> None:
    sources = case.get("canonicalSourcePaths")
    if not isinstance(sources, list) or len(sources) < 2:
        add(errors, f"{where}.canonicalSourcePaths", "must contain at least two paths")
        return
    if len(sources) != len(set(source for source in sources if isinstance(source, str))):
        add(errors, f"{where}.canonicalSourcePaths", "paths must be unique")
    for index, source in enumerate(sources):
        source_where = f"{where}.canonicalSourcePaths[{index}]"
        if not isinstance(source, str):
            add(errors, source_where, "must be a string")
            continue
        if source.startswith("/") or ".." in Path(source).parts:
            add(errors, source_where, "must be a repository-relative path without traversal")
            continue
        if not re.fullmatch(
            r"(?:modes|shared|expeditions|web/content)/[A-Za-z0-9._/-]+\.(?:md|js)",
            source,
        ):
            add(errors, source_where, f"path is outside canonical source roots: {source}")
            continue
        if not (ROOT / source).is_file():
            add(errors, source_where, f"declared canonical source is missing: {source}")
    mode = case.get("mode")
    required_mode_source = MODE_SOURCE.get(mode)
    if required_mode_source and required_mode_source not in sources:
        add(errors, f"{where}.canonicalSourcePaths", f"must include {required_mode_source}")
    required_locale_source = MODE_LOCALE_SOURCE.get(mode)
    if required_locale_source and required_locale_source not in sources:
        add(
            errors,
            f"{where}.canonicalSourcePaths",
            f"must include directly authored locale source {required_locale_source}",
        )
    if mode == "expedition" and not any(
        isinstance(source, str) and source.startswith("expeditions/")
        for source in sources
    ):
        add(errors, f"{where}.canonicalSourcePaths", "Expedition must declare a verified pack")


def check_case(case: Any, path: Path, schema: Any, errors: list[str]) -> None:
    where = path.relative_to(ROOT).as_posix()
    if not exact_fields(case, TOP_FIELDS, where, errors):
        if not isinstance(case, dict):
            return
    assert isinstance(case, dict)
    check_forbidden_fields(case, where, errors)

    if case.get("$schema") != SCHEMA_REF:
        add(errors, f"{where}.$schema", f"must be {SCHEMA_REF!r}")
    if type(case.get("schemaVersion")) is not int or case.get("schemaVersion") != 1:
        add(errors, f"{where}.schemaVersion", "must be integer 1")
    case_id = case.get("id")
    if not isinstance(case_id, str) or not SLUG.fullmatch(case_id):
        add(errors, f"{where}.id", "must be a kebab-case slug")
    elif path.stem != case_id:
        add(errors, f"{where}.id", f"must equal filename stem {path.stem!r}")
    published = parse_date(case.get("publishDate"), f"{where}.publishDate", errors)
    if published and isinstance(case_id, str):
        if not case_id.startswith(f"daily-{published.isoformat()}-"):
            add(errors, f"{where}.id", "must include its publishDate after daily-")
    if case.get("locale") != "zh-Hant-TW":
        add(errors, f"{where}.locale", "sample rotation locale must be zh-Hant-TW")
    if case.get("visibility") != "public":
        add(errors, f"{where}.visibility", "must be public")
    mode = case.get("mode")
    if mode not in MODES:
        add(errors, f"{where}.mode", "must be one of the four game modes")
    if case.get("domain") not in DOMAINS:
        add(errors, f"{where}.domain", "must be one of the five case domains")
    nonempty_text(case.get("title"), f"{where}.title", errors)
    check_sources(case, where, errors)

    content = case.get("content")
    if mode == "scene":
        check_scene_content(content, f"{where}.content", errors)
    elif mode in MODES:
        check_choice_content(content, f"{where}.content", errors)

    # Full schema validation is additive. Manual validation remains authoritative
    # in clean environments that intentionally install no Python dependencies.
    try:
        from jsonschema import Draft202012Validator, FormatChecker  # type: ignore[import-not-found]
    except ImportError:
        return
    if isinstance(schema, dict):
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        for violation in sorted(
            validator.iter_errors(case),
            key=lambda item: tuple(str(part) for part in item.path),
        ):
            location = ".".join(str(part) for part in violation.path)
            add(errors, f"{where}{'.' if location else ''}{location}", violation.message)


def check_rotation(rotation: Any, cases: dict[str, Any], errors: list[str]) -> None:
    where = ROTATION_PATH.relative_to(ROOT).as_posix()
    fields = {
        "schemaVersion",
        "id",
        "timeZone",
        "strategy",
        "cycleAnchorDate",
        "entries",
    }
    if not exact_fields(rotation, fields, where, errors):
        if not isinstance(rotation, dict):
            return
    assert isinstance(rotation, dict)
    if type(rotation.get("schemaVersion")) is not int or rotation.get("schemaVersion") != 1:
        add(errors, f"{where}.schemaVersion", "must be integer 1")
    rotation_id = rotation.get("id")
    if not isinstance(rotation_id, str) or not SLUG.fullmatch(rotation_id):
        add(errors, f"{where}.id", "must be a kebab-case slug")
    if rotation.get("timeZone") != "Asia/Taipei":
        add(errors, f"{where}.timeZone", "must be Asia/Taipei")
    if rotation.get("strategy") != "cyclic":
        add(errors, f"{where}.strategy", "must be cyclic")
    anchor = parse_date(rotation.get("cycleAnchorDate"), f"{where}.cycleAnchorDate", errors)

    entries = rotation.get("entries")
    if not isinstance(entries, list) or len(entries) != 14:
        add(errors, f"{where}.entries", "must contain exactly fourteen seed days")
        return
    seen_dates: set[str] = set()
    seen_ids: set[str] = set()
    seen_paths: set[str] = set()
    seen_modes: set[str] = set()
    for index, entry in enumerate(entries):
        entry_where = f"{where}.entries[{index}]"
        if not exact_fields(entry, {"date", "caseId", "path"}, entry_where, errors):
            if not isinstance(entry, dict):
                continue
        assert isinstance(entry, dict)
        entry_date = parse_date(entry.get("date"), f"{entry_where}.date", errors)
        if anchor and entry_date and entry_date != anchor + timedelta(days=index):
            add(errors, f"{entry_where}.date", "must be consecutive from cycleAnchorDate")
        case_id = entry.get("caseId")
        if not isinstance(case_id, str) or not SLUG.fullmatch(case_id):
            add(errors, f"{entry_where}.caseId", "must be a kebab-case slug")
        path_value = entry.get("path")
        expected_path = f"cases/{case_id}.json" if isinstance(case_id, str) else None
        if not isinstance(path_value, str) or path_value != expected_path:
            add(errors, f"{entry_where}.path", f"must equal {expected_path!r}")

        if isinstance(entry.get("date"), str):
            if entry["date"] in seen_dates:
                add(errors, f"{entry_where}.date", "duplicate rotation date")
            seen_dates.add(entry["date"])
        if isinstance(case_id, str):
            if case_id in seen_ids:
                add(errors, f"{entry_where}.caseId", "duplicate case ID")
            seen_ids.add(case_id)
        if isinstance(path_value, str):
            if path_value in seen_paths:
                add(errors, f"{entry_where}.path", "duplicate case path")
            seen_paths.add(path_value)

        case = cases.get(path_value) if isinstance(path_value, str) else None
        if case is None:
            add(errors, f"{entry_where}.path", "does not reference a discovered case file")
        elif isinstance(case, dict):
            if case.get("id") != case_id:
                add(errors, f"{entry_where}.caseId", "does not match the case bundle id")
            if case.get("publishDate") != entry.get("date"):
                add(errors, f"{entry_where}.date", "does not match bundle publishDate")
            if case.get("mode") in MODES:
                seen_modes.add(case["mode"])

    if seen_modes != MODES:
        add(
            errors,
            f"{where}.entries",
            "rotation fixture must cover all four modes; found "
            + ", ".join(sorted(seen_modes)),
        )

    discovered = {
        path.relative_to(DAILY).as_posix() for path in sorted(CASES_DIR.glob("*.json"))
    }
    if discovered != seen_paths:
        orphaned = sorted(discovered - seen_paths)
        missing = sorted(seen_paths - discovered)
        if orphaned:
            add(errors, where, f"case file(s) absent from rotation: {', '.join(orphaned)}")
        if missing:
            add(errors, where, f"rotation path(s) absent on disk: {', '.join(missing)}")


def main() -> int:
    errors: list[str] = []
    schema = load_json(SCHEMA_PATH, errors)
    rotation = load_json(ROTATION_PATH, errors)
    if schema is not None:
        check_schema_shape(schema, errors)

    cases: dict[str, Any] = {}
    if CASES_DIR.is_dir():
        for path in sorted(CASES_DIR.glob("*.json")):
            case = load_json(path, errors)
            if case is not None:
                relative = path.relative_to(DAILY).as_posix()
                cases[relative] = case
                check_case(case, path, schema, errors)
    else:
        add(errors, CASES_DIR.relative_to(ROOT).as_posix(), "directory is missing")

    if rotation is not None:
        check_rotation(rotation, cases, errors)

    if errors:
        for error in errors:
            print(f"FAIL {error}")
        print(f"\n{len(errors)} daily case violation(s)")
        return 1
    print(
        "PASS [daily-cases] "
        f"{len(cases)} public cases; four-mode v1 schema; "
        "14-day Taipei cycle; no answer/reveal fields"
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
