# critical-thinking-gym

A gym for your critical thinking — the AI coaches, you train. Two modes cover
different reasoning demands: one delivers structured argument-analysis items
with a single defensible answer; the other spreads interpretive frames across
synthetic or your own material and ends with you committing to a position.
Both track your patterns over time in a passport on your machine, showing you
what no single session can: your longitudinal blind spots.

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

## The Two Modes

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
Sensitive material from a BYOM session is not written to the passport unless you explicitly ask.

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
