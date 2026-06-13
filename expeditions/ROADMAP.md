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
verified / beyond-single-human / first-party-checkable) + dual-use. PASSes
below; rejected candidates and why are recorded so the search is not repeated.
None authored yet — each is still a first-party verification session.

Ranked by transfer value (domain spread away from SAT-math + provenance
cleanliness + accessibility):

| candidate | domain | source | verification | role | note |
|-----------|--------|--------|--------------|------|------|
| busy-beaver-5 | computability | arXiv:2509.12337 (2024) | Coq-verified; 181M machines enumerated; BB(5)=47,176,870 | climber | top pick — new domain, cleanest provenance, first BB value ever formally verified |
| alphaproof-imo-2024 | formal math / ML | Nature s41586-025-09833-y | Lean machine-checked; public proof mirror | auditor | read a Lean proof you could not write; strongest ML-math provenance |
| lams-problem | design theory | arXiv:2012.04715 (2020) | ~1 TB DRAT nonexistence certificate, third-party checkable | auditor | audit a NEGATIVE result (no projective plane of order 10); replaces unverifiable 1989 search |
| chromatic-number-plane-5 | geometry / graph coloring | arXiv:1804.02385 (2018) | 1581-vertex unit-distance graph, non-4-colourability SAT-verifiable | forecaster | amateur-discovered; parent problem (CNP) STILL OPEN — frame as "is this the answer?" (it isn't) |
| ramsey-4-5-hol4 | Ramsey / graph theory | arXiv:2404.01761, ITP 2024 | HOL4 kernel-verified; re-proves unverified 1995 R(4,5)=25 | auditor | "why re-prove a known result" lesson |
| alphageometry-imo | geometry / ML | Nature s41586-023-06747-5 (2024) | DDAR symbolic engine + human experts; 25/30 IMO-shortlist | auditor | human-readable proofs; partly redundant with alphaproof |
| pentago-solved | games | arXiv:1404.0743 (2014) | strong solution by parallel retrograde analysis; open-source artifact | climber | games-domain spread; fully reproducible |
| schur-number-5 | combinatorics / SAT | arXiv:1711.08076, AAAI 2018 | 2 PB DRAT→LRAT, ACL2-verified checker | auditor | clean but SAT-family-adjacent to BPT/Keller — author only for completeness |

**Recommended next quartet (four domains, four verification styles):**
busy-beaver-5 (Coq / computability), alphaproof-imo-2024 (Lean / formal-ML),
lams-problem (DRAT / design theory), chromatic-number-plane-5 (SAT-graph /
geometry).

### Borderline — author only with the contestation built in

- **funsearch-cap-set** (Nature s41586-023-06924-6, 2023): the size-512 dim-8
  construction is trivially checkable, but it improves a *lower bound* on an
  OPEN problem. Pack must audit the construction, never imply the cap-set
  problem is solved. Forecaster role.
- **alphaevolve-48-mult** (arXiv:2506.13242, 2025): the 4×4 non-commutative
  48-multiplication result is rational-checkable, but Waksman (1970) already did
  46 over commutative rings, so the "beats Strassen" framing is contested. Only
  author if the pack teaches the contestation itself — pedagogically rich but
  messy.

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
