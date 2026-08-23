---
tags: [flashcards, ai-agents]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# Agentic Error Compounding — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:39313e -->
What is agentic error compounding?
?
The mechanism by which a single incorrect decision inside a multi-step agent reasoning loop propagates and amplifies through subsequent steps, because each step's context includes the (possibly corrupted) results of prior steps — unlike a chatbot, where a bad answer simply ends the interaction.

## Application <!-- kb:card:16d79f -->
When would you use the concept of agentic error compounding?
?
When diagnosing why an agent's failure got progressively worse rather than surfacing immediately — trace backward through the reasoning/tool-call log to find the originating decision, not just the final visible symptom.

## Relationship <!-- kb:card:98e61c -->
How does agentic error compounding relate to the AI agent anti-patterns catalogue?
?
It's the underlying structural reason the operational anti-patterns (no observability, ungoverned write access, ignored context drift) matter specifically for agents — each is a different way of failing to stop or contain a compounding error before it does damage.
