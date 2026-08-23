# Falsifiable citations

A citation that merely *resolves* proves nothing — audits of deep-research tools put actual claim support at 39–77% even when links work. Chancery makes citations falsifiable: hashed at ingest, re-checked on demand, and judged claim-by-claim against the exact snapshot on record.

## The evidence store

Every fetch is an **observation**, appended to `.kb/evidence/<slug>.jsonl` — reachability (a ten-state enum, not just alive/dead), content digest, archive fallback, and a mechanical `never-resolved` flag that needs three consecutive failures across two separate runs. The store is history: a wrong observation is superseded, never edited. Note frontmatter keeps only a compact latest-state summary, and `kb verify` holds the two together (KB018).

```console
$ kb sources --apply          # hash every citation, record observations
$ kb revalidate               # re-fetch: which claims' evidence drifted?
$ kb revalidate --accept <slug>   # adopt a reviewed drift as the new baseline
```

Drift is a **finding, never an automatic edit** — a source moving doesn't make your note wrong; it means someone should look.

## Claim-level verdicts

```console
$ kb support <slug>                     # emits judge tasks (network: snapshots cached)
$ kb support <slug> --verdicts v.json   # records the verdicts
```

Each verdict binds *(a claim quoted **verbatim** from the note)* × *(the source snapshot actually judged)* — paraphrases are refused mechanically, and a changed snapshot refuses as stale. Verdicts are `SUPPORTED` / `UNCERTAIN` / `CONTRADICTED`; anything non-supported lands in the queue for a human. This is an **evidence-verdict** task class: model panels are excluded by the envelope — consensus never upgrades evidence.

## Supersession

```console
$ kb supersede old-note --by new-note --apply
```

One atomic transaction: the old note gets `status: superseded` and leans to a pointer (full text stays in git history), successors gain the reciprocal field, and `kb query` half-ranks superseded hits while telling you where to look instead.
