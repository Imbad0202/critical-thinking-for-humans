# Expedition Pack: The RNA Result That Didn't Happen (Auditor)

`pack_id: casp16-rna`

A rare pack in this collection: the headline is a *non-*breakthrough. At CASP16
(2024), the community's blind test of 3D structure prediction, deep-learning
methods did not deliver the RNA equivalent of the AlphaFold protein leap — and
fully-automated AI did not beat human expert predictors. You audit an anti-hype
result, and the hard discipline is refusing to let it slide into the *opposite*
overclaim ("AI is useless for RNA"), which the evidence does not support either.
The load-bearing skill is holding a claim to exactly what the data shows: not the
celebratory read, not the doomer read, the qualified one.

## problem

**Statement.** CASP (Critical Assessment of Structure Prediction) is a
community-wide *blind* experiment: predictor groups receive sequences, submit 3D
structure predictions before the experimental structures are public, and an
independent assessor scores them against the withheld ground truth. CASP16 ran in
2024. In the nucleic-acid track, 65 groups from 46 labs submitted blind
predictions for 42 targets. The finding this pack audits: on RNA, prediction
performance was "generally poor," **no previously-unseen (template-free) natural
RNA was predicted to a TM-score above 0.8**, and the top-performing groups were
all human expert predictors — not the fully-automated deep-learning servers. Two
years after AlphaFold-class methods transformed *protein* prediction, RNA had not
had its equivalent moment.

**The two ways to get this wrong.** The celebratory framing ("AI is solving
biology") is refuted here — that is the pack's first point. But the mirror-image
framing ("deep learning failed at RNA / AI is overhyped and useless") is *also*
an overclaim, and the same data refutes it: the winning human groups won partly
by running AlphaFold3 as a sampling engine and manually curating its output, and
several targets (well-templated ribozymes, one deep-alignment novel RNA) were
predicted well. The honest claim is narrow and specific, and finding its exact
boundary is the exercise.

**Accessibility note.** You do not need to predict an RNA structure or read a
contact map. You need to hold a claim to its precise scope: *fully-automated*
(not "AI") predictors lost to *human-plus-AI* pipelines; *previously-unseen*
(not "all") natural RNA stayed below the accuracy bar; the failure is in *novel
folds and functionally critical fine detail* (not across the board). Comfort with
the idea of a similarity score between two 3D shapes (TM-score, 0 to 1, higher =
closer) is enough; the structural biology is background, the scope-discipline is
the exercise.

## history

For proteins, CASP14 (2020) was the watershed: AlphaFold2 reached
near-experimental accuracy, and the field's central open problem was widely
considered solved. The natural expectation was that RNA would follow. It has not,
and the reasons are the teaching context.

- **Dead end — assuming the protein result would transfer to RNA.** RNA has
  orders of magnitude fewer experimentally-solved 3D structures than proteins
  (little training data), greater conformational flexibility, and its function
  often turns on tertiary features — pseudoknots, non-canonical base pairs,
  A-minor motifs — that models capture poorly. Expecting an AlphaFold-style leap
  by analogy to proteins is a dead end: the two problems are not the same shape,
  and the data regime that made proteins tractable does not exist for RNA.
- **Dead end (already visible at CASP15, 2022) — assuming deep learning would
  win because it won for proteins.** CASP15 was the first CASP with an RNA
  category; there, deep-learning predictions were significantly *worse* than the
  top human groups, and the best four RNA groups did not use deep learning at
  all. Carrying "the deep-learning method wins" as a prior into RNA was already a
  dead end a full cycle before CASP16 confirmed it again.
- **Dead end — reading a blind-test ranking without controlling for templates.**
  A predictor can score well on a target that resembles an already-known
  structure, without the method having generalized. Any assessment of "did
  prediction improve?" that does not exclude well-templated targets is a dead
  end: it measures template availability, not predictive power. Controlling for
  this is precisely what isolates the real claim.

## solution_provenance

**Publication.** Kretsch, Hummer, He, Yuan, Zhang, Karagianes, Cong,
Kryshtafovych, Das, "Assessment of Nucleic Acid Structure Prediction in CASP16,"
*Proteins: Structure, Function, and Bioinformatics* 94(1):192–217 (2026), DOI
10.1002/prot.70072 — the peer-reviewed source. An open-access preprint of the
same study is on bioRxiv (2025.05.06.652459) and via PMC12248019; the PMC copy is
the preprint, not the peer-reviewed version, and should be cited as such. A
companion paper (Kretsch et al., "Functional relevance of CASP16 nucleic acid
predictions as evaluated by structure providers," bioRxiv 2025.04.15.649049)
independently reports that predictions "often lack accuracy in the regions of
highest functional importance."

**How verified.** The result is not a solved problem but a blind assessment; its
soundness rests on the CASP protocol and real withheld ground truth. Confirmed
first-party: the ground-truth structures were experimentally determined (Table 1
lists per-target X-ray crystallography, cryo-EM, and NMR), and predictions were
submitted before those structures were released — the definition of a CASP blind
prediction. Peer review in *Proteins* is the second layer.

**First-party check.** The load-bearing claim is publicly re-checkable: the
targets, per-group predictions, and rankings are open at
predictioncenter.org/casp16 (RNA/DNA categories), and the ground-truth structures
are in the PDB. An auditor can re-pull the scores rather than take the paper's
word. **One figure taken from the paper's text, not independently re-derived:**
the exact per-group counts behind "the automated server was outperformed by
several human groups" — re-checkable from the open ranking tables, but this pack
attributes them to the paper's Results rather than claiming an independent count.

## step_graph

- **S0 — Read the assessment, not the press cycle** `search_first` Fetch the
  CASP16 nucleic-acid assessment (open via PMC preprint; peer-reviewed in
  Proteins) before accepting either "AI solves RNA" or "AI failed at RNA." The
  headline lives in the abstract with its qualifiers intact. Check: the abstract
  states performance was "generally poor," names the top groups as human expert
  predictors, and restricts the accuracy claim to "previously unseen natural RNA
  structures."
- **S1 — Pin the claim: automated vs human, unseen vs templated** `shape_question`
  Before auditing, fix exactly what is being claimed. Reframe "did AI fail at
  RNA?" into two precise questions: (a) did *fully-automated* servers beat *human
  expert* groups? (No — all top groups were human.) (b) was *previously-unseen*
  natural RNA predicted accurately? (No — none above TM-score 0.8.) Neither claim
  is "AI is useless." Check: the top groups (Vfold, GuangzhouRNA-human,
  KiharaLab) are human; the winners used AlphaFold3 as a component they curated.
- **S2 — Separate template availability from predictive power** `kill_criteria`
  Establish the disqualifier for any "prediction improved" reading. A high score
  on a well-templated target does not show the method generalized. Kill
  criterion: exclude targets with a pre-existing close template (TM-align > 0.8)
  before crediting improvement. Check: after that exclusion, only three targets
  (R1221s2, R1224s2, R1289 — two RNase P ribozymes and a group I ribozyme)
  surpassed 0.8 — and each still had a usable sub-threshold template
  (TM-align > 0.6), a deep alignment, and extensive prior literature.
- **S3 — Read the no-improvement result at the right resolution**
  `lemma_decomposition` Decompose "did RNA prediction get better?" into a
  template-controlled, statistical comparison rather than an impression. The
  mean improvement of prediction over the best template went from 0.027 ± 0.014
  to 0.060 ± 0.016 across cycles — a small change that is *not* statistically
  significant (p = 0.13). Check: the paper states "there has not been a notable
  increase in nucleic acid modeling accuracy between previous blind challenges
  and CASP16," backed by that p-value, not by a single target.
- **S4 — Locate the failure precisely: novel folds and fine detail**
  `small_case_probe` Probe where the failure actually lives by looking at the
  exceptions. It is not uniform: secondary structure and global folds for
  well-conditioned targets were reasonable, and one long template-free RNA (OLE
  RNA, R1285) was predicted well *because* it had an unusually deep alignment
  (Neff = 235), showing information can be pulled from alignments when they are
  deep. The failure concentrates in *previously-unseen novel folds* and in
  *functionally critical detail* — pseudoknots, non-canonical pairs, A-minor
  motifs, active-site geometry. Check: the OLE RNA positive outlier and the
  companion paper's "lack accuracy in the regions of highest functional
  importance."
- **S5 — Resist the reverse overclaim** `representation_shift` Reframe "humans
  beat AI" into "human-plus-AI pipelines beat fully-automated AI." The winning
  human groups ran AlphaFold3's server to generate candidate structures, then
  manually curated — deep learning was a component of the winners, not the loser.
  The honest axis is *autonomy* (automated vs curated), not *AI vs no-AI*. Check:
  the paper's description of top groups "taking advantage of the AlphaFold 3
  server... then manually curate."
- **S6 — See why a blind assessment is the trustworthy instrument**
  `milestone_rewrite` Recast "can we trust this negative result?" as a chain of
  design guarantees: sequences released but structures withheld until after the
  deadline (predictors cannot see the answer); ground truths are real
  experimental structures (X-ray/cryo-EM/NMR); the template-leakage objection is
  pre-empted by the TM-align > 0.8 exclusion. The negative result is not an
  absence of evidence — it is a controlled measurement. Check: Table 1's
  experimental methods per target and the explicit template-exclusion control.

## breakthrough

**The "breakthrough" here is the discipline of the non-result — S2 is its
hinge.** There is no summit conquered; the teachable move is that a *negative*
finding, properly controlled, is as real a result as a positive one, and is
exactly the kind of claim hype erases in both directions. The non-obvious step is
S2's template control: without it, RNA prediction *looks* like it improved
(scores went up), and the field's AlphaFold3-era expectation would be confirmed.
Excluding well-templated targets is what converts an impression into a
measurement — and reveals that, template-for-template, accuracy did not
significantly improve. The two-directional refutation takes two moves, not one:
S2's template control kills the celebratory read (the score rise was templates,
not progress), and S5's autonomy reframing kills the doomer read (automated AI
lost, but human-plus-AI won, so deep learning is not the loser). What eluded the
easy reading is that the same instrument (a blind, ground-truthed,
template-controlled assessment) is needed to refute *both* the celebratory claim
and its doomer mirror; most commentary reaches for one overclaim or the other
precisely because it skips the control.

## audit_targets

- **T1 — "AI failed at RNA."** *Objection:* the humbling headline invites
  stating that deep learning does not work for RNA. *Resolution:* the claim is
  about *autonomy*, not AI. Fully-automated servers (including the AlphaFold3
  server) were beaten by human expert groups — but those groups won partly by
  running AlphaFold3 and curating its output. Deep learning was a component of
  the winners. The defensible statement is "fully-automated deep-learning
  predictors did not beat human-plus-AI pipelines," never "deep learning doesn't
  work for RNA." This is the pack's central discipline and the easiest error to
  make.
- **T2 — "No natural RNA was predicted accurately."** *Objection:* the "TM-score
  > 0.8" line is easily restated as a blanket claim about natural RNA.
  *Resolution:* three natural RNAs (R1221s2, R1224s2, R1289) did exceed 0.8. The
  true claim requires the qualifier *previously-unseen* (template-free): the
  successes all had usable templates, deep alignments, and heavy prior
  literature. Dropping "unseen" turns a true, precise claim into a false blanket
  one — the same qualifier-dropping error the auditor is training to catch.
- **T3 — "The result shows RNA prediction got worse / made no progress at all."**
  *Objection:* "no notable increase" is read as "no progress anywhere."
  *Resolution:* it is a *template-controlled* and *statistical* claim (Δ TM-align
  0.027 → 0.060, p = 0.13, not significant) about generalizing to novel folds.
  Secondary structure and well-conditioned global folds were reasonable, and OLE
  RNA (R1285) was a genuine positive outlier. The honest claim is "no significant
  improvement in template-free accuracy," not "no progress."
- **T4 — "Is TM-score > 0.8 a meaningful bar for RNA, or a protein cutoff
  misapplied?"** *Objection:* TM-score thresholds were calibrated on proteins;
  maybe RNA needs a different bar and the negative result is a metric artifact.
  *Resolution:* the assessment uses RNA-appropriate sequence-independent TM-align
  on C4′ atoms and reports lDDT, INF, and F1 alongside; the poor recovery of
  pseudoknots, non-canonical pairs, and A-minor motifs corroborates the
  global-fold story across metrics. The negative result is robust to the metric
  choice, not an artifact of the 0.8 threshold.
- **T5 — "Can a blind assessment's negative result be trusted?"** *Objection:*
  maybe predictors saw the structures, or PDB templates leaked the answers, so
  the negative finding is unreliable. *Resolution:* the CASP protocol withholds
  structures until after the prediction deadline, the ground truths are real
  experimental structures, and the template-leakage path is explicitly closed by
  excluding targets with a pre-existing TM-align > 0.8 template. The design
  anticipates exactly this objection; the negative result is a controlled
  measurement, not an absence of data.
