# Expedition Pack: No Projective Plane of Order 10 (Lam's Problem)

`pack_id: lams-problem`

Audit a NEGATIVE result: there is no projective plane of order 10. A 1989
supercomputer search said so but left no certificate; a 2020 SAT-based redo
produced an independently checkable nonexistence certificate — and found
consistency issues in the older searches. The load-bearing question: how do
you verify that something does not exist?

## problem

**Statement.** A finite projective plane of order *n* is an incidence structure of points and lines in which any two distinct points lie on exactly one common line, any two distinct lines meet in exactly one point, and (nondegeneracy) not all points are collinear. The axioms force every line to contain *n*+1 points and force exactly *n*²+*n*+1 points and the same number of lines. **Lam's problem** asks whether a projective plane of order **10** exists — i.e. whether a 111×111 (since 10²+10+1 = 111) 0/1 incidence matrix satisfying the projective axioms can exist. Order 10 was the smallest order for which existence was theoretically open.

**Answer.** No. There is no projective plane of order 10. The result was first obtained experimentally by Lam, Thiel, and Swiercz (1989) via exhaustive computer search, confirmed independently by Roy (2011), and in 2020/2021 re-derived by Bright, Cheung, Stevens, Kotsireas, and Ganesh in a form that produces **independently checkable nonexistence certificates** (DRAT proofs) for the hardest sub-case — the first time the result became verifiable by a third party without trusting the search code.

**Accessibility note.** The *statement* is reachable by any undergraduate who has met finite geometry: it is a finite, fully specified combinatorial existence question over a 111×111 binary matrix. The *resolution* is not human-surveyable — it is the exhaustion of an astronomically large case space, reduced via deep coding-theory constraints (the hypothetical plane's error-correcting code must contain codewords of restricted weights) to finite SAT searches. The new primitive-weight-19 search alone used about 24 months of desktop-CPU time at 2.1 GHz. The auditor's burden is not "follow the proof" but "trust that an exhaustive negative search missed nothing" — which is exactly why the certificate, not the search, is the object of audit.

**Load-bearing map.** Picture the proof as a corridor with three locked rooms.
The coding-theory reduction says that any order-10 plane must enter at least one
room: a weight-15 codeword, a weight-16 codeword, or a primitive weight-19
codeword. Here *weight* is the number of 1s in a binary word. *Primitive* is the
source's precise name for the third kind of weight-19 word; its coding-theory
definition is a declared black box. The weight-15 companion paper locks the
first room, the distinct weight-16 companion paper locks the second, and the
main AAAI paper locks the third.
Only all three locked rooms **plus** the theorem that this is the exhaustive
room list establish nonexistence. A DRAT proof is a replayable receipt showing
that one precise SAT clause set has no solution. The metaphor breaks at the
geometry-to-code reduction and the geometry-to-SAT encoding: a receipt cannot
show that the room list is exhaustive or that the clauses faithfully represent
projective planes. Those two translations, and the A1/A2/A5 enumeration
machinery inside the searches, are declared black boxes for a non-specialist
reader and remain explicit audit targets.

**Back-translation test.** From that corridor description, a domain reviewer
must be able to recover the precise claim: the published coding-theory result
restricts a hypothetical order-10 plane to codewords of weight 15, weight 16,
or primitive weight 19; the three cited certificate projects exclude those
cases separately; and their DRAT proofs certify SAT unsatisfiability rather
than the correctness of the coding reduction or clause encodings.

## history

**How long open / who.** Projective planes have been studied since the 1600s (renaissance perspective geometry). Order 10 was the smallest theoretically uncertain case. The question was settled experimentally in **1989** by Lam, Thiel, and Swiercz (Canadian J. Math. 41(6):1117–1123) after about 27 months on a VAX 11/780 plus about three months on a CRAY-1A. It was independently re-run by **Dominique Roy (2011)**, a Carleton master's thesis, using about 27 months on 2.4 GHz CPUs. Both relied on bespoke, custom-written search code and produced **no certificate** — the result rested on trusting the program. The new primitive-weight-19 SAT search used about 24 months on desktop CPUs at 2.1 GHz. The verifiable-certificate work is **Bright, Cheung, Stevens, Kotsireas, Ganesh, "A SAT-based Resolution of Lam's Problem," AAAI 2021 / arXiv:2012.04715** (distinct companion papers handle the weight-15 and weight-16 sub-cases).

**Dead end 1: "trust the 1989 program."** The original result is a *negative* result with no externally checkable artifact. A bug, a missed case, or a hardware fault in the 1989 CRAY-era code could silently turn a real plane into a reported nonexistence, and no one outside could detect it. This is a dead end for *certainty*: Lam himself wrote about how hard it is to make custom search code simultaneously correct and efficient. The 2020 work in fact uncovered count discrepancies (in the "A2" enumeration) between the 1989 search and the 2011 verification — they disagree with each other — proving the worry was not hypothetical.

**Dead end 2: brute force over all 111×111 incidence matrices.** The raw configuration space is hopeless; naive enumeration is a dead end. The tractable path only opens after the coding-theory reduction (Carter 1974; MacWilliams–Sloane–Thompson 1973): a hypothetical plane's binary code must contain a codeword of weight 15, 16, or "primitive" weight 19, collapsing the problem to three structured sub-searches.

**Dead end 3: hand-checking the search.** Even reduced, the primitive weight-19 case explores hundreds of millions of cubes; no human can survey it. Treating the proof as human-readable is a dead end — the only viable audit target is a machine-checkable certificate plus a small trusted SAT encoding.

**Dead end 4: "re-running it confirms it."** Roy (2011) re-ran an *independent* search and still got nonexistence, which feels like confirmation — but two trust-the-program searches that disagree on intermediate counts (the A2 totals) show that agreement on the headline answer does not certify the search was sound. Re-execution without a certificate is a dead end for true verification.

## solution_provenance

**Where the verified solution lives.** Primary: Curtis Bright, Kevin K. H. Cheung, Brett Stevens, Ilias Kotsireas, Vijay Ganesh, "A SAT-based Resolution of Lam's Problem," *Proceedings of the AAAI Conference on Artificial Intelligence* 35(5), 2021 — https://ojs.aaai.org/index.php/AAAI/article/view/16483 ; preprint arXiv:2012.04715 (submitted 2020-12-08). Companion papers: arXiv:1911.04032 "A Nonexistence Certificate for Projective Planes of Order Ten with Weight 15 Codewords" (Bright, Cheung, Stevens, Roy, Kotsireas, Ganesh; Applicable Algebra in Engineering, Communication and Computing, doi:10.1007/s00200-020-00426-y); and arXiv:2001.11973 "Unsatisfiability Proofs for Weight 16 Codewords in Lam's Problem" (Bright, Cheung, Stevens, Kotsireas, Ganesh; IJCAI 2020, doi:10.24963/ijcai.2020/203). The neighbouring arXiv:2001.11974 is a separate oval paper, not the load-bearing weight-16 companion. Certificates and code are hosted at uwaterloo.ca/mathcheck.

**How verified.** I read the full text of arXiv:2012.04715 first-party (extracted from the PDF). Verification chain inside the paper: SAT instances solved by MapleSAT; resulting DRAT (Deletion Resolution Asymmetric Tautology) proofs checked by independent verifiers GRATgen and DRAT-trim. The "main" certificates (~4GB) are checked with DRAT-trim in forward-checking mode; the full GRATgen check of all proofs took about 33,000 core hours. Symmetry handling uses the Traces library, but the paper explains how the certificates are checkable without trusting Traces' output.

**First-party check — numbers I read directly from arXiv:2012.04715:** order-10 nonexistence; 111×111 incidence matrix and the *n*²+*n*+1=111 count; the three codeword cases (weight 15, weight 16, primitive weight 19) and that this paper handles the hardest, the primitive weight-19 case (15/16 handled in companions); DRAT format; main certificates ~4GB; Traces A2 labellings ~7GB; ~33,000 core-hours for GRATgen checking; cubing produced over 312 million cubes in ~1,200 hours; 45 remaining cases with 639,075 nonisomorphic A2s; 24,882 partial solutions checked; the new SAT search's ~24 months at 2.1 GHz; Roy 2011's ~27 months at 2.4 GHz; the 1989 VAX/CRAY split; and the discovered A2-count discrepancies between the two prior searches. I also read arXiv:2001.11973 directly to confirm that it, not the oval paper, supplies the weight-16 certificates.

## step_graph

- **S0 — Reduce the existence question to a coding-theory shape.** `representation_shift` `shape_question` First prove that every possible plane must enter one of the three rooms. Precisely: instead of searching 111×111 incidence matrices directly, use the result (Carter 1974; MacWilliams–Sloane–Thompson 1973) that the binary code of a hypothetical order-10 plane must contain a codeword of weight 15, 16, or primitive weight 19. The "shape" borrowed is error-correcting-code structure constraining a combinatorial design. *Check:* the reduction is a published theorem; an auditor confirms it is cited, not re-derived, and notes it as a *non-machine-verified* assumption the whole result rests on.
- **S1 — Split into three independently provable sub-cases.** `lemma_decomposition` Lock each room separately. Precisely: weight 15, weight 16, primitive weight 19 are handled separately (15/16 in companion 2020 papers; 19 — the hardest — here). *Check:* each sub-case gets its own SAT encoding and certificate; the union of the three nonexistence proofs plus the exhaustive three-case reduction of S0 is what closes the problem. Auditor verifies all three exist and together cover every case.
- **S2 — Encode the sub-case as Boolean SAT.** `representation_shift` `milestone_rewrite` Turn each remaining room into a finite rule sheet a solver can test. Precisely: the summit ("no plane exists") is recast as a chain of SAT-unsatisfiability claims over an explicit clause set. *Check:* the encoding is published; an auditor must read the encoding to be convinced it faithfully expresses the geometry — this is the irreducible trust point, smaller than trusting a whole search program.
- **S3 — Stage the search: enumerate A1, then A2, then block completions.** `lemma_decomposition` `kill_criteria` Divide the largest room into labelled shelves small enough to check. Precisely: the search proceeds by levels (66 A1 cases up to isomorphism; A2 extensions; selected blocks of A5). Symmetry breaking via Traces blocks isomorphic partial completions. *Check:* each level emits a certificate; cube-and-conquer (March_cu) splits the hard case into 312M+ cubes so each piece is independently solvable and the cutoff is a written stopping rule.
- **S4 — Solve and emit DRAT certificates.** `milestone_rewrite` Keep a replayable receipt for every empty shelf. Precisely: MapleSAT solves each instance; every unsatisfiability is recorded as a DRAT proof (main certs ~4GB). *Check:* the certificate is the deliverable, not the solver's say-so — it is a standalone artifact replayable by any verifier.
- **S5 — Independently check every certificate.** `kill_criteria` Give every receipt to independent checkers. Precisely: GRATgen and DRAT-trim re-verify the DRAT proofs (~33,000 core-hours for GRATgen); the auditor need not trust MapleSAT or Traces. *Check:* if any DRAT proof fails its verifier, the claim is abandoned — this is the explicit kill criterion that the 1989/2011 searches lacked.
- **S6 — Probe consistency against the prior searches.** `small_case_probe` Compare the new shelf counts with the old searches before trusting the headline. Precisely: compare the A1/A2 enumeration counts against Lam-Thiel-Swiercz 1989 and Roy 2011. *Check:* the comparison found that the two prior searches *disagree with each other* on A2 counts — a small-case consistency probe that exposes why a certificate (not re-execution) was needed.

## breakthrough

**S5 — independent certificate checking — is the breakthrough.** The mathematical answer (no order-10 plane) was already believed since 1989; what eluded the community for three decades was a way to *verify a nonexistence claim without trusting the search program*. The breakthrough is reframing the deliverable from "a program that searched and found nothing" to "a machine-checkable DRAT proof that any third party can replay." It eluded the field because the natural instinct for a negative exhaustive result is to re-run an independent search (Roy 2011) and treat agreement as confirmation — yet the 2020 work's S6 probe showed the two prior searches silently disagreed on intermediate counts, demonstrating that re-execution never actually certified soundness. The enabling tooling (SAT cube-and-conquer plus standardized DRAT proofs and verifiers like GRATgen/DRAT-trim) matured only in the 2010s, which is why the certificate was producible in 2020 but not 1989.

## audit_targets

- **T1 — The coding-theory reduction (S0) is a trusted, non-machine-verified premise.** The whole nonexistence rests on Carter 1974 / MacWilliams–Sloane–Thompson 1973 that the plane's code must have a weight-15, -16, or primitive-19 codeword. *Objection:* "If the certificate is independently checkable, the result is fully formal." *Resolution:* The paper explicitly states it does **not** provide a completely formal proof — it relies on results with no computer-verifiable proofs. The DRAT certificates verify the *SAT sub-searches*, not the geometry-to-code reduction. An honest audit flags S0 as the residual trust point.

- **T2 — Faithfulness of the SAT encoding (S2) is the irreducible trust hinge.** *Objection:* "DRAT-trim proved unsatisfiability, so we're done." *Resolution:* DRAT proves the *clause set* is unsatisfiable; it cannot tell you the clause set correctly models projective-plane incidence. The auditor must independently read the encoding. Verifiability shrinks the trusted base from "a whole search program" to "a clause encoding," but does not eliminate it.

- **T3 — Coverage of all three cases (S1) must be complete.** *Objection:* "This 2021 paper resolves Lam's problem." *Resolution:* This paper alone proves only the **primitive weight-19** case; closure requires the companion certificates for weight 15 (arXiv:1911.04032) and weight 16 (arXiv:2001.11973) **plus** the S0 reduction proving that those three cases are exhaustive. The separate oval paper arXiv:2001.11974 cannot substitute for the weight-16 companion. Auditing only the weight-19 paper and claiming the full problem is closed is a scope error.

- **T4 — "The 1989 result was already enough" is false, and the certificates prove why.** *Objection:* "Two independent searches (1989, 2011) agreed on nonexistence — that is sufficient." *Resolution:* The 2020 work found the 1989 and 2011 searches **disagree with each other** on the A2 enumeration counts (Section 5 / Table 1). Agreement on the headline answer masked inconsistent internals; only a third-party-checkable certificate establishes soundness. This is the load-bearing answer to "why wasn't 1989 enough."

- **T5 — Trust in the symmetry library (Traces) and the solver (MapleSAT).** *Objection:* "Symmetry breaking via Traces could drop a valid configuration." *Resolution:* The paper describes how the certificates are checkable *without trusting Traces' output* — Traces' permutations are recorded and re-verified, and MapleSAT's proofs are replayed by GRATgen/DRAT-trim. The verifier base excludes the heuristic tools by design.
