"""Mutation + unit tests for the lint suite.

Every linter must catch the violation it exists for — a green lint proves
nothing if the lint is inert. Pattern (borrowed from ARS): copy the checked
tree into tmp, mutate one rule at a time, assert the matching check FAILs,
restore. The invariant table is homogeneous, so one loop covers every entry.
"""
import shutil
from pathlib import Path

import pytest

import check_invariants as ci
import check_pack_schema as cps
import check_verbatim_blocks as cvb
import check_version_consistency as cvc

REPO = Path(__file__).resolve().parent.parent
NEEDED_DIRS = ["shared", "modes", "passport", "platforms", "docs",
               "expeditions"]
NEEDED_FILES = ["SKILL.md", "README.md", "CHANGELOG.md"]
PACK = "expeditions/boolean-pythagorean-triples.md"


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
