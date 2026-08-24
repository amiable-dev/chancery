---
title: Stacked production agent loops
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, architecture, continuous-improvement, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/an-introduction-to-loop-engineering/
    class: external-secondary
---

# Stacked production agent loops

## Definition

**Stacked agent loops** is the architecture in which a production agent runs four nested cycles rather than one: an agent loop that calls tools repeatedly until a task is complete, a verification loop that scores the result against a rubric and returns it with specific feedback when it falls short, an event-driven loop in which real events rather than a person invoke the run, and a hill-climbing loop that analyzes batches of run traces and rewrites the harness itself — a prompt, a grader, a tool description. Each outer layer changes what the inner layers do, so the stack automates progressively more of the work: first the task, then its quality, then its triggering, then its improvement.

## Explanation

The structurally interesting part is the direction of the outermost arrow. In the first three layers feedback returns to the top of the same cycle, but the hill-climbing loop's output does not re-enter its own cycle — it reaches into the inner loops and edits them, so every pass through the outer loop leaves the inner ones measurably better than they were. That is what separates automating work from automating improvement: run traces record which tools were called and what the grader said, and an analysis pass over a batch of them surfaces recurring problems that no single trace would reveal, which then become concrete harness changes. The verification layer carries an explicit cost, adding latency and tokens to every run, and is worth paying specifically where quality matters more than speed. The account comes from a vendor engineering blog generalizing from one internal documentation-writing agent, so the layering is an argued design rather than a measured comparison — but the same source is candid that most teams have invested only in the first two layers and that the less-explored value sits in the third and fourth, where an agent stops being something you invoke and becomes something embedded in your systems that improves in response to real signal.

## Key Properties

- Agent loop: model calls tools until the task is complete; automates the work itself
- Verification loop: output scored against a rubric and retried with specific feedback; adds latency and cost to every run
- Event-driven loop: webhooks, schedules or arriving messages start runs, so the agent is a standing component rather than a tool someone opens
- Hill-climbing loop: analysis over batches of traces rewrites prompts, graders and tool descriptions
- The hill-climbing arrow edits the inner loops rather than returning to its own start, which is what makes improvement compound

## Relationships

- [[event-driven-knowledge-maintenance]] — is the same third-layer idea applied to a knowledge base, with lifecycle events rather than human invocation driving ingest, compression and contradiction checks
- [[three-loops-of-agentic-development]] — cuts the same stacking along a different axis, dividing loops by who closes them and at what cadence rather than by what each one automates
- [[deterministic-agent-verification]] — is what the second layer should be built on wherever a mechanical check exists, since a model-graded rubric is the weaker fallback for what cannot be checked mechanically
- [[loop-engineering]] — is the single-loop practice this architecture stacks, and the stack is what that practice looks like once a system has been running long enough to accumulate traces

## Applications

Sequencing investment in an agent platform — get the agent and verification loops correct first, then wire event triggers, then build the trace-analysis pass that rewrites the harness — and deciding whether an existing agent is worth promoting from an invoked tool to a standing system component.

## Sources

- https://machinelearningmastery.com/an-introduction-to-loop-engineering/

## See Also

- [[event-driven-knowledge-maintenance]]
- [[three-loops-of-agentic-development]]
- [[deterministic-agent-verification]]
- [[loop-engineering]]
