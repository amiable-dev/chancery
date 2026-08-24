---
tags: [flashcards, agents, llm, prompting, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Context engineering — Flashcards

#flashcards/agents

## Definition <!-- kb:card:cb288f -->
What is context engineering?
?
Treating a model's context window as a finite, depleting resource and curating, at every turn of inference (not just once at authoring time), the smallest set of high-signal tokens that produce the wanted behaviour — spanning system instructions, tool definitions, examples, retrieved data, and accumulated message history.

## Key mechanism: why context degrades <!-- kb:card:099ed4 -->
Why does model precision degrade as context grows, mechanistically?
?
Self-attention lets every token attend to every other, so n tokens carry on the order of n-squared pairwise relationships, and training corpora contain far more short sequences than long ones, leaving models less experienced with context-wide dependency. The result is a performance gradient, not a cliff: attention behaves like a budget every added token draws down.

## Right altitude for system prompts <!-- kb:card:2f89e5 -->
What is the "right altitude" for a system prompt in context engineering?
?
Between hardcoded if-else logic, which is brittle to maintain, and guidance so vague it assumes shared context the model does not have — specific enough to steer, general enough not to be brittle.

## Just-in-time retrieval trade-off <!-- kb:card:a5a1ed -->
How does just-in-time retrieval differ from pre-computing everything into the prompt, and what does it trade?
?
The agent holds lightweight identifiers (file paths, stored queries, links) and pulls data through tools at runtime instead of pre-loading it all. This buys progressive disclosure and the metadata signal carried by names, sizes, and timestamps, at the cost of slower exploration and a need for good navigation tools.

## Three long-horizon levers <!-- kb:card:2a87d6 -->
What three levers does context engineering use when a task outruns the context window?
?
Compaction (summarise history and reinitialise, tuned for recall first then trimmed for precision — clearing stale tool results is its safest form); structured note-taking to files that live outside the window and are read back after a reset; and sub-agent isolation, where a sub-agent explores at length but returns only a small distillate.
