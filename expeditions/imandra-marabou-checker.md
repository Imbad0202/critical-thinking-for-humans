# Expedition Pack: A Verified Checker for a Neural-Network Verifier (Auditor)

`pack_id: imandra-marabou-checker`

Neural networks are opaque, and the tools that *verify* them — that prove a
network can't be fooled within some bound — are themselves large, floating-point
C++ programs that can have bugs. So who verifies the verifier? In 2025 a team
(Desmartin, Isac, Passmore, Komendantskaya, Stark, Katz; ITP 2025) answered the
practical version: don't verify the whole verifier, verify a small *checker* that
re-checks each of the verifier's proofs, and prove that checker sound inside a
theorem prover. You audit this trust-migration structure — a fast untrusted
verifier emits a proof certificate, a proven-correct checker re-checks it — and,
harder, you hold three loaded ideas to their exact scope: what "verified" covers,
what it does *not* cover, and where the trust actually bottoms out. The
load-bearing discipline is that proving the checker sound guarantees *accepted
certificates are valid* — and says nothing about whether the formal query matches
the engineer's real intent, whether the whole verifier is now trustworthy, or
whether any trust was truly eliminated rather than moved.

## problem

**The summit.** A deep-neural-network verifier (here, Marabou) takes a network
and a property — for example, "no small perturbation of this input flips the
classification" — and answers SAT (the property can be violated; here is a
counterexample) or UNSAT (the property holds; no violating input exists). The SAT
answer is easy to trust: plug the counterexample back into the network and see it
fail. The UNSAT answer is the hard one — it asserts that *no* violating input
exists anywhere in a continuous space, and that is exactly the answer that
certifies safety. The summit is: make the UNSAT answer trustworthy without having
to trust the sprawling verifier that produced it.

**What was built, and the claims to audit.** Rather than verify Marabou itself —
which the authors call close to infeasible — the team re-implemented Marabou's
*certificate checker* as a small functional program inside Imandra (a theorem
prover: software that mechanically checks a proof step by step, here using exact
arithmetic instead of the rounding-prone floating-point numbers a fast verifier
runs on) and proved it sound: a machine-checked theorem stating that if the
checker accepts a certificate, the verification query genuinely has no solution —
the property genuinely holds. The result is real and peer-reviewed, but three
headline claims each need pinning:
- *Verified* — the *checker* is verified, not Marabou. Marabou stays untrusted and
  can be arbitrarily buggy; only individual UNSAT results *that carry a passing
  certificate* become trustworthy.
- *Trust eliminated* — trust is *migrated*, not eliminated. It moves off a large
  floating-point C++ verifier onto (a) the checker's soundness theorem and (b)
  Imandra's own small logical kernel. The kernel is still trusted.
- *Property proven* — proven of the *formal query* (a system of linear
  constraints), not yet formally connected to the engineer's original network and
  intended property. That last link is the paper's stated future work.

**Accessibility note.** No neural-network math, no Farkas lemma, no Lean or
Imandra syntax needed. Hold two verification tracks apart: a **machine soundness
theorem** guaranteeing *the checker only accepts valid certificates*, and the
**judgment the theorem cannot make** — whether the formal query is the real
problem, whether the whole verifier is covered, and where trust ultimately rests.
Comfort with one idea is enough: a proof can be perfectly sound about a narrow
statement while the interesting doubt lives *outside* what it proves. The
neural-network machinery is background; the trust-migration audit is the exercise.

## history

Verifying neural networks became urgent as they entered safety-critical settings
(medical, aviation, autonomous vehicles) where a silent failure has real cost.
Verifiers like Marabou emerged to prove robustness properties mathematically. But
a verifier is itself software — large, optimized, floating-point — and the
literature already documented that such verifiers can be *fooled*: prior
peer-reviewed work showed complete verifiers giving wrong answers through
floating-point numerical error. So the milestone here is not a new verifier; it
is a *trust structure* — proof-carrying results plus a proven checker — imported
from the community that builds automated logic solvers (the SAT/SMT solvers used
to settle huge yes/no logic problems), where this pattern is already standard,
into neural-network verification. The reasons
the naive readings fail are the teaching context.

- **Dead end — just trust the verifier because it's widely used.** A mature,
  competition-winning verifier still runs floating-point arithmetic and complex
  heuristics, and published attacks exploit exactly that to make it certify false
  things. Dead end because usage and reputation are not soundness; a wrong UNSAT
  is silent by construction — there's no counterexample to catch it.
- **Dead end — verify the whole verifier directly.** Formally prove Marabou itself
  correct, end to end. The authors judge this close to infeasible: it is a large,
  multi-platform C++ system built for speed, not for proof. Dead end because the
  artifact that is fast enough to use is too big and too optimized to verify — the
  reason the checker approach exists.
- **Dead end — treat a soundness proof of the checker as a proof about the real
  network.** The theorem is about a formal query (a constraint system). Whether
  that query faithfully encodes the actual network and the property the engineer
  cared about is a *separate* question the proof does not touch — and the authors
  name lifting the guarantee to the real-network level as open future work. Dead
  end because internal soundness is not spec-fidelity; a sound checker can accept
  a valid certificate for the *wrong* question.
- **Dead end — read "verified checker" as "no more trust needed."** The proof does
  not remove trust; it concentrates it. You now trust the soundness theorem and
  Imandra's kernel instead of Marabou's C++. That is a far smaller, more
  scrutinized target — a genuine win — but it is a *smaller* trusted base, not an
  empty one. Dead end because "verified" invites hearing "zero trust," and the
  honest claim is "trust moved to a place worth trusting more."

## solution_provenance

**Where the solution lives.** Primary source: R. Desmartin, O. Isac, G. Passmore,
E. Komendantskaya, K. Stark, G. Katz, "A Certified Proof Checker for Deep Neural
Network Verification in Imandra," 16th International Conference on Interactive
Theorem Proving (ITP 2025), LIPIcs Vol. 352, Article 1, pp. 1:1–1:21,
doi:10.4230/LIPIcs.ITP.2025.1; preprint arXiv:2405.10611. The proof artifact is
the public Imandra development at github.com/rdesmartin/imandra-marabou-proof-checking.

**How verified — two things, stated precisely.**
- *Peer review.* This is a genuine peer-reviewed publication at ITP, the flagship
  interactive-theorem-proving conference, published in Dagstuhl's LIPIcs series —
  not an arXiv-only preprint. That establishes the result is real and vetted.
- *Machine-checked soundness.* The core soundness theorem — if the checker accepts
  a certificate, the verification query has no solution — plus its supporting
  lemmas are proven inside Imandra. Imandra is built so that every proof it accepts
  is re-checked by one small, heavily-scrutinized core (the design tradition that
  keeps the trusted part tiny is called LCF-style), so trusting its results means
  trusting that small core rather than the whole large program. The development is
  public and re-checkable: the paper enumerates it (~2100 lines of Imandra code,
  hundreds of auxiliary lemmas) module by module, and the repository gives concrete
  reproduction steps. Imandra also uses exact (arbitrary-precision) arithmetic
  rather than floating-point, which closes the rounding-error hole that afflicts
  the original C++ checker.

**Where the guarantee does and does not come from.** The rigorous correctness
guarantee comes from the Imandra soundness proof; peer review establishes the
result is real and the framing sound. The trusted base is (a) the soundness
theorem's faithfulness and (b) Imandra's kernel — stated honestly, not zero.

**First-party check.** Read directly: the full LIPIcs PDF (all 21 pages), the
arXiv abstract and preprint, and the GitHub repository README with its
reproduction steps and citation file. Confirmed first-party: the soundness
theorem's statement and its proof chain, the peer-reviewed ITP 2025 venue and
DOI, the exact-arithmetic advantage, the ~4.5×–4.8× checking slowdown versus the
native C++ checker (the honest cost of exact arithmetic and proof-oriented data
structures), and the explicit scope limits below. **Could not verify
first-party:** whether the development carries literally zero admitted lemmas
("0-sorry") — the paper states the theorems as proven and enumerates the code but
prints no explicit admit-count, so this pack says "machine-checked in Imandra; no
admit-count is stated," not "0-sorry"; and the repository's software license,
which is unstated (the paper is CC-BY, the code's license is not declared).

## step_graph

- **S0 — Read the paper and locate the actual theorem before trusting the
  headline** `search_first` Retrieve the ITP 2025 paper and the public Imandra
  repository before accepting "the neural-network verifier is now verified."
  Separate the distinct claims: (a) the checker's soundness theorem holds, (b) it
  makes Marabou's UNSAT results trustworthy, (c) it verifies Marabou itself, (d)
  it removes the need for trust. *Check:* the paper states the soundness theorem
  and the trust-migration framing; the Imandra development is public and its scope
  is enumerated.
- **S1 — Split the two tracks and name what each covers** `lemma_decomposition`
  Decompose "is an UNSAT answer trustworthy?" into two guarantees that do not
  subsume each other: the soundness proof guarantees *an accepted certificate is
  valid* (internal correctness), while a separate judgment must establish *that
  the formal query is the real problem and that a certificate exists at all*
  (fidelity and coverage). *Check:* the theorem covers accepted-certificate
  validity; it says nothing about whether the query faithfully encodes the
  engineer's network and property — the paper flags that link as future work.
- **S2 — Reframe "verified verifier" as "verified checker of the verifier's
  proofs"** `representation_shift` Shift from "Marabou is now verified" to
  "Marabou stays untrusted; a proven checker re-checks each UNSAT certificate it
  emits, and only certified results are trusted." The fast, buggy-tolerant verifier
  and the small, proven checker are different artifacts doing different jobs.
  *Check:* the paper's trust model makes Marabou the untrusted producer and the
  Imandra checker the trusted consumer; a wrong UNSAT from Marabou either yields no
  passing certificate or is rejected by the checker.
- **S3 — Audit the trusted base as the real trust boundary** `small_case_probe`
  Probe the smallest concrete trust artifact: what is left to trust after the
  proof? Not Marabou — but yes the soundness theorem's faithfulness and Imandra's
  kernel. *Check:* the trust does not vanish; it lands on a small LCF-style kernel
  reused across many proofs and on the exact-arithmetic checker, a far smaller and
  more scrutinized target than a large floating-point C++ verifier — the honest
  end of the regress, named rather than hidden.
- **S4 — Pin "verified" to its exact coverage** `kill_criteria` Set the
  disqualifiers for over-reading "verified": the claim is defeated if taken to mean
  Marabou is proven correct, if taken to cover the SAT branch (it is checked in the
  network, out of scope here), or if taken to cover all of Marabou's output.
  *Check:* only the UNSAT branch is covered; some verifier optimizations were
  disabled and only certificates under a size bound were evaluated; some dynamic
  bound-tightening steps are implemented but their soundness is not yet certified —
  so "all of Marabou is verified" is the reading to kill.
- **S5 — Which other field audits this exact shape?** `shape_question` The shape is
  "an untrusted fast engine, a checkable certificate, and a proven checker" —
  identical to how the SAT/SMT community already trusts solvers (a solver emits a
  proof certificate; a formally-verified checker re-checks it) and how theorem
  provers trust external SMT solvers. Borrow that discipline: trust the checker's
  proof; interrogate the *statement* it certifies and the *coverage* it claims.
  *Check:* the locus of doubt is not the checker's proof term but the query's
  fidelity to the real network and the fraction of verifier output actually
  covered — the same place doubt lives for verified compilers and certified SAT
  solving.
- **S6 — Recast the summit as the sentence that survives audit** `milestone_rewrite`
  Final defensible claim: "A proven-correct checker, machine-checked in Imandra
  with exact arithmetic and peer-reviewed at ITP 2025, re-checks Marabou's UNSAT
  certificates, so each UNSAT result carrying a passing certificate is
  trustworthy — while Marabou stays untrusted, the SAT branch and some verifier
  output are out of scope, the formal-query-to-real-network link is open future
  work, and trust now rests on the checker's theorem and Imandra's kernel rather
  than on Marabou's C++." *Check:* every clause traces to a first-party source;
  drop any and you either lose information or introduce an overclaim.

## breakthrough

**The breakthrough to audit is not a mathematical one — it is the trust-migration
structure (S1 and S2), and its hinge is realizing that verifying a *checker* is a
different and more practical result than verifying the verifier.** The prior
reflex in "can we trust this verifier?" is to argue about the verifier's own
correctness — hopeless for a large floating-point C++ system. The move here is to
leave the verifier untrusted, have it emit a proof certificate for each UNSAT
result, and prove correct only the small checker that re-checks those
certificates. The moment the checker's soundness is mechanical, the contestable
claims migrate *outward* — to whether the formal query is the real problem
(spec-fidelity), whether coverage is complete (only the UNSAT branch, only some
output), and where trust bottoms out (the checker's theorem and Imandra's
kernel). What makes this a milestone is not that neural-network verification is
hard but that trust in an opaque, fast verifier of an opaque, learned model can be
migrated onto a small proven artifact; and what makes it *auditable* is that the
proof is silent on exactly the three things — fidelity, coverage, residual trust —
where the real doubt lives. The discipline the pack trains is refusing to let a
sound checker launder into a "verified verifier."

## audit_targets

- **T1 — "If Imandra verified the checker, who verifies Imandra?"** *Objection:*
  you haven't eliminated trust, you've relocated it to Imandra's kernel, which is
  itself software and could be buggy — an infinite regress. *Resolution:* correct,
  and this is the right answer, not a defeat. Trust migration is the goal: you
  replace trust in a large, floating-point, heuristic-laden C++ verifier with
  trust in a ~2000-line checker whose soundness is a theorem plus Imandra's small
  LCF-style kernel — a far smaller, more scrutinized, reused-across-many-proofs
  base. The regress bottoms out at the kernel by design, the standard structure of
  all proof-checked verification. A good auditor names the residual trusted base
  precisely rather than claiming "zero trust."
- **T2 — "The checker is sound, so the network's real property is proven."**
  *Objection:* a machine-checked soundness theorem settles it. *Resolution:*
  soundness is relative to the *formal query* — a system of linear constraints —
  not to the engineer's actual network and intended property. Whether the query
  faithfully encodes that intent is a separate, load-bearing question the theorem
  does not touch, and the authors name lifting the guarantee to the real-network
  and specification-language level as explicit future work. This is the
  formalization gap: a sound checker can accept a valid certificate for the wrong
  question. Soundness ≠ spec-fidelity.
- **T3 — "So Marabou is now formally verified."** *Objection:* a verified checker
  for Marabou's proofs means Marabou is verified. *Resolution:* no — the checker is
  verified, Marabou is not, and it stays untrusted by design. The value is precisely
  that Marabou can be arbitrarily buggy: a wrong UNSAT either produces no passing
  certificate or is rejected by the proven checker. The correct claim is "each
  UNSAT result *with a passing certificate* is trustworthy," never "Marabou is
  correct." Conflating the two is the central overclaim to refuse.
- **T4 — "A wrong answer from Marabou would be caught, so coverage is total."**
  *Objection:* the checker guards every answer. *Resolution:* coverage is partial,
  not total. Only the UNSAT branch is checked here — the SAT branch is verified
  directly in the network and is out of scope. Some verifier optimizations were
  disabled for the evaluation, only certificates under a size bound were checked,
  and some of Marabou's dynamic bound-tightening steps are implemented but their
  soundness is not yet certified. So a correct UNSAT for which no checkable
  certificate is produced simply goes uncertified — the checker addresses
  soundness, not completeness or full coverage.
- **T5 — "This is a superhuman / AI-generated verification feat."** *Objection:*
  an AI system proved something beyond human reach. *Resolution:* no — the
  soundness proof is a human formal-methods result, built by a six-person team over
  a substantial Imandra development; nothing claims an AI produced it or that it
  exceeds human capability. The "beyond a single human" angle is honest only about
  the *audited object and its scale* — the thing being checked is a learned neural
  network and its automated verifier, whose UNSAT arguments reach machine-scale
  case-split trees (certificates up to several megabytes) that no human hand-checks
  — not about the proof method. Frame the "beyond" as the machine-scale AI artifact
  under audit, and do not overclaim the verification itself as superhuman.
