---
title: Adaptive data analysis
date: 2026-08-24
domain: data
maturity: established
source_type: research
tags: [concept, evaluation, statistics, methodology, domain/data, maturity/established, source-type/research]
status: draft
sources:
  - url: https://arxiv.org/abs/1411.2664
---

# Adaptive data analysis

## Definition

**Adaptive data analysis** (Dwork, Feldman, Hardt, Pitassi, Reingold, Roth, 2014) names the gap between statistical theory and practice: inference guarantees assume hypotheses fixed before the data is seen, while real analysis chooses each next question based on previous answers from the same data — and the paper initiates the principled study of when validity survives that adaptivity.

## Explanation

The core result is constructive and counter-intuitive: an exponential-in-n number of adaptively chosen expectations can be estimated accurately from n samples — an exponential improvement over naive empirical estimates, which degrade after linearly many adaptive queries — by actively perturbing and coordinating the answers, using machinery developed for privacy preservation. The privacy connection is the deep point: a mechanism that limits how much any answer reveals about individual samples also limits how much an adaptive analyst can overfit to them. For anyone running an eval harness the practical translation is direct: every time results inform the next change, the fixed-hypothesis assumption is violated, and reusing a holdout without a protective mechanism silently spends its validity. The staged source is the paper's abstract; the mechanism detail is in the full text.

## Key Properties

- Classical guarantees assume non-adaptive hypothesis choice; practice is adaptive
- Naive reuse survives only linearly many adaptive queries; perturbation extends this exponentially
- The protective mechanism is privacy-style noise addition — limiting per-sample leakage limits overfitting
- Foundation of the reusable-holdout line of work

## Relationships

- [[ladder-mechanism]] — provides the theory for which that leaderboard algorithm is the deployed, parameter-free special case
- [[golden-dataset-retrieval-evals]] — explains why that harness's sealed holdout depletes under tuning and what class of mechanism preserves it

## Applications

Budgeting how often a holdout or eval set may inform decisions before its guarantees are spent; the theoretical backing for sealed-holdout and noised-reporting designs.

## Sources

- https://arxiv.org/abs/1411.2664

## See Also

- [[ladder-mechanism]]
- [[golden-dataset-retrieval-evals]]
