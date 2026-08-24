# Design: the query eval set (ADR-013 D2)

*2026-08-24 · spec for council packet 8, per the packet-7 process note. Implements ADR-013 D2 and the corpus's own `golden-dataset-retrieval-evals` concept. Build follows council review, TDD.*

## Shape

A versioned directory `eval/queries/` in-repo (out of the npm allowlist, like `eval/parallel/`):

```
eval/queries/
  queries.jsonl        # one item per line (schema below)
  qrels.jsonl          # pooled judgments, append-only
  aliases.yaml         # D9 table (shared with kb query when it ships)
  holdout/queries.jsonl  # sealed: never read by tuning tooling; harness-only
  results/             # tracked artifacts, one file per run (D8 cache keys inside)
```

### Query item schema

```json
{"id": "q-0007",
 "text": "how should an agent recover a session after its harness crashes?",
 "provenance": "external-reader | council-packet | issue-thread | log-derived | curator",
 "provenance_ref": "issues/14 | log/2026-08.md#L211 | …",
 "author": "chris | claude-fable-5 | …",
 "class": "standard | vocab-mismatch | no-answer",
 "labeled_at_corpus": "sha256:…",
 "required": ["proxy-boundary-session-capture"],
 "forbidden": ["mcp-stateless-core"],
 "notes": "vocab-mismatch: query says 'crashes/recover', concept says 'capture/boundary'"}
```

- **`provenance` is mandatory**; metrics report split by class, `curator` items discounted in headline numbers. The append-only log is the designated out-of-distribution source (`log-derived`).
- **`class: vocab-mismatch`** requires little/no lexical overlap between `text` and each `required` concept's title+definition — checked mechanically (token-overlap threshold declared in the harness config). This subset is the sole justification a graph stage has; it is reported separately, always.
- **`forbidden`** are anti-labels (hub-domination instrument). **`class: no-answer`** items have empty `required` and expect silence.

### Labels (qrels)

Required-concept lists cannot compute precision. Precision-bearing metrics use **pooled qrels**: the pool for a query is the union of top-k outputs from every registered challenger (lexical-only+aliases, BM25+k-hop decay, spreading activation, typed PPR) plus the `required` set; each pooled concept is judged relevant / marginal / irrelevant. Judgments flow through the **ADR-010 two-phase machinery** (`kb evalset label` emits the task; a supplier answers; the CLI validates and appends to `qrels.jsonl` with supplier attestation) — so the log proves every label predates the ranker commit it later judges. `label-edits-after-failure` is computed by the harness from qrels timestamps vs failing-run timestamps and reported as a first-class metric: it is the gaming detector.

### Metrics

Per run: recall@k and success@k against `required`; precision@k against pooled qrels only (absent pooling, precision is reported as `n/a`, never approximated); anti-label violations; no-answer false-positive rate; all split by provenance class and by `class`. Aggregates carry a **declared noise band** (established from ≥5 repeat runs before any comparison is made); cross-run comparison is the per-item pass/fail diff, not scalar deltas. Slice reports: by concept in-degree quartile, by graph component, by facet.

### Harness

`kb evalset run` — engine code, deterministic: pinned `KB_NOW`, no network, results keyed by corpus-hash + schema + tool + policy hash (D8) and written to `results/` as a tracked artifact. Freshness fields (D5) are excluded from the diff. Cross-platform determinism (macOS/Linux, Node 22/24) is a hygiene test.

### CI posture

- **Gating now (hygiene):** schema validity, unique IDs, provenance present, vocab-mismatch check passes for items so classed, labels parse, harness runs deterministically, results artifact committed.
- **Non-gating now (scores):** the run executes and publishes; regression review is a required checklist line in the PR contract for corpus- or ranker-touching PRs (an obligation to look, not a decoration).
- **Promotion to score-gating** requires ADR-013 D2's five triggers, then gates as a ratchet on the sealed holdout (no regression below baseline − noise band) with a logged waiver path.

### Label lifecycle

`labeled_at_corpus` pins the corpus version; a substantive corpus revision marks dependent labels `stale` (harness warns, items drop from headline metrics until re-confirmed through the two-phase flow). Holdout items are relabeled only through the same flow, never edited in place.

### Seed content plan (initial ~40 items)

- 10 `log-derived` (mined from log shard rationales — real questions the corpus answered or failed to answer during its own construction),
- 10 from council packets and issue threads (`council-packet` / `issue-thread`),
- 10 `curator` standard items (discounted in headlines, useful for smoke),
- 6 `vocab-mismatch` (authored against the mechanical overlap check),
- 4 `no-answer`.
External-reader items accrue as they arrive; the 50%-external promotion trigger is expected to take months, and that is fine — the set is honest before it is large.

## Corpus grounding

The spec's methodology now stands on corpus concepts rather than bare prose — each admitted through the gate with hashed evidence: [[cranfield-paradigm]] and [[trec]] (where fixed-judgment evaluation and the qrels/pooling vocabulary come from, including the 30%+ expert-judge disagreement that motivates pooled rather than assumed ground truth), [[vocabulary-mismatch]] (the quantified case for the vocab-mismatch subset: ~80% naming divergence, query terms absent from 30–40% of relevant documents), [[okapi-bm25]] (the seed-stage function and null-hypothesis baseline), [[pagerank]] and [[spreading-activation]] (the graph-rank design space the D1 bake-off spans, with the small-graph caveats stated as properties), [[goodhart-variants]] (the failure family the anti-gaming controls resist), and [[adaptive-data-analysis]] + [[ladder-mechanism]] (why sealed holdouts deplete under adaptive consultation and why the reporting channel — ratchets, noise bands — is part of the mechanism).

## Out of scope

Ranking implementations (D1 bake-off — after packet 8 and only when the tripwire fires); embeddings in any read path; any model call inside the harness.
