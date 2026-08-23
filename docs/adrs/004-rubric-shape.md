---
title: "ADR-004: Rubrics are knockouts + ordinals + a routing table — never weighted sums"
status: accepted
date: 2026-08-22
tags: [adr, judgment, rubrics]
links: ["001-two-phase-judgment-protocol.md", "005-proposal-queue.md"]
council_review: "2026-08-22 packet 2 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

Promotion (and card-refresh, and future audit verdicts) need a model's judgment converted into an action, repeatably, across different models over time. The naive design — weighted criteria scored 0–1, summed, banded at thresholds — has three measured failure modes: **compensation** (a fatal flaw averaged away by good prose), **model drift** (a 0.70 threshold calibrated to one model's stringency rots on the next), and **sycophancy** (asked for floats, models cluster ~0.8; the distribution carries no information).

## Decision

Rubrics are data files with three stages:

1. **Knockout disqualifiers** — any YES ends scoring, no arithmetic, no compensation possible. A fired knockout does **not** hard-code an action: it produces a distinguished tuple that still resolves through the routing table (so `duplicate` can route to `discard` while `unverifiable-claims` routes to `queue`). Uniform knockout→discard was the reviewed defect; actions live in exactly one place.
2. **Ordinal dimensions** (`fail`/`weak`/`strong`), each anchored to **exemplar notes committed in the repo and hash-pinned in the task envelope** (`input_hashes.exemplars`), so judgment is calibrated against fixed reference points rather than a model's internal scale — and a silently edited exemplar stales every in-flight task instead of silently recalibrating the rubric. When models change, you re-check exemplars, not magic numbers.
3. **A deterministic routing table** over the (knockouts, ordinal tuple) → `promote`/`split`/`queue`/`discard`. The table is total over the input space (verified by fixture); the default route is `queue` — never silent discard, and `discard` is itself only ever a recommendation (POLICY: no automated deletion).

Every judgment carries a one-sentence rationale, so queued items are reviewable without re-reading the source.

## Consequences

- Auditable and model-portable by construction.
- Observed on real content the first day (an anecdote, not a proof — the C6 record is the evidence): an ingest rated `strong` on all three dimensions was still routed out by the `duplicate` knockout — precisely the case a weighted sum would have promoted.
- Extension = add a rubric file; the routing table is the only place actions are defined — for knockouts too.

## Related

Routing behaviour pinned by `routing.test.mjs` (knockouts remain absolute).
