---
tags: [flashcards, ai-agents]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Tools for Certainty, Agents for Discovery — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:123923 -->
What is the "Tools for Certainty, Agents for Discovery" principle?
?
An architectural principle stating that deterministic sub-problems (counting, joins, lookups) should be delegated to deterministic tools/runbooks, while the LLM's reasoning capacity is reserved for higher-order discovery tasks that genuinely require judgment. It rejects the false dichotomy that a system must be either deterministic OR AI-driven.

## False Dichotomy <!-- kb:card:e4bf6e -->
Why does the principle argue against treating "deterministic" and "AI-driven" as opposites?
?
Because "I need that to be deterministic" is often used as an implicit way to argue against AI when doing so directly is politically unviable. In reality, determinism is the grounding that makes agentic discovery *reliable* — not the opposite of AI. The two are complementary layers of the same system, applied at different steps.

## Application <!-- kb:card:7830c6 -->
When an LLM agent keeps getting a specific join or count wrong in production, what's the recommended fix per this principle?
?
Give it a runbook-style rule: a parametrized query pattern to use when that situation recurs (Cursor-rule analogy) — rather than writing a longer prompt or switching to a bigger model. This offloads the deterministic part to code, saves tokens, and keeps discoverability (the agent still decides when to apply the pattern).

## Relationship <!-- kb:card:dddca7 -->
How does "Tools for Certainty, Agents for Discovery" relate to Constrained Agent Actions?
?
They're complementary: Constrained Agent Actions bounds the agent's *output* vocabulary (which decisions it's allowed to return), while Tools for Certainty bounds *which sub-problems* the LLM is even asked to solve in the first place — both narrow the agent's effective decision surface to improve reliability.
