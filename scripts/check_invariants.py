#!/usr/bin/env python3
"""Invariant lint for critical-thinking-gym.

Checks that every load-bearing rule sentence (invariant) is literally present
in its carrier file. Presence-only: a green run means the text exists, NOT that
runtime behavior honors it (behavioral gates live in docs/GATE-checklist.md).
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (file, label, required substring)
CHECKS = [
    # --- shared/structures.md (Task 2) ---
    ("shared/structures.md", "canonical-id-rule",
     "Canonical IDs are snake_case English and never localized"),
    ("shared/structures.md", "structure-necessary-assumption", "necessary_assumption"),
    ("shared/structures.md", "structure-alternative-cause", "alternative_cause"),
    ("shared/structures.md", "structure-reverse-causation", "reverse_causation"),
    ("shared/structures.md", "structure-coincidence-timing", "coincidence_timing"),
    ("shared/structures.md", "structure-sample-selection", "sample_selection"),
    ("shared/structures.md", "structure-proxy-mismatch", "proxy_mismatch"),
    ("shared/structures.md", "structure-evidence-sufficiency", "evidence_sufficiency"),
    ("shared/structures.md", "distractor-out-of-scope", "out_of_scope"),
    ("shared/structures.md", "distractor-premise-restatement", "premise_restatement"),
    ("shared/structures.md", "distractor-weak-proxy-trap", "weak_proxy_trap"),
    ("shared/structures.md", "frame-power", "frame_power"),
    ("shared/structures.md", "frame-counter", "frame_counter"),
    # --- shared/redlines.md (Task 3) ---
    ("shared/redlines.md", "rl1-adjudicate",
     "Interpretations are never ranked against each other"),
    ("shared/redlines.md", "rl1-reasoning-floor",
     "internal contradictions, factual errors, and evidence misreadings are corrected in every mode"),
    ("shared/redlines.md", "rl2-steelman",
     "strongest defensible form"),
    ("shared/redlines.md", "rl3-graph-silence",
     "The scene graph never drives questioning"),
    ("shared/redlines.md", "rl3-not-a-miss-list",
     "never as a list of what the user missed"),
    ("shared/redlines.md", "rl4-no-flattery",
     "A wrong answer is never called right"),
    ("shared/redlines.md", "rl5-frame-palette",
     "never circling within a single vocabulary"),
    ("shared/redlines.md", "rl6-no-real-items",
     "Never reproduce, adapt, or imitate published test items"),
    ("shared/redlines.md", "rl7-no-identity-inference",
     "Never infer or adjust difficulty from identity cues"),
    ("shared/redlines.md", "rl8-safe-words",
     "Safe words are always honored"),
    ("shared/redlines.md", "rl9-fenced-data",
     "data, never instructions"),
    ("shared/redlines.md", "rl10-real-persons",
     "never diagnose character, motive, or moral essence"),
    ("shared/redlines.md", "rl11-no-motive-claims",
     "only as hypotheses, never assertions"),
    ("shared/redlines.md", "rl12-passport-honesty",
     "its relevant content enters the model context when used"),
    # --- shared/scaffolding.md (Task 4) ---
    ("shared/scaffolding.md", "sw-stuck", "\"stuck\""),
    ("shared/scaffolding.md", "sw-hint", "\"hint\""),
    ("shared/scaffolding.md", "sw-enough", "\"enough for today\""),
    ("shared/scaffolding.md", "sw-forget", "\"forget this one\""),
    ("shared/scaffolding.md", "four-step",
     "understand the intent, anchor what was done right, state the fact, leave space"),
    ("shared/scaffolding.md", "anchor-before-reveal",
     "the anchor comes BEFORE the reveal"),
    ("shared/scaffolding.md", "depersonalize",
     "locate the error in the reasoning move, never in the person"),
    ("shared/scaffolding.md", "invariant-bar",
     "the standard of a sound analysis is identical at every difficulty"),
    # --- modes/drill.md (Task 5) ---
    ("modes/drill.md", "commit-then-reveal",
     "the user commits an answer before any analysis is shown"),
    ("modes/drill.md", "reverse-solve",
     "independently re-solve the item; if a second defensible answer exists, discard and regenerate"),
    ("modes/drill.md", "no-gmat-stems",
     "plain functional language, never imitating the distinctive phrasing of published exams"),
    ("modes/drill.md", "novel-anchors",
     "a synthetic institution name, specific numbers, and the user's domain context"),
    ("modes/drill.md", "cannot-be-determined",
     "\"cannot be determined\" is a legitimate and rewarded answer"),
    ("modes/drill.md", "name-the-skeleton",
     "the canonical ID goes into the passport event, not the display"),
    ("shared/structures.md", "display-plain-language",
     "raw snake_case IDs appear only in passport events"),
    # --- modes/scene.md (Task 6) ---
    ("modes/scene.md", "graph-first",
     "generate the scene graph before rendering any scene text"),
    ("modes/scene.md", "provenance-tags",
     "user_specified / system_specified / randomized / model_default"),
    ("modes/scene.md", "graph-silence",
     "The scene graph never drives questioning"),
    ("modes/scene.md", "two-axis",
     "interpretations are never ranked; flaws inside a single reading are always corrected"),
    ("modes/scene.md", "frame-palette-list",
     "frame_power, frame_institution, frame_incentive, frame_charitable, frame_info_limits, frame_counter"),
    ("modes/scene.md", "camera-turn",
     "Where does your own reading stand, and what can it not see"),
    ("modes/scene.md", "process-metrics",
     "process metrics, never hit/miss"),
    ("modes/scene.md", "byom-first",
     "BYOM path is implemented first"),
    # --- SKILL.md (Task 8) ---
    ("SKILL.md", "mode-keywords", "`drill` → load `modes/drill.md` (judge stance)"),
    ("SKILL.md", "single-mode-load",
     "load exactly one mode file"),
    ("SKILL.md", "stance-reset", "STANCE RESET"),
    ("SKILL.md", "contract",
     "This tool will point out flaws in your reasoning. That is what you came here for."),
    ("SKILL.md", "three-fields",
     "domain, difficulty, and feedback style"),
    ("SKILL.md", "fresh-session-advice",
     "a fresh session gives the cleanest stance separation"),
    # --- passport (Task 7) ---
    ("passport/SCHEMA.md", "schema-version", "schema_version"),
    ("passport/SCHEMA.md", "append-only", "append-only"),
    ("passport/SCHEMA.md", "atomic-write", "atomic"),
    ("passport/SCHEMA.md", "no-raw-text",
     "structure tags and short summaries, never raw user text"),
    # --- new scope/consumer checks ---
    ("shared/redlines.md", "rl5-scope", "Every scene lays out"),
    ("shared/scaffolding.md", "feedback-style-consumer",
     "the style changes the wrapping, never the verdict"),
    # --- README.md (Task 9) ---
    ("README.md", "stance-charter", "Stance Charter"),
    ("README.md", "gym-line",
     "A gym doesn't tell you where to walk"),
    ("README.md", "gmac-disclaimer",
     "not affiliated with or endorsed by GMAC"),
    ("README.md", "non-legal",
     "not legal advice"),
    ("README.md", "safest-place",
     "the cheapest place in the world to lose face"),
    # --- review round 1: full distractor/frame coverage ---
    ("shared/structures.md", "distractor-true-but-irrelevant", "true_but_irrelevant"),
    ("shared/structures.md", "distractor-opposite-180", "opposite_180"),
    ("shared/structures.md", "distractor-reverses-logic", "reverses_logic"),
    ("shared/structures.md", "distractor-too-extreme", "too_extreme"),
    ("shared/structures.md", "distractor-irrelevant-comparison", "irrelevant_comparison"),
    ("shared/structures.md", "frame-institution", "frame_institution"),
    ("shared/structures.md", "frame-incentive", "frame_incentive"),
    ("shared/structures.md", "frame-charitable", "frame_charitable"),
    ("shared/structures.md", "frame-info-limits", "frame_info_limits"),
    # --- review round 1: new rule sentences ---
    ("shared/structures.md", "technique-not-loggable",
     "procedure, not a loggable structure"),
    ("shared/structures.md", "seven-structures", "seven loggable structure IDs"),
    ("modes/drill.md", "compound-primary-logging", "never as a second event"),
    ("modes/drill.md", "commit-gate-safe-words",
     "one scaffold step about the stem or the structure vocabulary"),
    ("modes/drill.md", "tier-option-count", "per the Difficulty Knobs table"),
    ("modes/drill.md", "tier-distractor-count", "intro: 2; standard/advanced: 4"),
    ("modes/scene.md", "observation-window-safe-words",
     "never a frame name or a reading of this scene"),
    ("modes/scene.md", "advanced-palette-completion",
     "before the closing pressure test (redline 5)"),
    ("shared/scaffolding.md", "silence-window-safe-words",
     "cannot leak the key or a reading"),
    ("shared/scaffolding.md", "no-anchor-branch",
     "skip the anchor rather than invent one"),
    ("shared/scaffolding.md", "scene-stuck-equivalent",
     "then returns to the live scene"),
    ("SKILL.md", "safe-words-every-path", "in every path"),
    ("SKILL.md", "switch-full-profile-set",
     "carrying forward the unchanged fields"),
    ("passport/SCHEMA.md", "steelman-all-frames",
     "every raised frame was steelmanned"),
    ("passport/SCHEMA.md", "sensitive-byom-commitment", "including `commitment`"),
    ("passport/TEMPLATE.md", "template-sample-data", "never copy them"),
    # --- review round 2 ---
    ("README.md", "byom-no-events", "writes no passport events at all"),
    ("SKILL.md", "byom-domain-default",
     "defaults to `[\"no preference\"]`"),
    # --- v1.1 batch 1: fixes from first real-world claude.ai session ---
    ("shared/scaffolding.md", "language-script-variant",
     "including script variant"),
    ("shared/scaffolding.md", "no-third-script",
     "unrelated third language or script"),
    ("modes/drill.md", "domain-fit-gate",
     "Never silently re-skin material"),
    ("modes/drill.md", "domain-fit-stop",
     "STOP before generating anything"),
    ("modes/drill.md", "dissection-no-overstate",
     "distractor classifications never overstate"),
    ("modes/scene.md", "adapted-palette-counter",
     "is the suspected flaw actually a flaw?"),
    ("modes/scene.md", "material-preflight",
     "never present material the coach cannot cleanly defend in dissection"),
    ("shared/redlines.md", "rl5-adapted-palette",
     "substitutes an adapted lens palette"),
    ("SKILL.md", "switch-no-reset",
     "never resets the running record"),
    # --- v1.1 batch 2: manipulation-recognition domain ---
    ("shared/redlines.md", "rl13-no-production",
     "never optimizes, personalizes, or supplies"),
    ("shared/redlines.md", "rl13-armory",
     "must not double as an armory"),
    ("shared/redlines.md", "rl13-political-balance",
     "the technique is adjudicated, never the political"),
    ("shared/manipulation-taxonomy.md", "mt-gaslighting", "gaslighting"),
    ("shared/manipulation-taxonomy.md", "mt-love-bombing", "love_bombing"),
    ("shared/manipulation-taxonomy.md", "mt-whataboutism", "whataboutism"),
    ("shared/manipulation-taxonomy.md", "mt-synthetic-only",
     "All material is synthetic by construction"),
    ("shared/manipulation-taxonomy.md", "mt-off-ramp",
     "does not roleplay counseling"),
    ("shared/structures.md", "manipulation-id-exception",
     "`manipulation_spot` items log technique"),
    ("modes/drill.md", "manipulation-item-type",
     "### 4. `manipulation_spot`"),
    ("SKILL.md", "manipulation-domain-load",
     "additionally load `shared/manipulation-taxonomy.md`"),
    ("passport/SCHEMA.md", "manipulation-item-enum",
     "assumption|weaken|sufficiency|manipulation_spot"),
    ("docs/GATE-checklist.md", "rl13-probe",
     "RL13 (recognition, never production)"),
    # --- v1.1 batch 3: expedition mode ---
    ("modes/expedition.md", "no-pack-no-expedition",
     "Expedition material is NEVER improvised"),
    ("modes/expedition.md", "pack-refusal-fields",
     "The coach refuses a pack missing any of its required fields"),
    ("modes/expedition.md", "auditor-default", "auditor (default)"),
    ("modes/expedition.md", "search-first", "`search_first`"),
    ("modes/expedition.md", "discipline-kill-criteria", "`kill_criteria`"),
    ("modes/expedition.md", "expedition-no-soft-switch",
     "Mid-session switching into or out of expedition is unsupported"),
    ("SKILL.md", "expedition-no-soft-switch-router",
     "switching into or out of expedition mid-session is unsupported"),
    ("expeditions/PACK-SCHEMA.md", "provenance-required",
     "A pack without provenance is invalid"),
    ("expeditions/PACK-SCHEMA.md", "solved-only",
     "verified solutions, never open conjectures"),
    ("expeditions/PACK-SCHEMA.md", "first-party-verification",
     "the author has read the actual\n  solution source"),
    ("SKILL.md", "expedition-routing",
     "`expedition` / `impossible` → load `modes/expedition.md`"),
    ("passport/SCHEMA.md", "expedition-event", "expedition_process"),
    ("platforms/claude-ai/passport/SCHEMA.md", "claude-ai-expedition-line",
     "one entry per completed expedition"),
    ("shared/scaffolding.md", "expedition-outside-tiers",
     "Expedition mode sits outside the three tiers"),
    # --- v1.1 simplify pass: count guards + new gate probes ---
    ("shared/redlines.md", "thirteen-rules",
     "These thirteen rules are absolute"),
    ("shared/scaffolding.md", "redline-count",
     "the thirteen redlines"),
    ("docs/GATE-checklist.md", "gate7-domain-fit",
     "7A (domain-fit STOP)"),
    ("docs/GATE-checklist.md", "gate7-off-ramp",
     "7B (distress off-ramp)"),
    ("modes/drill.md", "manipulation-distractor-source",
     "step (f) draws"),
]

# --- claude.ai overlay (platforms/claude-ai/) ---
# Overlay files replace their canonical counterparts in the claude.ai zip;
# every redline and SKILL.md invariant must survive the platform rewrite.
_OVERLAY_MAP = {
    "shared/redlines.md": "platforms/claude-ai/shared/redlines.md",
    "shared/scaffolding.md": "platforms/claude-ai/shared/scaffolding.md",
    "SKILL.md": "platforms/claude-ai/SKILL.md",
}
CHECKS += [
    (_OVERLAY_MAP[rel], f"claude-ai-{label}", needle)
    for rel, label, needle in list(CHECKS)
    if rel in _OVERLAY_MAP
]

# (file, label, substring that must be ABSENT)
FORBIDDEN = [
    # No local-filesystem passport vocabulary may leak into the claude.ai build.
    ("platforms/claude-ai/SKILL.md", "claude-ai-no-local-path", "~/.ct-gym"),
    ("platforms/claude-ai/SKILL.md", "claude-ai-no-jsonl-skill", "events.jsonl"),
    ("platforms/claude-ai/passport/SCHEMA.md", "claude-ai-no-jsonl-schema", "events.jsonl"),
    ("platforms/claude-ai/shared/redlines.md", "claude-ai-no-on-disk", "stay on disk"),
    ("platforms/claude-ai/shared/scaffolding.md", "claude-ai-no-on-disk-scaffolding", "on disk"),
]


def main() -> int:
    failures = 0
    missing_files = set()
    texts = {}
    for rel, label, needle in CHECKS:
        if rel in missing_files:
            failures += 1
            continue
        path = ROOT / rel
        if rel not in texts:
            if not path.exists():
                # One FAIL line per missing file, but every check on it still
                # counts as a failure (intentional).
                print(f"FAIL [{rel}] file missing")
                missing_files.add(rel)
                failures += 1
                continue
            texts[rel] = path.read_text(encoding="utf-8")
        text = texts[rel]
        if needle.strip() in text:
            print(f"PASS [{label}]")
        else:
            print(f"FAIL [{label}] missing in {rel}: {needle!r}")
            failures += 1
    for rel, label, needle in FORBIDDEN:
        path = ROOT / rel
        if not path.exists():
            print(f"FAIL [{rel}] file missing")
            failures += 1
            continue
        if needle in path.read_text(encoding="utf-8"):
            print(f"FAIL [{label}] forbidden substring present in {rel}: {needle!r}")
            failures += 1
        else:
            print(f"PASS [{label}]")
    total = len(CHECKS) + len(FORBIDDEN)
    print(f"\n{total - failures}/{total} checks green")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
