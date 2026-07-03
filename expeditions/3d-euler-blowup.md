# Expedition Pack: A Certified Singularity for 3D Euler with Boundary (Auditor)

`pack_id: 3d-euler-blowup`

A computer-assisted proof closes a question left open since Euler wrote the
equations in 1757 — but not the question the headline suggests. You audit what
was actually proved (blowup for *axisymmetric* Euler in a domain *with a
boundary*, from smooth data), how a machine computation can *certify* a proof
rather than merely suggest one, and where the trust in a computer-assisted proof
really sits. The load-bearing discipline is refusing to let a true, celebrated
result be restated one scope-level too broad.

## problem

**Statement.** The 3D incompressible Euler equations describe an ideal
(inviscid) fluid. A central open question since 1757: can a solution starting
from *smooth*, finite-energy initial data develop a *finite-time singularity* —
a point where the flow's derivatives blow up — or does it stay smooth forever?
This pack's result: for the **axisymmetric** Euler equations in a **bounded
domain with a solid boundary** (the Hou–Luo scenario), and for the
closely related 2D Boussinesq system, there exist smooth finite-energy initial
data whose solution forms a **nearly self-similar finite-time singularity**. The
proof is computer-assisted: an analytic framework reduces blowup to a finite set
of inequalities, and a rigorous-numerics computation certifies those
inequalities hold.

**Scope — the whole point of the audit.** This is **not** a proof of blowup for
the general free-space 3D Euler equations; that problem remains open, and the
authors say so. The result needs three qualifiers that the celebratory framing
tends to drop: *axisymmetric* (not general 3D), *with a boundary* (the solid
wall does essential work), and *nearly* self-similar (the solution approaches a
self-similar profile under controlled perturbation, it is not exactly
self-similar). A reader who states the result without these qualifiers has
committed the exact error this pack trains against.

**Accessibility note.** You do not need to solve a PDE. You need to hold the
difference between "a computer *simulated* something that looks like blowup"
(Hou–Luo, 2014) and "a computer *certified* the inequalities a proof of blowup
requires" (this result, 2022–2025), and to track which hypotheses (axisymmetry,
boundary) the conclusion actually rests on. Comfort with the idea of an
*inequality with an explicit error bound* is enough; the fluid dynamics is
background, the reasoning about certified computation is the exercise.

## history

The smooth-data finite-time singularity question for 3D Euler is one of the
oldest open problems in partial differential equations, entangled with the
regularity of Navier–Stokes (a Clay Millennium problem) and with the theory of
turbulence. For most of the 20th century, partial-regularity results and
physical intuition leaned *against* blowup from nice data — constructing a
singularity from smooth initial data was widely expected to be impossible or at
least out of reach.

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
- **Dead end — expecting a short, human-surveyable proof.** The constants that
  decide blowup (a residual ε against a stability threshold) are not obtainable
  by hand; there is no pen-and-paper argument that closes the required
  inequality. A search for a fully human-checkable proof of this specific result
  is a dead end — the certification is irreducibly computational.

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

**How verified.** Peer review (Part II in SIAM MMS; the PNAS review vouched for
by four named senior PDE mathematicians) plus the internal structure of a
computer-assisted proof: an analytic reduction (Part I) whose sufficient
inequalities are then certified by rigorous numerics with machine-tracked
discretization and round-off error (Part II).

**First-party check.** Read directly: the PNAS review (open access), the arXiv
abstracts and statements of Parts I and II, and the SIAM MMS publication record
for Part II. **Could not confirm:** that the MATLAB / interval-arithmetic
verification code is publicly deposited — the PNAS data-availability statement
reads "There are no data underlying this work," and no public code repository
was located. This pack therefore does **not** claim a downloadable
reproducibility artifact; the checkable object is the peer-reviewed mathematical
argument, not a runnable code drop.

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
  verifiable trust claims: (a) the analytic reduction is correct (human proof,
  peer-reviewed); (b) the validated-numerics method soundly bounds error
  (methodology, peer-reviewed); (c) the specific computation ran correctly
  (machine-checkable by design, not eyeballed). Trust is distributed across all
  three, not placed in a single human reading. Check: Part II is peer-reviewed
  in SIAM MMS; the computation is designed to be machine-verifiable rather than
  hand-checked.

## breakthrough

**S3 is the breakthrough — the analytic reduction that makes the computation
*sufficient*.** The decade-long obstacle after Hou–Luo (2014) was not the lack
of a simulation; it was that no simulation, however fine, constitutes a proof.
The move that broke it was building a stability framework (Part I) proving that
a *finite, certifiable* list of inequalities on an *approximate* profile is
enough to force blowup of the *true* solution — converting an infinite,
uncertifiable question into a finite, machine-certifiable one. It eluded the
community because the natural instinct was to chase an exact self-similar profile
or a sharper simulation; the non-obvious leap was to stop demanding exactness and
instead rigorously control the *gap* between an approximate profile and a true
solution, so that a computer's certified error bounds close the proof. The scope
qualifiers (axisymmetric, with boundary, nearly self-similar) are not
footnotes — they are the precise conditions under which this reduction closes.

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
  designed to be *machine-checkable* rather than eyeballed; reviewers vouch for
  the analytic framework and the validated-numerics methodology, and the
  computation's correctness is a mechanical rather than a human-reading claim.
  This is the honest place to locate trust — and the pack flags that the code
  artifact's public availability could not be confirmed, so "independently
  re-run it yourself" is not currently an option a reader can exercise.
