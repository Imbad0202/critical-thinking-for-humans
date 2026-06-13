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

## Phase 2 — scale-out

Once katago-adversarial has stabilised the pack template (second instance),
the remaining ROADMAP packs become a known work-list. At that point a Workflow
pipeline is justified — one agent per source: read first-party → draft pack →
pass check_pack_schema.py → human (maintainer) converges and re-verifies every
numeric claim against the source. First-party verification strength stays the
gate: a workflow draft is a draft, not a verified pack, until the numbers are
re-checked against the original.
