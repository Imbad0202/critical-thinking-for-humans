# Expedition Pack: The Fifth Busy Beaver Value (Climber)

`pack_id: busy-beaver-5`

This climb asks an everyday-sounding question — which small program runs longest
before stopping? — and then makes "we checked every rival" precise. The proof
was completed in 2024 and machine-checked in Coq; its paper followed in 2025.
You execute the local inferences while keeping the machine-scale aggregate in
view.

## problem

**Scope card — exact game, exact result.**

- **Machines:** 5-state, 2-symbol Turing machines with tape alphabet `{0,1}`,
  using one bi-infinite tape. Each starts in state `A`, with its head at position
  zero, on the all-zero (blank) tape. An undefined transition halts the machine,
  and the final attempted halting step is included in the step count.
- **Score:** `S(5)` is the greatest number of **steps** taken by any machine in
  that model that eventually halts. It is not Radó's `Σ(5)`, which counts the
  number of `1` symbols left on the tape at halting.
- **Answer:** `S(5) = 47,176,870`. The champion transition table is
  `1RB1LC_1RC1RB_1RD0LE_1LA1LD_---0LA`, found by Heiner Marxen and Jürgen
  Buntrock in 1989.
- **Exhaustive burden:** the Coq proof enumerates **181,385,789** Tree Normal
  Form machines. Its pipeline uses five partial deciders — Loops, NGramCPS,
  RepWL, FAR, WFAR — together with explicit halting simulation and reduction
  steps; the **13** sporadic machines not solved by deciders receive individual
  non-halting proofs.
- **Dates:** the proof was completed on 2 July 2024; the formalizing paper was
  submitted to arXiv on 15 September 2025.
- **Ceiling:** this settles `S(5)`, not Busy Beaver in general. The paper treats
  `S(6)` as a qualitatively harder frontier and quotes a prediction that it will
  never be proved.

**Everyday scene — a tournament with a brutal referee's job.** Finding the
champion is like watching one runner finish after 47,176,870 ticks. Proving the
record is harder: every other eligible entrant must either finish no later or
receive a sound certificate that it will never finish. Tree Normal Form (**TNF**)
shrinks equivalent presentations to canonical representatives; a partial
**decider** is a referee that can certify only the machines its method covers.
Five such referees do most of the non-halting work; simulation and reductions
handle other cases, and 13 named holdouts need individual proofs.

**Why the notation matters.** Older Busy Beaver writing used `Σ(n)` for the
largest final number of `1` symbols. This paper deliberately uses `S(n)` for
maximum halting steps because later usage of "`BB(n)`" became ambiguous. The
number `47,176,870` is the step score `S(5)`; `Σ(5)` is a different quantity.

**Accessibility note — declared black boxes.** You may take the Coq kernel, the
detailed TNF normalization, and the internals of the five deciders as named
components on a first pass. You may not replace their proved obligations with
"the computer checked it." The climb is to reconstruct the local chain:
exhaustive enumeration, sound partial decisions, exactly 13 residual cases, and
one machine-checked theorem assembling them.

**Where the metaphor breaks.** The machines are not independent runners, and
TNF does more than shorten a contestant list: it represents machines related by
symmetry or unreachable transitions without losing the exhaustive claim. Nor is
Coq a human referee making judgment calls. The tournament image explains the
maximality burden; the formal definitions and proofs carry it.

## history

**How long open / who.** S(4) = 107 was settled by Allen Brady in 1983 — so S(5) stood open for over 40 years, making it the first new Busy Beaver value determined in four decades and the first ever formally verified. The 47,176,870 champion was found by Marxen and Buntrock in 1989; the *conjecture* that this was maximal then sat unproven. The proof was completed on 2 July 2024 by the bbchallenge Collaboration after roughly two years of open, distributed work. The paper credits the participant “mxdys” with Coq-BB5 and the Loops and RepWL deciders; the sporadic-machine proofs assembled by Coq-BB5 draw on both imported `busycoq` results and Coq-BB5 itself, so they are not attributed to one contributor. The formalizing paper was submitted to arXiv (2509.12337) on 15 September 2025.

The difficulty was never the champion — it was certifying that nothing beats it. A few dead ends along the way:

**Dead end 1: "just simulate every machine until it halts or you give up."** This is a dead end because a long run does not by itself distinguish a slow halter from a non-halter. Some hard machines exhibit an enormous preperiod before a repeatable non-halting structure can be certified; merely watching them longer is not the missing proof.

**Dead end 2: "one of the paper's partial deciders will clear the whole list."** No universal algorithm decides halting for arbitrary Turing machines. The fixed five-state search space is finite, however, so that general theorem does **not** imply that one bespoke procedure could not settle it. The source-backed fact is narrower: each of this proof's five partial deciders (Loops, NGramCPS, RepWL, FAR, WFAR) covered only a subset, so the certified pipeline combined them with simulation, reductions, and individual holdout proofs.

**Dead end 3: "informal / hand-waved non-halting arguments for the weird machines."** A dead end for *certainty*: the hardest holdouts (Skelet #1, #10, #17 and kin) had behaviors so chaotic that prose arguments could not command trust. Only machine-checked certificates closed the credibility gap.

**Dead end 4: "S(6) is merely the same finite sweep with more compute."** The paper presents S(6) as a qualitatively harder frontier and reduces the behavior of one holdout, Antihydra, to a stated Collatz-like iteration. That reduction is evidence of the new difficulty; it is not a license to call several holdouts equivalent to recognized open conjectures. The paper quotes a prediction that S(6) “will never be proved.”

## solution_provenance

**Where the verified solution lives.** Primary source: "Determination of the fifth Busy Beaver value," The bbchallenge Collaboration, arXiv:2509.12337 (submitted 15 September 2025), with HTML at https://arxiv.org/html/2509.12337v1 and PDF at https://arxiv.org/pdf/2509.12337. The executable proof artifact is Coq-BB5 v1.0.0, archived at https://doi.org/10.5281/zenodo.17061968; its pinned `BB5_Sporadic_Machines.v` source is https://github.com/ccz181078/Coq-BB5/blob/b295161e830cfb0698e6eff667afce8917ca1423/CoqBB5/BB5/BB5_Sporadic_Machines.v, and the theorem dispatch is in pinned `BB5_Deciders_Hardcoded.v` at https://github.com/ccz181078/Coq-BB5/blob/b295161e830cfb0698e6eff667afce8917ca1423/CoqBB5/BB5/BB5_Deciders_Hardcoded.v. The paper repo is github.com/bbchallenge/bbchallenge-paper; extraction outputs are at docs.bbchallenge.org. Proof completion was announced 2 July 2024 on the bbchallenge forum (discuss.bbchallenge.org/t/.../237).

**How verified.** This is a formally *verified* result, not merely peer-reviewed: the entire pipeline — the TNF enumeration producing all 181,385,789 machines, the five deciders, the 13 individual non-halting proofs, and the prior values S(2), S(3), S(4), S(2,3) — was machine-checked in the Coq proof assistant ("proof by reflection" / `native_compute`). Per the paper, Coq-BB5 is 27,274 lines of Coq plus 638 lemmas (plus 10,553 imported lines from busycoq) and compiles in about 45 minutes on 13 cores. The headline value and machine counts were checked against the paper, the pinned Coq artifact, and the first-party proof announcement.

**First-party check.** Read directly from the arXiv HTML (arXiv:2509.12337), the bbchallenge forum, and the pinned Coq-BB5 v1.0.0 source: S(5) = 47,176,870; 181,385,789 TNF machines; five named deciders; 13 sporadic machines; champion found by Marxen & Buntrock in 1989; champion transition table; 27,274 lines of Coq; "first … in over 40 years and first ever formally verified"; S(4) = 107 by Brady 1983; prediction that S(6) "will never be proved"; proof completed 2 July 2024. The paper's section 5 determines all 13 by three buckets — Finned #1–#5, Skelet #15/#26/#33/#34/#35, and Skelet #1/#10/#17 — while Coq-BB5 defines all 13 transition tables, collects them in `tm_holdouts_13`, and gives one non-halting lemma per machine. The numeric bbchallenge IDs in the table below were cross-checked separately against the public bbchallenge machine API; they do not appear in the Coq source. I could NOT independently re-render the PDF body text (the PDF fetch returned binary object structure, not prose), so the line-count and lemma-count figures rest on the HTML extraction rather than a second textual read of the PDF.

**The 13 named holdouts (Coq-BB5 v1.0.0).** These standard identifiers make the S5 residue check runnable from the pack: count the five Finned machines plus eight Skelet machines, compare them with `tm_holdouts_13`, then inspect the corresponding non-halting lemmas.

| machine | bbchallenge ID | standard identifier |
|---|---:|---|
| Finned #1 | 7763480 | `1RB0LE_1RC1RB_1RD1LC_0LE0RB_---1LA` |
| Finned #2 | 8120967 | `1RB1RA_1RC1LB_0LD0RA_1RA1LE_---0LD` |
| Finned #3 | 10756090 | `1RB1RE_1LC1RB_0RA0LD_1LB1LD_---0RA` |
| Finned #4 | 11017998 | `1RB1LA_0LC0RE_---1LD_1RA0LC_1RA1RE` |
| Finned #5 | 11018487 | `1RB1LA_0LC0RE_---1LD_1LA0LC_1RA1RE` |
| Skelet #1 | 68329601 | `1RB1RD_1LC0RC_1RA1LD_0RE0LB_---1RC` |
| Skelet #10 | 3810716 | `1RB0RA_0LC1RA_1RE1LD_1LC0LD_---0RB` |
| Skelet #15 | 2204428 | `1RB---_1RC1LB_1LD1RE_1LB0LD_1RA0RC` |
| Skelet #17 | 1365166 | `1RB---_0LC1RE_0LD1LC_1RA1LB_0RB0RA` |
| Skelet #26 | 13134219 | `1RB1LD_1RC0RB_1LA1RC_1LE0LA_1LC---` |
| Skelet #33 | 11896833 | `1RB1LC_0RC0RB_1LD0LA_1LE---_1LA1RE` |
| Skelet #34 | 11896832 | `1RB1LC_0RC0RB_1LD0LA_1LE---_1LA1RA` |
| Skelet #35 | 11896831 | `1RB1LC_0RC0RB_1LD0LA_1LE---_1LA0LA` |

## step_graph

- **S0 — Frame what "BB(5)" even asks** `representation_shift` Reframe from "find the busy machine" to "prove a *maximum over a finite but huge set*." Recognize the model precisely (5 states, 2 symbols, blank tape, count steps = S(n), distinct from Radó's Σ). Check: re-derive the model from the paper's definition; confirm S vs Σ distinction is stated explicitly.
- **S1 — Why BB is uncomputable in general** `shape_question` This has the shape of the halting problem: a general method to compute S(n) would decide halting (run the machine S(n)+1 steps; if not halted, it never will). Other field that saw this shape: computability theory (Turing 1936). Check: the reduction is a two-line argument the climber reproduces unaided — given S(n), halting becomes decidable, contradiction.
- **S2 — Probe small cases to feel the jump** `small_case_probe` Hand-check S(1)=1, S(2)=6, S(3)=21, then S(4)=107 (Brady 1983), and compare them with 47,176,870 at n=5. Check: simulate the n=2/n=3 champions and confirm the published step counts. These finitely many values show a sharp jump; they do not by themselves prove an asymptotic growth rate.
- **S3 — Cut the search space before deciding anything** `representation_shift` Tree Normal Form (TNF) collapses ~16.7 trillion syntactic machines to 181,385,789 by removing unreachable transitions and symmetric relabelings. Check: confirm the enumeration is itself run *inside Coq* (so the "we considered all machines" claim is machine-checked, not asserted).
- **S4 — Decompose "all non-halters" into sound partial deciders** `lemma_decomposition` Split the non-halting burden across five independently-proved deciders (Loops, NGramCPS, RepWL, FAR, WFAR), each a checkable lemma "if decider D accepts machine M, then M never halts." Check: each decider's soundness is a separate Coq theorem; a reader can audit one decider without the others.
- **S5 — Write the abandonment condition for the automated sweep** `kill_criteria` The kill criterion is explicit: any machine no decider settles becomes a named holdout requiring an individual proof. This bounds the bespoke work to exactly 13 sporadic machines — Finned #1–#5 and Skelet #1, #10, #15, #17, #26, #33, #34, and #35 — rather than an open-ended hunt. Check: 5 + 8 = 13; compare the list above with Coq-BB5 v1.0.0's `tm_holdouts_13`, then confirm `tm_holdouts_13_spec` dispatches every member to a machine-checked non-halting theorem.
- **S6 — Recast the summit as a verifiable chain** `milestone_rewrite` The claim "S(5)=47,176,870" becomes: (a) the champion halts at exactly 47,176,870 steps; (b) TNF covers all machines; (c) every machine is either decided non-halting by some sound decider, halts at ≤ 47,176,870, or is one of the 13 hand-proved non-halters. All assembled and checked in Coq. Check: each conjunct is a distinct Coq statement; the top theorem is their composition, auditable clause by clause.
- **S7 — Confirm the boundary: why S(6) is different** `kill_criteria` Ask whether the S(5) pipeline already closes S(6). It does not: a residual holdout list remains, and the paper analyzes Antihydra through a specific Collatz-like iteration while quoting a prediction that S(6) “will never be proved.” Check: reproduce the stated Antihydra reduction and keep its scope exact; do not turn “Collatz-like” into “equivalent to a recognized open conjecture.”

## breakthrough

The breakthrough is **S6** (the milestone_rewrite into a Coq-checkable conjunction) realized via **S4–S5** (sound partial deciders + an explicit finite holdout residue). The champion had been known since 1989; the remaining burden was *certifying maximality over 181 million representatives*. The proof closes that burden by composing the exhaustive enumeration, five proved partial deciders, simulation and reductions, and 13 individual non-halting proofs inside Coq. That is the source-backed explanation; no claim about the community's psychology is needed.

## audit_targets

- **T1 — The value and its source: S(5)=47,176,870, not BB(5).** *Objection:* "The paper says it avoids BB(n) notation — so is 47,176,870 the step-count S or Radó's Σ (final 1s)?" *Resolution:* First-party, the paper defines S(n) as max halting *steps* and states S(5)=47,176,870; Σ(5)=4098 is a different number. The pack reports the step-count, matching the source's S, so the figure is correctly attributed.
- **T2 — "All 181,385,789 machines" really is exhaustive.** *Objection:* "TNF throws away trillions of machines — maybe the maximum hides among the discarded ones." *Resolution:* TNF only removes machines equivalent under state/symbol relabeling or with unreachable transitions; these cannot exceed their canonical representative's step count, and the enumeration is executed inside Coq, so exhaustiveness is machine-checked, not assumed.
- **T3 — Formal verification covers the hard part, not just bookkeeping.** *Objection:* "Coq probably just tallied results a human still trusted on faith for the weird machines." *Resolution:* The five deciders' *soundness* and all 13 sporadic non-halting proofs are themselves Coq theorems (proof by reflection); the chaotic holdouts (Skelet #1/#10/#17) are exactly where machine-checked certificates replaced untrustworthy prose.
- **T4 — Date and primacy claims.** *Objection:* "Was this 'solved' in 2024 or 2025, and is 'first formally verified' puffery?" *Resolution:* Proof completed 2 July 2024 (bbchallenge announcement); paper arXiv-submitted 15 Sept 2025. "First new BB value in over 40 years" follows from S(4)=107 (Brady, 1983); "first ever formally verified" is the paper's own first-party claim. Distinguish proof-date from publication-date when citing.
- **T5 — Generalizability ceiling: do not over-claim the method.** *Objection:* "If this toolbox settled S(5), surely S(6) is just more compute." *Resolution:* The current pipeline does not settle S(6): a holdout residue remains, and the paper reduces Antihydra to a particular Collatz-like iteration while quoting a prediction that S(6) “will never be proved.” That is a frontier report, not a theorem that S(6) is unprovable or an equivalence with a named open conjecture.
