# Expedition Pack: Three Keys, One Lock — the Fall of the Jacobian Conjecture

`pack_id: jacobian-conjecture-counterexample`

In July 2026, one short polynomial formula supplied a counterexample to the
general Jacobian conjecture. The discovery process is not public enough to
audit. The mathematical result is: the displayed formula and three fraction
points let you check the decisive claims directly. This pack keeps those two
evidence tracks separate.

## problem

**The summit.** A polynomial map is a machine that takes a list of numbers and
returns a list of numbers using only finite additions and multiplications. For
a map \(F:\mathbb C^n\to\mathbb C^n\), its *Jacobian determinant* is a local
no-squash gauge: a nonzero reading means that, near that input, the map has a
local reverse.

The Jacobian conjecture said that if this gauge is the same nonzero constant at
**every** point, then the polynomial machine has a polynomial reverse map
everywhere. In particular, two different inputs could never share one output.
The load-bearing inventory is: a square polynomial map
\(F:\mathbb C^n\to\mathbb C^n\) with the same input and output dimension; a
Jacobian determinant that is one *nonzero constant* at *every point*; and the
conclusion that \(F\) has a **global polynomial inverse** over the
complex-number domain. None of those conditions is date-qualified.

The counterexample is the map \(F:\mathbb C^3\to\mathbb C^3\)

```text
F(x, y, z) = (
  (1 + xy)^3 z + y^2(1 + xy)(4 + 3xy),
  y + 3x(1 + xy)^2 z + 3xy^2(4 + 3xy),
  2x - 3x^2y - x^3z
)
```

Its Jacobian determinant is the constant \(-2\). Yet it sends these three
different inputs

```text
(0, 0, -1/4),  (1, -3/2, 13/2),  (-1, 3/2, 13/2)
```

to the same output, \((-1/4,0,0)\). Three keys reach one lock, so no global
reverse can exist. The component degrees are \(7,6,4\), making the map's total
degree \(7\).

**Accessibility note.** The hands-on work needs fraction arithmetic, patience,
and optionally a computer-algebra tool. Take one concept on trust: why a
nonzero Jacobian determinant means a local reverse. You do not need to learn
the determinant formula or complex analysis to audit the collision and rerun
the exact identity check.

The no-squash metaphor has a precise break. On the real-number slice, the
negative sign in \(-2\) can be pictured as a mirror flip with a factor-two
local volume stretch. Over the conjecture's complex-number domain, that
orientation picture has no literal meaning. For the refutation, the
load-bearing fact is only that the determinant is the same **nonzero** constant
everywhere.

## history

The modern conjecture is conventionally associated with Ott-Heinrich Keller's
1939 formulation. A 2026 historical study found the exact two-variable
statement already in Ludwig Kraus's 1884 paper, whose final proof step was
flawed. The counterexample appeared 87 calendar years after Keller's paper, but
the question's documented ancestry is older. Stephen Smale listed it as
Problem 16 in his 1998 list of problems for the next century.

Valid partial results narrowed particular regions without settling the whole
claim:

- In one variable the conjecture is easy: the fundamental theorem of algebra
  says every nonconstant one-variable polynomial over \(\mathbb C\) has a
  complex root. A polynomial derivative with no complex zero must therefore be
  constant, so the original map is linear.
- Wang proved the conjecture for maps of total degree at most two in every
  dimension over *characteristic zero* — number systems, including
  \(\mathbb C\), where repeatedly adding \(1\) never returns to \(0\).
- Bass, Connell, and Wright showed that the all-dimensions problem can be
  reduced, after adding variables and changing coordinates, to maps whose
  nonlinear terms are *cubic homogeneous*, meaning every such term has total
  degree three. Drużkowski narrowed that target, still after the
  *stabilization* step of adding variables, to *cubic-linear* maps whose
  nonlinear part is built from cubes of linear expressions. These are
  reductions, not proofs in a fixed dimension.
- For the still-open plane case, Moh's 1983 work supplied the degree-100
  *frontier*, a proved range in which no counterexample can occur. A 2022
  preprint says it confirms that bound and shows that below maximum degree 125
  only degree pairs \((72,108)\) and \((108,72)\) survive. Those results concern
  two variables only; they do not describe where searches did or did not look
  in three variables.

**Known dead ends and why they failed:**

- **Kraus's 1884 proof attempt.** The 2026 source study identifies a failure in
  the final *analytic step at infinity*, the part meant to control what happens
  as variables grow without bound: Kraus differentiated
  \(x(s)=s^{-m}\) at \(s=0\), where that derivative is undefined. The statement
  survived; the attempted bridge to a global inverse did not.
- **Segre's published incomplete arguments.** Bass, Connell, and Wright explain
  two concrete global gaps: an everywhere nonsingular differential makes a map
  an *immersion* — locally well-behaved — but does not make it globally
  one-to-one; and a covering-space conclusion was used without establishing
  *properness*, the condition that prevents points from escaping to infinity.
  Both routes tried to infer a global inverse from insufficient local control.
- **Proof preprints later withdrawn by their authors.** Varshavsky withdrew
  arXiv:math/9912196 because of an error in Proposition 2.13; Kuo,
  Parusiński, and Păunescu withdrew arXiv:math/0509431 because of an error in
  Section 7. A public proof-shaped object is not a settled result once its
  load-bearing step fails.

## solution_provenance

**Mathematical result — independently verified.** On 2026-07-24, the displayed
map was checked with exact rational arithmetic using Python 3.11 and SymPy
1.14.0. The calculation returned component degrees \((7,6,4)\), determinant
exactly \(-2\), and the same output \((-1/4,0,0)\) at all three stated inputs.
This finite identity and collision establish the counterexample without relying
on any story about how it was found.

A reader can rerun the core check:

```python
import sympy as s
x, y, z = s.symbols("x y z")
F = s.Matrix([
    (1+x*y)**3*z + y**2*(1+x*y)*(4+3*x*y),
    y + 3*x*(1+x*y)**2*z + 3*x*y**2*(4+3*x*y),
    2*x - 3*x**2*y - x**3*z,
])
assert s.factor(F.jacobian((x, y, z)).det()) == -2
points = [(0, 0, -s.Rational(1, 4)),
          (1, -s.Rational(3, 2), s.Rational(13, 2)),
          (-1, s.Rational(3, 2), s.Rational(13, 2))]
assert {tuple(v.subs(dict(zip((x, y, z), p))) for v in F)
        for p in points} == {(-s.Rational(1, 4), 0, 0)}
```

**Public announcement and process boundary.** Levent Alpöge posted the formula
late on 2026-07-19 in the local-date convention (2026-07-20 UTC):
https://x.com/__alpoge__/status/2079028340955197566. The post thanks a friend
identified only as “akhil” for asking and credits **Fable** with working during
the World Cup final; the post does not identify a model version. That public
attribution does not reveal prompts, transcripts, intermediate attempts,
steering, autonomy evidence, or a division of labour. No Alpöge-authored arXiv
write-up was located in a primary-source search completed on 2026-07-24. Shaska
(https://arxiv.org/abs/2607.20210) and Long
(https://arxiv.org/abs/2607.18186) are independent follow-ups, not discovery
records.

**Sources checked for the historical claims.**

- Keller (1939), doi:10.1007/BF01695502.
- Rodríguez Díaz (2026), doi:10.5802/crmath.831, with the Kraus scan at
  https://archive.org/details/sitzungsbericht398klasgoog/page/820.
- Smale (1998), doi:10.1007/BF03025291.
- Wang (1980), doi:10.1016/0021-8693(80)90233-1.
- Bass, Connell, and Wright (1982),
  doi:10.1090/S0273-0979-1982-15032-7.
- Drużkowski (1983), doi:10.1007/BF01459126.
- Moh (1983), doi:10.1515/crll.1983.340.140, with the later plane-bound
  account at https://arxiv.org/abs/2204.14178.
- Tao's 2026-07-21 mathematical digestion, which reproduces the formula and
  states that the \(n=2\) case remains open:
  https://terrytao.wordpress.com/2026/07/21/a-digestion-of-the-jacobian-conjecture-counterexample/.
- The two author-withdrawn proof records:
  https://arxiv.org/abs/math/9912196 and
  https://arxiv.org/abs/math/0509431.

Publisher pages, original scans, author-hosted material, and arXiv records were
used rather than press summaries. Only negative claims about the missing
discovery write-up, unpublished process details, and the open two-variable case
are search-bounded to 2026-07-24. The displayed algebraic identity and collision
are exact checks, not “as of” claims.

## step_graph

- **S0 — Fix the exact claim before celebrating its fall.** `search_first`
  Write down the domain, the polynomial condition, “nonzero constant,” “every
  point,” and “polynomial reverse.” Check the original announcement, the exact
  formula, and a current primary source for the two-variable status. This stops
  “the general claim is false” from mutating into “every dimensional case is
  settled.”

- **S1 — Split the refutation into two load-bearing halves.**
  `lemma_decomposition` Half A is global failure: different inputs share an
  output. Half B is local qualification: the Jacobian determinant is the same
  nonzero constant everywhere. Delete either half and the conjecture is not
  refuted. Squaring already creates a collision, but its derivative vanishes at
  zero, so it fails Half B.

- **S2 — Check the easy key first.** `small_case_probe` Substitute
  \((0,0,-1/4)\). Nearly every term vanishes, leaving
  \(F(0,0,-1/4)=(-1/4,0,0)\). Check each coordinate separately and name which
  terms disappeared.

- **S3 — Climb the other two keys.** `small_case_probe` Substitute
  \((1,-3/2,13/2)\) and \((-1,3/2,13/2)\) with exact fractions. Both reach the
  same output. You have now established global non-injectivity without taking
  anyone's authority on trust.

- **S4 — Separate sampling from an identity.** `kill_criteria` Evaluate the
  Jacobian determinant at several chosen points. Decide in advance what would
  kill the claim “it is always \(-2\)”: one different value. If every sample
  says \(-2\), the claim has survived tests but is not yet proved; an untested
  point could still differ.

- **S5 — Settle the local half exactly.** `milestone_rewrite` Run or inspect
  the symbolic determinant calculation. Expansion and cancellation leave the
  polynomial identity \(\det JF\equiv-2\), which covers every point at once.
  Record the trust boundary: you can inspect the code, rerun it in another
  algebra system, or expand by hand; random samples alone never earn the word
  “identically.”

- **S6 — Split result truth from discovery provenance.**
  `representation_shift` Put the evidence in three frames: the algebraic
  witness says whether the formula is a counterexample; the public post records
  an attribution to Fable without identifying a model version; and only private
  workflow records could show who supplied which idea or how much human
  steering occurred. Do not use evidence from one frame to answer a question in
  another.

- **S7 — Rewrite the surviving scope.** `milestone_rewrite` The unrestricted
  conjecture is false in dimension three and, by adjoining untouched identity
  coordinates, in every dimension at least three. As of the 2026-07-24
  primary-source search, the unrestricted two-variable case remains open.
  State both sentences together.

## breakthrough

**S1 is the pack's reasoning breakthrough:** once a candidate witness is in
hand, a famous universal conjecture collapses into two independent finite
checks, collision and constant nonzero Jacobian.

This is not a claimed reconstruction of the discovery. The one-sentence
historical account the sources support is deliberately limited: established
one-variable, quadratic, reduction, and plane-degree results did not rule out
this three-variable degree-seven map, while the unpublished search record does
not tell us why it was missed. Claims that “nobody looked there,” that the field
expected only enormous counterexamples, or that a particular search strategy
found it would go beyond the available evidence.

## audit_targets

- **T1 — Are both halves really necessary?** *Objection:* Three inputs reaching
  one output already proves the map is not reversible, so the determinant is
  decoration. *Resolution:* A collision refutes only maps that satisfy the
  conjecture's hypothesis. Squaring has a collision too, but its derivative is
  zero at the origin. The counterexample needs both the collision and the
  constant nonzero determinant.

- **T2 — Did spot checks prove “everywhere”?** *Objection:* Ten determinant
  evaluations all returned \(-2\), which is enough evidence. *Resolution:*
  Samples can expose a failure but cannot establish a polynomial identity. The
  symbolic cancellation to \(-2\) is the complete check; sampling is only a
  probe.

- **T3 — What exactly is now false?** *Objection:* The Jacobian conjecture is
  dead, so the two-variable problem is dead too. *Resolution:* The example
  directly settles dimension three negatively and extends to higher dimensions
  with identity coordinates. It does not produce a two-variable example. The
  unrestricted plane case remained open in the primary-source search dated
  2026-07-24.

- **T4 — Does the mirror-flip story carry the mathematics?** *Objection:* A
  negative determinant explains the three-to-one collision. *Resolution:* The
  sign picture is only a real-slice metaphor and has no literal complex
  orientation meaning here. Nor does any nonzero local determinant explain a
  global collision. The load-bearing condition is constant and nonzero; the
  collision is checked separately.

- **T5 — Did Fable discover the counterexample autonomously?** *Objection:* The
  announcement proves that an identified model independently found it.
  *Resolution:* The announcement's algebra proves nothing about the private
  workflow. It publicly credits Fable, but supplies no model-version identifier,
  prompt, transcript, failed attempts, steering record, autonomy evidence, or
  division of labour. The attribution is reported; the mathematical
  counterexample is verified; the stronger autonomous-process claim is not.

Role fit: auditor first, with a climber ridge in S2–S3. Forecasting is out of
scope, so there is no `calibration_key`.
