# The parallel run — method (pre-registered 2026-08-24)

**Question:** the reference corpus (244 concepts) was produced by the predecessor
private pipeline and *imported*; it is governed by Chancery but was not produced
by it. If the same sources are run through Chancery's judged loop from scratch,
what does the gate do with them — and how does the output compare?

This file is written and committed **before the first assessment runs**. The
metrics below may not be reframed around the results.

## Setup

- This directory is a **deliberately nested Chancery root** (`kb init --force`):
  its own ontology copy, gate, queue, evidence store, and log — the main
  corpus's verify, query, and export never see it, and the npm tarball's
  allowlist-closure test guarantees it cannot ship.
- The engine is the repository's own working copy (`node ../../.kb/bin/kb.mjs`),
  i.e. current `main` — the dogfood is the current build.
- The supplier for every judgment is one model (attested in each C6 record,
  `proposer_overlap: true` throughout — the same agent stages, judges, and
  drafts, disclosed as the envelope requires).

## Sample

**25 of the corpus's 275 unique source URLs**, selected deterministically by
[`select-sample.mjs`](select-sample.mjs) — no RNG:

- Each URL is assigned to the domain of its alphabetically-first citing concept.
- 22 drawn from sources whose last recorded reachability is `ok`: one slot per
  domain (largest 15 domains), the remaining 7 to the largest domains by size;
  within a domain, URLs are ordered by sha256 and the first taken.
- 3 drawn the same way from the 15 sources with degraded reachability —
  included deliberately so the run shows honest refusal handling, not a
  curated happy path.

## Pre-registered metrics

1. **Admission rate.** The predecessor pipeline admitted 100% of these sources
   by construction (each backs at least one shipped concept). What fraction
   does Chancery's rubric route `promote`/`split` vs `queue`/`discard`?
   Knockout reasons are tallied.
2. **Structuring.** The 1-source→N-concepts distribution, compared with the
   same 25 sources' concept counts in the main corpus.
3. **Drift across the capture gap.** For each sampled URL: does today's
   content hash match the main corpus's stored baseline? (The corpus's own
   falsifiable-citations machinery, measured on itself.)
4. **Qualitative pairs.** Up to 5 side-by-side comparisons (old concept vs
   new concept from the same source), clearly labelled as illustrative.

## Named confounds — what this does NOT measure

- **Supplier confound.** The parallel run's judge/drafter is one model, today;
  the predecessor's were different models, prompts, and months. Prose-quality
  differences are **not attributable to the process**. Attributable: admission
  behaviour, structuring behaviour, and the existence of the audit trail.
- **Input confound.** Sources are fetched *today*; content may differ from
  what the predecessor read. Metric 3 measures this rather than pretending
  it away — drift is the thesis, not noise.

## Trigger for scaling

A full-corpus parallel run (275 sources) is **gated**, not planned: it arms
only if the sample yields a finding worth the supplier cost (an admission rate
surprising in either direction, or a structuring pattern the sample cannot
settle), decided by the owner and recorded here.

## Results

*(Empty at pre-registration. Filled by the run; the companion article is
[`docs/the-parallel-run.md`](../../docs/the-parallel-run.md).)*
