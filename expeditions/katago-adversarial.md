# Expedition Pack: Beating a Superhuman Go AI

`pack_id: katago-adversarial`

A superhuman Go program — stronger than any human — can be beaten over 97% of
the time by an opponent that does not play good Go, using a strategy a human
amateur can then execute by hand. The exploit was found by training a weak
adversarial policy whose only goal was to surface the blind spot. Three
natural defenses were tried; none held.

This pack is not about Go. It is about the gap between "superhuman on average"
and "robust in the worst case," and about auditing a system far stronger than
you by attacking the seam instead of the strength.

---

## problem

**Statement.** KataGo is a Go-playing AI that, with search, plays at clearly
superhuman strength — it beats top human professionals. The question this work
answers empirically: is a superhuman Go AI *robust*? That is, does its enormous
average-case strength imply it has no catastrophic worst-case failure an
adversary could reliably trigger?

**Answer (2022–2024).** No. An adversarial policy beats KataGo at superhuman
settings with a >97% win rate. The adversary does not win by playing Go well —
it tricks KataGo into a catastrophic misjudgment. The attack transfers
zero-shot to other superhuman Go AIs, a human can execute it without computer
assistance, and three published defenses each failed against a freshly trained
adversary.

**Accessibility note.** Following this pack requires: the rules of Go at a
spectator level (you capture a group by surrounding it; the game ends when both
sides pass), and the idea of a neural network trained by self-play to estimate
"who is winning" and "what move to play." No Go skill is needed — the whole
point is that Go skill is not what wins here. The terms "average-case" vs
"worst-case" and "adversarial example" are explained in the step graph.

---

## history

For a decade the entire field measured Go AIs by capability: Elo rating, win
rate against humans, win rate against each other. AlphaGo (2016) and its
open successors, then KataGo, climbed past the best humans, and the working
assumption became that a system this strong had no exploitable weakness worth
worrying about. Capability was treated as a proxy for robustness.

**Known dead ends** — each is a discipline that did not fire:

- **Dead end 1: measuring strength, never robustness.** Every benchmark scored
  Go AIs on average-case performance against strong opponents. WHY it fails:
  average-case strength and worst-case robustness are different quantities. A
  system can be superhuman against every opponent that plays sensible Go and
  still collapse against an opponent engineered to probe its blind spots — but
  no one ran that opponent, so the blind spot stayed invisible. This is the
  representation lock-in the breakthrough had to break.

- **Dead end 2: "it's superhuman, of course it's robust."** The intuition that
  a system strong enough to beat all humans must be free of dumb failure modes.
  WHY it fails: this conflates two axes. Image classifiers were already known
  (Szegedy et al., 2013) to be superhuman on average yet fooled by tiny
  adversarial perturbations. The same paradigm — deep nets trained without a
  worst-case objective — produces the same vulnerability class; Go was assumed
  exempt without evidence.

- **Dead end 3: trying to out-play the AI.** The natural way to "beat KataGo" is
  to play stronger Go, which no human and no weaker program can do. WHY it
  fails as a path: it accepts the system's own frame (win by Go strength) and
  on that frame the system is unbeatable. The exploit required abandoning that
  frame entirely — win without playing good Go.

- **Dead end 4: assuming a found exploit is a patchable bug.** Once a failure is
  found, the reflex is "train against it and move on." WHY it fails: this
  assumes the blind spot is a fixed target. When defenders did exactly this,
  freshly trained adversaries found new winning attacks against the hardened
  model. The vulnerability is a property of the training paradigm, not a single
  removable defect — which Dead end 4 only became visible by trying.

---

## solution_provenance

- **Primary publication:** T. T. Wang, A. Gleave, T. Tseng, K. Pelrine, et al.,
  "Adversarial Policies Beat Superhuman Go AIs," ICML 2023. Preprint
  arXiv:2211.00241 (v1 Nov 2022, through v4 Jul 2023). Peer-reviewed.
- **Defense follow-up:** T. Tseng, E. McLean, K. Pelrine, T. T. Wang,
  A. Gleave, "Can Go AIs be adversarially robust?," AAAI 2025
  (arXiv:2406.12843). Peer-reviewed.
- **HOW it was verified:** the result is empirical and reproducible, not a
  proof. Verification is by independent replication — adversary checkpoints and
  example games were published (goattack.far.ai), the win rates are measured
  over many games, and a separate research group's defense paper reproduced the
  attack class in order to test countermeasures against it.
- **First-party check (pack author):** the load-bearing numeric claims below
  were read from the arXiv abstracts directly. The v1 abstract states ">99%
  win-rate against KataGo without search, and a >50% win-rate when KataGo uses
  enough search to be near-superhuman" and "the adversary is easily beaten by
  human amateurs"; the later abstract states ">97% win rate against KataGo
  running at superhuman settings," zero-shot transfer, and that "human experts
  can implement it without algorithmic assistance"; the AAAI 2025 abstract
  states the three defenses and that "none withstand freshly trained
  adversaries." The fine mechanics of the "cyclic" attack are described here at
  the level the abstracts and the follow-up paper support; specific match
  scores and compute fractions not confirmed first-party are deliberately
  omitted rather than approximated.

---

## step_graph

Discipline tags follow modes/expedition.md, The Six Disciplines.

- **S0 — check the analogue before assuming Go is special.** `search_first`
  Before treating "can a superhuman game AI be exploited?" as novel, retrieve
  what is already known: deep image classifiers are superhuman on average yet
  defeated by adversarial examples (Szegedy 2013). The phenomenon — high
  average-case capability, brittle worst-case behavior — is a documented
  property of the paradigm. Check: this is a literature lookup; the question is
  not new, only its application to Go is.

- **S1 — reframe the question from strength to robustness.**
  `representation_shift` Replace "is KataGo strong?" (average-case, the only
  thing ever measured) with "is KataGo robust?" (worst-case: does an adversary
  exist that reliably beats it?). These are different quantities; the second was
  never tested. Check: the reframing is conceptual and one line, but it is the
  whole move — everything downstream is impossible without it.

- **S2 — name the shape: this is an adversarial example.** `shape_question`
  "Which other field has seen this shape?" The cyclic attack is the Go analogue
  of an adversarial perturbation: a weak signal, harmless to a sensible player,
  that drives the network into a confident wrong judgment. Check: the structural
  match to vision adversarial examples is explicit and is why the attack was
  expected to exist at all.

- **S3 — build a weak adversary, not a strong player.** `representation_shift`
  Train an adversarial *policy* by self-play against a fixed KataGo victim, with
  one objective: win, by any means, not play good Go. The result is a policy
  that loses to human amateurs at ordinary Go but reliably triggers KataGo's
  blind spot. Check: the adversary's own Go weakness is verifiable — "the
  adversary is easily beaten by human amateurs" (v1 abstract) — which proves
  the win does not come from Go skill.

- **S4 — probe the victim with search off first.** `small_case_probe` Test the
  degenerate case: KataGo's raw policy network with no search. The attack wins
  >99% there (v1). Then add search and measure how strength returns. Isolating
  the no-search case localizes where the failure lives — in the learned
  network's judgment, with search partially masking it. Check: the two regimes
  give two separately measured win rates.

- **S5 — decompose "the system is exploitable" into separable claims.**
  `lemma_decomposition` Split the headline into independently checkable parts:
  (a) an exploit exists at superhuman search settings (>97%); (b) it transfers
  zero-shot to other superhuman Go AIs; (c) a human can execute it unaided;
  (d) the adversary is not secretly a strong Go player. Each is tested
  separately. Check: each sub-claim has its own measurement and can fail
  without the others.

- **S6 — escalate to the cyclic attack at full search.** `milestone_rewrite`
  The early "pass-based" attack tricked KataGo into ending the game prematurely
  in a losing position. The stronger "cyclic" attack induces KataGo to misjudge
  the life-and-death status of a large cyclic group and lose it, and it holds at
  superhuman search settings (>97% win rate). Recast "are Go AIs robust" as this
  concrete, measured claim. Check: the win rate at superhuman settings is the
  reported figure; the attack name and class are stated in the follow-up paper.

- **S7 — pre-commit the defense's kill criterion, then run it.** `kill_criteria`
  Write the abandonment condition before defending: "a defense succeeds only if
  no freshly trained adversary beats the hardened model." Three defenses —
  adversarial training on hand-constructed positions, iterated adversarial
  training, and a network-architecture change — were tested against that
  criterion. All three protected against *old* attacks and all three fell to a
  freshly trained adversary. Check: the kill criterion is binary and was met
  (failed) for each defense; "none withstand freshly trained adversaries" (AAAI
  2025 abstract).

- **S8 — state the conclusion at the right altitude.** `milestone_rewrite`
  (final claim) The verified answer is not "KataGo has a bug" but "extreme
  average-case capability does not confer worst-case robustness, even in a
  narrow, innately adversarial domain, and natural defenses do not close the
  gap." Check: this is the authors' own stated conclusion — robustness is hard
  "even with extremely superhuman systems in some of the most tractable
  settings."

---

## breakthrough

**Step S1** (the average-case → worst-case reframing), realized through **S3**
(training a deliberately weak adversary).

One-sentence account of why it eluded the field: a decade of measuring Go AIs
by capability had welded "superhuman" to "robust," so no one trained the one
opponent that would expose the difference — a policy that never plays good Go
and exists only to find the blind spot — because the prevailing frame made such
an opponent look pointless against a system that beats every strong player.

---

## audit_targets

Load-bearing steps for the auditor role, each with its strongest objection and
that objection's resolution.

- **T1 — Is the "superhuman" win rate real, or only against a weakened
  victim?** *Objection:* the >99% figure is against KataGo with no search; with
  enough search the early attack won only >50%, so maybe the exploit evaporates
  at genuinely superhuman strength. *Resolution:* the later work reports a >97%
  win rate against KataGo at superhuman settings, and the AAAI 2025 follow-up
  studies the cyclic attack precisely because it beats fully-searched superhuman
  KataGo. The no-search number localizes the flaw; the with-search number at
  superhuman settings establishes it is not masked away.

- **T2 — Is the adversary just secretly a stronger Go player?** *Objection:* if
  the adversary beats a superhuman system, perhaps it discovered superior Go,
  and the result is a strength story, not a robustness story. *Resolution:* "the
  adversary is easily beaten by human amateurs" (v1 abstract), and the
  adversaries "do not win by playing Go well" (later abstract). A system weak at
  the game defeats a superhuman one — that asymmetry is the entire finding, not
  a footnote. This is the crux step: the auditor who lands a probe here has
  found the load-bearing claim.

- **T3 — Is this one engine's quirk rather than a general lesson?**
  *Objection:* a single artifact in KataGo's training says nothing about AI
  robustness broadly. *Resolution:* the attack transfers zero-shot to other
  superhuman Go AIs (later abstract), and its shape matches the long-known
  adversarial-example phenomenon in vision (S0/S2) — it is a property of the
  training paradigm surfacing in a new domain, not a lone bug.

- **T4 — Can't this just be patched?** *Objection:* found a failure, train
  against it, done — adversarial training closes such holes. *Resolution:* this
  was tested directly. Three natural defenses each protected against previously
  discovered attacks and each fell to a freshly trained adversary; "none
  withstand freshly trained adversaries" (AAAI 2025). The blind spot regenerates
  faster than the patch closes it. This is the load-bearing AI-era lesson and
  the step most worth probing.

- **T5 — Is the human-executability claim overstated?** *Objection:* maybe only
  the trained adversarial policy can pull this off, and "a human can do it" is
  PR. *Resolution:* the published claim is explicit — "human experts can
  implement it without algorithmic assistance to consistently beat superhuman
  AIs" (later abstract). The pack rests the human-execution claim on that
  verified statement; specific exhibition-match scores, which the pack author
  did not confirm first-party, are deliberately not asserted here — an honest
  boundary the auditor should note rather than paper over.
