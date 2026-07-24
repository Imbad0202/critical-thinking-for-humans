# Expedition Pack Roadmap

Candidate packs vetted against the four bars (real / verified-solution /
beyond-single-human / first-party-checkable) and the dual-use safety check.
Authoring order favours domain spread, not just provenance strength: the point
of expedition mode is that the human-executable disciplines transfer across
fields, so the pack set must span fields, not cluster in SAT-solver math.

Each pack is one first-party verification session — read the actual source,
not a press summary (PACK-SCHEMA.md authoring rule). Packs are NOT produced by
improvising from memory.

## Status

| pack | domain | provenance | role fit | status |
|------|--------|-----------|----------|--------|
| boolean-pythagorean-triples | combinatorics / SAT | arXiv:1605.00723, SAT 2016, drat-trim + Coq/ACL2 (transformation) | auditor | DONE |
| katago-adversarial | games / ML robustness | arXiv:2211.00241, ICML 2023, reproducible exploit + human replication | auditor | DONE (template-2, inline) |
| alphatensor-matmul | algorithms / AI discovery | Nature 2022 (s41586-022-05172-4) + Kauers–Moosbauer arXiv:2210.04045; decompositions directly checkable | auditor | DONE (Phase 2 workflow) |
| erdos-discrepancy | number theory | Konev–Lisitsa arXiv:1402.2184 (SAT, C=2) + Tao arXiv:1509.05363 (human proof, Discrete Analysis 2016) | auditor | DONE (Phase 2 workflow) |
| keller-dimension-7 | geometry / SAT | Brakensiek–Heule–Mackey–Narváez arXiv:1910.03740, IJCAR 2020, ACL2check formally-verified checker | auditor | DONE (Phase 2 workflow) |
| alphafold-casp14 | structural biology | CASP14 2020 + Jumper et al. Nature 2021; prediction-vs-experiment | forecaster | DONE (Phase 2 workflow; first forecaster pack) |

## Notes per candidate

- **katago-adversarial** — auditing a *superhuman* system and finding it is
  not robust: the AI-era evaluation skill in its purest form. Most accessible
  (Go, not Coq), furthest from the SAT-solver family, dual-use-safe. Chosen as
  template-2 to prove the disciplines travel beyond math.
- **alphatensor-matmul** — built-in over-claiming lesson: the headline result
  (47-step 4×4 mod 2) was improved within days (Kauers–Moosbauer). Audit
  target writes itself: mechanically-correct ≠ optimal ≠ generalizable.
- **erdos-discrepancy** — the only candidate where a machine solution AND a
  later human proof both exist (Konev–Lisitsa SAT for C=2; Tao's full proof).
  Two step graphs to author (heavier), but the contrast — what machine
  knowledge vs human knowledge each look like — is unique teaching value.
- **keller-dimension-7** — cleaner provenance than BPT (formally verified, not
  just checked). Risk: too close to BPT's SAT-UNSAT shape; author only after a
  non-SAT pack lands, to avoid the set clustering in one method.
- **alphafold-casp14** — does NOT decompose into an auditable step graph; the
  load-bearing question is "why trust a prediction you cannot derive." That is
  a forecaster-role pack, not auditor. Author once the forecaster flow has been
  exercised at least once.

## Explicitly out of scope

- **Humanities / interpretive results** (e.g. ML scribe-attribution on the Dead
  Sea Scrolls, Popović 2021). These produce contested *interpretations*, not
  verified *solutions*; they fail the solved+verified bar. The honest move in a
  field with no ground-truth verification chain is to say so, not to manufacture
  an audit target. Revisit only if a genuinely verified humanities result
  appears.

## Phase 2 — scale-out (DONE)

Once katago-adversarial stabilised the pack template (second instance), the
remaining ROADMAP packs became a known work-list and were drafted via a
Workflow fan-out — one agent per source: read first-party → draft pack →
pass check_pack_schema.py → maintainer converges and re-verifies every numeric
claim against the source. First-party verification strength stayed the gate: a
workflow draft is a draft, not a verified pack, until the numbers are
re-checked against the original. (Re-verification caught a real fluent-wrongness
trap — the AlphaTensor 5×5-mod-2 "96" figure is not in the Nature text — which
is exactly why the gate exists.)

## Phase 3 — vetted candidate pool

Survey of 2017–2025 results against the four bars (solved / first-party
verified / beyond-single-human / first-party-checkable) + dual-use. All PASSes
below are now authored; rejected candidates and why are recorded so the search
is not repeated.

Ranked by transfer value (domain spread away from SAT-math + provenance
cleanliness + accessibility):

| candidate | domain | source | verification | role | note |
|-----------|--------|--------|--------------|------|------|
| busy-beaver-5 | computability | arXiv:2509.12337 (2024) | Coq-verified; 181M machines enumerated; BB(5)=47,176,870 | climber | DONE (Phase 3 workflow). top pick — new domain, cleanest provenance, first BB value ever formally verified |
| alphaproof-imo-2024 | formal math / ML | Nature s41586-025-09833-y | Lean machine-checked; public proof mirror | auditor | DONE (Phase 3 workflow). read a Lean proof you could not write; strongest ML-math provenance |
| lams-problem | design theory | arXiv:2012.04715 (2020) | DRAT nonexistence certificate for the hardest sub-case (a few GB, NOT the ~1 TB the survey guessed), third-party checkable; the 2020 redo found consistency issues in the 1989/2011 searches | auditor | DONE (Phase 3 workflow). audit a NEGATIVE result (no projective plane of order 10); the 2020 SAT redo made the 1989 result independently verifiable for the first time |
| chromatic-number-plane-5 | geometry / graph coloring | arXiv:1804.02385 (2018) | 1581-vertex unit-distance graph, non-4-colourability SAT-verifiable | forecaster | DONE (Phase 3 workflow). amateur-discovered; parent problem (CNP) STILL OPEN — frame as "is this the answer?" (it isn't) |
| ramsey-4-5-hol4 | Ramsey / graph theory | arXiv:2404.01761, ITP 2024 | HOL4 kernel-verified; re-proves the 1995 R(4,5)=25 (which rested on trust-the-program, not a kernel-checked proof) | auditor | DONE (Phase 3 remainder). "why re-prove a believed result" = belief vs verification |
| alphageometry-imo | geometry / ML | Nature s41586-023-06747-5 (2024) | symbolic deduction engine + LM; 25/30 olympiad-geometry benchmark | auditor | DONE (Phase 3 remainder). human-readable + symbolically checked vs alphaproof's machine-formal Lean |
| pentago-solved | games | arXiv:1404.0743 (2014) | strongly solved, parallel in-core retrograde analysis; 3.0×10^15 states; open-source | climber | DONE (Phase 3 remainder). first-player win; games-domain spread |
| schur-number-5 | combinatorics / SAT | arXiv:1711.08076, AAAI 2018 | S(5)=160; two-petabyte DRAT; formally-verified checker | auditor | DONE (Phase 3 remainder). a+b=c monochromatic / Schur-Ramsey framing, 2 PB scale (differentiated from BPT/Keller) |

**Initial Phase 3 quartet (now authored; four domains, four verification styles):**
busy-beaver-5 (Coq / computability), alphaproof-imo-2024 (Lean / formal-ML),
lams-problem (DRAT / design theory), chromatic-number-plane-5 (SAT-graph /
geometry).

### Borderline — DONE, authored WITH the contestation built in

- **funsearch-cap-set** (Nature s41586-023-06924-6, 2023): DONE (forecaster).
  Pack audits the dim-8 size-512 construction and the γ ≥ 2.2184 bound as
  lower bounds on an OPEN problem, and re-attributes the widely-cited 2.2202
  figure to Ellenberg (human), not the AI — grounded in Ernest Davis's
  first-party critique. Never implies the cap-set problem is solved.
- **alphaevolve-48-mult** (AlphaEvolve white paper arXiv:2506.13131 + rational
  follow-up Dumas–Pernet–Sedoglavic arXiv:2506.13242, 2025): DONE (auditor).
  The 48 is real but **only over the complex numbers**; Waksman (1970) did 4×4
  in 46 over commutative rings, so the contestation IS the pack — what was
  beaten, in what algebraic setting, and what prior work the headline omits.

### Rejected (recorded so the search is not repeated)

- **Viazovska sphere packing dim 8/24** (2016), **Huang sensitivity
  conjecture** (2019), **polynomial Freiman-Ruzsa** (Gowers-Green-Manners-Tao
  2023): all are HUMAN proofs — fail the beyond-single-human bar. The
  PFR/Kepler-style Lean formalizations are first-party checkable but formalize a
  human result; usable only as formal-verification-auditing packs, never as
  "AI/computation solved it."
- **Generic endgame tablebases / Connect Four / older checkers**: either
  pedagogically thin (no single result to audit), or predate the AI-class-search
  era. Prefer a named solved game (Pentago) instead.
- **AlphaEvolve engineering optimisations** (kissing-number dim 11, scheduling):
  mostly lack independent first-party math verification — fail bar 2.

---

## Phase 4 — survey (2024-2026, weighted to pool gaps)

At the Phase 4 survey baseline, the pool had a known shape problem: 6 of the
then-22 authored packs taught the same SAT-certificate lesson, and 15 of 22 sat
in the auditor role. A survey that just added "the next impressive result"
would deepen both skews. So this round was weighted deliberately AWAY from
SAT-certificate verification, away from combinatorics/games, and toward the two
under-served roles (forecaster, climber). Ranking below follows the ROADMAP's
stated transfer-value criteria:
verification-style diversity first, then domain spread, then role spread, then
provenance cleanliness (formally verified > peer reviewed; open primary source
reachable). Every PASS was reached at its primary source, not a press summary.
Six candidates are now authored; the remaining accepted candidates below are
deliberate future backlog rather than unfinished Phase 4 release work.

| candidate | domain | source | verification style | role | why it fills a gap |
|-----------|--------|--------|--------------------|------|--------------------|
| 3d-euler-blowup | physics / PDE fluid dynamics | PNAS 122(27) e2500940122 (2025), open via PMC12260595; load-bearing artifact is Part II rigorous numerics, arXiv:2305.05660, peer-reviewed SIAM MMS 23(1):25-130 (2025); Part I analysis arXiv:2210.07191 | computer-assisted proof (rigorous interval numerics, verified error bounds); SIAM-refereed | auditor | **AUTHORED** (Phase 4, first pack). NEW verification style (certified numerics, not SAT/formal-Lean/game-solve) in a NEW domain (fluid PDE); a 1757-old question closed by machine-certified error control, not pen-and-paper. Scope kept honest: axisymmetric + boundary + nearly-self-similar, NOT general free-space 3D Euler (still open) |
| serine-hydrolase-design | chemistry / de novo enzyme design | Science 388 (2025) DOI 10.1126/science.adu2454; open via PMC11384011 / bioRxiv + author-hosted PDF; PDB 9DED/9DEE/9DEF/9DEG/9DEH/9MRB | prediction-vs-experiment (crystal structures match designs to best-case ~0.7–0.83 Å backbone Cα, some ~1.2–1.4 Å; measured multi-turnover kinetics); coords deposited | forecaster | **AUTHORED** (Phase 4, fifth pack). Forecaster role AND a NEW domain (chemistry). Unlike CASP14 it DESIGNS a new catalyst whose function is a fresh empirical bet, not a natural-fold prediction. Honesty scope: "<1 Å" is best-case not typical; headline 2×10⁵ M⁻¹s⁻¹ efficiency is final-Science-version-only (preprint tops ~3,800); no wet-lab directed evolution but YES computational iteration; multi-turnover genuine but fragile; rivals nature on structure/mechanism NOT efficiency (still 2–5 orders below). Dual-use PASS with wording guardrail (framed as ester/plastic hydrolysis, no organophosphate/FP-probe detail) |
| empty-hexagon-30 | combinatorial geometry | arXiv:2403.00737 (SAT) + arXiv:2403.17370, ITP 2024 (Lean) | SAT-cert AND full Lean formalization — dual verification | forecaster | Forecaster fit (predict the threshold: 29? 30? 31? before reveal). Carries BOTH a SAT cert and a kernel-checked Lean proof, unusual belt-and-suspenders provenance. Domain overlaps combinatorics — its pull is the role + double verification, not domain novelty |
| connect-four-bdd-oracle | solved games / symbolic search | arXiv:2507.05267 (2025, PREPRINT — not peer-reviewed); Zenodo 10.5281/zenodo.14582823 (46.8 GB 7z download); code on GitHub (no license file) | strongly-solved via symbolic BDD (exact algorithm + consistency checks vs Tromp/Edelkamp-Kissmann/1988 value; NOT a SAT/DRAT cert, NOT formally verified); 89.6 GB uncompressed queryable oracle | climber | **AUTHORED** (Phase 4, third pack). Climber role, NON-SAT game-solve — breaks the SAT skew, adds to the thin climber set. Novelty = first COMPLETE MATERIALIZED strong-solution table (value known 1988; Tromp's 8-ply DB effectively strong-solved via search), NOT "first to solve". Symbolic sets-of-states on ONE core — distinct from pentago's explicit parallel retrograde |
| 2048-4x3-strongly-solved | solved games / stochastic MDP | arXiv:2510.04580 (2025); code CC-BY-4.0 | strongly-solved as exact MDP value iteration (correct-by-construction; no SAT cert); 3 independent runs + SHA256 | climber | Climber role, and the lane's first STOCHASTIC game: "strongly solved" here means exact optimal EXPECTED value, computed by an age-ordering trick that makes the DAG acyclic. NOTE: distinct from the REJECTED 4×3-2048 item — that one shipped no queryable database; this arXiv:2510.04580 release does |
| casp16-rna | RNA structure prediction | Kretsch et al., peer-reviewed Proteins 94(1):192-217 (2026), DOI 10.1002/prot.70072; open-access preprint bioRxiv 2025.05.06.652459 / PMC12248019 | blind assessment: 65 groups from 46 labs vs 42 withheld X-ray/cryo-EM/NMR structures | auditor | **AUTHORED** (Phase 4, second pack). NEW domain (RNA) and a HUMBLING result: fully-automated deep-learning did NOT beat human-plus-AI expert pipelines; no *previously-unseen* natural RNA hit TM-score > 0.8. Trains two-directional anti-overclaim (neither "AI won" nor "AI useless"), not celebration. Distinct from protein CASP14 |
| collapsi-solved | solved games / retrograde analysis | arXiv:2507.16823 (2025); open-source solver | strongly-solved (complete win/loss classification; solver enables first-party recompute) | climber | Climber role, brand-new 2025 game solve. User works a specific deal ply by ply, taking the solver-marked winning move and confirming the classification propagates. Domain overlaps games — pulled in for role, not domain |
| othello-8x8-weakly-solved | solved games / large-scale search | arXiv:2310.19387 (Takizawa, late 2023) | weakly-solved via pruned alpha-beta on an Edax variant; solver released for recompute | climber | Climber role, the marquee "last classic board game" absent from the pool: 8×8 Othello, perfect play is a DRAW. Late-2023 but within the brief's allowance. Domain overlaps games; value is role + iconic result |
| breakthrough-6x6 | solved games / PNS + NN scheduler | ICGA Journal, DOI 10.1177/13896911261430592 (2026) | constructive proof tree (retrograde tablebases + proof-number search; not SAT); peer-reviewed | climber | Climber role; AI hook is a neural-net scheduler steering an otherwise-intractable proof search. PROVENANCE CAVEAT: SAGE body paywalled; the independent-Maastricht-check + CNN/hardware details are second-hand from a search index of a 403-walled thesis PDF, weaker than the open-primary PASSes above |

**Initial diversity quartet (all now authored):**

1. **3d-euler-blowup** — the single strongest gap-filler. It is the only
   candidate that adds a genuinely new verification STYLE (computer-assisted
   certified numerics) in a genuinely new DOMAIN (fluid PDE), and it clears the
   beyond-single-human bar cleanly because it is a machine-certified proof, not
   a human argument. Open primary source (PMC), PNAS referees named.
2. **serine-hydrolase-design** — the best second forecaster pack and a new
   chemistry domain. Deposited PDB coordinates make the atomic-accuracy claim
   first-party checkable, and "designed molecule as an empirical bet" is a
   distinct discipline from CASP14's natural-fold prediction. Dual-use here is
   mild (a catalyst, not a hazard), unlike the antibody-design borderline.
3. **connect-four-bdd-oracle** — best climber pick to break the SAT skew: a
   strongly-solved game by symbolic BDD, correct-by-construction, with a
   queryable 89.6 GB oracle anyone can probe. New verification substrate, new
   role, clean open provenance.
4. **casp16-rna** — the humbling result the pool lacks. Every existing
   forecaster/auditor pack audits a WIN; this audits a documented FAILURE of
   deep learning to beat human experts, which trains the exact hype-skepticism
   reflex the tool is for. New domain, open primary source.

Rationale for the shape of this quartet: it spans four verification styles
(certified numerics / prediction-vs-experiment / symbolic BDD / blind
assessment), four domains (PDE physics / chemistry / games / RNA biology), and
covers all three under-served pressures — two non-auditor roles (forecaster,
climber) plus a rare negative-result auditor. The remaining PASSes
(2048-4x3, empty-hexagon-30, collapsi, othello, breakthrough-6x6) are strong
but each overlaps an axis the quartet already covers, so they are the next tier,
not the first. Among them, weight 2048-4x3 (stochastic twist) and
empty-hexagon-30 (dual SAT+Lean, forecaster) above the three additional
game-solves, and treat breakthrough-6x6 as lowest-priority on provenance
grounds until its open thesis PDF is directly reachable.

### Borderline

Not clean accepts; author only if the specific scope condition is met.

- **rfdiffusion-antibody-design** (Nature 2024-2025; PMC10983868, PDB 9NH7 /
  EMD-49405): prediction-vs-experiment, forecaster. Two problems. (a) The
  verified-solution bar is fuzzier than existing packs — the deposited positive
  complexes are checkable, but the headline "atomically accurate de novo
  antibody design" is contested (author-reported low success, an explicit
  SARS-CoV-2 design failure, and a Dec-2025 non-peer-reviewed critique on RMSD
  superposition / selective reporting). (b) Dual-use: the transferable content
  is a working antibody-design capability. Author ONLY if scoped to "audit the
  atomic-accuracy claim against the deposited structures" with the dual-use
  guardrail; otherwise hold.
- **csp7-crystal-structure-prediction** (2024; open via PMC11789161 /
  PMC11789160): blind held-out benchmark, forecaster. Clean on all four bars and
  dual-use. Borderline purely on archetype overlap: it is the SAME
  predicted-vs-withheld-experiment logic as CASP14, transplanted to molecular
  crystal packing. Not a duplicate (different domain, CIF/RMSD substrate), but it
  trains largely the same discipline. Author only if a distinct SECOND forecaster
  in a materials domain is wanted after serine-hydrolase-design lands.
- **gencast-weather** (Nature 2024; open via PMC11666454 / arXiv:2312.15796):
  the candidate pitched it as pure predict-then-reveal-against-physical-reality,
  but its headline verification is against ERA5 reanalysis (a model analysis
  field), not raw observations — so the load-bearing forecaster framing is
  inaccurate against the primary source, and CASP14 already occupies that lane
  more cleanly (reveal against withheld experimental crystallography). Weaker
  instance of an existing lane on the very axis that mattered. Hold unless
  reframed honestly around reanalysis-as-ground-truth.

### Formal-autoformalization cluster — real, but hold as a batch

Five 2024-2026 Lean/Imandra results PASSed vetting and are individually clean
(open arXiv + public kernel-checked repos, first-party re-runnable). They are
grouped here on purpose: authoring all five would re-cluster the pool in exactly
the way Phase 4 exists to avoid — this time in formal-proof-of-ML rather than
SAT. Pick AT MOST one or two, and prefer the ones carrying a second, contrasting
verification track.

- **erdos-728-gpt5** — **AUTHORED** (Phase 4, fourth pack). arXiv:2601.07421
  (2026, a *writeup* by Sothanaphan, NOT peer-reviewed) + public Lean proof
  Erdos728b.lean (0 sorry, axioms = [propext, Classical.choice, Quot.sound]):
  auditor. Two-track contrast — kernel-check (validity) PLUS informal expert
  review (Tao: statement-fidelity/novelty/autonomy). Honest scope: "resolved" =
  the human-reconstructed intended statement; "autonomous" = no injected human
  MATH insight (narrow, not hands-off); "first" = first-autonomous-among-a-
  Jan-2026-cluster; Tao framed it as lowest-hanging-fruit, speed-not-difficulty.
- **alphaproof-nexus** (arXiv:2605.22763, DeepMind 2026; Lean 4 repo, Apache-2.0):
  climber. 9 open Erdős problems + 44 OEIS conjectures resolved and
  compiler-checked. Distinct from alphaproof-imo-2024 (open research conjectures,
  not olympiad tasks). The batch's flagship if a single formal-ML climber is
  wanted.
- **axiomprover-fels** (arXiv:2602.03716, 2026; solution.lean 2544 lines, 0
  sorry, 0 new axioms): auditor. Natural-language-in, kernel-checked-proof-out
  autoformalization of the open Fel's conjecture.
- **imandra-marabou-checker** (arXiv:2405.10611, ITP 2025): **AUTHORED** (Phase 4,
  sixth pack). Auditor. A DIFFERENT flavour worth its own slot — a peer-reviewed
  (ITP 2025 / LIPIcs), formally-verified checker that re-checks an automated
  DNN-verifier's certificates, i.e. "who verifies the verifier." Only member of the
  cluster teaching that specific discipline. Honest scope: the CHECKER is verified,
  Marabou is NOT (stays untrusted); trust is MIGRATED not eliminated (residual base
  = soundness theorem + Imandra kernel); soundness is of the FORMAL QUERY, not yet
  formally linked to the real network (explicit future work); coverage partial
  (UNSAT branch only, some output uncertified); BEYOND-SINGLE-HUMAN is a PARTIAL/
  honest-stretch bar — the proof is a human formal-methods result, the "beyond"
  angle is only the machine-scale AI artifact under audit, NOT a superhuman/AI proof.
  Pack does NOT claim "0-sorry" (paper prints no admit-count).
- Batch closed at TWO authored (erdos-728-gpt5 + imandra-marabou-checker),
  honoring the re-cluster discipline. **alphaproof-nexus** and **axiomprover-fels**
  remain recorded PASSes, deliberately NOT authored, so the formal-proof-of-ML lane
  does not re-skew the pool; re-surface only if a later phase wants another
  formal-ML slot.

### Rejected (recorded so the search is not repeated)

- **JailbreakBench** and any jailbreak/red-team-infra benchmark: no single
  verified solution (a moving leaderboard gated on an LLM judge, not a
  certificate) AND fails dual-use (ships runnable jailbreak artifacts + stored
  harmful outputs = capability transfer). Do not re-surface this class.
- **many-shot-jailbreaking** (Anthropic, NeurIPS 2024): the RESULT passes all
  four bars (real power-law scaling of attack success, first-party from the
  proceedings PDF), but it is held out here on dual-use grounds. It is only
  admissible if a pack can be confined strictly to the scaling-law / attack-vs-
  defense reasoning and NEVER surface harmful content; if that framing is
  rejected, drop it. Recorded as PASS-with-caveat, not authored.
- **go-defenses-still-fail** (arXiv:2406.12843, AAAI 2025): PASSes vetting
  (three named KataGo defenses each defeated by fresh adversaries; open code +
  replayable games) and is a legitimate distinct sequel to katago-adversarial
  (the claim under audit is "we patched it," and the finding is it is still
  broken). Recorded as an authorable PASS, but deprioritized against the Phase 4
  diversity mandate because it sits in the same games / ML-robustness / auditor
  cell as an existing pack.
- **luxsit-luciferase**: wet-lab assay is not independently re-verifiable from
  the primary source (no blind competition / neutral adjudicator like CASP14),
  and it duplicates CASP14's forecaster role — structural-vs-functional is a
  domain distinction, not a new discipline.
- **book-ramsey R(B_8,B_10)=37 (AutoMath/Lean)**: the result is a SHORT
  human-checkable proof AutoMath merely surfaced — no AI-class search embodied,
  so it fails the beyond-single-human bar. The candidate summary also fabricated
  a "SAT-plus-search" novelty the source explicitly disclaims.
- **unstable-singularities (DeepMind, neural)**: fails the verified-solution bar
  as of 2026-07 — high-precision NUMERICAL discovery on a non-refereed preprint;
  the computer-assisted existence proof is "in preparation," so existence remains
  formally open. RE-VET once the companion proof is published and refereed (would
  then likely be a clean PASS). Distinct from 3d-euler-blowup, which PROVES one
  blowup rather than discovering families of profiles.
- **diii-d plasma tearing control** (Nature): fails first-party-checkable
  (data on-request-only, proprietary DIII-D diagnostics, no public code) and
  verified-solution (single un-replicated campaign, a control demo not a checkable
  solution). Same rejection class as AlphaEvolve engineering optimizations.
- **2048 4×3 (earlier framing)**: rejected as pitched because no state-value
  database was released — checking required rebuilding a ~2.56 TB database on
  heavy compute, so the "check against the released database" climb was not
  first-party checkable. NOTE the PASS above (arXiv:2510.04580) is the
  distinct, database-releasing version; do not conflate.

## Phase 5 — Jacobian counterexample (DONE)

- **jacobian-conjecture-counterexample** — **AUTHORED** (auditor, with a short
  climber ridge). The exact degree-seven map over \(\mathbb C^3\), its
  identically \(-2\) Jacobian determinant, and its three-input collision were
  independently rerun with exact rational arithmetic. Historical and partial
  result claims were checked against Keller, the Kraus source study, Smale,
  Wang, Bass–Connell–Wright, Drużkowski, Moh, and the cited 2022 plane-bound
  preprint. Tao's 2026-07-21 mathematical digestion supports the still-open
  \(n=2\) scope.
- The public announcement credits Fable 5; prompts, transcripts, steering,
  autonomy evidence, and division of labour are not public. The pack therefore
  reports the attribution but makes no stronger discovery-process claim.
- Current pool: **23 authored packs**, **6 SAT-certificate packs**, and
  **16 auditor-role packs**. The existing 22 were re-audited under the
  Feynman-register and register-fidelity protocol; the evidence ledger is
  [`REGISTER-AUDIT.md`](REGISTER-AUDIT.md).
