---
title: Weak-to-strong generalization
date: 2026-08-24
tags:
  - concept
  - ai-safety
  - alignment
  - evaluation
status: draft
sources:
  - url: https://github.com/safety-research/automated-w2s-research
    hash: sha256:7686939098851d59eddbd1173785b4362c35006135fb1d617a9e6956c68d27ce
    retrieved: 2026-08-24
    reachability: ok
---

# Weak-to-strong generalization

## Definition

**Weak-to-strong generalization (W2S)** is the alignment research setup that models the superhuman-oversight problem: a weak model is trained on labeled data, its pseudo-labels train a strong model on unlabeled data, and the question is how much of the strong model's latent capability survives supervision by a weaker teacher.

## Explanation

The setup is a proxy for the situation alignment ultimately cares about — humans supervising AI systems smarter than themselves, whose outputs they cannot reliably evaluate. The standard metric is **Performance Gap Recovery**: PGR = (transfer accuracy − weak accuracy) / (strong accuracy − weak accuracy), where transfer accuracy is the strong student trained on weak labels, and the denominators are the weak teacher and a strong ceiling trained on ground truth. PGR of 0 means supervision capped the student at its teacher's level; PGR of 1 means the student recovered full ground-truth performance despite noisy supervision. Baseline families in the safety-research release show the method space: training only on confident weak labels, using strong-model critiques to improve the labels, and unsupervised elicitation variants that draw the answer out of the strong model rather than teaching it. The framing's value is that it converts a philosophical worry into a measured quantity on ordinary benchmarks.

## Key Properties

- Weak teacher labels; strong student trains on the pseudo-labels
- PGR = (transfer − weak) / (strong − weak) quantifies recovered capability
- PGR 0 = capped at the teacher; PGR 1 = full recovery despite weak supervision
- Baseline approaches: confidence filtering, strong-model critiques, unsupervised elicitation

## Relationships

- [[automated-w2s-sandbox]] — is the research question the sandbox operationalises with datasets, baselines and a held-out evaluation API

## Applications

Evaluating any scheme for supervising a system more capable than its overseer; comparing label-improvement techniques on a common recovery metric.

## Sources

- https://github.com/safety-research/automated-w2s-research

## See Also

- [[automated-w2s-sandbox]]
