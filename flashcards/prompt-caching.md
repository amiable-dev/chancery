---
tags: [flashcards, ai-agents, performance, cost-optimisation, llm]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Prompt Caching — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:03e41f -->
What is prompt caching?
?
A provider-side mechanism that stores the **stable prefix** of a conversation (system prompt, config files, loaded skills) so subsequent turns don't re-process it. Cache hits are served at a steep per-token discount (~10–20% of normal cost) with lower latency.

## Mechanism <!-- kb:card:76b5d2 -->
What are the three steps of the prompt caching mechanism?
?
1. **Write** — First call marks the stable prefix with a cache breakpoint; provider stores the KV cache (at a small premium)
2. **Hit** — Subsequent calls with the same prefix are recognised as cache hits; provider skips re-processing
3. **Discount** — Cache hits are billed at ~10–20% of normal per-token cost; latency also improves

## TTL problem <!-- kb:card:f049d9 -->
What is the TTL problem in prompt caching?
?
Caches expire after a period of inactivity (provider-typical: minutes to an hour). If a session goes idle — user steps away, attends a meeting — the cache expires and the next call pays the full rewrite cost. Active sessions stay warm; idle sessions lose the savings.

## Economics impact <!-- kb:card:1e01d9 -->
How does prompt caching change the economics of agent config files?
?
Without caching: a 2000-token config file costs 2000 tokens per turn → significant ongoing expense.
With caching: costs ~200 tokens per turn (10x discount) after the first call.
**However:** the [[context-rot]] and [[attention-budget]] arguments for keeping configs short still apply — caching reduces cost but not attention pressure.

## What can be cached? <!-- kb:card:63fb42 -->
What types of content are eligible for prompt caching?
?
- System prompts (always eligible)
- Project config files loaded at session start
- Reusable skills that remain loaded throughout a session
- Large reference documents injected at the start
**Cannot be cached:** Dynamic per-turn content (tool results, user messages) — only the stable prefix before the first dynamic content.
