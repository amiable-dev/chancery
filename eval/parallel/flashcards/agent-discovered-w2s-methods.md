---
tags: [flashcards, ai-safety, alignment, machine-learning, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Agent-discovered weak-to-strong methods — Flashcards

#flashcards/ai-safety

## Common shape of the methods <!-- kb:card:78ba4c -->
What common shape do agent-discovered weak-to-strong methods share?
?
They replace or reweight the weak teacher's labels using unsupervised consistency signals that require no ground truth — such as probe agreement, prediction symmetry under answer-swapping, embedding-space consistency, or training-dynamics learnability — then fine-tune the strong student on the corrected labels.

## Best-performing idea <!-- kb:card:cc5612 -->
What was the top agent-discovered idea and its reported performance-gap-recovered (PGR), versus the human-tuned baseline?
?
A Contrastive Consistency Search (CCS) probe combined with evolution-strategy refinement of LoRA parameters, reaching PGR 0.93 versus a 0.23 human-tuned baseline.

## Transfer requires the exploited structure <!-- kb:card:c62f00 -->
What is the key caveat about how well agent-discovered w2s ideas transfer to new settings?
?
The ideas exploit structure specific to the models and datasets they were found on, so transfer to a new setting requires verifying that same structure reappears there.

## A concrete transfer failure <!-- kb:card:1af4d4 -->
What happened when the EM-posterior idea was attempted at production scale on Sonnet 4.0 preference data?
?
It landed within noise, because single-token forced-choice margins were too weak to drive label correction.

## Source and origin <!-- kb:card:6769a9 -->
What study produced this catalogue of methods, and what baseline did the agent teams beat by wide margins?
?
Anthropic's automated weak-to-strong researcher study, in which agent teams beat a 0.23 human-tuned baseline PGR by wide margins.
