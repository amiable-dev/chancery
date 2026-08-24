---
title: Six-part agentic AI architecture taxonomy
date: 2026-08-24
tags:
  - concept
  - agents
  - architecture
  - taxonomy
  - llm
status: draft
sources:
  - url: https://arxiv.org/html/2601.12560v1
---

# Six-part agentic AI architecture taxonomy

## Definition

A unified taxonomy for describing an agentic AI system by decomposing it into six architectural concerns — Perception (taking in state from the environment), Brain (the LLM-based reasoning core), Planning (decomposing a goal into a sequence of actions), Action (executing a step and observing its effect), Tool Use (invoking external capabilities, increasingly through standardised protocols rather than one-off API integrations), and Collaboration (coordinating with other agents or humans) — giving a common vocabulary for comparing systems ranging from a single reasoning loop to hierarchical multi-agent deployments.

## Explanation

The value of the taxonomy is comparative: two systems built with completely different terminology and code structure can be placed on the same six axes and compared concern by concern, which a vaguer description like 'an agent loop' cannot do. The taxonomy also tracks two real architectural shifts rather than asserting a market trend. On the Brain and Planning axes, systems are moving from linear, hand-coded reasoning procedures toward native inference-time reasoning models with a configurable reasoning budget, which changes how a planner or controller is built around the model rather than around a fixed prompt template. On the Tool Use axis, systems are moving from bespoke, fixed API integrations written per tool toward open standards — the Model Context Protocol and native computer-use interfaces — that let an agent discover and call capabilities it was not specifically coded against. The Collaboration axis is the one that scales the taxonomy from a single agent to a fleet: the same six concerns still apply to each agent in a hierarchical multi-agent system, with Collaboration added as the concern that governs how their individual Plans and Actions are coordinated. Because this decomposition is drawn from a systematic review of published agent architectures and cites the specific systems that motivate each axis, it is evidence for how the field's designs actually vary, not one firm's assertion that the market is converging — though it remains one research group's proposed categorisation in a fast-moving field, and a competing taxonomy could displace it as the field's designs continue to shift.

## Key Properties

- Six concerns treated as separable design axes: Perception, Brain, Planning, Action, Tool Use, Collaboration
- The Tool Use axis tracks a real shift from one-off fixed API integrations toward standardised protocols such as MCP and native computer use
- The Collaboration axis extends the same six-part vocabulary from a single reasoning loop up through hierarchical multi-agent systems
- Derived from a systematic review of published agent systems rather than asserted from market observation

## Relationships

- [[react-pattern]] — is one concrete, widely-used instantiation of this taxonomy's Brain, Planning and Action axes as a single interleaved perceive-reason-act loop
- [[workflows-versus-agents]] — cuts across this taxonomy's Planning axis specifically — a workflow fixes the plan in code ahead of time, while an agent exercises Planning at runtime inside the Brain concern
- [[multi-agent-orchestration-topologies]] — is a concrete design space for this taxonomy's Collaboration axis once more than one agent is coordinating on the same goal

## Applications

Use the six concerns as a design or audit checklist when building or evaluating an agent platform: naming which component owns perception, reasoning, planning, action execution, tool invocation and (where relevant) multi-agent collaboration surfaces gaps that an undifferentiated 'agent loop' description would hide, and gives two teams using different terminology a common vocabulary to compare their systems concern by concern.

## Sources

- https://arxiv.org/html/2601.12560v1

## See Also

- [[react-pattern]]
- [[workflows-versus-agents]]
- [[multi-agent-orchestration-topologies]]
