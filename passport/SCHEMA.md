# Passport Schema

## Storage Contract

`~/.ct-gym/events.jsonl` is the source of truth — an append-only event log, one
JSON object per line. Past lines are never edited.

Writes are atomic: write to a temp file in the same directory, then rename into
place. Never rewrite the log in place.

The markdown summary (`~/.ct-gym/passport.md`) is always regenerable from the
event log and is safe to delete.

---

## Event Envelope

Every event carries `schema_version` (integer, starts at 1), `ts` (ISO 8601 UTC),
and `type` (one of the five types below).

---

## Event Types

### `profile_set`

Records the user's preferences. The latest `profile_set` event wins for display.

Fields: `domain` (array of strings — user's own words), `difficulty`
(`intro|standard|advanced`), `feedback_style` (`direct|cushioned`).

```
{"schema_version":1,"ts":"2026-06-11T08:30:00Z","type":"profile_set","domain":["education"],"difficulty":"standard","feedback_style":"direct"}
```

### `drill_result`

One record per drill item completed.

Fields: `structure` (canonical ID from `shared/structures.md`), `item_type`
(`assumption|weaken|sufficiency`), `hit` (bool), `summary` (structure-level).

```
{"schema_version":1,"ts":"2026-06-11T08:41:00Z","type":"drill_result","structure":"sample_selection","item_type":"weaken","hit":false,"summary":"missed survivorship in a retention claim"}
```

### `scene_process`

One record per completed scene session. Process metrics only — no hit/miss grade.

Fields: `frames_raised` (array of frame IDs), `steelman` (bool), `counter_frame`
(bool), `camera_turn` (bool), `commitment` (bool), `summary`.

```
{"schema_version":1,"ts":"2026-06-11T09:02:00Z","type":"scene_process","frames_raised":["frame_power","frame_counter"],"steelman":true,"counter_frame":true,"camera_turn":true,"commitment":true,"summary":"staff-meeting scene, budget dispute"}
```

### `miss_log`

Explicit miss record written alongside `drill_result` when `hit` is `false`, to
support pattern queries without scanning all drill results.

Fields: `structure` (canonical ID), `summary` (short structure-level description).

```
{"schema_version":1,"ts":"2026-06-11T08:45:00Z","type":"miss_log","structure":"proxy_mismatch","summary":"took a satisfaction rate as a learning outcome"}
```

### `commitment`

Stores the user's closing commitment from a scene session.

Fields: `position` (short statement), `reasons_summary`.

```
{"schema_version":1,"ts":"2026-06-11T09:03:00Z","type":"commitment","position":"the scene shows role asymmetry worth checking against base rates","reasons_summary":"speaking order + honorifics, but n=1"}
```

---

## Privacy Rules

Summaries hold structure tags and short summaries, never raw user text.

Sensitive BYOM sessions are not logged by default.

"forget this one" (redline 8) discards the current session's pending events before
they are written. Events buffer during the session and are appended at natural
checkpoints (end of an item, end of a scene step) so this discard is possible.

User commands always available: **show passport** / **delete passport** /
**pause recording** (redline 12).

---

## Corruption Handling

When reading, a malformed line is skipped with a warning — never edited or deleted.
The summary is always regenerable from the valid lines.

If `events.jsonl` is missing, start a new one (cold start).
