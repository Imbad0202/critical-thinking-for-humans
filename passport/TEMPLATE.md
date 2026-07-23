# Passport

> This file is a view; events.jsonl is the record. Safe to delete — it will be rebuilt.
> Every value below is sample data illustrating the format — regenerate all
> values from `events.jsonl`, never copy them.

---

## Profile

| Field          | Value        |
|----------------|--------------|
| Domain(s)      | education    |
| Difficulty     | standard     |
| Feedback style | direct       |

*(Latest `profile_set` event wins. If two share the same `ts`, file order decides — later line wins.)*

---

## Structure Tallies

| Structure ID          | Attempts | Hits | Misses | Last practiced |
|-----------------------|----------|------|--------|----------------|
| `necessary_assumption`| 4        | 3    | 1      | 2026-06-10     |
| `sample_selection`    | 6        | 2    | 4      | 2026-06-11     |
| `proxy_mismatch`      | 3        | 1    | 2      | 2026-06-09     |

*(From `drill_result` events. Keyed by canonical ID; display text translates to user's language.)*

---

## Recent Patterns

> 4 of your last 5 misses are `sample_selection`.

*(From `miss_log` events, most recent first — the longitudinal mirror no single session can show.)*

---

## Scene Coverage

| Metric              | Rate |
|---------------------|------|
| Steelman            | 80%  |
| Counter-frame raised| 70%  |
| Camera turn         | 60%  |
| Closing commitment  | 90%  |

Frames exercised (last 5 sessions): `frame_power` ×4 · `frame_counter` ×4 · `frame_institution` ×3 · `frame_charitable` ×2 · `frame_incentive` ×2 · `frame_info_limits` ×1

---

## Elicitation Lanes

| Lane | Moves |
|------|-------|
| Initiated unprompted | `steelman` ×3 · `small_case_probe` ×1 |
| Demonstrated with support | `counter_frame` ×2 |

*(From the optional elicitation fields — passport/SCHEMA.md, Elicitation.
Events without those fields enter neither lane: absence licenses no inference.
Stated, never prosecuted.)*

---

## Commitments

- **2026-06-11** — "the scene shows role asymmetry worth checking against base rates" *(speaking order + honorifics, but n=1)*
- **2026-06-09** — "the evidence supports concern, not conclusion" *(two data points, no control)*

---

The passport lives on your machine (`~/.ct-gym/`). Its relevant content enters
the model context when used. **show passport** / **delete passport** /
**pause recording** always available (redline 12).
