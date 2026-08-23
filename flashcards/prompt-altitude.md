---
tags: [flashcards, prompt-engineering, ai-agents, context-engineering]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Prompt Altitude — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:27a335 -->
What is prompt altitude?
?
The level of specificity at which a system prompt operates. The right altitude is the Goldilocks zone between two failure modes: brittle hardcoded if-else logic (too low) and vague hand-wavy guidance that falsely assumes shared context (too high).

## Failure Modes <!-- kb:card:728aa8 -->
What are the two failure modes of prompt altitude?
?
**Too low (brittle):** Hardcoded if-else logic in natural language — breaks on any edge case not explicitly covered, high maintenance cost.
**Too high (vague):** Generic principles like "be helpful" that provide no concrete guidance — the model has insufficient signal to produce consistent behaviour.

## Application <!-- kb:card:bd486b -->
What is the recommended workflow for finding the right prompt altitude?
?
1. Start with a minimal prompt on the best available model
2. Observe failure modes in real testing
3. Add targeted instructions or examples only for *demonstrated* gaps
4. Avoid pre-emptive complexity — don't write rules for problems you haven't seen yet

## Relationship <!-- kb:card:9721b5 -->
How does prompt altitude relate to the minimal viable tool set principle?
?
The same Goldilocks principle applies to both: tool descriptions that are too specific become brittle and confusing; tool descriptions that are too vague lead to wrong tool selection. Both benefit from being *specific enough to guide, flexible enough for model heuristics to operate*.

## Signal <!-- kb:card:b67070 -->
What's a quick heuristic for detecting a prompt that's at the wrong altitude?
?
**Too low:** You see multi-level conditionals written in natural language ("if X then Y, unless Z, but if also W then...").
**Too high:** Failure analyses keep returning "the agent didn't know what to do" in routine situations.
**Right altitude:** You can describe the core behaviour as 3–5 clear principles.
