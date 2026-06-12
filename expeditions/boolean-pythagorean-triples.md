# Expedition Pack: The Boolean Pythagorean Triples Problem

`pack_id: boolean-pythagorean-triples`

A Ramsey-theory question that stayed open for roughly three decades and fell
in 2016 to a massively parallel SAT search.

---

## problem

**Statement.** Color every natural number 1, 2, 3, … with one of two colors.
A Pythagorean triple is a set {a, b, c} with a² + b² = c² (such as {3, 4, 5}
or {5, 12, 13}). Is there a coloring in which no Pythagorean triple is
monochromatic — that is, no triple has all three members the same color?

Equivalently: can ℕ be partitioned into two parts such that neither part
contains a Pythagorean triple?

**Answer (2016).** No. The set {1, …, 7824} can be 2-colored avoiding
monochromatic Pythagorean triples, but {1, …, 7825} cannot. Since any
2-coloring of ℕ restricts to a 2-coloring of {1, …, 7825}, no valid coloring
of ℕ exists.

**Accessibility note.** Following this expedition requires: Pythagorean
triples (middle-school algebra), the idea of 2-coloring a set, and basic
propositional logic (variables that are true or false, OR/AND/NOT). SAT
solvers and proof certificates are explained inside the step graph; no prior
exposure is assumed. No Ramsey theory is needed.

---

## history

Ronald Graham offered a $100 prize for resolving the question; the prize had
stood for over two decades by the time of the solution. The problem sits in
Ramsey theory, the study of unavoidable structure: Schur's theorem (1916) had
long established that the *linear* analogue a + b = c is unavoidable — any
finite coloring of ℕ yields a monochromatic solution. Whether the *quadratic*
equation a² + b² = c² behaves the same way remained open.

**Known dead ends** — each one is a discipline failing to fire, or firing
without the machinery to back it:

- **Dead end 1: classical partition-regularity machinery.** Rado's theorem
  completely characterizes which *linear* systems are unavoidable under
  finite colorings. The Pythagorean equation is nonlinear, and the linear
  toolkit has no purchase on it. Decades of Ramsey theory produced no
  human-readable argument for either direction — and still has not: even
  after the 2016 result, no human-surveyable proof is known. WHY it fails:
  the available theory was built for a different equation class; working
  inside it was representation lock-in.

- **Dead end 2: constructive colorings.** Computational local search kept
  extending valid colorings to larger and larger initial segments — the best
  published result, by Cooper and Overstreet, reached {1, …, 7664}. WHY it
  fails as a path to resolution: a found coloring is evidence only for the
  satisfiable side. No accumulation of successful colorings can ever prove
  that some larger n admits none; the method is structurally one-sided.

- **Dead end 3: monolithic search.** Running a single sequential SAT solver
  on the full formula for n = 7825 does not finish in feasible time; even
  *with* the split-based approach, default splitting heuristics put the
  estimated cost near 300,000 CPU hours. WHY it fails: a single search tree
  over a 2^7825-point space is the working-memory ceiling in machine form —
  without decomposition into independent subproblems there is no way to
  parallelize, checkpoint, or trust partial progress.

- **Dead end 4: unverifiable computation.** Even a completed exhaustive
  search would have faced the response: why believe it? A bare "our program
  found no coloring" is a claim about a program, not a proof about numbers.
  WHY it fails: without a checkable artifact, the result inherits every bug
  hypothesis about the solver, the cluster, and the glue code. This dead end
  is what the proof-certificate step exists to close.

---

## solution_provenance

- **Publication:** Marijn J. H. Heule, Oliver Kullmann, Victor W. Marek,
  "Solving and Verifying the Boolean Pythagorean Triples Problem via
  Cube-and-Conquer," SAT 2016, LNCS 9710, pp. 228–245. Preprint:
  arXiv:1605.00723 (May 2016). Peer-reviewed conference publication.
- **Mechanical verification:** the unsatisfiability run emitted a proof in
  DRAT format, approximately 200 TB raw, validated with the drat-trim
  checker at a cost of about 16,000 CPU hours. A compressed 68 GB
  certificate was published, allowing independent re-validation.
- **Certified-checker validation (component):** the encoding-transformation
  proof (68,667 clauses) was later validated by proof checkers whose own
  correctness is machine-checked in Coq and ACL2 (Cruz-Filipe, Heule, Hunt,
  Kaufmann, Schneider-Kamp, "Efficient Certified RAT Verification,"
  arXiv:1612.02353). Note the scope precisely: the certified checkers
  validated the transformation component, not the full 200 TB artifact.
- **Satisfiable side:** the claim about {1, …, 7824} carries its own
  certificate — an explicit valid coloring, checkable in seconds by an
  independent script.
- **First-party check (pack author):** field values below were read from the
  paper itself (arXiv:1605.00723), not from press coverage; figures
  cross-checked for internal consistency (21,900 + 13,200 CPU hours ≈ 4
  CPU-years total).

---

## step_graph

Discipline tags follow modes/expedition.md, The Six Disciplines.

- **S0 — establish the frontier.** `search_first` Before deriving anything,
  collect what is known: Schur's theorem settles the linear analogue;
  Rado's theorem does not cover the quadratic case; the best constructive
  result colors {1, …, 7664} (Cooper and Overstreet); no upper bound is
  known. Check: each item is a literature lookup. The problem is confirmed
  genuinely open — not a forgotten solution awaiting retrieval.

- **S1 — reduce the infinite question to a finite family.**
  `representation_shift` Define P(n): "{1, …, n} admits a 2-coloring with no
  monochromatic Pythagorean triple." If P(n) fails for some n, then ℕ admits
  no valid coloring, because any coloring of ℕ restricted to {1, …, n} would
  be a witness for P(n). Check: this is a two-line restriction argument —
  no compactness or heavy machinery needed for this direction.

- **S2 — encode P(n) as propositional satisfiability.**
  `representation_shift` One Boolean variable x_i per integer i; the value of
  x_i is i's color. For each Pythagorean triple {a, b, c} within {1, …, n},
  two clauses: (x_a ∨ x_b ∨ x_c) and (¬x_a ∨ ¬x_b ∨ ¬x_c) — "not all
  second-color" and "not all first-color." The formula F_n is satisfiable
  exactly when P(n) holds. Check: faithfulness is auditable by hand — the
  encoder is a short enumeration of triples, and any satisfying assignment
  IS a coloring. For n = 7824: 6,492 occurring variables, 18,930 clauses.

- **S3 — shrink the formula without changing its answer.**
  `small_case_probe` Integers appearing in no triple within range are
  unconstrained and drop out. Blocked-clause elimination reduces F_7824 to
  3,740 variables and 14,652 clauses. Complementation symmetry — flipping
  every color in a valid coloring yields a valid coloring — licenses fixing
  one variable; the solvers fix x_2520, the most frequently occurring
  variable. Check: the symmetry argument is one line; the elimination steps
  were themselves emitted as a checkable transformation proof (see
  solution_provenance).

- **S4 — split the summit into two independently checkable claims.**
  `milestone_rewrite` Claim A: F_7824 is satisfiable — provable by
  exhibiting one assignment, verifiable in seconds. Claim B: F_7825 is
  unsatisfiable — the hard direction, requiring search plus a certificate.
  Neither claim depends on the other; each has its own verification path.
  Check: the decomposition itself is just the statement of Theorem 1.1 of
  the paper.

- **S5 — make the hard direction tractable: cube-and-conquer.**
  `lemma_decomposition` (with `kill_criteria` in heuristic selection) A
  lookahead solver partitions F_7825 into one million cubes — partial
  assignments whose union of branches covers the whole search space — and
  each cube becomes an independent subproblem for a CDCL solver. Splitting
  heuristics were tuned on samples before committing the cluster: the
  default-heuristic cost estimate (~300,000 CPU hours) was the written
  abandonment threshold, and tuned 3-SAT lookahead heuristics brought the
  plan to ~35,000 CPU hours before the full run was launched. Check: the
  cube partition is recorded and its covering property is part of the final
  proof artifact, not an article of faith.

- **S6 — run the search.** `lemma_decomposition` (execution) About two days
  on 800 cores of the Stampede cluster: 21,900 CPU hours for splitting,
  13,200 CPU hours for solving — roughly 4 CPU-years total. Every cube came
  back unsatisfiable. Check: each cube's run is independent; any single
  cube's result can be re-run in isolation.

- **S7 — turn "the solver says so" into a proof.** `milestone_rewrite`
  Each CDCL run emitted a DRAT trace; merged with the splitting tree, the
  traces form a single ~200 TB unsatisfiability proof for the original
  F_7825, mechanically validated by drat-trim in about 16,000 CPU hours,
  with a 68 GB compressed certificate published for independent
  re-checking. Claim A's certificate — the explicit coloring of
  {1, …, 7824} — was checked directly. Check: validation is a separate
  program, far simpler than the solvers, running after the fact; trust
  rests on the checker plus the published artifact, not on the search.

- **S8 — close the original question.** The finite result plus S1's
  restriction argument settles the infinite question: ℕ cannot be
  partitioned into two parts each free of Pythagorean triples. Graham's
  prize question is resolved in the negative for two colors. Check: pure
  modus ponens from S1 and S4–S7.

---

## breakthrough

**Step S5** (cube-and-conquer decomposition, `lemma_decomposition`), with S7
(the certificate, `milestone_rewrite`) as its inseparable other half.

One-sentence account of why it eluded the community: the field was locked
into "proof = argument a person reads," and the solution abandoned that
frame — split the infeasible monolith into a million independently
conquerable lemmas and let a checkable certificate, not a human reader,
carry the trust.

---

## audit_targets

Load-bearing steps for the auditor role, each with its strongest known
objection and that objection's resolution.

- **T1 — Encoding faithfulness (S2).** *Objection:* if the triple
  enumeration or clause construction is buggy, the entire 200 TB proof is a
  rigorous statement about the wrong formula — garbage in, certified
  garbage out. *Resolution:* the encoder is a few lines of auditable
  enumeration; F_n can be regenerated independently and compared; and the
  satisfiable side provides an end-to-end test — the published coloring of
  {1, …, 7824} is validated by independent scripts that re-derive the
  triple list from scratch. An encoding bug large enough to corrupt the
  result would have to corrupt two independent reconstructions identically.

- **T2 — Simplification soundness (S3).** *Objection:* blocked-clause
  elimination and symmetry breaking modify the formula; if either fails to
  preserve satisfiability, UNSAT of the reduced formula proves nothing
  about the original. *Resolution:* complementation symmetry is a one-line
  proof (color-flip preserves validity); blocked-clause elimination is
  satisfiability-preserving by published theorem; and concretely, the
  transformation was emitted as its own 68,667-clause proof and validated
  by checkers formally verified in Coq and ACL2 — the strongest
  verification standard applied anywhere in this project.

- **T3 — Cube coverage (S5–S6).** *Objection:* a million UNSAT cubes prove
  nothing if the cubes fail to cover the full search space — a gap in the
  partition is an unexamined region where a coloring could hide.
  *Resolution:* coverage is not assumed; the splitting tree is merged into
  the final DRAT proof, so the validated artifact certifies the original
  formula, and a coverage gap would surface as a failed validation, not a
  silent omission.

- **T4 — Trusting the checker (S7).** *Objection:* drat-trim is unverified
  C code; a checker bug could accept a bogus proof, and nobody can read
  200 TB to notice. *Resolution:* the trust base is deliberately
  asymmetric — the checker is small, independent of the solvers, and
  implements a simple validation algorithm, so trusting the result requires
  auditing the checker, not the 4-CPU-year search; the published 68 GB
  certificate enables independent re-validation; and certified checkers
  with machine-checked correctness proofs existed within a year for the
  proof's transformation component. Residual risk concentrates in a small,
  inspectable kernel.

- **T5 — The surveyability objection (S7–S8).** *Objection:* a proof no
  human can survey is not mathematical knowledge — the same charge leveled
  at the Four Color Theorem in 1976. *Resolution (factual layer):* the
  result's reliability does not rest on surveying the artifact but on the
  verification chain established in T1–T4, each link of which IS humanly
  auditable. What remains
  genuinely open is a different question: WHY 7825, what structural feature
  forces it — the proof certifies the theorem without explaining it, and no
  human-readable explanation is known. An auditor who separates "is it
  true" from "do we understand it" has resolved the objection as far as it
  can be resolved; the two questions have different answers here.
