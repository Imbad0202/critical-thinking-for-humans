# Canonical Reasoning Structures

This file is the shared muscle list for critical-thinking-for-humans. Drill mode teaches
these IDs; scene mode re-invokes them by name. That vocabulary reunion is the
transfer mechanism: the same label applied under the commit-gate pressure of a
drill reappears when the user steps back and reads a live scenario.

Canonical IDs are snake_case English and never localized; the display layer translates them into the user's language. User-facing text — item-type announcements, pre-teaches, dissections, frame discussions — uses a stable plain-language label in the user's language; raw snake_case IDs appear only in passport events, never as display vocabulary.

---

## Reasoning Structures

The fourteen loggable structure IDs — every `drill_result.structure` value comes
from this table, with one exception: `manipulation_spot` items log technique
IDs from `shared/manipulation-taxonomy.md`. The first seven are causal-inductive;
three (`base_rate_neglect`, `regression_to_mean`, `simpson_paradox`) are
statistical-reasoning structures that assume basic numeracy — prefer them at
standard tier and above, not intro; the next three (`circular_reasoning`,
`hasty_generalization`, `weak_analogy`) are formal/inductive structures with no
numeracy gate, drillable at every tier; `source_credibility` is the one
source-evaluation structure: 7 causal-inductive + 3 statistical + 3
formal/inductive + 1 source-evaluation.

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `necessary_assumption` | The unstated condition the argument depends on; if it is false, the evidence no longer supports the conclusion. | "What must be true for this evidence to carry that conclusion?" | A task takes 12 hours now; automation takes 7 hours plus new review time, with other work unchanged. To reduce total hours, review must take less than 5 hours. |
| `alternative_cause` | A THIRD factor could produce the outcome, weakening attribution to the stated cause. It may affect the outcome alone or both variables, and may coexist with the proposed cause. | "Could something else have produced this result?" | Greenbrook City's crime rate fell the year a new precinct opened — but a concurrent economic upturn may account for the drop. |
| `reverse_causation` | NO third factor needed — the outcome could produce the supposed cause, so the observed relationship does not establish the claimed direction. Both directions may operate; a reverse pathway alone does not rule out a forward effect. | "Could the outcome have produced the supposed cause?" | Firms with high employee satisfaction also show high profits — but profitable firms may simply have more resources to invest in working conditions. |
| `coincidence_timing` | NO verified mechanism and direction unresolved — the two events merely co-occur or follow each other; nothing yet shows that either causes the other. | "Does the sequence prove mechanism, or just proximity?" | Northvale Hospital introduced a new triage protocol in March; patient wait times fell in April — but a reduction in emergency admissions began in February. |
| `sample_selection` | The argument generalizes beyond what the sample's documented inclusion or retention rule supports. Survivorship and outcome-based selection are variants; selection alone does not identify omitted outcomes or the direction or size of bias. | "Who was included or excluded, by what rule, and what is known about the omitted outcomes?" | A survey of Westmoor tutoring completers found 90% improved; dropouts were omitted and their outcomes are unknown. The completers' result alone does not establish the result for all entrants. |
| `proxy_mismatch` | The metric measured is not the outcome actually claimed; activity, satisfaction, or paperwork is dressed up as the real result. | "Is this measuring activity, satisfaction, or the thing actually claimed?" | Eastfield Foundation reports 400 mentoring sessions delivered as evidence of career advancement — sessions attended ≠ careers advanced. |
| `evidence_sufficiency` | Whether the evidence licenses the live conclusion; distinguish what cannot be determined from the more limited facts the evidence does establish. | "Does this evidence license the claimed inference, and what can still be said if it does not?" | Two quarters of rising sales after a rebranding establish that sales rose, but do not establish that rebranding caused the growth — no baseline trend, no control group. |
| `base_rate_neglect` | A conclusion drawn from a conditional or salient figure while ignoring the underlying prior / base rate; the numerator is read without its denominator. | "What is the base rate, and does the headline figure survive once it is included?" | A screening test has 90% sensitivity and a 5% false-positive rate. A positive result is treated as near-certain evidence of the condition — but at a 0.1% prevalence most positives are false alarms. |
| `regression_to_mean` | Improvement after selection on an extreme noisy measurement is attributed to an intervention, although the supported repeat-measurement model predicts less extreme results without it. | "Does the stated repeat-measurement model support an expected rebound for this selected group?" | Every branch has true performance 80; each quarterly score adds an independent error of +8 or -8 with equal probability. Branches selected at 72 have expected next score 80 without training; a post-training rebound alone cannot identify the training effect. |
| `simpson_paradox` | A trend that holds in aggregated data reverses (or vanishes) once the data is split by a lurking subgroup variable; the merged numbers mislead. | "Does the aggregate trend survive when the data is broken out by the relevant subgroup?" | A hospital shows higher overall survival than a rival, but once cases are split by severity the rival does better in every severity tier — the mix of cases drove the aggregate. |
| `circular_reasoning` | A premise covertly presupposes the conclusion; the argument travels in a circle, treating what it must prove as already given. This is the premise being the conclusion restated — distinct from `necessary_assumption` (an external unstated condition the argument needs) and from the `premise_restatement` distractor (which paraphrases stated evidence, not the conclusion). | "Can this premise be stated or verified without already knowing the conclusion?" | "Brightline Tutoring is the most trusted name in test prep because more families trust it than any other service." — the premise (more families trust it) is the conclusion (most trusted) restated. |
| `hasty_generalization` | There is data, but the sample is too small or too narrow to support the leap to the population. Unlike an `evidence_sufficiency` item where the claimed relationship is not established even for the observed cases, here a direction is established in the sample but its wider reach is unsupported. Unlike `sample_selection` (which identifies an inclusion or retention rule), no systematic exclusion is implied. | "Is this sample large and broad enough to stand in for the whole population the conclusion is about?" | "Three of my neighbours switched to the new commuter rail and loved it, so the line will be popular across the whole metro region." — three neighbours cannot represent a metro region. |
| `weak_analogy` | The drill-loggable twin of the `fallacy_false_analogy` lens: the two cases differ on the load-bearing property the conclusion rests on, so the transferred inference does not carry. Distinct from `irrelevant_comparison` (a distractor pattern that compares mismatched referents) — here the analogy is the argument's own engine, and the flaw is the named disanalogy on the property that matters. | "Does the analogy hold on the property the conclusion actually needs, or only on surface features?" | "A spelling checker is like a fact checker: if it finds no misspelled words, the document's claims must be true." — spelling correctness and factual accuracy test different properties; checking one does not establish the other. |
| `source_credibility` | How much evidential weight a source or observation report warrants from credibility-relevant features: first-hand vs relayed, primary vs secondary, documented interests or error history, genuinely independent corroboration, observation or record quality, and relevant limits. It never licenses "true" or "false" from origin alone; unknown funding, motives, independence, credentials, or records stay unknown. | "Given what is documented about how this report was produced and corroborated, how much weight does it warrant — and what conclusion survives that adjustment?" | Five articles repeat a safety figure, but all cite the same vendor press release and none checks the underlying record. The publication count is one relayed source, not five independent lines; its weight is limited, though that alone does not make the figure false. |

**Evidence discipline (generation, explanations, and corrections).** Answer
the live claim with its criterion, the decisive evidence or counterexample,
and the warranted ruling; end once the requested claims are settled. Separate
stated facts, justified consequences, and what remains undetermined before
writing the proof. Mark any additional assumption as conditional. For missing
information, say "not supplied here"; a categorical absence needs an explicit
fact or a proof of absence. An unreported action is not an action known not to
have happened. Required item dissections still cover every option; they do not
need additional causal stories, estimates, or replacement rules.
Merely weakening the evidence for a conclusion does not by itself establish
its negation or a zero effect; state the loss of support without claiming more
than the proof shows.
For an aggregate change, separate the contribution of a cause from the total
observed change. A positive total can coexist with a negative contribution when
other contributions offset it; the total's sign alone does not identify each
component's sign. Short duration or a small number of events does not bound
impact without the relevant weights and magnitudes. When rejecting a weak
option, state what its facts fail to establish rather than inventing the sign
or size of its effect. Any illustrative decomposition must be explicitly
conditional, use the same outcome and denominator, and preserve the observed
total; it is a compatible possibility, not an estimate of actual contributions.
State an information gap as the relationship still unidentified, not a checklist
of every absent measurement. Before calling an input necessary, check whether
another sound design could identify that relationship without it; inputs needed
by one route are not universally required. For example, random assignment to
treatment and control with comparable post-treatment outcome measurement for the
assigned groups can support causal inference without any pre-period measurement.

Keep metric definitions as supplied, including selection criteria. Do not fill
an unspecified qualifying event, threshold, or counting unit from a familiar
metric name. If alternative operational rules fit the material but change the
proposed inference, keep that rule unknown and retain the supplied measure.
A performance rating is not automatically output volume; hours and durations
are not automatically units produced. A more relevant proxy is not a direct outcome
measure merely by contrast with a weaker proxy. Before presenting a comparison
as a direct outcome comparison, verify that its evidence measures the stated
outcome or makes it comparable through an explicitly supported conversion.
Without a supported bridge, report the observed indicators, their evidential
bearing and remaining uncertainty; do not invent equivalence between measures
or definite unobserved outcomes.

Keep each quantity tied to its units, denominator, cohort, and observation
window. Preserve paired comparisons of the same units; changes in another
group's membership cannot explain that paired change. When restating a count,
retain what it counts: members per group do not state the number of groups or
periods. Preserve the aggregation
level through arithmetic: subtracting a common per-member offset from a mean
produces an adjusted mean; it does not establish that every member has that
value. Distinguish an absolute level from a change, and an unknown outcome from
a known failure. Reconcile
which exclusions a count already reflects before combining or subtracting
counts. Derive bounds over all admissible unknown outcomes, not one assumed
completion. Unspecified counts and shares remain unquantified, including
qualitative claims about their magnitude; adding "likely" does not supply
missing evidence. Preserve supported bounds without appending a favored
location within them unless a distribution, prior or other supplied evidence
supports that likelihood. A known selection rule does not reveal the missing
cases' outcomes or reasons for leaving.
Keep group composition among events, P(group | event), distinct from
risk within a group, P(event | group). A group's large share of events alone
does not establish its higher event rate. Use the population at risk or relevant
exposure as the rate's denominator. Supplied joint counts, relative base rates
or bounds may support conversion or comparison without absolute group counts;
derive what they allow. For example, P(event | group) =
P(group | event) * P(event) / P(group) when these conditional probabilities are
defined and P(group) > 0. Otherwise retain the composition statement and leave unsupported
risk rankings unknown.
Keep when an inclusion rule was specified separate from the information used
to determine membership. A rule fixed in advance can still classify members
by later behavior or outcomes. Advance specification alone does not repair
outcome-based selection; outcome-based membership alone does not show that
the rule was devised afterward. Keep unspecified rule timing unknown.
An inclusion or status label licenses an outcome or probability ranking only
when its stated definition or a supplied relationship supports that ranking.
Resignation, dropout, or a performance-plan label may identify who was omitted
without identifying a different outcome such as engagement. Without that bridge,
state selection risk or a conditional compatible pattern, not a favored ranking
of missing outcomes. A plausible story about why members have the label is not
that bridge.
A required or mandatory procedure states an obligation, not observed compliance
or complete coverage. Keep its actual response/completion rate unknown unless
the material supplies that coverage or an operational definition and evidence
that entail it. For an obligation-to-category inference, distinguish the
obligation, the observed behavior, and the group's operational definition,
including any threshold and time window. Compliance with an unspecified or
weaker obligation does not establish crossing that category boundary. State
membership or group overlap only when the supplied facts entail it. Behavior
plus the definition, or a requirement together with compliance sufficient to
meet that definition, are possible supporting routes, not exhaustive evidence
requirements. Otherwise keep membership unknown and describe a possible
selection route conditionally. Do not import an unchosen option's added facts
to complete the chosen option's proof.
Reconstruct the groups and quantifiers before carrying a fact across them.
A property reported for one group does not by itself establish its absence in
another, even when the groups are logical complements. An association observed
for one ranked subgroup does not by itself establish the ordering of another;
"not high" is not necessarily "low," and top and bottom quartiles are not
logical complements. Different entity identities do not by themselves establish
differences in the properties the inference depends on. If relevant comparability
is not supplied or entailed, call it unestablished rather than inventing a
specific difference.
A predominant approval pattern is not an exclusive eligibility rule: "mainly
approves X" remains compatible with non-X approvals; it does not establish their
exclusion. Preserve that qualifier when explaining or summarizing selection. A
stated intention records what someone reports planning, not a guaranteed outcome.
An unchanged measure in another group does not by itself rule out a common
shock: exposure, response or offsetting changes may differ. Reporting treatment
in one group does not establish another group's treatment status.
Matching calendar periods aligns their position in the year; it does not alone
establish equal seasonal exposure, patterns or effects across years.
A smaller or absent net change in a prior matched period likewise does not by
itself rule out a seasonal contribution now: apply the component/total
distinction above to historical changes too. Retain the history's comparative
relevance, but do not treat its net change as a bound on the current seasonal
contribution without a supported cross-period relationship.

Observed outcomes must be ascertainable by the reporting date. First fix the
outcome definition, its window and each member's horizon; then apply these
branches in order:

- If the horizon has been reached, classify success or failure from the known
  facts about that defined window, not from status at a later reporting date.
  Missing relevant history remains unknown. For retention to a fixed tenure horizon,
  employment through that horizon is success even if departure occurs later.
- If the horizon has not been reached, an outcome is settled only when supplied
  facts already make it final under its definition. A known failure
  can settle an outcome early if the outcome definition makes that failure final;
  a still-at-risk participant with shorter follow-up remains unresolved.
  A qualifying early departure can settle retention failure; continued employment
  before the required horizon cannot settle retention success.

Later events cannot change a correctly established outcome for that window;
later discovery or correction of facts within the window can change the record.
An estimate from incomplete follow-up needs its method and assumptions. Neither
invent completed follow-up nor require it for an already settled outcome.
A cutoff for completing full follow-up does not bound everyone whose outcome
is ascertainable: qualifying early failures can occur outside that cutoff.
Keep these populations separate in summaries and records. Reaching the horizon
alone does not supply missing individual outcome history.
A last possible follow-up date is not necessarily the earliest date all outcomes
could settle. Missing exact counts may still permit bounds; an explicitly
unresolved member already rules out every cohort member being settled.

**Regression limits.** Extreme selection alone does not establish a rebound:
repeat measurements must have a supported noise/dependence model. The independent-
error worked model below is a sufficient special case, not a necessary condition;
correlated errors can also yield a less extreme conditional expectation. Historical
rebound documents change, not its mechanism; it does not identify measurement
noise or establish expected regression for the current group. A historical
average is neither that group's known untreated outcome nor a bound on it.
Subtracting it from observed change does not identify or bound an effect.
For a causal difference, use matched quantities: effect tau = treated outcome T
minus untreated outcome U, for the same group, horizon and units. With T known,
tau <= b is equivalent to U >= T - b: an effect upper bound needs an untreated
lower bound, not an untreated upper bound. If U is only known to lie in [L, H],
then tau lies in [T - H, T - L]; this bounds the effect without identifying one
value. Changes from the same baseline obey the same relation, but a gain is
not a final outcome level. An interval restriction need not establish exact
equality between the historical average and this group's untreated outcome.
Keep a separately stipulated model's conclusions conditional on that model.
Preserve the quantity's kind as well as its model condition: if the model gives
E[U | information] = m, carry that expectation through the conclusion and record,
not U = m. Even a model that applies exactly can allow realized U different from
m. If an effect estimate is requested, T - m can be labeled a model-based estimate;
the expectation alone does not identify the realized effect T - U or a
guaranteed bound.
An expectation is not a realized value, a range of possible values, or a
probability: judge compatibility from the model's permitted outcomes, and
rarity only from an adequate distribution and sampling/selection specification.
Never invent which individual was "unlucky." Do not infer that every member
has the aggregate mean's sign without a premise that establishes it: errors
of -2, 4, and 4 average +2 while one error is negative.
For a requested conditional expectation, give the conditioning and decisive
derivation. Do not append claims about selected observations' error signs,
realized changes or rarity unless the question requires them and the supplied
model separately supports them.

**Worked model:** every true score is 80; each test adds an independent error
of +8 or −8 with equal probability. A group selected by first-test scores has
an expected second mean of 80. Conditional on an observed first mean of 72,
its expected gain is 8; realized second scores and gains still vary. Fixed
true scores do not remove fresh measurement variation or preclude a rebound.
A correlated counterpart has true scores 80, first errors +8 or -8 equally
likely, and second errors retaining the first sign with probability 0.75 and
flipping it with probability 0.25. Both error marginals remain mean-zero with
the same variance, but they are dependent. A first score of 72 has expected
second score 0.75 * 72 + 0.25 * 88 = 76: regression without independent errors.

**Contrast pair (hasty vs sufficiency)** — the two collapse in generation unless the stem is tightly built, so item generators anchor on this contrast, not boundary prose alone:

- `hasty_generalization` (a measured direction exists, the only flaw is the leap to a population): "Our four pilot stores raised prices 5% and all four kept their foot traffic, so the chain can raise prices nationwide without losing customers." — four stores measured one direction; the flaw is projecting to the whole chain.
- `evidence_sufficiency` (no direction is even established yet): "Two of our stores raised prices 5% last month; foot traffic this month is about the same as the chain average, so price has no effect on traffic." — no baseline, no control, no before/after for those two stores; nothing is established to project from.

A drill stem must land cleanly on one side. **Forbidden:** any stem where both "sample too small" and "cannot determine" are simultaneously defensible — if a generated stem reads as both, regenerate (do not patch), per the drill pipeline's step-g reverse-solve check (modes/drill.md).

**Contrast pair (weak analogy vs sound analogy attacked on an irrelevant difference)** — the generation trap for `weak_analogy` is the mirror of the hasty/sufficiency one: a stem must not let "the cases differ, so the analogy fails" pass when the difference is irrelevant to the conclusion.

- `weak_analogy` (the cases genuinely differ on the load-bearing property): "A vaccine trial is like a coin-flip experiment, so a run of ten healthy vaccinated people proves the vaccine works." — the load-bearing property (an independent, known base rate of the outcome) is exactly what a coin flip has and an uncontrolled vaccine observation lacks; the analogy breaks where the conclusion rests.
- a SOUND analogy attacked only on an irrelevant difference (NOT the fallacy): "This drug trial should use a control group, just as the earlier hypertension trial did." — objecting "but that trial studied a different disease" attacks a surface difference; the control-group logic transfers regardless of disease, so the analogy holds. A stem built to key `weak_analogy` must not accidentally be this — if the only available attack is an irrelevant difference, the argument is sound and the item is mis-keyed (regenerate, do not patch).

**Contrast pair (defeated premise vs unestablished premise)** — the boundary
that keeps a defective-framing key (modes/drill.md) unique against
`evidence_sufficiency`:

- a DEFEATED premise (the defective-framing key): "Which vendor caused the
  cost overrun?" when the material shows the March figures were restated
  against a changed baseline and spend is flat under the original one — the
  material affirmatively defeats the premise that an overrun exists, so
  challenging the question is the key.
- a merely UNESTABLISHED premise (ordinary `sufficiency`, "cannot be
  determined"): "Which vendor caused the cost overrun?" when the material
  offers one quarter of spend with no baseline — nothing shows an overrun
  exists, but nothing defeats it either; the flaw is missing evidence, not a
  false framing.

A stem must land cleanly on one side. **Forbidden:** any stem where both "the
question rests on a defeated premise" and "cannot be determined" are
simultaneously defensible — if a generated stem reads as both, regenerate (do
not patch), per the drill pipeline's step-g'' audit (modes/drill.md).

**Source-credibility boundaries** — source evaluation is about the documented
basis and warranted WEIGHT of testimony or a report, not a shortcut from origin
to truth:

- `source_credibility` vs `evidence_sufficiency`: key the former only when a
  source's provenance, relay distance, interests, corroboration, observation
  quality, record quality, or limits are the designed issue. Generic missing
  baseline, control, comparison, or enough support to license the live conclusion
  stays `evidence_sufficiency`.
- `source_credibility` vs `sample_selection`: who entered or was excluded from
  the sample stays a sampling defect, even when a sponsor funded the study.
- `source_credibility` vs `frame_incentive`: an incentive may guide inquiry, but
  only a documented credibility-relevant fact changes evidential weight. Never
  guess a motive from role or identity.
- `source_credibility` vs `authority_abuse` / `fallacy_appeal`: borrowed, fake,
  irrelevant, or cross-domain authority doing the persuading belongs to the
  applicable manipulation technique or fallacy lens. Ordinary source-basis
  evaluation belongs here; do not build an item on which both are defensible
  keys.
- `source_credibility` vs `fallacy_ad_hominem` / `fallacy_genetic`: a documented
  conflict, relay, or error record may lower weight or call for corroboration.
  It never, by itself, proves the claim false or makes a person globally
  untrustworthy; that truth-by-person or truth-by-origin move triggers the
  reverse-guards instead.

**Sound interested-source counterexample:** a manufacturer funds a study, but
the protocol and data are public, the outcome measure is independently audited,
and unaffiliated teams reproduce the result. The interest is documented and
relevant to scrutiny, yet it does not erase the converging evidence. An item
whose only objection is "the funder benefits" is sound against
`source_credibility`; preserve this case in sound-item audits rather than
manufacturing a flaw from interest alone.

---

## Technique

`negation_test` is a procedure, not a loggable structure — it tests whether a
`necessary_assumption` candidate is truly necessary, and never appears as a
`drill_result.structure` value.

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `negation_test` | Precisely negate the candidate (all→not all, some→none, must→not necessarily), then check whether the same premises can still support the inference. A surviving inference disproves necessity; one unfavorable example under the negation does not prove necessity. | "Can this candidate be false while the inference still has support, rather than its conclusion merely happening to be true?" | Negate "review takes less than 5 hours" in the task above: 7 hours plus at least 5 cannot reduce the old 12-hour total. The negated condition defeats this inference. |

Derive the required relation before choosing a candidate. In the task above,
`7 + review < 12` gives the exact condition `review < 5`. The stronger condition
`review <= 2` is not necessary: review of 4 hours still supports a reduced
total of 11. For a quantitative comparison, establish its units and relation,
solve the threshold, then test boundary cases before verbalizing an option.

For causal necessity, match T (the treated outcome) and U (the same group's
untreated outcome). A claim of any decrease requires U > T; any increase
requires U < T. This differs from attributing the entire gap between T and a
comparison value C to treatment. Equality with C, or no initial advantage
relative to C, can be stronger than the directional threshold. Under the
candidate's precise negation, test any admissible U between T and C: a smaller
supported effect can survive despite some baseline difference. Such a value
is a conditional counterexample, not supplied outcome data.

Comparability need not mean identical measurement definitions: a known
calibration, or a changed window that makes the claimed improvement harder to
show, may preserve the inference. Test that possibility before keying literal
identity of endpoints as a necessary assumption. Apply the same test to every
"must," "only," or replacement necessary condition in an explanation, not just
the proposed key. State a sufficient condition as sufficient; after refuting
necessity, stop at the decisive counterexample unless a further claim is asked.
"Conclusion implies condition" is the necessary-condition direction, not its
reversal. Whether asserting that relation fills the missing bridge is a separate
question: a relation already entailed by the premises adds no missing fact.

---

## Source-Credibility Operations

Three cross-mode operations, modeled on `negation_test`: procedures for applying
`source_credibility`, not loggable structures —
none of these IDs ever appears in any passport event or tally field
(not `drill_result.structure`, not `detective_process.structures_hit`, not a
passport-block tally entry).
The loggable result of a keyed source-evaluation item or layer is
`source_credibility`; `clarify`, `check_basis`, and `license_conclusion` describe
how the judgment is reached and may also surface as micro-prompts when another
structure is targeted. The ruling of `check_basis` is always about evidential WEIGHT, never truth by origin — the same line the
`fallacy_ad_hominem` and `fallacy_genetic` reverse-guards draw. The operations
examine sources; they never teach how to construct a deceptive one
(redline 13).

An identified source does not guarantee correct counts or interpretation.
Treat a synthetic number as stipulated evidence when appropriate; do not claim
that its known source, form, or platform proves its accuracy.

| ID | Definition | Counter-question | Example |
|----|-----------|-----------------|---------|
| `clarify` | Before judging anything, state the live question, the claim made, the evidence offered, and the inferential gap between them. | "What exactly is claimed, on what evidence, and what has to bridge the two?" | A post says "research proves daily coffee extends life." Clarified: the question is whether coffee lengthens lifespan; the claim is causal; the evidence is one unnamed study; the bridge is the word "proves." |
| `check_basis` | Identify what the evidence IS — first-hand or relayed, primary or secondary — and its credibility-relevant features: conflict of interest, corroboration by an independent line, the reporter's documented incentive (declared funding, role, stated interest — evidence on the record, never a guessed motive; unknown stays unknown), and its limits. | "Who produced this, who paid for it, how many hands did it pass through, and what independent line could corroborate it?" | The "study" turns out to be a coffee trade association's press release summarizing its own unpublished survey — funded by the beneficiary, secondhand, uncorroborated. Weight: low. Verdict "false": not licensed by that alone. |
| `license_conclusion` | State the strongest conclusion the evidence actually warrants, the main uncertainty, and what new information would change it. | "What is the most this evidence licenses — and what would make me revise it?" | The most it licenses: an industry-funded survey reports an association. What would change it: replication by a team with no stake, with the method public. |

Surfacing rhythm: rotating micro-prompts inside existing mode flows — the
dissection in drill, facilitation in scene, the per-layer loop in detective —
one question where the material invites it, never a worksheet on every turn.

---

## Distractor Menu

These are the nine wrong-answer patterns used to build drill items.

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
| `premise_challenge_trap` | Rejects the question's premise as defective when the material actually establishes it — tempting because refusing the question feels like the sophisticated move. The reverse-guard pattern for defective-framing items (modes/drill.md); choosing it is the over-flagging miss. |

---

## Frame Palette

Scene mode must cycle through all six frames across each scene (frame-palette
rounds; the fallacy-recognition and configure tracks are separate submodes —
modes/scene.md).

| ID | Lens |
|----|------|
| `frame_power` | Which voices and authority relations the excerpt represents, and what it establishes about whose account carries influence. Representation in the text is distinct from actual attendance, participation, or identity; where those are unestablished, the lens identifies that evidence limit. |
| `frame_institution` | Which stated rules and roles constrain the available actions, and what remains unknown about their effects or origin. |
| `frame_incentive` | What incentives — financial, reputational, relational — shape the behavior on display. |
| `frame_charitable` | The most benign coherent reading of everyone's conduct; good faith until evidence rules it out. |
| `frame_info_limits` | What this scene cannot tell us; what would need to be known before any stronger claim is warranted. |
| `frame_counter` | The reverse reading: is this even bias? can a sample of one show a structure? what defeats the primary interpretation? |

---

## Fallacy-Recognition Lenses

Scene's **fallacy-recognition track** (modes/scene.md) uses these twelve lenses,
and the twelve are the complete ruling surface — a fallacy named outside them is
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
| `fallacy_equivocation` | The same term is swapped between two meanings across the argument. | A word shifting sense naturally across contexts is NOT equivocation; the swap must occur within one inferential chain. Distinct from `fallacy_no_true_scotsman`, which narrows one sense of a term after a counterexample, and `fallacy_motte_and_bailey`, which transfers a defense between two propositions of unequal strength and need not change a term's meaning. |
| `fallacy_false_analogy` | Transfers a conclusion from one case to another on a similarity the conclusion does not actually depend on — the two cases differ on the load-bearing property, so the inference does not carry. | An analogy that DOES share the load-bearing property despite surface differences is NOT false; an analogy offered illustratively with acknowledged limits is NOT the fallacy; surface dissimilarity alone never makes an analogy false. |
| `fallacy_whataboutism` | Deflects a charge by pointing at the accuser's (or a third party's) own sin instead of answering it — the original charge is left standing, only relocated. Not an attack on the arguer's credibility (that is `fallacy_ad_hominem`) and it does not distort the original charge (that is `fallacy_strawman`); it concedes the charge and drowns it in a counter-charge. Also a `whataboutism` manipulation technique (shared/manipulation-taxonomy.md). | Pointing out a genuine double standard or inconsistency is NOT whataboutism when it is offered as a fair challenge to the *principle* the accuser invoked (if you assert this rule, your own breach of it is on the table), rather than as a substitute for answering the original charge; a tu-quoque that actually bears on the accuser's standing to make the specific claim is a live consideration, not automatically the fallacy. |
| `fallacy_slippery_slope` | Asserts that a first step will inexorably lead, through a chain of intermediate steps, to an unacceptable end — while giving no reason each link in the chain actually follows. The defect is the *unsupported* inevitability: the chain does the argumentative work but its steps are asserted, not earned. | A chained or consequentialist argument whose links ARE supported (each step given an empirical or logical reason it follows) is NOT a slippery slope — sometimes a first step really does make the next one likely, and naming a genuine causal chain is legitimate. Uncertainty at one link lowers the argument's force without making it the fallacy; only unsupported *inevitability* is the defect. |
| `fallacy_genetic` | Judges a claim true or false by its ORIGIN — where the idea came from, its history, its source's motive — rather than its content. "It started as wartime propaganda, so it's false"; "the theory came from a discredited figure, so ignore it." Distinct from `fallacy_ad_hominem`, which attacks the person making the argument NOW; the genetic fallacy attacks the belief's pedigree, and the source may be historical, institutional, or non-personal. | Tracing a claim to its source is NOT the fallacy when the source bears on evidential WEIGHT rather than truth — a study from a lab with a documented fabrication record warrants more scrutiny, and a claim resting solely on one authority's say-so is fairly challenged by questioning that authority. The line is the same as ad_hominem's: origin can lower credibility or shift the burden of proof, never settle truth by itself. |
| `fallacy_no_true_scotsman` | Meets a counterexample to a general claim by redefining the claim's subject *after the fact* to exclude the counterexample — "no Scotsman does that" → "no *true* Scotsman does that" — so the claim is rescued by making it unfalsifiable. The qualifier ("true", "real", "genuine") does no independent work; it is added only to expel the case that would refute the claim. Distinct from `fallacy_equivocation`, which alternates two *standing* senses of a term within one inferential chain; here one sense is narrowed post-hoc to rescue a claim. Distinct from `fallacy_motte_and_bailey`, which need not redefine a category and requires a stronger claim to remain in play after only a narrower claim is defended. | A restriction that was ALREADY part of the claim's definition is NOT the fallacy — "a vegetarian doesn't eat meat" excludes a meat-eater by definition, not by post-hoc rescue. The fallacy needs three things: a general claim, a genuine counterexample, and a qualifier introduced *in response* to it with no independent justification. Tightening a genuinely vague term for a principled reason (not merely to dodge the case) is legitimate. |
| `fallacy_motte_and_bailey` | Transfers a defense from a narrower, easier-to-defend claim to a stronger claim the passage still relies on: the stronger claim is advanced, challenge draws a defense of only the narrower one, and the stronger claim or its conclusion is then preserved or reasserted as though that defense covered it. The defect is fallback substitution between two propositions, not the mere presence of broad and narrow formulations. A term shift alone is `fallacy_equivocation`; a post-hoc category restriction that replaces the original scope is `fallacy_no_true_scotsman`; and a stronger claim supplied only by a critic is a possible `fallacy_strawman`, not this lens. More than one lens applies only if each complete defect is independently present. | Explicitly narrowing or withdrawing the stronger claim is NOT motte-and-bailey when its stronger conclusion is abandoned, materially weakened so it no longer asserts or depends on that claim, or supported by an independently adequate new bridge rather than by the fallback. A synonymous rewording is not a material revision. Withdrawing the claim while retaining its stronger conclusion without an independently adequate new bridge, and relying on the narrower claim instead, still meets the test. The reverse-guard also stops applying if the passage later reasserts the stronger claim or resumes its stronger conclusion without such a bridge; do not demand proof about an unobserved future. Return `insufficient_context` only when the passage presents a possible stronger/narrower fallback but leaves ownership or continued reliance unresolved. Complete material that shows no such fallback defect, including material that shows only a different lens's defect, is `not_fallacy` under this lens. Never infer motive. Require the same speaker or author, or text that explicitly attributes both claims to one accountable advocate; a shared group label alone is not enough. |
| `fallacy_gamblers_fallacy` | Treats a recent streak or imbalance as, by itself, making the recently repeated or overrepresented outcome less likely, or one or more underrepresented or contrary outcomes more likely, on the next trial or a specified future block, so the sequence will locally "even out," although the supported generator model gives no compensating dependence. The defect is an unsupported history-induced probability shift attributed to due-ness, balance, or equivalent local compensation, not merely observing that a streak was unlikely or making an unrelated arithmetic or calibration error. Unsupported positive-recency continuation in a known independent, unchanged process may raise a distinct hot-hand question; positive recency supported by parameter learning or real dependence need not be erroneous, and neither case is this lens. | A reversal forecast is NOT this fallacy when the available material supplies a probability-changing bridge — sampling without replacement or depletion, a fixed quota or anti-repeat rule, documented negative dependence or feedback, a probability-relevant state change, or evidence that updates an unknown generator parameter — and the resulting conditional probability changes in the claimed direction and supports the forecast's strength. A named mechanism is not a blanket reverse-guard: if it supports the direction but the speaker overstates the magnitude, the excess is gambler's fallacy only when local-compensation reasoning supplies it. A misread rule, arithmetic mistake, or calibration error without that bridge remains wrong but is `not_fallacy` under this lens; correct the fact without endorsing the whole argument. Correct regression-to-the-mean reasoning with imperfectly correlated repeat measurements and fresh mean-zero noise around stable latent values predicts a less extreme conditional expectation, not an opposite result that repays a run. In a known independent process with an unchanged outcome distribution, a whole-sequence probability assessed before the sequence, a future-block probability unchanged by the observed run, and long-run convergence by dilution are also not the fallacy. Require text that uses the history as support. A contrary bet or action alone leaves the probability belief unresolved: return `insufficient_context`, never infer the belief. Use `insufficient_context` for a possible compensation inference only when a missing generator rule, replacement condition, parameter fact, horizon, state, or actor reason could change the active-lens ruling; complete material that settles the test is `fallacy` or `not_fallacy` even if irrelevant details are absent. |

---

## Metrics Note

Drill records hit/miss per structure ID — that is how the gym tracks which muscles
are undertrained. Scene's frame and fallacy rounds record which frames or
lenses were exercised — process
metrics, no grading; scene's configure track is the bounded exception, whose
keyed reveal logs per-structure misses (modes/scene.md, Configure Track).
