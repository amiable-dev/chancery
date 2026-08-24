---
title: "ADR-013: Graft-informed adoptions — deterministic graph-ranked retrieval and evidence legibility"
status: proposed
date: 2026-08-24
tags: [adr, retrieval, evidence, exports, scope]
links: ["002-ci-is-the-contract.md", "010-judgment-suppliers.md", "../SCOPE.md"]
council_review: "pending — packet 7"
---

## Context

A critical comparison against NanoNets/Graft (2026-08-24; brief in the issue thread of #3) found a convergent body plan — markdown + wikilinks + typed links + content hashes + a deterministic CLI holding no model key + MCP + generated agent adapters — built on the opposite ontology: Graft's graph is a **cache** over a rebuildable source of truth (the code), Chancery's corpus is a **record** with no source of truth to rebuild from. Nothing in Graft substitutes for the gate; several of its mechanisms transfer. This ADR fixes which ones, and on what terms. Issues #3–#8 track the items; this document is the decision of record for all six.

## Decisions

**D1 — Retrieval architecture (issue #3).** When SCOPE's full-text-search tripwire arms, `kb query`'s architecture is **lexical-seed + graph-rank**: a BM25-style lexical scorer over titles, definitions, and tags proposes seed concepts; personalized PageRank (random-walk-with-restart) over the corpus's typed link graph ranks the result. Deterministic, no embeddings, no model, no network — the gate's properties extend into retrieval. This decision **designates the destination only**: the build remains gated on the existing tripwire (measured recall degradation, two consecutive months), which now has a measurement instrument via D2. *Rejected alternative:* embedding search — nondeterministic across model versions, puts a model artifact in the read path, and duplicates what the hand-curated link graph already encodes.

**D2 — The query eval set (issue #4), built now.** SCOPE's tripwire presumes a "query eval set" that does not exist. Build it as specified by the corpus's own `golden-dataset-retrieval-evals` concept: real questions labeled with required concepts; deterministic precision/recall against what `kb query` actually selected; run in CI **non-gating**, tracked for regression. TDD; the eval harness is engine code and travels the normal test path.

**D3 — Crux excerpts (issue #6).** An optional `crux` field per source in concept frontmatter: the load-bearing verbatim passage, captured when the source is judged, bounded at 500 characters. Motivation: the corpus already holds `dead-no-archive` citations whose evidence no one can re-read; a captured excerpt survives source death and gives `kb support`'s quote-binding a stored anchor. *Rejected alternative:* full snapshot storage — size, copyright, and it converts an evidence ledger into a content archive. The bound keeps excerpts quotation-sized. Schema change ⇒ versioned migration.

**D4 — Trust-graded rendering (issue #5).** Exports surface what the records already know: supplier class (deterministic / model-single / model-panel / human), provenance class, and owner overrides, as visible grading in the doc-site renderer (Graft's solid-vs-dashed edge idiom, applied to our trust axes). Recording without rendering leaves the legibility argument half-made.

**D5 — Evidence age at answer time (issue #7).** `kb query` answers carry per-citation evidence age from the C5 store ("last verified N days ago"). Store reads only; the no-network gate property is untouched.

**D6 — SCOPE additions (issue #8, #1).** `kb viz --export` (single-file HTML graph viewer) enters SCOPE as a **tripwire** — arms at external-adopter demand or if the #1 queue-visualisation review selects it as a surface. A statusline staleness counter (open queue entries + drifted citations) is recorded as a candidate surface in #1, not decided here.

## Execution order

D2 (eval set — instrument first), D4 (trust rendering), D3 (crux), D5 (evidence age), D6 (SCOPE edits, immediate), D1 (build only when its tripwire fires). Each build item: spec → TDD → gate. Council consult (packet 7) precedes any build.

## Consequences

- Retrieval stays deterministic end-to-end, and the tripwire finally has an instrument; a future "why not embeddings" debate has its answer on file.
- The evidence ledger gains a survivability property (crux) at a bounded cost, and the trust model becomes visible where readers actually look.
- Two upstream observations from the comparison are recorded but **not** adopted: Graft's regenerate-don't-govern model (category mismatch — nothing here is regenerable), and its dot-directory walker limitation (which hides this repo's own engine from it; noted in PR #9).
