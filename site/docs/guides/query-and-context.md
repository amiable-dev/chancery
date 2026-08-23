# Query & context

## Grounded query

```console
$ kb query "how should agent memory persist?"
```

Returns ranked concepts **with their graph edges** — the hand-curated, typed relationships that auto-extraction can't produce — filtered by facet if you ask (`--domain`, `--maturity`). Retrieval is lexical + graph, deliberately: at corpus scale, that measurably suffices, and escalation to heavier retrieval is triggered by a recall eval, never by note count.

The two-phase form makes answers **grounded**: emit hits, have your agent answer from them, then validate —

```console
$ kb query "…" --answer answer.json
```

An answer citing any concept that was *not retrieved* is rejected. That's retrieval provenance, checked deterministically; if the corpus can't answer, the honest move is recording the gap, not filling it from model memory.

## Compiled context

```console
$ kb context --for cards-refresh <slug>
$ kb context --for promote-review <slug>
$ kb context --for audit-pair <a> <b>
$ kb context --for research-brief --query "…"
```

One deterministic **bundle** per task: the target notes, the exact policy excerpts that bind the task, ranked one-hop neighbours, prior artifacts (deck, evidence verdicts, assessment), and the response schema. Same corpus, same bundle — byte-stable, with a `bundle_id` you can use to notice drift.

Budgeting is honest: `--budget <chars>` trims whole items by priority (artifacts → edges → policy; never the targets or the schema), reports every trim, and refuses with the minimum viable size if the floor doesn't fit. A stale index refuses compilation rather than silently varying.
