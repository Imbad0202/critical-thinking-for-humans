# Canonical Reasoning Structures

This file is the shared muscle list for critical-thinking-for-humans. Drill mode teaches
these IDs; scene mode re-invokes them by name. That vocabulary reunion is the
transfer mechanism: the same label applied under the commit-gate pressure of a
drill reappears when the user steps back and reads a live scenario.

Canonical IDs are snake_case English and never localized; the display layer translates them into the user's language. User-facing text — item-type announcements, pre-teaches, dissections, frame discussions — uses a stable plain-language label in the user's language; raw snake_case IDs appear only in passport events, never as display vocabulary.

---

## Reasoning Structures

The thirteen loggable structure IDs — every `drill_result.structure` value comes
from this table, with one exception: `manipulation_spot` items log technique
IDs from `shared/manipulation-taxonomy.md`. The first seven are causal-inductive;
three (`base_rate_neglect`, `regression_to_mean`, `simpson_paradox`) are
statistical-reasoning structures that assume basic numeracy — prefer them at
standard tier and above, not intro; the last three (`circular_reasoning`,
`hasty_generalization`, `weak_analogy`) are formal/inductive structures with no
numeracy gate, drillable at every tier.

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `necessary_assumption` | The unstated condition the argument depends on; if it is false, the evidence no longer supports the conclusion. | "What must be true for this evidence to carry that conclusion?" | Riverdale College raised tuition 15% and enrollment held steady, so demand for its programs is inelastic — assumes no offsetting scholarships were introduced. |
| `alternative_cause` | A THIRD, independent factor explains the outcome instead of the stated cause; the two stated variables may still be related, but something else is driving both. | "Could something else have produced this result?" | Greenbrook City's crime rate fell the year a new precinct opened — but a concurrent economic upturn may account for the drop. |
| `reverse_causation` | NO third factor needed — the two stated variables are genuinely related, but the causal arrow runs the other way: the outcome produced the supposed cause. | "Could the outcome have produced the supposed cause?" | Firms with high employee satisfaction also show high profits — but profitable firms may simply have more resources to invest in working conditions. |
| `coincidence_timing` | NO verified mechanism and direction unresolved — the two events merely co-occur or follow each other; nothing yet shows that either causes the other. | "Does the sequence prove mechanism, or just proximity?" | Northvale Hospital introduced a new triage protocol in March; patient wait times fell in April — but a reduction in emergency admissions began in February. |
| `sample_selection` | The sample excludes cases most able to refute the claim; survivorship is a common variant. | "Where are the dropouts, the non-participants, the failures?" | A survey of students who completed the Westmoor tutoring program found 90% improved their grades — students who dropped out were not included. |
| `proxy_mismatch` | The metric measured is not the outcome actually claimed; activity, satisfaction, or paperwork is dressed up as the real result. | "Is this measuring activity, satisfaction, or the thing actually claimed?" | Eastfield Foundation reports 400 mentoring sessions delivered as evidence of career advancement — sessions attended ≠ careers advanced. |
| `evidence_sufficiency` | Whether the evidence licenses ANY conclusion yet; the discipline of saying "cannot be determined." | "Does this evidence license any conclusion yet, or only that more data is needed?" | Two quarters of rising sales after a rebranding do not yet establish that the rebranding caused growth — no baseline trend, no control group. |
| `base_rate_neglect` | A conclusion drawn from a conditional or salient figure while ignoring the underlying prior / base rate; the numerator is read without its denominator. | "What is the base rate, and does the headline figure survive once it is included?" | A screening test flags 90% of a rare condition, so a positive result is treated as near-certain — but at a 0.1% base rate most positives are false alarms. |
| `regression_to_mean` | An extreme measurement is followed by a less extreme one, and the ordinary statistical return toward the average is misattributed to an intervention. | "Were the cases selected for being extreme, so a move toward average is expected with no cause at all?" | The worst-performing branches got a new training program and improved the next quarter — but branches picked for an extreme low tend to rebound regardless. |
| `simpson_paradox` | A trend that holds in aggregated data reverses (or vanishes) once the data is split by a lurking subgroup variable; the merged numbers mislead. | "Does the aggregate trend survive when the data is broken out by the relevant subgroup?" | A hospital shows higher overall survival than a rival, but once cases are split by severity the rival does better in every severity tier — the mix of cases drove the aggregate. |
| `circular_reasoning` | A premise covertly presupposes the conclusion; the argument travels in a circle, treating what it must prove as already given. This is the premise being the conclusion restated — distinct from `necessary_assumption` (an external unstated condition the argument needs) and from the `premise_restatement` distractor (which paraphrases stated evidence, not the conclusion). | "Can this premise be stated or verified without already knowing the conclusion?" | "Brightline Tutoring is the most trusted name in test prep because more families trust it than any other service." — the premise (more families trust it) is the conclusion (most trusted) restated. |
| `hasty_generalization` | There is data, but the sample is too small or too narrow to support the leap to the population. Upstream of this sits `evidence_sufficiency` (no conclusion is licensed at all — no baseline, no control); here a direction is established, but the sample is simply too small to reach the population. Unlike `sample_selection` (which systematically excludes refuting cases), this sample is just too small or too narrow, with no systematic exclusion implied. | "Is this sample large and broad enough to stand in for the whole population the conclusion is about?" | "Three of my neighbours switched to the new commuter rail and loved it, so the line will be popular across the whole metro region." — three neighbours cannot represent a metro region. |
| `weak_analogy` | The drill-loggable twin of the `fallacy_false_analogy` lens: the two cases differ on the load-bearing property the conclusion rests on, so the transferred inference does not carry. Distinct from `irrelevant_comparison` (a distractor pattern that compares mismatched referents) — here the analogy is the argument's own engine, and the flaw is the named disanalogy on the property that matters. | "Does the analogy hold on the property the conclusion actually needs, or only on surface features?" | "A city budget is like a household budget, so a city running a deficit is as reckless as a family maxing out its credit cards." — a household cannot issue currency or bonds against future tax revenue; the analogy breaks on exactly the property (sovereign fiscal capacity) the conclusion rests on. |

**Contrast pair (hasty vs sufficiency)** — the two collapse in generation unless the stem is tightly built, so item generators anchor on this contrast, not boundary prose alone:

- `hasty_generalization` (a measured direction exists, the only flaw is the leap to a population): "Our four pilot stores raised prices 5% and all four kept their foot traffic, so the chain can raise prices nationwide without losing customers." — four stores measured one direction; the flaw is projecting to the whole chain.
- `evidence_sufficiency` (no direction is even established yet): "Two of our stores raised prices 5% last month; foot traffic this month is about the same as the chain average, so price has no effect on traffic." — no baseline, no control, no before/after for those two stores; nothing is established to project from.

A drill stem must land cleanly on one side. **Forbidden:** any stem where both "sample too small" and "cannot determine" are simultaneously defensible — if a generated stem reads as both, regenerate (do not patch), per the drill pipeline's step-g reverse-solve check (modes/drill.md).

**Contrast pair (weak analogy vs sound analogy attacked on an irrelevant difference)** — the generation trap for `weak_analogy` is the mirror of the hasty/sufficiency one: a stem must not let "the cases differ, so the analogy fails" pass when the difference is irrelevant to the conclusion.

- `weak_analogy` (the cases genuinely differ on the load-bearing property): "A vaccine trial is like a coin-flip experiment, so a run of ten healthy vaccinated people proves the vaccine works." — the load-bearing property (an independent, known base rate of the outcome) is exactly what a coin flip has and an uncontrolled vaccine observation lacks; the analogy breaks where the conclusion rests.
- a SOUND analogy attacked only on an irrelevant difference (NOT the fallacy): "This drug trial should use a control group, just as the earlier hypertension trial did." — objecting "but that trial studied a different disease" attacks a surface difference; the control-group logic transfers regardless of disease, so the analogy holds. A stem built to key `weak_analogy` must not accidentally be this — if the only available attack is an irrelevant difference, the argument is sound and the item is mis-keyed (regenerate, do not patch).

---

## Technique

`negation_test` is a procedure, not a loggable structure — it tests whether a
`necessary_assumption` candidate is truly necessary, and never appears as a
`drill_result.structure` value.

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `negation_test` | The technique for testing necessity: precisely negate the candidate assumption (all→not all, some→none, must→not necessarily), put it back into the argument, and see whether the argument collapses. | "Does negating this candidate sink the argument, or does the argument survive?" | Negate "participants did not already have stronger résumés" → if they did, the placement-rate argument collapses; the assumption was necessary. |

---

## Distractor Menu

These are the eight wrong-answer patterns used to build drill items.

| ID | What makes it tempting |
|----|----------------------|
| `out_of_scope` | Topical, touches the same domain, but never engages the conclusion's key terms — feels relevant because the subject matches (fails on TOPICAL relevance: right domain, wrong question). |
| `true_but_irrelevant` | Plausibly or certainly true, but has no bearing on the evidential gap — sounds like a reasonable fact (fails on LOGICAL relevance: right question, wrong connection). |
| `premise_restatement` | Repeats or paraphrases given evidence; adds nothing new — feels like confirmation because the information is already familiar. |
| `opposite_180` | Pushes in the reverse of the direction the question asks for — catches users who misread "strengthen" as "weaken" or vice versa. |
| `reverses_logic` | Treats "A supports B" as "B supports A" — the same terms appear but the inferential direction is flipped. |
| `too_extreme` | Uses always / only / never — goes further than the argument needs and is therefore not required for the conclusion to hold. |
| `irrelevant_comparison` | Compares the wrong groups, time periods, or tasks — looks like a parallel case but the referent is mismatched. |
| `weak_proxy_trap` | An option offering an activity count or satisfaction score that sounds like outcome evidence; it exploits `proxy_mismatch` confusion by answering the wrong question convincingly — tempting because the metric is real, just not the one that matters. |

---

## Frame Palette

Scene mode must cycle through all six frames across each scene.

| ID | Lens |
|----|------|
| `frame_power` | Who holds power, who speaks, who is silent, whose account shapes the official record. |
| `frame_institution` | What rules, roles, and structures produce this scene independent of any individual's intent. |
| `frame_incentive` | What incentives — financial, reputational, relational — shape the behavior on display. |
| `frame_charitable` | The most benign coherent reading of everyone's conduct; good faith until evidence rules it out. |
| `frame_info_limits` | What this scene cannot tell us; what would need to be known before any stronger claim is warranted. |
| `frame_counter` | The reverse reading: is this even bias? can a sample of one show a structure? what defeats the primary interpretation? |

---

## Fallacy-Recognition Lenses

Scene's **fallacy-recognition track** (modes/scene.md) uses these nine lenses,
and the nine are the complete ruling surface — a fallacy named outside them is
declined or redirected, never improvised (modes/scene.md, Off-list fallacy
names).
They are NOT frames — frames are interpretive and never ranked (redline 1);
fallacy lenses adjudicate the *form* of an argument and DO return a ruling
(`fallacy` / `not_fallacy` / `insufficient_context`). Each lens carries a
**reverse-guard**: the legitimate move it must NOT mislabel as the fallacy.
Lens IDs are not loggable structure IDs — they never appear in `drill_result.structure`; the fallacy track logs them in `scene_process.fallacies_examined`.

| Lens ID | Detects | Reverse-guard (must NOT mislabel) |
|---------|---------|-----------------------------------|
| `fallacy_false_dilemma` | The argument assumes only A or B, hiding a real third option. Also a `false_dilemma` manipulation technique (shared/manipulation-taxonomy.md). | Some situations genuinely have only two options — not every binary is a false dilemma. |
| `fallacy_ad_hominem` | Attacks the arguer's character or identity instead of the argument — the person-level fact is offered as a substitute for rebuttal, not as evidence of bias (which would be a fair challenge; see strawman for distorting the argument itself). | A conflict-of-interest challenge is NOT ad hominem ONLY when it supports a limited conclusion — possible bias, lack of independence, a need for corroboration. The SAME conflict becomes circumstantial ad hominem (a fallacy) the moment it is used, by itself, to dismiss the claim or testimony as false, worthless, or not credible: a conflict bears on evidential weight, never on truth value alone. (Equally, challenging a documented pattern of systematic error is NOT ad hominem.) |
| `fallacy_strawman` | Distorts the opponent's argument, then attacks the distortion. | Accurately restating an opponent's weak argument is NOT a strawman. |
| `fallacy_appeal` | Appeals to an irrelevant authority, to emotion, or to the crowd. | Appealing to a relevant expert on their own subject is NOT a fallacy; first-hand emotional testimony is NOT an appeal to emotion; an empirical consensus among domain experts is NOT an appeal to the crowd. |
| `fallacy_equivocation` | The same term is swapped between two meanings across the argument. | A word shifting sense naturally across contexts is NOT equivocation; the swap must occur within one inferential chain. |
| `fallacy_false_analogy` | Transfers a conclusion from one case to another on a similarity the conclusion does not actually depend on — the two cases differ on the load-bearing property, so the inference does not carry. | An analogy that DOES share the load-bearing property despite surface differences is NOT false; an analogy offered illustratively with acknowledged limits is NOT the fallacy; surface dissimilarity alone never makes an analogy false. |
| `fallacy_whataboutism` | Deflects a charge by pointing at the accuser's (or a third party's) own sin instead of answering it — the original charge is left standing, only relocated. Not an attack on the arguer's credibility (that is `fallacy_ad_hominem`) and it does not distort the original charge (that is `fallacy_strawman`); it concedes the charge and drowns it in a counter-charge. Also a `whataboutism` manipulation technique (shared/manipulation-taxonomy.md). | Pointing out a genuine double standard or inconsistency is NOT whataboutism when it is offered as a fair challenge to the *principle* the accuser invoked (if you assert this rule, your own breach of it is on the table), rather than as a substitute for answering the original charge; a tu-quoque that actually bears on the accuser's standing to make the specific claim is a live consideration, not automatically the fallacy. |
| `fallacy_slippery_slope` | Asserts that a first step will inexorably lead, through a chain of intermediate steps, to an unacceptable end — while giving no reason each link in the chain actually follows. The defect is the *unsupported* inevitability: the chain does the argumentative work but its steps are asserted, not earned. | A chained or consequentialist argument whose links ARE supported (each step given an empirical or logical reason it follows) is NOT a slippery slope — sometimes a first step really does make the next one likely, and naming a genuine causal chain is legitimate. Uncertainty at one link lowers the argument's force without making it the fallacy; only unsupported *inevitability* is the defect. |
| `fallacy_genetic` | Judges a claim true or false by its ORIGIN — where the idea came from, its history, its source's motive — rather than its content. "It started as wartime propaganda, so it's false"; "the theory came from a discredited figure, so ignore it." Distinct from `fallacy_ad_hominem`, which attacks the person making the argument NOW; the genetic fallacy attacks the belief's pedigree, and the source may be historical, institutional, or non-personal. | Tracing a claim to its source is NOT the fallacy when the source bears on evidential WEIGHT rather than truth — a study from a lab with a documented fabrication record warrants more scrutiny, and a claim resting solely on one authority's say-so is fairly challenged by questioning that authority. The line is the same as ad_hominem's: origin can lower credibility or shift the burden of proof, never settle truth by itself. |

---

## Metrics Note

Drill records hit/miss per structure ID — that is how the gym tracks which muscles
are undertrained. Scene records which frames were exercised each round — process
metrics, no grading.
