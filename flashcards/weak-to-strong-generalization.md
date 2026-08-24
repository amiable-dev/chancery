---
tags: [flashcards, ai-safety, alignment, evaluation, domain/ai-safety, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Weak-to-strong generalization — Flashcards

#flashcards/ai-safety

## Weak-to-strong generalization: setup <!-- kb:card:214edf -->
What is the weak-to-strong generalization (W2S) research setup?
?
A weak model is trained on labeled data; its pseudo-labels then train a strong model on unlabeled data. The question is how much of the strong model's latent capability survives supervision by a weaker teacher — a proxy for humans overseeing superhuman AI.

## Performance Gap Recovery formula <!-- kb:card:ad1fba -->
How is Performance Gap Recovery (PGR) calculated in weak-to-strong generalization?
?
PGR = (transfer accuracy − weak accuracy) / (strong accuracy − weak accuracy), where transfer accuracy is the strong student trained on weak labels, weak accuracy is the weak teacher, and strong accuracy is a strong ceiling trained on ground truth.

## Interpreting PGR 0 vs PGR 1 <!-- kb:card:f810a8 -->
What do PGR values of 0 and 1 mean in weak-to-strong generalization?
?
PGR 0 means the student was capped at the weak teacher's level; PGR 1 means the student fully recovered ground-truth performance despite noisy weak supervision.

## W2S baseline method families <!-- kb:card:2496f8 -->
What are the three baseline method families used to improve weak-to-strong generalization?
?
Training only on confident weak labels (confidence filtering), using strong-model critiques to improve the labels, and unsupervised elicitation that draws the answer out of the strong model rather than teaching it.

## Why W2S is useful as a framing <!-- kb:card:49ddcb -->
What is the value of the weak-to-strong generalization framing for alignment research?
?
It converts a philosophical worry — humans supervising AI smarter than themselves — into a measured, quantifiable question on ordinary benchmarks.
