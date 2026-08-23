---
title: "ADR-009: Validation — deterministic capture and structural checks now (R1a); lineage-counted tiers gated (R1b)"
status: accepted
date: 2026-08-22
tags: [adr, validation, citations, provenance]
links: ["002-ci-is-the-contract.md", "003-files-are-canon.md", "005-proposal-queue.md", "010-judgment-suppliers.md", "../design/validation-r1a.md", "../architecture/data-classification.md", "../design/protocol-envelope.md"]
council_review: "2026-08-22 packet 3 (REJECT) — rewritten; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

Audits of deep-research products show citations that resolve (>94%) yet support their claims only 39–77% of the time ([evidence base](../history/evidence-2026-08.md)); URL-liveness checking **detects** unreachable citations at high rates (the oft-quoted 6–79× figure is a *detection* rate in a check-and-regenerate loop, not a standalone fabrication-reduction effect — R1a provides the detector; any regeneration loop is the supplier's workflow). Corroboration research counts independence in **source lineages**, not URLs, graded on two axes (reliability × corroboration, Admiralty-style). Review found the original protocol's central defects were storage, binding, and freshness — not hermeticity, which the network-verbs-record / verify-checks split already handles and which therefore is *not* the reason R1b waits. **Adjudication cost is**: lineage resolution and tier assignment demand human judgment volume this project must prove it can afford (SCOPE §5).

## Decision

**Split the protocol; gate the expensive half.** Normative detail — schemas, rule IDs, migration — lives in [validation-r1a.md](../design/validation-r1a.md); the decisions:

**R1a — build now.** *Deterministic capture and structural validation; semantic decisions are supplied judgments under the envelope* (the earlier "deterministic evidence" title overclaimed — verdicts are judgments; their capture and binding are deterministic):

1. **Evidence lives in C5** (data-classification): append-only observation records, keyed by **citation identity = (note, canonicalised URL)** for web citations and (note, typed identifier) for non-URL ones. Full-page snapshots are **not committed** — a local, size-capped, gitignored cache holds them for judgment tasks (a public repo must not accumulate third-party page text); the *committed* record carries content digests, passages quoted under fair-use scale, and verdicts.
2. **Liveness records two orthogonal axes, never one**: `reachability` (an enumerated network outcome: ok / dead-no-archive / dead-with-archive / blocked-4xx / paywall / js-required / rate-limited / redirect-drift / dns-transient / malformed) × `authenticity-signal` (content-hash match, title/author match against the citation). **Fabrication is a judgment, never a network result**: a `likely-fabricated` conclusion may only arrive as a supplied verdict citing the recorded signals — a live page can be a hallucinated citation, a dead one genuine.
3. **Support verdicts bind claim to snapshot**: granularity is *claim-within-note* (a source can support one claim and contradict its neighbour), and each verdict is envelope-bound to (quoted proposition) × (source snapshot digest + passage) × (task and answer digests) — reproducible or refused. Verdicts are `SUPPORTED`/`UNCERTAIN`/`CONTRADICTED`; the **evidence-verdict task class is supplier-restricted** (no panels — ADR-010).
4. **Verify has an explicit enforcement mapping**: pass/warn/fail per recorded state, codes allocated from the overview registry (KB015+); a citation with *no* evidence record is a warning, not an error, until a network verb first touches it — which is also the entire migration story for the pre-R1a corpus. Freshness is expressed by commit/object binding, not clocks; re-observation scheduling is a job, never verify.
5. **Scope is stated, not assumed**: liveness applies to URL citations only. Non-URL citations (DOI, ISBN, dataset, standard, personal communication) get identifier-form validation and provenance classes, no liveness — and they may be the majority of a real bibliography; the spec carries the non-URL branch.
6. **Provenance classes** (`external-primary` / `external-secondary` / `internal-synthesis` / `model-inference`) classify **sources**, assigned by the proposer and spot-checked by audit; where axes mix (a model-authored internal synthesis), the *least-corroborating* class wins. This vocabulary is disjoint from **decision provenance** (`human`/`model`/`mechanical`, owned by the envelope — ADR-010). Invariant 7 gets a named rule: verify refuses any internal-class citation counted as corroboration.
7. **Supersession integrity checks are enumerated in the spec** (cycle refusal, dangling-target, reciprocity, rename tracking, fan-in permitted, superseded notes remain addressable), each with a registry code.

**R1b — gated, with an executable trigger.** Lineage resolver and two-axis tiers build only after: Gear-2 live; ≥90 days *and* ≥50 support-verdict items of R1a evidence; an adjudication-budget audit computing projected items/week × minutes/item against the owner's stated budget (SCOPE §5), decided by the owner, recorded as a dated artifact — with **"cancel R1b" as a first-class outcome**, not perpetual re-queueing. The earlier "verified-tier = k≥2 independent lineages or one authoritative primary" is a **non-binding sketch**: R1b's semantics are set by the evidence period, and a primary source establishes what it said, not that it is true.

## Consequences

- Everything capturable-by-rule ships immediately; judgment-hungry machinery waits for proof it earns its adjudication cost.
- The corpus's own governance documents are inside R1a's jurisdiction once it exists — the ADRs' quantitative claims get the same citation discipline they mandate (review C8 accepted as a standing obligation).
- Refresh preserves history via git + note supersession + C5 observation records (per-citation records are defined *here*, stored under ADR-003's class rules), not per-fact timestamps.
