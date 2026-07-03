# Expedition Pack: Keller's Conjecture in Dimension 7

`pack_id: keller-dimension-7`

A 90-year-old tiling conjecture whose last open dimension fell to a SAT search
in 2020 — and whose proof certificate was checked by a proof checker that is
itself formally verified, cleaner provenance than most computer-assisted
results. The pack trains the auditor to locate where trust actually rests: not
in the untrusted solver, but in the machine-verified checker.

## problem

**Keller's conjecture in dimension 7.**

In 1930 Ott-Heinrich Keller conjectured that any tiling of n-dimensional space by translates of the unit cube must contain a pair of cubes that share a complete (n−1)-dimensional face. (This generalized a 1907 conjecture of Minkowski, where the cube centers were assumed to form a lattice; Hajós proved the lattice case in all dimensions in 1942.)

**Statement.** For every n, does every unit-cube tiling of ℝⁿ contain a "facesharing" pair?

**Answer.** TRUE in dimension 7. Brakensiek, Heule, Mackey, and Narváez (2020) proved that every unit cube tiling of ℝ⁷ contains a facesharing pair of cubes. Because the conjecture was already known TRUE for n ≤ 6 (Perron, 1940) and FALSE for n ≥ 8 (Mackey, 2002; the authors re-verify a counterexample in dimension 8), settling dimension 7 — the last open dimension — completely resolves the conjecture: TRUE iff n ≤ 7.

The proof works through the Corrádi–Szabó (1990) reduction to cliques in the Keller graph Gₙ,ₛ, whose vertices are ⟨2s⟩ⁿ with two vertices adjacent iff they differ by exactly s in at least one coordinate and differ in at least two coordinates. A clique of size 2ⁿ in some Gₙ,ₛ witnesses that the conjecture is FALSE in dimension n. Kisielewicz (2017) had reduced dimension 7 to the single question of whether G₇,₃ contains a clique of size 2⁷ = 128. The authors prove (Theorem 1) that none of G₇,₃, G₇,₄, G₇,₆ contains a clique of size 128 — hence the conjecture holds.

**Accessibility note.** The *claim* is visualizable to a layperson: can you ever tile space with cubes so that no two cubes share a full face? The two-dimensional picture (offset brick-laying still forces full-edge contacts) is intuitive. What is NOT human-auditable is the *proof*: it is the absence of a 128-clique in a graph on thousands of vertices, established by a SAT solver emitting a 224-gigabyte unsatisfiability certificate across tens of thousands of subformulas. No human reads that certificate; the audit target is the *encoding* and the *checker*, not the search.

## history

**How long open / who posed it.** Posed by Ott-Heinrich Keller in 1930, generalizing Minkowski's 1907 lattice conjecture. It stood as an open problem class for 90 years; dimension 7 specifically was the final unresolved dimension when the 2020 paper appeared.

**Community attempts / partial progress (all first-party from the paper's introduction).**
- Perron (1940): proved TRUE for n ≤ 6.
- Corrádi & Szabó (1990): introduced the Keller graph Gₙ,ₛ, reducing the geometric conjecture to a finite clique-search problem.
- Lagarias & Shor (1992): proved FALSE for n ≥ 10 by exhibiting a clique of size 2¹⁰ in G₁₀,₂.
- Mackey (2002): proved FALSE for n ≥ 8 via a clique of size 2⁸ in G₈,₂, tightening the gap.
- Debroni, Eblen, Langston, Myrvold, Shor, Weerapurage (2011): showed the largest clique in G₇,₂ has size 124 (not 128) — i.e., the obvious graph does not refute dimension 7.
- Kisielewicz & Łysakowska (2015) and Kisielewicz (2017): reduced dimension 7 to: does G₇,₃ contain a clique of size 128?

After all this, dimension 7 was a single, sharply-posed finite question that still resisted direct attack because the graphs are too large for naive clique search.

**Dead end 1 — search the "natural" graph G₇,₂.** It is a dead end because Debroni et al. (2011) proved its maximum clique is size 124 < 128, so G₇,₂ can neither refute nor confirm dimension 7; the relevant graph turned out to be G₇,₃.
**Dead end 2 — brute-force clique enumeration.** A dead end because the Keller graphs for n = 7 have so many vertices that direct maximum-clique search is intractable for state-of-the-art tools; the paper notes formulas for n > 5 are "challenging" without further structure.
**Dead end 3 — naive SAT encoding without symmetry breaking.** A dead end on its own: the authors state the plain propositional encoding for n > 5 is beyond modern solvers; only after fixing/symmetry-breaking three vertices and adding mechanically-verified symmetry-breaking clauses does it become solvable.
**Dead end 4 — purely human geometric argument.** A dead end because no hand proof distinguished n = 7 (true) from n = 8 (false); the boundary between the true and false regimes is combinatorially delicate and only yielded to exhaustive certified search.

## solution_provenance

**Primary source.** Joshua Brakensiek, Marijn Heule, John Mackey, David Narváez, "The Resolution of Keller's Conjecture." arXiv:1910.03740 (submitted 9 Oct 2019; version v5 dated 17 Apr 2023). Conference version: IJCAR 2020, in *Automated Reasoning*, LNCS 12166, Springer, doi:10.1007/978-3-030-51074-9_4. Journal version: *Journal of Automated Reasoning* (2022), doi:10.1007/s10817-022-09623-5.

**How verified.** I read the paper PDF directly (pages 1–3 for the abstract/introduction/reduction, pages 14–17 for the experiments and verification section). The proof method: a CNF encoding of "Gₙ,ₛ contains a clique of size 2ⁿ" is solved with the CaDiCaL SAT solver; every instance is reported UNSAT; each UNSAT proof is emitted in the DRAT format, optimized with DRAT-trim, and then certified by ACL2check, described in the paper as "a formally-verified checker" (the checker itself is verified within the ACL2 theorem-proving system). The soundness of the added symmetry-breaking clauses was independently "mechanically verified" and validated by a separate DRAT proof. This is what gives the result its clean provenance: the search is untrusted, but its certificate is machine-checked by a checker that has itself been formally verified.

**First-party check — numbers I read directly from the source.** From the paper PDF: TRUE for n ≤ 6 (Perron 1940); FALSE for n ≥ 10 (Lagarias-Shor 1992, clique 2¹⁰ in G₁₀,₂); FALSE for n ≥ 8 (Mackey 2002, clique 2⁸ in G₈,₂); G₇,₂ max clique = 124 (Debroni et al. 2011); reduction to G₇,₃ clique of 2⁷ = 128 (Kisielewicz 2017); Theorem 1 (no 128-clique in G₇,₃, G₇,₄, G₇,₆); SAT solver = CaDiCaL (Biere); DRAT format; DRAT-trim optimizer; ACL2check formally-verified checker; combined s=6 proofs = 224 gigabytes binary DRAT, 6.18·10⁹ proof steps, DRAT-trim using 6.39·10⁸ steps; run on 20 nodes of the Lonestar 5 cluster at 24 CPUs/node; dimension-8 counterexample clique of size 256 in G₈,₂. Submission date 9 Oct 2019 and v5 date 17 Apr 2023 read off the arXiv listing/PDF margin.

**Could NOT confirm first-party.** The popular-press "40 computers, 30 minutes" figure (Quanta Magazine / CMU news) does NOT appear in and is not consistent with the paper, which reports runtimes in CPU-hours on a 20-node cluster; I deliberately do not use it. The exact publication month of the IJCAR/JAR versions I did not read off the venue pages.

## step_graph

- **S0 — Search-first: is dimension 7 actually still open, and is it a single finite question?** `search_first` Confirm via the introduction that n ≤ 6 is settled TRUE (Perron) and n ≥ 8 FALSE (Mackey/Lagarias-Shor), leaving exactly n = 7, which Kisielewicz (2017) had reduced to one clique question. Check: read the introduction's literature chain; the dimension boundaries (≤6 true, ≥8 false) are cited to named prior papers and are independently lookup-able.
- **S1 — Representation shift: geometry → graph cliques.** `representation_shift` Recast "does every cube tiling have a facesharing pair" as "does the Keller graph Gₙ,ₛ contain a clique of size 2ⁿ" via the Corrádi-Szabó reduction. Check: the graph definition (vertices ⟨2s⟩ⁿ; adjacency = differ by exactly s in some coordinate and differ in ≥2 coordinates) is stated precisely and the equivalence is a cited theorem, so the reframing is verifiable independent of the SAT run.
- **S2 — Milestone rewrite: pin the summit to one falsifiable clique claim.** `milestone_rewrite` Restate the summit as the concrete claim "G₇,₃ contains no clique of size 2⁷ = 128" (Kisielewicz's reduction), and the paper's stronger Theorem 1 covering G₇,₃, G₇,₄, G₇,₆. Check: each is a yes/no clique-existence statement on a named finite graph; either graph contains a 128-clique or it does not.
- **S3 — Small-case probe: which graph even can hold 128?** `small_case_probe` Use the known fact that G₇,₂ has maximum clique 124 < 128 (Debroni et al. 2011) to see the natural graph is degenerate for the question, forcing attention to G₇,₃. Check: 124 is a published computed value; that 124 < 128 rules out G₇,₂ as a witness, a one-line arithmetic check.
- **S4 — Kill criteria: encode and decide when to abandon the naive attack.** `kill_criteria` Encode clique existence as a propositional formula; recognize that without symmetry breaking the n > 5 formulas are intractable, so the approach is abandoned in favor of fixing three vertices plus added symmetry-breaking clauses whose soundness is mechanically verified. Check: the abandonment trigger (naive encoding fails for n > 5) and the remedy (mechanically-verified symmetry-breaking) are both stated; the symmetry clauses' soundness has its own DRAT proof.
- **S5 — Lemma decomposition: split the search into certifiable subformulas.** `lemma_decomposition` Break the search over each s ∈ {3,4,6} into tens of thousands of subformulas (a DNF tautology covering the space), solve each with CaDiCaL, and require every subformula's UNSAT proof. Check: the DNFs are mechanically checked to be tautologies (full coverage), and every subformula independently produces a checkable UNSAT certificate; missing coverage or any SAT subformula would break the chain.
- **S6 — Shape question: borrow the certified-SAT pipeline from automated reasoning.** `shape_question` Ask which field has audited giant computer proofs before: SAT-based resolutions of the Erdős discrepancy, Pythagorean triples, and Schur number five. Reuse their machinery — emit DRAT, optimize with DRAT-trim, then certify with the ACL2-verified ACL2check checker. Check: every UNSAT proof is validated by a formally-verified checker (224 GB / 6.18·10⁹ steps for s=6, DRAT-trim using 6.39·10⁸ steps), so the trust rests on the verified checker, not the untrusted solver.

## breakthrough

**S6 is the breakthrough** — not the SAT search itself but the certified-checker pipeline (DRAT proof → DRAT-trim → ACL2check, a checker formally verified in ACL2). It eluded the community because earlier dimension-7 work could pose the clique question but could not produce a *machine-auditable* answer; the move that closes the case is recognizing that the entire trust burden can be shifted onto a formally-verified proof checker, so a 224-gigabyte certificate no human can read still constitutes a rigorous proof. The hard mathematical narrowing (S1–S3, reducing to a single 128-clique question in G₇,₃) was already done by Corrádi-Szabó, Debroni et al., and Kisielewicz; what was missing was certified exhaustive search at scale.

## audit_targets

- **T1 — The true/false orientation is stated correctly (TRUE in dim 7 = no 128-clique).** It is easy to invert: "false in dimension 7" and "facesharing pair exists" sound contradictory but both describe the TRUE case (conjecture holds ⇔ tiling forced to have a facesharing pair ⇔ Keller graph has NO 128-clique). *Objection:* a popular summary or even a WebFetch gloss called the dimension-7 result "false," which would flip the entire pack. *Resolution:* the paper's abstract and Theorem 1 are explicit — "every unit cube tiling of ℝ⁷ contains a facesharing pair," and "Neither G₇,₃ nor G₇,₄ nor G₇,₆ contains a clique of size 2⁷ = 128," i.e. the conjecture is TRUE in dimension 7; I read this directly from the PDF.
- **T2 — Dimension 7 was genuinely the LAST open case.** *Objection:* maybe other dimensions were also open, making "last domino" a rhetorical overstatement. *Resolution:* the introduction states TRUE for n ≤ 6 (Perron 1940) and FALSE for n ≥ 8 (Mackey 2002), so n = 7 is the unique remaining dimension; settling it resolves all n.
- **T3 — The proof was formally verified, and by what.** *Objection:* "formally verified" could be loose marketing for "we ran a SAT solver"; a SAT solver is not a proof. *Resolution:* the solver (CaDiCaL) is untrusted; it emits DRAT certificates that are optimized by DRAT-trim and then certified by ACL2check, a checker the paper calls "formally-verified" (verified within ACL2). The trust is in the verified checker, not the search — that is the load-bearing distinction.
- **T4 — The "40 computers / 30 minutes" figure must NOT be cited.** *Objection:* that vivid figure appears in reputable secondary coverage (Quanta, CMU news), so it seems safe to include. *Resolution:* it does not appear in the paper, which reports 20 cluster nodes at 24 CPUs/node and runtimes in CPU-hours; including it would import an unverifiable popular-press number, so it is omitted and flagged.
- **T5 — The clique size and target graph (128 in G₇,₃) are exact.** *Objection:* 2⁷ might be misremembered, or the wrong graph named (G₇,₂ has max clique 124). *Resolution:* paper states the reduction is to a clique of size 2⁷ = 128 in G₇,₃; G₇,₂'s max clique is the *different* value 124, which is precisely why G₇,₂ cannot answer the question.

