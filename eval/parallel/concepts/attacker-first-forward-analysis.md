---
title: Attacker-first forward analysis
aliases:
  - Forward taint analysis
  - Entry-point-first analysis
date: 2026-08-24
domain: security
maturity: emerging
source_type: vendor-doc
tags: [concept, security, static-analysis, agents, domain/security, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://github.com/capitalone/VulnHunter
    class: external-primary
---

# Attacker-first forward analysis

## Definition

**Attacker-first forward analysis** reverses the direction of vulnerability search in source code: rather than starting at dangerous sinks and reasoning backwards to a hypothetical attacker who might reach them, it starts at the surfaces an attacker demonstrably controls — public API parameters, network messages, uploaded files — and reasons forwards through the code to establish whether any of them actually arrives at a dangerous operation with attacker-controlled data intact.

## Explanation

Direction determines where the expensive proof falls, and that is what shapes the false-positive profile. A sink-first search enumerates syntactic patterns — a concatenated query, a deserialization call, a shell invocation — each of which is only a hypothesis until someone shows that attacker data reaches it. Discharging that hypothesis means proving a negative about reachability across the whole program, which is costly, so tools tend to emit the unproven hypothesis as a finding and hand the proof obligation to the analyst; the resulting queue is dominated by patterns that are real but unreachable. Forward search starts from something known instead: this endpoint is exposed, this parameter is attacker-supplied. Every path it walks is anchored to a capability the attacker actually has, so the terminal question is whether the path reaches something dangerous — an existence claim, cheap to settle affirmatively — rather than whether no path exists, a universal claim that is expensive to settle at all. The trade is symmetric and worth stating plainly: forward search inherits the quality of its entry-point enumeration, so it misses sinks reached only through paths nobody enumerated — an internal caller, a second-order flow through stored data, a background job consuming a queue. The source is the README of an open-source tool released by a bank's security team and tuned for one frontier model in one coding harness; it ships a benchmarking harness against public known-vulnerable corpora, which makes its detection claims reproducible in principle, but the README itself reports no false-positive measurements.

## Key Properties

- Search direction reverses: entry points forward to sinks, not sinks backward to hypothetical sources
- Every explored path is anchored to a capability the attacker demonstrably has, not to a syntactic pattern
- Sink-first tooling ships unproven reachability hypotheses as findings, which is the origin of its noise
- Forward search settles an existence claim; backward search must settle a universal one
- The blind spot moves rather than disappearing — forward analysis misses whatever entry-point enumeration missed

## Relationships

- [[self-falsification-filter]] — is the stage normally paired after this one — forward search narrows the candidate set at its source, falsification prunes what still survives, and neither alone gets a report down to what a human will read

## Applications

Structuring a manual or agent-driven code security review by enumerating attacker-reachable entry points first and following data forward from them; explaining why a static-analysis backlog is dominated by unreachable findings; choosing between the two directions based on how completely a system's entry points are actually known.

## Sources

- https://github.com/capitalone/VulnHunter

## See Also

- [[self-falsification-filter]]
