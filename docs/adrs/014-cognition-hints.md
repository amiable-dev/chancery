---
title: "ADR-014: Cognition hints — advisory supplier-tier steering, never enforcement"
status: accepted (owner-authorized 2026-08-26; council review folded into packet 9)
date: 2026-08-26
tags: [adr, suppliers, envelope, economics]
links: ["010-judgment-suppliers.md", "013-graft-informed-adoptions.md"]
council_review: "scheduled — packet 9, alongside the D1 report"
---

## Context

Generating the reference corpus burned ~405M cache-read tokens against ~1.9M of actual writing before a mid-run pause and supplier switch. The post-mortem found two compounding mistakes, neither of which the tool warned against: **every stage ran on the strongest model**, including work with no judgment in it, and **long-lived agents re-read their own growing transcripts**, so cost scaled with conversation length rather than with work. The counter-evidence from the same project: 184 card decks on mid-tier short-lived workers cost ~2.2M total; a 129-item mechanical queue reconciliation on the smallest tier cost 38.5K. Any adopter pointing a default-flagship harness at `kb` will replay the disaster unless the tool says something — at the moment and place the harness listens.

## Decision

Steer by **cognition class, never model name, and never as a gate**:

1. **Envelope emissions carry an advisory `cognition` field**, derived from the existing `task_class` taxonomy — which already is the tier map:
   - `classification`, `structuring` → `mechanical`: "rule-shaped; any competent supplier; batch in short-lived workers."
   - `drafting` → `composition`: "prose persists in canon; mid-tier suffices with the style exemplars provided."
   - `rubric-ordinal`, `evidence-verdict` → `judgment`: "this answer becomes canon; use the strongest judgment you can afford."
   The field is informative only: `check()` never reads it, no supplier is refused over it, and a human supplier — for whom "tier" is meaningless — ignores it without consequence (ADR-010's supplier-agnosticism is untouched).
2. **The generated adapters and AGENTS.md gain a supplier-economics paragraph** — the orchestration lesson, which mattered more than tier choice: tasks are self-contained by design, so run them in *short-lived workers*, one or few tasks each; a single long-lived agent looping over many items pays for its own transcript on every turn.
3. **docs/operations.md gains a "Supplier economics" section** citing the real numbers above; docs may name current model tiers *as examples* — the engine never does.

## Rejected

- **Model names or price tables in the engine** — they rot, and they would couple a supplier-agnostic protocol to one vendor's catalogue.
- **Enforcement** (refusing a task class to a "too-small" supplier) — quality is already policed where it belongs: by the gate's validation of the *answer*, not the answerer's badge.

## Consequences

The hint travels inside the artifact a harness reads at dispatch time, so the steering costs nothing and cannot be missed; the economics lesson lives in the operating card every generated skill carries. If packet 9 amends the grades or wording, the field is additive and advisory, so amendment is cheap by construction.
