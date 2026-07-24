# Expedition Pack: The Erdős Discrepancy Problem

`pack_id: erdos-discrepancy`

## scope_and_setting

**Scope card — two results with different logical reach.**

| Result | Exact scope | What the artifact establishes |
|---|---|---|
| Konev–Lisitsa SAT result (2014) | **Only C=2** | A length-1160 ±1 sequence of discrepancy 2 exists; none of length 1161 exists. The negative half uses an independently checked DRUP certificate of about **13 GB**. |
| Tao theorem (2015) | **Every positive bound C** | Every infinite ±1 sequence has unbounded discrepancy; Tao's argument also covers sequences valued in the unit sphere of a real or complex Hilbert space. |

Use one metaphor throughout: finite ±1 sequences form a branching tree, with
the sequence length as the level. A length-1160 witness is one visible node;
UNSAT at 1161 says the C=2 tree has no next level, so it has no infinite
branch. The general *compactness* bridge says that if bounded-discrepancy
nodes existed at every finite level, König's lemma would supply an infinite
branch. **Where the metaphor breaks:** the 13 GB DRUP file is not a picture of
that tree—it certifies that a particular Boolean encoding has no solution—and
Tao's all-C proof does not search the tree level by level.

**Terms kept precise.** A *homogeneous arithmetic progression* is the list of
multiples `d, 2d, 3d, ...`; *discrepancy* is the largest absolute running sum
of the ±1 entries read along such a list. `SAT` asks whether a Boolean formula
has a satisfying assignment. `UNSAT` says none exists, and `DRUP` is a
machine-checkable format for certifying that negative answer.

**Declared black boxes.** The reader may take the DRUP checker's internals and
Tao's Fourier-analysis and multiplicative-functions machinery on trust. The
auditable claims are their scopes and verification chains. The positive and
negative SAT halves are intentionally asymmetric: the 1160 sequence is easy to
recheck, while the 1161 impossibility certificate is enormous.

## problem

**Statement.** In the 1930s Paul Erdős conjectured that for every positive integer C and every infinite sequence (x_n) with each x_n ∈ {+1, −1}, there exist positive integers d and k such that the partial sum along the homogeneous arithmetic progression has absolute value exceeding C:

> | x_d + x_{2d} + x_{3d} + ... + x_{kd} | > C.

Informally: no ±1 sequence can keep the running sums along *all* progressions (d, 2d, 3d, ...) bounded. The discrepancy of any infinite ±1 sequence is infinite. This was one of the long-standing open problems in combinatorial number theory and discrepancy theory.

**Answer.** The conjecture is TRUE — proven in two distinct senses by two distinct methods.

1. *Machine, one case (Konev & Lisitsa, 2014).* For C = 2: a ±1 sequence of length 1160 with discrepancy 2 exists, but no sequence of length 1161 does. Hence no infinite discrepancy-2 sequence exists. The negative half is a ~13 GB machine certificate.
2. *Human, full generality (Tao, 2015).* For every C and every f: ℕ → {−1,+1}, the discrepancy is infinite. A conventional human-surveyable proof, settling the conjecture for all C at once (and even for f valued in a Hilbert-space unit sphere).

**Accessibility note.** Prerequisites are signed addition, multiples, and the
idea of a finite prefix of an infinite list. The C=1 case had a human proof
before these results. For C=2, the positive claim is cheap to inspect: re-add
the printed 1160 signs through every running sum on every multiples-list. The
negative claim is the declared black box: verify the SAT encoding and the
independent certificate check rather than trying to survey 13 GB line by line.
Tao's analytic machinery is also a black box here; the accessible audit is
that his theorem covers all C, whereas the SAT artifact covers only C=2.

## history

**How long open / who posed it.** Posed by Paul Erdős in the 1930s (he restated it in "Some unsolved problems," *Michigan Math. J.* 4(3), 1957). Open "for more than eighty years" per Konev & Lisitsa. The C=1 case was settled earlier (referenced via Mathias 1993 in their bibliography); all C ≥ 2 remained open until 2014–2015.

**Community attempts.** The problem became a flagship target of Polymath5 (Gowers' massively-collaborative project, 2009–2010). A purpose-written program had found a discrepancy-2 sequence of length 1124 but could not push further; Polymath participants suspected exhaustive computer search was hopeless ("it seems unlikely that we could answer this question just by a clever search of all possibilities on a computer," quoted by Konev & Lisitsa from the Polymath wiki).

Dead end 1: **Hoping bounded-discrepancy sequences exist.** A natural guess is that some clever infinite ±1 sequence keeps all progression-sums bounded. This is a dead end because it is simply false — Tao proved discrepancy is always infinite, and even the C=2 sub-case is killed by a finite obstruction at length 1161.

Dead end 2: **Naive exhaustive search.** Brute-forcing all ±1 sequences is a dead end: 2^1161 candidates is astronomically beyond enumeration. The SAT approach worked only because modern solvers prune the space via learned clauses, not because the space is small.

Dead end 3: **Treating the C=2 SAT result as the whole conjecture.** Settling C=2 is a dead end as a route to the general theorem: the certificate is specific to one bound, grows explosively with C (C=3 was left open with only a length-13,000 sequence found, no impossibility proof), and gives no general argument. An auditor must not let "computer proved it" for C=2 stand in for the conjecture.

Dead end 4: **Expecting a short, human-checkable certificate from the SAT route.** The unsatisfiability witness is ~13 GB of DRUP resolution steps. Hoping to compress this into human comprehension is, by the authors' own admission, an open challenge — "a challenging problem to produce a compact proof more amenable for human comprehension."

## solution_provenance

**Where the verified solutions live.**

1. Boris Konev & Alexei Lisitsa, "A SAT Attack on the Erdős Discrepancy Conjecture," arXiv:1402.2184 (submitted 10 Feb 2014; v2 17 Feb 2014). Department of Computer Science, University of Liverpool. Also published in *Theory and Applications of Satisfiability Testing — SAT 2014*, LNCS 8561, Springer (link.springer.com/chapter/10.1007/978-3-319-09284-3_17).

2. Terence Tao, "The Erdős discrepancy problem," arXiv:1509.05363 (submitted 17 Sep 2015; v6 last revised 13 Jan 2017). Published in *Discrete Analysis* 2016:1.

**How verified.** I read the Konev & Lisitsa PDF (arXiv:1402.2184) page by page first-party. Verified directly from the text: the abstract's C=2 claim; Proposition 3 ("There exists a sequence of length 1160 of discrepancy 2"); the length-1161 unsatisfiability run (Glucose, ~21,500 seconds, DRUP certificate); the sentence "The size of the certificate is about 13 GB" and that it was independently verified with the drup-trim tool; Theorem 1 ("No sequence of length 1161 has discrepancy 2"); Corollary 1 ("The Erdős discrepancy conjecture holds true for C=2"); the C=3 result (a length-13,000 sequence found, conjecture NOT settled for C=3); and the discussion sentence comparing the certificate's "gigantic size" to "the size of the whole Wikipedia." For Tao I read the arXiv abstract page first-party, confirming the full general result, the three proof ingredients (Fourier reduction to completely multiplicative functions, logarithmically-averaged Elliott conjecture, unbounded-discrepancy argument), the Hilbert-space extension, the Polymath5 acknowledgment, and the *Discrete Analysis* 2016:1 venue.

**First-party check.** Read directly from the Konev & Lisitsa PDF: 1160, 1161, "about 13 GB", ~21,500 s, Theorem 1, Corollary 1, C=3 length-13,000, the Wikipedia comparison wording, authors, affiliation, 10/17 Feb 2014 dates. Read directly from the Tao arXiv abstract: title, author, 17 Sep 2015 / 13 Jan 2017 dates, *Discrete Analysis* 2016:1, full-conjecture claim, three ingredients, Hilbert-space extension, Polymath5 mention. Could NOT confirm first-party from the primary PDF: the prior-record length of 1124 is stated in the paper as a "bespoke computer program" result (read first-party in the paper) but the original program/source was not independently checked; the *Nature*-press "proof too long to check" framing came from a secondary (Slashdot/Aperiodical) source, not the paper. The exact peer-review/acceptance date of the SAT 2014 LNCS chapter was not read first-party.

## step_graph

- **S0 — Frame the conjecture as a finite-vs-infinite question.** `representation_shift` `milestone_rewrite` Recast "infinite sequence has unbounded discrepancy" into checkable claims: (a) for each C, is there an infinite ±1 sequence with discrepancy ≤ C? (b) equivalently, is there an upper bound L(C) on the length of any finite ±1 sequence of discrepancy ≤ C? If L(C) is finite, no infinite bounded sequence exists. Check: the equivalence is by König-style compactness (an infinite bounded sequence would give arbitrarily long finite ones); independently checkable by noting every initial segment of an infinite discrepancy-≤C sequence is itself discrepancy ≤ C.
- **S1 — Reduce C=2 impossibility to a single Boolean satisfiability instance.** `representation_shift` `lemma_decomposition` Encode "a ±1 sequence of length l with discrepancy ≤ C exists" as a propositional formula φ(l,C) (automata-trace encoding, Proposition 1/2 in the paper) that is satisfiable iff such a sequence exists. Check: Propositions 1–2 assert the formula is satisfiable iff the sequence exists and that a model uniquely identifies the sequence — verifiable by inspecting the automaton A_C (Figure 1) and the transition clauses.
- **S2 — Probe small lengths to find the exact boundary.** `small_case_probe` Iteratively increase l for C=2; the solver finds satisfying assignments up to l=1160 and reports UNSAT at l=1161. Check: the length-1160 witness is printed in Appendix A and is independently re-checkable by hand/program (sum every progression, confirm all ≤2) — this is the cheap, human-surveyable half.
- **S3 — Certify the negative (UNSAT) half and accept its asymmetry.** `kill_criteria` `lemma_decomposition` For l=1161, generate a DRUP unsatisfiability certificate (~13 GB) and independently verify it with a checker (drup-trim). The abandonment condition is explicit: if no compact human proof emerges, accept the machine certificate as the proof of Theorem 1, while flagging that "length 1160 has discrepancy 2" is trivially checkable but the negative witness is not. Check: certificate correctness was independently re-verified by a separate tool; an auditor checks that UNSAT(1161) plus the compactness step (S0) yields "no infinite discrepancy-2 sequence," i.e. Corollary 1 — settling only C=2.
- **S4 — Recognize the C=2/C=3 scaling wall: this SAT run did not settle C=3.** `kill_criteria` `small_case_probe` Applying the same SAT encoding to C=3 finds a discrepancy-3 sequence of length 13,000 but produces no impossibility result (runs at lengths 14,000 / 16,000 did not return within ~1.55M / 2.28M seconds). Check: the paper states C=3 remained open. This marks the computational scaling limit reached by that run, not a proof that the encoding itself cannot be generalized to other C.
- **S5 — Shift to multiplicative-function structure.** `representation_shift` `shape_question` A Fourier-analytic reduction obtained as part of Polymath5 sends the general problem to (stochastic) completely multiplicative functions, recognizing the shape of an *analytic number theory* problem rather than a finite search problem. Check: Tao's abstract credits this as the first of three ingredients and explicitly attributes it to Polymath5; the reduction is an ingredient of his published, peer-reviewed argument, not a machine-verified artifact.
- **S6 — Import the Elliott-conjecture machinery to close it for all C.** `shape_question` `lemma_decomposition` Tao applies a logarithmically-averaged form of the Elliott conjecture (on correlations of multiplicative functions, from his own recent work) to reduce to the case where the function "pretends to be" a modulated Dirichlet character, then shows unbounded discrepancy there. Check: these are ingredients 2 and 3 in Tao's abstract; together they yield "discrepancy is infinite" for every f: ℕ → {−1,+1}, generalizing past the C=2 machine result and extending to Hilbert-space-valued f.

## breakthrough

**S6 is the closing hinge.** Polymath5 supplied the Fourier-analytic reduction
in S5; Tao's logarithmically averaged Elliott machinery then made that route
close, followed by the unbounded-discrepancy argument for the remaining
structured case. This credit split comes directly from Tao's three-ingredient
abstract. The pack does not oppose “Polymath case analysis” to Tao's move:
Polymath5 is part of the successful analytic chain.

## audit_targets

- **T1 — "The 13 GB SAT certificate proves the Erdős conjecture."** *Objection:* It proves only the C=2 case (Corollary 1), not the conjecture for all C; C=3 was left open. *Resolution:* Confirmed first-party — the paper's title says "Attack," Corollary 1 is scoped to C=2, and the C=3 section explicitly reports failure to settle it. The full conjecture was proven only later by Tao. Auditors must reject the conflation of "machine settled C=2" with "conjecture proven."
- **T2 — "Tao's proof and the SAT proof are the same result by different means."** *Objection:* They are not co-extensive — Tao proves all C (and Hilbert-space-valued f); the SAT proof is one finite case. *Resolution:* Confirmed from both abstracts. The honest claim is that both *exist* for the same conjecture, illustrating two shapes of knowledge, not that they prove the same statement.
- **T3 — "The whole SAT proof is unsurveyable, so the result is uncheckable."** *Objection:* Only the negative half (UNSAT at 1161) is the ~13 GB certificate; the positive half (length-1160 witness, Appendix A) is trivially human-checkable, and the certificate itself was independently re-verified by a second tool. *Resolution:* Confirmed first-party — the paper notes the length-1160 sequence "can be easily checked either by a straightforward computer program or even manually," and the certificate was checked with drup-trim. "Unsurveyable" applies to the resolution refutation, not the theorem's verification chain.
- **T4 — "13 GB is an approximate/secondhand figure."** *Objection:* If unverified it should be cut. *Resolution:* Read directly from the paper body: "The size of the certificate is about 13 GB." The Wikipedia-size comparison is also the authors' own wording, not press embellishment. Verified.
- **T5 — "The conjecture was about discrepancy exceeding C, and C=1 was already known — so C=2 was the last gap."** *Objection:* False; C=2 was one of infinitely many open cases (all C≥2), and settling it left C=3+ open. *Resolution:* Confirmed — Tao's general theorem, not the C=2 machine result, closed the infinitely-many remaining cases at once.
