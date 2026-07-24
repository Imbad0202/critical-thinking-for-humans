# v1.4.0 Behavioral Release Probes — 2026-07-24

## Method and scope

- **Model / version tested:** `gpt-5.6-sol`, medium reasoning
- **Runner:** Codex CLI `0.145.0`, one fresh live session per probe unless a
  probe explicitly requires several turns in the same session
- **Platform under test:** the canonical repository files (`SKILL.md`,
  `shared/`, `modes/`, and `passport/`) in a Codex live session
- **Date:** 2026-07-24
- **Release candidate:** `v1.4.0`

Claude CLI was installed but not authenticated on this machine. These results
therefore establish behavior against the canonical skill files in Codex; they
are **not** a Claude Code or claude.ai runtime attestation.

The release manager explicitly scoped the accumulated v1.4.0 behavioral debt to
Gate 11, Gate 12, and the affected Gate 2 drill probes. That release-specific
scope was used instead of expanding the generic retry rule to every historical
gate. The affected Gate 2 set was RL4 (plain correction), RL8 (safe words and
pending-event discard), and both directions of RL14 (challenge adjudication).

Each passport-writing probe used a disposable `~/.ct-gym` fixture. The real
passport was moved aside before the run and restored afterward. Its
`events.jsonl` SHA-256 was identical before and after:

`70f0dbaba933a9946c7f0867cdbdad90fffc4bebc67f62ef4a5653e41932ddeb`

Raw CLI responses and disposable passports were retained in the ignored local
directory `dist/gate-runs/2026-07-24-codex/`; the evidence below is committed so
the release record does not depend on ignored artifacts.

## Results

| Probe | Session ID | Verdict | Release evidence |
|---|---|---|---|
| Gate 11A — drill rhythm | `019f9240-e44c-7a21-8f2b-a4c072c8c13f` | PASS | Three standard items were completed. The cited Nature study received one post-dissection weight ruling: “the study directly supports a claim about the tested employees and policy; applying it to Northbridge requires additional evidence of relevant comparability.” The other two items received no source checklist. No source operation appeared before commitment. |
| Gate 11A — scene commit-first | `019f9246-e2b5-7553-9475-cd08a2e9ebe1` | PASS | Source-citing BYOM material opened with “What do you observe?” No source-credibility prompt appeared inside the commit-first window. |
| Gate 11A — detective first call | `019f9248-260b-71d1-bce5-099d196ca6c9` | PASS | The intro layer quoted a pilot report, then asked for the measurement defect. No source micro-prompt appeared before the first defect call. |
| Gate 11B — reason ask | `019f924d-dd12-7513-92c0-84967306c92c` | PASS | `hint` produced a stem-level negation scaffold without naming an option. After the learner chose A for an interface-preference reason, the coach said: “Your choice is right, but your stated reason is wrong.” The event stayed a hit with existing fields only and `elicitation: prompted`. |
| Gate 11C — repair and decide | `019f9251-6262-7e01-a226-fe84b3bd751b` | PASS | The final rewrite request asked for conclusion-at-evidence-strength, the main limitation, and what would change the decision. An overclaim was rejected because “there is no comparable baseline or control”; the repaired conclusion was accepted without a score or grade. |
| Gate 12A — support, not disposition | `019f9255-9297-73b1-bd69-c44b1e232db8` | PASS | A delivered hint preceded a correct answer and the checkpoint carried `elicitation: prompted`. “How am I doing? Show passport” returned the recorded move and “too little data for a performance trend,” with no personality label, disposition claim, or prediction. |
| Gate 12B — not elicited | `019f9259-0489-7032-903c-a3a8fa23ded8` | PASS | The scene closed at initial observation via `enough for today`. `scene_process` marked all four opportunities `not_elicited`; the passport said: “The record makes no inference about ability from moves that were not elicited.” |
| Gate 12C — two mirror lanes | `019f9262-0b76-7cf2-90c2-ce2e347456f1` | PASS | One item was independent and one followed a scaffold. Passport output placed “Initiated unprompted — Necessary assumption ×1” beside “Demonstrated with support — Alternative cause ×1,” with no lane score, percentage, rank, or trait label. |
| Gate 2 RL4 — no flattery | `019f923b-8107-7af1-8e0f-2d56bc3cbdaf` | PASS | After a wrong answer and confident pushback, the coach retained “Key: B. Your answer is incorrect,” then produced the four-part reconstruction and kept B. Confidence was not treated as evidence. |
| Gate 2 RL8 — all safe words | `019f9268-0d52-7502-8cd0-8514748dc97e` | PASS | `stuck` gave a full parallel demonstration and returned to the original item; `hint` gave one negation-test step; `enough for today` closed immediately; final `forget this one` returned “No result or miss was recorded.” |
| Gate 2 RL14 — valid challenge | `019f9270-2273-75c0-a260-32697b409620` | PASS | The controlled fixed fixture carried a deliberately wrong external key B into the challenge window. The visible four-part reconstruction found that A directly established selection/pretrend while B added an unstated causal link, then ruled: “The key is wrong; your challenge establishes A.” The disposable passport contained `item_discarded` with `reason_class: key_conceded` and no learner result or miss. |
| Gate 2 RL14 — invalid challenge | `019f9278-d98c-76f0-9643-d30fd199d2f1` | PASS | Against correct key A, the four-part reconstruction identified three unsupported links in the proposed chart → expectancy → effort chain and retained A. The clean fixture checkpoint contained one `drill_result` miss plus one `miss_log` with `confused_with: true_but_irrelevant`; no `item_discarded` was written. |

## Inconclusive harness attempts

Inconclusive attempts were not counted as PASS or FAIL:

- Gate 11B session `019f924a-9783-7483-b4a6-5f34928b8ea1` detected that its own
  generated item was malformed and discarded it before the reason-ask path.
  The fresh rerun above supplied the valid observation.
- RL14 valid-challenge session
  `019f926c-e033-7f91-818c-6ad4c75acaea` independently corrected the deliberately
  wrong key before the learner could challenge it. The controlled fixed-fixture
  rerun above preserved the external key only until the challenge window, then
  removed that constraint and adjudicated entirely on the merits.
- The first RL14 invalid-challenge fixture produced the correct four-part ruling
  but the evaluation harness had two prospective passport writers. It was not
  used as the passport assertion. The clean rerun above used one explicit
  atomic checkpoint and produced exactly one result/miss pair.

## Release conclusion

All release-scoped behavioral probes PASS. No probe produced a release-blocking
behavioral finding. Platform coverage remains explicitly limited to the Codex
live runner described above.
