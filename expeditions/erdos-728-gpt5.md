# Expedition Pack: The First "Autonomously AI-Resolved" Erdős Problem (Auditor)

`pack_id: erdos-728-gpt5`

This pack audits a January 2026 preprint and public Lean proof, not a
peer-reviewed paper. Its hard part is keeping two checks separate: the Lean
kernel checks a proof of the stated theorem, while people must still check what
the theorem means and how the result was produced. The words "resolved,"
"autonomously," and "first" survive only with their qualifiers attached.

## problem

**Scope card — what the sources support.**

- **Status:** Nat Sothanaphan's arXiv:2601.07421 (2026, v5) is a public
  **preprint**, accompanied by a public Lean proof. It is not peer-reviewed.
- **Mathematical target:** Erdős problem #728 asks how large `a + b − n` can be
  when `a! · b! ∣ n! · (a+b−n)!`. For sufficiently small `ε > 0` and any
  `0 < C₁ < C₂`, the preprint's intended result gives infinitely many triples with
  `a,b > εn` and
  `C₁ log n < a+b−n < C₂ log n`. The intended target is this two-sided
  logarithmic window, not the vague literal wording that admitted easy examples.
- **Artifacts:** GPT-5.2 Pro is credited with the mathematical argument and
  Aristotle (Harmonic) with auto-formalizing it in Lean. The file's theorem
  `erdos_728` proves **infinitely many** triples above a one-sided logarithmic
  lower bound. Its theorem `erdos_728_fc` proves **existence of one triple** in
  each fixed two-sided logarithmic window. The stronger “infinitely many in
  every fixed two-sided window” sentence in the preprint is not itself the
  statement of `erdos_728_fc`.
- **Formal guarantee:** both theorems are **0-sorry** — there are no admitted
  proof gaps — and kernel-check using the three standard Lean/Mathlib axioms
  `propext`, `Classical.choice`, and `Quot.sound`. This establishes validity of
  those stated theorems, not statement-fidelity, novelty, or autonomy.
- **Process claim:** the preprint reports that no human mathematical observation
  was supplied for the core step after a contention about that point was
  clarified. Humans still selected the problem, ran and prompted the systems
  iteratively, reconstructed the intended statement, and later simplified the
  proof.
- **Primacy claim:** the preprint calls this the first Erdős-catalogue problem
  regarded as fully resolved autonomously by AI and says no prior resolving
  literature had been found as of its writing. That is a sourced, qualified
  claim, not proof that no such literature can exist; #728 was followed within
  days by related January 2026 resolutions.

**Everyday scene — two checkpoints on one passport.** At the first checkpoint,
the Lean kernel checks the sealed proof term: does every step reach the theorem
printed on the passport? At the second, human reviewers inspect the label and
journey: is this the intended Erdős problem, is it new to the literature, and
what work did humans contribute? Passing the first checkpoint cannot answer the
second checkpoint's questions.

**The summit in plain and precise registers.** Erdős had an upper bound of the
shape `a + b ≤ n + O(log n)`; the question was whether valid triples can make
the extra gap genuinely logarithmic. Keep three claims separate: the preprint
states infinitely many triples in every fixed two-sided **log window**;
`erdos_728` kernel-checks one-sided infinitude; and `erdos_728_fc`
kernel-checks two-sided existence. "Resolved" is the preprint's judgment about
the reconstructed intended form, not a theorem name that erases this
quantifier split. "Autonomous" means no human mathematical observation
injected into the core argument, not no humans in the workflow. "First" means
the qualified first-autonomous attribution in the preprint, not a claim that
this was an isolated or hardest-ever Erdős result.

**Accessibility note — declared black boxes.** You do not need to know Kummer's
theorem, reproduce the number theory, or read Lean syntax. You do need to keep
the machine and human verification tracks separate, inspect the 0-sorry
guarantee's limits, and pin each headline word to the scope card.

**Where the metaphor breaks.** A theorem is not literally a passport, and the
second checkpoint is not another formal kernel. Its judgments were distributed:
the preprint reports a forum consensus on the intended statement, a literature
search by KoishiChan, and Tao's vouch for the narrow autonomy status. None is
journal peer review. The metaphor marks different jobs; it does not make those
human judgments mechanical or infallible.

## history

The Erdős problems are a catalogue (erdosproblems.com, maintained by Thomas
Bloom) of the roughly one thousand problems Paul Erdős posed, ranging from
trivial-once-noticed to famously hard. The milestone here is not a centuries-old
conjecture falling; it is a *capability and workflow* claim — that an AI system
can originate an argument end-to-end and have its stated theorem
kernel-checked, while people separately audit the statement, prior art, and
process. The reasons the naive readings fail are the teaching context.

- **Dead end — trusting a fluent AI-written proof as correct.** An LLM can emit a
  research-level argument that reads convincingly and is silently wrong; prose has
  no kernel to reject a bad step. The whole point of formalizing into Lean is to
  move correctness out of rhetoric and into a mechanical check — which is why the
  kernel track exists.
- **Dead end — treating a 0-sorry kernel check as the *whole* guarantee.** The
  kernel proves the Lean theorem is valid; it cannot check that the Lean theorem
  *is* Erdős #728. Here that gap was real: the file itself notes the catalogue
  displayed a trivial version, and the *intended* statement had to be
  reconstructed by humans first. A kernel check on the wrong statement would be
  worthless — so a second, human track is not redundant, it is necessary.
- **Dead end — reading "autonomous" as "no human in the loop."** Humans selected
  the problem, prompted iteratively (the model did not succeed on the first try),
  reconstructed the statement, and simplified the formalization. The autonomy
  claim is narrow — no injected human *mathematical* insight in the core step —
  and taking it to mean hands-off is the overclaim the pack trains against.
- **Dead end — reading "first Erdős problem AI-resolved" as a hard-math
  frontier.** The preprint itself says the strategy is similar to earlier
  divisor results, and records that Pomerance soon obtained similar conclusions
  by extending prior work. The proof uses standard named tools such as Kummer's
  theorem and a counting argument. The milestone claim is about the reported
  workflow and speed, not evidence that this was the hardest catalogue problem.

## solution_provenance

**Where the solution lives.** Primary source: Nat Sothanaphan, "Resolution of
Erdős Problem #728: a writeup of Aristotle's Lean proof," arXiv:2601.07421 (2026,
v5). The proof artifact is the Lean file `Erdos728b.lean` in the public repo
at
https://github.com/plby/lean-proofs/blob/main/src/v4.24.0/ErdosProblems/Erdos728b.lean
(Lean v4.24.0). The mathematical argument is
credited to GPT-5.2 Pro; the auto-formalization to the Aristotle system
(Harmonic).

**How verified — two tracks, stated precisely.**
- *Machine track — Lean kernel.* The Lean file is 0-sorry (no gaps), uses no
  unsound escape hatches (no `native_decide`, no `sorryAx`), and its two theorems
  depend only on the three standard Lean/Mathlib axioms — `propext`,
  `Classical.choice`, `Quot.sound` — the ordinary trusted set essentially all of
  Mathlib rests on. This is re-runnable: compiling the file and running its
  `#print axioms` commands yields that clean signature. It guarantees the *stated
  theorems are valid*.
- *Human track — several distinct judgments.* The preprint reports that forum
  participants reached consensus on the stronger intended statement;
  KoishiChan searched for prior resolving literature and found none as of the
  writeup date; and Tao vouched for the narrow autonomy status, while also
  suggesting further ideas and finding extra literature. These are attributed
  process reports, not a formal peer review, and no one actor is made to certify
  statement fidelity, novelty, and autonomy alone.

**Where the guarantee does and does not come from.** REAL is met as a *public
preprint plus a public, re-runnable Lean artifact plus attributed human review*
— NOT as a peer-reviewed publication. The rigorous correctness guarantee comes
from the Lean kernel, not from a journal.

**First-party check.** Read directly: the arXiv abstract and HTML
(arXiv:2601.07421); the full Lean file `Erdos728b.lean` (1422 lines) — confirmed
  0 sorry, the `#print axioms` commands at lines 1416/1419, the one-sided
  `.Infinite` statement of `erdos_728`, and the two-sided existential statement
  of `erdos_728_fc`. **Could not verify first-party:** the
erdosproblems.com/728 entry (returns HTTP 403 to automated fetch; the problem
statement was confirmed instead from the paper and the Lean file's embedded
restatement), and Tao's exact verbatim wording (his Mathstodon posts did not
render, so this pack uses only the preprint's attribution and does not quote or
paraphrase unverified post wording). Also: the axiom *lines* in the file are `--` comments, not
captured live output — the clean three-axiom signature is guaranteed only when
the file is recompiled, which anyone can do.

## step_graph

- **S0 — Read the writeup and the Lean file before trusting the headline**
  `search_first` Retrieve arXiv:2601.07421 and the public Lean file before
  accepting "AI autonomously resolved an Erdős problem." Separate the distinct
  claims: (a) the Lean theorems are valid, (b) they are Erdős #728, (c) the AI
  did it autonomously, (d) it is the first. Check: the abstract states the
  autonomous-resolution framing; the Lean file exists and is public.
- **S1 — Split the two verification tracks and name what each checks**
  `lemma_decomposition` Decompose "is this trustworthy?" into two independent
  guarantees: the Lean kernel proves *the stated theorem is valid*; people must
  judge *statement-fidelity, novelty, and autonomy*. Neither subsumes the other.
  Check: the Lean file is 0-sorry on three standard axioms (validity); the
  preprint separately attributes the intended-statement consensus to forum
  participants, the prior-art search to KoishiChan, and the autonomy vouch to
  Tao.
- **S2 — Reframe "resolved" as "a kernel-checked proof of a human-reconstructed
  statement"** `representation_shift` Shift from "the AI solved #728" to "the AI
  produced an argument for a statement that humans first reconstructed as the
  intended #728, with two related Lean theorems." The original 1975 wording was
  vague and admitted trivial solutions; the two-sided log-window version is the
  human-identified intended problem. Check all three quantifiers separately:
  the preprint states two-sided infinitude, `erdos_728` states one-sided
  infinitude, and `erdos_728_fc` states two-sided existence. A kernel check of
  the last two must not be paraphrased as if `erdos_728_fc` itself were
  `.Infinite`.
- **S3 — Audit the axiom footprint as the trust boundary** `small_case_probe`
  Probe the smallest concrete trust artifact: the axiom list. Propositional
  extensionality, `Classical.choice`, and `Quot.sound` are the three standard
  axioms; no sorry-axiom, no custom axiom, no native-decide escape hatch. Check:
  re-running `#print axioms` on the compiled file yields exactly those three —
  the clean signature that says the proof imports no exotic assumption.
- **S4 — Pin the word "autonomous" to its exact scope** `kill_criteria` Set the
  disqualifier for "autonomous": the claim is only that no human *mathematical*
  observation entered the core step — it is defeated if a human supplied the key
  insight, not merely if a human was involved. Check: a contention that a human
  observation had been injected was explicitly clarified as not so; but humans
  did select the problem, prompt iteratively, reconstruct the statement, and
  simplify the proof — so "autonomous" survives only in its narrow sense, and
  "hands-off" is the reading to kill.
- **S5 — Which other field audits this exact shape?** `shape_question` The shape
  is "a machine-verified core wrapped in contestable human-facing claims" —
  identical to auditing a verified compiler (trust the proof, interrogate the
  *spec*) or an ML benchmark (trust the score, interrogate the *harness*). Borrow
  that discipline: trust the kernel; interrogate the statement, the novelty, and
  the provenance. Check: the locus of doubt is not the proof term but the
  formalized statement and the "autonomous / first" wrapper — the same place
  bodies are buried in formal-verification and eval claims.
- **S6 — Recast the summit as the sentence that survives audit**
  `milestone_rewrite` Final defensible claim: "A GPT-5-class model originated
  the argument that a non-peer-reviewed preprint presents as resolving the
  forum-identified two-sided form of Erdős #728. Lean checks, at 0 sorry on
  three standard axioms, a one-sided infinitude theorem and a two-sided
  existence theorem; the latter is not itself the preprint's stronger
  two-sided-infinitude sentence. The preprint reports that KoishiChan found no
  prior resolving literature and that Tao vouched for the narrow autonomy
  status; the kernel proves neither claim." Check: every clause traces to a
  first-party source; drop any qualifier and you introduce an overclaim.

## breakthrough

**The breakthrough to audit is not a mathematical one — it is the two-track
verification structure (S1), and its hinge is realizing that the kernel and the
human check *orthogonal* things.** The prior reflex in "AI does mathematics" is
to argue about whether a fluent output is correct; formalizing into Lean settles
correctness mechanically, which is genuinely decisive. But the moment correctness
is mechanical, the contestable claims migrate *outward* — to whether the formal
statement is the real problem, whether the result is novel, and whether the
process was autonomous — and the kernel is silent on all three. What makes this
result a milestone is the preprint's claim that an AI originated the argument
end-to-end and it kernel-checks; the source does not establish a comparative
difficulty ranking. What makes it auditable is that the human track is split
among forum participants, KoishiChan, Tao, and the writeup author to cover
questions the kernel cannot. The discipline is refusing to let the airtight
correctness guarantee launder the contestable "resolved / autonomous / first"
wrapper.

## audit_targets

- **T1 — "If the Lean kernel accepts it, why does any human review add anything?"**
  *Objection:* the kernel is a stronger guarantee than any human judgment, so the
  expert review is redundant. *Resolution:* the kernel proves *the stated Lean
  theorem is valid* — it cannot check that the theorem *is* Erdős #728 (the
  formalization gap), that the result is *novel*, or that the process was
  *autonomous*. The preprint assigns those checks to different people: forum
  participants, KoishiChan, and Tao respectively. The two tracks are orthogonal
  — machine: internal validity; human: statement-fidelity, prior-art search,
  provenance. Neither is redundant.
- **T2 — "0 sorry means the problem is solved."** *Objection:* a kernel-checked,
  gap-free proof settles it. *Resolution:* 0 sorry proves *validity*, not
  *relevance*. A misstated or vacuous theorem can be 0-sorry and kernel-valid yet
  prove nothing about the intended problem. Here the danger was concrete — the
  catalogue's literal statement was trivial, and the intended two-sided form had
  to be human-reconstructed. There is also a theorem-shape distinction inside
  the artifact: `erdos_728` gives one-sided infinitude, while `erdos_728_fc`
  gives two-sided existence, not two-sided infinitude. The proof matters only
  because humans inspect both the intended statement and these exact
  quantifiers. A 0-sorry proof of the wrong or overstated theorem is worthless.
- **T3 — "Autonomously resolved" means the AI did it hands-off.** *Objection:*
  "autonomous" reads as no human involvement. *Resolution:* the claim is narrow —
  no human *mathematical* observation entered the core step (and even that was
  briefly contested before being clarified). Humans selected the problem, prompted
  iteratively, reconstructed the statement, and simplified the proof. "Autonomous"
  = no injected human insight in the key argument, NOT hands-off. Pin the word to
  its exact scope.
- **T4 — "First Erdős problem AI-resolved" is a hard-math frontier.** *Objection:*
  a machine cracked something that stumped humans. *Resolution:* the preprint
  uses standard named techniques, relates the strategy to earlier results, and
  records a later Pomerance note with similar conclusions. Its bounded claim is
  that no prior **resolving** literature was found as of the search, not that the
  problem was uniquely deep. "First" is also followed within days by related
  January 2026 resolutions, not a lone event.
- **T5 — "This is peer-reviewed, published science."** *Objection:* an arXiv
  paper with a public proof reads as a publication. *Resolution:* it is an arXiv
  *writeup* (by Sothanaphan, not the operators) at v5, not peer-reviewed; the
  rigorous guarantee comes from the Lean kernel, while the preprint reports
  forum review, KoishiChan's literature search, and Tao's autonomy vouch rather
  than a journal review. REAL is met as
  preprint-plus-re-runnable-artifact-plus-attributed-public review — "published /
  peer-reviewed" would overstate it. (On the axiom footprint's re-runnable-only
  guarantee, see solution_provenance.)
