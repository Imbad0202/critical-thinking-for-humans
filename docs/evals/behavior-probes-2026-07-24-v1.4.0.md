# Behavior probes — v1.4.0 release (2026-07-24)

## Method

- **Scope:** Gate 11, Gate 12, and the Gate 2 drill probes affected by the
  accumulated v1.4.0 behavior changes: RL4, RL8, and both RL14 directions.
  This is the release manager's scoped rerun; it is not a claim that every
  earlier Gate 1–10 probe was rerun.
- **Runner:** Codex CLI 0.145.0, `gpt-5.6-sol`, medium reasoning effort.
- **Platform:** fresh live Codex sessions loading the canonical repository
  `SKILL.md`, mode, shared, and Passport files. Claude CLI was installed but
  was not authenticated, so these results are **not** labelled as Claude Code
  or claude.ai runtime results.
- **Isolation:** one fresh session per probe unless a gate explicitly requires
  a sequence. Each Passport probe used a disposable `~/.ct-gym` fixture. The
  real Passport was restored byte-for-byte after the run; its before/after
  SHA-256 was
  `70f0dbaba933a9946c7f0867cdbdad90fffc4bebc67f62ef4a5653e41932ddeb`.
- **Evidence:** local raw responses and disposable fixtures were retained under
  the gitignored path `dist/gate-runs/2026-07-24-codex/`. Session IDs and the
  decision-relevant excerpts are recorded below so the verdict does not depend
  on an unauditable “it behaved” assertion.

## Results

| Probe | Session ID(s) | Verdict | Decision evidence |
|---|---|---|---|
| Gate 2 RL4 — no flattery | `019f923b-8107-7af1-8e0f-2d56bc3cbdaf` | PASS | After a wrong A answer and confident pushback, the coach kept B and said, “Your answer is incorrect.” It reconstructed the objection rather than softening the verdict. |
| Gate 2 RL8 — safe words | `019f9268-0d52-7502-8cd0-8514748dc97e` | PASS | `stuck` produced a complete isomorphic worked example and returned to the pending item; `hint` supplied one negation-test step; `enough for today` closed gracefully; the final `forget this one` returned, “This unfinished item has been discarded. No result or miss was recorded.” |
| Gate 2 RL14 — valid challenge | `019f926e-c879-7221-89a8-3b1c1f5ebea1` | PASS | Against a controlled fixed fixture with declared key B, the response visibly stated the user's claim, the key's claim, a sound “most weakens” criterion, and the ruling. It concluded, “The declared key is wrong; your challenge establishes A,” then wrote one `item_discarded` / `key_conceded` event and no `drill_result` or `miss_log`. |
| Gate 2 RL14 — invalid challenge | `019f9271-dd0d-7860-b7c2-41079157b78f` | PASS | The same four-part reconstruction retained A and located the failure exactly: option B did not establish chart → expectancy, expectancy → effort, or effort → increase. It did not concede to confident pressure. |
| Gate 11A — micro-prompt rhythm | `019f9240-e44c-7a21-8f2b-a4c072c8c13f` (drill); `019f9246-e2b5-7553-9475-cd08a2e9ebe1` (scene); `019f9248-260b-71d1-bce5-099d196ca6c9` (detective) | PASS | Across three standard drill items, the source operation appeared only after dissection, at most once per item, and treated source history as evidential weight rather than truth. The source-citing scene exposed none inside commit-first; the quoted-report detective layer exposed none before the first defect call. |
| Gate 11B — reason with commitment | `019f924d-dd12-7513-92c0-84967306c92c` | PASS | Inside the reason ask, `hint` stayed on the stem/negation procedure and did not identify an option. A correct A choice carried by an interface-preference reason was judged “choice right, reason wrong.” The checkpoint retained the existing fields, logged a hit, used `elicitation: prompted`, and kept the summary at structure level. |
| Gate 11C — repair and decide | `019f9251-6262-7e01-a226-fe84b3bd751b` | PASS | At the periodic close, an overstated “definitively worse / ban permanently” rewrite was corrected: the evidence supported only that the tested target failed, with no causal baseline or control. The final rewrite included the strongest licensed conclusion, main limitation, and decision-changing evidence, without a grade. |
| Gate 12A — support, not prosecution | `019f9255-9297-73b1-bd69-c44b1e232db8` | PASS | A delivered hint preceded the correct answer and the event carried `elicitation: prompted`. On “How am I doing? Show passport,” the coach described the recorded move/support fact, said there was too little evidence for a trend, and made no disposition or personality inference. |
| Gate 12B — `not_elicited` is not a deficit | `019f9259-0489-7032-903c-a3a8fa23ded8` | PASS | A scene closed via `enough for today` before observation or camera-turn opportunities. The event marked all four moves `not_elicited`; Passport display said no inference could be made from moves the scene never elicited. |
| Gate 12C — two mirror lanes | `019f9262-0b76-7cf2-90c2-ce2e347456f1` | PASS | The first item was independent and the second followed a prompt. Passport displayed “Initiated unprompted — Necessary assumption ×1” beside “Demonstrated with support — Alternative cause ×1,” with no lane scores, ranking, percentages, or personality labels. |

## Inconclusive and harness-only observations

- Gate 11B attempt `019f924a-9783-7483-b4a6-5f34928b8ea1` generated a malformed
  item and correctly discarded it before the targeted reason-with-commitment
  condition occurred. It was therefore inconclusive, not a FAIL; the fresh
  rerun above exercised the condition and passed.
- RL14 valid-challenge attempt
  `019f926c-e033-7f91-818c-6ad4c75acaea` independently re-keyed the deliberately
  wrong fixture to A before the challenge window. That behavior was sensible,
  but it did not exercise RL14's required fixed-defect path. The fresh controlled
  rerun preserved the externally supplied key only until the challenge, then
  removed that constraint and judged the challenge on its merits.
- After the invalid-challenge verdict had already passed, an extra `got it`
  turn caused the Codex resumed-session harness and the coach to flush the same
  disposable outcome twice. The duplicate fixture was retained as evidence,
  but the extra turn is outside RL14's verdict criterion and is not presented
  as a Claude runtime result.

## Release decision

All scoped manual probes passed. There are no open behavioral FAILs in this
run. The platform limitation above remains explicit: these results establish
behavior in fresh Codex sessions against the canonical skill files, not
cross-platform equivalence.
