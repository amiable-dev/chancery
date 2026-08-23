---
tags: [flashcards, llm, caching, cost-optimisation, anthropic]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Automatic Prompt Caching — Flashcards

#flashcards/llm

## Definition <!-- kb:card:bb43f9 -->
What is automatic prompt caching?
?
A caching mode where a single top-level `cache_control: {type: "ephemeral"}` field is added to the API request body; the provider automatically applies the cache breakpoint to the last cacheable block and advances it forward as conversations grow.

## Implementation <!-- kb:card:a168a3 -->
How do you enable automatic prompt caching in the Anthropic API?
?
Add a top-level `cache_control: {"type": "ephemeral"}` to the request body — not inside any content block. One field at the request level enables caching for the whole prompt.

## Vs Explicit Breakpoints <!-- kb:card:06ce65 -->
When should you choose automatic caching over explicit cache breakpoints?
?
Choose automatic caching for multi-turn conversations where the growing message history should all be cached — it advances the breakpoint automatically with each new turn. Choose explicit breakpoints when you want to cache only a specific section (e.g., a large reference doc) while leaving other parts intentionally fresh.

## Auto-Advancing <!-- kb:card:4855ed -->
What does "auto-advancing breakpoint" mean in automatic caching?
?
As each new message is added to the conversation, the provider automatically moves the cache breakpoint to the new last cacheable block, so the full conversation history is cached on every turn without any code changes.
