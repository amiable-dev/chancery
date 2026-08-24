---
title: Agent-discovered weak-to-strong methods
date: 2026-08-24
domain: ai-safety
maturity: emerging
source_type: research
tags: [concept, ai-safety, alignment, machine-learning, domain/ai-safety, maturity/emerging, source-type/research]
status: draft
sources:
  - url: https://alignment.anthropic.com/2026/automated-w2s-researcher/
    hash: sha256:5567b945ccf5cd78e6bff8c93b57d1e0634b1ea13f52ddf626de822348ceb86a
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Agent-discovered weak-to-strong methods

## Definition

**Agent-discovered weak-to-strong methods** are the supervision techniques that automated researchers produced for training a strong model from a weak teacher's labels, which share one shape: replace or reweight the weak labels using signals that require no ground truth — agreement between the weak teacher and unsupervised probes of the strong model's internals, prediction symmetry under answer swapping, consistency of labels in the strong model's embedding space, and per-sample learnability read off training dynamics — then fine-tune the strong student on the corrected labels.

## Explanation

The catalogue comes from Anthropic's automated weak-to-strong researcher study (first-party writeup, methods specified to pseudocode in the released materials), where agent teams beat a 0.23 human-tuned baseline PGR by wide margins. The top idea (PGR 0.93) trains a Contrastive Consistency Search probe across the strong model's hidden layers for an unsupervised truth direction, resamples training data by CCS-weak agreement, warm-starts with SGD, then refines LoRA parameters with gradient-free evolution strategies whose fitness rewards confident, swap-symmetric predictions, ensembling sixteen seeds by trimmed mean in logit space. An EM-posterior method (0.78) fits an instance-dependent noisy-channel model of the weak teacher's error rates over features from multi-template logit margins and combines it with the frozen model's prior via Bayes rule, refined over two EM rounds. Overlap density (0.75) scores each example by how well its weak label fits the strong model's embedding geometry — cross-fitted probe, kNN label smoothness, local density, mid-entropy preference — and trains on the best-aligned half. An MDL curriculum (0.68) trains two epochs on the confident half before three epochs on everything at half learning rate, and an epiplexity method (0.62) smooths labels toward one-half on samples whose training loss never drops, treating first-minus-last loss as a learnability signal. Several directions succeeded where the authors expected failure, and some ideas read as alien rather than human-styled. The transfer record is the caveat that matters: the top idea generalized to held-out math and coding testbeds, a second idea failed on code because it leans on zero-shot capability the student lacks there, and a production-scale attempt of the EM idea on Sonnet 4.0 preference data landed within noise because single-token forced-choice margins were too weak to drive label correction — agent-discovered ideas exploit structures specific to the models and datasets they were found on, and transfer requires that structure to reappear.

## Key Properties

- Common shape: unsupervised consistency signals — swap symmetry, probe agreement, embedding smoothness, training dynamics — substitute for ground truth in label correction
- Reported PGRs: CCS plus evolution-strategy refinement 0.93, EM posterior 0.78, overlap density 0.75, MDL curriculum 0.68, epiplexity smoothing 0.62, against a 0.23 human-tuned baseline
- The best idea transferred to held-out math and coding testbeds; a zero-shot-dependent idea failed exactly where the strong model's zero-shot is weak
- A production-scale transfer of the EM-posterior idea moved the metric +0.5 points, within noise, because forced-choice preference margins were too weak upstream
- Ideas exploit dataset- and model-specific structure, so transfer requires verifying the exploited structure exists in the target setting

## Relationships

- [[weak-to-strong-generalization]] — are candidate solutions to this problem, ranked by the performance-gap-recovered metric it defines
- [[parallel-automated-researchers]] — were discovered by these agent teams hill-climbing in parallel, several in directions the human authors expected to fail
- [[automated-w2s-sandbox]] — were developed and scored inside this environment, whose particular datasets and model pair shaped which structures the ideas exploit

## Applications

A menu of label-correction and data-selection techniques for training on weak or noisy supervision, and a checklist item for anyone adopting an agent-discovered method: confirm the structure it exploits — confidence margins, zero-shot capability, embedding geometry — actually exists at the target scale before expecting the reported gains.

## Sources

- https://alignment.anthropic.com/2026/automated-w2s-researcher/

## See Also

- [[weak-to-strong-generalization]]
- [[parallel-automated-researchers]]
- [[automated-w2s-sandbox]]
