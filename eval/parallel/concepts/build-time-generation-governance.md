---
title: Build-time governance of generated code
aliases:
  - Context compilation pattern
  - Declarative boundary engineering
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, ci, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    class: external-secondary
---

# Build-time governance of generated code

## Definition

**Build-time generation governance** is the practice of constraining what a coding agent is allowed to produce before it produces it: a system's structural invariants and threat vectors are declared as versioned artifacts, those artifacts are compiled into the agent's context to bias generation, and the same constraints are simultaneously expressed as deterministic static rules in the pipeline, so a declared boundary violation is rejected mechanically at merge instead of being caught by a human or a second model reading the diff.

## Explanation

The load-bearing idea is the hybrid artifact. Each boundary exists twice: as prose the agent reads, which narrows the generation space but only softly, and as a machine rule — a Semgrep, CodeQL or Bandit pattern, authored and reviewed by humans rather than emitted by a model at run time — which rejects the violation whatever the model produced. A compiler step scopes which artifacts apply to which module rather than concatenating every document into one prompt, because a window crowded with competing constraints degrades what the model attends to. When artifacts conflict, precedence is resolved deterministically before assembly, with the threat model outranking structural boundaries, boundaries outranking coding standards, and standards outranking feature intent; the conflict is then settled by a failed build rather than by a model negotiating between two Markdown files, and the human changes the design. Two gates run, not one: an adversarial check that no declared abuse path was opened, and an acceptance check against machine-executable scenarios that the declared business contract was met. Without the first a system can violate its structure, without the second it can faithfully implement the wrong thing. The essay is unusually precise about limits: static rules can bind forbidden imports, forbidden outbound I/O, layering and schema conformance, but not domain semantics, aggregate ownership or conceptual cohesion, so what the pipeline proves is compliance with what was declared, never architectural correctness. That cuts both ways, since a stale or wrong artifact is enforced just as faithfully as a right one, which makes governance files production code with owners, versioning and peer review. This is an O'Reilly Radar essay proposing a named pattern with an open-source reference implementation, and it concedes the economics only work where an architectural failure is expensive.

## Key Properties

- Every boundary exists twice — as prose that biases generation and as a machine rule that rejects at merge
- Soft enforcement shapes the prompt; hard enforcement is a static check no probabilistic model can override
- Conflicts resolve by deterministic precedence and a failed build, not by the model reconciling two documents
- Paired gates: adversarial for the declared negative space, acceptance for the declared contract
- Proves compliance with declared invariants only, and enforces a stale declaration as faithfully as a correct one

## Relationships

- [[instruction-data-boundary-collapse]] — supplies half the argument for why the gate must be deterministic — since untrusted text inside the window can steer generation, nothing reading that same context can credibly certify that a boundary survived it
- [[agent-legible-architecture]] — is its precondition in the codebase, because an invariant can only be checked statically where dependency direction and I/O are visible in the source rather than hidden behind bespoke indirection
- [[deterministic-agentic-capability-matrix]] — applies the same split one layer earlier: that procedure decides which runtime judgements a model may make, this one decides which structural choices a generating model may make, both by moving everything rule-decidable out of the model's reach
- [[agentic-artifacts-as-code]] — extends that discipline to governance files specifically, since a boundaries document that shapes every future generation is a production dependency, and the essay's context debt is what accumulates when it is versioned but never re-reviewed
- [[comprehension-gate]] — attacks the same overproduction problem from the opposite end — one slows the human at merge, the other narrows the machine before generation — and this pattern argues review of the constraints outlasts review of any single diff
- [[spec-driven-slo-generation]] — spec-driven SLO generation and build-time generation governance share a declare-once-compile-everywhere pattern applied to different artifacts — monitoring rules in one case, code-generation constraints in the other — where one declared spec becomes both a generation-time bias and a deterministic enforcement rule.
- [[structural-linting-for-agent-code]] — structural linting is a concrete technique for exactly the deterministic static-rule enforcement build-time generation governance requires — matching on construct shape is what lets a declared structural invariant be checked mechanically at merge.

## Applications

Governing agent-written code in high-blast-radius domains such as payments, underwriting and safety-critical automation; converting an architect's recurring review objection into a rule that binds every future generation rather than one pull request.

## Sources

- https://www.oreilly.com/radar/context-as-code/

## See Also

- [[instruction-data-boundary-collapse]]
- [[agent-legible-architecture]]
- [[deterministic-agentic-capability-matrix]]
- [[agentic-artifacts-as-code]]
