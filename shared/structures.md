# Canonical Reasoning Structures

This file is the shared muscle list for critical-thinking-gym. Drill mode teaches
these IDs; scene mode re-invokes them by name. That vocabulary reunion is the
transfer mechanism: the same label applied under pressure in a timed drill reappears
when the user steps back and reads a live scenario.

Canonical IDs are snake_case English and never localized; the display layer translates them into the user's language.

---

## Reasoning Structures

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `necessary_assumption` | The unstated condition the argument depends on; if it is false, the evidence no longer supports the conclusion. | "What must be true for this evidence to carry that conclusion?" | Riverdale College raised tuition 15% and enrollment held steady, so demand for its programs is inelastic — assumes no offsetting scholarships were introduced. |
| `negation_test` | The technique for testing necessity: precisely negate the candidate assumption (all→not all, some→none, must→not necessarily), put it back into the argument, and see whether the argument collapses. | "Does negating this candidate sink the argument, or does the argument survive?" | Negate "participants did not already have stronger résumés" → if they did, the placement-rate argument collapses; the assumption was necessary. |
| `alternative_cause` | A THIRD, independent factor explains the outcome instead of the stated cause; the two stated variables may still be related, but something else is driving both. | "Could something else have produced this result?" | Greenbrook City's crime rate fell the year a new precinct opened — but a concurrent economic upturn may account for the drop. |
| `reverse_causation` | NO third factor needed — the two stated variables are genuinely related, but the causal arrow runs the other way: the outcome produced the supposed cause. | "Could the outcome have produced the supposed cause?" | Firms with high employee satisfaction also show high profits — but profitable firms may simply have more resources to invest in working conditions. |
| `coincidence_timing` | NO verified mechanism and direction unresolved — the two events merely co-occur or follow each other; nothing yet shows that either causes the other. | "Does the sequence prove mechanism, or just proximity?" | Northvale Hospital introduced a new triage protocol in March; patient wait times fell in April — but a reduction in emergency admissions began in February. |
| `sample_selection` | The sample excludes cases most able to refute the claim; survivorship is a common variant. | "Where are the dropouts, the non-participants, the failures?" | A survey of students who completed the Westmoor tutoring program found 90% improved their grades — students who dropped out were not included. |
| `proxy_mismatch` | The metric measured is not the outcome actually claimed; activity, satisfaction, or paperwork is dressed up as the real result. | "Is this measuring activity, satisfaction, or the thing actually claimed?" | Eastfield Foundation reports 400 mentoring sessions delivered as evidence of career advancement — sessions attended ≠ careers advanced. |
| `evidence_sufficiency` | Whether the evidence licenses ANY conclusion yet; the discipline of saying "cannot be determined." | "Does this evidence license any conclusion yet, or only that more data is needed?" | Two quarters of rising sales after a rebranding do not yet establish that the rebranding caused growth — no baseline trend, no control group. |

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

Scene mode must cycle through all six lenses every round.

| ID | Lens |
|----|------|
| `frame_power` | Who holds power, who speaks, who is silent, whose account shapes the official record. |
| `frame_institution` | What rules, roles, and structures produce this scene independent of any individual's intent. |
| `frame_incentive` | What incentives — financial, reputational, relational — shape the behavior on display. |
| `frame_charitable` | The most benign coherent reading of everyone's conduct; good faith until evidence rules it out. |
| `frame_info_limits` | What this scene cannot tell us; what would need to be known before any stronger claim is warranted. |
| `frame_counter` | The reverse reading: is this even bias? can a sample of one show a structure? what defeats the primary interpretation? |

---

## Metrics Note

Drill records hit/miss per structure ID — that is how the gym tracks which muscles
are undertrained. Scene records which frames were exercised each round — process
metrics, no grading.
