# Passport Schema

## Storage Contract

`~/.ct-gym/events.jsonl` is the source of truth — an append-only event log, one
JSON object per line. Past event bytes are never edited.

Every canonical local Passport event-log read, append, generation read/create,
and deletion goes through the bundled helper at
`<skill-root>/scripts/passport_checkpoint.sh`; resolve that path relative to
`SKILL.md`, never from the caller's working directory. Do not reconstruct its
lock/read/replace sequence ad hoc.

The local helper requires Node.js 22 or newer on `PATH`. Its shell entry point
checks that prerequisite before touching the Passport directory and exits 69 if
the runtime is missing or too old. On exit 69, pause recording for the session,
say that local Passport operations are unavailable until Node is installed or
updated, continue the reasoning exercise if the user wishes, and never attempt
a direct read, write, or delete.

At the beginning of every local session, before reading `events.jsonl`, invoke
the helper's `generation` command. Retain its single-line token in session
context and pass it to every `read` and `append` with `--generation`. Then
obtain the event-log snapshot through that locked `read` command; never read
`events.jsonl` directly. The token contains no Passport content; it identifies
the deletion epoch in which the session began. If generation startup or a read
fails, pause recording, tell the user, and do not fall back to direct filesystem
access.

At a checkpoint, send every pending event to the helper's `append` command on
stdin, one complete JSON object per line, as one ordered checkpoint batch. The
event JSONL is data: JSON-escape every field first, and never place event
content in command-line arguments or interpolate raw user text into shell code.
The helper validates the whole stdin batch as UTF-8 JSON objects before taking
the lock. It then acquires the exclusive sidecar lock before it rereads the
current `events.jsonl`, copies those exact bytes to a unique temp file in the
same directory, appends the whole batch, syncs it, and atomically renames the
temp file over `events.jsonl`. A paired `drill_result` + `miss_log`, or
`scene_process` + `commitment`, therefore commits as one uninterrupted batch.

Clear the in-session pending buffer only after the helper exits zero, except for
exit 76 (`PASSPORT_GENERATION_MISMATCH`). That code means the on-disk generation
was rotated or reset, normally by a deletion attempt; it does not prove the
deletion completed. Discard a stale pending append or stale read snapshot, call
the helper's `generation` command again, and tell the user the old-generation
operation was refused. On any lock, validation, read, write, or rename failure,
the canonical files stay unchanged: keep an append batch pending, tell the user
recording has not completed, and never fall back to direct or unlocked
filesystem access. Exact helper-owned orphan temp files are removed under the
lock; unrelated files and non-regular filesystem objects are never swept.

The current runtime does not persist `~/.ct-gym/passport.md`. "Show passport"
invokes the helper's locked `read --generation TOKEN` command and renders its
chat answer from that fresh snapshot, using `passport/TEMPLATE.md` only as a
display template. A legacy markdown view is regenerable, never an input to a
write, and removed by `delete passport`.

---

## Event Envelope

Every event carries `schema_version` (integer, starts at 1), `ts` (ISO 8601 UTC),
and `type` (one of the eight types below).

---

## Event Types

### `profile_set`

Records the user's preferences. The latest `profile_set` event wins for display.
If two events share the same `ts`, the one appearing later in the file wins (file
order is deterministic; wall clocks are not).

Fields: `domain` (array of strings — user's own words), `difficulty`
(`intro|standard|advanced`), `feedback_style` (`direct|cushioned`).

```
{"schema_version":1,"ts":"2026-06-11T08:30:00Z","type":"profile_set","domain":["education"],"difficulty":"standard","feedback_style":"direct"}
```

### `drill_result`

One record per drill item completed.

Fields: `structure` (canonical ID from `shared/structures.md`, or — for
`manipulation_spot` items — a technique ID from `shared/manipulation-taxonomy.md`;
or the sentinel `argument_sound` for a sound-argument item, which has no target
structure; for advanced compound items, the primary target — secondary IDs
appear only in `summary`), `item_type`
(`assumption|weaken|sufficiency|manipulation_spot`; a sound-argument item is a
`weaken` item), `hit` (bool), `summary` (structure-level).

`argument_sound` is an outcome sentinel, not a reasoning structure — it never
appears in `shared/structures.md` and is excluded from per-structure miss-log
weighting the way `manipulation_spot` technique IDs are. Optional elicitation
carrier `elicitation` — see Elicitation. Optional post-reveal carrier
`post_reveal` (miss events only) — see Post-Reveal Updating. For a sound item,
`hit` is true when the user correctly judged the argument sound and false when
the user asserted a flaw that was not there; the false case is the over-flagging
signal the longitudinal mirror surfaces (the symmetric complement of the
per-structure miss log — "you invented a flaw on N of your last M sound items").

```
{"schema_version":1,"ts":"2026-06-11T08:41:00Z","type":"drill_result","structure":"sample_selection","item_type":"weaken","hit":false,"summary":"missed survivorship in a retention claim"}
{"schema_version":1,"ts":"2026-06-11T08:52:00Z","type":"drill_result","structure":"argument_sound","item_type":"weaken","hit":false,"summary":"called a sound retention argument flawed — over-flagged"}
```

### `scene_process`

One record per completed scene session. Frame and fallacy rounds record
process metrics only — no hit/miss grade; a configure round is the bounded
exception, grading committed asks against a designed information key
(modes/scene.md, Configure Track).

Fields: `frames_raised` (array of frame IDs), `fallacies_examined` (array of
fallacy-lens IDs the fallacy-recognition track exercised this round; absent on
frame-palette rounds), `fallacy_rulings` (array of rulings — each one of
`fallacy` / `not_fallacy` / `insufficient_context` — positionally parallel to
`fallacies_examined`, so element *i* is the ruling for lens *i*; absent on
frame-palette rounds),
`steelman` (bool — true only if every raised frame was steelmanned),
`counter_frame` (bool), `camera_turn` (bool), `commitment` (bool),
`summary` (short context label — no raw user text, no proper names). The rulings
are process metrics recorded in this same event, never a score. A configure
round (modes/scene.md, Configure Track) instead carries `configure_caught` and
`configure_missed` (arrays of structure IDs — the key's items, plus any
unkeyed ask confirmed load-bearing and keyed to its structure at inspection),
`configure_noise` (int — committed requests ruled noise, generic-checklist
asks included), optional `configure_unverified` (int — catches whose
committed verification line was missing or hollow; the catch stands, the
verification gap is the recorded fact), and optional
`configure_unkeyed` (int — inspection-confirmed generator omissions of
three kinds: pre-reveal committed asks that were uniquely keyable, which
also enter `configure_caught`; confirmed asks with no unique structure,
which enter no ID array; and dependencies first named after the reveal,
which earn no catch credit. The counter marks the
generator's omission — a generation-quality signal, never a user stat, never
read for weighting; the ID arrays carry only uniquely keyed items). A configure key conceded on challenge writes the same
`item_discarded` event as a drill overturn (structure = the conceded item's
keyed structure, `reason_class` `key_conceded`) — see `item_discarded`.
A configure round carries neither the `commitment` boolean nor a
`commitment` event: its committed plan is an exercise input, not an
authored position, and its close is a tally, not a pressure-tested
commitment. A round is exactly one of a
frame-palette round, a fallacy round, or a configure round (one submode per
round, modes/scene.md),
so `frames_raised`/`steelman`/`counter_frame`/`camera_turn`,
`fallacies_examined`/`fallacy_rulings`, and the `configure_*` set are mutually
exclusive — the absent sets are
omitted, not empty-arrayed. Optional per-move elicitation carrier
`elicitation` — see Elicitation, which also holds the four booleans' behavior
anchors. Optional `commitment_shift` — see Post-Reveal Updating, whose
carrier list also records the configure-round deferral.

```
{"schema_version":1,"ts":"2026-06-11T09:02:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":true,"commitment":true,"summary":"staff-meeting scene, budget dispute"}
{"schema_version":1,"ts":"2026-06-11T09:14:00Z","type":"scene_process","fallacies_examined":["fallacy_false_dilemma","fallacy_strawman"],"fallacy_rulings":["fallacy","insufficient_context"],"commitment":false,"summary":"op-ed argument, two lenses"}
{"schema_version":1,"ts":"2026-06-11T09:30:00Z","type":"scene_process","configure_caught":["sample_selection","proxy_mismatch"],"configure_missed":["evidence_sufficiency"],"configure_noise":2,"configure_unverified":1,"summary":"program-effectiveness case, menu tier"}
```

### `miss_log`

Explicit miss record written alongside `drill_result` when `hit` is `false`; derivable from drill_result if absent. A `miss_log` must be
written for every `drill_result` whose `hit` is false; `drill_result` is ground
truth — if a `miss_log` is missing, regeneration derives it.
A configure round (modes/scene.md, Configure Track) also writes one standalone
`miss_log` per missed load-bearing structure — no paired `drill_result`; the
pairing-and-derivation rule above binds drill items only. A configure miss
feeds the same per-structure weighting drill's step (b) reads, with a
denominator: each ID in that round's `configure_caught` and
`configure_missed` counts as one attempt for its structure in the rate
calculation, so nine catches and one miss read as one miss in ten attempts,
exactly as the claude.ai edition's `by_structure` pairs encode. A key
conceded
on challenge writes no `miss_log` at all.

Fields: `structure` (canonical ID, or a technique ID for `manipulation_spot`
misses, or the `argument_sound` sentinel for an over-flagged sound item),
`summary` (short structure-level description). An `argument_sound` miss records
the over-flagging tendency separately; it does NOT feed the per-structure
miss-log weighting that step (b) of the pipeline uses to pick the next target
structure (an over-flag is not a weak spot in any one structure).

Optional `confused_with` field: the ID of the option the user actually chose —
a pattern ID from the distractor menu (shared/structures.md), a structure ID,
or — on a `manipulation_spot` miss — a technique ID
(shared/manipulation-taxonomy.md).
`confused_with` carries IDs only, never option text; the privacy register is
unchanged. Absent on events written before the field existed; derivable going
forward only. A stable pairwise confusion (one target structure repeatedly
answered as the same wrong pattern) is boundary-blur evidence rather than
extra muscle weakness; step (b) weighting does not read this field.

```
{"schema_version":1,"ts":"2026-06-11T08:45:00Z","type":"miss_log","structure":"proxy_mismatch","summary":"took a satisfaction rate as a learning outcome"}
{"schema_version":1,"ts":"2026-06-11T08:58:00Z","type":"miss_log","structure":"sample_selection","confused_with":"hasty_generalization","summary":"read a self-selected pilot as a small-n leap"}
```

### `item_discarded`

Written at the moment a challenge in the drill challenge window succeeds — the
coach concedes the item flawed (modes/drill.md step 6) — or a configure-round
key is conceded on challenge (modes/scene.md, Configure Track). This is a
generation-quality signal, the drill counterpart of
`detective_process.unregistered_flaws_found`: it measures the generator, not
the user. The conceded item itself still writes no `drill_result` and no
`miss_log`.

Fields: `structure` (the discarded item's target — the same union as
`drill_result.structure`: a canonical structure ID, a technique ID for a
`manipulation_spot` item, or the `argument_sound` sentinel for a sound item),
`reason_class` (`key_conceded|distractor_also_defensible|frame_malformed`),
`summary` (structure-level, same privacy register as `miss_log` — never item
content, never the user's challenge argument).

`item_discarded` never feeds the per-structure miss-log weighting that step (b)
of the pipeline uses to pick the next target structure — an overturned key is
not a user weakness. The regenerated summary surfaces per-structure overturn
counts on "show passport" without exposing content.

```
{"schema_version":1,"ts":"2026-06-11T08:47:00Z","type":"item_discarded","structure":"sample_selection","reason_class":"key_conceded","summary":"credited option was not the strongest weakener; key overturned on challenge"}
```

### `commitment`

Stores the user's closing commitment from a scene session.

Fields: `position` (short statement), `reasons_summary`.

```
{"schema_version":1,"ts":"2026-06-11T09:03:00Z","type":"commitment","position":"the scene shows role asymmetry worth checking against base rates","reasons_summary":"speaking order + honorifics, but n=1"}
```

### `expedition_process`

One record per completed expedition session. Process metrics only — no grade.

Fields: `pack_id`, `role` (`auditor|climber|forecaster`), `disciplines_unprompted`
(array of discipline IDs from modes/expedition.md that the record shows the user
deployed without prompting), `breakthrough_articulated` (bool), `summary` (short
context label — no raw user text). Optional elicitation carrier
`disciplines_prompted` — see Elicitation.

```
{"schema_version":1,"ts":"2026-06-12T10:00:00Z","type":"expedition_process","pack_id":"example-pack","role":"auditor","disciplines_unprompted":["small_case_probe"],"breakthrough_articulated":true,"summary":"audited step graph, probed two load-bearing steps"}
```

### `detective_process`

One record per completed detective case (or one closed early via `enough for
today`). Process metrics only — no grade.

Fields: `layers_solved` (int), `layers_total` (int), `eggs_found` (int),
`eggs_total` (int), `false_positives` (int — confirmed only, a call the coach
inspected and found is sound against the G0 frame),
`unregistered_flaws_found` (int — correct user objections the answer key had
missed; a generation-quality signal), `structures_hit` (array of the main-flaw
structure IDs the user caught, one per solved layer (length = layers_solved),
from shared/structures.md — feeds per-structure exposure tracking, sharing
drill's per-structure record so practice coverage is unified across modes),
`summary` (short context label — no raw user text). Optional elicitation
carrier `structures_hit_prompted` — see Elicitation. Optional
`corrections_carried` / `corrections_repeated` — see Post-Reveal Updating.

```
{"schema_version":1,"ts":"2026-06-13T10:00:00Z","type":"detective_process","layers_solved":3,"layers_total":4,"eggs_found":2,"eggs_total":5,"false_positives":1,"unregistered_flaws_found":0,"structures_hit":["proxy_mismatch","base_rate_neglect","alternative_cause"],"summary":"investment-memo case, cracked to L3"}
```

---

## Elicitation

Ability and disposition need separate reads: a move made unprompted tells a
different story from the same move made after a prompt, and today's records
largely collapse the two. Process events may therefore carry an elicitation
marker with at most three coarse states — `not_elicited` (the session offered
no real opportunity for the move), `prompted` (the move followed a coach
prompt or scaffold), `independent` (the record shows the user initiated it
unprompted). `not_elicited` is load-bearing:
absence of opportunity must never read as learner deficit.

Elicitation is read from reasoning moves only. It is
never inferred from safe-word use, session length, or willingness to continue.
Recording that a scaffold preceded a move is an ability-support fact about
that move; the use of a safe word itself is never a disposition signal.
No personality labels, no disposition scores — three coarse states maximum.

All elicitation fields are optional and additive. `schema_version` stays 1:
an event without them is complete, and a reader must not infer anything from
their absence — old events simply predate the fields.

The regenerated summary ("show passport") presents two lanes — "initiated
unprompted" and "demonstrated with support" — in the Data-as-Mirror register
(shared/scaffolding.md §5c): stated, never prosecuted.

Per-event carriers:

- `drill_result` — optional `elicitation` (`prompted|independent`): `prompted`
  when a coach-delivered scaffold (a `hint` step or a `stuck` walk-through)
  preceded commitment on that item — the scaffold delivered, never the
  safe-word utterance itself.
  `not_elicited` never applies to drill; every presented item is an
  opportunity.
- `scene_process` — optional `elicitation` map: keys from
  `steelman|counter_frame|camera_turn|commitment`, values from the three
  states. A move the scene never gave a real opening for is `not_elicited`.
  Consistency: `prompted|independent` accompany a `true` boolean;
  `not_elicited` only a `false` one. Configure rounds carry no elicitation
  surface in v1 — the map's keys are frame-round moves; a
  committed-after-scaffold marker for the configure commit gate is deferred
  deliberately, not overlooked.
- `expedition_process` — optional `disciplines_prompted` (array): discipline
  IDs the record shows the user deployed only after a coach prompt.
  Disciplines in neither array are simply unrecorded — absence licenses no
  inference; a pack may have invited a discipline the user never deployed.
- `detective_process` — optional `structures_hit_prompted` (array): the
  subset of `structures_hit` caught only after a clue-level prompt or hint;
  catches before any clue are the independent lane.

Behavior anchors for the existing scene booleans (definitions tightened,
values and types unchanged): `steelman` is true only when each raised frame's
original claim was preserved AND its strongest relevant reason supplied;
`counter_frame` only when a defeater for the primary reading was actually
named; `camera_turn` only when the user's own reading was examined as text,
not merely invited; `commitment` only when a position came with reasons —
never on a bare sign-off.

```
{"schema_version":1,"ts":"2026-06-11T08:41:00Z","type":"drill_result","structure":"sample_selection","item_type":"weaken","hit":true,"elicitation":"prompted","summary":"caught survivorship after one vocabulary scaffold"}
{"schema_version":1,"ts":"2026-06-11T09:02:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":false,"commitment":true,"elicitation":{"steelman":"independent","counter_frame":"prompted","camera_turn":"not_elicited","commitment":"independent"},"summary":"staff-meeting scene, budget dispute"}
```

---

## Post-Reveal Updating

Seeing a flaw and moving on it are different capabilities, and the record
keeps them separate: the existing events say how the call went; the fields
below say whether a reveal changed anything (a hit is not evidence the flaw
was understood — a right answer can carry a wrong reason). They follow the
Elicitation contract — optional, additive, behavior-anchored,
`schema_version` unchanged — and are observable acts only, never self-report:
no act, no field, no inference.

One state vocabulary serves every carrier, anchored to the update prompt the
mode delivers — a keyed correction in drill and detective, the strongest
steelmanned objection in scene: `updated` (the position or answer changed on
its point), `refined` (kept but materially qualified in response),
`not_updated` (an observable act repeats the original error — a drill
carrier state; detective records the same behavior solely through its
`corrections_repeated` counter, never as a state value),
`held_with_argument`
(kept, with the prompt answered on its merits), `held` (kept, with the
prompt left unengaged) — plus detective's transition counters. In scene the
objection may itself be one reading among others; the states record the
user's observable response, never that the objection was right (redline 1).
Each carrier names the subset that applies and the act that anchors it;
drill's `updated` and scene's `updated` are the same state observed through
different acts.

Per-event carriers:

- `drill_result` — optional `post_reveal` (miss events only), subset
  `updated | not_updated | held_with_argument`: the anchoring act is the
  step-6b restatement, or the maintained, reasoned challenge after the
  challenge window resolved. A declined invitation writes nothing.
- `scene_process` — optional `commitment_shift`, subset
  `updated | refined | held_with_argument | held`: the anchoring act is the
  closing commitment read against the pre-objection position — engagement
  with the objection, never its correctness. The four are disjoint, judged
  in order: position replaced on the objection's point → `updated`; kept but
  materially qualified → `refined`; kept unqualified → `held_with_argument`
  when the objection is answered on its merits, else `held`. Present only
  when `commitment` is true and an objection was actually delivered.
- `detective_process` — optional `corrections_carried` /
  `corrections_repeated` (ints): layer transitions where the next layer's
  work used the revealed key or corrected framing, versus defect calls that
  re-ran a framing a previous reveal had already corrected. A repeated call
  normally also lands in `false_positives` once its inspection confirms it
  fails; `corrections_repeated` marks that subset's cause, and the close
  states the two together rather than reporting one act as two
  independent facts.
- a configure round (modes/scene.md, Configure Track) — deliberately carries
  none of these fields in v1, `commitment_shift` included (its close is a
  tally, not a pressure-tested commitment). Its reveal IS a keyed
  correction — drill's anchor — so a post-reveal carrier for the
  plan-restatement act is a natural future extension, deferred rather than
  overlooked.
- `expedition_process` — deliberately carries none of these fields: #48
  scoped the dimension to the modes where a reveal corrects the user's own
  move mid-session. Wiring expedition's forecaster loop (predict → reveal →
  compare) into it is future work, recorded here so the omission reads as a
  decision, not an accident.

A reasoned hold — keeping the position and answering the objection on its
merits — is a first-class outcome, never a failure. `held_with_argument` and
`held` are mirror states, not grades, and no update pressure is ever applied
to elicit `updated` — pressing the user to change position would train
deference, the opposite of the skill. The longitudinal mirror may surface
"seen but not moved on" as its own pattern class — distinct from "not seen" —
in the Data-as-Mirror register (shared/scaffolding.md §5c): stated, never
prosecuted. Sensitive BYOM sessions write none of this (Privacy Rules — the
envelope-level default needs no per-field ratification).

```
{"schema_version":1,"ts":"2026-06-11T08:45:30Z","type":"drill_result","structure":"proxy_mismatch","item_type":"weaken","hit":false,"post_reveal":"updated","summary":"took a satisfaction rate as an outcome; corrected restatement landed"}
{"schema_version":1,"ts":"2026-06-11T09:03:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":true,"commitment":true,"commitment_shift":"refined","summary":"staff-meeting scene, budget dispute"}
{"schema_version":1,"ts":"2026-06-13T10:00:00Z","type":"detective_process","layers_solved":3,"layers_total":4,"eggs_found":2,"eggs_total":5,"false_positives":1,"unregistered_flaws_found":0,"structures_hit":["proxy_mismatch","base_rate_neglect","alternative_cause"],"corrections_carried":2,"corrections_repeated":0,"summary":"investment-memo case, cracked to L3"}
```

---

## Privacy Rules

Summaries hold structure tags and short summaries, never raw user text.

Exception: `commitment.position` is the user's own authored position statement,
recorded deliberately at the closing pressure test; it may contain first-person
language. Everything else stays summary-level.

Sensitive BYOM sessions are not logged by default — no events of any type,
including `commitment`, unless the user explicitly opts in.

Events exist only in session context until a checkpoint is reached; nothing is
written to disk mid-session. This is what makes 'forget this one' reliable.

"forget this one" (redline 8) discards all pending (not-yet-written) events;
checkpointed events are immutable — use delete passport for those.

Current-version local sessions may checkpoint concurrently: every session
obtains a generation token at startup, every append is serialized by the
helper's sidecar lock, and each reader or writer checks that token and accesses
the log only after it owns the lock. This protects cooperating sessions on one
machine; it does not merge diverged copy-paste passports, coordinate a shared
home directory across machines, or deduplicate a checkpoint retried after a
lost success acknowledgement.

The helper never guesses that an existing lock is stale. If its bounded wait
expires, it writes nothing and leaves the batch pending. After confirming that
no other session is checkpointing, remove only
`~/.ct-gym/.events.write-lock`; never modify `events.jsonl` to recover a lock.

User commands always available: **show passport** / **delete passport** /
**pause recording** (redline 12).

'pause recording' lasts until the user resumes it (state held in session; a new
session starts unpaused). On 'delete passport', discard this session's pending
events, then invoke the helper's `delete` command. The helper uses the same
exclusive lock as an append, rotates the generation before removing
`events.jsonl`, a legacy `passport.md`, and exact helper-owned orphan temp files,
and reports success only after that operation completes. After success, refresh
this session's generation token by invoking the helper's `generation` command
again. After a failed deletion attempt, do the same before any later read or
append, but report the deletion as incomplete. Any already-open session still
holding the old token fails closed with exit 76, so a pre-deletion pending batch
cannot recreate deleted Passport data.

---

## Corruption Handling

When processing a helper-provided read snapshot, a malformed existing line is
skipped with a warning — never edited or deleted. The helper rejects a malformed
incoming checkpoint before it takes the lock, without committing any part of
that batch. If an existing malformed final fragment lacks a newline, the helper
preserves every existing byte and adds only a line separator before the next
valid batch, so later events remain readable. The summary is always regenerable
from the valid lines.

If `events.jsonl` is missing, the helper creates a new one under the same lock
(cold start).
