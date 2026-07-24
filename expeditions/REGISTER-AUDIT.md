# Expedition Register Audit — Feynman Register

Audit date: **2026-07-24**  
Baseline: commit `1f89ce9`, **22** live files discovered by the runtime
`pack_id` rule.

This is the human content audit that schema lint cannot perform. The lint checks
shape; this ledger records whether the language still carries the exact claim.

## Protocol

Every pack was tested against the four safeguards in
[`PACK-SCHEMA.md`](PACK-SCHEMA.md):

1. inventory the load-bearing terms, conditions, and qualifiers before editing;
2. add everyday anchors without replacing the precise terms;
3. require a domain-literate back-translation of the precise claim;
4. return every factual sentence changed by a rewrite to its cited primary
   source.

The baseline pass classified **12** packs as needing additive term anchors and
**10** as needing a structural rewrite. The 12 additive diffs preserve every
pre-existing nonblank line byte-for-byte; three also remove only a final blank
line. Their new anchors explain adjacent, already-sourced terms and introduce no
new result, number, date, or attribution. The 10 structural rewrites changed
factual prose and therefore received fresh primary-source checks.

## Pack-by-pack register

| pack | baseline class | load-bearing inventory kept reconstructable | remediation |
|---|---|---|---|
| `3d-euler-blowup` | restructure | axisymmetric Euler; bounded solid boundary; smooth finite-energy data; nearly self-similar blowup; 2D Boussinesq companion; certified error control; not general free-space Euler | scope card, certified-load-test metaphor and break, declared PDE/numerics black boxes |
| `alphaevolve-48-mult` | restructure | 4×4 object; scalar-multiplication score; recursion-compatible noncommutative lane; same-lane 49→48 over complex coefficients; separate rational 48 over rings with inverse 2; fixed tensor identity; upper bound ≠ optimality; count ≠ wall-clock | lane-labelled scoreboard, precise field/ring/tensor anchors, official artifact check, search black box |
| `alphafold-casp14` | additive | CASP hold-out; GDT_TS; z-score; Å/RMSD; pLDDT/PAE and calibration; homolog/PDB/reliability diagram; multimer/ensemble/dynamics scope | additive metric anchors and an explicit calibration-bridge break |
| `alphageometry-imo` | additive | learned proposer + symbolic checker; symbolic check ≠ Lean; checked readable proof ≠ reproducible search | scout/referee metaphor and break; synthetic-data/search black boxes |
| `alphaproof-imo-2024` | additive | Lean kernel and proof term; formal validity vs statement fidelity; timing and domain-coverage qualifiers | turnstile metaphor and break; syntax/search/kernel internals declared black boxes |
| `alphatensor-matmul` | restructure | matrix format × field; 4×4 over Z₂ 47 vs 49; standard \(T_{4,5,5}\) 76 vs 80; 5×5 over Z₂ 96→95 attributed to Kauers–Moosbauer; rank upper bound ≠ optimality; distinct source papers | source-labelled scoreboard, tensor/rank anchors, search black box |
| `boolean-pythagorean-triples` | additive | clause/formula; blocked-clause elimination; cube/CDCL; DRAT/drat-trim; encoding faithfulness outside the receipt | additive rule-card/case-box/receipt anchors and metaphor break |
| `busy-beaver-5` | restructure | exact 5-state/2-symbol model and initial tape; undefined transition and step convention; \(S\neq\Sigma\); 47,176,870; 181,385,789 TNF machines; five deciders; 13 holdouts; 2024 proof/2025 paper; \(S(6)\) remains unresolved and is not proved unprovable | exact scope card, tournament/referee metaphor and break, Coq/TNF/decider black boxes |
| `casp16-rna` | additive | TM-score; blind CASP assessment; template/template-free; automated vs human-plus-AI; unseen vs templated; coarse shape vs fine detail | sealed-answer exam metaphor and break; modelling/metric black boxes |
| `chromatic-number-plane-5` | additive | finite unit-distance graph; SAT/UNSAT; non-4-colourability proves only a lower bound; five-colour sufficiency remains open | lock/key metaphor and break; search/solver/coordinate black boxes |
| `connect-four-bdd-oracle` | additive | opening value vs strong solution; BDD shared Boolean representation; symbolic vs explicit search; exact algorithm vs implementation trust | folded-filing-cabinet metaphor and break; BDD internals black box |
| `erdos-728-gpt5` | restructure | preprint/not peer reviewed; preprint states two-sided infinitude; Lean `erdos_728` states one-sided `.Infinite`; Lean `erdos_728_fc` states two-sided `Exists`; zero `sorry` only for those stated theorems; three Lean axioms; narrow autonomy and qualified priority; process intervention | scope card, court-filing metaphor and break, formalization/search black boxes |
| `erdos-discrepancy` | restructure | all \(C\) and infinite-sequence quantifiers; homogeneous progressions; SAT covers \(C=2\); 1160 witness/1161 UNSAT; independently checked ~13 GB DRUP; finite-prefix compactness bridge; Tao's all-\(C\) and Hilbert-space scope | quantifier card, finite-tree metaphor and break, solver/compactness black boxes |
| `funsearch-cap-set` | additive | \((\mathbb Z/3\mathbb Z)^n\); finite \(c_8\) vs asymptotic capacity \(\gamma\); lower vs upper bound; separate constructions and attribution | floor/ceiling metaphor and break; search/derivation black boxes |
| `imandra-marabou-checker` | restructure | proved UNSAT-certificate checker; Marabou remains unverified; formal-query fidelity is separate; residual soundness theorem + Imandra logic and implementation; UNSAT branch and evaluated-size scope | checkout/receipt-scanner metaphor and break; encoding/tree/Imandra internals black boxes |
| `katago-adversarial` | additive | robustness; average vs worst case; adversarial policy; zero-shot transfer; tested-system scope | seam metaphor and break; network/training black boxes |
| `keller-dimension-7` | restructure | geometric conjecture true iff no required 128-clique; \(G_{7,3}\) is the proved lane, with stronger \(G_{7,4}\)/\(G_{7,6}\); \(G_{7,2}\) maxes at 124 and is not the target | orientation table, 128-member-team metaphor and break, reduction/encoding black boxes |
| `lams-problem` | restructure | 111×111 order-10 plane; exhaustive weight-15, weight-16, primitive-weight-19 split; three separate certificate projects + coding theorem; DRAT proves clauses, not reduction/encoding; A1/A2/A5 coverage | three-room map and break, explicit black boxes, step-by-step plain anchors |
| `pentago-solved` | additive | retrograde analysis; in-core computation; strong solution labels every reachable position; recurrence, symmetry, and state accounting | atlas metaphor and break; traversal/hardware black boxes |
| `ramsey-4-5-hol4` | restructure | explicit 24-vertex witness gives \(>24\); exhaustive no-case proof gives \(\le25\); degree set {8,10,12}; gluing and coverage; MiniSat proofs through HOL4; `nauty` witness permutations | two-lock/customs-receipt metaphor and break; reduction/generalization/isomorphism black boxes |
| `schur-number-5` | additive | \(S(5)=160\); 160 witness vs 161 impossibility; SAT/UNSAT; cube-and-conquer; DRAT; ACL2-verified checker | five-bucket metaphor and break; solver/execution black boxes |
| `serine-hydrolase-design` | additive | sub-Å backbone accuracy; kinetics; structure vs rate, turnover, and chemistry scope; advance design commitment vs experiment | blueprint/inspection metaphor and break; model/design internals black boxes |

## Primary-source return log for structural rewrites

The following were re-read for the changed factual sentences:

- **3d-euler-blowup:** [Part I preprint](https://arxiv.org/abs/2210.07191),
  [Part II preprint](https://arxiv.org/abs/2305.05660), the
  [peer-reviewed SIAM article](https://epubs.siam.org/doi/10.1137/23M1580395),
  and the authors' [public MATLAB code](https://jiajiechen94.github.io/codes).
  The code is a rerun path; its existence is not evidence that an independent
  rerun occurred.
- **alphaevolve-48-mult:** [AlphaEvolve](https://arxiv.org/abs/2506.13131),
  [Dumas–Pernet–Sedoglavic v6](https://arxiv.org/abs/2506.13242v6), and
  Google DeepMind's [official results repository](https://github.com/google-deepmind/alphaevolve_results).
  The repository publishes the rank-48 factors and exact tensor-reconstruction
  check, but not the AlphaEvolve search code. An unverified Waksman-46 detour
  and a third-party floating-point check were removed from the landing claim.
- **alphatensor-matmul:** the
  [Nature paper](https://www.nature.com/articles/s41586-022-05172-4),
  [Kauers–Moosbauer's 95-result paper](https://arxiv.org/abs/2210.04045),
  and the distinct [flip-graphs paper](https://arxiv.org/abs/2212.01175).
- **busy-beaver-5:** the
  [paper and metadata](https://arxiv.org/abs/2509.12337), its
  [HTML full text](https://arxiv.org/html/2509.12337v1), and the
  [Coq-BB5 v1.0.0 archive](https://doi.org/10.5281/zenodo.17061968), plus the
  [2024 proof announcement](https://discuss.bbchallenge.org/t/july-2nd-2024-we-have-proved-bb-5-47-176-870/237).
- **erdos-728-gpt5:** the
  [v5 preprint](https://arxiv.org/html/2601.07421v5), the
  [Lean artifact](https://raw.githubusercontent.com/plby/lean-proofs/refs/heads/main/src/v4.24.0/ErdosProblems/Erdos728b.lean),
  and [Erdős's 1975 paper](https://combinatorica.hu/~p_erdos/1975-27.pdf).
  A Tao page that would not render was not quoted or used to strengthen a
  claim.
- **erdos-discrepancy:** the
  [Konev–Lisitsa paper](https://arxiv.org/pdf/1402.2184) and
  [Tao's all-\(C\) proof](https://arxiv.org/abs/1509.05363).
- **imandra-marabou-checker:** the peer-reviewed
  [ITP 2025 paper](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ITP.2025.1).
- **keller-dimension-7:** the
  [preprint](https://arxiv.org/abs/1910.03740) and peer-reviewed
  [Journal of Automated Reasoning article](https://link.springer.com/article/10.1007/s10817-022-09623-5).
- **lams-problem:** the
  [primitive-weight-19 paper](https://arxiv.org/abs/2012.04715),
  [weight-15 companion](https://arxiv.org/abs/1911.04032), and
  [weight-16 companion](https://arxiv.org/abs/2001.11973). The neighbouring
  [oval paper](https://arxiv.org/abs/2001.11974) is separate and is not used as
  a substitute for the weight-16 certificate.
- **ramsey-4-5-hol4:** the peer-reviewed
  [ITP 2024 paper](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ITP.2024.16)
  and [full version](https://arxiv.org/abs/2404.01761).

## Back-translation and final state

Independent readers reconstructed the precise claims from the revised register
and checked that the metaphor breaks preserve the original scope. One
byte-preservation defect was found in five Boolean Pythagorean Triples target
headings; the exact original headings were restored before this audit closed.

The new `jacobian-conjecture-counterexample` pack was held outside
`expeditions/` until its separate source audit, exact SymPy rerun, schema check,
and domain-literate back-translation all passed with **0 P1 / 0 P2**. Its
algebraic result is kept separate from the public Fable 5 attribution and the
unpublished discovery process.

Final register result: **22/22 baseline packs pass the Feynman-register and
register-fidelity audit; 23/23 live packs pass structural schema lint.**
Independent source-fidelity and back-translation cross-review closed at
**0 P1 / 0 P2**.
