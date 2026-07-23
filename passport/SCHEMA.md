# Passport Schema

## Storage Contract

`~/.ct-gym/events.jsonl` is the source of truth — an append-only event log, one
JSON object per line. Past lines are never edited.

Writes are atomic: copy the current `events.jsonl` to a temp file in the same
directory, append the new event line to the temp file, then rename the temp file
over `events.jsonl`. Never write to `events.jsonl` directly, and never rename a
temp file that does not contain the full prior log.

The markdown summary (`~/.ct-gym/passport.md`) is always regenerable from the
event log and is safe to delete.

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
weighting the way `manipulation_spot` technique IDs are. For a sound item,
`hit` is true when the user correctly judged the argument sound and false when
the user asserted a flaw that was not there; the false case is the over-flagging
signal the longitudinal mirror surfaces (the symmetric complement of the
per-structure miss log — "you invented a flaw on N of your last M sound items").

```
{"schema_version":1,"ts":"2026-06-11T08:41:00Z","type":"drill_result","structure":"sample_selection","item_type":"weaken","hit":false,"summary":"missed survivorship in a retention claim"}
{"schema_version":1,"ts":"2026-06-11T08:52:00Z","type":"drill_result","structure":"argument_sound","item_type":"weaken","hit":false,"summary":"called a sound retention argument flawed — over-flagged"}
```

### `scene_process`

One record per completed scene session. Process metrics only — no hit/miss grade.

Fields: `frames_raised` (array of frame IDs), `fallacies_examined` (array of
fallacy-lens IDs the fallacy-recognition track exercised this round; absent on
frame-palette rounds), `fallacy_rulings` (array of rulings — each one of
`fallacy` / `not_fallacy` / `insufficient_context` — positionally parallel to
`fallacies_examined`, so element *i* is the ruling for lens *i*; absent on
frame-palette rounds),
`steelman` (bool — true only if every raised frame was steelmanned),
`counter_frame` (bool), `camera_turn` (bool), `commitment` (bool),
`summary` (short context label — no raw user text, no proper names). The rulings
are process metrics recorded in this same event, never a score. A round is a
frame-palette round XOR a fallacy round (one submode per round, modes/scene.md),
so `frames_raised`/`steelman`/`counter_frame`/`camera_turn` and
`fallacies_examined`/`fallacy_rulings` are mutually exclusive — the absent set is
omitted, not empty-arrayed.

```
{"schema_version":1,"ts":"2026-06-11T09:02:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":true,"commitment":true,"summary":"staff-meeting scene, budget dispute"}
{"schema_version":1,"ts":"2026-06-11T09:14:00Z","type":"scene_process","fallacies_examined":["fallacy_false_dilemma","fallacy_strawman"],"fallacy_rulings":["fallacy","insufficient_context"],"commitment":false,"summary":"op-ed argument, two lenses"}
```

### `miss_log`

Explicit miss record written alongside `drill_result` when `hit` is `false`; derivable from drill_result if absent. A `miss_log` must be
written for every `drill_result` whose `hit` is false; `drill_result` is ground
truth — if a `miss_log` is missing, regeneration derives it.

Fields: `structure` (canonical ID, or a technique ID for `manipulation_spot`
misses, or the `argument_sound` sentinel for an over-flagged sound item),
`summary` (short structure-level description). An `argument_sound` miss records
the over-flagging tendency separately; it does NOT feed the per-structure
miss-log weighting that step (b) of the pipeline uses to pick the next target
structure (an over-flag is not a weak spot in any one structure).

Optional `confused_with` field: the ID of the option the user actually chose —
a pattern ID from the distractor menu (shared/structures.md) or a structure ID.
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
coach concedes the item flawed (modes/drill.md step 6). This is a
generation-quality signal, the drill counterpart of
`detective_process.unregistered_flaws_found`: it measures the generator, not
the user. The conceded item itself still writes no `drill_result` and no
`miss_log`.

Fields: `structure` (the target structure ID the discarded item was built
against), `reason_class`
(`key_conceded|distractor_also_defensible|frame_malformed`), `summary`
(structure-level, same privacy register as `miss_log` — never item content,
never the user's challenge argument).

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
context label — no raw user text).

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
`summary` (short context label — no raw user text).

```
{"schema_version":1,"ts":"2026-06-13T10:00:00Z","type":"detective_process","layers_solved":3,"layers_total":4,"eggs_found":2,"eggs_total":5,"false_positives":1,"unregistered_flaws_found":0,"structures_hit":["proxy_mismatch","base_rate_neglect","alternative_cause"],"summary":"investment-memo case, cracked to L3"}
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

Concurrent writes from two simultaneous sessions are not safe: the later rename
wins and the other session's events are lost. Known limitation — run one session
at a time.

User commands always available: **show passport** / **delete passport** /
**pause recording** (redline 12).

'pause recording' lasts until the user resumes it (state held in session; a new session starts unpaused). 'delete passport' removes both events.jsonl and passport.md.

---

## Corruption Handling

When reading, a malformed line is skipped with a warning — never edited or deleted.
The summary is always regenerable from the valid lines.

If `events.jsonl` is missing, start a new one (cold start).
