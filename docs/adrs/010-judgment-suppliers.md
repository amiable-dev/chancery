---
title: "ADR-010: Judgment suppliers are pluggable; llm-council structures disagreement and never adjudicates truth"
status: accepted
date: 2026-08-22
tags: [adr, judgment, llm-council, anti-coupling]
links: ["001-two-phase-judgment-protocol.md", "008-interfaces-and-runtime.md", "009-validation-protocol.md", "../design/protocol-envelope.md", "../architecture/write-paths.md"]
council_review: "2026-08-22 packet 3 (APPROVE-WITH-CHANGES) — rework incorporated; dispositions in ../reviews/2026-08-22/dispositions.md"
---

## Context

The owner also maintains llm-council (multi-model deliberation; library + MCP + HTTP). A conservative policy assumption, adopted with a review trigger rather than treated as established fact: correlated training data caps a panel's effective independence at roughly two votes regardless of size, and frontier-model mistakes increasingly correlate — so **multi-model agreement validates the judgment process, multi-source corroboration validates the world; they are orthogonal**. Contested claims are precisely where polluted-consensus risk peaks, disqualifying panels from adjudicating them. An adversarial review then showed the first draft of this ADR violating its own thesis three ways (false provenance stamping, a panel-judge clause that dissolved the refused role, council-aware text inside the neutral CLI) — all corrected below.

## Decision

1. **The supplier interface is the envelope** (ADR-001; [protocol-envelope](../design/protocol-envelope.md)) — schema validity is necessary, never sufficient: task-digest binding, replay refusal, stale rejection, and write-set checks are what make "any schema-conforming answerer" safe to say. Suppliers are {single agent, council, human}. **Decision provenance** on every applied judgment is `human` / `model` / `mechanical` (envelope-owned vocabulary — a human answer is never stamped `model-inference`; that token belongs to ADR-009's *source* classes). The **corpus** stays supplier-anonymous; the **C6 record** carries full supplier identity, class, and version — which is exactly what makes supplier restrictions enforceable and a later-discovered-defective supplier's decisions enumerable for re-run.
2. **Task classes restrict suppliers** (envelope-enforced): the *evidence-verdict* class (ADR-009's support verdicts, source reliability, lineage independence, tier assignment) **excludes panels** — this closes the loophole where "panel judge for ordinal rubric dimensions" quietly re-admitted truth adjudication. Panels may judge only allowlisted non-evidential dimensions: rubric ordinals under ADR-004 (clarity, completeness, scope-fit), style, and structure.
3. **llm-council's sanctioned roles**, written against R1a's actual states (contested-tier machinery is R1b-gated and marked as such): (a) **disagreement structurer** for `UNCERTAIN`/`CONTRADICTED` items — with an output contract: faithful quotation, source linkage on every position, supplied-evidence separated from model conjecture, minority positions preserved verbatim; (b) **panel judge** within Decision 2's allowlist; (c) **router**, with the asymmetry explicit: **dissent may add required work; agreement may never reduce it, nor upgrade any tier.**
4. **Anti-coupling is structural, not cosmetic**: the coupling surface is the task schema, not the verb table — so `kb`'s task emissions are supplier-neutral, and the effective-votes framing lives in a **council-side adapter**, never in CLI-emitted text. **Transport is part of the Decision: the harness or the human moves tasks and answers; the CLI never dials out to any supplier** — no HTTP call to council from `kb`, ever. The council-free path (queue + human) is the tested base case. The constraint is "no supplier-specific core semantics", which supersession of this ADR could revisit — "ever" is not the claim.
5. **Self-contamination rule** for the symmetric integration (llm-council reading this KB via the facade, colocated per ADR-008): council-visible evidence **flags `internal-synthesis` and `model-inference` sources**, which invariant 7 already bars from corroboration — a panel must not ingest its own prior records as independent evidence.
6. **Degradation has a default and a decider**: without the council, contested items **wait for a human**; a single-model structuring pass (which has *no* family diversity, not "less") is an explicit human opt-in, recorded in C6 like any other supplied judgment.

## Consequences

- Pluggability with accountability: anonymous corpus, attributable audit trail, restrictable task classes.
- Two optional integrations between independently useful tools, never a mutual dependency; the residual coupling is attention-level (one maintainer, two tools) — bounded, recorded as a standing risk, not removable by architecture.
