# Expedition Pack: The Materialized Connect-Four Oracle (Climber)

`pack_id: connect-four-bdd-oracle`

A game-solving climb with a twist the title hides: Connect Four's *value* was
settled in 1988 — first player wins — so the 2025 result is not "solving the
game." What was believed infeasible, and what this achieves, is *materializing
the full strong solution*: a single stored look-up table giving the win / draw /
loss value of every reachable position, built by symbolic search on one desktop
CPU core. You climb from "a strong solution exists in theory" up to "it fits on a
consumer machine," and the load-bearing discipline is separating what was already
known (the value) from what is new (the stored oracle), and holding a preprint's
claims to exactly what its open artifacts support.

## problem

**Statement.** Connect Four is the standard 7-column × 6-row drop game; four in a
row wins. A game is *weakly* solved when the value of the opening position is
known (with a winning strategy); it is *strongly* solved when the value —
win, draw, or loss under perfect play — is known for *every* reachable position.
The 2025 result: a complete strong solution of 7×6 Connect Four in the form of a
materialized **look-up table**, produced by symbolic Binary Decision Diagram
(BDD) search — an 89.6 GB uncompressed oracle built in 47 hours on a single
consumer CPU core.

**What is and isn't new — the whole point of the climb.** Connect Four's *value*
(first player wins with perfect play, by playing the center) has been known since
1988. This result does not discover that. What it does is produce the *full
stored per-position oracle* that was "believed to be infeasible" to materialize —
prior work (Tromp) had a database of values for all 8-ply positions, which
effectively allowed strong play via a short search, but not a single complete
look-up table for all reachable positions. The honest claim is "first complete
*materialized* strong-solution table," not "first to strongly solve." Getting
that distinction right is the audit the pack trains.

**Accessibility note.** You do not need to run a BDD or solve a game. You need to
hold three separations: *weak* value (known 1988) vs *strong* per-position oracle
(the new artifact); *symbolic* search over sets of positions vs *explicit*
enumeration one position at a time; and an *algorithm* that is exact by
construction vs an *implementation* whose credibility rests on cross-checks, not
a formal proof. Comfort with the idea that a compressed data structure can stand
in for a set of ~4.5 trillion positions is enough; the BDD internals are
background, the separations are the exercise.

## history

Connect Four's value was settled in 1988: James Allen first, and Victor Allis
independently about 15 days later, established that the first player wins with
perfect play. Both were *weak / knowledge-based* solutions — they proved the
opening value and a winning strategy; neither produced a stored win/draw/loss
table for every position. That distinction is where the 2025 work lives.

- **Dead end — "the game is already solved, so a stored oracle is trivial."** A
  dead end because knowing the *value* (1988) is not the same as *materializing*
  the full per-position table. The naive way to store it — one value per position
  explicitly — runs into ~4.5 trillion positions, and Edelkamp & Kissmann proved
  that for a natural encoding the number of nodes needed to encode all positions
  scales exponentially. Storing the complete table was, on that basis, "believed
  infeasible."
- **Dead end — "just enumerate every position explicitly, like other solved
  games."** Explicit retrograde enumeration (the approach used for larger solved
  games) traverses one state at a time; at 4.5 trillion positions this is the
  infeasibility barrier itself. Treating explicit enumeration as the only route
  to a stored oracle is the dead end the symbolic method steps around.
- **Dead end — "a strong solution needs a supercomputer / massive parallelism."**
  A dead end assumption here: the 2025 solve ran the main computation on a
  *single* core of a consumer desktop CPU (an AMD Ryzen 5950X, 128 GB RAM) in 47
  hours. The obstacle was never raw compute — it was finding a *representation*
  compact enough that the exact table fits and builds on one machine.

## solution_provenance

**Where the solution lives.** Primary source: Markus Böck, "Strongly Solving 7×6
Connect-Four on Consumer Grade Hardware," arXiv:2507.05267 (submitted 1 July
2025), HTML at https://arxiv.org/html/2507.05267v1. The oracle is deposited on
Zenodo (DOI 10.5281/zenodo.14582823, "Connect4 7×6 Strong Solution," 18 Jan 2025,
CC BY 4.0, Open Access); the solver code is at
github.com/markus7800/Connect4-Strong-Solver.

**How verified — and its honest limits.** This is an **arXiv preprint, not a
peer-reviewed publication** (no journal reference; the author's own page lists it
as a personal project). It is not retracted and is backed by real, downloadable
artifacts, but the REAL bar is met as an *artifact-verified preprint*, not a
published result. Correctness rests on two legs, stated precisely:
- *The algorithm is exact.* A BDD symbolic retrograde solve propagates
  win/draw/loss classifications backward from the ply-42 terminal positions using
  exact Boolean set operations; there is no search heuristic or probabilistic
  step. (The characterization "correct by construction" is an accurate
  description of this *algorithm* — it is not a phrase the paper itself uses, and
  it does not certify the *implementation*.)
- *The implementation is cross-checked, not formally proved.* The BDD library is
  the author's own C code with no external proof and no DRAT-style certificate.
  Its credibility comes from independent consistency checks the paper reports: it
  reproduces the unique-position counts of Tromp and of Edelkamp & Kissmann, it
  re-confirms the known 1988 result ("first player wins in 41 plies by playing in
  the center") in 9.2 seconds, and its partial table agrees with a prior partial
  solution. Strong evidence — but "exact algorithm plus independent consistency
  checks," never "formally verified."

**First-party check.** Read directly from arXiv:2507.05267 (HTML), the Zenodo
record, and the GitHub repo: strong solution of standard 7×6; look-up table of
89.6 GB *uncompressed* (the stored oracle's raw size); 47 hours on a single AMD Ryzen 5950X core with
128 GB RAM; ~4.5 trillion positions across all plies; symbolic-BDD retrograde
method; cross-checks against Tromp and Edelkamp & Kissmann. **Stated honestly:**
the Zenodo *download* is a 46.8 GB compressed 7z archive, not an 89.6 GB file —
89.6 GB is the raw uncompressed size. And the GitHub code has **no license
file** (technically all-rights-reserved by default), even though the paper calls
it open-source; the paper is CC BY-SA and the Zenodo data is CC BY, but the code
is publicly *visible*, not open-source *licensed*. I did not run the solver or
re-derive the oracle; the figures are quoted from the sources.

## step_graph

- **S0 — Read the artifacts before trusting "solved"** `search_first` Fetch the
  arXiv paper, the Zenodo deposit, and the code before accepting either "Connect
  Four solved (2025)" or "nothing new since 1988." The claim lives in the
  abstract with its real qualifier — a stored strong-solution *look-up table*,
  which "was believed to be infeasible." Check: the abstract states the game was
  already solved mathematically and that the new object is the look-up table;
  Zenodo hosts the downloadable oracle.
- **S1 — Separate weak value from strong oracle** `shape_question` Reframe "did
  they solve Connect Four?" into "what *kind* of object is the answer?" Weak = the
  opening value (first player wins), known 1988. Strong = the value of *every*
  reachable position. The 2025 artifact is the strong per-position oracle,
  materialized as a table. Check: the paper distinguishes the 1988 value solutions
  (Allen, Allis) from its own stored strong solution; it re-derives the 1988 value
  as a consistency check, not as its contribution.
- **S2 — Feel why explicit storage is infeasible** `small_case_probe` Probe the
  scale: ~4.5 trillion positions across all plies. Storing one value per position
  explicitly, or enumerating them one at a time, is the barrier — and Edelkamp &
  Kissmann proved a natural encoding's node count grows exponentially. Check: the
  paper cites the exponential-encoding result as the reason a stored table "was
  believed infeasible"; confirm the ~4.5-trillion position count.
- **S3 — See the representation that compresses the sets** `representation_shift`
  Shift from "store/enumerate positions one at a time" to "manipulate *sets* of
  positions at once." A BDD is a compressed canonical encoding of a Boolean
  function, here representing *sets* of boards; symbolic search operates on whole
  sets via Boolean operations rather than visiting states individually. This is
  the conceptual pivot of the climb. Check: the paper's line that explicit search
  "traverses one state at a time" while symbolic search "handle[s] sets of states
  at once."
- **S4 — See why symbolic retrograde is exact** `lemma_decomposition` Decompose
  the solve into exact backward steps: start from all filled ply-42 positions
  split into win/draw/loss BDDs, then propagate the classification back ply by
  ply to the empty root using exact set operations. Each step is an exact Boolean
  transformation seeded from ground-truth terminal outcomes — no heuristic. Check:
  the paper's retrograde description (42 disjoint BDDs, backward propagation from
  ply 42); each ply's classification is a distinct, checkable stage.
- **S5 — Confront the feasibility payoff on one core** `milestone_rewrite` Recast
  the summit as a resource claim: the exact strong oracle is 89.6 GB uncompressed,
  built in 47 hours on ONE consumer CPU core (AMD Ryzen 5950X, 128 GB RAM) — for
  the 7×6 board specifically. Check: abstract's 89.6 GB / 47 h / single-core
  figures; note the method scales poorly with board height, so the single-core
  47 h figure is specific to 7×6, not a general claim.
- **S6 — Locate where the trust actually sits** `kill_criteria` Set the
  abandonment condition for "is this correct?": the algorithm is exact by
  construction, but the *implementation* has no formal proof and no external
  certificate. Trust rests on independent consistency checks, and the kill
  criterion is that a result contradicting a known cross-check would sink it.
  Check: the paper reproduces Tromp's and Edelkamp & Kissmann's position counts
  and re-confirms the 1988 value — the checks that stand in for a formal proof —
  and the oracle is independently queryable from the open Zenodo deposit.

## breakthrough

**The breakthrough is S3 (the symbolic representation), realized through S4 (exact
retrograde over BDDs).** The obstacle was never the game's value — that fell in
1988 — nor the existence of a strong solution in principle (backward induction
gives one trivially). The obstacle was that *materializing and storing* the full
per-position table was believed infeasible: ~4.5 trillion positions, with a
proof (Edelkamp & Kissmann) that a natural encoding grows exponentially. The
non-obvious move is representational: encode *sets* of positions as compressed
canonical BDDs and run the retrograde solve on whole sets at once, so the exact
table compresses to 89.6 GB and builds on a single desktop core. What made this
climb worth marking is not a smarter search but a compact enough *representation*
that an exact, complete object which "was believed infeasible" becomes a two-day
computation on a single consumer core — and the discipline the pack trains is
refusing to inflate that into "first to solve Connect Four," which 1988 already
did.

## audit_targets

- **T1 — "Connect Four was first solved in 2025."** *Objection:* the headline
  invites stating that this result solved the game. *Resolution:* the *value*
  (first player wins) was solved in 1988 (Allen; Allis ~15 days later), and the
  paper re-derives it as a consistency check. The 2025 contribution is the *first
  complete materialized strong-solution look-up table* — a stored per-position
  oracle, distinct from the 1988 value and from Tromp's 8-ply database that
  "effectively strongly solved" the game via search. The auditor must state the
  novelty as the materialized oracle, not first-ever solvability.
- **T2 — "The BDD result is formally verified / correct by construction."**
  *Objection:* "symbolic search is exact, so this is a proved-correct oracle like
  a formal-methods result." *Resolution:* the *algorithm* is exact (backward
  induction via exact Boolean operations), but the *implementation* is the
  author's own C BDD library with no formal proof and no external DRAT-style
  certificate. "Correct by construction" describes the algorithm and is not a
  phrase the paper uses; correctness credibility comes from consistency checks
  (Tromp, Edelkamp & Kissmann, the 1988 value), not a formal guarantee.
- **T3 — "It's an 89.6 GB download you can just grab and query."** *Objection:*
  the 89.6 GB figure is read as the size of the downloadable artifact.
  *Resolution:* 89.6 GB is the *uncompressed* BDD oracle; the Zenodo
  *download* is a 46.8 GB compressed 7z archive. Both are real and open, but the
  auditor should not conflate the uncompressed working size with the download.
- **T4 — "This is peer-reviewed, published science."** *Objection:* an arXiv
  result with artifacts reads as a published paper. *Resolution:* it is an arXiv
  *preprint*, not peer-reviewed (no journal reference; the author lists it as a
  personal project), and the code carries no open-source license despite being
  called open-source. The REAL bar is met as an *artifact-verified preprint*: the
  oracle is openly downloadable and independently queryable, and the internal
  cross-checks are real — but "published / peer-reviewed" would overstate it.
- **T5 — "The single-core / 47-hour figure generalizes."** *Objection:* if 7×6
  solved on one core in 47 h, larger boards are just more of the same.
  *Resolution:* the method scales poorly as the number of rows grows (the encoding
  performs worse for taller boards); the 47 h / single-core / 89.6 GB figures are
  specific to the standard 7×6 board, not a general claim about arbitrary board
  sizes. The honest headline is a *desktop-scale 7×6 solve*, not a universal one.
