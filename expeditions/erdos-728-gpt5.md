# Expedition Pack: The First "Autonomously AI-Resolved" Erdős Problem (Auditor)

`pack_id: erdos-728-gpt5`

In January 2026, a GPT-5-class model produced a resolution of an open Erdős
problem, formalized in Lean and kernel-checked, and Terence Tao — after an
initial contention that a human observation had been injected was raised and
clarified — vouched that no human mathematical insight entered the core step.
You audit the two-track verification
that makes this trustworthy — a machine kernel-check AND a named expert's review,
each checking something the other cannot — and, harder, you hold three loaded
words to their exact scope: what "resolved," "autonomously," and "first" actually
mean here. The load-bearing discipline is that a 0-sorry kernel-checked proof
guarantees the proof is *valid*, and says nothing about whether the statement is
the *right* one, whether the result is *novel*, or whether the process was
*autonomous* — and those are exactly the claims the headline rests on.

## problem

**The summit.** Erdős problem #728 (from Erdős, Graham, Ruzsa & Straus, 1975)
concerns how large the gap `a + b − n` can be when the factorial divisibility
`a! · b! ∣ n! · (a+b−n)!` holds, with `a` and `b` in a fixed proportion of `n`.
Erdős had shown `a + b ≤ n + O(log n)`; the problem asks whether the gap can
actually reach that logarithmic scale. In January 2026 this was resolved by a
proof that GPT-5.2 Pro produced (the mathematical argument) and that the
Aristotle system auto-formalized into Lean; the writeup is arXiv:2601.07421 (Nat
Sothanaphan, 2026). It is reported as the first Erdős-catalogue problem regarded
as *autonomously* resolved by an AI.

**What was actually produced, and the three words to audit.** The Lean file
proves two theorems: a one-sided lower bound (`erdos_728`: infinitely many
triples with the gap *exceeding* `C log n`) and the two-sided "log window"
(`erdos_728_fc`: the intended form, placing the gap within a prescribed
constant-multiple window of the log scale). Both are 0-sorry and kernel-checked
on the three standard Lean axioms. But three headline words each need pinning:
- *Resolved* — of the *intended* statement, which humans had to reconstruct: the
  original 1975 wording was vague and admitted trivial solutions, so forum
  participants identified the two-sided log-window version as "the" problem
  before the AI solved that.
- *Autonomously* — meaning no human *mathematical* observation was injected into
  the core step (a claim that was briefly contested, then clarified). It does NOT
  mean hands-off: humans selected the problem, ran the tools, prompted
  iteratively, reconstructed the statement, and later simplified the proof.
- *First* — #728 landed inside a January 2026 cluster of near-simultaneous
  AI-Erdős resolutions; it is credited as the first *autonomous* one, not a lone
  event.

**Accessibility note.** You do not need to read the Lean proof or know Kummer's
theorem. You need to hold two verification tracks apart — a machine kernel that
guarantees *the stated theorem is valid*, and a human expert who judges *whether
the stated theorem is the actual problem, whether it is novel, and whether the
process was autonomous* — and to pin each of the three loaded words to what the
sources actually support. Comfort with the idea that a proof can be perfectly
valid yet prove the *wrong statement* is enough; the number theory is background,
the two-track audit is the exercise.

## history

The Erdős problems are a catalogue (erdosproblems.com, maintained by Thomas
Bloom) of the roughly one thousand problems Paul Erdős posed, ranging from
trivial-once-noticed to famously hard. The milestone here is not a centuries-old
conjecture falling; it is a *capability and workflow* claim — that an AI system
can originate a correct, novel-to-the-literature research argument end-to-end and
have it kernel-checked. The reasons the naive readings fail are the teaching
context.

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
  frontier.** As reported in the writeup and press (his exact posts are not
  quoted here first-party — see solution_provenance), Tao characterized #728 as
  "lowest hanging fruit," amenable to standard techniques (Kummer's theorem, the
  probabilistic method), with similar results already in the literature. The real signal is *speed and autonomy on an
  easy open problem*, not that a machine cracked something humans could not.

## solution_provenance

**Where the solution lives.** Primary source: Nat Sothanaphan, "Resolution of
Erdős Problem #728: a writeup of Aristotle's Lean proof," arXiv:2601.07421 (2026,
v5). The proof artifact is the Lean file `Erdos728b.lean` in the public repo
`github.com/plby/lean-proofs` (Lean v4.24.0). The mathematical argument is
credited to GPT-5.2 Pro; the auto-formalization to the Aristotle system
(Harmonic). Terence Tao engaged with the result publicly (Mathstodon, project
wiki).

**How verified — two tracks, stated precisely.**
- *Machine track — Lean kernel.* The Lean file is 0-sorry (no gaps), uses no
  unsound escape hatches (no `native_decide`, no `sorryAx`), and its two theorems
  depend only on the three standard Lean/Mathlib axioms — `propext`,
  `Classical.choice`, `Quot.sound` — the ordinary trusted set essentially all of
  Mathlib rests on. This is re-runnable: compiling the file and running its
  `#print axioms` commands yields that clean signature. It guarantees the *stated
  theorems are valid*.
- *Human track — expert review.* Tao read the result, added literature, judged
  the writeup ("clunky and 'AI' in feel," reaching a research-paper "ballpark"
  only after cleanup), and vouched for the autonomy claim. This is an informal
  expert endorsement, not a formal peer review — but it supplies exactly the
  three judgments the kernel cannot: that the formalized statement matches the
  intended problem, that the result is novel to the literature, and that the
  process was autonomous.

**Where the guarantee does and does not come from.** REAL is met as a *public
preprint plus a public, re-runnable Lean artifact plus informal expert
endorsement* — NOT as a peer-reviewed publication. The rigorous correctness
guarantee comes from the Lean kernel, not from a journal.

**First-party check.** Read directly: the arXiv abstract and HTML
(arXiv:2601.07421); the full Lean file `Erdos728b.lean` (1422 lines) — confirmed
0 sorry, the `#print axioms` commands at lines 1416/1419, and the constructive
witness for the "Infinite" claim. **Could not verify first-party:** the
erdosproblems.com/728 entry (returns HTTP 403 to automated fetch; the problem
statement was confirmed instead from the paper and the Lean file's embedded
restatement), and Tao's exact verbatim wording (his Mathstodon posts did not
render; his quotes here come from the paper's account and secondary press, and
are flagged as such). Also: the axiom *lines* in the file are `--` comments, not
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
  guarantees: the Lean kernel proves *the stated theorem is valid*; the human
  expert judges *statement-fidelity, novelty, and autonomy*. Neither subsumes the
  other. Check: the Lean file is 0-sorry on three standard axioms (validity); Tao
  supplied the literature/novelty/autonomy judgments the kernel cannot make.
- **S2 — Reframe "resolved" as "a kernel-checked proof of a human-reconstructed
  statement"** `representation_shift` Shift from "the AI solved #728" to "the AI
  proved a statement that humans first reconstructed as the intended #728." The
  original 1975 wording was vague and admitted trivial solutions; the two-sided
  log-window version is the human-identified intended problem. Check: the Lean
  file's own comment notes the catalogue's trivial version; `erdos_728_fc` is the
  reconstructed two-sided statement, distinct from the weaker one-sided
  `erdos_728` sitting beside it.
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
  `milestone_rewrite` Final defensible claim: "A GPT-5-class model originated a
  correct, novel-to-the-literature argument (using standard techniques) for the
  human-reconstructed intended form of Erdős #728, auto-formalized into Lean,
  kernel-checked at 0 sorry on the three standard axioms, and endorsed — not
  peer-reviewed — by Terence Tao, who framed it as lowest-hanging-fruit whose
  real significance is speed and autonomy, not difficulty." Check: every clause
  traces to a first-party source; drop any and you either lose information or
  introduce an overclaim.

## breakthrough

**The breakthrough to audit is not a mathematical one — it is the two-track
verification structure (S1), and its hinge is realizing that the kernel and the
human check *orthogonal* things.** The prior reflex in "AI does mathematics" is
to argue about whether a fluent output is correct; formalizing into Lean settles
correctness mechanically, which is genuinely decisive. But the moment correctness
is mechanical, the contestable claims migrate *outward* — to whether the formal
statement is the real problem, whether the result is novel, and whether the
process was autonomous — and the kernel is silent on all three. What makes this
result a milestone is not that #728 was hard (Tao calls it lowest-hanging-fruit)
but that an AI originated a research-grade argument end-to-end at speed and it
kernel-checks; and what makes it *auditable* is that the human track (Tao) exists
precisely to cover the three things the machine track cannot. The discipline the
pack trains is refusing to let the airtight correctness guarantee launder the
contestable "resolved / autonomous / first" wrapper.

## audit_targets

- **T1 — "If the Lean kernel accepts it, why does Tao's review add anything?"**
  *Objection:* the kernel is a stronger guarantee than any human judgment, so the
  expert review is redundant. *Resolution:* the kernel proves *the stated Lean
  theorem is valid* — it cannot check that the theorem *is* Erdős #728 (the
  formalization gap), that the result is *novel*, or that the process was
  *autonomous*. Tao supplies exactly those three judgments. The two tracks are
  orthogonal — machine: internal validity; human: statement-fidelity, novelty,
  provenance. Neither is redundant; this is the pack's core lesson.
- **T2 — "0 sorry means the problem is solved."** *Objection:* a kernel-checked,
  gap-free proof settles it. *Resolution:* 0 sorry proves *validity*, not
  *relevance*. A misstated or vacuous theorem can be 0-sorry and kernel-valid yet
  prove nothing about the intended problem. Here the danger was concrete — the
  catalogue's literal statement was trivial, and the intended two-sided form had
  to be human-reconstructed. The proof matters only because humans first fixed
  the statement and Tao confirmed the match. A 0-sorry proof of the wrong
  statement is worthless.
- **T3 — "Autonomously resolved" means the AI did it hands-off.** *Objection:*
  "autonomous" reads as no human involvement. *Resolution:* the claim is narrow —
  no human *mathematical* observation entered the core step (and even that was
  briefly contested before being clarified). Humans selected the problem, prompted
  iteratively, reconstructed the statement, and simplified the proof. "Autonomous"
  = no injected human insight in the key argument, NOT hands-off. Pin the word to
  its exact scope.
- **T4 — "First Erdős problem AI-resolved" is a hard-math frontier.** *Objection:*
  a machine cracked something that stumped humans. *Resolution:* Tao called #728
  "lowest hanging fruit," solvable with standard techniques (Kummer, the
  probabilistic method), with similar results already in the literature; problems
  left unsolved for decades were likely never seriously attempted, not
  resistant. The result is novel-to-the-literature but not a conceptual
  breakthrough; the real signal is speed and autonomy, and "first" is
  first-among-a-simultaneous-January-2026-cluster, not a lone event.
- **T5 — "This is peer-reviewed, published science."** *Objection:* an arXiv
  paper with a public proof reads as a publication. *Resolution:* it is an arXiv
  *writeup* (by Sothanaphan, not the operators) at v5, not peer-reviewed; the
  rigorous guarantee comes from the Lean kernel, and Tao's endorsement is informal
  (Mathstodon / project wiki), not a journal review. REAL is met as
  preprint-plus-re-runnable-artifact-plus-informal-endorsement — "published /
  peer-reviewed" would overstate it. (On the axiom footprint's re-runnable-only
  guarantee, see solution_provenance.)
