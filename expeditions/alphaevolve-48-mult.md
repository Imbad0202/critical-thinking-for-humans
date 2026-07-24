# Expedition Pack: A 48-Multiplication 4x4 Matrix Product

`pack_id: alphaevolve-48-mult`

## scope_and_setting

**Scope card — read this before any record claim.**

- **Object:** multiply two 4×4 matrices.
- **Score being counted:** scalar multiplications, meaning multiplications of
  individual coefficients. Additions, memory traffic, and elapsed time are not
  part of this score.
- **Same comparison lane:** algorithms that remain valid when the quantities
  being multiplied need not commute (`ab` may differ from `ba`), so the recipe
  can be used recursively on matrix blocks. In this lane, two levels of
  Strassen use **49** multiplications; AlphaEvolve found **48** with complex
  coefficients.
- **Coefficient follow-up:** Dumas, Pernet and Sedoglavic later gave a separate
  **48**-multiplication recipe with rational coefficients, valid over any ring
  containing an inverse of 2.
- **Verdict:** 48 is a better **upper bound**—an existence result showing that
  48 suffice—not a proof that 48 is minimal, and not a claim of lower
  wall-clock time.

Use one metaphor throughout: this is a race scoreboard with a lane label.
“48 beats 49” is meaningful only when both scores come from the same lane of
algebraic rules. **Where the metaphor breaks:** a field or ring is not merely a
painted lane; changing whether coefficients commute changes which symbolic
rearrangements are legal. The source-backed comparison in this pack is only
the same-lane 49→48 comparison made by the AlphaEvolve paper; it does not claim
an absolute record across other algebraic settings.

**Terms kept precise.** A *commutative ring* is an arithmetic setting where
`ab = ba`; a *field* is a setting where every nonzero element has a
multiplicative inverse; and a *tensor decomposition* is the finite list of linear
combinations, products, and recombinations that encodes the multiplication
recipe. An *upper bound of 48* says “here is a valid 48-step recipe,” not “no
47-step recipe exists.”

**Declared black boxes.** The reader may take the search that found the 48
terms and the coordinate change used in the rational follow-up on trust. The
auditable artifact is the fixed finite recipe and the exact setting in which
each comparison is claimed.

## problem

**Statement.** Can two 4×4 matrices be multiplied using fewer than 49 scalar multiplications in a setting that recurses to larger matrices — i.e., without assuming the matrix entries commute? Strassen's algorithm, applied with two levels of recursion, multiplies 4×4 matrices in 49 scalar multiplications and, crucially, works over any (possibly non-commutative) ring, so it can be applied block-recursively to large matrices. The standing question was whether 49 could be beaten *in that same non-commutative / tensor-decomposition setting*.

**Answer.** Yes. DeepMind's AlphaEvolve found a procedure multiplying two 4×4 **complex-valued** matrices in **48** scalar multiplications. The white paper (arXiv:2506.13131) states it as: a procedure to "multiply two 4×4 complex-valued matrices using 48 scalar multiplications; offering the first improvement, after 56 years, over Strassen's algorithm in this setting." A 2025 follow-up by Dumas, Pernet and Sedoglavic (arXiv:2506.13242) then produced a 48-multiplication scheme over the **rationals** (needing only an inverse of 2), removing the complex-coefficient requirement.

**Accessibility note.** Prerequisites are ordinary arithmetic, knowing what a
matrix product does, and distinguishing “this recipe works” from “this is the
best possible recipe.” A *bilinear matrix-multiplication scheme* is the precise
name for a finite recipe that multiplies linear combinations of the entries
and recombines the results into the 16 output entries. Its correctness is one
finite tensor identity. The official AlphaEvolve results repository publishes
the rank-48 factors and code that reconstructs the 4×4 multiplication tensor
and tests exact array equality. Finding the 48 terms is the black box:
AlphaEvolve's source describes an automated search inside its evolutionary
coding pipeline. The expedition asks the reader to audit the setting, rerun
the finite artifact check, and bound the record claim—not to reproduce that
search.

## history

**How long open / who.** Strassen (1969) gave the 2×2-in-7 scheme; recursing twice yields 4×4-in-49 over any ring. The AlphaEvolve white paper (Novikov et al., arXiv:2506.13131, submitted 2025-06-16) describes its complex-coefficient 48-term scheme as the first improvement after 56 years **in this setting**. That quoted qualifier is load-bearing: the pack does not extend the paper's comparison to other settings.

**Dead end 1 — reading "48 beats Strassen" as a flat record.** This is a dead end because the cited source says “in this setting.” The supported comparison is 48 against the same-lane 49 from two recursive levels of Strassen. Without a separately verified survey of every algebraic setting, “best 4×4 algorithm” is broader than the evidence.

**Dead end 2 — assuming the AlphaEvolve scheme is itself over the rationals.** Dead end: the white paper's 48-scheme is over the **complex numbers**. Treating it as rational conflates it with the *separate* later result (Dumas–Pernet–Sedoglavic, arXiv:2506.13242) that re-derived a rational 48-scheme via an isotropy transformation. The auditor must keep the two papers distinct.

**Dead end 3 — collapsing "fewer multiplications" into "faster in practice."** Dead end: the scoreboard counts scalar multiplications, not additions, memory traffic, implementation overhead, or elapsed time. Neither a runtime win nor a runtime loss follows from 48<49 alone.

**Dead end 4 — believing the parent problem (optimal rank of 4×4 multiplication) is now closed.** Dead end: 48 is an *upper bound* in one setting, not a proven optimum. The rank of the 4×4 matrix-multiplication tensor is not settled by this result.

## solution_provenance

**Primary publications and artifact.** (1) AlphaEvolve white paper — Novikov, Vũ, Eisenberger, Dupont, Huang, Wagner, Shirobokov, Kozlovskii, Ruiz, Mehrabian, Kumar, See, Chaudhuri, Holland, Davies, Nowozin, Kohli, Balog, "AlphaEvolve: A coding agent for scientific and algorithmic discovery," arXiv:2506.13131, submitted 2025-06-16. (2) Dumas, Pernet, Sedoglavic, "A non-commutative algorithm for multiplying 4x4 matrices using 48 non-complex multiplications," arXiv:2506.13242v6, last revised 2025-11-26. (3) Google DeepMind's `alphaevolve_results` repository, whose `mathematical_results.ipynb` publishes the tensor factors and verification code.

**How verified.** The AlphaEvolve abstract was read directly for the 4×4, complex-valued, 48-scalar-multiplication claim and its exact “first improvement, after 56 years … in this setting” boundary. The v6 Dumas–Pernet–Sedoglavic abstract was read directly for the separate rational-coefficient 48 scheme and its validity over rings containing an inverse of 2. In the official results notebook, the `<4,4,4>` rank-48 factor data feed `verify_tensor_decomposition`, which constructs the matrix-multiplication tensor and requires `np.array_equal` with the tensor reconstructed from those factors. That is the artifact-correctness check; no third-party floating-point approximation is used as proof.

**First-party check.** Read directly: both arXiv records and the official Google DeepMind repository and notebook. The repository explicitly says it contains the mathematical discoveries and code for verifying their correctness, but not the code to run AlphaEvolve. Therefore the fixed result is publicly checkable while the discovery run is not reproducible from that artifact. Historical counts from sources not read first-party are deliberately absent from this pack's landing claim.

## step_graph

- **S0 — Pin the exact claim before auditing it** `search_first`: Locate and read the primary source (arXiv:2506.13131) rather than press coverage; extract the literal claim ("48", "complex-valued", "in this setting"). Check: the quoted abstract sentence matches the paper, not a blog paraphrase.
- **S1 — Separate the artifact from the search** `shape_question`: Reframe "did AI beat humans" into two distinct questions — (a) is the 48-multiplication *scheme* correct? (b) is the *superiority claim* attached to it accurate? Check: the two questions have different evidence types (finite identity vs. literature comparison).
- **S2 — Decompose the superiority claim into its qualifiers** `lemma_decomposition`: Split "beats Strassen's 49" into object (4×4 multiplication), score (scalar multiplications), setting (complex-coefficient tensor scheme that supports the same recursive comparison), count (48), and scope (“in this setting”). Check: removing any qualifier makes a broader claim than the primary source.
- **S3 — Probe the two-level baseline** `small_case_probe`: Reconstruct the baseline: Strassen uses seven multiplications for 2×2, so two recursive levels use 7²=49 for 4×4. Check: 48<49 only after confirming both counts occupy the same lane.
- **S4 — Apply a falsification test to the headline** `kill_criteria`: Reject any headline that silently changes the object, arithmetic setting, score, or baseline. Check: “48 is the globally best 4×4 algorithm” fails because the cited sources establish only the lane-bounded comparison, whereas “48 beats recursive Strassen's 49 in this setting” matches the source.
- **S5 — Verify the artifact as a fixed identity** `representation_shift`: Move from “AI search output” to “published rank-48 factors.” Run the official notebook's verifier: construct the `<4,4,4>` multiplication tensor, reconstruct a tensor from the 48 factor columns, and require exact array equality. Check: artifact correctness no longer depends on the search narrative.
- **S6 — Rewrite the takeaway as a bounded milestone** `milestone_rewrite`: Restate the result as “a complex-coefficient upper bound of 48 in the cited setting, followed by a separate rational 48 construction over rings with an inverse of 2.” Check: the sentence claims neither optimality, wall-clock speed, nor reproducibility of the discovery process.

## breakthrough

The breakthrough is **S1 → S5**: separate discovery from verification, then
turn the AI-produced answer into a finite identity anyone can rerun. The white
paper calls the 48-term complex scheme the first improvement after 56 years in
that setting; it does not establish a causal history of why earlier searches
stopped. The auditor's work is therefore narrower and stronger: verify the
published identity and preserve every qualifier in the 48-versus-49 claim.

## audit_targets

- **T1 — "AlphaEvolve set an unqualified world record for 4×4 matrix multiplication."** *Objection:* The primary source says “in this setting,” so an unqualified cross-setting claim outruns the evidence. *Resolution:* Keep the complete lane label: two 4×4 matrices, 48 scalar multiplications, complex coefficients, compared with the same-lane recursive Strassen baseline of 49.

- **T2 — "AlphaEvolve's 48-multiplication scheme is a rational algorithm."** *Objection:* The white paper's scheme (arXiv:2506.13131) is over the **complex numbers**; the rational 48-scheme is a *separate* later paper (arXiv:2506.13242, Dumas–Pernet–Sedoglavic) derived via an isotropy transformation. *Resolution:* Keep the two results distinct; conflating them mis-attributes the rationalization to the original AI result.

- **T3 — "This proved that 48 is the minimum."** *Objection:* A rank-48 decomposition proves only that 48 multiplications suffice; it supplies no matching lower bound. *Resolution:* Call it a new upper bound in the cited setting, not closure of the optimal-rank problem.

- **T4 — "Fewer multiplications means it runs faster than Strassen."** *Objection:* The count omits additions, memory traffic, implementation overhead, and elapsed time. *Resolution:* Distinguish bilinear complexity (multiplication count) from practical runtime; no runtime comparison is established here.

- **T5 — "The result is unverified AI output you must take on faith."** *Objection:* The official repository publishes the rank-48 factors and an exact tensor-reconstruction check. *Resolution:* Rerun that fixed-artifact check. Its success verifies the identity, while saying nothing about whether the unpublished search run is reproducible or whether 48 is optimal.
