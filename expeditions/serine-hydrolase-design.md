# Expedition Pack: De Novo Serine Hydrolases (Forecaster)

`pack_id: serine-hydrolase-design`

In 2025 a Baker-lab team designed working enzymes from scratch — not by editing
a natural protein, but by placing a catalytic machine into a computer-invented
fold and asking whether the fold would materialize and the chemistry would fire.
Several did: multi-turnover ester-hydrolyzing enzymes whose crystal structures
match the design closely — the best of them to sub-ångström backbone accuracy,
others to a bit over an ångström. This is a *forecaster* pack,
not an auditor one. There is no proof chain to trace — a physical protein either
folds and turns over or it does not. The load-bearing question is *why trust a
design you cannot derive*, and the honest answer is that the design commits to a
prediction in advance and the crystal structures and kinetics are the blind
reveal. You forecast which claims survive that reveal — and, harder, you hold the
headlines ("sub-ångström," "rivals nature," "designed") to their exact scope
before the numbers come in.

## problem

**The summit.** Design an enzyme from scratch: invent an amino-acid sequence that
folds into a specific 3D shape *and* catalyzes a chosen chemical reaction with
genuine turnover — the catalyst is regenerated and processes many substrate
molecules, not consumed once. The target reaction here is ester hydrolysis, run
by a **serine hydrolase**: a family that breaks ester and related bonds using a
conserved catalytic triad (a serine, a histidine, an acid) plus an "oxyanion
hole" that stabilizes the reaction's fleeting high-energy intermediate. Nature's
serine hydrolases are ubiquitous and fast; building one *de novo* means getting
the fold, the precise triad geometry, and multi-step turnover all right at once,
with nothing copied from an existing enzyme's backbone.

**What happened.** Lauko, Baker et al. (*Science*, 2025) used a pipeline of
protein-design tools — a diffusion model that hallucinates backbones around a
specified catalytic site, a sequence designer, an ensemble structure predictor
used as an *in silico* filter, and a folding predictor — to generate serine
hydrolase candidates, then expressed the best in the lab. The reported results:
designs that fold as intended (six crystal structures solved), that hydrolyze an
ester substrate with **genuine multi-turnover catalysis**, with the best-designed
active sites matching the computational model to **sub-ångström** backbone
accuracy, and catalytic efficiency reaching into the **10^5 M⁻¹s⁻¹** range for the
best variant.

**The claims to forecast, not derive.** This is a *forecaster* exercise. You
cannot reconstruct why a given sequence folds — the design tools emit
coordinates and sequences, not a derivation you can audit line by line. The
load-bearing question is: *why would you trust a designed enzyme you cannot
derive?* The honest answer is prediction-then-reveal. The design **commits** to a
structure and a mechanism *before* any protein is made; the crystal structures
and the enzyme-kinetics assays are the blind test of that commitment. Trust
transfers through that prospective match — and only within the regime it was
demonstrated: a specific ester chemistry, best-case variants, modest turnover
counts.

**Accessibility note.** No enzymology needed to run the forecast. Hold four
ideas: a *fold* (the 3D shape a sequence collapses into), a *catalytic site* (a
small cluster of amino acids positioned to do chemistry), *turnover* (the
catalyst does its job and resets to do it again, many times), and *catalytic
efficiency* (how fast it works on dilute substrate, one number, higher = faster).
The skill trained is forecasting calibration: predicting in advance which of the
headline claims — "the fold will match," "it will really turn over," "it rivals
natural enzymes," "it was designed in one shot" — survive contact with the
crystal structures and the kinetics, and exactly where each quietly stops being
true.

## history

**How long open / who posed it.** Designing enzymes from scratch has been a named
goal since computational protein design became feasible in the 2000s. Early *de
novo* enzymes (Baker, Houk, Hilvert and others, ~2008 onward) could place a
catalytic site into a designed scaffold but were **orders of magnitude slower
than natural enzymes** and typically needed rounds of laboratory directed
evolution — random mutation and selection in the lab — to reach useful activity.
Serine hydrolases were a standing hard target because their catalysis is
*multi-step*: the enzyme first latches onto half the substrate (a half-finished
state chemists call the acyl-enzyme intermediate), then has to release it to
finish and reset — and a design that latches but never releases is stuck
half-done, not a real turnover catalyst. Reaching genuine
multi-turnover serine-hydrolase activity from a computer-invented backbone,
without lab evolution, is the milestone here.

- **Dead end — hand-crafted active sites in hand-crafted scaffolds.** Place a
  triad by human intuition into a chosen fold. Produced catalytically weak
  enzymes: the geometry was approximately right but not precise enough, and small
  errors in triad placement cost orders of magnitude in rate. Dead end because
  human geometric intuition cannot hit the sub-ångström tolerances catalysis
  demands.
- **Dead end — rescue by directed evolution.** Accept a weak designed starting
  point and evolve it in the lab to usable activity. It works, and it is still the
  field's workhorse, but it concedes the original point: if the *design* cannot
  produce activity and evolution supplies it, the computational method has not
  been shown to design catalysis — evolution has. The distinguishing claim of this
  work is genuine turnover *from the design itself*, before any lab evolution.
- **Dead end — trusting a folding prediction as a folded protein.** A structure
  predictor can score a designed sequence as confidently folded when the physical
  protein aggregates, misfolds, or folds to a different shape. Confidence is not
  a crystal structure. Dead end because *in silico* self-assessment is calibrated
  on natural sequences, and de novo designs sit off that distribution — which is
  exactly why the crystallography reveal, not the predictor's score, is the real
  test.
- **Dead end — reading "multi-step catalysis works" off a single-step assay.**
  Measuring that the enzyme forms the first intermediate does not show it
  completes the cycle and resets. A design can acylate and then stall, hydrolyzing
  nothing further — one turnover, not catalysis. Dead end because "it reacted
  once" and "it is a catalyst" are different claims, and only a multi-turnover
  measurement separates them.

## solution_provenance

**Where the verified solution lives.** Primary source: A. Lauko, … D. Baker et
al., "Computational design of serine hydrolases," *Science* 388 (2025),
doi:10.1126/science.adu2454. The design–structure comparison rests on
**six experimentally solved crystal structures** deposited in the Protein Data
Bank (PDB entries 9DED, 9DEE, 9DEF, 9DEG, 9DEH, and 9MRB) — the physical ground
truth against which the computational designs are scored.

**How verified.** The *Science* article itself is paywalled to automated fetch
(HTTP 403), but every load-bearing number is first-party checkable through open
mirrors and the deposited data: an open-access preprint version on PubMed Central
(PMC11384011) and bioRxiv, an author-hosted copy of the paper's figures and PDF,
and the six open PDB structures with their published resolutions and coordinates.
The prediction-versus-experiment comparison — the heart of a forecaster pack — is
independently reconstructable: the design coordinates are stated in the paper and
the experimental coordinates are public in the PDB, so the "sub-ångström match"
claim can be checked against the actual structures rather than taken on the
authors' word.

**How the honesty caveats were confirmed first-party.** Reading the preprint and
the deposited structures surfaces four scope facts the headlines blur, each
confirmed against the primary text rather than press coverage:
- *"Sub-ångström" is best-case, not typical.* The tightest active-site matches
  reach ~0.7–0.83 Å backbone (Cα) agreement, but other solved designs land at
  ~1.2–1.4 Å — above one ångström. The headline number is the best variant, and
  it is a *backbone* match, not a whole-atom or side-chain match.
- *The top efficiency number lives only in the final published version.* The
  headline catalytic efficiency (~2×10^5 M⁻¹s⁻¹, best variant) appears in the
  *Science* version; the earlier preprint's best reported figure is far lower
  (~10^3–10^4 M⁻¹s⁻¹, a different variant). A forecaster citing "10^5" must
  attribute it to the final paper, not the preprint.
- *"Designed" excludes lab evolution but includes computational iteration.* No
  wet-lab directed evolution was used — a real distinction from earlier de novo
  enzymes. But the pipeline ran multiple *computational* redesign rounds, so the
  result is not a literal one-shot from a single model pass either.
- *Turnover is genuine but fragile.* Several designs achieve real multi-turnover
  catalysis; some stall at the acyl-enzyme intermediate, and at least one active
  variant loses activity after roughly ten turnovers. "Multi-turnover" is true
  and load-bearing, but it is not yet robust industrial catalysis.

**First-party check.** Read directly: the open preprint (PMC11384011 / bioRxiv)
for the pipeline description, kinetics, and turnover discussion; the six PDB
entries (9DED/9DEE/9DEF/9DEG/9DEH/9MRB) for resolutions and the deposited
design-versus-experiment coordinates. **Could not verify first-party:** the
paywalled *Science* HTML/PDF via direct automated fetch (403) — the final-version
figures were read through the author-hosted copy and the open preprint, and the
one number unique to the final version (the ~2×10^5 efficiency) is attributed
accordingly and flagged as final-version-only.

**Scope of the domain.** This pack frames the chemistry as **ester and
ester-like bond hydrolysis** — the reaction class demonstrated, relevant to
benign applications such as breaking down small-molecule reporter esters and
degrading polyester plastics. Serine-hydrolase chemistry is a broad natural
family, and the reasoning disciplines here are about *forecasting a designed
biomolecule's real-world performance*, not about any specific compound; no
reactive-chemistry detail beyond the published ester assays is needed or given.

## step_graph

- **S0 — Search first: is a designed enzyme's claim testable, and against what?**
  `search_first` Before trusting "we designed a working enzyme," locate the blind
  test. Here it is dual: solved crystal structures (does the physical fold match
  the design?) and enzyme-kinetics assays (does it actually turn over?). A design
  paper carries weight only where its predictions were committed *before* the
  protein was made and structures. *Check:* confirm the design coordinates were
  fixed pre-experiment and the six crystal structures are independently deposited
  in the PDB, not the authors' private files.
- **S1 — Recast "we designed a working enzyme" as separable claims.**
  `milestone_rewrite` The summit decomposes into claims that are individually
  true-or-false: (a) the designed sequences fold to the intended shape, (b) the
  active-site geometry matches the model closely, (c) the enzymes catalyze with
  genuine multi-turnover, (d) efficiency approaches natural enzymes, (e) this was
  achieved from the design without lab evolution. *Check:* each maps to a specific
  measurement — crystal structures for (a)(b), turnover assays for (c), kinetic
  constants for (d), the methods section for (e) — and no claim inherits another's
  truth.
- **S2 — Split "the model is confident" from "the protein folded" (the
  load-bearing lemma).** `lemma_decomposition` A structure predictor scoring a
  design as folded, and the physical protein actually folding to that shape, are
  different propositions; the bridge is an *empirical* crystallography match, not
  a logical guarantee. *Check:* the bridge is falsifiable — solve the structure and
  overlay it on the design; the paper reports best-case ~0.7–0.83 Å backbone
  agreement and other designs at ~1.2–1.4 Å. A forecaster can ask "what deviation
  would falsify the design?" before seeing the overlay.
- **S3 — Probe turnover at the degenerate case: does it reset, or stall?**
  `small_case_probe` Push past the headline "it catalyzes" to the extreme that the
  average hides: run the enzyme long enough to distinguish one reaction from a
  repeating cycle. *Check:* the paper's own turnover data show genuine
  multi-turnover for some designs but stalling at the acyl-enzyme intermediate for
  others, and activity loss after ~ten turnovers for at least one variant — the
  degenerate case (does it complete and reset?) is exactly where designed serine
  hydrolases are most fragile, and it is measured, not assumed.
- **S4 — Write the kill criterion for "designed, not evolved" before believing
  it.** `kill_criteria` Decide in advance what would void the "genuine design"
  claim: activity appearing only after wet-lab directed evolution, or a fold that
  matches only after the design was reverse-fit to the crystal structure. *Check:*
  the paper reports no wet-lab directed evolution — activity is present in the
  designed variants — but does use multiple *computational* redesign rounds; so
  "designed" survives against the lab-evolution kill criterion while "one-shot"
  does not survive against the computational-iteration one.
- **S5 — Ask which other field already audits "trust a design you cannot
  derive."** `shape_question` This is the shape of any prospective-prediction
  discipline — a weather forecast committed before the day, a clinical trial's
  pre-registered endpoint, a sealed benchmark prediction. None derive the outcome;
  all earn trust by committing before the reveal and scoring the match. *Check:*
  the design-then-crystallize workflow is literally a pre-registration — the
  design is the sealed prediction, the crystal structure is the reveal — so the
  correct audit lens is "was the prediction committed before the data, and how
  close did it land?", not "can I re-derive the fold?"
- **S6 — Reframe "rivals nature" to its exact scope.** `representation_shift` Drop
  the binary "as good as natural enzymes" frame; replace with a scope-bounded
  statement. The designs *rival natural enzymes on structural accuracy and
  mechanism* — the fold and triad geometry are near-native — but on *catalytic
  efficiency* they remain roughly two-to-five orders of magnitude below their fast
  natural counterparts. *Check:* the reported efficiencies (10^4–10^5 M⁻¹s⁻¹ best
  case) sit well under the ~10^7–10^8 M⁻¹s⁻¹ of highly evolved natural hydrolases,
  so "rivals nature" is true for *structure*, false-if-unqualified for *speed*.

## breakthrough

**S3 is the breakthrough step — establishing genuine multi-turnover from the
design itself, and making "it catalyzes" an empirical, reset-the-catalyst claim
rather than a single-reaction one.** The prior reflex in de novo enzyme design was
to celebrate any measurable activity and then hand the weak design to laboratory
directed evolution to reach useful rates — which quietly conceded that the
*computation* had not been shown to produce catalysis. What this work adds is a
design pipeline precise enough that the multi-step serine-hydrolase cycle fires
and repeats *before* any lab evolution, with the catalytic geometry confirmed by
crystallography to sub-ångström accuracy in the best cases. The discipline the
pack trains is refusing to let "it reacted" or "the model was confident" launder
into "we designed a catalyst that rivals nature" — turnover, structure, and
efficiency are three separate reveals, and only the honest scope survives all
three.

## audit_targets

- **T1 — Forecast: will the designed fold actually match the crystal structure,
  and how closely?** Predict the rough deviation before the reveal. *Objection:*
  a structure predictor's confidence is the classic place for a de novo design to
  fail silently, since the tools are calibrated on natural sequences and designs
  sit off that distribution. *Resolution:* the best active sites match the model
  to ~0.7–0.83 Å backbone (Cα), but other solved designs land at ~1.2–1.4 Å — so
  the match is real and often excellent, yet variable, and it is a *backbone*
  match, not whole-atom. A forecaster who predicted "close on the best, above one
  ångström on some" is calibrated; "all sub-ångström" is over-confident.
- **T2 — Forecast: is it genuine multi-turnover catalysis, or one reaction that
  looks like catalysis?** *Objection:* an ester assay can show the enzyme reacting
  once (forming the acyl-enzyme intermediate) without ever completing the cycle
  and resetting. *Resolution:* several designs do achieve genuine multi-turnover,
  but some stall at the intermediate and at least one loses activity after ~ten
  turnovers — so "it's a real catalyst" is true for the best designs and fragile
  in general. Predicting "genuine but fragile turnover" is calibrated; "robust
  industrial catalyst" is over-confident, "just single-turnover" under-confident.
- **T3 — Forecast: does designed catalytic efficiency rival natural enzymes?**
  *Objection:* "rivals nature" invites reading structural fidelity as catalytic
  parity. *Resolution:* no — the best efficiency (~10^4–10^5 M⁻¹s⁻¹) is roughly
  two-to-five orders of magnitude below highly evolved natural hydrolases
  (~10^7–10^8 M⁻¹s⁻¹). The designs rival nature on *structure and mechanism*, not
  on *speed*. A forecaster who predicted "structurally near-native, catalytically
  far behind" is calibrated; "matches natural enzyme rates" is miscalibrated.
- **T4 — Forecast: was this achieved by design alone, or did evolution do the
  real work?** *Objection:* earlier de novo enzymes needed lab directed evolution
  to become active, so the natural prior is "the design was weak and evolution
  rescued it." *Resolution:* no wet-lab directed evolution was used — activity is
  present in the computationally designed variants, which is the genuine advance —
  but multiple *computational* redesign rounds were run, so it is not a literal
  one-shot from a single model pass either. Predicting "designed, not lab-evolved,
  but computationally iterated" is calibrated; "pure one-shot design" over-claims,
  "must have needed lab evolution" under-claims.

---

## calibration_key

The scoring rubric for the forecasts in `audit_targets` — the band a
well-calibrated forecast lands in, and what an over- or under-confident one looks
like, per target. Read this to grade; do not invent a grade.

- **F1 (will the fold match the crystal structure, and how closely?)** —
  *Calibrated:* "close on the best designs, more variable on others" — best-case
  backbone (Cα) agreement in the ~0.7–0.83 Å range with some solved designs at
  ~1.2–1.4 Å, and understood as a backbone not whole-atom match. Credit the
  *reasoning* — that a predictor's confidence and the physical fold are distinct,
  bridged by crystallography — not a guessed decimal. *Over-confident:* "every
  design is sub-ångström" / "the predictor's confidence guarantees the fold."
  *Under-confident:* "de novo designs won't fold to spec at all" — denies a match
  the six crystal structures demonstrate.
- **F2 (genuine multi-turnover, or single reaction?)** — *Calibrated:* "genuine
  multi-turnover for the best designs, but fragile" — real catalytic cycling
  demonstrated, with some designs stalling at the acyl-enzyme intermediate and at
  least one decaying after ~ten turnovers. Credit distinguishing "reacted once"
  from "resets and repeats." *Over-confident:* "a robust, industrial-grade
  catalyst." *Under-confident:* "only single-turnover / not really catalysis" —
  ignores the measured multi-turnover.
- **F3 (does efficiency rival natural enzymes?)** — *Calibrated:* "rivals nature
  on structure and mechanism, not on speed" — best efficiency ~10^4–10^5 M⁻¹s⁻¹,
  which is ~2–5 orders of magnitude below highly evolved natural hydrolases
  (~10^7–10^8). *Over-confident:* "matches natural enzyme rates / solved enzyme
  design." *Under-confident:* "far below nature means the result is trivial" —
  understates a genuine, structurally-validated de novo catalyst.
- **F4 (design alone, or evolution did the work?)** — *Calibrated:* "designed
  without wet-lab directed evolution, but with computational redesign rounds" —
  the honest middle: a real advance over evolution-dependent de novo enzymes, but
  not a literal one-shot from a single model pass. *Over-confident:* "pure
  one-shot design, no iteration." *Under-confident:* "it must have needed lab
  evolution like the older ones" — contradicts the paper's no-directed-evolution
  result.
