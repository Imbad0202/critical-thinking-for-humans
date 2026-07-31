# Passport

> This is the rendering template for `show passport`; `events.jsonl` is the
> record. The current runtime renders the view directly into chat and does not
> persist this file. Every value below is sample data illustrating the format —
> regenerate all values from a fresh helper-provided `events.jsonl` snapshot,
> never copy them or read the file directly.

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

## Configure Rounds

| Metric | Count |
|--------|-------|
| Keyed items caught | 5 |
| Keyed items missed | 2 |
| Requests ruled noise | 3 |
| Catches without a working verification | 1 |
| Unkeyed asks confirmed (generator omissions) | 1 |

*(From the `configure_*` fields on `scene_process` events — passport/SCHEMA.md.
Missed structures appear in Recent Patterns via their standalone `miss_log`
entries and feed the per-structure weighting — never in the Structure
Tallies table, which stays `drill_result`-only. Unkeyed confirmations and
conceded keys measure the
generator, never the user. Stated, never prosecuted.)*

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

## Post-Reveal Updating

| Carrier | Record |
|---------|--------|
| Drill `post_reveal` | `updated` ×2 · `not_updated` ×1 · `held_with_argument` ×1 |
| Scene `commitment_shift` | `refined` ×2 · `held` ×1 |
| Detective corrections | carried 2 · repeated 1 (the repeat also counts in false positives — one act, related counts) |

*(From the optional post-reveal fields — passport/SCHEMA.md, Post-Reveal
Updating. Events without these fields enter no row: absence licenses no
inference. Stated, never prosecuted.)*

---

## Commitments

- **2026-06-11** — "the scene shows role asymmetry worth checking against base rates" *(speaking order + honorifics, but n=1)*
- **2026-06-09** — "the evidence supports concern, not conclusion" *(two data points, no control)*

---

The event log lives on your machine (`~/.ct-gym/`). Its relevant content enters
the model context when used. **show passport** / **delete passport** /
**pause recording** always available (redline 12).
