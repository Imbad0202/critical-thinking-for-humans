#!/usr/bin/env python3
"""Structural lint for expedition packs (expeditions/*.md).

Mechanical checks against expeditions/PACK-SCHEMA.md: required sections,
discipline-tag vocabulary, audit-target count, provenance markers. Presence
and shape only — first-party verification of pack CONTENT stays a human
authoring duty and cannot be linted.

Exit 0 all packs pass; 1 violations; 2 invocation error.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_SECTIONS = [
    "problem",
    "history",
    "solution_provenance",
    "step_graph",
    "breakthrough",
    "audit_targets",
]
# The Six Disciplines plus the zeroth move (modes/expedition.md).
VALID_DISCIPLINES = {
    "lemma_decomposition",
    "representation_shift",
    "small_case_probe",
    "kill_criteria",
    "shape_question",
    "milestone_rewrite",
    "search_first",
}
SNAKE_TOKEN = re.compile(r"`([a-z]+(?:_[a-z]+)+)`")
STEP_BULLET = re.compile(r"^- \*\*S\d+", re.MULTILINE)
AUDIT_BULLET = re.compile(r"^- \*\*T\d+", re.MULTILINE)
FORECAST_BULLET = re.compile(r"^- \*\*F\d+", re.MULTILINE)
PROVENANCE_MARKER = re.compile(r"arXiv|doi|https?://|LNCS|ISBN", re.IGNORECASE)
# A pack "declares a forecaster role fit" when its prose says so (PACK-SCHEMA.md,
# Role-Conditional Fields). Matched loosely — "a forecaster pack", "forecaster
# exercise", "forecaster-role pack" — so the required calibration_key field is
# gated on the pack's own self-declaration, not on a separate metadata knob.
FORECASTER_DECL = re.compile(r"forecaster[\s-]+(?:pack|exercise|role)|"
                             r"is a \*?forecaster", re.IGNORECASE)
# The three rubric bands calibration_key must tag per forecast target, matched
# as structured labels (like audit_targets' *Objection:* / *Resolution*) rather
# than as free-text tokens — a label survives prose line-wrapping, a bare word
# does not, and the intro naming all three in prose must not satisfy a bullet.
# The `-\s*` inside each label absorbs a hard-wrap that splits "Over-\nconfident".
CALIBRATION_LABELS = (
    ("*Calibrated:*", re.compile(r"\*Calibrated:\*")),
    ("*Over-confident:*", re.compile(r"\*Over-\s*confident:\*")),
    ("*Under-confident:*", re.compile(r"\*Under-\s*confident:\*")),
)


def h2_sections(text: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    title = None
    body: list[str] = []
    for line in text.splitlines():
        if line.startswith("## "):
            if title is not None:
                sections[title] = "\n".join(body)
            title = line[3:].strip()
            body = []
        elif title is not None:
            body.append(line)
    if title is not None:
        sections[title] = "\n".join(body)
    return sections


def discover_packs(root: Path) -> list[Path]:
    """A pack is any expeditions/*.md declaring a pack_id field
    (mirrors the runtime discovery rule in modes/expedition.md)."""
    packs = []
    exp = root / "expeditions"
    if not exp.is_dir():
        return packs
    for path in sorted(exp.glob("*.md")):
        if re.search(r"^`?pack_id:", path.read_text(encoding="utf-8"),
                     re.MULTILINE):
            packs.append(path)
    return packs


def check_pack(path: Path) -> list[str]:
    errors = []
    text = path.read_text(encoding="utf-8")

    m = re.search(r"`?pack_id:\s*([a-z0-9-]+)`?", text)
    if not m:
        errors.append("pack_id present but not a [a-z0-9-]+ slug")
    elif m.group(1) != path.stem:
        errors.append(f"pack_id {m.group(1)!r} != filename stem {path.stem!r}")

    sections = h2_sections(text)
    for name in REQUIRED_SECTIONS:
        if name not in sections:
            errors.append(f"missing required H2 section: {name}")
        elif not sections[name].strip():
            errors.append(f"required H2 section is empty: {name}")
    if errors:
        return errors  # section-level checks below need the sections

    if "Accessibility" not in sections["problem"]:
        errors.append("problem section lacks an accessibility note")

    if not re.search(r"dead end", sections["history"], re.IGNORECASE):
        errors.append("history section lists no dead ends")

    if not PROVENANCE_MARKER.search(sections["solution_provenance"]):
        errors.append("solution_provenance names no locatable source "
                      "(arXiv/doi/URL/LNCS/ISBN)")
    if not re.search(r"verif", sections["solution_provenance"], re.IGNORECASE):
        errors.append("solution_provenance does not state HOW the solution "
                      "was verified")

    steps = sections["step_graph"]
    n_steps = len(STEP_BULLET.findall(steps))
    if n_steps < 2:
        errors.append(f"step_graph has {n_steps} step bullet(s) (- **S<n>); "
                      "expected an ordered decomposition")
    for token in SNAKE_TOKEN.findall(steps):
        if token not in VALID_DISCIPLINES:
            errors.append(f"step_graph carries unknown discipline tag "
                          f"`{token}` (valid: six disciplines + search_first)")
    for bullet in re.split(r"^(?=- \*\*S\d+)", steps, flags=re.MULTILINE):
        sm = re.match(r"- \*\*(S\d+)", bullet)
        if sm and not any(t in VALID_DISCIPLINES
                          for t in SNAKE_TOKEN.findall(bullet)):
            errors.append(f"step {sm.group(1)} carries no discipline tag")

    if not re.search(r"S\d+", sections["breakthrough"]):
        errors.append("breakthrough names no step (S<n>) from the step_graph")

    n_targets = len(AUDIT_BULLET.findall(sections["audit_targets"]))
    if not 3 <= n_targets <= 5:
        errors.append(f"audit_targets has {n_targets} target bullet(s) "
                      "(- **T<n>); schema requires 3-5")
    for tag, label in (("*Objection:*", "objection"),
                       ("*Resolution", "resolution")):
        n_tagged = sections["audit_targets"].count(tag)
        if n_tagged < n_targets:
            errors.append(f"only {n_tagged}/{n_targets} audit targets carry "
                          f"an explicit {label}")

    # A forecaster pack must carry a calibration_key rubric (PACK-SCHEMA.md,
    # Role-Conditional Fields); an auditor/climber pack must not need one.
    if FORECASTER_DECL.search(text):
        cal = sections.get("calibration_key", "")
        if "calibration_key" not in sections:
            errors.append("declares a forecaster role but has no "
                          "calibration_key section (PACK-SCHEMA.md requires it)")
        elif not cal.strip():
            errors.append("calibration_key section is empty")
        else:
            # Count bands per forecast bullet, not across the whole section:
            # the section intro names all three bands in prose, so a
            # section-wide substring test passes even when a bullet drops one.
            bullets = re.split(r"^(?=- \*\*F\d+)", cal, flags=re.MULTILINE)
            forecasts = [b for b in bullets if FORECAST_BULLET.match(b)]
            if not forecasts:
                errors.append("calibration_key carries no forecast bullet "
                              "(- **F<n>)")
            for bullet in forecasts:
                fm = re.match(r"- \*\*(F\d+)", bullet)
                for label, pat in CALIBRATION_LABELS:
                    if not pat.search(bullet):
                        errors.append(f"calibration_key {fm.group(1)} lacks a "
                                      f"{label} band")

    return errors


def main(root: Path = ROOT) -> int:
    packs = discover_packs(root)
    if not packs:
        print("0 packs discovered (nothing to check)")
        return 0
    failures = 0
    for path in packs:
        rel = path.relative_to(root)
        errors = check_pack(path)
        if errors:
            failures += 1
            for err in errors:
                print(f"FAIL [{rel}] {err}")
        else:
            print(f"PASS [{rel}]")
    print(f"\n{len(packs) - failures}/{len(packs)} packs green")
    return 1 if failures else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # invocation error must not read as green
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
