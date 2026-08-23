---
tags: [flashcards, security]
sr-due: 2026-07-17
sr-interval: 1
sr-ease: 250
---

# AI Model Black-Box Risk — Flashcards

#flashcards/security

## Definition <!-- kb:card:b37f4b -->
What is AI Model Black-Box Risk?
?
The supply-chain risk from deploying an AI model — even an "open weight" one — without being able to reverse-engineer its behaviour, reliably detect implanted backdoors, or verify training data/fine-tuning provenance. It's worse than traditional third-party software risk because none of the usual verification fallbacks (disassembly, code review) transfer to model weights.

## Application <!-- kb:card:24c908 -->
When would you factor AI Model Black-Box Risk into a decision?
?
When evaluating whether to adopt an open-weight or third-party model for a production pipeline — you should weigh training data provenance, lineage disclosure, and availability of independent evaluation as separate risk dimensions, not just benchmark scores, latency, or cost.

## Relationship <!-- kb:card:221841 -->
How does AI Model Black-Box Risk relate to the Trusting Trust Problem?
?
It's a direct instance of it: a model inherits undisclosed behaviour from earlier checkpoints, distillation sources, or fine-tuning stages in its lineage, the same way Ken Thompson's backdoored compiler propagated invisibly into every future build — inspecting the current model's outputs doesn't reveal what was inherited from its ancestry.

## Scale Independence <!-- kb:card:c97c57 -->
Why doesn't a large, diverse training dataset protect against backdoor poisoning?
?
Research (including Anthropic's small-sample poisoning work) shows the number of poisoned pretraining samples needed to implant a persistent backdoor is small and does NOT scale up with dataset size — large datasets are not inherently immune to manipulation.

## Alignment vs Poisoning <!-- kb:card:563c55 -->
Why is "alignment" vs "poisoning" described as a framing choice rather than a technical distinction?
?
Both use the same mechanism: targeted training interventions that reliably change model output behaviour for specific triggers. Whether an intervention counts as legitimate alignment or malicious poisoning depends on who authorised it and why — not on any difference in the underlying technique.
