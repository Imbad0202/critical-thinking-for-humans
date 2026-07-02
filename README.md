# critical-thinking-for-humans

[![Version](https://img.shields.io/badge/version-v1.1.1-blue)](https://github.com/Imbad0202/critical-thinking-for-humans/releases/tag/v1.1.1)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Sponsor](https://img.shields.io/badge/sponsor-Buy%20Me%20a%20Coffee-orange?logo=buy-me-a-coffee)](https://buymeacoffee.com/crucify020v)

**Last Updated:** 2026-07-02

A gym for your critical thinking. The AI is the coach; you do the work.

**Install in 30 seconds** (Claude Code CLI / VS Code / JetBrains):

```text
/plugin marketplace add Imbad0202/critical-thinking-for-humans
/plugin install critical-thinking-for-humans
```

Or install it as a plain Claude Code skill with one command:

```bash
git clone https://github.com/Imbad0202/critical-thinking-for-humans ~/.claude/skills/critical-thinking-for-humans
```

Then start any session and say `drill`, `scene`, `expedition`, `detective`, or
just describe what you want to practice. (No Claude Code? A single-file [portable
edition](#portable-single-file-edition-any-model) runs in any frontier model's
chat window.)

## What's new in v1.1.1

Release engineering, not behavior: the four modes are unchanged. Tagged releases
now carry both built artifacts (the claude.ai zip and the portable single file)
as downloads, so the portable edition no longer requires a local build. The
claude.ai zip now ships the 16 expedition packs, so expedition can run there
too. The version lint grew four checks (plugin manifests, this section, the
Last-Updated stamp, tag-to-CHANGELOG equality), and the build/lint code under
`scripts/` is now additionally MIT-licensed. Full details in
[CHANGELOG.md](CHANGELOG.md).

---

You can be the sharpest reasoner in your own field and still get fooled by the
exact same logic the moment it shows up somewhere unfamiliar. Rigor does not
transfer on its own.

A researcher who would never accept a causal claim without a control group, who
would tear that paper apart in review, gets a security alert saying "unusual
login detected, verify now" and clicks before asking the one question their own
discipline trained them to ask: where is the evidence for that premise? The
structure is identical. The eye just does not carry over.

So this is a gym for the reps. The AI is the coach and you do the work.
You **drill** argument structures, pull apart a real situation in **scene**,
**audit** reasoning you could not have produced on an **expedition**, or crack a
layered case flaw by flaw as a **detective**. Every item names the underlying
structure, so the move you just made gets a name rather than staying an
unrepeatable intuition. Whether a named move carries from a journal to an email
to a contract is the open question the field has not settled; this is a place to
practice the move, not a promise that it transfers. All four modes track your patterns over time in
a passport on your machine, showing you what no single session can: your
longitudinal blind spots.

Why spar with an AI? Because criticizing other people is easy and criticizing
yourself is not. An AI removes the audience. Nobody hears you get it wrong. If
you think it is too blunt, push back, argue, close the window, go on with your
day. That zero social cost is what makes it safe enough to look at your own blind
spots, the one thing this practice needs and real life rarely gives you room
for. An AI coach is the cheapest place in the world to lose face.

One honest limit, stated where you can see it rather than buried: the material
is AI-generated at runtime, so it can be wrong. drill is the sharp case. Its
items have a keyed answer and the coach rules right or wrong against it, but
that key is written and audited by the same model, in the same session. The
reverse-solve gate (modes/drill.md) makes the model re-solve its own item with
fresh eyes, which catches sloppy distractors; it does not make the key
independently verified. No human and no second model signs off, so on a subtle
item the coach can confidently key the wrong option. Treat it as a sparring
partner, not an oracle: a ruling that does not survive your own argument is a
move to push back on, and pushing back is the practice, not a deference test.
The coach is required to answer the objection on its merits or concede the item
is flawed (modes/drill.md, "honor a challenge to the key"), never to defend the
key by authority. It is practice, not advice.

---

## Stance Charter

Three commitments, non-negotiable:

1. **Not neutral about reasoning quality.** Factual errors, internal
   contradictions, and evidence misreadings are corrected in every mode,
   whoever's frame they sit in. "It's just a perspective" never exempts a
   logical error from correction.

2. **No verdicts between value frames.** Competing interpretations are laid
   out steelmanned, each in its strongest defensible form, and never ranked.
   The coach adjudicates reasoning, not worldviews.

3. **The endpoint is commitment, not permanent neutrality.** Every session
   closes with you taking a defensible position and defending it against the
   strongest objection. Endless hedging is not the goal.

A gym doesn't tell you where to walk. It puts the weight in your hands, and it
will absolutely tell you when you stumble.

---

## The Four Modes

**drill.** Judge stance. Original argument-analysis items built in your field
around one of twelve structures (necessary assumption, alternative cause, reverse
causation, coincidence/timing, sample selection, proxy mismatch, evidence
sufficiency, base rate neglect, regression to the mean, Simpson's paradox,
circular reasoning, hasty generalization). You commit an answer before any
analysis appears; then every option is dissected and the transferable structure
named. You leave with the skeleton, not just the answer.

**scene.** Socratic stance. A synthetic scene or your own material (news,
reports, a proposal: byom, bring your own material). All six interpretive frames
laid out and steelmanned. The camera turns on your own reading too: your
interpretation is examined with the same rigor as the others. Ends with you
committing to a position and defending it against the strongest objection.
Scene also runs a separate **fallacy-recognition track**: bring an argument and
the coach helps you judge whether it commits a named fallacy (false dilemma, ad
hominem, strawman, a fallacious appeal, equivocation) with three honest rulings
(it is a fallacy, it is not, or there is not enough context to say), and a guard
against the opposite mistake of crying "fallacy" at a sound argument. One track
runs at a time; frames are never ranked, but a fallacy in the form of an argument
is named plainly.

**expedition.** Guide stance. Problems that stayed open for decades and fell
to AI-class search, run only from curated packs with verified solutions, never
improvised. You are not expected to solve them; you audit, climb, or forecast,
and what you train is the human-executable translation of machine advantages:
decomposition, representation shifts, small-case probes, pre-committed kill
criteria. Say `expedition` or `impossible`.
(Installed packs live in `expeditions/`. Without a pack the mode says so
honestly and routes you to drill or scene; the authoring spec is
`expeditions/PACK-SCHEMA.md`.)

**detective.** Guide-and-judge stance. A single runtime-generated case in your
own field, worked as a multi-layer escape room: each layer hides one keyed flaw,
and catching it yields a concrete key (a number, a name, a threshold) that is the
necessary input to the next layer's puzzle. You carry each discovery downward
until the final layer's key is the case's truth. It sits between scene and
expedition: it judges (the flaws are real, against a frame the case states up
front), but the material is generated fresh each time rather than drawn from a
verified pack. Say `detective` (or 查案 / 破案 / 偵探).
(Detective generation is the most demanding work in the skill; recommended on an
opus-class or stronger model. On weaker models it degrades to fewer layers or
declines to start rather than shipping a broken case.)

---

## Which Domains, Which Mode

Not every field plugs into every mode, and the gym says so rather than
pretending otherwise. The twelve drill structures are seven causal-inductive plus three statistical plus two formal/inductive tools:
they need material where someone offers **evidence for a conclusion** and a
single gap can be engineered. That fits some fields natively and not others.
When you name a domain that does not fit drill, the coach **stops, says why,
and points you to the path that does**. It never silently re-skins another
field's material under your domain's name.

**Fields that fit drill directly** (anything built on empirical or causal
argument):

- **Physics, chemistry, biology, earth science.** Not the laws or theorems
  themselves (those are deductive; see below), but *experimental reasoning*: a
  paper claims A caused B without controlling a third factor
  (`alternative_cause`), a sample that excludes the cases most able to refute
  it (`sample_selection`), a metric that measures activity instead of the
  claimed outcome (`proxy_mismatch`). You drill the gap between a study's
  evidence and its conclusion.
- **Human geography, economics, the social sciences, policy, medicine,
  education, business.** Causal and inductive claims are the native material.
- **Manipulation recognition.** Its own built-in domain (below).

**Fields that need scene mode, not drill** (where there is no single
defensible answer to key against):

- **Music, art, literature, film, design.** Aesthetic and interpretive
  judgement. Redline 1 forbids the gym from adjudicating a value frame, so it
  will not hand you "is this piece good?" as a keyed item, because that answer
  does not exist. Instead, **scene mode** dissects *discourse about* the art:
  bring a review, a curatorial statement, a critical essay, and the coach lays
  out interpretive frames over its argument ("this essay calls the style a
  decline. On what evidence? What does it not see?"). You audit the reasoning,
  never the artwork.
- **Pure mathematics, formal logic, theoretical CS.** Deductive systems. A
  proof is valid or it is not; there is no inductive gap to engineer. Scene
  mode handles these as **non-social analytical material** (modes/scene.md):
  an adapted lens set (step validity, hidden premises, reversibility, edge and
  degenerate cases, quantifier scope, necessary vs sufficient) dissects a
  flawed derivation step by step.
- **Pure ethics / aesthetics / definitional disputes.** Value and definition
  questions, not evidential ones. Same routing: scene mode, frames laid out,
  no verdict on the value position itself.

This boundary is the tool being honest, not a limitation to work around. A gym
that trains critical thinking must not pretend that "which symphony is better"
or "is this conjecture true" have the same shape as "does this study's evidence
support its claim." Different shapes need different modes, and for the fields
drill cannot key, scene is where you bring your own material and still train
every frame.

(Expedition mode is orthogonal to this: it runs on verified packs regardless of
your home field. What it trains is auditing a chain you could not have produced,
not your domain's content.)

---

## Built-in Domain: Manipulation Recognition

Name it at intake (sales pressure, scam scripts, political rhetoric,
relational manipulation, 話術辨識) and the gym has you practice spotting the
technique rather than memorizing the story: false scarcity, love bombing,
gaslighting, whataboutism, and ten more, each with a counter-question you keep.
Recognition only, by hard rule: the coach never writes, improves, or
personalizes a manipulative script for use on a real target, in any framing.
Political material samples techniques across the spectrum; the technique is
adjudicated, never the position.

---

## Getting Started

Install with either method above ([plugin](#critical-thinking-for-humans) or the
one-line `git clone`), then start any Claude Code session and say `drill`,
`scene`, `expedition`, or `detective`, or just describe what you want to
practice.

On first run the coach asks the three choices, then routes you to your mode; later sessions confirm your profile in one line.

**Intake (three choices):**
- **Field.** Any domain in your own words; multiple fields or "no preference" accepted.
- **Support level.** `intro` (high scaffold), `standard`, or `advanced` (open construction).
- **Feedback style.** `direct` (error stated plainly) or `cushioned` (same fact, more context). The fact of the correction is non-negotiable; the delivery is yours to choose.

**Safe words** (always honored, announced once at session start):
`"stuck"` (demonstration on a parallel case), `"hint"` (one scaffold step),
`"enough for today"` (graceful close), `"forget this one"` (discards pending events only; items already checkpointed stay on disk).
The tool adapts its delivery; it never adapts its standards.

---

## Try This Yourself

Ask any image or text model to generate "a principal talking with a teacher"
ten times. Tally the gender, titles, and who speaks first across the ten
outputs. Bring the distribution to a scene session and examine what you find.
You are not testing whether the model is biased. You are practicing the
examination: which frames can account for the distribution, which cannot, and
what evidence would defeat each reading. Whichever way the tally lands, it
is fully discussable material.

---

## What the Passport Tracks

The passport lives at `~/.ct-gym/` on your machine. It records:

- **drill:** hit/miss per structure ID, per session and longitudinally.
- **scene:** process coverage. Which frames were raised, steelmanned, whether
  the camera turn was completed, whether you made a closing commitment.
- **expedition:** process record per pack. Role taken, which disciplines you
  fired unprompted, whether you articulated the breakthrough.
- **detective:** process record per case. Layers solved of total, eggs found of
  total, confirmed false positives, any correct objections the case key had
  missed, and the main-flaw structures hit (fed into the same per-structure
  miss-log drill uses).
- **The longitudinal mirror:** after enough sessions the passport summary will
  show you patterns no single session shows. For example: "4 of your last 5
  misses are sample_selection," with a citation to the record so you can read it
  yourself. The pattern appears in your passport summary, not as an unprompted
  coach callout.

The passport's relevant content enters the model context when used. You can
run `show passport`, `delete passport`, or `pause recording` at any time.
A sensitive BYOM session writes no passport events at all, not even your closing commitment, unless you explicitly ask.

---

## Theory Grounding

The argument anatomy comes from informal logic (Toulmin, Ennis). The facilitation
model treats ill-structured problems as requiring defensible judgment, not right
answers (King & Kitchener), and hunts assumptions the way adult educators do
(Brookfield, Mezirow). The difficulty system applies scaffolding and
desirable-difficulty research (Vygotsky, Bjork), and items always name their
transferable structure on the hypothesis that labeling aids transfer. That
hypothesis has partial support for near transfer and abstraction (the analogy
literature) and remains contested for the far transfer this tool is reaching
for; the meta-analytic picture on teaching critical thinking is a positive but
moderate, highly heterogeneous effect (Abrami et al.), not a settled result the
tool can borrow as its own.
Item engineering draws on the long-established *form* of critical-reasoning
assessment (the assumption / strengthen / weaken / inference question types
common to standardized reasoning tests generally) as a structural reference,
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
content. Any third-party names that appear in this repository (products,
organizations, researchers, journals) are used nominatively, for
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

## License

Repository content (the modes, shared floor, expedition packs, and docs) is
licensed under CC BY-NC 4.0 (see [LICENSE](LICENSE)). The build and lint code
under `scripts/` is additionally available under the MIT license (see
[scripts/LICENSE](scripts/LICENSE)): Creative Commons licenses are not designed
for software, so the code carries a software license of its own.

---

## claude.ai Build

The repo is the single source of truth; the claude.ai-uploadable zip is generated, never hand-edited:

```
./scripts/build_claude_ai_zip.sh   # → dist/critical-thinking-for-humans-claude-ai.zip
```

The build copies the canonical runtime files, including the 16 expedition
packs, and applies whole-file overlays from `platforms/claude-ai/` (SKILL.md,
shared/redlines.md, shared/scaffolding.md, passport/SCHEMA.md). The platform
delta is storage only: no local filesystem, so the event log becomes a session
tally plus a copy-paste passport block the user saves and re-imports (see
`platforms/claude-ai/passport/SCHEMA.md`); redline 12 is reworded to stay honest
about where conversation data lives. Modes, stances, redlines 1 through 11, 13,
and 14, and the item pipeline are identical. One honest caveat: the expedition
path is less battle-tested on claude.ai than on Claude Code; if the platform
does not expose the bundled pack files to the session, expedition degrades to
its honest no-pack refusal and routes you to drill or scene.

Maintenance rule: when you edit a canonical file that has an overlay counterpart,
review the overlay in the same commit. `scripts/check_invariants.py` re-checks
every redline and SKILL.md invariant against the overlay copies and fails the
build on drift or on local-filesystem vocabulary leaking into the zip.

---

## Portable single-file edition (any model)

For use outside Claude, the repo can build a single self-contained Markdown file
you paste whole into any frontier model's chat:

```
./scripts/build_portable.sh   # → dist/critical-thinking-for-humans-portable.md
```

Paste the file as the system or first message, then say "let's practice critical
thinking" (or `drill` / `scene` / `detective`). The build assembles the file from
the same canonical sources, rewrites the multi-file and on-disk-passport language
into single-document language, and fails if any filesystem, router, or
absent-mode wording survives. The canonical files are never modified.

Two honest caveats live in the file's own header. It was written and tested only
on Claude; it is designed to be model-neutral but is unverified elsewhere, so use
a strong, current model. And two pieces of the full version are absent: the
**expedition** mode (it needs the verified pack library, which cannot fit in one
pasted document) and the on-disk **passport** (a plain chat has no file, so
progress is tracked in the conversation only). The three included modes are
drill, scene, and detective; detective is the most model-dependent and degrades
on weaker models.
