---
title: Layered agent memory
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: practitioner
tags: [concept, ai-agents, memory, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/
    hash: sha256:98569296763f146a6a01b895405a16ace647694b25d45fc669dcf276959a559b
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Layered agent memory

## Definition

**Layered agent memory** is the design of an agent's recall as three distinct tiers with different lifetimes and purposes rather than as a single conversation transcript: short-term session memory holding the current task state and recent tool outputs, long-term memory — typically a vector store — holding cross-session context and learned patterns, and structured logs kept for auditability and debugging. The failure it exists to prevent is designing an agent the way one designs a chatbot, passing the conversation in and taking a response out, which makes context-window overflow a production incident rather than a design parameter.

## Explanation

The mechanism is that a multi-step agent needs three different things from its past and they have incompatible retention rules. It needs to know what it just did — which tool it called two steps ago, whether that call succeeded, what intermediate results it is carrying — and that is high-detail, short-lived, and must stay in context. It needs to know things learned in earlier sessions, which is lower-volume, long-lived, and should be retrieved on demand rather than resident. And it needs a durable record for people to inspect after the fact, which must survive whatever the agent chooses to forget and is not consumed by the model at all. Collapsing these into one transcript forces the same retention policy on all three, which is why the single-transcript design fails the moment tasks get long: the detail that belongs in tier one crowds out the room needed for work, while the durable record that belongs in tier three vanishes with the session. The practical warning attached to this design is about timing rather than shape — retrofitting a memory architecture onto a deployed agent is genuinely painful and usually amounts to a partial rebuild, because tier boundaries determine what the agent was ever able to record. The source is a practitioner listicle citing vendor guidance on agent memory, so the tiering is presented as accumulated design experience rather than a measured comparison.

## Key Properties

- Session memory: current task state and recent tool outputs, high detail, short lifetime, resident in context
- Long-term memory: cross-session context and learned patterns, typically a vector store, retrieved on demand
- Structured logs: durable record for audit and debugging, never consumed by the model
- A single transcript forces one retention policy on three needs with incompatible lifetimes
- Retrofitting the tiers onto a deployed agent usually means a partial rebuild, so the design decision is front-loaded

## Relationships

- [[context-engineering]] — governs the first tier specifically, deciding which of the session's accumulated detail earns space in the window at each turn
- [[agent-harness]] — owns all three tiers, since what is loaded, what survives compaction and what is written durably are harness decisions rather than model behaviour
- [[agent-loop-telemetry]] — is the third tier put to work, turning the durable log from a compliance artifact into an inspectable account of how a run produced its result
- [[agent-context-drift]] — layered agent memory's short-term session tier is exactly the store that accumulates the verbatim tool outputs context drift describes going stale — the layering itself supplies no expiry, so drift is the risk that lives inside that tier.

## Applications

Specifying an agent's memory tiers before the first long-running task ships, and diagnosing an agent that repeats work or loses cross-session knowledge by identifying which tier was never built.

## Sources

- https://machinelearningmastery.com/building-ai-agents-here-are-some-anti-patterns-to-avoid/

## See Also

- [[context-engineering]]
- [[agent-harness]]
- [[agent-loop-telemetry]]
