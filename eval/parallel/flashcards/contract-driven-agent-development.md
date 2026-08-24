---
tags: [flashcards, agents, software-process, specification, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Contract-driven agent development — Flashcards

#flashcards/agents

## Definition <!-- kb:card:cbccce -->
What is contract-driven agent development?
?
Running a mixed human-and-agent software team on Agile engineering discipline instead of on prompting: every capability becomes a tracked issue whose acceptance criteria form the contract, agents execute against that written contract rather than an open-ended chat prompt, the exit condition is "contract satisfied" rather than "good enough," and quality gates are backlog items from the first story.

## Key diagnosis: process failure, not model failure <!-- kb:card:78cac7 -->
Is coordination breakdown in agentic teams a model failure or a process failure, and what follows from that diagnosis?
?
A process failure. A more capable model working against an ambiguous specification produces more sophisticated drift, not less — so the fix is moving the specification out of the conversation and into the issue tracker, not upgrading the model.

## Locked specs during delivery <!-- kb:card:76c6e3 -->
Why are specifications locked during story execution, and what happens to expanded requirements instead of editing the locked issue?
?
Because when specs live in design documents agents themselves maintain, agents edit them and the edits conflict with the originals, so a swarm of agents ends up reading contradictory instructions. Locking the issue and opening new issues for expanded requirements — rather than rewriting the one under execution — prevents that.

## Validation infrastructure comes first <!-- kb:card:3d8005 -->
When should CI, linting, and automated tests be implemented in a contract-driven agentic project, and what goes wrong if they aren't?
?
As the first story implemented, not retrofitted later. The counter-example is a project where the pipeline came late: quality problems accumulated across increments, and features had to be reopened and redeveloped because no gate had ever checked the assumptions they rested on.

## Durable memory across sessions <!-- kb:card:93b80d -->
What serves as the durable memory a later agent session grounds on, in contract-driven agent development?
?
Closed issues and pull-request threads — the record of what was built and why — rather than chat transcripts, which cannot provide that context.
