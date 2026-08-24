# The parallel run: our own corpus, back through the gate

*2026-08 · companion to [the launch note](launch.md) · method and records in [`eval/parallel/`](../eval/parallel/README.md)*

Chancery ships with a reference corpus of 244 concepts. Honesty about its provenance: those notes were produced by the **predecessor pipeline** — different models, different prompts, no gate — and imported. Chancery governs them now (every citation is hashed, every link verified), but it didn't produce them. Which invites an obvious experiment: the concepts kept their sources. Run the sources through the gate the corpus now lives behind, and see what the gate does.

So we did — as a pre-registered eval, not a victory lap. The method note, metrics, and confounds were [committed before the first assessment ran](../eval/parallel/README.md), because an eval whose success criteria are written after the results is a press release.

## Setup, and what this cannot show

**A stratified sample of 25 of the corpus's 275 unique source URLs**, selected deterministically (sha256 order within domain strata — no RNG, no cherry-picking), covering all 15 domains: 22 sources last recorded reachable, plus 3 deliberately degraded ones, included so the run would have to demonstrate refusal handling rather than a curated happy path. The parallel corpus lives in [`eval/parallel/`](../eval/parallel/) as a deliberately nested Chancery root — its own gate, queue, evidence store, and log; the main corpus never sees it; the npm package's allowlist-closure test proves it cannot ship.

Two confounds, named up front. **Supplier:** the parallel run's judge and drafter is one model, today, with proposer overlap disclosed in every record; the predecessor's were different models, months ago — so prose-quality differences between the corpora mean nothing. **Input:** sources were fetched today and may differ from what the predecessor read. What *is* attributable: admission behaviour, structuring behaviour, and whether an audit trail exists.

## The funnel: 25 → 20 → 14 → 26

The predecessor admitted all 25 — by construction, since each backs a shipped concept. Chancery's funnel:

- **Ingest refused 5.** The three degraded sources failed *exactly as their recorded reachability predicted* — the JS-only site yielded no extractable content, the 403 stayed a 403, the dead page stayed dead. Two more, recorded `ok` three days earlier, now return HTTP 403 (a Medium post, an Economist piece — bot-walls): reachability drift, caught at the door and recorded rather than worked around.
- **The rubric routed the 20 staged:** 9 promote, 5 split, 4 queue, 2 discard. **Admission: 70% of assessed, 56% end-to-end — against 100%.**
- The 14 admitted sources became **26 concepts**, each with hashed evidence, classified facets, provenance-classed sources, and clause-carrying links. `kb verify`: 0 errors, 0 warnings.

The two discards earn their verdicts. A personal homepage — a bio and book list, citable by the predecessor as evidence for a concept about comprehension debt — fails durability and actionability outright: there is no idea in a bio page for a concept to preserve. And a vendor's product-launch press release hit the `pure-announcement` knockout. The knockout is absolute; no dimension score can average it away.

The four queued sources are the subtler behaviour. Each rated some mix of weak-but-not-failing (a marketplace README, a product-coverage piece, a single-tool war story, a vendor how-to), and the routing table has **no rule** for those combinations — deliberately. The rubric refuses to guess and parks them for the owner. The predecessor had no "park it" state: everything became a concept. The queue is where honest uncertainty goes to be a recorded decision instead of a silent admission. *(Update, same day: the owner dispositioned all four — three declined, one admitted by recorded override. The override is itself a signed judgment in the log, not an edit around the gate; the run's numbers above measure the gate unaided.)*

## Where the processes agree: what's composite

The unexpected result is structural convergence. Of the six sampled sources the predecessor had split into multiple concepts, the parallel run's rubric split five — the MCP release candidate, the Cloudflare MCP architecture, the context-layer essay, the code-graph piece, the weak-to-strong repo — and split nothing the predecessor had kept single. Nineteen of twenty sources got the same single-versus-composite call from two different processes months apart. Even the cut lines land close: both runs carved Code Mode, shadow-MCP detection, and platform-baked governance out of the Cloudflare piece; both carved the stateless core, extensions, and authorization hardening out of the MCP release candidate.

The sole disagreement is informative rather than embarrassing: the predecessor cut an evals essay into two concepts, promoting its passing mention of LLM-as-a-judge to a full note; the parallel run judged that material peripheral in the source and kept one concept. Reasonable people — and reasonable processes — can differ there. But now the difference is *visible*, with a rationale on file, instead of being two silently different corpora.

So the gate is not a different way of reading sources. It is a different way of deciding what deserves to exist — admission diverges (100% vs 56%), structuring converges.

## The drift finding, and the one we can't have

Of the 20 sources fetchable today, 19 hash byte-identical to their accepted baselines. The single content drift in the sample is the NVIDIA press-release page — **the same source the gate discarded as a pure announcement**. The source class the rubric trusts least is the one that changed under our feet within days. Announcements are load-bearing for nobody, and the sample suggests the rubric has that right.

The honest asterisk: the baselines were re-accepted on 2026-08-21, when the evidence machinery landed — so the measured window is three days, not the months since original capture. Drift since the predecessor actually read these pages is **unknowable, because the predecessor recorded no content hashes.** There is no stronger argument for falsifiable citations than reaching for the comparison this eval most wants to make and finding the predecessor never wrote down what it saw. Three days into governed life, the corpus can already answer "did my evidence change?" — a question its first eight months cannot answer at all.

## What the records show

Every number above is reproducible from the eval directory: 20 assessments with per-dimension rationales, 6 drafting envelopes, facet and link verdicts, the evidence store, and a queue whose four judgments each carry the reason they were parked and, now, the owner's recorded disposition. Supplier attestation (`model-single`, proposer overlap disclosed) travels in every record. That inventory — not the concept prose — is the deliverable. The predecessor produced 37 concepts from these 20 sources and cannot say why any of them was admitted; the parallel corpus can produce, for all 26 of its concepts, the verdict that admitted the source, the rating that shaped its structure, and the hash of the evidence it stands on.

A full-corpus run (275 sources) stays gated on a recorded trigger, per the method note — the sample's picture is stable enough that spending the supplier budget needs a reason, not an itch.

*The parallel corpus is in-repo but out-of-package: nested Chancery roots keep eval artifacts governed by the same machinery without shipping them to anyone's `node_modules`.*
