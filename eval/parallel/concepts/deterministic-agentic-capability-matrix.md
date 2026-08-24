---
title: Deterministic/agentic capability matrix
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, system-design, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    class: external-primary
---

# Deterministic/agentic capability matrix

## Definition

A **capability matrix** is a design procedure that decomposes every step of a workflow into the part a fixed rule can decide and the part that requires model reasoning, on a single test: whether the decision admits alternative valid interpretations. Anything derivable from current application state — an identifier, an SLA timer, a queue assignment, a template placeholder, a delivery channel — is coded deterministically; only judgements over unstructured or ambiguous content are routed through a language model. The consequence is that a well-designed agentic application is deliberately mostly non-agentic.

## Explanation

The procedure runs per workflow: enumerate the steps, and for each write two columns — what a rule computes from present state, and what needs interpretation of content whose meaning is not fixed. In a support workflow, ticket-ID generation, channel detection, customer lookup and SLA initialisation sit in the first column while intent extraction, priority inference from urgency signals in free text, relevance judgement over retrieved solutions and response tone sit in the second. Three properties fall out of the split rather than being designed in. Cost: model calls are the expensive and slow part of the stack, so confining them to genuine judgement is a cost control that needs no separate optimisation pass. Reliability: a step with exactly one correct interpretation fails outright if the model varies, which is the argument that such steps must never be agentic, not merely that they need not be. Latency: tracing an agentic workflow makes visible that model calls dominate wall-clock time. The framing exists to counter the widespread anti-pattern of making everything agentic. The source is a practitioner playbook article rather than a study — the matrix is illustrated on one worked customer-support workflow, so it should be read as a design discipline whose value is the forced enumeration, not as a measured result.

## Key Properties

- Test for agentic-ness: does the decision admit alternative valid interpretations
- Anything computable from current application state is coded as a fixed rule
- Confining model calls to genuine judgement is simultaneously a cost and a reliability control
- Output per workflow is a deterministic container, a step-by-step mapping, and a classification of each step
- Even good agentic candidates remain majority-deterministic in production

## Relationships

- [[react-pattern]] — supplies the loop shape for the steps this matrix classifies as agentic, once a step has been ruled to need reasoning rather than a fixed rule
- [[multi-agent-orchestration-topologies]] — answers the question this matrix raises next — once steps are classified as agentic, how the agents covering them get coordinated
- [[agentic-test-layer-scoping]] — exploits at test time the same boundary this matrix draws at design time, since the deterministic majority stays conventionally testable

## Applications

Scoping an agentic rewrite of an existing workflow — support triage, claims handling, order fulfilment — by tabulating each step's deterministic and reasoning halves before any code is written. Auditing a deployed agent for model calls that a rule could have made faster, cheaper and more reliably.

## Sources

- https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/

## See Also

- [[react-pattern]]
- [[multi-agent-orchestration-topologies]]
- [[agentic-test-layer-scoping]]
