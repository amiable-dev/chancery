---
tags: [flashcards, local-models, evaluation]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Hardware-Dependent Inference Variance — Flashcards

#flashcards/local-models

## Definition <!-- kb:card:bc238d -->
What is hardware-dependent inference variance?
?
The finding that running an identical model, at identical settings, on an identical task can produce meaningfully different *output quality* (not just speed) depending on the underlying hardware — a reproducibility failure distinct from ordinary sampling non-determinism.

## Application <!-- kb:card:c2aaad -->
When should you watch out for hardware-dependent inference variance?
?
When evaluating or deploying a local/self-hosted model that runs close to a machine's RAM ceiling — a benchmark result gathered on one machine (e.g. a 48GB Mac) should not be trusted to generalise to another machine (e.g. a 64GB Mac) without re-validation, even with identical model, settings, and task.

## Relationship <!-- kb:card:43b48d -->
How does hardware-dependent inference variance relate to the GenAI Eval Envelope's stance on measurement?
?
It reinforces the eval envelope's point that measurement should be aggregate and confidence-bounded rather than single-run pass/fail — because quality isn't even reproducible across hardware for local models, a single run's result is especially unreliable evidence about the model itself.

## Recall <!-- kb:card:8fb90d -->
What was the concrete example of hardware-dependent inference variance in the source article?
?
The same task, same model (Qwen 35B MoE, 4-bit), same settings, run in the same automated harness: failed 5/7 times on a 48GB RAM M3 Max, but failed only 1/n times on a 64GB RAM M5 Pro.
