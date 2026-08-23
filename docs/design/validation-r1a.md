# Design spec: validation R1a — deterministic capture, structural checks

**Status:** implemented 2026-08-22 · **ADR:** [009](../adrs/009-validation-protocol.md) · **Council review:** 2026-08-22 packet 4 (REJECT) — rewritten; dispositions in [`../reviews/2026-08-22/dispositions.md`](../reviews/2026-08-22/dispositions.md)

The buildable half of the validation protocol. Capture and structural validation are deterministic; support verdicts are supplied judgments under the [envelope](protocol-envelope.md) (`evidence-verdict` task class — panels excluded). Nothing here needs the lineage resolver or tiers (R1b, gated).


*Deviations at implementation: none beyond the KB018 baseline-lag refinement noted in §1.*

## 1. The evidence store (C5)

**The missing artifact every earlier defect traced to.** Per-note observation history lives at `.kb/evidence/<slug>.jsonl` — append-only, committed, written only by network verbs (`sources`, `revalidate`, `support`). One observation per line:

```jsonc
{ "cite_id": "…",                 // sha256(note slug + canonicalised URL | typed identifier)[:12]
  "url_canonical": "…",           // or {"identifier": {"type": "doi|isbn|dataset|standard|personal-comm", "value": "…"}}
  "observed_in": "<git commit of the observing run>",   // commit binding, not wall clock
  "reachability": "ok | dead-no-archive | dead-with-archive | blocked-4xx | paywall | js-required | rate-limited | redirect-drift | dns-transient | malformed | not-fetchable",
  "authenticity": { "content_digest": "sha256:… | null", "title_match": true|false|null },
  "archive_url": "… | null", "extraction_version": "…",
  "first_seen": "<commit>", "consecutive_failures": 0 }
```

- **Reachability and authenticity are orthogonal axes, both recorded, neither an accusation.** A `never-resolved` flag is set *mechanically* when `consecutive_failures ≥ 3` across ≥2 distinct observing runs — a neutral observation with a legal home (C5 holds history; frontmatter never does). **Fabrication is only ever a supplied verdict** citing the recorded signals, never a derived state.
- `not-fetchable` covers non-URL citations (DOI, ISBN, dataset, standard, personal communication): they get identifier-form validation and provenance classes, **no liveness**. Liveness checks apply to URL-bearing citations only.
- The note's `sources[]` keeps a compact latest-state summary (`hash`, `retrieved`, `reachability`) for readability; **the evidence store is authoritative** and verify cross-checks the summary against the latest observation (KB018, the facet-mirror pattern) — *refined at implementation*: the **liveness state** must match; the **hash** is the accepted baseline and intentionally lags a drifted observation until `kb revalidate --accept`, which is exactly the drift-review workflow. Full-page snapshots are never committed: a size-capped, gitignored cache (`.kb/cache/snapshots/`) holds them for judgment tasks — a public repo must not accumulate third-party page text.

## 2. Support verdicts (two-phase, envelope-bound)

`kb support <slug>` is a **network verb** (fetches/refreshes snapshots via the cache). It emits envelope tasks — ≤5 citations per task, extracted text capped at 256KB per citation (over-cap → chunked by section with a stated rule), content types text/html and PDF-extracted — pairing each **claim within the note** (quoted proposition) with the source snapshot (digest + passage). Full extracted text, never snippets: snippet-only evidence hides extraction faults the judge cannot see. Unjudgeable citations are recorded, not guessed: `blocked-4xx`/`paywall`/`js-required` ⇒ no task emitted, reason in the evidence record; `dead-with-archive` ⇒ the archive snapshot is fetched and judged *as the archive's content, labelled so*.

Answers record `SUPPORTED / UNCERTAIN / CONTRADICTED` per (claim × citation) with a one-clause rationale into the evidence store; `UNCERTAIN`/`CONTRADICTED` route to the queue (ADR-005) — terminal dispositions (`accepted`/`rejected`/`accepted-tension`) stop the KB011 clock, so a documented tension stays green. Supplier calibration (which models suffice) is **operator guidance, never task-payload text** — economics in the prompt biases verdicts.

## 3. Note-level supersession

Both fields are lists (`supersedes: [slug…]`, `superseded_by: [slug…]`) — fan-in *and* fan-out (a note split into two successors) are expressible. Checks, all KB016: targets exist · reciprocity both directions · acyclicity by chain walk · a superseded note's `status` is exactly `superseded`. The transition is a gated verb — `kb supersede <old> --by <new…>` — one atomic two-file transaction (temp-set + move, rollback on subset-verify failure) that also leans the old body to a one-line pointer; renames go through `kb migrate`, which updates both sides in the same transaction. `kb query` halves a superseded note's score and stamps the hit `superseded_by: [...]` (acceptance-tested).

## 4. Provenance classes

`sources[].class: external-primary | external-secondary | internal-synthesis | model-inference` — **source** provenance, assigned by the proposer, spot-checked by audit; mixed-axis cases take the least-corroborating class (ADR-009 §6). Migration is honest about ignorance: same-repo wikilink ⇒ `internal-synthesis`; everything else ⇒ **`unclassified`** (a sentinel, not a fabricated claim), worked down as a visible backlog. Invariant 7 gets its named rule here: a `## Sources` consisting entirely of internal classes ⇒ KB017 warning ("provenance-thin — no external corroboration recorded"). The corroboration *computation* arrives with R1b; until then that warning is the entire mechanical footprint — stated plainly, not dressed as enforcement of a computation that doesn't exist.

## 5. Verify enforcement mapping

| code | condition | severity |
|---|---|---|
| KB015 | URL-bearing citation with no liveness state / state outside enum | error — but **absence of any evidence record is a warning** until a network verb first touches that citation (this is the whole pre-R1a migration story) |
| KB016 | supersession integrity (targets, reciprocity, cycles, status) | error |
| KB017 | `sources[].class` missing · `unclassified` · all-internal | missing = error once `kb.config.yaml` records `validation_migration: r1a-complete` (the committed, hermetic-readable severity switch); `unclassified` and all-internal = warning |
| KB018 | frontmatter summary ≠ latest evidence observation | error |

Warnings never exit non-zero; errors do (ADR-002). Verify reads the evidence store, never the network, never the snapshot cache.

## Acceptance

- Both-polarity fixtures for KB015–KB018; envelope round-trip for a support task (stale snapshot ⇒ refused); never-resolved flag set at the third failure across two runs and **not** at three failures in one run; migration idempotent; unclassified-sentinel counted in verify output; supersede rollback leaves both files byte-identical on induced failure; gate-path network test stays.
- Non-goals: lineage collapsing, tier assignment, reliability grading (R1b); citation-count dashboards.
