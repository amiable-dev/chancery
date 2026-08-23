---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- memory
- memory-as-harness
---


# Memory as Harness — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:21f628 -->
What does "memory as harness" mean?
?
Agent memory is not a separable plugin or service — it is intrinsic to the harness. How context is loaded, compressed, stored, and retrieved is entirely determined by harness-level decisions.

## Analogy <!-- kb:card:3b4745 -->
What analogy does Sarah Wooders use to explain why memory can't be plugged into a harness?
?
"Asking to plug memory into an agent harness is like asking to plug driving into a car." Driving isn't an add-on — it's what the car does. Similarly, memory management is what the harness does.

## Relationship <!-- kb:card:9878c9 -->
Name three specific memory decisions that belong to the harness, not to a separate memory service.
?
Any three of: what survives context compaction; how AGENTS.md/CLAUDE.md is loaded; whether agents can modify their own instructions; how tool call results enter the context window; when long-term memory is read or written.

## Migration <!-- kb:card:ec45ba -->
What does this principle mean for harness migration?
?
Migrating an agent from one harness to another requires migrating and potentially reformatting all its memory state — because memory is encoded in harness-specific formats. You cannot simply "plug memory out" and back in.

## Caveat <!-- kb:card:4813a5 -->
Under what conditions might memory become separable from the harness?
?
When the industry converges on standard memory abstractions and best practices (which hadn't happened as of 2025–2026). Until then, memory best practices are still being discovered and memory lives in the harness.
