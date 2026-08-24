---
tags: [flashcards, agents, testing, architecture, domain/software-engineering, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Layered testing of agentic systems — Flashcards

#flashcards/agents

## Definition: three testing layers <!-- kb:card:9ed9be -->
What are the three architectural layers that layered testing of agentic systems scopes each test to?
?
A deterministic system shell (APIs, integrations, tool implementations), an orchestration layer that assembles the runtime prompt (deterministic given its inputs), and a black-box inference core reachable only through prompt and state.

## Why layering works: most of the app is deterministic <!-- kb:card:20daec -->
What insight does the layering exploit to make testing a nondeterministic agentic system tractable?
?
Most of an agentic application is not actually nondeterministic — splitting the stack localizes the nondeterminism to one layer, the inference core, and lets conventional testing keep working everywhere else.

## Orchestration bugs are never model faults <!-- kb:card:5fa08b -->
Why can a wrong prompt (unresolved placeholder, stale state, truncated history) be caught deterministically and never blamed on the model?
?
Because prompt construction is a pure function of template, state, and user input at the orchestration layer, so a wrong prompt is a deterministic bug in that function, not a model failure.

## Inference core: relational, not exact assertions <!-- kb:card:5e7c0e -->
What kinds of assertions replace exact-value checks at the black-box inference core?
?
Metamorphic tests (a defined input change should produce a defined output change), property tests (invariants across generated inputs), and behavioural harnesses (mock APIs and injected failures observing task-completion order and tool-selection consistency).

## Adversarial checks are resilience, not correctness <!-- kb:card:f1b996 -->
How are adversarial suites — prompt-injection resistance, tool-failure handling — scoped within this framework?
?
As resilience testing, not correctness testing — they probe whether the system degrades safely under attack or failure, not whether its output is the 'right' one.
