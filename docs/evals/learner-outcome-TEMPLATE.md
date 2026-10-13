# Learner Outcome — TEMPLATE (protocol 4, no run yet)

Copy to `learner-outcome-<date>-<cohort>.md` and fill. See `README.md`
protocol 4. Every other protocol in this directory measures the **coach** —
whether keys are stable, correct, or upheld in live sessions. This one measures
the **learner**: whether practising with the skill changes how a person reasons
on material the practice never showed them. A model may not stand in for a
participant, and a model may not score free responses.

Until a result file for this protocol exists, the README makes no claim that the
skill improves reasoning or transfers, and a filled template that fails its own
design constraints below does not license one either.

## Design constraints (non-negotiable)

These answer three known weaknesses of critical-thinking outcome research. A
run that breaks any of them reports descriptively only.

1. **No content overlap.** Probe items share no stem, scenario, institution,
   number set, or wording with anything a participant practised. A pre/post
   gain on overlapping content can reflect a learned item format rather than
   reasoning. Probes are frozen before the practice period and never enter a
   practice session.
2. **Delay.** At least one probe runs two or more weeks (four preferred) after
   the last practice session, with no practice in between. Immediate posttests
   miss delayed effects and overstate fragile ones.
3. **Distance, measured, not assumed.** Near and far probes are separated along
   named context dimensions (knowledge domain, functional context, and whether
   the task announces that reasoning is being tested), so a result says which
   kind of transfer it speaks to. A same-domain gain is near-transfer evidence
   only.

## Method

- **Cohort:** _N; recruitment route; inclusion criteria; consent procedure_
- **Arms:** _practice vs comparison (e.g. reads the structure table only, or no
  practice). With no comparison arm, every result is descriptive._
- **Assignment:** _random / self-selected (state which; self-selection limits
  every claim)_
- **Practice period and dose:** _weeks; target sessions; the dose actually
  delivered comes from the opt-in Passport export, not from self-report_
- **Practice domains:** _each participant's registered `profile_set.domain`
  values, recorded before probe forms are assigned_
- **Model and host used for practice:** _exact model ID and host; the result
  speaks to that configuration only_
- **Probe bank authorship and keying:** _who wrote the probe items. Probe keys
  must pass a human validity anchor (protocol 1b) before use: an outcome
  measure scored against an unchecked key inherits the key's errors._
- **Scorer(s):** _human; blinded to arm and timepoint; second scorer for
  inter-rater agreement on free responses_
- **Pre-registration:** _where the analysis plan below was frozen, and when_

## Probe types

Each form contains every type. Parallel forms (A/B/C) are counterbalanced
across timepoints so no participant sees a probe twice.

| Type | Structure | Domain | Announced as a reasoning task? | Response | What it isolates |
|------|-----------|--------|--------------------------------|----------|------------------|
| P-near | practised | the participant's practice domain | yes | multiple choice | near transfer |
| P-far-domain | practised | a domain the participant never practised | yes | multiple choice | knowledge-domain distance |
| P-recognize | practised | unpractised | **no** — embedded in an everyday decision (a message to answer, a purchase, a forwarded claim) with an open prompt such as "anything you'd check before deciding?" | free response, scored for whether the structure's concern is raised unprompted | unprompted recognition, kept apart from application: P-far-domain announces the task and P-recognize does not, so the gap between them shows which step fails in this tool (van Peppen et al. 2022 found recognition and recall prompts did not help, pointing to application) |
| P-untrained | **never** practised | unpractised | yes | multiple choice | test familiarity and retest gain, the baseline for the rows above |
| P-sound | none — the argument holds | unpractised | yes | multiple choice incl. "no offered objection bites" | over-flagging: a practice effect that only makes people cry "flaw" is not improvement |

## Timepoints

| Point | When | Forms |
|-------|------|-------|
| T0 | before the first practice session | _A/B/C_ |
| T1 | within 3 days after the last practice session | _A/B/C_ |
| T2 | ≥ 2 weeks (4 preferred) after T1, no practice between | _A/B/C_ |

## Analysis plan (frozen before T0)

- Per probe type and arm: change T0→T1 and T0→T2.
- The comparison of interest is the practice arm's change **minus** the
  comparison arm's change, per probe type. P-untrained sets the retest floor.
- P-recognize is scored on a rubric fixed before T0: the structure's concern
  raised unprompted / raised only as a generic "I'd check more" / not raised.
  A generic checklist line is not a hit.
- P-sound is reported beside every gain; a rise in P-near with a fall in
  P-sound is reported as a shift toward flagging, not as improvement.
- Report effect sizes with intervals. With a small cohort, say so and make no
  significance claim the sample cannot carry.

## Privacy and consent

- Participation, the Passport export, and every probe response are opt-in, and
  a participant may withdraw and have their records deleted at any time.
- The Passport export carries structure-level fields only (`drill_result`,
  `detective_process`, `scene_process` minus `summary`); no `commitment.position`
  text, no raw user text, and no sensitive-BYOM session (redline 12 and
  `passport/SCHEMA.md` Privacy Rules apply unchanged).
- Probe free responses are de-identified before scoring.

## What a run may and may not claim

- It MAY report: per-probe-type change for this cohort, model, host, and dose,
  with every item-level result attached; scorer agreement; dropout.
- It MAY NOT claim: that the skill improves reasoning in general; far transfer
  from a P-near or P-far-domain gain alone; anything about a model or host the
  run did not use; any effect without the comparison arm's numbers beside it; a
  headline percentage without the failing items attached.

## Results

| Probe type | Arm | T0 | T1 | T2 | Δ T0→T1 | Δ T0→T2 |
|------------|-----|----|----|----|---------|---------|
| P-near | practice | _ | _ | _ | _ | _ |
| P-near | comparison | _ | _ | _ | _ | _ |
| P-far-domain | practice | _ | _ | _ | _ | _ |
| P-far-domain | comparison | _ | _ | _ | _ | _ |
| P-recognize | practice | _ | _ | _ | _ | _ |
| P-recognize | comparison | _ | _ | _ | _ | _ |
| P-untrained | practice | _ | _ | _ | _ | _ |
| P-untrained | comparison | _ | _ | _ | _ | _ |
| P-sound | practice | _ | _ | _ | _ | _ |
| P-sound | comparison | _ | _ | _ | _ | _ |

- **Dose delivered (from Passport export):** _sessions; items per structure;
  domains practised_
- **Dropout by arm and timepoint:** _n_
- **Inter-rater agreement on P-recognize:** _statistic, n_

## Item-level results (the finding — do not average away)

> Reproduce every probe item with its per-arm, per-timepoint result. Items
> where the practice arm fell, and P-recognize responses the scorers disagreed
> on, are reported in full.

## Notes / deviations from the frozen plan
