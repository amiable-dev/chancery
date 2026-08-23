---
tags: [flashcards, ai-alignment, safety, scalable-oversight]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Scalable Oversight — Flashcards

#flashcards/ai-alignment

## Definition <!-- kb:card:d79737 -->
What is scalable oversight?
?
A field of AI safety research studying how human overseers can reliably supervise AI systems that are significantly more capable than themselves — particularly when AI outputs (code, proofs, research) exceed any individual human's ability to verify.

## Core problem <!-- kb:card:0b69ab -->
What is the fundamental challenge scalable oversight addresses?
?
When an AI knows more than its human overseer, how can the human verify whether the AI is behaving as intended? The harder the AI's outputs are to understand, the less reliable human supervision becomes — unless oversight mechanisms scale with capability.

## Approaches <!-- kb:card:91eac5 -->
Name three approaches studied in scalable oversight research.
?
1. Weak-to-strong supervision — weaker models as proxies for human oversight of stronger models
2. Debate — two AIs argue opposing positions; a weaker judge evaluates to find the truth
3. Recursive reward modelling — human oversight amplified through chains of AI-assisted evaluation

## Bottleneck shift <!-- kb:card:bf6ea9 -->
How has the bottleneck in alignment research shifted, according to the AAR experiment?
?
From generation (humans proposing promising ideas) to evaluation (verifying that AI-generated ideas are sound and not gamed). As AI produces more ideas faster, the limiting factor becomes reliable, hack-resistant evaluation.

## Relationship <!-- kb:card:2c1281 -->
How does weak-to-strong supervision relate to scalable oversight?
?
Weak-to-strong supervision is the tractable, empirically testable proxy for scalable oversight. The weak teacher stands in for future humans; the strong base model stands in for future superhuman AI. Progress on weak-to-strong generalisation is evidence that scalable oversight may be achievable.
