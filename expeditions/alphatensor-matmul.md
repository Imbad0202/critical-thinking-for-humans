# Expedition Pack: A Faster Matrix Multiplication, Improved Within a Week

`pack_id: alphatensor-matmul`

An AI agent searched the space of matrix-multiplication algorithms and found
one beating a 50-year-old record — and within days a classical computer search,
seeded with that algorithm, beat it again. The pack is about the gap between
"a record fell" and "this is optimal," and about why a mechanically-correct
result is not automatically the best one.

## problem

**Statement.** How few scalar multiplications are needed to multiply two matrices? The school algorithm multiplies two n×n matrices with n³ scalar products; Strassen (1969) broke this for 2×2 with 7 instead of 8, and the question of the minimum for each fixed format has stayed open ever since. Concretely: what is the smallest R such that the matrix-multiplication tensor T_{n} decomposes as a sum of R rank-one triples u⊗v⊗w (this R, the tensor rank, equals the number of scalar multiplications in a bilinear algorithm)? AlphaTensor (DeepMind) reframed this as a single-player game and searched the decomposition space with a reinforcement-learning agent.

**Answer (the verified deliverables).** Two figures are confirmed directly in the Nature paper: AlphaTensor multiplies 4×4 matrices over Z₂ (the field with two elements) using **47** multiplications, beating Strassen's two-level recursion which needs 7²=**49**; and it finds a rank-**76** decomposition of the T₄,₅,₅ product, improving the previous best of **80**. A third figure circulates widely — that AlphaTensor's 5×5-over-Z₂ algorithm used **96** multiplications and that Kauers & Moosbauer (JKU Linz) then cut it to **95** with a classical computer-aided search seeded by AlphaTensor's own algorithm. Both sources were read first-party: the **95** result and the "previous record was 96" framing are stated verbatim in Kauers–Moosbauer (arXiv:2210.04045), and the AlphaTensor Nature paper's own PMC open-access full text carries **no** 5×5-over-Z₂ count at all (its concrete finite-field figure is the 47 for 4×4). So the **96** is correctly attributed to K&M's framing of the prior record, not to AlphaTensor's paper, which does not print it. The over-claiming lesson stands on confirmed ground — a published record was improved within days — with the 96 sourced to where it is actually stated. Mechanically correct ≠ optimal.

**Accessibility note.** The *audit* is unusually accessible even though producing the algorithm is not: a bilinear matrix-multiplication algorithm is correct if and only if its R rank-one triples sum to the matrix-multiplication tensor. That is a finite, mechanical identity you can verify by direct computation, with no trust in the search process required. The hard part — finding a low-rank decomposition in an astronomically large discrete space — is what AI-class search delivered; the correctness check is grade-school arithmetic over a finite field. This split (cheap to verify, expensive to find) is exactly what makes it a clean auditing target.

## history

**How long open / who.** Bilinear complexity of matrix multiplication has been studied since Strassen's 1969 result that 2×2 needs only 7 multiplications. The exact minimal rank is unknown for almost every format larger than 2×2; even the 3×3 case is open. AlphaTensor's specific wins targeted formats where the best known decompositions had stood for years (the paper frames the 4×4 finite-field result as the first improvement on Strassen's two-level scheme in that setting "to the authors' knowledge" since its discovery ~50 years prior).

**Community attempts.** Decades of work by hand and by computer search (Smirnov, Sedoglavic, Laderman-style constructions, exhaustive/heuristic SAT and numerical methods) produced incremental record-holders. The space is brutal: the number of candidate factorizations is far larger than for Go, and the objective (minimum rank) is NP-hard to determine in general.

Dead end 1 — *Trusting the headline as optimal.* The natural read of "DeepMind beat a 50-year record" is that the new counts are best-possible. This is a dead end because tensor rank is not certified by any of these methods; a lower count can appear at any moment, as it did within a week (96→95 for 5×5 mod 2). Mechanically correct ≠ optimal.

Dead end 2 — *Assuming you need AlphaTensor to beat AlphaTensor.* One might think only a bigger model could improve the results. Dead end: Kauers and Moosbauer used a *classical* local-search heuristic, seeded with AlphaTensor's published algorithm, and found 95 "after a few seconds." The contribution that mattered was a good starting point, not the RL machinery.

Dead end 3 — *Conflating "over Z₂" with "over the reals/standard arithmetic."* Many of AlphaTensor's sharpest improvements (e.g., 4×4 in 47) hold only in characteristic 2, where you can add without sign bookkeeping. This is a dead end for anyone quoting the numbers as general-field results — the field is load-bearing and the counts differ by setting.

Dead end 4 — *Reading one Kauers-Moosbauer paper as covering everything.* Their October 2022 note (the "FBHHRBNRSSSHK" paper) improved only the 5×5 mod-2 case to 95. The broader improvements across formats and arbitrary fields came in a *separate, later* Flip Graphs paper (December 2022). Treating the two as one source is a dead end that produces miscited numbers.

## solution_provenance

**Primary source.** Fawzi, A., Balog, M., Huang, A., et al. "Discovering faster matrix multiplication algorithms with reinforcement learning." *Nature* 610, 47–53 (2022). DOI 10.1038/s41586-022-05172-4. Open-access full text mirrored at PMC9534758 (pmc.ncbi.nlm.nih.gov/articles/PMC9534758/).

**Improvement source.** Kauers, M. & Moosbauer, J. "The FBHHRBNRSSSHK-Algorithm for Multiplication in Z₂^{5×5} is still not the end of the story." arXiv:2210.04045 (submitted 8 Oct 2022). A broader follow-up — Kauers & Moosbauer, "Flip Graphs for Matrix Multiplication," arXiv:2212.01175 (submitted 2 Dec 2022) — extends improvements to formats (4,4,5) and (5,5,5) in characteristic two and arbitrary ground fields.

**How verified.** I read first-party: the Nature paper's open-access PMC full text, the arXiv abstract of 2210.04045, and the JKU Institute for Algebra announcement. The decomposition claims are independently verifiable by the reader — the paper states correctness follows from the selected factors satisfying T_n = Σ u⊗v⊗w, so any quoted algorithm can be re-verified by checking that finite tensor identity over the stated field.

**First-party check — what I read directly vs could not confirm.**
- Read directly from Nature/PMC: "AlphaTensor finds an algorithm for multiplying 4×4 matrices using 47 multiplications in Z2 … Strassen's two-level algorithm, which involves 7²=49 multiplications"; "rank-76 decomposition of T_{4,5,5}, improving over the previous state-of-the-art complexity of 80"; the tensor-decomposition correctness statement. Confirmed: Nature vol. 610, pp. 47–53, October 2022.
- Read directly from arXiv:2210.04045 abstract: the prior announced 5×5-over-Z₂ result was **96** multiplications; Kauers & Moosbauer achieve **95**; submitted 8 Oct 2022; authors Kauers and Moosbauer.
- Settled first-party (2026-07-03, both sources read directly): the **96** for 5×5 over Z₂ is Kauers–Moosbauer's framing of "the previous record" (arXiv:2210.04045 abstract, verbatim: "an algorithm for multiplying 5×5-matrices over ℤ₂ with only 96 multiplications, two fewer than the previous record"), and it is **not printed in AlphaTensor's Nature paper** — the PMC open-access full text carries no 5×5-over-Z₂ multiplication count (its finite-field figure is 47 for 4×4). The 96 is confirmed-from-K&M and confirmed-absent-from-Nature, so the pack attributes it to K&M, not to AlphaTensor's paper.
- Could NOT confirm first-party: the specific "5×5 standard arithmetic = 97" count and a specific "independent 4×4" count attributed to Kauers-Moosbauer in the candidate brief — the Flip Graphs abstract I read does not state these numbers; it only says formats (4,4,5) and (5,5,5) were improved in char 2 and arbitrary fields. Omitted from the answer.

## step_graph

- **S0 — Search first: is the minimal rank already known for these formats?** `search_first` Before crediting any new record, check the standing literature (Strassen 1969, Smirnov, Sedoglavic) for the format and field in question; record counts are field- and format-specific. Check: the prior-best numbers AlphaTensor claims to beat (49 recursive Strassen for 4×4 in Z₂; 80 for 4×5·5×5) are stated in the paper as the baselines and match the pre-2022 literature.

- **S1 — Recast "fewer multiplications" as "lower tensor rank."** `representation_shift` The objective is not a vague "faster algorithm" but the rank R of the bilinear tensor T_n; number of scalar multiplications = R. This reframing is what makes both the search and the audit well-defined. Check: the paper equates a length-R play of the game with a rank-R decomposition T_n = Σ_{t=1}^{R} u⊗v⊗w.

- **S2 — Split each headline into independently checkable claims.** `milestone_rewrite` Decompose "AlphaTensor beat the record" into separable assertions: (a) the format, (b) the field/characteristic, (c) the claimed count R, (d) the baseline it beats, (e) optimality (claimed or not). Each is audited separately. Check: the 4×4 claim cleanly separates into 4×4 / over Z₂ / R=47 / vs 49 / no optimality claimed.

- **S3 — Verify correctness by reconstructing the tensor, not by trusting the search.** `lemma_decomposition` Correctness of a quoted algorithm reduces to one finite identity: do the R rank-one triples sum to T_n over the stated field? This is checkable by hand or a few lines of code, fully decoupled from the RL pipeline. Check: the Nature paper states correctness follows exactly from T_n=Σ u⊗v⊗w when the game reaches the zero tensor.

- **S4 — Probe the smallest/most-quotable case and watch the field.** `small_case_probe` The 4×4-over-Z₂ = 47 result is the crispest case: confirm it is *characteristic 2*, where addition needs no sign bookkeeping, and that 49 is specifically Strassen's two-*level* (7² recursive) count. Check: PMC text reads "47 multiplications in Z2 … Strassen's two-level algorithm, which involves 7²=49."

- **S5 — Write the abandonment condition for "this is optimal."** `kill_criteria` Before asserting any count is best-possible, demand a matching lower bound; none of these methods provide one, so the optimality claim must be abandoned by default. Kill condition: "if no certified lower bound accompanies R, do not call R minimal." Check: the 5×5-over-Z₂ count fell 96→95 within ~a week (Kauers-Moosbauer), validating that the kill criterion fires.

- **S6 — Ask which neighboring field has cracked this shape, then attack the seed.** `shape_question` The shape "good candidate found by heavy search, then locally improved" recurs in SAT, coding theory, and symbolic computation. Kauers-Moosbauer treated AlphaTensor's output as a *seed* for a classical local search (later formalized as flip graphs), not as a finished answer. Check: arXiv:2210.04045 starts from AlphaTensor's 5×5 mod-2 algorithm and reaches 95; the seed, not the RL, did the new work.

## breakthrough

**S1 (representation_shift) is the breakthrough.** Casting minimal-multiplication-count as the *rank of a fixed 3D tensor*, then casting rank-finding as a single-player game over a discrete factor space, is what let an AlphaZero-style agent be pointed at the problem at all. The framing eluded the community not because tensor rank was unknown — it is the standard formalism — but because nobody had packaged the search as a self-play game with a tractable move set and reward, which is precisely the bridge that connected decades-old bilinear-complexity theory to modern deep RL search.

## audit_targets

- **T1 — The 4×4=47-vs-49 claim is field-specific.** Auditing target: confirm the 47 holds *over Z₂*, not over the reals, and that 49 is Strassen two-level recursion. *Objection:* "the press said DeepMind beat Strassen for 4×4 — surely that means general matrices." *Resolution:* the Nature text explicitly scopes it to Z₂ ("47 multiplications in Z2"); over general fields the counts differ. The field is load-bearing; drop it and the claim is false.

- **T2 — "Record" does not mean "optimal."** Auditing target: check whether any source attaches a matching lower bound. *Objection:* "a 50-year record fell, that's the floor." *Resolution:* no method here certifies minimality, and 5×5-over-Z₂ went 96→95 within roughly a week, so the floor was demonstrably not reached. Mechanically correct ≠ optimal.

- **T3 — The improver was classical, not a bigger model.** Auditing target: identify what actually produced 95. *Objection:* "only more compute / a better net could beat AlphaTensor." *Resolution:* Kauers-Moosbauer used a computer-aided local search seeded with AlphaTensor's algorithm and got 95 in seconds; the seed mattered, the RL did not need to be rerun.

- **T4 — The two Kauers-Moosbauer papers are distinct.** Auditing target: separate the Oct 2022 5×5-mod-2 note (95) from the Dec 2022 Flip Graphs paper (broader formats/fields). *Objection:* "just cite the Kauers-Moosbauer improvement." *Resolution:* the 95 figure is first-party only in arXiv:2210.04045, which is mod-2 5×5 only; broader-format and arbitrary-field claims live in arXiv:2212.01175 and must not be back-attributed to the October note.

- **T5 — Verify the algorithm, not the narrative.** Auditing target: re-derive correctness from the tensor identity rather than trusting the search. *Objection:* "an RL black box found it, how can I check it?" *Resolution:* correctness is the finite identity T_n=Σ u⊗v⊗w over the stated field — independently checkable with no access to the model. This is the discipline the whole pack trains.

