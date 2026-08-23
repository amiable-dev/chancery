---
title: "ADR-001: Two-phase judgment protocol — kb never calls a model"
status: accepted
date: 2026-08-22
tags: [adr, architecture, core]
links: ["../SCOPE.md", "002-ci-is-the-contract.md", "003-files-are-canon.md", "010-judgment-suppliers.md", "../design/protocol-envelope.md", "../architecture/write-paths.md"]
council_review: "2026-08-22 packet 1 (REJECT) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

The engine serves multiple agent harnesses of unequal capability, plus humans, and its gate must run in CI. Three forces:

1. **Agents cannot be relied on for bookkeeping.** The predecessor vault's 2026-07-26 incident — an automated pass rewrote wikilinks inside code spans and destroyed concept-gap records (recorded in [`../history/corpus-provenance.md`](../history/corpus-provenance.md) and `.kb/POLICY.md`) — is the founding failure. Note the corollary the council forced us to state: **the supplier channel reproduces the same failure class** unless the apply step is structurally bounded — a schema-valid answer from a defective or adversarial supplier is the same attack with a detour. The trust boundary lives in the [protocol envelope](../design/protocol-envelope.md).
2. **Nothing in the gate path may hold a model-provider credential or make a network call** (ADR-002), or "runs in every harness and in CI" breaks. Network verbs hold fetch configuration only, outside the gate path.
3. Placement of judgment: a 2026 control-plane study ([arXiv:2606.15903](https://arxiv.org/abs/2606.15903)) found pure-deterministic bookkeeping fails semantic tasks (5% on its canonicalisation benchmark) while LLM-judgment-at-mutation-time inside a deterministic pipeline won (91.7–93.2%). **Scope of this evidence, stated precisely after review**: the study supports *where judgment sits* (at the mutation point, inside deterministic machinery) and does not discriminate between an in-process model call and an out-of-band task/answer exchange. The choice between those is made on forces 1–2, not on this number.

## Options considered

- **LLM does the bookkeeping** (the LLM-Wiki premise) — rejected: force 1.
- **CLI calls a model internally** — rejected: force 2, plus supplier lock-in inside the one component that must stay neutral.
- **CLI with an optional model adapter, hard-disabled in CI** — rejected: the adapter path would exist in every install; "disabled in CI" makes the gate and the desk behave differently, and the portability property would depend on configuration rather than construction.
- **Local sidecar model, no external credential** — rejected: still couples the engine to a runtime and a model family; suppliers stop being pluggable.
- **Two-phase protocol** — accepted.

## Decision

1. Commands needing judgment run in two phases. Phase 1: `kb <verb>` emits a **self-contained task** wrapped in the protocol envelope (task id, schema version, base commit, input hashes, declared allowed-write set, untrusted-payload marking). Phase 2: `kb <verb> --verdict/--draft/--answer <file>` validates envelope and answer, applies **by rule inside the declared write set**, re-verifies the touched subset, commits atomically or rolls back. Stale tasks (changed inputs), replays, schema-version mismatches, and out-of-set writes are refused with distinct codes. The envelope spec is normative for all of this; this ADR fixes only that the protocol exists and is the sole judgment channel.
2. `kb` never invokes a model and holds no model-provider credential. **Task transport is never the CLI's job**: the harness or the human moves tasks to suppliers and answers back; the CLI never dials out to a supplier (this sentence is the decision, not commentary — see ADR-010).
3. Any schema-conforming supplier may answer — subject to the envelope's **task classes** (some classes are supplier-restricted; ADR-010) and the **proposer≠supplier disclosure**: the C6 artifact records whether the answering supplier also produced the material under judgment. Corpus stays supplier-anonymous; the audit trail does not (data-classification C6).
4. Failure semantics: no supplier → task stays open, nothing blocks; invalid answers → refused, task open, repeats recorded; supplier disagreement → queue. Task/answer artifacts are C6: committed, write-once per task id, excluded from export by the publication filter.

## Consequences

- Portability and CI-safety by construction; judgment is inspectable and — via envelope idempotency rules — safely re-appliable or refused, never silently doubled.
- Cost: a two-step UX (skills make the loop natural), and the envelope becomes a versioned compatibility surface migrated alongside the ontology (in-flight tasks are stale-rejected after a migration; re-emit).
- Separation-of-duties is disclosed rather than enforced at this gear; the disclosure field makes violations visible, and the conformance suite (write-paths §3) checks the field exists.

## Related

Evidence artifacts for the review claims in this ADR: [`../reviews/2026-08-22/`](../reviews/2026-08-22/) (this document's own review included). Figures: [`../history/evidence-2026-08.md`](../history/evidence-2026-08.md).
