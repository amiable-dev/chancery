---
tags: [flashcards, llm-inference, caching, performance]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Automatic prefix caching (RadixAttention) — Flashcards

#flashcards/llm-inference

## Definition <!-- kb:card:167862 -->
What does automatic prefix caching let an LLM serving system skip when handling a new request?
?
Recomputing the shared portion of a prompt: any new request sharing a literal token prefix with a previously served request can reuse its cached KV attention state directly.

## Indexing structure <!-- kb:card:7e888e -->
What data structure does SGLang's RadixAttention use to index the KV cache, and what is it keyed by?
?
A radix tree, keyed by token-id sequences.

## Match requirement <!-- kb:card:f9ef16 -->
Does a prefix-cache hit require an exact token match or just semantic similarity?
?
An exact token-level prefix match — not semantic similarity.

## Eviction policy <!-- kb:card:620d3c -->
What eviction policy does RadixAttention typically use over its cache tree?
?
An LRU-like policy over tree nodes, so infrequently reused branches are reclaimed first.

## Invalidation <!-- kb:card:3aef24 -->
What invalidates a cached prefix match for everything after a given point in a prompt?
?
Any change upstream of that divergence point — e.g. reordering a field or inserting per-request content before shared content.

## Practical prompt ordering <!-- kb:card:b8c52d -->
Where should stable, request-invariant content (system instructions, tool definitions, few-shot examples) go in a prompt to maximize prefix-cache hits?
?
At the front of the prompt, with per-request variable content pushed to the end.
