# Expedition Pack: A Certified Singularity for 3D Euler with Boundary (Auditor)

`pack_id: 3d-euler-blowup`

This is a scope audit before it is a fluid-dynamics lesson. The result is a
computer-assisted proof of blowup for a carefully delimited Euler flow, not a
settlement of the general free-space 3D Euler problem. Your job is to keep every
condition attached while tracing how computation changes from evidence into
part of a proof.

## problem

**Scope card — read this before the story.**

- **System:** the 3D **axisymmetric** Euler equations — rotation-symmetric flow,
  not arbitrary 3D flow — with a companion result for the related 2D Boussinesq
  system.
- **Setting and data:** a **bounded domain with a solid boundary**, from
  **smooth, finite-energy** initial data.
- **Result:** a **nearly self-similar finite-time singularity**. "Nearly" stays:
  a true solution remains controlled near a numerically constructed
  self-similar profile; the profile is not asserted to be an exact closed-form
  solution.
- **Proof type:** analysis reduces blowup to explicit inequalities; rigorous
  numerics verifies the required bounds with error control.
- **Excluded claim:** this does **not** prove blowup for general smooth 3D Euler
  flow in free space. The authors explicitly say that general problem remains
  unresolved.

**Everyday scene — video versus a certified load test.** Imagine seeing a bridge
bend in a phone video. The video can be strong evidence, but it does not by
itself bound the camera error or certify the load at failure. The Hou–Luo
simulation played the evidence role. Here the later proof is like adding an
engineering calculation whose tolerances are bounded: it proves that the
inequalities needed for blowup hold, rather than merely displaying a flow that
looks singular.

**Precise statement beside the anchors.** The 3D incompressible Euler equations
model an ideal (**inviscid**, or zero-viscosity) fluid. The question is whether
smooth finite-energy data can lose smoothness in finite time — a **finite-time
singularity**. The proved example is axisymmetric, uses a solid boundary, and is
nearly self-similar. The boundary is not scenery: in the Hou–Luo mechanism the
no-flow wall changes the balance between advection and vortex stretching.

**Accessibility note — declared black boxes.** You do not need to solve a
partial differential equation (**PDE**), derive the stability estimates, or
implement validated numerics. You do need to preserve the scope card and audit
the chain "approximate profile → sufficient inequalities → certified error
bounds → true blowup." One inequality with an explicit error bound is enough
mathematical background for the exercise.

**Where the metaphor breaks.** A computer-assisted proof is not literally a
physical load test, and peer review is not the same as independently rerunning
the computation. The bridge image only separates suggestive simulation from
certified bounds. It does not erase the proof's mathematical hypotheses:
axisymmetric, bounded solid boundary, smooth finite-energy data, and nearly
self-similar.

## history

The smooth-data finite-time singularity question for 3D Euler is one of the
oldest open problems in partial differential equations. The general free-space
problem remains unresolved; the result here concerns the axisymmetric
with-boundary setting that Hou and Luo first investigated numerically.

- **Dead end — numerical evidence treated as proof (Hou–Luo, 2014).** A
  high-resolution simulation exhibited what looked like a boundary singularity
  for 3D axisymmetric Euler. This is the central teaching dead end: a
  simulation, however compelling, is **not a proof**. Finer resolution might
  dissolve the apparent singularity, and floating-point simulation carries
  accumulated error that is never rigorously bounded. For roughly a decade the
  scenario was believed but unproven. Why it fails as a proof: it controls no
  error rigorously and cannot rule out that the blowup is a numerical artifact.
- **Dead end — hope for an exact self-similar profile.** One clean route to
  blowup would be an *exactly* self-similar solution written in closed form. No
  such closed-form profile is available here; only an *approximate* one,
  constructed numerically. Insisting on an exact profile is a dead end — the
  proof instead controls the *gap* between an approximate profile and a true
  solution.
- **Dead end — treating this proof as human-surveyable.** This argument closes
  blowup by certifying numerical bounds for a residual ε and stability
  constants. Hand-reading the analytic reduction without checking those bounds
  does not verify this proof. That says how the published proof works; it does
  not claim that no different pen-and-paper proof could ever exist.

## solution_provenance

**Publications.** The result is carried by a two-part technical series plus a
review announcement:

- **Part I (Analysis)** — Jiajie Chen and Thomas Y. Hou, "Stable nearly
  self-similar blowup of the 2D Boussinesq and 3D Euler equations with smooth
  data," arXiv:2210.07191. The analytic stability framework; reduces blowup to a
  finite set of verifiable inequalities on explicit constants. Preprint.
- **Part II (Rigorous Numerics)** — the computer-assisted half that certifies
  those inequalities via validated (interval-arithmetic) numerics.
  arXiv:2305.05660, **peer-reviewed and published in SIAM *Multiscale Modeling &
  Simulation* 23(1):25–130 (2025), DOI 10.1137/23M1580395.** This is the
  load-bearing peer-reviewed artifact.
- **Review / announcement** — Jiajie Chen and Thomas Y. Hou, "Singularity
  formation in 3D Euler equations with smooth initial data and boundary," PNAS
  122(27) e2500940122 (2025), DOI 10.1073/pnas.2500940122, open access via
  PMC12260595. An Inaugural Article; the article names its reviewers among
  senior PDE figures (Caflisch, Gómez-Serrano, Šverák, Tao). This paper reviews
  and announces the result; it is not itself the proof.

**How verified.** Part II was peer reviewed in SIAM MMS. The proof's internal
structure is an analytic reduction (Part I) whose sufficient inequalities are
then certified by rigorous numerics with machine-tracked discretization and
round-off error (Part II). The separate PNAS review names its reviewers, but a
reviewer list is not evidence that any reviewer independently reran the
computation.

**First-party check.** Read directly: the PNAS review (open access), the arXiv
abstracts and statements of Parts I and II, and the SIAM MMS publication record
for Part II. The SIAM paper's references link the authors' public MATLAB code,
and Jiajie Chen's author page provides the archive at
https://jiajiechen94.github.io/codes. That gives an independent rerun path; it
does not show that the named reviewers used it.

## step_graph

- **S0 — Read the papers before trusting the headline** `search_first` Fetch the
  PNAS review and the Part I / Part II statements; do not infer the claim from
  "AI solves 250-year-old fluid problem" coverage. The headline drops
  qualifiers the abstract keeps. Check: the PNAS title itself contains "3D Euler
  equations with smooth initial data **and boundary**," and the abstract states
  the general singularity problem remains unresolved.
- **S1 — Pin the scope: which equation, which setting** `shape_question` Before
  auditing the proof, fix what is being proved. Reframe "did they prove 3D Euler
  blows up?" into "for *which* equation, in *what* domain, from *what* data?"
  Answer: 2D Boussinesq and 3D **axisymmetric** Euler, in a **bounded domain
  with boundary**, from **smooth finite-energy** data, forming a **nearly**
  self-similar singularity. Check: each qualifier appears in the paper; the
  free-space general-3D-Euler question is explicitly still open.
- **S2 — Separate simulation from certification** `kill_criteria` Establish the
  disqualifier that Hou–Luo (2014) numerics could not clear. A simulation
  suggests a singularity but bounds no error; kill criterion for "this is a
  proof": if the argument cannot rigorously bound the gap between the computed
  object and a true solution, it is evidence, not proof. Check: the paper's
  contribution is precisely converting numerical *evidence* into a *certified*
  argument with explicit error control.
- **S3 — See the reduction: blowup ⇐ a finite list of inequalities**
  `lemma_decomposition` Decompose the monolithic "prove blowup" goal into a
  finite, independently checkable set of inequalities on explicit constants. The
  analytic framework (Part I) proves that *if* an approximate self-similar
  profile satisfies stability inequalities with a small enough residual, the
  true solution blows up nearly self-similarly. The summit is now a checklist of
  bounds, not a single leap. Check: Part I's weighted-energy stability estimates
  reduce blowup to a closing condition of the form ε < λ²/(4C) on named
  constants.
- **S4 — Accept an *approximate* profile, control the gap** `representation_shift`
  Shift from "we need the exact singular solution" to "we need a nearby
  approximate profile plus a certified bound on how far it sits from a true
  solution." The profile is only known numerically; the theorem never needs it
  exactly — it needs the residual ε bounded. Check: the proof rests on an
  approximate profile with an explicitly bounded residual, not on a closed-form
  exact self-similar solution.
- **S5 — See how a computation *certifies* rather than approximates**
  `representation_shift` Reframe the numerical step from "compute a number" to
  "return an interval guaranteed to contain the true value." Interval /
  validated arithmetic tracks discretization and round-off error as rigorous
  enclosures, so the output is an inequality *certified true*, not a
  floating-point estimate. Check: Part II uses interval arithmetic with sharp
  Hölder (C^{1/2}) constants and finite-rank operator approximation to bound the
  constants S3 requires.
- **S6 — Locate the load-bearing hypothesis: the boundary** `small_case_probe`
  Probe what happens if a hypothesis is removed. The solid boundary (Hou–Luo
  scenario) sustains the compression driving the singularity; drop it and the
  free-space problem is open again. Auditing which hypothesis the conclusion
  cannot survive without is the exercise. Check: the result is stated for a
  domain *with boundary*; the authors flag the extension to free-space smooth 3D
  Euler as unresolved.
- **S7 — Ask where the trust sits in a computer-assisted proof**
  `milestone_rewrite` Recast "is this proof true?" as a chain of independently
  verifiable trust claims: (a) the analytic reduction in the Part I preprint is
  correct; (b) peer-reviewed Part II's validated-numerics method soundly bounds
  error; (c) the published MATLAB computation can be rerun. Trust is distributed
  across all three, not placed in a single reviewer name. Check: Part I remains
  a preprint, Part II is peer-reviewed in SIAM MMS, and the authors link the
  code; public availability does not itself prove an independent rerun occurred.

## breakthrough

**S3 is the breakthrough — the analytic reduction that makes the computation
*sufficient*.** The decade-long obstacle after Hou–Luo (2014) was not the lack
of a simulation; it was that no simulation, however fine, constitutes a proof.
The move that broke it was building a stability framework (Part I) proving that
a *finite, certifiable* list of inequalities on an *approximate* profile is
enough to force blowup of the *true* solution — converting an infinite,
uncertifiable question into a finite, machine-certifiable one. It eluded the
earlier numerical investigation because a simulation did not supply those
rigorous error bounds. The published move is to control the *gap* between an
approximate profile and a true solution so certified bounds can close the
argument. The sources do not establish that every earlier researcher pursued a
particular alternative. The scope qualifiers (axisymmetric, with boundary,
nearly self-similar) are not footnotes — they are the precise conditions under
which this reduction closes.

## audit_targets

- **T1 — "They proved 3D Euler blows up."** *Objection:* the headline invites
  stating the result as a proof of finite-time singularity for the general 3D
  Euler equations. *Resolution:* the proof is for *axisymmetric* Euler in a
  bounded domain *with boundary*, from smooth data, and the singularity is only
  *nearly* self-similar (and the companion result is for 2D Boussinesq); the
  general free-space 3D Euler problem remains open, as the authors state
  explicitly. The auditor must reattach all three qualifiers — axisymmetric,
  with-boundary, nearly-self-similar; the celebrated result is precisely the
  qualified one.
- **T2 — "Interval arithmetic only computes approximately, so it cannot prove
  anything."** *Objection:* a reader equates numerical computation with
  estimation and denies it any role in a rigorous proof. *Resolution:* validated
  (interval) arithmetic returns an *enclosure* — an interval guaranteed to
  contain the true value — so round-off and discretization are bounded, not
  ignored. The certified output is an inequality proven true, which is exactly
  what the analytic framework needs. The trust question is real but the answer is
  rigorous, not hand-waved.
- **T3 — "The profile is only numerical, so the proof rests on an unproven
  object."** *Objection:* the self-similar profile is constructed numerically, so
  the whole proof seems to depend on something unproven. *Resolution:* the
  theorem never asserts the approximate profile is exact. Part I proves that any
  approximate profile whose residual ε is small enough (a certifiable, finite
  condition) forces blowup of the true solution; the computer's only job is to
  bound ε and the constants. The unproven-looking object is used only through a
  proven sufficiency statement.
- **T4 — "Doesn't known regularity theory (e.g. Beale–Kato–Majda) forbid
  this?"** *Objection:* a reader recalls no-blowup or regularity results and
  suspects a contradiction. *Resolution:* Beale–Kato–Majda is a *characterization*
  of blowup (it must be accompanied by divergence of the time-integrated
  vorticity sup-norm), not a theorem forbidding it; no global regularity theorem
  covers axisymmetric Euler with boundary in this regime, which is why the
  problem was open. *(Frame this as the standard objection and its resolution;
  the pack does not assert the paper quotes BKM directly.)*
- **T5 — "Peer review of a computer-assisted proof — did anyone actually check
  the computation?"** *Objection:* if the proof rests on a large computation, a
  reader may doubt reviewers verified it. *Resolution:* the verification is
  designed for mechanical rerunning rather than line-by-line eyeballing, and
  the authors publish the MATLAB archive linked from the SIAM paper and their
  code page. Peer review and public reproducibility are separate evidence: the
  named-reviewer list does not prove a rerun occurred, while the code gives
  another reader a path to attempt one.
