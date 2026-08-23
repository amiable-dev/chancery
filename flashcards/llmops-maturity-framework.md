---
tags: [flashcards, llmops]
sr-due: 2026-07-14
sr-interval: 1
sr-ease: 250
---

# LLMOps Maturity Framework — Flashcards

#flashcards/llmops

## Definition <!-- kb:card:a0127e -->
What is an LLMOps maturity framework?
?
A codified capability checklist that scores each AI product's operational readiness (instrumented? offline eval suite? online evaluators? feedback loop reused?), computed automatically from an observability platform's API and used as a gate at each lifecycle stage.

## Mechanism <!-- kb:card:da2a7a -->
How does Schneider Electric keep its LLMOps maturity scores from going stale?
?
It computes them automatically via a scheduled GitHub Actions workflow that queries the LangSmith API directly, rather than relying on self-reported checklists — so the score always reflects current telemetry, not a one-time attestation.

## Application <!-- kb:card:93b96d -->
When would you use an LLMOps maturity framework as a gate?
?
When promoting an AI use case through lifecycle stages (exploration → incubation → industrialization → operations) — a product can't advance to wider rollout until it clears the maturity bar (e.g. having an offline eval suite before exiting incubation).

## Relationship <!-- kb:card:30ca76 -->
How does the LLMOps maturity framework relate to the Agentic DevOps Maturity Model?
?
They operate at different scopes: the Agentic DevOps Maturity Model assesses an *organisation's* overall readiness to let AI agents write code (4 levels, 4 dimensions), while the LLMOps maturity framework scores an individual *AI product's* operational instrumentation once it's already been shipped — org-capability maturity vs. per-product operational maturity.

## Relationship <!-- kb:card:79a19b -->
How does the LLMOps maturity framework relate to LLM observability?
?
LLM observability provides the raw data (traces, instrumentation) the maturity score is computed from — "is this product instrumented?" is literally the first maturity dimension, making observability a prerequisite input rather than a separate concern.
