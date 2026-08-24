---
tags: [flashcards, ai-agents, protocols, interoperability, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Opaque agent interoperability — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:a3cbd4 -->
What is opaque agent interoperability, and what is its reference protocol?
?
The design stance that agents from different parties or frameworks collaborate as peers — discovering capabilities, negotiating, working jointly on long tasks — while each keeps its internal state, memory, reasoning and tool implementations fully private. Its reference instantiation is the Agent2Agent (A2A) protocol.

## What crosses the boundary <!-- kb:card:6f3091 -->
What crosses the boundary between opaque agent peers, and what stays hidden?
?
Only task intent, negotiated modalities, and results cross. Internal state, memory, reasoning, and tool implementations stay private on each side.

## Discovery via Agent Card <!-- kb:card:6d5285 -->
How does an A2A agent advertise its capabilities for discovery?
?
Via an Agent Card — a published descriptor of what the agent can do and how to reach it — so capability lookup is a lookup, not a bespoke integration.

## Three interaction shapes <!-- kb:card:e7b036 -->
Why does A2A support three interaction shapes (synchronous, SSE streaming, async push) instead of just request/response?
?
Peer-to-peer agent work is often long-running and can't be held open in a single request, so streaming and asynchronous push notification are needed alongside synchronous request/response.

## Opacity's real cost <!-- kb:card:1bbc3e -->
Is opacity in A2A an enforced guarantee, and what does it cost?
?
No — opacity is a property of what the protocol requires, not something it enforces. Its cost is inspectability: a caller can't see a peer's reasoning and must build trust from outputs and task lifecycle instead of traces, making cross-boundary evaluation and debugging harder.
