---
title: Agent-legible architecture
aliases:
  - Tailor-made architecture
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, architecture, agents, software-design, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.oreilly.com/radar/context-as-code/
    class: external-secondary
---

# Agent-legible architecture

## Definition

**Agent-legible architecture** is the design stance that once code generation is cheap, a codebase should be optimised for traceable causality rather than for minimal typing — thin infrastructure, explicit domain logic, narrowly scoped components with visible contracts — on the grounds that a model cannot safely reason about behaviour it cannot follow in the source, so the property to protect is not brevity but the visibility of what changes state and what enforces invariants.

## Explanation

Abstraction by accumulation was a rational trade while developer time was the scarce resource: pulling in a large dependency to avoid boilerplate spent the cheap input to save the expensive one. Machine generation inverts that arithmetic, because procedural code trends toward free and clarity becomes the constrained good. The distinction that does the work is abstraction versus opacity. Mature, widely learned primitives stay valuable precisely because their conventions are predictable and well represented in what models have seen; what defeats an agent is proprietary decorators, internal frameworks and bespoke orchestration that hide the causal chain, turning execution into a black box. Hidden flow degrades reasoning into guesswork, and guesswork becomes architectural drift that survives review because the tests still pass — feature tests assert behaviour, not bounded contexts. The same opacity disables both forms of verification available afterwards. A model asked to review code it generated from the same vague ticket will politely revalidate its own blind spots, and a static rule can only bind a dependency path it can see, so anything routed through indirection is unenforceable by construction. The design question shifts from how much can be abstracted away to how much must remain explicit for safe reasoning. This is an argued position in an essay rather than a measured result, and it should be read as a trade-off proposal whose costs — more visible boilerplate, less reuse — are real and acknowledged.

## Key Properties

- The trade that justified accumulating abstraction inverts once generated procedural code is nearly free
- The target is opacity, not abstraction: predictable widely-learned primitives remain safe, bespoke indirection does not
- Hidden control flow produces drift that passes tests, because feature tests assert behaviour and not boundaries
- Opacity also disables static enforcement, since a rule can only bind what is visible in the source
- Argued as a design trade-off, not demonstrated by measurement

## Relationships

- [[build-time-generation-governance]] — depends on it, because the deterministic checks that pattern relies on can only see explicit imports, layering and I/O — legibility is what makes an invariant mechanically enforceable
- [[context-engineering]] — makes the same scarcity argument about the codebase that context engineering makes about the window: what the model can see cheaply and unambiguously sets the ceiling on what it can do reliably

## Applications

Deciding whether to introduce an internal framework or keep domain logic explicit in a repository that agents will edit; auditing an existing codebase for the hidden indirection that makes agent changes unreviewable.

## Sources

- https://www.oreilly.com/radar/context-as-code/

## See Also

- [[build-time-generation-governance]]
- [[context-engineering]]
