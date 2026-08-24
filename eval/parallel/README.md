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
- The supplier for every judgment is attested in each C6 record with
  `proposer_overlap: true` throughout. *Amendment (2026-08-24, full run):* the
  sample and all full-run assessments were supplied by claude-fable-5;
  mid-run the owner paused and switched suppliers for cost — residual concept
  drafting is claude-opus-5, classification/links/cards claude-sonnet-5. Each
  record names its own supplier, so the mix is auditable per artifact.

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

## Results (run executed 2026-08-24)

Companion article: [`docs/the-parallel-run.md`](../../docs/the-parallel-run.md).
Every number below is reproducible from this directory's records: assessments in
`.kb/assessments/`, drafts and verdicts in `.kb/verdicts/`, queue in `.kb/queue/`,
evidence in `.kb/evidence/`.

**Funnel.** 25 sampled → 20 staged → 14 admitted → 26 concepts.

- **Ingest refused 5/25.** The 3 deliberately degraded sources failed exactly as
  their recorded reachability predicted (`js-required` → no extractable content;
  `blocked-4xx` → HTTP 403; `dead-no-archive` → HTTP 404). Two sources recorded
  `ok` on 2026-08-21 now return HTTP 403 (medium.com, economist.com — bot
  blocking): reachability drift caught at the door.
- **Assessment routed 20:** 9 promote, 5 split, 4 queue, 2 discard. Admission
  rate 14/20 (70%) of assessed, 56% of the sample end-to-end — against the
  predecessor's 100% by construction. The 2 discards: a personal bio/homepage
  (durability and actionability `fail`) and a vendor launch press release
  (`pure-announcement` knockout). The 4 queue entries are (weak, weak, strong)
  or (weak, strong, strong) rating combinations with no routing rule — the
  rubric refuses to guess and parks them for the owner.
  *Disposition (2026-08-24, owner):* three declined (plugin directory README,
  Apex coverage, Keyforge docs — each with the primary source noted as the
  better future ingest); one admitted by recorded override (`kb promote
  --force`): the proxy-capture war story, rated (weak, strong, strong), drafted
  principle-first as `proxy-boundary-session-capture`. The parallel corpus is
  27 concepts; the run's own funnel numbers above are unchanged — they measure
  the gate unaided, and the override is the owner layer doing its job.

**Structuring.** The 14 admitted sources produced 26 concepts (9× 1→1, 1→2,
1→3, two 1→4, 1→4). The same 20 staged sources back 37 distinct concepts in the
predecessor corpus (43 across all 25). On *which* sources are composite the two
processes agree almost perfectly: of the six sources the predecessor split
multi-way, this run's rubric split five (MCP release candidate, Cloudflare MCP,
context-layer essay, FalkorDB code-graph, weak-to-strong) and split nothing the
predecessor kept single. Sole disagreement: the evals essay (predecessor 2,
this run 1 — the LLM-as-a-judge material is peripheral in the staged
extraction). Where both split, the cut lines land close: both carved
Code Mode, shadow-MCP detection, and platform-baked governance out of the
Cloudflare piece; both carved the stateless core, extensions, and authorization
out of the MCP release candidate.

**Drift.** Of the 20 sources fetchable today, 19 hash byte-identical to their
accepted baselines; the single content drift is the NVIDIA press-release page —
the same source the gate discarded as a pure announcement. Honest scope note:
the main corpus's baselines were (re)accepted on 2026-08-21 when the evidence
machinery landed, so the measured window is three days, not the months since
original capture. Drift since original capture is **unknowable — the
predecessor pipeline recorded no content hashes.** That absence is the
strongest argument this repository makes for falsifiable citations.

**Supplier attestation.** Every verdict and draft in this run carries
`supplier: model-single (claude-fable-5)` with proposer overlap disclosed: the
same agent staged, judged, and drafted. The predecessor's suppliers were
different models and prompts, months earlier — prose differences between the
two corpora are not attributable to the process (confound 1, above).

**Trigger decision.** *Armed by the owner, 2026-08-24*, with a goal beyond
measurement: run the 250 residual sources through the same judged loop and,
if the result stands up, **replace** the imported example corpus (concepts and
cards) with one legitimately generated by the tool. Residual list:
[`residual.json`](residual.json) (every unique source URL not in the sample).
Execution is fanned out to subagents per stage — ingest, assess, draft,
facets, links — each judgment still travelling in its own envelope with
supplier attestation; applies serialize on the root's lock. The swap itself
is a separately reviewed change, not part of the run.

## Full-corpus run (2026-08-24, results)

The armed run processed all 250 residual sources: **235 total assessed
(including the sample) → 72 promote / 31 split / 85 queue / 47 discard →
184 concepts**, gate at 0 errors / 0 warnings. Links: isolated 45→3, median
inbound 1→2. Suppliers per amendment above, attested per record. Dogfood
catch: `sources --apply` was found dropping curator-set source metadata on
first observation (157 provenance classes silently lost, restored from git);
fixed in the engine the same day.

**Queue strategy (owner decision, 2026-08-24).** A proposed rubric-v4 rule —
(weak durability ∧ weak actionability) → discard, covering 55 of the 81
assessed queue entries — was **rejected by the owner**: a weak source does
not invalidate the concept it gestures at. Adopted instead: a
**source-strengthening pass** — for each parked item, extract the durable
kernel named in its assessment rationale, search for a stronger primary
source, and re-enter it through the normal loop (ingest → fresh assessment
→ promote only if the better source clears the bar). Items with no better
source get resolved with that finding on record. The queue is worked off by
improving evidence, not by lowering or mechanising the bar.

**Source-strengthening pass (2026-08-24, results).** All 55 weak/weak items
hunted under a hard per-item budget (2 searches, 2 ingests, 1 assessment,
3 applies, ≤12 tool calls; budget exhaustion leaves the entry open rather
than resolving it): **28 promoted on stronger primary sources · 9 duplicates
of existing concepts caught by the assess-phase disqualifier · 12 where even
the better source failed the bar · 4 with no better source found · 2 called
off at budget** (still open). Notable protocol behaviour: one worker's own
judgment leaned promote on a re-found source, but the identical content
already carried an applied verdict routing queue — the worker deferred to
the recorded verdict, since re-litigating identical content is the
rating-shopping the idempotent-task design exists to prevent. Corpus after
the pass: 212 concepts; open queue entries: 37 (26 hand-review patterns,
2 called-off, 9 resolved-adjacent remainders).

---

**Promotion (2026-08-24).** The generated corpus — 212 concepts, 212 decks,
1,112 cards — was promoted to the repository root, replacing the imported
example corpus, together with all of its records: assessments, evidence
store, queue (history and open entries), and log entries (appended to the
root shard). This directory retains the method note and the deterministic
inputs (`select-sample.mjs`, `sample.json`, `residual.json`,
`hunt-items.json`); everything else now lives at the root, and the
pre-promotion state is preserved in git history.
