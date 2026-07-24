"""Mutation + unit tests for the lint suite.

Every linter must catch the violation it exists for — a green lint proves
nothing if the lint is inert. Pattern (borrowed from ARS): copy the checked
tree into tmp, mutate one rule at a time, assert the matching check FAILs,
restore. The invariant table is homogeneous, so one loop covers every entry.
"""
import json
import re
import shutil
from datetime import date
from pathlib import Path

import pytest

import check_invariants as ci
import check_pack_schema as cps
import check_verbatim_blocks as cvb
import check_version_consistency as cvc
import check_web_content as cwc

REPO = Path(__file__).resolve().parent.parent
NEEDED_DIRS = ["shared", "modes", "passport", "platforms", "docs",
               "expeditions", ".claude-plugin"]
NEEDED_FILES = ["SKILL.md", "README.md", "CHANGELOG.md"]
PACK = "expeditions/boolean-pythagorean-triples.md"
FORECASTER_PACK = "expeditions/alphafold-casp14.md"


@pytest.fixture()
def tree(tmp_path):
    for d in NEEDED_DIRS:
        shutil.copytree(REPO / d, tmp_path / d)
    for f in NEEDED_FILES:
        shutil.copy(REPO / f, tmp_path / f)
    return tmp_path


def test_baseline_green(tree, capsys):
    assert ci.main(tree) == 0
    assert cps.main(tree) == 0
    assert cvb.main(tree) == 0
    assert cvc.main(tree) == 0
    capsys.readouterr()


@pytest.fixture()
def web_boundary_tree(tmp_path):
    web = tmp_path / "web"
    (web / "docs").mkdir(parents=True)
    (web / "tests").mkdir()
    (tmp_path / "README.md").write_text(
        (REPO / "README.md").read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    (tmp_path / ".gitignore").write_text(
        (REPO / ".gitignore").read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    for rel in [".vercelignore", "README.md", "tests/e2e_daily.py"]:
        source = REPO / "web" / rel
        target = web / rel
        target.write_text(source.read_text(encoding="utf-8"), encoding="utf-8")
    return web


def test_web_deployment_boundary_green(web_boundary_tree):
    cwc.check_deployment_boundary(web_boundary_tree)


@pytest.mark.parametrize(("rel", "needle", "replacement"), [
    (".vercelignore", ".private/", "private/"),
    (".vercelignore", ".env*", ".env.local"),
    ("../.gitignore", "web/.private/", "web/private/"),
    ("../.gitignore", ".env*", ".env.local"),
    ("../.gitignore", "!.env.example", "!.env.sample"),
    (
        "README.md",
        " --bind 127.0.0.1",
        "",
    ),
    (
        "../README.md",
        " --bind 127.0.0.1",
        "",
    ),
])
def test_web_deployment_boundary_mutation_fails(
    web_boundary_tree, rel, needle, replacement
):
    path = web_boundary_tree / rel
    original = path.read_text(encoding="utf-8")
    mutated = original.replace(needle, replacement, 1)
    assert mutated != original, f"{rel}: security needle absent, cannot mutate"
    path.write_text(mutated, encoding="utf-8")
    with pytest.raises(SystemExit):
        cwc.check_deployment_boundary(web_boundary_tree)


@pytest.mark.parametrize("rule", ["!.private/daily/", "!**"])
def test_web_deployment_boundary_reinclude_fails(web_boundary_tree, rule):
    path = web_boundary_tree / ".vercelignore"
    path.write_text(
        path.read_text(encoding="utf-8") + f"\n{rule}\n",
        encoding="utf-8",
    )
    with pytest.raises(SystemExit):
        cwc.check_deployment_boundary(web_boundary_tree)


def test_every_invariant_mutation_fails(tree, capsys):
    for entry in ci.CHECKS:
        rel, label, needle = entry[0], entry[1], entry[2].strip()
        path = tree / rel
        original = path.read_text(encoding="utf-8")
        mutated = original.replace(needle, "MUTATED")
        assert mutated != original, f"{label}: needle absent, cannot mutate"
        path.write_text(mutated, encoding="utf-8")
        rc = ci.main(tree)
        out = capsys.readouterr().out
        assert rc == 1 and f"FAIL [{label}]" in out, f"lint inert for {label}"
        path.write_text(original, encoding="utf-8")


def test_every_forbidden_injection_fails(tree, capsys):
    for rel, label, needle in ci.FORBIDDEN:
        path = tree / rel
        original = path.read_text(encoding="utf-8")
        path.write_text(original + "\n" + needle, encoding="utf-8")
        rc = ci.main(tree)
        out = capsys.readouterr().out
        assert rc == 1 and f"FAIL [{label}]" in out, f"lint inert for {label}"
        path.write_text(original, encoding="utf-8")


def test_section_scope_catches_moved_sentence(tree, capsys):
    """A scoped needle present in the file but outside its H2 section FAILs."""
    path = tree / "docs/GATE-checklist.md"
    original = path.read_text(encoding="utf-8")
    moved = original.replace("**8D (pack boundary):**", "**8X (renamed):**")
    path.write_text(moved + "\n\n8D (pack boundary)\n", encoding="utf-8")
    rc = ci.main(tree)
    out = capsys.readouterr().out
    assert rc == 1 and "FAIL [gate8-pack-boundary]" in out


@pytest.mark.parametrize("mutate", [
    lambda t: t.replace("## audit_targets", "## audit_stuff"),
    lambda t: t.replace("`search_first`", "`vibe_check`"),
    lambda t: t.split("- **T3")[0],            # 2 audit targets (< 3)
    lambda t: t.replace("`pack_id: boolean-pythagorean-triples`",
                        "`pack_id: some-other-slug`"),
    lambda t: t.replace("**Accessibility note.**", "**Note.**"),
    lambda t: t.replace("*Objection:*", "*Thought:*"),
])
def test_pack_lint_catches(tree, capsys, mutate):
    pack = tree / PACK
    original = pack.read_text(encoding="utf-8")
    mutated = mutate(original)
    assert mutated != original
    pack.write_text(mutated, encoding="utf-8")
    assert cps.main(tree) == 1
    capsys.readouterr()


@pytest.mark.parametrize("mutate", [
    # drop the whole calibration_key section from a forecaster pack
    lambda t: t.split("## calibration_key")[0],
    # keep the header but empty the rubric bullets
    lambda t: re.sub(r"## calibration_key.*", "## calibration_key\n",
                     t, flags=re.DOTALL),
    # strip every over-confident band label (leaves calibrated + under)
    lambda t: t.replace("*Over-confident:*", "*Note:*"),
    # strip every under-confident band label
    lambda t: t.replace("*Under-confident:*", "*Note:*"),
    # break exactly ONE bullet's band, proving the check is per-bullet, not
    # per-section (a whole-section substring test would pass on the other four)
    lambda t: t.replace("*Over-confident:*", "*Note:*", 1),
])
def test_forecaster_calibration_lint_catches(tree, capsys, mutate):
    pack = tree / FORECASTER_PACK
    original = pack.read_text(encoding="utf-8")
    mutated = mutate(original)
    assert mutated != original
    pack.write_text(mutated, encoding="utf-8")
    assert cps.main(tree) == 1
    capsys.readouterr()


def test_pack_lint_ignores_non_pack_md(tree, capsys):
    (tree / "expeditions/notes.md").write_text("scratch, no pack id field\n",
                                               encoding="utf-8")
    assert cps.main(tree) == 0
    capsys.readouterr()


def test_verbatim_block_drift_caught(tree, capsys):
    overlay = tree / "platforms/claude-ai/SKILL.md"
    original = overlay.read_text(encoding="utf-8")
    overlay.write_text(
        original.replace("Interpretations are never ranked.",
                         "Interpretations are never ranked!", 1),
        encoding="utf-8")
    assert cvb.main(tree) == 1
    capsys.readouterr()


def test_contract_sentence_drift_caught(tree, capsys):
    path = tree / "shared/scaffolding.md"
    original = path.read_text(encoding="utf-8")
    path.write_text(original.replace("That is what you came here for.",
                                     "Enjoy!"), encoding="utf-8")
    assert cvb.main(tree) == 1
    capsys.readouterr()


def test_version_lint_future_reference(tree, capsys):
    readme = tree / "README.md"
    readme.write_text(readme.read_text(encoding="utf-8")
                      + "\nSee v9.9.9 for details.\n", encoding="utf-8")
    assert cvc.main(tree) == 1
    capsys.readouterr()


def test_version_lint_stale_arch_header(tree, capsys):
    # A backward-stale ARCHITECTURE header (older than latest CHANGELOG) passes
    # the forward-only no-future-versions scan but must FAIL [arch-header].
    arch = tree / "docs/ARCHITECTURE.md"
    text = arch.read_text(encoding="utf-8")
    mutated = cvc.ARCH_HEADER.sub("# Architecture (v0.0.1)", text, count=1)
    assert mutated != text, "ARCHITECTURE header needle absent, cannot mutate"
    arch.write_text(mutated, encoding="utf-8")
    rc = cvc.main(tree)
    out = capsys.readouterr().out
    assert rc == 1 and "FAIL [arch-header]" in out


def _latest_changelog_version(tree):
    headings = cvc.HEADING.findall(
        (tree / "CHANGELOG.md").read_text(encoding="utf-8"))
    return max((h for h in headings if h != "Unreleased"), key=cvc.semver)


def test_version_lint_plugin_version_drift(tree, capsys):
    path = tree / ".claude-plugin/plugin.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["version"] = "0.0.1"
    path.write_text(json.dumps(data), encoding="utf-8")
    rc = cvc.main(tree)
    out = capsys.readouterr().out
    assert rc == 1 and "FAIL [plugin-version]" in out


def test_version_lint_marketplace_version_drift(tree, capsys):
    path = tree / ".claude-plugin/marketplace.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    data["plugins"][0]["version"] = "0.0.1"
    path.write_text(json.dumps(data), encoding="utf-8")
    rc = cvc.main(tree)
    out = capsys.readouterr().out
    assert rc == 1 and "FAIL [marketplace-version]" in out


@pytest.mark.parametrize("pattern,replacement,kwargs,label", [
    (cvc.WHATS_NEW, "## What's new in v0.0.1", {}, "readme-whats-new"),
    (cvc.WHATS_NEW, "## Recent changes", {}, "readme-whats-new"),
    (cvc.LAST_UPDATED, "Last touched: whenever", {}, "readme-last-updated"),
    (cvc.LAST_UPDATED, "**Last Updated:** 2020-01-01", {"release": True},
     "readme-last-updated-fresh"),
])
def test_version_lint_readme_stamp_mutations(tree, capsys, pattern,
                                             replacement, kwargs, label):
    readme = tree / "README.md"
    text = readme.read_text(encoding="utf-8")
    mutated = pattern.sub(replacement, text, count=1)
    assert mutated != text, f"{label}: needle absent, cannot mutate"
    readme.write_text(mutated, encoding="utf-8")
    rc = cvc.main(tree, **kwargs)
    out = capsys.readouterr().out
    assert rc == 1 and f"FAIL [{label}]" in out


def test_version_lint_release_mode_fresh_stamp_green(tree, capsys):
    readme = tree / "README.md"
    text = readme.read_text(encoding="utf-8")
    readme.write_text(
        cvc.LAST_UPDATED.sub(f"**Last Updated:** {date.today().isoformat()}",
                             text),
        encoding="utf-8")
    assert cvc.main(tree, release=True) == 0
    capsys.readouterr()


def test_version_lint_tag_mismatch(tree, capsys):
    rc = cvc.main(tree, tag="v9.9.9")
    out = capsys.readouterr().out
    assert rc == 1 and "FAIL [tag-matches-changelog]" in out


def test_version_lint_tag_match_green(tree, capsys):
    assert cvc.main(tree, tag="v" + _latest_changelog_version(tree)) == 0
    capsys.readouterr()


def test_version_lint_release_requires_badge(tree, capsys):
    # A released CHANGELOG (a versioned entry) with NO matching README badge
    # must FAIL. Construct the situation outright rather than relying on the
    # repo's current pre/post-release state: pin the CHANGELOG to one version
    # and strip every version badge from the README.
    cl = tree / "CHANGELOG.md"
    cl.write_text(
        "# Changelog\n\n## [0.1.0] - 2026-06-13\n\n"
        + ("Body padding to clear the 100-char minimum. " * 4)
        + "\n",
        encoding="utf-8",
    )
    readme = tree / "README.md"
    readme.write_text(
        cvc.BADGE.sub("badge/x", readme.read_text(encoding="utf-8")),
        encoding="utf-8",
    )
    assert cvc.main(tree) == 1  # versioned entry but README has no badge
    capsys.readouterr()
