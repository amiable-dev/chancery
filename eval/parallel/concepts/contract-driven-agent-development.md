---
title: Contract-driven agent development
aliases:
  - Agentic-Agile development
  - Spec-first agent delivery
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: vendor-doc
tags: [concept, agents, software-process, specification, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts/
    hash: sha256:48cbeb1d2cba082fd5540d215f39ae992c00da84156ad65c22a798933b87a9e0
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Contract-driven agent development

## Definition

**Contract-driven agent development** is the practice of running a mixed human-and-agent software team on Agile engineering discipline instead of on prompting: every capability becomes a tracked issue whose acceptance criteria form the contract, agents execute against that written contract rather than an open-ended chat prompt, the exit condition is contract satisfied rather than good enough, delivery happens in reviewed increments, and quality gates are backlog items from the first story rather than instrumentation retrofitted at the end.

## Explanation

Prompting works for bounded tasks and degrades predictably as scope grows, and the degradation has a shape: no backlog, so work is discovered during implementation rather than planned; no definition of done, so a session ends when the human feels satisfied; no phased delivery, so everything is attempted at once; no governance, so safety constraints arrive after the fact. The load-bearing claim is the diagnosis — these are process failures, not model failures, and a more capable model working against an ambiguous specification produces more sophisticated drift rather than less. The remedy is to move the specification out of the conversation and into the issue tracker, where it is versioned, addressable, and frozen for the duration of the story. That placement solves a concrete failure the author reports hitting: when specifications live in design documents the agents themselves maintain, agents edit them, the edits conflict with the originals, and a swarm of agents then reads contradictory instructions. Locking the issue and opening new issues for expanded requirements, rather than rewriting the one under execution, keeps that from happening; the closed issues and pull-request threads then become the durable record of what was built and why, which is the context a later session needs and a chat transcript cannot provide. Repository documentation aimed at both audiences carries the conventions that would otherwise be re-explained every session. Governance is treated as a property of the backlog rather than a phase: safety constraints appear as acceptance criteria on stories, review gates sit between delivery increments, and CI, linting and automated tests are the first story implemented — the author's counter-example being a project where the pipeline came late, quality problems accumulated across increments, and features had to be reopened and redeveloped because they rested on assumptions no gate had ever checked. The stated tell is diagnostic: if architectural violations surface at final review rather than during story execution, governance sits too late in the process. The source is a vendor developer-blog post, the first of a planned series, drawing on one author's project and a companion template repository — an experience report and an argument, not a measured comparison; the strongest evidence it offers is portability, that the patterns carried into unrelated projects without reference to the original.

## Key Properties

- Diagnosis: coordination breakdown is a process failure, and a stronger model against an ambiguous spec drifts more elaborately rather than less
- The issue holds the specification, not the prompt; acceptance criteria are the contract and contract satisfied replaces good enough as the exit condition
- Specs are locked during delivery — new requirements open new issues instead of editing the one being executed, so parallel agents cannot read contradictions
- Validation infrastructure is the first story rather than the last, and safety constraints ride as acceptance criteria on ordinary stories
- Closed issues, PR threads and agent-run retrospectives over commits and session logs become the durable memory the next session grounds on

## Relationships

- [[wave-based-parallel-agent-execution]] — supplies the per-story contract that scheduling discipline consumes — a wave can only dispatch independent stories safely once each one's boundaries, invariants and exit condition are written down
- [[three-loops-of-agentic-development]] — hardens that framework's middle loop by making the human's correction a written change to acceptance criteria rather than conversational re-steering, so the loop's exit test survives the end of the session

## Applications

Restructuring a team that has hit the ceiling of prompt-driven development — converting ambiguous capability requests into issues with testable acceptance criteria before any agent runs; sequencing a new agentic project so CI and review gates land as the first story; auditing an in-flight project by asking whether architectural violations are being caught at story execution or only at final review.

## Sources

- https://developer.microsoft.com/blog/agentic-agile-why-agent-development-needs-agile-not-just-prompts/

## See Also

- [[wave-based-parallel-agent-execution]]
- [[three-loops-of-agentic-development]]
