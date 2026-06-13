# critical-thinking-for-humans

A gym for your critical thinking — the AI coaches, you train. Four modes cover
different reasoning demands: one delivers structured argument-analysis items
with a single defensible answer; one spreads interpretive frames across
synthetic or your own material and ends with you committing to a position; one
guides you through problems you are not expected to solve, training you to
audit reasoning you could not have produced; one generates a layered case you
crack flaw by flaw, carrying each discovery as a key into the next layer. All
four track your patterns over time in a passport on your machine, showing you
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

## The Four Modes

**drill** — judge stance. Original argument-analysis items built in your field
around one of twelve structures (necessary assumption, alternative cause, reverse
causation, coincidence/timing, sample selection, proxy mismatch, evidence
sufficiency, base rate neglect, regression to the mean, Simpson's paradox,
circular reasoning, hasty generalization). You commit an answer before any
analysis appears; then every
option is dissected and the transferable structure named — you leave with the
skeleton, not just the answer.

**scene** — Socratic stance. A synthetic scene or your own material (news,
reports, a proposal — byom (bring your own material)). All six interpretive frames laid out and
steelmanned. The camera turns on your own reading too: your interpretation is
examined with the same rigor as the others. Ends with you committing to a
position and defending it against the strongest objection.
Scene also runs a separate **fallacy-recognition track**: bring an argument and
the coach helps you judge whether it commits a named fallacy — false dilemma, ad
hominem, strawman, a fallacious appeal, equivocation — with three honest rulings
(it is a fallacy, it is not, or there is not enough context to say), and a guard
against the opposite mistake of crying "fallacy" at a sound argument. One track
runs at a time; frames are never ranked, but a fallacy in the form of an argument
is named plainly.

**expedition** — guide stance. Problems that stayed open for decades and fell
to AI-class search, run only from curated packs with verified solutions —
never improvised. You are not expected to solve them; you audit, climb, or
forecast, and what you train is the human-executable translation of machine
advantages: decomposition, representation shifts, small-case probes,
pre-committed kill criteria. Say `expedition` or `impossible`.
(Installed packs live in `expeditions/`. Without a pack the mode says so
honestly and routes you to drill or scene; the authoring spec is
`expeditions/PACK-SCHEMA.md`.)

**detective** — guide-and-judge stance. A single runtime-generated case in your
own field, worked as a multi-layer escape room: each layer hides one keyed flaw, and
catching it yields a concrete key — a number, a name, a threshold — that is the
necessary input to the next layer's puzzle. You carry each discovery downward
until the final layer's key is the case's truth. It sits between scene and
expedition: it judges (the flaws are real, against a frame the case states up
front), but the material is generated fresh each time rather than drawn from a
verified pack. Say `detective` (or 查案 / 破案 / 偵探).
(Detective generation is the most demanding work in the skill; recommended on an
opus-class or stronger model — on weaker models it degrades to fewer layers or
declines to start rather than shipping a broken case.)

---

## Which Domains, Which Mode

Not every field plugs into every mode, and the gym says so rather than
pretending otherwise. The twelve drill structures are seven causal-inductive plus three statistical plus two formal/inductive tools:
they need material where someone offers **evidence for a conclusion** and a
single gap can be engineered. That fits some fields natively and not others.
When you name a domain that does not fit drill, the coach **stops, says why,
and points you to the path that does** — it never silently re-skins another
field's material under your domain's name.

**Fields that fit drill directly** — anything built on empirical or causal
argument:

- **Physics, chemistry, biology, earth science** — not the laws or theorems
  themselves (those are deductive; see below), but *experimental reasoning*: a
  paper claims A caused B without controlling a third factor
  (`alternative_cause`), a sample that excludes the cases most able to refute
  it (`sample_selection`), a metric that measures activity instead of the
  claimed outcome (`proxy_mismatch`). You drill the gap between a study's
  evidence and its conclusion.
- **Human geography, economics, the social sciences, policy, medicine,
  education, business** — causal and inductive claims are the native material.
- **Manipulation recognition** — its own built-in domain (below).

**Fields that need scene mode, not drill** — where there is no single
defensible answer to key against:

- **Music, art, literature, film, design** — aesthetic and interpretive
  judgement. Redline 1 forbids the gym from adjudicating a value frame, so it
  will not hand you "is this piece good?" as a keyed item — that answer does
  not exist. Instead, **scene mode** dissects *discourse about* the art: bring
  a review, a curatorial statement, a critical essay, and the coach lays out
  interpretive frames over its argument ("this essay calls the style a
  decline — on what evidence? what does it not see?"). You audit the reasoning,
  never the artwork.
- **Pure mathematics, formal logic, theoretical CS** — deductive systems. A
  proof is valid or it is not; there is no inductive gap to engineer. Scene
  mode handles these as **non-social analytical material** (modes/scene.md):
  an adapted lens set — step validity, hidden premises, reversibility, edge and
  degenerate cases, quantifier scope, necessary vs sufficient — dissects a
  flawed derivation step by step.
- **Pure ethics / aesthetics / definitional disputes** — value and definition
  questions, not evidential ones. Same routing: scene mode, frames laid out,
  no verdict on the value position itself.

This boundary is the tool being honest, not a limitation to work around. A gym
that trains critical thinking must not pretend that "which symphony is better"
or "is this conjecture true" have the same shape as "does this study's evidence
support its claim." Different shapes, different modes — and for the fields drill
cannot key, scene is where you bring your own material and still train every
frame.

(Expedition mode is orthogonal to this: it runs on verified packs regardless of
your home field — what it trains is auditing a chain you could not have produced,
not your domain's content.)

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
git clone https://github.com/Imbad0202/critical-thinking-for-humans ~/.claude/skills/critical-thinking-for-humans
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
- **expedition:** process record per pack — role taken, which disciplines you
  fired unprompted, whether you articulated the breakthrough.
- **detective:** process record per case — layers solved of total, eggs found of
  total, confirmed false positives, any correct objections the case key had
  missed, and the main-flaw structures hit (fed into the same per-structure
  miss-log drill uses).
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
Item engineering draws on the long-established *form* of critical-reasoning
assessment — the assumption / strengthen / weaken / inference question types
common to standardized reasoning tests generally — as a structural reference,
never as a content source.

---

## Disclaimers

This is an independent project, not affiliated with, sponsored by, or endorsed
by any standardized-test publisher or assessment organization. It is not a
test-preparation product and makes no claim to improve any examination score.

All practice items are original and generated at runtime. The project does not
reproduce, adapt, imitate, or distribute the questions of any published test,
and references the *types* of reasoning task (assumption, strengthen, weaken,
inference) only as a generic structural form, not as anyone's proprietary
content. Any third-party names that appear in this repository — products,
organizations, researchers, journals — are used nominatively, for
identification, citation, and commentary only. Claude, Claude Code, and
claude.ai are referenced solely for runtime compatibility; the project is not
affiliated with, sponsored by, or endorsed by Anthropic.

All institution and person names in example items and scenes are fictional;
any resemblance to real entities is coincidental. Real individuals and
organizations named in the expedition packs are cited for their published,
public work only, and every characterization is grounded in the cited source.

This is a practice tool, not an outcome guarantee. It is designed for
deliberate practice of reasoning skills and makes no claim to improve any
examination score or any academic, professional, financial, medical, or legal
outcome.

Educational use only. Nothing the tool produces is legal, medical, financial,
psychological, or safety advice. The manipulation-recognition material teaches
recognition, not response; for an active scam, a controlling relationship, or
any situation involving immediate danger or real loss, consult the appropriate
qualified professional or local emergency and crisis resources.

These notes describe the project's own practices; they are not legal advice.

---

## claude.ai Build

The repo is the single source of truth; the claude.ai-uploadable zip is generated, never hand-edited:

```
./scripts/build_claude_ai_zip.sh   # → dist/critical-thinking-for-humans-claude-ai.zip
```

The build copies the canonical runtime files and applies whole-file overlays from
`platforms/claude-ai/` (SKILL.md, shared/redlines.md, shared/scaffolding.md,
passport/SCHEMA.md). The platform delta is storage only: no local filesystem, so
the event log becomes a session tally plus a copy-paste passport block the user
saves and re-imports (see `platforms/claude-ai/passport/SCHEMA.md`); redline 12
is reworded to stay honest about where conversation data lives. Modes, stances,
redlines 1–11 and 13, and the item pipeline are identical.

Maintenance rule: when you edit a canonical file that has an overlay counterpart,
review the overlay in the same commit — `scripts/check_invariants.py` re-checks
every redline and SKILL.md invariant against the overlay copies and fails the
build on drift or on local-filesystem vocabulary leaking into the zip.
