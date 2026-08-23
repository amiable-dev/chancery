# Configuration

Everything that defines "correct" for your corpus lives in `.kb/` — versioned, reviewable, and validated by the gate itself.

| file | governs |
| --- | --- |
| `kb.config.yaml` | the collection registry: paths, frontmatter schemas, required sections, checks |
| `schemas/*.json` | JSON Schemas for notes, decks, and every two-phase answer |
| `facets.yml` | the closed classification axes (`domain`, `maturity`, `source_type`) and the governed open `topics` list |
| `rubrics/promotion.rubric.yaml` | knockout disqualifiers, ordinal dimensions with exemplar anchors, and the routing table |
| `.kb/exemplars/` | the exemplar notes the rubric anchors to (hash-pinned into every task) |
| `procedures/*.md` | the single source that generates all harness skills |
| `context-anchors.yml` | which policy excerpts bind each `kb context` task |
| `POLICY.md` | the non-negotiables — no deletions, no wikilink rewrites, no code-span edits |

## Evolving the vocabulary

Closed axes and curated topics change **only through the proposal queue**: a novel value never fails a write — it is dropped from the write and recorded as a proposal for a human to accept or reject. Accepting is the *only* path by which `facets.yml` changes.

```console
$ kb queue                      # what's waiting
$ kb queue accept <id>          # adopt into the vocabulary
$ kb queue reject <id>
$ kb queue accept-tension <id> --why "…"   # keep a tension, governed as open
```

Proposals left unreviewed age into a `kb verify` failure (KB011) — drift becomes a visible backlog, never a wall your agent routes around.

## Migrations

Structural changes to notes go through `kb migrate` — surgical, idempotent, dry-run by default, and refusing to run on a dirty tree so the rewrite stays reviewable.
