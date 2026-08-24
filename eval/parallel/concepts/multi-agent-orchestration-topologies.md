---
title: Multi-agent orchestration topologies
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, agents, architecture, multi-agent, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/
    class: external-secondary
---

# Multi-agent orchestration topologies

## Definition

**Multi-agent orchestration topologies** are the small recurring set of shapes in which several agents are wired together — a sequential pipeline, a concurrent fan-out with result synthesis, a supervisor that plans centrally and dispatches to workers, a hierarchy of supervisors when workers outnumber one coordinator's span, and runtime handoff when the right agent is not known in advance. Each is selected by the dependency structure of the task rather than by taste, and each pays a coordination cost in tokens and latency that a single agent does not.

## Explanation

The selection rule is mechanical once the dependencies are known. Hard ordering with quality gates between stages gives a sequential pipeline; independent subtasks where latency is the binding constraint give concurrent execution plus an explicit synthesis step; work that must be planned before it is dispatched and re-planned after each result gives a supervisor; a worker count beyond one supervisor's effective span gives a hierarchy, where team-level supervisors report to a top coordinator; an unknown best-agent-for-the-job gives handoff. The cost side is what actually decides the architecture: multi-agent coordination is reported to consume up to roughly fifteen times the tokens of a single agent on comparable work, so a richer topology has to buy a capability the cheaper shape cannot deliver. Looped shapes fail differently — they need explicit termination conditions such as quality thresholds, iteration caps or early-stop signals, or they do not stop. Human oversight is an orthogonal axis layered over any topology, conventionally graded as in-the-loop (direct intervention at decision points), on-the-loop (meaningful control during execution), above-the-loop (strategic governance) and behind-the-loop (post-hoc analysis). The source is a practitioner catalog assembled from vendor pattern libraries, and the accuracy figures it quotes for hierarchical frameworks are secondhand from individual papers: the ordering of shapes is sound, the numbers are illustrative.

## Key Properties

- Topology follows dependency structure: ordering gives sequential, independence gives concurrent, planning gives supervisor
- Hierarchy exists to bound a supervisor's span of control, not to add capability
- Multi-agent coordination is reported to cost up to roughly 15x the tokens of a single agent
- Looped topologies require explicit termination conditions or they do not terminate
- Human oversight is a separate axis — in-the-loop, on-the-loop, above-the-loop, behind-the-loop — layered over any shape

## Relationships

- [[react-pattern]] — is the single-agent loop these topologies compose, since each worker under a supervisor or hierarchy typically runs a reason-act-observe loop internally
- [[rl-learned-orchestration]] — replaces the hand-selection this catalog describes by training a coordinator to discover the communication topology end-to-end from task reward
- [[deterministic-agentic-capability-matrix]] — supplies the classified agentic steps that these topologies then coordinate

## Applications

Choosing a coordination shape for a new multi-agent system from its task dependency graph rather than from a framework's defaults; diagnosing an over-engineered system whose supervisor and workers cost fifteen times a single agent's tokens for work that had no branching to coordinate.

## Sources

- https://www.infoq.com/articles/prompts-to-production-playbook-for-agentic-development/

## See Also

- [[react-pattern]]
- [[rl-learned-orchestration]]
- [[deterministic-agentic-capability-matrix]]
