---
tags: [flashcards, architecture, agents, software-design, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent-legible architecture — Flashcards

#flashcards/architecture

## Definition of agent-legible architecture <!-- kb:card:b434c5 -->
What is agent-legible architecture?
?
A design stance that once code generation is cheap, a codebase should optimize for traceable causality rather than minimal typing — thin infrastructure, explicit domain logic, narrowly scoped components with visible contracts.

## Why the abstraction trade-off inverts <!-- kb:card:dc9af9 -->
Why does machine code generation invert the old case for accumulating abstraction?
?
Pulling in dependencies to avoid boilerplate used to spend cheap developer time to save expensive typing; once generated code is nearly free, clarity becomes the scarce resource instead.

## Abstraction versus opacity <!-- kb:card:160606 -->
What distinction determines whether an abstraction is safe for an agent to work around?
?
Abstraction versus opacity: mature, widely learned primitives stay safe because their conventions are predictable to the model, while proprietary decorators and bespoke orchestration hide the causal chain and defeat it.

## Hidden flow evades test-based review <!-- kb:card:f26d4e -->
Why can hidden control flow produce architectural drift that survives code review?
?
Feature tests assert behavior, not bounded contexts, so drift caused by opaque indirection still passes the tests even as it erodes the intended architecture.

## Opacity defeats both verification methods <!-- kb:card:2e9004 -->
Why does opacity disable both self-review by a model and static enforcement rules?
?
A model reviewing its own output from the same vague ticket just revalidates its own blind spots, and a static rule can only bind a dependency path it can see — indirection is unenforceable by construction.

## Relation to context-engineering <!-- kb:card:08ac41 -->
What scarcity argument does agent-legible architecture share with context-engineering?
?
Both argue what the model can see cheaply and unambiguously sets the ceiling on what it can do reliably — context-engineering makes the case about the context window, agent-legible architecture makes it about the codebase.
