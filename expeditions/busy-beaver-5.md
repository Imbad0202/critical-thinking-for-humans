# Expedition Pack: The Fifth Busy Beaver Value (Climber)

`pack_id: busy-beaver-5`

A computability-theory climb: the maximum running time of a 5-state Turing
machine, settled in 2024 after 40 years and machine-checked in Coq. You execute
each local inference; the coach guides. The audit gap is that the aggregate —
181 million machines — is machine-scale, but each step is humanly checkable.

## problem

**Statement.** Among all Turing machines with 5 states and 2 symbols (the standard model: tape alphabet {0,1}, started on an all-blank tape), some halt and some run forever. Define S(5) as the maximum number of steps any *halting* such machine takes before it stops. The problem: determine S(5) exactly — which forces you to prove, for *every* machine that runs longer than the candidate champion, that it never halts.

**Answer.** S(5) = 47,176,870. The value is achieved by a specific champion machine (transition table `1RB1LC_1RC1RB_1RD0LE_1LA1LD_---0LA`), found by Heiner Marxen and Jürgen Buntrock in 1989. Every 5-state machine that runs longer than 47,176,870 steps was proved to run forever.

**Accessibility note.** The *statement* is reachable by anyone who understands a Turing machine: count steps, take the max over halters. A bright high-schooler can simulate a small machine by hand and watch the step counter climb. What is NOT human-reachable is the *proof of maximality*: it requires deciding the halting behavior of 181,385,789 distinct machines — most by automated "deciders," and a residue of pathological machines (Collatz-like counters, chaotic trajectories lasting >10⁵¹ steps, obfuscated Gray-code behavior) by bespoke arguments. No human can hand-check 181 million machines, and the deciders themselves had to be proven correct. This is the audit gap the climber must respect: you can verify each *local* inference, but the *aggregate* is machine-scale. The paper notably writes the function as S(n) (steps), avoiding "BB(n)," because BB historically meant Radó's Σ-function (final 1s on tape) before usage drifted to the step-count function.

## history

**How long open / who.** S(4) = 107 was settled by Allen Brady in 1983 — so S(5) stood open for over 40 years, making it the first new Busy Beaver value determined in four decades and the first ever formally verified. The 47,176,870 champion was found by Marxen and Buntrock in 1989; the *conjecture* that this was maximal then sat unproven. The proof was completed on 2 July 2024 by the bbchallenge Collaboration (an open, distributed online effort of contributors including the participant "mxdys" who built the Coq certificates), after roughly two years of collaboration. The formalizing paper was submitted to arXiv (2509.12337) on 15 September 2025.

The difficulty was never the champion — it was certifying that nothing beats it. A few dead ends along the way:

**Dead end 1: "just simulate every machine until it halts or you give up."** This is a dead end because the whole point is that you cannot tell a slow halter from a non-halter by simulation — that is the halting problem. A machine quiet for 10⁵¹ steps then springing to life kills any fixed simulation budget.

**Dead end 2: "one universal decider for non-halting."** A dead end: no algorithm decides halting in general, so no single decider can clear all machines. The proof instead needed a *toolbox* of five partial deciders (Loops, NGramCPS, RepWL, FAR, WFAR), each provably sound but each only covering some machines.

**Dead end 3: "informal / hand-waved non-halting arguments for the weird machines."** A dead end for *certainty*: the hardest holdouts (Skelet #1, #10, #17 and kin) had behaviors so chaotic that prose arguments could not command trust. Only machine-checked certificates closed the credibility gap.

**Dead end 4: "settle it the way you'd settle S(6)."** A dead end: S(6)'s holdouts include machines (e.g. Antihydra) whose halting is equivalent to open Collatz-type conjectures; the paper predicts S(6) "will never be proved." S(5) was right at the boundary of what bespoke effort could close.

## solution_provenance

**Where the verified solution lives.** Primary source: "Determination of the fifth Busy Beaver value," The bbchallenge Collaboration, arXiv:2509.12337 (submitted 15 September 2025), with HTML at https://arxiv.org/html/2509.12337v1 and PDF at https://arxiv.org/pdf/2509.12337. The proof artifact is the Coq development "Coq-BB5"; the paper repo is github.com/bbchallenge/bbchallenge-paper; extraction outputs at docs.bbchallenge.org. Proof completion announced 2 July 2024 on the bbchallenge forum (discuss.bbchallenge.org/t/.../237).

**How verified.** This is a formally *verified* result, not merely peer-reviewed: the entire pipeline — the TNF enumeration producing all 181,385,789 machines, the five deciders, the 13 individual non-halting proofs, and the prior values S(2), S(3), S(4), S(2,3) — was machine-checked in the Coq proof assistant ("proof by reflection" / native_compute). Per the paper, Coq-BB5 is 27,274 lines of Coq plus 638 lemmas (plus 10,553 imported lines from busycoq) and compiles in ~45 minutes on 13 cores. I corroborated the headline facts across the arXiv HTML, Scott Aaronson's blog, and the bbchallenge announcement; the value and machine counts are mutually consistent.

**First-party check.** Read directly from the arXiv HTML and the bbchallenge forum: S(5) = 47,176,870; 181,385,789 TNF machines; five named deciders; 13 sporadic machines; champion found by Marxen & Buntrock in 1989; champion transition table; 27,274 lines of Coq; "first … in over 40 years and first ever formally verified"; S(4) = 107 by Brady 1983; prediction that S(6) "will never be proved"; proof completed 2 July 2024. I could NOT independently re-render the PDF body text (the PDF fetch returned binary object structure, not prose), so the line-count and lemma-count figures rest on the HTML extraction rather than a second textual read of the PDF.

## step_graph

- **S0 — Frame what "BB(5)" even asks** `representation_shift` Reframe from "find the busy machine" to "prove a *maximum over a finite but huge set*." Recognize the model precisely (5 states, 2 symbols, blank tape, count steps = S(n), distinct from Radó's Σ). Check: re-derive the model from the paper's definition; confirm S vs Σ distinction is stated explicitly.
- **S1 — Why BB is uncomputable in general** `shape_question` This has the shape of the halting problem: a general method to compute S(n) would decide halting (run the machine S(n)+1 steps; if not halted, it never will). Other field that saw this shape: computability theory (Turing 1936). Check: the reduction is a two-line argument the climber reproduces unaided — given S(n), halting becomes decidable, contradiction.
- **S2 — Probe small cases to feel the explosion** `small_case_probe` Hand-check S(1)=1, S(2)=6, S(3)=21 (1960s), then S(4)=107 (Brady 1983). Watch the jump to 47,176,870 at n=5. Check: simulate the n=2/n=3 champions by hand and confirm the published step counts; confirm the growth is super-exponential, motivating why n=5 needed machines not pencils.
- **S3 — Cut the search space before deciding anything** `representation_shift` Tree Normal Form (TNF) collapses ~16.7 trillion syntactic machines to 181,385,789 by removing unreachable transitions and symmetric relabelings. Check: confirm the enumeration is itself run *inside Coq* (so the "we considered all machines" claim is machine-checked, not asserted).
- **S4 — Decompose "all non-halters" into sound partial deciders** `lemma_decomposition` Split the non-halting burden across five independently-proved deciders (Loops, NGramCPS, RepWL, FAR, WFAR), each a checkable lemma "if decider D accepts machine M, then M never halts." Check: each decider's soundness is a separate Coq theorem; a reader can audit one decider without the others.
- **S5 — Write the abandonment condition for the automated sweep** `kill_criteria` The kill criterion is explicit: any machine no decider settles becomes a named holdout requiring an individual proof. This bounds the bespoke work to a finite enumerated residue (13 sporadic machines: Skelet #1, #10, #17, …) rather than an open-ended hunt. Check: the count of undecided machines is reported and finite; verify 13 individual proofs exist, one per holdout.
- **S6 — Recast the summit as a verifiable chain** `milestone_rewrite` The claim "S(5)=47,176,870" becomes: (a) the champion halts at exactly 47,176,870 steps; (b) TNF covers all machines; (c) every machine is either decided non-halting by some sound decider, halts at ≤ 47,176,870, or is one of the 13 hand-proved non-halters. All assembled and checked in Coq. Check: each conjunct is a distinct Coq statement; the top theorem is their composition, auditable clause by clause.
- **S7 — Confirm the boundary: why S(6) is different** `kill_criteria` Apply the same kill criterion at n=6 and watch it fail: ~2,600 holdouts remain, some (Antihydra) equivalent to open Collatz-type conjectures; the paper predicts S(6) "will never be proved." Check: confirm at least one S(6) holdout is reduced to a recognized open problem, establishing that S(5) sat exactly at the edge of decidability-by-effort.

## breakthrough

The breakthrough is **S6** (the milestone_rewrite into a Coq-checkable conjunction) realized via **S4–S5** (sound partial deciders + an explicit finite holdout residue). It eluded the community for 40 years because the obstacle was never finding the champion (known since 1989) but *certifying maximality over 181 million machines* — and prose arguments for the chaotic holdouts (machines running >10⁵¹ steps, Collatz-like counters) could not earn trust. Only when the enumeration, the five deciders, and the 13 bespoke non-halting proofs were all recast as machine-checked Coq reflection did "we checked everything" stop being a claim and become a verified theorem.

## audit_targets

- **T1 — The value and its source: S(5)=47,176,870, not BB(5).** *Objection:* "The paper says it avoids BB(n) notation — so is 47,176,870 the step-count S or Radó's Σ (final 1s)?" *Resolution:* First-party, the paper defines S(n) as max halting *steps* and states S(5)=47,176,870; Σ(5)=4098 is a different number. The pack reports the step-count, matching the source's S, so the figure is correctly attributed.
- **T2 — "All 181,385,789 machines" really is exhaustive.** *Objection:* "TNF throws away trillions of machines — maybe the maximum hides among the discarded ones." *Resolution:* TNF only removes machines equivalent under state/symbol relabeling or with unreachable transitions; these cannot exceed their canonical representative's step count, and the enumeration is executed inside Coq, so exhaustiveness is machine-checked, not assumed.
- **T3 — Formal verification covers the hard part, not just bookkeeping.** *Objection:* "Coq probably just tallied results a human still trusted on faith for the weird machines." *Resolution:* The five deciders' *soundness* and all 13 sporadic non-halting proofs are themselves Coq theorems (proof by reflection); the chaotic holdouts (Skelet #1/#10/#17) are exactly where machine-checked certificates replaced untrustworthy prose.
- **T4 — Date and primacy claims.** *Objection:* "Was this 'solved' in 2024 or 2025, and is 'first formally verified' puffery?" *Resolution:* Proof completed 2 July 2024 (bbchallenge announcement); paper arXiv-submitted 15 Sept 2025. "First new BB value in over 40 years" follows from S(4)=107 (Brady, 1983); "first ever formally verified" is the paper's own first-party claim. Distinguish proof-date from publication-date when citing.
- **T5 — Generalizability ceiling: do not over-claim the method.** *Objection:* "If this toolbox settled S(5), surely S(6) is just more compute." *Resolution:* No — the same kill criterion at n=6 leaves ~2,600 holdouts including Antihydra, equivalent to an open Collatz-type conjecture; the paper predicts S(6) "will never be proved." The method's reach stops at the edge of independent open problems, which is the honest limit.

