---
tags: [flashcards, llm, caching, cost-optimisation, anthropic, api]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Explicit Cache Breakpoints — Flashcards

#flashcards/llm

## Definition <!-- kb:card:6cadf9 -->
What is an explicit cache breakpoint in Anthropic's API?
?
A `cache_control: {type: "ephemeral"}` marker placed directly on an individual content block, telling the provider to cache everything from the start of the prompt up to and including that block.

## Prefix Order <!-- kb:card:d6b8f0 -->
What order does Anthropic use when building the cached prefix?
?
`tools → system → messages` (in that order). A breakpoint on any block caches all content from the start of the prompt through that block, following this fixed ordering.

## When to Use <!-- kb:card:02ff2c -->
When is explicit cache breakpoints the right choice over automatic caching?
?
When you want to cache only a specific expensive section — like a large reference document in the system block — while leaving the dynamic message history uncached. Also useful when you need to cache only tool definitions without caching the system prompt.

## Stable Prefix Requirement <!-- kb:card:2ed733 -->
What condition must hold for a cache hit to occur with explicit breakpoints?
?
All content up to the breakpoint must be byte-for-byte identical across calls. Any change to the content before the breakpoint invalidates the cache entry and forces a fresh write.
