# critical-thinking-gym

A gym for your critical thinking — the AI coaches, you train. Three modes cover
different reasoning demands: one delivers structured argument-analysis items
with a single defensible answer; one spreads interpretive frames across
synthetic or your own material and ends with you committing to a position; one
guides you through problems you are not expected to solve, training you to
audit reasoning you could not have produced. All three track your patterns over
time in a passport on your machine, showing you what no single session can:
your longitudinal blind spots.

An AI coach is the cheapest place in the world to lose face — admitting a
blind spot here costs you nothing.

---

## Stance Charter

Three commitments, non-negotiable:

1. **Not neutral about reasoning quality.** Factual errors, internal
   contradictions, and evidence misreadings are corrected in every mode,
   whoever's frame they sit in. "It's just a perspective" never exempts a
   logical error from correction.

2. **No verdicts between value frames.** Competing interpretations are laid
   out steelmanned — each in its strongest defensible form — and never ranked.
   The coach adjudicates reasoning, not worldviews.

3. **The endpoint is commitment, not permanent neutrality.** Every session
   closes with you taking a defensible position and defending it against the
   strongest objection. Endless hedging is not the goal.

A gym doesn't tell you where to walk — it makes you able to walk, and it will
absolutely tell you when you stumble.

---

## The Three Modes

**drill** — judge stance. Original argument-analysis items built in your field
around one of seven structures (necessary assumption, alternative cause, reverse
causation, coincidence/timing, sample selection, proxy mismatch, evidence
sufficiency). You commit an answer before any analysis appears; then every
option is dissected and the transferable structure named — you leave with the
skeleton, not just the answer.

**scene** — Socratic stance. A synthetic scene or your own material (news,
reports, a proposal — byom (bring your own material)). All six interpretive frames laid out and
steelmanned. The camera turns on your own reading too: your interpretation is
examined with the same rigor as the others. Ends with you committing to a
position and defending it against the strongest objection.

**expedition** — guide stance. Problems that stayed open for decades and fell
to AI-class search, run only from curated packs with verified solutions —
never improvised. You are not expected to solve them; you audit, climb, or
forecast, and what you train is the human-executable translation of machine
advantages: decomposition, representation shifts, small-case probes,
pre-committed kill criteria. Say `expedition` or `impossible`.
(No packs ship yet — the mode tells you so honestly and routes you to drill
or scene; the pack authoring spec is in `expeditions/PACK-SCHEMA.md`.)

---

## Built-in Domain: Manipulation Recognition

Name it at intake (sales pressure, scam scripts, political rhetoric,
relational manipulation — 話術辨識) and the gym trains you to spot the
technique, not memorize the story: false scarcity, love bombing, gaslighting,
whataboutism, and ten more, each with a counter-question you keep.
Recognition only, by hard rule: the coach never writes, improves, or
personalizes a manipulative script for use on a real target, in any framing.
Political material samples techniques across the spectrum — the technique is
adjudicated, never the position.

---

## Quick Start

You need [Claude Code](https://claude.com/claude-code) installed.

```
git clone https://github.com/Imbad0202/critical-thinking-gym ~/.claude/skills/critical-thinking-gym
```

Start any Claude Code session and say `drill` or `scene` — or just describe what you want to practice.

On first run the coach asks the three choices, then routes you to your mode; later sessions confirm your profile in one line.

**Intake (three choices):**
- **Field** — any domain in your own words; multiple fields or "no preference" accepted.
- **Support level** — `intro` (high scaffold), `standard`, or `advanced` (open construction).
- **Feedback style** — `direct` (error stated plainly) or `cushioned` (same fact, more context). The fact of the correction is non-negotiable; the delivery is yours to choose.

**Safe words** — always honored, announced once at session start:
`"stuck"` (demonstration on a parallel case), `"hint"` (one scaffold step),
`"enough for today"` (graceful close), `"forget this one"` (discards pending events only — items already checkpointed stay on disk).
The tool adapts its delivery; it never adapts its standards.

---

## Try This Yourself

Ask any image or text model to generate "a principal talking with a teacher"
ten times. Tally the gender, titles, and who speaks first across the ten
outputs. Bring the distribution to a scene session and examine what you find.
You're not testing whether the model is biased — you're practicing the
examination: which frames can account for the distribution, which cannot, and
what evidence would defeat each reading. Whichever way the tally lands, it
is fully discussable material.

---

## What the Passport Tracks

The passport lives at `~/.ct-gym/` on your machine. It records:

- **drill:** hit/miss per structure ID, per session and longitudinally.
- **scene:** process coverage — which frames were raised, steelmanned, whether
  the camera turn was completed, whether you made a closing commitment.
- **The longitudinal mirror:** after enough sessions the passport summary will
  show you patterns no single session shows — for example: "4 of your last 5
  misses are sample_selection" — and cite the record so you can read it
  yourself. The pattern appears in your passport summary, not as an unprompted
  coach callout.

The passport's relevant content enters the model context when used. You can
run `show passport`, `delete passport`, or `pause recording` at any time.
A sensitive BYOM session writes no passport events at all — not even your closing commitment — unless you explicitly ask.

---

## Theory Grounding

The argument anatomy comes from informal logic (Toulmin, Ennis). The facilitation
model treats ill-structured problems as requiring defensible judgment, not right
answers (King & Kitchener), and hunts assumptions the way adult educators do
(Brookfield, Mezirow). The difficulty system applies scaffolding and
desirable-difficulty research (Vygotsky, Bjork), and items always name their
transferable structure because that labeling is what makes practice transfer.
Item engineering references standardized reasoning tests — among them GMAT
Critical Reasoning — as structural reference, not content source.

---

## Disclaimers

This project is not affiliated with or endorsed by GMAC or any other test
publisher. It never reproduces, adapts, or imitates published test items.
It is not a test-preparation product.

The legal notes in this repository are risk-control practice — not legal advice.

---

## claude.ai Build

The repo is the single source of truth; the claude.ai-uploadable zip is generated, never hand-edited:

```
./scripts/build_claude_ai_zip.sh   # → dist/critical-thinking-gym-claude-ai.zip
```

The build copies the canonical runtime files and applies whole-file overlays from
`platforms/claude-ai/` (SKILL.md, shared/redlines.md, shared/scaffolding.md,
passport/SCHEMA.md). The platform delta is storage only: no local filesystem, so
the event log becomes a session tally plus a copy-paste passport block the user
saves and re-imports (see `platforms/claude-ai/passport/SCHEMA.md`); redline 12
is reworded to stay honest about where conversation data lives. Modes, stances,
redlines 1–11, and the item pipeline are identical.

Maintenance rule: when you edit a canonical file that has an overlay counterpart,
review the overlay in the same commit — `scripts/check_invariants.py` re-checks
every redline and SKILL.md invariant against the overlay copies and fails the
build on drift or on local-filesystem vocabulary leaking into the zip.
