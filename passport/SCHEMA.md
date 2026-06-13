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
and `type` (one of the seven types below).

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
for advanced compound items, the primary target — secondary IDs appear only in
`summary`), `item_type` (`assumption|weaken|sufficiency|manipulation_spot`),
`hit` (bool), `summary` (structure-level).

```
{"schema_version":1,"ts":"2026-06-11T08:41:00Z","type":"drill_result","structure":"sample_selection","item_type":"weaken","hit":false,"summary":"missed survivorship in a retention claim"}
```

### `scene_process`

One record per completed scene session. Process metrics only — no hit/miss grade.

Fields: `frames_raised` (array of frame IDs), `fallacies_examined` (array of
fallacy-lens IDs the fallacy-recognition track exercised this round, parallel to
`frames_raised`; absent on frame-palette rounds), `steelman` (bool — true only
if every raised frame was steelmanned), `counter_frame` (bool), `camera_turn`
(bool), `commitment` (bool), `summary` (short context label — no raw user text,
no proper names). The per-call ruling (`fallacy` / `not_fallacy` /
`insufficient_context`), if logged, goes in this same event, never as a score.

```
{"schema_version":1,"ts":"2026-06-11T09:02:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":true,"commitment":true,"summary":"staff-meeting scene, budget dispute"}
```

### `miss_log`

Explicit miss record written alongside `drill_result` when `hit` is `false`; derivable from drill_result if absent. A `miss_log` must be
written for every `drill_result` whose `hit` is false; `drill_result` is ground
truth — if a `miss_log` is missing, regeneration derives it.

Fields: `structure` (canonical ID, or a technique ID for `manipulation_spot`
misses), `summary` (short structure-level description).

```
{"schema_version":1,"ts":"2026-06-11T08:45:00Z","type":"miss_log","structure":"proxy_mismatch","summary":"took a satisfaction rate as a learning outcome"}
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
