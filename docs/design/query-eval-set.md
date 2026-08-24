# Design: the query eval set (ADR-013 D2) — v2, as amended by packet 8

*2026-08-24 · reviewed by council packet 8 (ACCEPT-WITH-CHANGES, unanimous; synthesis and dispositions in [../reviews/2026-08-24/](../reviews/2026-08-24/packet-8-synthesis.md)). Changes B1–B8/G1–G4/R1–R10 adopted inline; build proceeds under TDD; the first run's report returns with packet 9 alongside D1. Blocking sets: B* before any D1 adjudication, G* before any score gates anything.*

## Shape

```
eval/queries/
  queries.jsonl          # immutable-once-accepted items; supersede by new id
  qrels/
    apriori.jsonl        # labels authored from query text alone (required/forbidden) — the only
                         #   labels that carry the predates-the-ranker property; reported separately
    pooled/<version>.jsonl # posterior pooled judgments, frozen per version, append-only
    manifests/           # pool manifests: contributing commits, configs, depth, corpus hash, batch
  rubric.md              # versioned relevance rubric with worked examples; revisions invalidate
                         #   agreement statistics and force re-sampling
  aliases.yaml           # D9 table; snapshot hash pinned per run; edits enter the delta ledger;
                         #   frozen during bake-offs
  holdout/               # see sealing regime; encrypted at rest optional (age + manifest SHA)
  ledger.jsonl           # delta ledger (see integrity)
  results/               # tracked artifacts, one per run; pruning policy: latest per policy hash
                         #   + all promotion-relevant runs
```

One **eval-set hash** covers queries, apriori labels, pooled qrels (incl. supersessions), aliases, classes, provenance, stale status, pool manifests, and metric/policy config. Every run and every report records it.

## Query items

```json
{"id": "q-0007",
 "text": "how should an agent recover a session after its harness crashes?",
 "provenance": "external-reader | council-packet | issue-thread | log-derived | curator",
 "provenance_ref": "issues/14 | log/2026-08.md#L211 | …",
 "author": "chris | claude-fable-5 | …",
 "authoring_direction": "question-first | answer-first",
 "class": "standard | vocab-mismatch | no-answer",
 "hypothesis": "vocab-mismatch only: why the author believes this is lexically hard",
 "labeled_at_corpus": "sha256:…",
 "required": ["proxy-boundary-session-capture"],
 "forbidden": ["mcp-stateless-core"]}
```

- `text`, `required`, `forbidden`, `class` are **immutable post-acceptance**; corrections supersede via a new `id` with a pointer. Comparisons score only ids live in both versions.
- **Provenance mandatory**; `curator` items are **excluded** from headline metrics (not discounted) and capped by hygiene; the log is the designated out-of-distribution source, grown preferentially with no cap.
- `authoring_direction` reported separately — answer-first items share the concept's vocabulary and systematically inflate the lexical baseline.
- **`forbidden` anti-labels**: hub candidates are derived by rule (top-decile in-degree absent from pooled-relevant) and require judge confirmation before scoring; hand-picked anti-labels are themselves a gaming vector.
- **`no-answer` abstention contract**: a challenger abstains when no candidate clears a declared score cutoff (cutoff in the policy hash). Every `no-answer` item is backed by an **exhaustive attested scan** of all concepts (titles and definitions) as its own logged two-phase task — a universal negative over 212 concepts is affordable and is never a bare assertion.

### Vocabulary-mismatch: two tiers (R1)

- **Tier 1 — mechanical screen, diagnostic only:** pinned stemmer, English stoplist **plus a corpus-frequency stoplist** (top-N tokens across the corpus), computed against the **indexed surface** (everything the lexical challenger sees, not just title+definition). Declared rule: zero (or declared ≤1) shared content tokens. Stemmer version, stoplists, threshold all inside the D8 policy hash.
- **Tier 2 — `lexical_hard`, definitional and computed:** an item is `lexical_hard` at (corpus hash, alias snapshot) **iff the frozen lexical-only+aliases challenger fails to return any `required` concept in top-K** — recomputed every run, never authored, evidenced by a referenced run. Graph-challenger *success* is deliberately not part of the definition (that would make the graph stage's win tautological).
- **`alias_repairable`** (computed): would one alias fix it? If yes, the item is evidence for D9, not for a traversal stage. **Class drift** (items graduating out of `lexical_hard` as aliases grow) is reported every run.
- Curator-authored mismatch items are `synthetic-vocab-mismatch`, smoke-only; the headline mismatch slice is quotable only at ≥10 items with ≥half non-curator provenance.

## Labels and judging (B1–B3)

**The a-priori/pooled split is load-bearing.** A-priori labels (`required`/`forbidden`) are authored from query text alone; the log proves they predate any ranker they judge, and they are reported as their own subset. **Pooled labels are posterior by construction** — the pool is the union of challenger outputs — so their integrity comes from process, not timing:

1. freeze candidate ranker commits + configs;
2. generate the pool (depth ≥ largest reported k), strip attribution, shuffle under a recorded seed;
3. judge **blind** (no system, rank, score, or `required` membership shown) against the versioned rubric;
4. freeze a qrels version;
5. score the already-frozen outputs against it.

Re-pooling happens only on declared events (new challenger, alias change, corpus revision), each pooled concept citing its producing run; **no hand-additions ever**. `unjudged@k` is published; precision is **`pooled precision@k`** in every report, `n/a` (or an interval: unjudged-as-irrelevant → unjudged-as-relevant) wherever coverage of a ranker's top-k is incomplete. `marginal` is defined in the rubric; the primary treatment is strict (marginal ≠ relevant) with the lenient variant always co-reported — a comparison that does not survive both is **not robust**.

**Judge reliability (single-maintainer protocol):** 20% blind test–retest after a cooldown (≥30 days or ≥200 intervening judgments), agreement published; an independent second supplier (a model session is acceptable — the no-model constraint binds the harness, not suppliers) over ≥25% of queries or ≥10, including all `no-answer`, all reported curator items, ≥25% of mismatch items — its labels never enter qrels; the agreement statistic, flagged disagreements, and their **direction** (systematic favor toward the incumbent is a gaming signal) do, with disagreements adjudicated as logged tasks. The query author is never the sole relevance judge for that query. **No comparison is reported as decisive on a margin narrower than measured agreement.** An **exhaustive audit slice** (8–10 stratified queries, all concepts judged) measures the pool miss rate rather than caveating it.

## Metrics and statistics (B4, B8, R3)

Three quantities, never conflated: **determinism** (repeat + cross-platform runs as a hygiene *test* — a deterministic harness has no noise band); **uncertainty** (bootstrap over the query set, ≥1000 resamples, plus label-reliability from the audit slice, plus tie-break-seed perturbation spread — descriptive, printed with counts); **policy tolerance** (the ratchet's regression allowance — a named governance choice, not a measurement).

Reporting: raw numerators and denominators beside every rate; any slice with n<10 as an enumerated item list, never a percentage; per-item pass/fail diffs as the unit of comparison (dev set only — see holdout); the in-degree-quartile slice ships with the first report (the instrument against hub-flattery). All reports watermarked **`pilot / not adjudicable`** until promotion-quality thresholds: ≥100 usable queries, ≥50 non-curator, ≥20 provenance-backed `lexical_hard`, ≥15 independently confirmed `no-answer`, ≥20 items in any slice used in a promotion argument.

**Preregistered D1 decision rule (B8), committed before any bake-off runs:** one primary endpoint with its slice and k; **exact McNemar on discordant pairs** (8–2 of 10 is not significant — no lopsidedness heuristics); declared multiplicity handling across the ~40 metric×k×slice combinations; and the written disposition for "inconclusive" (simplest-within-tolerance wins, per ADR-013 D1).

## Integrity (B6)

Every comparison is computed over **as-of views**: qrels *and* query items truncated to the frozen version appropriate to the comparison (for a bake-off, the qrels version frozen at step 4 — not ranker commit timestamps, which would exclude the pool judgments generated for that bake-off). Where views differ, dual-report; a verdict that flips is not robust. The **delta ledger** records every change to any hashed surface with: did it follow a failing run on the affected item, and does it move a metric in the favored direction — the conjunction publishing as a single **post-hoc-favorable-delta count**, each instance carrying a written rationale. `stale` marking and class reassignment are ledger deltas requiring rationale (closing both escape hatches). Published results are never silently rescored under a new version. **During D1 adjudication the eval set freezes at a declared SHA** — no additions, relabels, alias edits, or corpus edits to `required` targets; any change restarts or is excluded.

## The holdout (B7)

Stated plainly: sealing defends against **tooling leakage and unintentional overfit** — not against the maintainer of a public repo, whom no mechanism can bind. The primary leak is **feedback granularity**, not readability: a ratchet leaks one scalar per look; item-level feedback defeats it regardless of secrecy. Therefore: holdout outputs are **aggregate-only** (verdict vs ratchet line), enforced by a CI lint that fails on per-item holdout fields anywhere in logs or artifacts; the holdout is explicitly carved out of per-item diff mode; a CI job runs the full dev/tuning suite **with `holdout/` absent** and must pass identically (the mechanical proof of non-dependence). Sealing is deferred until ≥15 non-curator items accrue; at seal: exhaustive qrels (so no later addition is possible and as-of truncation is a no-op), a published manifest of salted per-item hashes with count and class mix, and a pinned baseline (labels-as-of-seal, corpus hash, tolerance). Rotation by declared epoch: reveal, verify against the manifest, burn items into the public set, draw fresh from accrued external items. **Access ledger**: ≤1 evaluation per calendar month, ≤N per epoch, "holdout evaluations to date" printed on every report. Encryption at rest (age, plaintext SHA in the manifest, optional council key escrow) as optional hardening. If implementation shows the holdout cannot be both CI-gating and meaningfully sealed, moving the ratchet to the public set is a **D2 amendment returning to council with the D1 packet**.

## CI posture (G1–G4)

**Hygiene, gating now:** schema validity; unique ids; provenance + `provenance_ref` + naturalness attestation present (the tier-1 overlap check gates nothing — it is diagnostic); referential integrity (`required`/`forbidden` resolve; disjoint; `labeled_at_corpus` resolves); near-duplicate query detection across dev *and* holdout; append-only/supersession validation with stale items provably excluded from headline denominators; pool-coverage `n/a` rule; curator-share cap; delta ledger present; holdout-absent suite passes; holdout leakage lint passes; **artifact freshness** (a PR touching retrieval code, aliases, or the corpus must carry a results artifact keyed to the new policy hash) and **artifact reproduction** (committed artifact matches a clean rerun byte-for-byte); **policy-hash completeness** (vocab config, stemmer, stoplists, alias snapshot, pool depth, metric config, marginal treatment, abstention cutoff).

**Scores, non-gating now** — but the obligation to look is an artifact, not a checklist line: the bot posts the machine-generated per-item regression diff (dev only) and every regressed item gets a **named disposition** — accept / investigate / waive-with-expiry (waivers logged, expiring, with linked follow-ups, counted in the promotion record).

**Promotion to score-gating** requires ADR-013 D2's five triggers **plus**: measured judge agreement above a declared floor; bootstrap interval width narrower than the ratchet step; and a passing **mutation test** — deliberately degraded rankers (top result dropped; top-3 shuffled; aliases stripped) must be flagged at the declared threshold, because *if a mutant ranker passes the eval, the eval is decoration*. Promotion is an **event**: executed as a logged ADR with evidence attached (agreement, coverage, mutation result), reviewed by council. Intervals re-establish after any corpus revision staling more than a declared fraction of labels.

## Seed content plan (corrected per R2)

Honest arithmetic: the original plan was 40–50% curator-authored, not 25%. Revised: 10 `log-derived` + 10 `council-packet`/`issue-thread` as the headline set (≥2 distinct non-curator provenances at ≥8 each); mismatch and no-answer items re-sourced from log/issue phrasings wherever possible; curator items retained for smoke only, excluded from headlines. External-reader items accrue; `log-derived` grows preferentially, uncapped. The set is honest before it is large — and the pilot watermark stays on until it is both.

## Corpus grounding

The methodology stands on corpus concepts admitted through the gate with hashed evidence: [[cranfield-paradigm]] and [[trec]] (fixed-judgment evaluation, the qrels/pooling vocabulary, and the 30%+ expert-judge disagreement that motivates measured agreement rather than assumed ground truth), [[vocabulary-mismatch]] (the quantified case for the mismatch subset), [[okapi-bm25]] (the seed-stage function and null-hypothesis baseline), [[pagerank]] and [[spreading-activation]] (the D1 design space with small-graph caveats as properties), [[goodhart-variants]] (the failure family the integrity machinery resists), [[adaptive-data-analysis]] and [[ladder-mechanism]] (why holdouts deplete under adaptive consultation and why the reporting channel — aggregate-only output, access budgets, ratchets — is part of the mechanism, not packaging).

## Out of scope

Ranking implementations (D1 — after this harness exists, under the preregistered rule, when the tripwire fires); embeddings in any read path; any model call inside the harness.
