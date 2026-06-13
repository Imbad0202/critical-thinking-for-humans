# Expedition Pack: A 48-Multiplication 4x4 Matrix Product (a Contested Record)

`pack_id: alphaevolve-48-mult`

A CONTESTED record, which is exactly why it trains auditing. AlphaEvolve found
a 48-multiplication 4x4 matrix product — but only over the complex numbers,
and Waksman (1970) already did 4x4 in 46 over commutative rings. The auditor's
whole job is to pin down what was actually beaten, in what algebraic setting,
and what prior work the 'beats Strassen' framing omits.

## problem

**Statement.** Can two 4×4 matrices be multiplied using fewer than 49 scalar multiplications in a setting that recurses to larger matrices — i.e., without assuming the matrix entries commute? Strassen's algorithm, applied with two levels of recursion, multiplies 4×4 matrices in 49 scalar multiplications and, crucially, works over any (possibly non-commutative) ring, so it can be applied block-recursively to large matrices. The standing question was whether 49 could be beaten *in that same non-commutative / tensor-decomposition setting*.

**Answer.** Yes. DeepMind's AlphaEvolve found a procedure multiplying two 4×4 **complex-valued** matrices in **48** scalar multiplications. The white paper (arXiv:2506.13131) states it as: a procedure to "multiply two 4×4 complex-valued matrices using 48 scalar multiplications; offering the first improvement, after 56 years, over Strassen's algorithm in this setting." A 2025 follow-up by Dumas, Pernet and Sedoglavic (arXiv:2506.13242) then produced a 48-multiplication scheme over the **rationals** (needing only an inverse of 2), removing the complex-coefficient requirement.

**Accessibility note.** The *object* is checkable by anyone: a bilinear matrix-multiplication scheme is a finite list of products of linear combinations of entries, recombined into the 16 output entries; correctness is a finite identity verifiable symbolically or numerically (the public PoC checks it to ~1e-16 in floating point). What is NOT human-producible is the *search*: finding a length-48 decomposition of the 4×4×4 matrix-multiplication tensor over the complex numbers is a vast non-convex discrete-continuous search that the human community did not crack for 56 years. The auditor's job here is not to reproduce the scheme but to dissect the *superiority claim* layered on top of it.

## history

**How long open / who.** Strassen (1969) gave the 2×2-in-7 scheme; recursing twice yields 4×4-in-49 over any ring. Improving on 49 *for the recursive / non-commutative tensor setting* stayed open for 56 years until AlphaEvolve (Novikov et al., arXiv:2506.13131, submitted 2025-06-16). The community framing of "56 years open" is exactly what makes this a borderline pack: a *commutative*-ring count of 48 (and even 46) was already known decades earlier.

**Dead end 1 — reading "48 beats Strassen" as a flat new record.** This is a dead end because the headline omits the algebraic setting. Over commutative rings allowing division by 2, Waksman (1970) already multiplies 4×4 in **46** multiplications — fewer than 48. So "48 is a record" is false without the qualifier "in the non-commutative / complex-tensor setting."

**Dead end 2 — assuming the AlphaEvolve scheme is itself over the rationals.** Dead end: the white paper's 48-scheme is over the **complex numbers**. Treating it as rational conflates it with the *separate* later result (Dumas–Pernet–Sedoglavic, arXiv:2506.13242) that re-derived a rational 48-scheme via an isotropy transformation. The auditor must keep the two papers distinct.

**Dead end 3 — collapsing "fewer multiplications" into "faster in practice."** Dead end: the public verification PoC notes its 48-mult implementation is *slower* than Strassen's; the win is asymptotic/recursive multiplication-count, not wall-clock on a single 4×4 product. Practical speedup is not what was established.

**Dead end 4 — believing the parent problem (optimal rank of 4×4 multiplication) is now closed.** Dead end: 48 is an *upper bound* in one setting, not a proven optimum. The rank of the 4×4 matrix-multiplication tensor is not settled by this result.

## solution_provenance

**Primary publications.** (1) AlphaEvolve white paper — Novikov, Vũ, Eisenberger, Dupont, Huang, Wagner, Shirobokov, Kozlovskii, Ruiz, Mehrabian, Kumar, See, Chaudhuri, Holland, Davies, Nowozin, Kohli, Balog, "AlphaEvolve: A coding agent for scientific and algorithmic discovery," arXiv:2506.13131, submitted 2025-06-16. (2) Dumas, Pernet, Sedoglavic, "A non-commutative algorithm for multiplying 4x4 matrices using 48 non-complex multiplications," arXiv:2506.13242, v1 2025-06-16 (rational 48-scheme). Historical comparison: Waksman (1970), 46 multiplications over commutative rings with division by 2.

**How verified.** First-party verification: I fetched and read the arXiv:2506.13131 abstract directly and quoted its exact 48 / "complex-valued" / "first improvement, after 56 years … in this setting" wording. I read the arXiv:2506.13242 abstract directly, confirming its title, its 48 *non-complex/rational* count (inverse of 2 only), and its own statement that the prior 48 was "over complex numbers" and the 47-count was characteristic 2. I read the MaplePrimes analysis directly for the Waksman-1970 46-multiplication / commutative-ring distinction. The PhialsBasement GitHub repo describes a numerical PoC verifying correctness to ~1e-16 for real and complex inputs.

**First-party check.** Read directly and quoted: the two arXiv abstracts (2506.13131, 2506.13242) and the MaplePrimes post. Read directly: the GitHub verification repo description. Could NOT confirm first-party (page bodies did not render via fetch): the exact wording of Robin Houston's and Fredrik Johansson's Mathstodon posts, and a primary source pinning Winograd's commutative 48-count — these reached me only via search-engine synthesis, so I treat them as secondary. The Waksman-46 figure is confirmed via the MaplePrimes post but I did not read Waksman's 1970 paper itself.

## step_graph

- **S0 — Pin the exact claim before auditing it** `search_first`: Locate and read the primary source (arXiv:2506.13131) rather than press coverage; extract the literal claim ("48", "complex-valued", "in this setting"). Check: the quoted abstract sentence matches the paper, not a blog paraphrase.
- **S1 — Separate the artifact from the search** `shape_question`: Reframe "did AI beat humans" into two distinct questions — (a) is the 48-multiplication *scheme* correct? (b) is the *superiority claim* attached to it accurate? Check: the two questions have different evidence types (finite identity vs. literature comparison).
- **S2 — Decompose the superiority claim into its qualifiers** `lemma_decomposition`: Split "beats Strassen's 49" into setting (non-commutative / complex tensor), count (48), and scope (first in *this* setting in 56 years). Check: each qualifier is independently true/false and the headline is only true with all three.
- **S3 — Probe the small prior-art case** `small_case_probe`: Ask "what is the *commutative* 4×4 record?" → Waksman 1970 gives 46 < 48. Check: a known commutative scheme with fewer multiplications exists, so the claim cannot be "absolute record."
- **S4 — Apply a falsification test to the headline** `kill_criteria`: The claim "first improvement over 49 after 56 years" is killed iff a pre-2025 scheme beats 49 in the *same* setting; it survives because Waksman/Winograd are *commutative*, not the recursive non-commutative tensor setting. Check: the kill test forces naming the exact setting, exposing the omission without overturning the genuine result.
- **S5 — Verify the artifact is directly checkable** `representation_shift`: Move from "AI search output" to "a fixed bilinear scheme = finite polynomial identity," which is verifiable symbolically/numerically independent of how it was found. Check: the public PoC confirms correctness to ~1e-16, so artifact-correctness is not in dispute.
- **S6 — Rewrite the takeaway as a bounded milestone** `milestone_rewrite`: Restate the result as "an upper bound of 48 in the complex/non-commutative setting (later rationalized), NOT a closure of the optimal-rank problem and NOT a flat record below the commutative 46." Check: the rewritten statement survives contact with Waksman-46 and with the open tensor-rank question.

## breakthrough

The breakthrough is **S2 → S3 → S4** (decompose the claim, probe the commutative prior art, then run the kill test). The genuine *mathematical* breakthrough is AlphaEvolve's search finding a length-48 complex decomposition of the 4×4 tensor — which eluded the community for 56 years because the search space is enormous and non-convex and prior human and computer searches in the non-commutative setting bottomed out at 49. But the *auditor's* breakthrough is S3/S4: realizing that "48 beats 49" is only a record once you fix the algebraic setting, because Waksman's 1970 commutative scheme already does 4×4 in 46 — a fact the one-line headline omits.

## audit_targets

- **T1 — "AlphaEvolve set a new world record for 4×4 matrix multiplication."** *Objection:* Over commutative rings, Waksman (1970) multiplies 4×4 in 46 multiplications — fewer than 48 — so 48 is not the lowest known count. *Resolution:* The claim is true only with the qualifier "in the non-commutative / complex-tensor (recursion-compatible) setting"; strip the qualifier and it is false. The auditor must demand the setting before accepting "record."

- **T2 — "AlphaEvolve's 48-multiplication scheme is a rational algorithm."** *Objection:* The white paper's scheme (arXiv:2506.13131) is over the **complex numbers**; the rational 48-scheme is a *separate* later paper (arXiv:2506.13242, Dumas–Pernet–Sedoglavic) derived via an isotropy transformation. *Resolution:* Keep the two results distinct; conflating them mis-attributes the rationalization to the original AI result.

- **T3 — "This closed a 56-year-open problem about 4×4 matrix multiplication."** *Objection:* What was open was beating 49 *in the non-commutative setting*; the optimal *rank* of the 4×4 tensor remains unknown, and commutative counts below 49 long predate it. *Resolution:* Reframe as "first sub-49 in this specific setting," an upper-bound milestone, not closure of the optimal-complexity problem.

- **T4 — "Fewer multiplications means it runs faster than Strassen."** *Objection:* The public verification PoC reports its 48-mult implementation is *slower* than Strassen in practice; the win is asymptotic multiplication-count under recursion, not single-product wall-clock. *Resolution:* Distinguish bilinear complexity (multiplication count) from practical runtime; the result is about the former.

- **T5 — "The result is unverified AI output you must take on faith."** *Objection:* This understates verifiability — a bilinear scheme is a finite identity, checkable symbolically or numerically by anyone. *Resolution:* The artifact's correctness is independently confirmed (PoC to ~1e-16); the contestable part is the *framing*, not the *correctness*. Audit the headline, trust the checkable identity.

