---
tags: [flashcards, observability, ai-agents, reliability, domain/observability, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Proxy-boundary session capture — Flashcards

#flashcards/observability

## Definition <!-- kb:card:75f04f -->
What is proxy-boundary session capture?
?
The practice of recording every LLM request/response at a transparent proxy you control, storing each message as a hashed, content-addressed node with a parent pointer — so the conversation tree survives independently of the harness.

## Why the proxy boundary <!-- kb:card:983b81 -->
Why does proxy-boundary session capture record at a proxy instead of inside the agent harness?
?
So capture doesn't share the harness's failure domain — if the harness crashes and loses its in-memory context, the proxy's recorded tree is unaffected because it sits between the application and the provider, outside the process that can die.

## Storage structure <!-- kb:card:2b1cb8 -->
How is each message stored in proxy-boundary session capture?
?
As a content-addressed node (hashed) carrying a parent pointer, so the full conversation reconstructs exactly as a tree — e.g. a Merkle DAG in a local SQLite database.

## Recovery workflow <!-- kb:card:4ef7d3 -->
How do you recover a session after a harness crash under proxy-boundary session capture?
?
Start a fresh session and point it at the recorded tree at the proxy; the conversation continues from where it left off — recovery is mundane, not heroic.

## Tool-agnostic, content addressing <!-- kb:card:51faca -->
Is proxy-boundary session capture tied to one specific tool, and what does content addressing add?
?
No — any logging proxy with durable, ordered, per-message storage supports the same recovery; content addressing adds integrity (detects tampering or truncation) but isn't essential to the mechanism.
