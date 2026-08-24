---
title: Partitioned-edit consistency debt
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, software-maintenance, correctness, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/
    class: external-primary
---

# Partitioned-edit consistency debt

## Definition

**Partitioned-edit consistency debt** is the residue produced when one global change is executed as many independent local edits: each unit is corrected correctly in isolation and every local check passes, but the invariants that span units — type signatures, call contracts, shared schemas, naming conventions — are owned by no worker, so the aggregate change lands locally valid and globally inconsistent.

## Explanation

The debt is structural rather than a defect in any worker. Partitioning is what makes parallel agent work cheap — each worker sees one unit and nothing else — and that same narrowness is what makes cross-unit invariants invisible. The reported instance is unusually clean: a per-file sweep that replaced loose types with specific ones achieved a hundred per cent fix rate on the lint backlog it was given, and produced sixty-one downstream type errors in files it never touched, because a signature tightened in one file is a contract broken in its callers. The general shape is that any property whose truth depends on two units at once falls outside every worker's field of view, so a green per-unit result is not evidence of a green whole. Three mitigations follow directly, and each costs some of the parallelism the partition bought: run a global check after the fan-out and treat its output as a second backlog; partition along the invariant instead of along the file, grouping units that share a contract into one task; or reserve for a coordinating pass the classes of edit known to cross boundaries, letting workers handle only the local ones. The trap for the unwary is the metric — a completion rate measured per unit will look perfect at exactly the moment the debt is largest.

## Key Properties

- The debt arises from the partition itself, not from any worker doing its job badly
- Only invariants spanning two or more units are affected; purely local corrections are unharmed
- Per-unit success metrics stay green while the aggregate is broken, so the failure is silent at the dashboard
- Detection needs a global check run after the fan-out, not during it
- Every mitigation — global re-check, partitioning by invariant, or a coordinating pass — trades back some parallelism

## Relationships

- [[stateless-worker-fanout]] — is the price of that shape's scaling, since shared-nothing workers are by construction blind to anything that spans their units
- [[retry-escalation-ladder]] — partly answers it, because the exploration rung's licence to read neighbouring files is what lets a worker see a contract it would otherwise break

## Applications

Planning any automated codebase-wide refactor — budget a global type or contract check after the parallel pass, and decide up front which edit classes are too cross-cutting to hand to per-file workers.

## Sources

- https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/

## See Also

- [[stateless-worker-fanout]]
- [[retry-escalation-ladder]]
