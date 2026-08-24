---
tags: [flashcards, security, supply-chain, ai-governance, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Model provenance over inspection — Flashcards

#flashcards/security

## Model provenance over inspection — claim <!-- kb:card:2a654d -->
What is the 'model provenance over inspection' position?
?
Trust in a machine-learning model can't come from examining the artifact — it must come from its lineage (training data, filtering, fine-tuning, hosting), attested by parties independent of the producer, because published weights can't be reverse engineered into a description of behavior the way a compiled binary can.

## Provenance — poisoning scale finding <!-- kb:card:554ccd -->
How many poisoned pretraining samples does it take to install a persistent triggered backdoor, and how does this count scale with model size?
?
A small, roughly constant number suffices — the count does not rise with model or dataset size, so scale doesn't dilute the risk.

## Provenance — Thompson's trusting-trust analogy <!-- kb:card:9d1008 -->
What argument does model provenance over inspection borrow from Ken Thompson's 1984 Turing lecture, and what's the model analogue?
?
A compiler modified to insert a backdoor into everything it compiles (including its own successors) with nothing wrong visible in readable source. The analogue: a model can inherit behavior from earlier in its lineage that no inspection of the final weights would surface.

## Provenance — why benchmarks don't help <!-- kb:card:cd3764 -->
Why don't benchmark scores serve as evidence of a model's integrity?
?
Because a model can be fine-tuned specifically to pass benchmarks, so passing them says nothing about hidden, lineage-inherited behavior.

## Provenance — binaries vs weights <!-- kb:card:771f79 -->
Why can a suspicious compiled binary be vetted in a way a released model's weights cannot?
?
A binary yields to disassembly — with enough effort an analyst can arrive at a total description of its behavior — while mechanistic interpretability of model weights is still a research program, not a deployable inspection tool.
