# Expedition Pack: AlphaFold at CASP14 (Forecaster)

`pack_id: alphafold-casp14`

A forecaster-role pack, not an auditor one. AlphaFold 2 predicted protein
structures at near-experimental accuracy at CASP14 (2020), but there is no
proof chain to audit — the load-bearing question is "why trust a prediction you
cannot derive?" The user predicts which validations will hold before each
reveal, then calibrates against what actually held and what AlphaFold did not
solve.

## problem

**The summit.** Predict a protein's 3D structure from its amino-acid sequence alone, accurately enough to be useful in place of experiment. This is the "protein folding problem" in its prediction form, and CASP (Critical Assessment of Structure Prediction) is the blind, biennial tournament that scores it: organizers hold back experimentally-solved structures, teams submit predictions before the answers are public, and assessors score each prediction's backbone against the truth using GDT (Global Distance Test) and related metrics. GDT_TS runs 0–100; roughly 90+ on a domain is the neighborhood of experimental accuracy.

**What happened.** At CASP14 (2020), DeepMind's AlphaFold 2 posted a **median domain GDT_TS of 92.4** across targets and was scored at a **summed z-score (>2.0) of 244.0 versus 90.8 for the next-best group** — not an incremental win but a category break. In the companion Nature paper (Jumper et al. 2021), AlphaFold's median backbone accuracy was **0.96 Å r.m.s.d.95** (Cα RMSD at 95% residue coverage) against **2.8 Å** for the next-best method, and all-atom accuracy **1.5 Å vs 3.5 Å**. For reference the paper notes a carbon atom is ~1.4 Å wide.

**The answer you are asked to forecast, not derive.** This pack is a *forecaster* exercise, not an auditor one. There is no human-checkable proof chain behind a single AlphaFold prediction — the model emits coordinates, not a derivation. The load-bearing question is: *why would you trust a structure you cannot reconstruct?* The honest answer is calibration, not proof: AlphaFold ships a per-residue self-confidence (**pLDDT**) and a pairwise **predicted aligned error (PAE)**, and the case for trust rests on whether those self-estimates actually track real accuracy on held-out structure — they do (pLDDT vs true lDDT-Cα: Pearson **r = 0.76**; pTM vs true TM-score: **r = 0.85**, both on n = 10,795 chains). Trust transfers through calibration, and only within the regime where it was demonstrated.

**Accessibility note.** No biochemistry needed to run the audit. You need to hold three ideas: a benchmark score (GDT_TS, higher = closer to the real shape), a self-reported confidence the model attaches to its own output (pLDDT/PAE), and the difference between "the model is confident" and "the model is right." The skill being trained is forecasting calibration — predicting in advance which validation claims will survive contact with new data, and where a celebrated result silently stops generalizing.

## history

**How long open / who posed it.** Structure prediction has been a named grand challenge since the 1960s (Anfinsen's thermodynamic hypothesis: sequence determines structure). CASP was founded by John Moult in 1994 specifically because the field could not trust its own self-reported results — blind assessment was the only way to cut through optimism. For 13 CASPs (1994–2018) top free-modeling accuracy crept upward; AlphaFold 1 (CASP13, 2018) won but stayed well short of experimental accuracy. CASP14 (2020) was the first time median accuracy reached the experimental neighborhood.

**Community attempts and why each fell short:**

- **Dead end 1 — physics-first folding (ab initio molecular dynamics).** Simulate the physical forces and let the chain fold. Theoretically complete but computationally hopeless at protein scale; the Nature paper flags this approach as "theoretically very appealing" yet "highly challenging." Dead end because the conformational search space is astronomically large and force fields are not accurate enough to find the native state reliably.
- **Dead end 2 — pure homology/template modeling.** Copy the structure of a known similar protein. Works when a close template exists, fails exactly on the hard (free-modeling) targets where no template does — which are the cases CASP was built to test. Dead end because it cannot predict genuinely novel folds, the part that mattered.
- **Dead end 3 — coevolution contact prediction without end-to-end geometry.** Read multiple-sequence alignments to guess residue-residue contacts, then fold to satisfy contacts. A real advance (drove CASP12–13 gains) but plateaued: contacts are a lossy intermediate, and stitching them into accurate 3D coordinates lost precision. Dead end as a *ceiling* — it improved the state of the art without reaching experimental accuracy.
- **Dead end 4 — trusting self-reported accuracy without blind assessment.** The pre-CASP failure mode: methods that looked great on their authors' chosen examples. Dead end because selection bias made progress unmeasurable; CASP existed precisely to kill this. The forecaster lesson lives here: a confident system is not a calibrated one until tested blind on data it never saw.

## solution_provenance

**Where the verified solution lives.** Two paired publications, both 2021:
- Jumper et al., "Highly accurate protein structure prediction with AlphaFold," *Nature* 596, 583–589 (2021), doi:10.1038/s41586-021-03819-2. Open-access PMC mirror PMC8371605.
- Jumper et al., "Applying and improving AlphaFold at CASP14," *Proteins* 89(12):1711–1721 (2021), doi:10.1002/prot.26257, PMID 34599769 — the CASP14-specific assessment paper.

**How verified.** I read the full text of the Nature paper first-party (PDF extracted to local text) and verified verbatim: the **0.96 Å r.m.s.d.95** backbone figure vs **2.8 Å** next-best (95% CI 0.85–1.16 Å and 2.7–4.0 Å respectively), all-atom **1.5 Å vs 3.5 Å**, the pLDDT calibration fit **lDDT-Cα = 0.997 × pLDDT − 1.17, Pearson r = 0.76, n = 10,795**, the pTM–TM-score fit **r = 0.85**, and the explicit hetero-complex limitation ("much weaker for proteins that have few intra-chain or homotypic contacts… we expect… full hetero-complexes in a future system"). The phrase "verified" applies to every number in this paragraph against the Nature text.

**First-party check.** Read directly from the Nature paper: all r.m.s.d.95 figures, both Pearson r values and linear fits, n = 10,795, the heterotypic-contact limitation, the 1.4 Å carbon-width reference. **Could NOT confirm first-party (Wiley + ResearchGate were paywalled / 402 / 403):** the **median domain GDT_TS = 92.4** and the **summed z-score 244.0 vs 90.8** — these come from the *Proteins* (prot.26257) abstract as surfaced by multiple secondary search summaries, consistent across sources but not read by me in the primary venue. They are widely cited but I flag them as not first-party confirmed here.

## step_graph

- **S0 — Search first: was this already solved, and by what standard?** `search_first` Before trusting any "solved" claim, locate the blind benchmark. CASP is the field's pre-registered, hold-out tournament; a result inside CASP carries weight a self-report cannot. *Check:* confirm independently that targets were sequestered before submission and scored by third-party assessors, not the predicting team.
- **S1 — Recast the summit as a chain of verifiable claims.** `milestone_rewrite` "AlphaFold solved folding" decomposes into separable claims: (a) high median backbone accuracy on CASP14 domains, (b) a decisive margin over all competitors, (c) accuracy transfers off-benchmark to fresh PDB depositions, (d) the model's self-confidence predicts its own error, (e) named regimes where it does NOT hold. Each is true-or-false on its own. *Check:* each sub-claim maps to a specific figure or table in one of the two papers; no claim rests on another's truth.
- **S2 — Split confidence from correctness (the load-bearing lemma).** `lemma_decomposition` "The model is confident" (pLDDT high) and "the model is correct" (true lDDT high) are different propositions; the bridge between them is an *empirical* calibration claim, not a logical one. *Check:* the bridge is falsifiable — fit pLDDT against measured lDDT-Cα on held-out chains; paper reports r = 0.76, n = 10,795. A forecaster can ask "what r would falsify trust?" before seeing it.
- **S3 — Probe the regime boundary with degenerate cases.** `small_case_probe` Push to extremes the headline average hides: targets with no homologs (free-modeling), very long chains (a 2,180-residue protein in Fig. 1d), and bridging domains shaped mostly by *other* chains. *Check:* the paper's own breakdowns and the hetero-contact limitation passage show where accuracy degrades; the degenerate case (structure defined by inter-chain contacts) is exactly where AlphaFold 2 self-reports weaker — verifiable against Fig. 5 discussion.
- **S4 — Write the kill criterion before believing transfer.** `kill_criteria` Decide in advance what would void "trust the prediction": pLDDT–accuracy correlation collapsing on new folds, or accuracy dropping sharply on post-cutoff PDB structures. *Check:* the Nature paper pre-empts this by re-testing on PDB structures deposited *after* the training cutoff and confirming accuracy and pLDDT calibration both hold; if they had not, the kill criterion fires.
- **S5 — Ask which other field already audits "trust without derivation."** `shape_question` This is the shape of any calibrated black-box forecaster — weather models, clinical risk scores, well-calibrated classifiers. None derive the answer; all earn trust by reliability-diagram calibration on hold-out data. *Check:* the pLDDT-vs-true-accuracy plot is literally a calibration curve; importing that field's standard (is it calibrated on unseen data, and only there?) is the correct audit lens.
- **S6 — Reframe "solved" as "solved single-chain structure, within calibration, not dynamics."** `representation_shift` Drop the binary "solved/unsolved" frame; replace with a scope-bounded statement. AlphaFold 2 predicts a *single static structure* per chain; it does not deliver multimer assembly (CASP14-era), conformational ensembles, or folding dynamics. *Check:* the paper's own limitation section defers hetero-complexes to "a future system" — verifiable text, and corroborated by the later separate release of AlphaFold-Multimer.

## breakthrough

**S2 is the breakthrough step — splitting confidence from correctness and making the bridge an empirical, calibration claim.** It eluded the community for decades because the field's instinct was to chase *correctness* (better physics, better templates, better contacts) while treating a method's self-confidence as marketing rather than a first-class, separately-validated output. AlphaFold's quiet move was to ship a self-error estimate (pLDDT/PAE) and then *prove it calibrated* on held-out data, converting "trust me" into "here is where, and how reliably, you can trust me" — the only honest answer to "why believe a prediction you cannot derive."

## audit_targets

- **T1 — Forecast: does pLDDT actually correlate with real accuracy, or is it confident noise?** Predict the sign and rough strength before the reveal. *Objection:* a model's self-confidence is the classic place for overconfidence; high pLDDT could be decoupled from true error. *Resolution:* on n = 10,795 held-out chains the fit is lDDT-Cα = 0.997 × pLDDT − 1.17, Pearson r = 0.76 — positive, near unit slope, but r = 0.76 means meaningful scatter, so pLDDT is a calibrated guide, not a guarantee. A forecaster who predicted "strong but imperfect" is calibrated; "perfect" is overconfident.
- **T2 — Forecast: does CASP14 benchmark performance transfer off-benchmark to fresh structures?** *Objection:* CASP targets could be unrepresentative or leaked-adjacent; a benchmark champion may regress on the wild distribution. *Resolution:* the Nature paper re-tests on PDB structures deposited *after* the training cutoff and finds accuracy and pLDDT calibration both transfer — the kill criterion did not fire. Predicting "transfers" was correct here, but the reasoning (post-cutoff hold-out) is what earns the credit, not the outcome.
- **T3 — Forecast: does it generalize to multi-chain complexes and dynamics?** *Objection:* "solved protein folding" tempts over-extrapolation to assemblies and motion. *Resolution:* no — the paper itself reports weakness on bridging domains dominated by heterotypic contacts and defers full hetero-complexes to "a future system"; single static structures, not ensembles or assembly, are what was delivered. A forecaster who predicted broad transfer to complexes/dynamics is miscalibrated against the authors' own stated scope.
- **T4 — Forecast: is the margin over competitors incremental or a step change?** *Objection:* press coverage inflates; maybe it was a normal generational gain. *Resolution:* backbone 0.96 Å vs 2.8 Å next-best (Nature), and the CASP14 summed z-score 244.0 vs 90.8 (Proteins, not first-party confirmed by me) — a category break, not an increment. Predicting "step change" is supported, but note the z-score figure sits in the unverified column.


---

## calibration_key

The scoring rubric for the forecasts in `audit_targets` — the band a
well-calibrated forecast lands in, and what an over- or under-confident one
looks like, per target. Read this to grade; do not invent a grade.

- **F1 (does pLDDT track real accuracy?)** — *Calibrated:* "positive and strong
  but imperfect" — a correlation clearly above zero with real scatter (the paper
  gives Pearson r = 0.76 on n = 10,795 held-out chains, near-unit slope). Credit
  the *reasoning* — that confidence and correctness are distinct propositions
  bridged empirically — not a guessed number. *Over-confident:* "pLDDT is
  accuracy" / "r ≈ 1" / treats high confidence as a guarantee. *Under-confident:*
  "self-reported confidence is worthless" — denies any calibration, ignoring that
  it was demonstrated blind.
- **F2 (does CASP14 performance transfer off-benchmark?)** — *Calibrated:*
  "transfers, on the strength of post-training-cutoff hold-out" — the answer AND
  the kill-criterion reasoning (accuracy and pLDDT calibration both re-tested on
  PDB structures deposited after the cutoff). *Over-confident:* "transfers
  everywhere" with no scope limit. *Under-confident:* "a benchmark champion will
  regress in the wild" — predicts failure the post-cutoff test already refuted.
- **F3 (does it generalize to complexes and dynamics?)** — *Calibrated:* "no —
  single static structures only; assemblies and motion are out of scope," matching
  the authors' own stated weakness on heterotypic-contact bridging domains.
  *Over-confident:* "solved protein folding, so complexes and dynamics too."
  *Under-confident:* "the single-chain result itself is unreliable" — understates
  what was in fact delivered.
- **F4 (incremental or step change?)** — *Calibrated:* "step change" — backbone
  0.96 Å vs 2.8 Å next-best is a category break, not a generational increment.
  Full credit does not depend on the CASP14 summed z-score (244.0 vs 90.8), which
  is not first-party confirmed here; a forecaster leaning on the Å margin is
  calibrated. *Over-confident:* treats the unverified z-score as settled fact.
  *Under-confident:* "just a normal generational gain" — reads press deflation
  into a category break.
