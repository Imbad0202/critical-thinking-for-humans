# Expedition Pack: A Faster Matrix Multiplication, Improved Within a Week

`pack_id: alphatensor-matmul`

## scope_and_setting

**Scope card — every score needs both a matrix format and an arithmetic
setting.**

| Source-backed result | Matrix format | Arithmetic setting | Multiplication count |
|---|---|---|---:|
| AlphaTensor (Nature) | 4×4 times 4×4 | `Z₂`, the two-element field | **47**, versus Strassen's **49** |
| AlphaTensor (Nature) | 4×5 times 5×5 (`T_{4,5,5}`) | standard arithmetic (`ℝ`, real coefficients) | **76**, versus **80** |
| Prior record as reported by Kauers–Moosbauer | 5×5 times 5×5 | `Z₂` | **96** |
| Kauers–Moosbauer | 5×5 times 5×5 | `Z₂` | **95** |

The 96→95 attribution is deliberately split: Kauers and Moosbauer's own paper
states both the 96 prior record and their 95 result; the AlphaTensor Nature
article directly supplies the 47→49 and 76→80 comparisons. Do not silently
move a number from one source to another.

Use one metaphor throughout: the literature is a scoreboard with separate
lanes labelled **format × field**. A score can beat the record in its lane
without beating every matrix-multiplication record. **Where the metaphor
breaks:** the score counts scalar multiplications, not elapsed time, additions,
memory use, or energy; and a leading score is an upper bound, not a proof of
optimality.

**Terms kept precise.** A *field* is the arithmetic rulebook for coefficients;
`Z₂` has just 0 and 1, with 1+1=0. A *matrix-multiplication tensor* is a fixed
three-dimensional bookkeeping object for one matrix format. A *rank-R tensor
decomposition* is a list of R simple pieces whose sum reconstructs that object,
and therefore encodes a bilinear algorithm using R scalar multiplications.

**Declared black boxes.** The reinforcement-learning search and its
single-player `TensorGame` may be taken on trust. The reader's audit starts
after search: check the finite tensor identity, then check that format, field,
count, baseline, and source attribution all stay attached.

## problem

**Statement.** How few scalar multiplications are needed to multiply two matrices? The school algorithm multiplies two n×n matrices with n³ scalar products; Strassen (1969) broke this for 2×2 with 7 instead of 8. For many larger formats the exact minimum remains unknown; even 3×3 is open. Concretely: what is the smallest R such that the matrix-multiplication tensor T_{n} decomposes as a sum of R rank-one triples u⊗v⊗w (this R, the tensor rank, equals the number of scalar multiplications in a bilinear algorithm)? AlphaTensor (DeepMind) reframed this as a single-player game and searched the decomposition space with a reinforcement-learning agent.

**Answer (the verified deliverables).** Two figures are confirmed directly in the Nature paper: AlphaTensor multiplies 4×4 matrices over Z₂ (the field with two elements) using **47** multiplications, beating Strassen's two-level recursion which needs 7²=**49**; and it finds a rank-**76** decomposition of the T₄,₅,₅ product, improving the previous best of **80**. Kauers and Moosbauer's separate paper (arXiv:2210.04045) describes the Nature article as announcing **96** multiplications for 5×5 over Z₂ and presents its own **95**-multiplication scheme. That paper was submitted on 8 October 2022, three days after the Nature article's publication date. The 96→95 comparison is therefore attributed positively to Kauers–Moosbauer's own statement; no claim about what another rendering of the Nature article omits is needed. Mechanically correct ≠ optimal.

**Accessibility note.** Prerequisites are ordinary matrix multiplication and
the idea that a finite list can be checked without knowing how it was found.
The precise check is that the R *rank-one triples*—the simple tensor pieces
named in the scope card—sum to the matrix-multiplication tensor. This is a
finite identity that direct computation can verify without trusting the
reinforcement-learning search. Over `Z₂`, even the coefficient arithmetic is
only arithmetic with 0 and 1. Finding a short list is the black box; checking a
published list and keeping its scoreboard lane intact are the accessible work.

## history

**How long open / who.** Bilinear complexity of matrix multiplication has been studied since Strassen's 1969 result that 2×2 needs only 7 multiplications. The Nature paper notes that even the optimal 3×3 algorithm is unknown. AlphaTensor's specific wins targeted formats where the best known decompositions had stood for years (the paper frames the 4×4 finite-field result as the first improvement on Strassen's two-level scheme in that setting "to the authors' knowledge" since its discovery ~50 years prior).

**Method named by the primary source.** The Nature authors turn tensor
decomposition into the single-player `TensorGame` and use reinforcement
learning to search for short decompositions. The exact rank of 3×3 matrix
multiplication remains open, illustrating why a new upper bound is not an
optimality proof.

Dead end 1 — *Trusting the headline as optimal.* The natural read of "DeepMind beat a 50-year record" is that the new counts are best-possible. This is a dead end because tensor rank is not certified by any of these methods; a lower count can appear at any moment, as it did within a week (96→95 for 5×5 mod 2). Mechanically correct ≠ optimal.

Dead end 2 — *Assuming you need to rerun AlphaTensor to improve its answer.* One might think only another reinforcement-learning run could lower the count. Dead end: Kauers and Moosbauer start from the published 96-multiplication scheme and describe a sequence of transformations that eliminates one multiplication. This establishes a distinct computer-aided route to 95; the source does not support a claim here about which ingredient “really mattered” or how many seconds it took.

Dead end 3 — *Conflating "over Z₂" with "over the reals/standard arithmetic."* Many of AlphaTensor's sharpest improvements (e.g., 4×4 in 47) hold only in characteristic 2, where you can add without sign bookkeeping. This is a dead end for anyone quoting the numbers as general-field results — the field is load-bearing and the counts differ by setting.

Dead end 4 — *Reading one Kauers-Moosbauer paper as covering everything.* Their October 2022 note (the "FBHHRBNRSSSHK" paper) improved only the 5×5 mod-2 case to 95. The broader improvements across formats and arbitrary fields came in a *separate, later* Flip Graphs paper (December 2022). Treating the two as one source is a dead end that produces miscited numbers.

## solution_provenance

**Primary source.** Fawzi, A., Balog, M., Huang, A., et al. "Discovering faster matrix multiplication algorithms with reinforcement learning." *Nature* 610, 47–53 (2022). DOI 10.1038/s41586-022-05172-4. Open-access full text mirrored at PMC9534758 (pmc.ncbi.nlm.nih.gov/articles/PMC9534758/).

**Improvement source.** Kauers, M. & Moosbauer, J. "The FBHHRBNRSSSHK-Algorithm for Multiplication in Z₂^{5×5} is still not the end of the story." arXiv:2210.04045 (submitted 8 Oct 2022). A broader follow-up — Kauers & Moosbauer, "Flip Graphs for Matrix Multiplication," arXiv:2212.01175 (submitted 2 Dec 2022) — extends improvements to formats (4,4,5) and (5,5,5) in characteristic two and arbitrary ground fields.

**How verified.** I read first-party: the Nature paper's open-access full text,
Kauers–Moosbauer's 95-result paper, and their distinct flip-graphs paper. The
decomposition claims are independently verifiable by the reader—the Nature
paper states correctness follows from the selected factors satisfying
T_n = Σ u⊗v⊗w, so any quoted algorithm can be re-verified by checking that
finite tensor identity over the stated field.

**First-party check — what I read directly vs could not confirm.**
- Read directly from Nature/PMC: "AlphaTensor finds an algorithm for multiplying 4×4 matrices using 47 multiplications in Z2 … Strassen's two-level algorithm, which involves 7²=49 multiplications"; "rank-76 decomposition of T_{4,5,5}, improving over the previous state-of-the-art complexity of 80"; the tensor-decomposition correctness statement. Confirmed: Nature vol. 610, pp. 47–53, October 2022.
- Read directly from arXiv:2210.04045 abstract: the prior announced 5×5-over-Z₂ result was **96** multiplications; Kauers & Moosbauer achieve **95**; submitted 8 Oct 2022; authors Kauers and Moosbauer.
- Read directly from arXiv:2210.04045: Kauers–Moosbauer describe the Nature
  article as announcing **96** for 5×5 over Z₂ and present **95**. This is the
  positive source for both numbers in that comparison; the pack does not infer
  anything from absence in another HTML rendering.
- Could NOT confirm first-party: the specific "5×5 standard arithmetic = 97" count and a specific "independent 4×4" count attributed to Kauers-Moosbauer in the candidate brief — the Flip Graphs abstract I read does not state these numbers; it only says formats (4,4,5) and (5,5,5) were improved in char 2 and arbitrary fields. Omitted from the answer.

## step_graph

- **S0 — Search first: is the minimal rank already known for these formats?** `search_first` Before crediting any new record, check the primary paper's baseline and the standing literature for the exact format and field; record counts are field- and format-specific. Check: the Nature paper itself states the two baselines used here—49 recursive Strassen multiplications for 4×4 in Z₂ and 80 for 4×5·5×5.

- **S1 — Recast "fewer multiplications" as "lower tensor rank."** `representation_shift` The objective is not a vague "faster algorithm" but the rank R of the bilinear tensor T_n; number of scalar multiplications = R. This reframing is what makes both the search and the audit well-defined. Check: the paper equates a length-R play of the game with a rank-R decomposition T_n = Σ_{t=1}^{R} u⊗v⊗w.

- **S2 — Split each headline into independently checkable claims.** `milestone_rewrite` Decompose "AlphaTensor beat the record" into separable assertions: (a) the format, (b) the field/characteristic, (c) the claimed count R, (d) the baseline it beats, (e) optimality (claimed or not). Each is audited separately. Check: the 4×4 claim cleanly separates into 4×4 / over Z₂ / R=47 / vs 49 / no optimality claimed.

- **S3 — Verify correctness by reconstructing the tensor, not by trusting the search.** `lemma_decomposition` Correctness of a quoted algorithm reduces to one finite identity: do the R rank-one triples sum to T_n over the stated field? This is checkable by hand or a few lines of code, fully decoupled from the RL pipeline. Check: the Nature paper states correctness follows exactly from T_n=Σ u⊗v⊗w when the game reaches the zero tensor.

- **S4 — Probe the smallest/most-quotable case and watch the field.** `small_case_probe` The 4×4-over-Z₂ = 47 result is the crispest case: confirm it is *characteristic 2*, where addition needs no sign bookkeeping, and that 49 is specifically Strassen's two-*level* (7² recursive) count. Check: PMC text reads "47 multiplications in Z2 … Strassen's two-level algorithm, which involves 7²=49."

- **S5 — Write the abandonment condition for "this is optimal."** `kill_criteria` Before asserting any count is best-possible, demand a matching lower bound; none of these methods provide one, so the optimality claim must be abandoned by default. Kill condition: "if no certified lower bound accompanies R, do not call R minimal." Check: the 5×5-over-Z₂ count fell 96→95 within ~a week (Kauers-Moosbauer), validating that the kill criterion fires.

- **S6 — Ask whether a published construction can be transformed.** `shape_question` The shape “fixed candidate found by a large search, then improved by local algebraic changes” recurs across computer-assisted mathematics. Kauers–Moosbauer start from the published 5×5-over-Z₂ scheme and apply transformations that remove one multiplication. Check: keep this paper's 96→95 result distinct from their later flip-graphs method and do not invent a runtime or a causal claim about RL.

## breakthrough

**S1 (representation_shift) is the breakthrough.** The Nature authors express
the search for short matrix-multiplication algorithms as reducing a fixed
tensor to zero in a single-player `TensorGame`, then build a reinforcement-
learning system around that representation. This states the paper's technical
move without claiming that nobody had imagined a related framing or that one
ingredient alone caused the result.

## audit_targets

- **T1 — The 4×4=47-vs-49 claim is field-specific.** Auditing target: confirm the 47 holds *over Z₂*, not over the reals, and that 49 is Strassen two-level recursion. *Objection:* "the press said DeepMind beat Strassen for 4×4 — surely that means general matrices." *Resolution:* the Nature text explicitly scopes it to Z₂ ("47 multiplications in Z2"); over general fields the counts differ. The field is load-bearing; drop it and the claim is false.

- **T2 — "Record" does not mean "optimal."** Auditing target: check whether any source attaches a matching lower bound. *Objection:* "a 50-year record fell, that's the floor." *Resolution:* no method here certifies minimality, and 5×5-over-Z₂ went 96→95 within roughly a week, so the floor was demonstrably not reached. Mechanically correct ≠ optimal.

- **T3 — The follow-up has its own stated method.** Auditing target: identify what actually produced 95. *Objection:* “the 95 must be another AlphaTensor run.” *Resolution:* Kauers–Moosbauer start from the published 96-multiplication scheme and apply a sequence of transformations to eliminate one multiplication. Do not embellish that source-backed account with an unsupported runtime or a claim that one ingredient mattered more than another.

- **T4 — The two Kauers-Moosbauer papers are distinct.** Auditing target: separate the Oct 2022 5×5-mod-2 note (95) from the Dec 2022 Flip Graphs paper (broader formats/fields). *Objection:* "just cite the Kauers-Moosbauer improvement." *Resolution:* the 95 figure is first-party only in arXiv:2210.04045, which is mod-2 5×5 only; broader-format and arbitrary-field claims live in arXiv:2212.01175 and must not be back-attributed to the October note.

- **T5 — Verify the algorithm, not the narrative.** Auditing target: re-derive correctness from the tensor identity rather than trusting the search. *Objection:* "an RL black box found it, how can I check it?" *Resolution:* correctness is the finite identity T_n=Σ u⊗v⊗w over the stated field — independently checkable with no access to the model. This is the discipline the whole pack trains.
