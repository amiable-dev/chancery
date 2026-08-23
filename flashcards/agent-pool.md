---
tags: [flashcards, ai-agents, llm, multi-agent, orchestration]
sr-due: 2026-06-25
sr-interval: 1
sr-ease: 250
---

# Agent Pool — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:baa09b -->
What is an agent pool?
?
A named, bounded collection of AI models (or model-backed agents) that an orchestration model can dynamically select from and delegate to — where membership is swappable at runtime without requiring changes to the orchestration layer or calling application.

## Swappability <!-- kb:card:3771ba -->
What does "swappability" mean in an agent pool, and why does it matter?
?
Models enter and leave the pool without the orchestrator needing to be retrained or the caller needing to be reconfigured. This means regulatory restrictions (e.g., export controls on a specific model) or new frontier model releases can be handled by pool membership changes alone, not code changes.

## Compliance <!-- kb:card:040b27 -->
How does an agent pool support compliance and data sovereignty requirements?
?
Pools can be filtered per deployment. An enterprise with data sovereignty requirements can configure the pool to exclude cloud-hosted models, restricting to on-prem or approved providers. This filtering happens at the pool configuration layer, not inside the orchestration model's weights.

## Quality relationship <!-- kb:card:c684bf -->
In Sakana Fugu, Anthropic's Fable 5 and Mythos Preview are NOT in the pool — yet Fugu Ultra matches their benchmarks. What does this tell us?
?
Output quality depends on both pool quality and coordination quality together. A well-coordinated ensemble of capable-but-not-frontier models, using learned orchestration, can match or exceed individual frontier models that aren't participating in the pool.

## Application <!-- kb:card:e584e2 -->
What is the key design principle for pool composition to achieve vendor resilience?
?
Include at least one capable model per specialisation from each vendor you want resilience against. Pool diversity equals resilience — if one vendor's access is restricted, another vendor's pool member can substitute.
