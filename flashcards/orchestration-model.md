---
tags: [flashcards, ai-agents, llm, multi-agent, orchestration]
sr-due: 2026-06-25
sr-interval: 1
sr-ease: 250
---

# Orchestration Model — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f08dac -->
What is an orchestration model?
?
A language model trained end-to-end specifically to coordinate a pool of other AI models — deciding when to delegate, which specialist to use, how agents communicate, and how to synthesise outputs — with the coordination logic learned from training rather than hardcoded.

## Contrast <!-- kb:card:510919 -->
How does an orchestration model differ from a supervisor agent pattern?
?
A supervisor agent follows handwritten rules to decompose and delegate tasks. An orchestration model has coordination logic baked into its weights through training, enabling it to generalise beyond designer anticipation and handle novel task decompositions the designer didn't anticipate.

## Key mechanism <!-- kb:card:be912b -->
What is "recursive self-calling" in the context of orchestration models, and why does it matter?
?
An orchestration model can call instances of itself as sub-agents within its own agent pool. This enables hierarchical depth (planning → sub-planning → execution) without requiring additional model types, and makes the orchestration architecture self-scaling.

## Research basis <!-- kb:card:6d9109 -->
What are the two ICLR 2026 papers that underpin Sakana Fugu's orchestration model?
?
1. **TRINITY** — An evolved coordinator that learns to assign Thinker, Worker, and Verifier roles to downstream agents.
2. **Conductor** — Uses reinforcement learning to discover natural-language coordination strategies (how to instruct and sequence sub-agents).

## Application <!-- kb:card:80e1c9 -->
When should you prefer an orchestration model over a hardcoded pipeline?
?
- When optimal sub-task decomposition isn't known in advance
- For long-horizon, open-ended workflows (research, code review, patent investigation)
- When the model pool changes frequently (new models arrive, vendor restrictions apply)
- When vendor resilience is required without caller-side routing logic

## Relationship <!-- kb:card:759844 -->
How does an orchestration model enable AI sovereignty?
?
By dynamically routing around unavailable providers — if a pool member becomes inaccessible due to export controls or restrictions, the orchestration model reroutes to available alternatives without any caller-side changes or manual reconfiguration.
