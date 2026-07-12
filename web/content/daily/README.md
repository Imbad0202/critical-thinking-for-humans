# Public daily cases

This directory is the browser-safe side of daily publishing. Every case in
`cases/` conforms to `schema/daily-case-public.v1.schema.json` and is selected
by the Taipei calendar in `rotation.json`. The seven seed dates repeat as a
cycle, so dates after the fixture week still receive a case without a cron job.

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

The seven dated records are a small deployment fixture copied from the
directly authored `web/content/locales/zh-TW/` mode modules. Expedition wording
remains tied to the declared `expeditions/alphafold-casp14.md` pack; this
directory does not add new factual claims to that pack.

Because the fixtures mirror public offline modules that include their fixed
keys, this seven-day rotation demonstrates the API boundary but is **not an
anti-cheat question bank**. A production scored rotation must use independently
authored cases whose answer records never appear in a client bundle or public
repository. The leak checker proves only that the Daily public payload omits
answer/reveal fields; it cannot make a duplicated public key secret.
