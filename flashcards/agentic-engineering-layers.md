---
tags: [flashcards, ai-agents, abstraction, engineering-practice, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Prompt, context, harness and loop layers — Flashcards

#flashcards/ai-agents

## Definition: the four agentic layers <!-- kb:card:963e69 -->
What are the four agentic engineering layers, and how do they relate to each other structurally?
?
Prompt (wording), context (everything the model can see), harness (tools, constraints, scaffolding, feedback), and loop (the cycle that runs it and decides when it stops) — each layer wraps the one before it rather than replacing it.

## Why the layers progress outward <!-- kb:card:665688 -->
What mechanism drives the progression from prompt engineering to context to harness to loop?
?
Each layer's ceiling motivates the next: a prompt can't supply facts the model was never given (→ context), curated context still fails without dependable tools or checks (→ harness), and a good harness still needs someone to decide which cycle runs and when it stops (→ loop).

## The layering as a diagnostic tool <!-- kb:card:1bc3bc -->
How does the layering framework help localize an agent failure?
?
It tells you where the failure lives: an agent that cannot find a fact has a context problem, an agent that cannot act on a fact it has has a harness problem, and an agent that never stops has a loop problem.

## Context engineering, defined <!-- kb:card:f38fa7 -->
How did Anthropic formalize what context engineering optimizes?
?
As curating the optimal set of tokens available during inference — echoing Shopify's Tobi Lutke's earlier framing of providing all the context needed for a task to be plausibly solvable.

## Caveat: a narrative, not a measurement <!-- kb:card:1a5757 -->
What limitation does the concept note about the layering's historical framing, including the dates it assigns?
?
It's a practitioner's way of organizing recent history, not a measured result — the dates it assigns (prompt 2022–2024, context 2025, harness/loop 2026) compress periods that overlapped heavily, and its boundaries are argued rather than sharp.
