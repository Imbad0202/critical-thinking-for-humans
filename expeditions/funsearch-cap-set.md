# Expedition Pack: FunSearch and the Cap-Set Lower Bound (Forecaster)

`pack_id: funsearch-cap-set`

A forecaster pack on a BORDERLINE result. An LLM-guided program search found a
larger cap set (512 points in dim 8) and a better asymptotic lower bound — but
the cap-set problem itself is wide open, and a human (Ellenberg) supplied a
key step the headlines credited to the AI. You forecast what the construction
does and does not settle, and audit who actually did what.

## problem

**Statement.** A *cap set* in (Z/3Z)^n is a set of points with no three on a line — equivalently, no three distinct vectors summing to 0 mod 3. The cap-set problem asks for the maximum size c_n of such a set, and for its asymptotic growth rate (capacity) γ = lim c_n^{1/n}. FunSearch (DeepMind, Nature 2023) is an LLM-guided evolutionary search over *programs*: a frozen LLM mutates a Python `priority` function feeding a fixed greedy `solve` skeleton, scored by an `evaluate` function. It produced a **512-element cap set in dimension 8**, beating the previous best of 496 and establishing the lower bound c_8 ≥ 512. FunSearch's admissible-set construction also raised the lower bound on γ from 2.2180 to 2.2184; a subsequent human (Ellenberg) feedback loop pushed it to 2.2202.

**Everyday anchors.** A point in (Z/3Z)^n is an n-slot list filled with 0, 1,
or 2, with addition wrapping around after 2. *Capacity* is the precise term for
how the largest possible size grows as the number of slots increases.

**Answer (what was actually settled).** Two specific, directly-checkable *constructions*: an explicit 512-point cap set in dim 8, and an admissible set yielding γ ≥ 2.2184. Both are **lower bounds on an OPEN problem**. The exact value c_8 is NOT determined (the upper bound is far larger), c_n is known exactly only for n ≤ 6, and the capacity γ remains open: the best upper bound γ ≤ 2.756 (Ellenberg–Gijswijt 2017) is untouched. FunSearch did NOT solve the cap-set problem.

**Accessibility note.** A 14-year-old can check the answer: print the 512 vectors, test every triple for "sums to 0 mod 3". The collinearity test is one line. What is inaccessible to a human is *generating* the construction — searching a space of 3^8 = 6561 candidate vectors via millions of LLM-mutated priority heuristics. The auditor's job here is not to re-derive but to forecast: is this bound tight, does the construction generalize, what does a better lower bound settle versus leave open?

**Plain-language reading map.** Use one central metaphor: each lower bound is a
certified floor, while an upper bound is a ceiling; raising the floor records
progress but does not locate the ceiling. The metaphor breaks if it makes c_8
and γ sound like two measurements of one room: c_8 is one finite-dimensional
maximum, γ is an asymptotic capacity, and the two claims here come from
different constructions. Treat the LLM-guided program-generation search and
the admissible-set derivation as declared black boxes. The reader's auditable
work is to check the explicit witness, keep the two bounds separate, and trace
each attribution to its source.

## history

The cap-set problem dates to the 1970s (Brown–Buhler, Frankl–Graham–Rödl roots) and was popularized via the SET card game; Terence Tao called it (in his 2009 blog) his "favorite" open problem. The asymptotic upper bound γ < 3 was an open question until the 2016 polynomial-method breakthrough (Croot–Lev–Pach, then Ellenberg–Gijswijt, *Annals of Mathematics* 2017) gave γ ≤ 2.756. Lower bounds advance by explicit constructions; before FunSearch the dim-8 record was a 496-cap built by combining lower-dimensional caps, and the best capacity lower bound was 2.2180. FunSearch (published Nature, Dec 14 2023) improved both. The exact maximum c_n is still known only for n ≤ 6 — so the problem remains wide open in 2024+.

Dead end 1 — "FunSearch solved the cap-set problem." This is the headline framing (Nature news: "outdoes human mathematicians on unsolved problem"). It is a **dead end** because FunSearch only moved a *lower bound* via a construction; the maximum c_8 and the capacity γ are undetermined, and the upper-bound gap (2.756 vs 2.22) is enormous. Improving a lower bound on an open problem is not solving it.

Dead end 2 — "The 2.2202 capacity bound is FunSearch's discovery." **Dead end**: per Davis's first-party account, FunSearch's own output gave only 2.2184; the jump to 2.2202 came because Ellenberg *read the human-readable program*, spotted an unrecognized symmetry, and re-ran the search with it. Crediting 2.2202 to the AI mis-assigns provenance — Davis judges "99.99% of the credit" belongs to Ellenberg.

Dead end 3 — "The LLM understood the cap-set problem." **Dead end**: the LLM is never told what problem it works on; it only sees two `priority` functions and is asked for a third. The math-steering lives entirely in the genetic-algorithm wrapper, invisible to the model. Davis's central charge is the "shallowness" of any implied mathematical understanding.

Dead end 4 — "This generalizes to a broad new method for hard math." **Dead end** (per the authors themselves and Davis): FunSearch needs an efficient evaluator, a rich scoring signal, and a small mutable skeleton — it works only on a narrow class of construction problems. A direct RL-over-constructions approach "didn't scale," per corresponding author Fawzi.

## solution_provenance

**Publication.** B. Romera-Paredes, M. Barekatain, A. Novikov, M. Balog, M. P. Kumar, E. Dupont, F. J. R. Ruiz, J. S. Ellenberg, P. Wang, O. Fawzi, P. Kohli, A. Fawzi, "Mathematical discoveries from program search with large language models," *Nature* (2023). DOI 10.1038/s41586-023-06924-6. Received 12 Aug 2023, accepted 30 Nov 2023, published 14 Dec 2023.

**How verified.** I read the open-access full text first-party via PubMed Central (PMC10794145) and separately read all 13 pages of Ernest Davis's critical comment (NYU, "Comment on (Romera-Paredes et al., 2023)…", 11 Jan 2024) PDF, which independently re-derives and scrutinizes the numbers. Cross-verification of every load-bearing figure:
- c_8 ≥ 512, previous best 496 — verif in PMC ("a larger cap set than what was previously known") AND verbatim in Davis §2.1.1 ("FunSearch found a cap set of size 512 for n = 8. The previous best known cap set had size 496… established a lower bound c_8 ≥ 512").
- Capacity: FunSearch admissible set raised γ lower bound 2.2180 → 2.2184; Ellenberg's symmetry observation then → 2.2202 — verif in Davis §2.1.1 (explicit three-step account). PMC reports the 2.2202 figure and the abstract's "largest improvement in 20 years."
- Upper bound γ ≤ 2.756 (Ellenberg–Gijswijt 2017) still standing; c_n known exactly only for n ≤ 6 — verif in Davis §2.1.
- Method = frozen LLM (Codey/PaLM2) + island evolutionary search over priority programs + evaluator — verif in both sources.
- Verification of a construction = directly checkable: greedy `solve` adds v only "if v is not collinear with any two vectors in C" — verif in Davis §3 pseudocode and PMC's "efficient evaluate function."

**First-party check.** Read directly: Nature paper full text (PMC mirror) and the complete Davis comment. Could NOT confirm first-party: the exact 512 vectors / running the collinearity check myself (did not open or execute the GitHub `cap_set.ipynb`; WebFetch returned only repo chrome, and I did not download the raw notebook). The previous-best "496" I have only via the paper's framing and Davis restating it — I did not independently consult OEIS A090245 or the prior-construction source. I did not read the supplementary material (ablations, admissible-set details) first-party.

## step_graph

- **S0 — Separate the construction from the problem** `shape_question` Ask what *kind* of object the claim is: an explicit lower-bound construction, not a determination of the maximum or the capacity. A construction is an existence witness; an open problem asks for an extremum. Conflating them is the pack's core trap. *Check:* state the exact claim as an inequality (c_8 ≥ 512, γ ≥ 2.2184) and confirm no matching upper bound is asserted.
- **S1 — Verify the witness directly** `kill_criteria` The construction is trivially checkable: enumerate every unordered triple of the 512 vectors, test sum ≡ 0 mod 3; any hit kills the claim. *Check:* the test is O(N^3) on 512 points — feasible by hand-spec, mechanical by code; failure criterion is a single collinear triple.
- **S2 — Probe small known cases to calibrate** `small_case_probe` c_n is known exactly only for n ≤ 6; n = 7 and n = 8 maxima are unknown. So 512 sits in the *unknown* regime — it is a record, not a proven maximum. *Check:* confirm against the known-value boundary (n ≤ 6) that dim 8 has no proven c_8, so "512" cannot be the answer to "what is c_8".
- **S3 — Decompose the capacity claim from the finite claim** `lemma_decomposition` "Larger dim-8 cap" and "better asymptotic γ bound" are independent results from different constructions (a single 512-cap vs. an admissible set). Audit them separately; neither implies the other. *Check:* trace each number to its own construction; do not let the dim-8 record vouch for the γ bound or vice versa.
- **S4 — Re-attribute the 2.2202 figure** `kill_criteria` Forecaster's provenance test: which number is the *machine's* output and which is the *human's*? FunSearch alone gave 2.2184; 2.2202 required Ellenberg reading the code and injecting a symmetry. *Check:* if a summary credits 2.2202 to "the AI," that is a provenance error — kill the inflated attribution, keep 2.2184 as FunSearch's standalone result.
- **S5 — Reframe "what is settled" as a milestone, not a finish line** `milestone_rewrite` Rewrite the headline "AI solves cap-set problem" into the defensible milestone: "AI-guided search produced new explicit lower-bound constructions for an open problem." *Check:* the rewrite must survive the upper-bound gap (2.22 vs 2.756 still open) and the n ≤ 6 exact-value boundary.
- **S6 — Shift representation to forecast generalization** `representation_shift` View FunSearch not as a math oracle but as a heuristic search over human-readable programs with a fixed skeleton. In that frame, "does it generalize?" becomes "does the target problem have an efficient evaluator + rich score + small mutable part?" — the authors' own stated preconditions. *Check:* apply the three preconditions to a candidate problem; absent any one, predict no transfer (consistent with the failed direct-RL attempt).
- **S7 — Search for omitted prior work and contestation** `search_first` Before endorsing novelty, find the existing record (496-cap, 2.2180 bound, Ellenberg–Gijswijt upper bound) and independent critique (Davis). *Check:* a credible audit cites at least one source that scrutinizes rather than promotes the result; here, Davis's comment supplies the adversarial reading first-party.

## breakthrough

The breakthrough step is **S4** — re-attributing the 2.2202 capacity figure. It eluded easy reading because the headline number (the "largest improvement in 20 years," 2.2202) is the one most quoted, yet first-party reading shows FunSearch's *own* output stopped at 2.2184; the extra gain came from a human mathematician reading the machine's human-readable code and supplying an unrecognized symmetry. The breakthrough is recognizing that the most impressive number is a hybrid human-AI result, not the AI's, and that this only happened *because* FunSearch emits inspectable programs rather than an opaque model — a provenance subtlety the promotional framing collapses.

## audit_targets

- **T1 — "FunSearch solved / cracked the cap-set problem."** *Objection:* The Nature news framing ("outdoes human mathematicians on unsolved problem") implies closure. *Resolution:* It improved two *lower bounds* via explicit constructions; the maximum c_8 is undetermined, c_n is exact only for n ≤ 6, and the capacity upper bound γ ≤ 2.756 is untouched. Verified first-party in both the paper and Davis. The parent problem is OPEN — the pack must never imply otherwise.
- **T2 — "The 2.2202 capacity bound is FunSearch's discovery."** *Objection:* Mis-attributes a human-AI feedback result to the AI. *Resolution:* FunSearch's standalone admissible set gave γ ≥ 2.2184; the jump to 2.2202 came from Ellenberg spotting a symmetry in the human-readable program. Davis: "99.99% of the credit for this interaction belongs to Ellenberg." Provenance must be split.
- **T3 — Omitted/under-credited prior work and baseline.** *Objection:* The "new" record only means something against the prior state of the art. *Resolution:* The dim-8 baseline was 496 and the capacity baseline 2.2180; the binding upper bound is Ellenberg–Gijswijt 2017 (γ ≤ 2.756). I have these via the paper + Davis, but did NOT independently confirm 496 against OEIS A090245 or the original prior-construction source.
- **T4 — "The LLM understood the mathematics."** *Objection:* Suggests reasoning where there is search. *Resolution:* The model is never told the problem; it only mutates a `priority` subroutine. Davis's central charge is the "shallowness" of any implied understanding — the math-steering lives in the genetic wrapper, invisible to the LLM.
- **T5 — "This is a broad new method for hard math."** *Objection:* Over-generalizes from a narrow construction-search win. *Resolution:* Requires an efficient evaluator, rich score signal, and small mutable skeleton (authors' own preconditions); corresponding author Fawzi confirmed a direct RL-over-constructions approach "didn't scale." Forecast transfer only where all three preconditions hold.


---

## calibration_key

The scoring rubric for the forecasts in `audit_targets`. Read this to grade;
do not invent a grade. Bands are first-party from the FunSearch Nature paper
and Ernest Davis's analysis, with the two figures I did NOT independently
confirm flagged.

- **F1 (did FunSearch solve the cap-set problem?)** — *Calibrated:* "no — it
  improved two lower bounds via explicit constructions; the parent problem is
  open, c_n exact only for n ≤ 6, upper bound γ ≤ 2.756 untouched." *Over-
  confident:* "cracked / solved cap-set" — the Nature news framing taken literally.
  *Under-confident:* "the constructions don't count as progress" — denies a real
  lower-bound improvement.
- **F2 (is 2.2202 FunSearch's discovery?)** — *Calibrated:* "provenance splits —
  FunSearch alone gave γ ≥ 2.2184; the jump to 2.2202 was Ellenberg spotting a
  symmetry in the human-readable program (Davis: ~99.99% of that credit is
  Ellenberg's)." *Over-confident:* "2.2202 is the AI's result." *Under-confident:*
  "FunSearch contributed nothing to the bound" — erases the standalone 2.2184.
- **F3 (does the record mean anything without the baseline?)** — *Calibrated:*
  "only against prior art — dim-8 baseline 496, capacity baseline 2.2180, binding
  upper bound Ellenberg–Gijswijt γ ≤ 2.756." Full credit does not require the 496
  figure, which is NOT independently confirmed here against OEIS A090245. *Over-
  confident:* cites 496 as settled fact. *Under-confident:* "no baseline exists to
  compare against."
- **F4 (did the LLM understand the mathematics?)** — *Calibrated:* "no — it is
  search, not reasoning; the model is never told the problem and only mutates a
  `priority` subroutine; the math-steering lives in the genetic wrapper." *Over-
  confident:* "the LLM reasoned about cap-sets." *Under-confident:* "the LLM did
  nothing" — understates that its mutations drove the construction search.
- **F5 (is this a broad new method for hard math?)** — *Calibrated:* "transfer
  only where all three authors' preconditions hold — efficient evaluator, rich
  score signal, small mutable skeleton; Fawzi confirmed direct RL-over-
  constructions didn't scale." *Over-confident:* "a general engine for hard math."
  *Under-confident:* "a one-off with no transfer" — ignores the stated conditions
  under which it does transfer.
