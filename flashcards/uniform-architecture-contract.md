---
tags: [flashcards, ai-agents, architecture]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# Uniform Architecture Contract — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:9ea53f -->
What is the uniform architecture contract pattern?
?
A software-design discipline where every distinct agentic architecture (Reflection, ReAct, Tree of Thoughts, MemGPT, etc.) is implemented behind one shared abstract interface — a single `.run(task)` method and a single return shape (e.g. `ArchitectureResult`) — so swapping which pattern handles a task means swapping a class, not rewriting the calling code.

## Application <!-- kb:card:68d5c8 -->
When would you apply a uniform architecture contract?
?
When building a library or system that needs to compare, benchmark, or dynamically route between multiple agentic patterns — e.g. a benchmark harness testing 35 architectures against the same task suite, or a Meta-Controller/router that picks an architecture per incoming task. The contract is what makes "try several architectures and measure which fits" a cheap swap-and-measure experiment rather than a rewrite.

## Relationship <!-- kb:card:967e31 -->
How does the uniform architecture contract relate to the deterministic-picker pattern?
?
Both come from the same source library and aim at making agentic behaviour comparable/auditable. The uniform architecture contract standardises how a whole architecture is invoked and reported on (one call interface, one result shape); the deterministic-picker pattern standardises how a single decision step within an architecture decides (categorical LLM commitments composed deterministically in code).

## Key Mechanism <!-- kb:card:52d4c9 -->
What decoupling does the uniform architecture contract enable beyond swapping patterns?
?
It decouples LLM provider selection from architecture selection entirely — the LLM client is injected (e.g. via a `get_llm()` factory) rather than hardcoded per architecture, so swapping the provider (OpenAI, Anthropic, Nebius, etc.) and swapping the pattern are two independent decisions that require no code changes to each other.
