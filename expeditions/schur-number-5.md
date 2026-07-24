# Expedition Pack: Schur Number Five

`pack_id: schur-number-5`

A combinatorics climb settled by a two-petabyte SAT proof — the largest math
proof at the time — and certified by a formally-verified checker. Same family
as the Pythagorean-triples and Keller packs, but the structure is different:
monochromatic a+b=c, Schur/Ramsey theory, and a far larger scale.

Here SAT is the precise name for Boolean constraint-solving: asking whether
there is any yes/no assignment that obeys all the stated rules.

## problem

**Statement.** A *Schur number* sits inside Ramsey theory's "you cannot avoid structure" family. Colour each integer in {1,...,n} with one of *k* colours. A colouring is *good* if no colour class contains a solution to the equation a + b = c (a and b may be equal). The Schur number S(k) is the **largest** n for which a good k-colouring of {1,...,n} exists. So S(k) marks the exact threshold where monochromatic additive triples become unavoidable no matter how cleverly you colour.

The small values were classical: S(1)=1, S(2)=4, S(3)=13, S(4)=44. The fifth had resisted for decades — only a lower bound was secure.

**Answer.** S(5) = 160. There is a good 5-colouring of {1,...,160} (in fact a palindromic one), and **every** 5-colouring of {1,...,161} is forced to contain a monochromatic a + b = c.

**Accessibility note.** The *question* is stated to a bright high-schooler in one breath: split 1 through 161 into five buckets so no bucket holds x, y, x+y, and prove it cannot be done. The *lower* half of the answer is a single table any reader can check by hand — exhibit one good colouring of 1..160 and verify no bucket has a+b=c. The *upper* half — that 161 is impossible — is where humanity could not follow: the proof that no good 5-colouring of {1,...,161} exists is a two-petabyte object, and that asymmetry (trivially-stated, hand-checkable witness vs. superhuman impossibility certificate) is exactly the audit muscle this pack trains.

**Plain-language reading map.** Keep the five-bucket picture as the one central
metaphor: a satisfying assignment is one successful way to fill the buckets,
while UNSAT is the precise term for saying no such filling exists. The metaphor
breaks at the upper-bound proof: trying many bucket arrangements does not by
itself certify that none was missed. The technical bridge is a DRAT certificate,
a machine-checkable record supporting the UNSAT result, checked by a program
formally verified in ACL2; cube-and-conquer is the precise name for splitting
the search into many cases and solving each. Treat the solver's search
heuristics and petabyte-scale execution as declared black boxes. Audit the SAT
encoding, case coverage, certificate, and checker instead of trusting a bare
solver verdict.

## history

**How long open / who.** Schur introduced these numbers in 1916 (Schur's theorem guarantees S(k) is finite). The first four values were nailed down through the 20th century, S(4)=44 being established by Golomb/Baumert-style search and confirmed by Fredricksen and Sweet (2000). The fifth value stayed open into 2017. The best **lower** bound, S(5) ≥ 160, was found by Exoo in 1994 via an explicit colouring; whether 160 was also the ceiling — i.e. whether some clever 5-colouring of 161 survived — was unknown for over two decades. Marijn Heule closed it in November 2017 (arXiv:1711.08076; AAAI 2018), proving the matching upper bound S(5) < 161.

**Dead end 1 — exhaustive backtracking colouring search.** Naively coloring 1..161 with five colours and backtracking on conflicts is hopeless: the raw search tree is astronomically large and the unsatisfiability has no short human-visible reason. This is a *dead end* for hand or unaided computation; it is the very thing that kept the upper bound open after the lower bound was known.

**Dead end 2 — hoping for a small combinatorial/algebraic certificate.** For some Ramsey-type thresholds one hopes a slick counting or modular argument forces the bound. None was found for S(5); the impossibility appears to have no compressible mathematical reason — the only known witness IS the giant case analysis. Betting on elegance here is a *dead end*.

**Dead end 3 — trusting an unverified solver verdict.** A SAT solver can *claim* "UNSAT" in a few CPU-days. But a multi-CPU-year computation with no checkable certificate is not a proof a mathematician should accept — solvers have bugs. Accepting the bare verdict is a *dead end* on rigor; the whole contribution is the checkable proof, not the answer.

**Dead end 4 — checking the proof with ordinary, unverified software.** Even producing a DRAT certificate is not enough if the checker itself is buggy at petabyte scale. Validating a 2 PB proof with hand-written, untrusted checking code re-imports the trust problem and is a *dead end*; the resolution was a checker formally verified in ACL2.

## solution_provenance

**Publication.** Marijn J. H. Heule, "Schur Number Five." arXiv:1711.08076v1 [cs.LO], submitted 21 Nov 2017. Published in the Proceedings of the Thirty-Second AAAI Conference on Artificial Intelligence (AAAI-18); also OJS AAAI vol. 32 (article 12209) and ACM DL 10.5555/3504035.3504843.

**How verified.** I fetched the arXiv abstract page and the arXiv PDF, extracted the PDF text locally with pdftotext, and read the source sentences directly. Every figure below was verified against that extracted text (not from a summary):
- "We obtained the solution, n = 160" and "We prove that S(5) = 160" — confirmed.
- "The proof is two petabytes in size" / "over two petabytes" — confirmed (stated three times); "about ten times larger than 'the largest math proof ever'" — confirmed.
- DRAT proof system — confirmed; symmetry-breaking predicates expressed in DRAT — confirmed.
- "certified the proof using a program formally verified by ACL2"; specifically a verified LRAT proof-checker written in ACL2 (Kaufmann and Moore) — confirmed.
- Solve effort "over 14 CPU years," checking "a little more than 36 CPU years," wall-clock "less than three days" — confirmed.
- Prior bounds S(5) ≥ 160 (Exoo 1994); the formula is unsatisfiable iff S(5) ≥ 161 — confirmed.
- Top-level partition "10 330 615 cubes after partition balancing"; cube-and-conquer — confirmed.

**First-party check.** I read directly: the arXiv abstract and the full PDF body (introduction, contributions, symmetry-breaking, cube-and-conquer, proof-checking sections, and reference list). I did NOT independently re-run the SAT solve, did not regenerate or re-check the 2 PB proof myself, and did not inspect the AAAI camera-ready PDF (the arXiv v1 is what I read). The "ten times larger than the largest math proof ever" comparison is the paper's own claim citing Lamb 2016 (referring to the ~200 TB Boolean Pythagorean Triples proof); I did not separately re-verify that comparison's arithmetic beyond the paper's statement.

## step_graph

- **S0 — Frame what kind of answer is even being asked for.** `shape_question` The deliverable is not the number 160 (a solver spits that out) but a *machine-checkable certificate* that 161 is impossible, trustworthy enough to count as a proof. Recognizing that the output is a proof object, not a verdict, reshapes every downstream choice. Check: does the artifact let a skeptic re-verify without trusting the solver? If no, the task is not done.
- **S1 — Reduce "S(5)=160" to one decision problem.** `lemma_decomposition` Lower bound is easy (exhibit Exoo's colouring of 1..160). The whole difficulty is the upper bound, encoded as: is the propositional formula F asserting "a good 5-colouring of {1,...,161} exists" *unsatisfiable*? S(5)=160 reduces to UNSAT of one formula. Check: F satisfiable ⟺ S(5) ≥ 161; proving F UNSAT closes the gap exactly.
- **S2 — Recast a number-theory threshold as Boolean SAT.** `representation_shift` Variables x_{i,j} = "number j has colour i"; clauses encode each number gets a colour and no colour class holds a, b, a+b. The additive Ramsey question becomes propositional logic, unlocking SAT machinery. Check: a satisfying assignment decodes back to a valid good colouring, and vice versa — the encoding is faithful.
- **S3 — Validate the encoding and intuition on the known small Schur numbers.** `small_case_probe` Re-derive S(2)=4, S(3)=13, S(4)=44 through the same SAT encoding and symmetry handling before trusting it on the open case; the paper anchors on these (273 extreme certificates for S(4,44), palindromic certificates, etc.). Check: the pipeline reproduces the four classical values exactly before being aimed at 161.
- **S4 — Crush the symmetry, but only in a form the proof can carry.** `representation_shift` Colour permutation σ_col blows the search up fivefold; break it by forcing a lexicographic colour ordering. Critically, the symmetry-breaking predicates are themselves expressed *inside* the DRAT proof so they do not become an unchecked trust hole. Check: R (formula + symmetry predicates) is equisatisfiable with F, and the added predicates are justified within the certificate.
- **S5 — Split the monolith into ten million independent subproblems.** `lemma_decomposition` Cube-and-conquer partitions R_160 into 10,330,615 cubes (variable-assignment subproblems) whose disjunction is a tautology, each solved independently and yielding linear-time speedup across thousands of CPUs. Check: the cubes tile the whole search space (disjunction is a tautology), so solving all of them = solving the original.
- **S6 — Commit to a checkable certificate, not a solver's word.** `kill_criteria` Adopt the rule: a multi-CPU-year UNSAT claim is rejected unless it emits a DRAT proof. This is the explicit kill-criterion separating "solver said so" from "proof." It forces emission of the two-petabyte certificate as a first-class deliverable. Check: every subproblem's UNSAT is backed by DRAT lines; no bare verdicts accepted.
- **S7 — Close the trust loop with a formally-verified checker.** `kill_criteria` The 2 PB proof is validated by a DRAT/LRAT checker that is itself *formally verified in ACL2* — checking the checker. Checking cost (~36 CPU years) exceeded the solving cost (~14 CPU years), a deliberate price for trust. Check: the checker is mechanically verified, so accepting its "valid" verdict requires trusting only ACL2's kernel, not the SAT solver.
- **S8 — Restate the computational result as a mathematical theorem.** `milestone_rewrite` "Solver returned UNSAT on F, certificate validated" is rewritten as the clean statement: S(5) = 160, with a palindromic extreme certificate S(5,160) witnessing the lower bound and a verified impossibility proof for 161. Check: the final claim is phrased as a theorem with both halves (witness + impossibility) independently inspectable.

## breakthrough

The breakthrough is **S7 — closing the trust loop with a checker that is itself formally verified in ACL2.** Producing the UNSAT verdict (and even a DRAT certificate) was within reach of existing cube-and-conquer technology; what made the result a *proof the community could accept* was deciding to spend MORE compute checking than solving (≈36 vs ≈14 CPU years) and to verify the verifier. It eluded the community because the instinct on a hard open problem is to chase the answer and treat a solver's UNSAT as the finish line, whereas the real obstruction was epistemic: at two petabytes, the proof is unsurveyable by humans and even by ordinary software, so trust had to be manufactured by reducing it to a small mechanically-verified kernel rather than to human inspection.

## audit_targets

- **T1 — "The lower bound was the hard part."** *Objection:* surely exhibiting a good colouring of 1..160 is what took decades. *Resolution:* No — the lower bound S(5) ≥ 160 was an explicit colouring known since Exoo 1994 and is hand-checkable; the open, hard half was the *upper* bound (161 impossible), which is precisely the part needing the 2 PB proof. An auditor must not let the easy half launder credibility onto the hard half.
- **T2 — "The solver said UNSAT, so S(5)=160 is proved."** *Objection:* the multi-CPU-year solve already establishes it. *Resolution:* A bare solver verdict is not a proof (solvers have bugs); the load-bearing artifact is the DRAT certificate plus the ACL2-verified checker (S6–S7). Audit target: did the solver's claim get reduced to something independently re-checkable, or are we trusting the solver?
- **T3 — "A formally verified checker means the result is certain."** *Objection:* ACL2 verification closes all doubt. *Resolution:* It reduces trust to (a) the ACL2 kernel and its verified checker, (b) the *faithfulness of the SAT encoding* (S2) and symmetry-breaking justification (S4), and (c) hardware/compiler integrity over 14+36 CPU years. The encoding-correctness gap lives outside the verified checker and is the right place to press.
- **T4 — "Two petabytes" and "ten times the largest math proof."** *Objection:* take the size and the superlative at face value. *Resolution:* The 2 PB figure is the paper's own (stated for the compressed/produced proof); the "ten times larger than the largest math proof ever" is the paper's comparison to the ~200 TB Boolean Pythagorean Triples proof (citing Lamb 2016), not an independently audited measurement. An auditor flags these as author-stated, and notes "largest ever" is time-stamped to 2017.
- **T5 — "Cube-and-conquer is just brute force, so there is no idea here."** *Objection:* it is only parallel search. *Resolution:* The partition's correctness rests on the cube set's disjunction being a tautology (S5) — that tiling property is what makes "solve 10.3M pieces" equal "solve the whole," and symmetry breaking (S4) is what makes it finish in CPU-years instead of decades. The audit target is the tautology/coverage claim, not the parallelism.
