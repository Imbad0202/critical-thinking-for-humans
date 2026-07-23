# Public daily cases

This directory is the browser-safe side of daily publishing. Every case in
`cases/` conforms to `schema/daily-case-public.v1.schema.json` and is selected
by the Taipei calendar in `rotation.json`. The fourteen seed dates repeat as a
cycle, so dates after the fixture fortnight still receive a case without a
cron job.

Public cases contain prompts and choices only. Correct choices, scoring,
post-commit explanations, and review records belong in private server storage.
Do not add them here, even for local convenience.

New fixtures also declare a `domain` (`education`, `health`, `public`,
`science`, or `work`) so the first-run domain gate can route Daily cases without
guessing from an ID. The v1 schema keeps that field optional only so an older
already-published snapshot can still be read during migration.

Run the repository-local structural and leak check with:

```sh
python scripts/check_daily_cases.py
```

For private records, Vercel Blob setup, dry-run validation, cron publishing,
and the no-overwrite uploader, see
[`docs/DAILY_DEPLOYMENT.md`](../../docs/DAILY_DEPLOYMENT.md).

The first seven dated records (2026-07-12 through 2026-07-18) are a small
deployment fixture copied from the directly authored
`web/content/locales/zh-TW/` mode modules. Expedition wording remains tied to
the declared `expeditions/alphafold-casp14.md` pack; this directory does not
add new factual claims to that pack.

Because those fixtures mirror public offline modules that include their fixed
keys, the demo half of the rotation demonstrates the API boundary but is **not
an anti-cheat question bank**. A production scored rotation must use
independently authored cases whose answer records never appear in a client
bundle or public repository. The leak checker proves only that the Daily
public payload omits answer/reveal fields; it cannot make a duplicated public
key secret.

The second seven records (2026-07-19 through 2026-07-25) are the
**source-credibility case family**: independently authored fiction whose flaw
to catch sits upstream of the inference, in how the evidence reached the
reader — who produced it, who paid for it, how many hands it passed through,
and whether its weight matches what stands behind it. These cases follow the
production pattern: their answer records exist only as private records
prepared per `docs/DAILY_DEPLOYMENT.md` and are never committed. All
institutions, people, and publications in them are fictional.
