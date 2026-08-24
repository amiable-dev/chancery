---
title: The Ladder mechanism
date: 2026-08-24
domain: data
maturity: established
source_type: research
tags: [concept, evaluation, statistics, leaderboards, domain/data, maturity/established, source-type/research]
status: draft
sources:
  - url: https://arxiv.org/abs/1502.04585
---

# The Ladder mechanism

## Definition

**The Ladder** (Blum & Hardt, 2015) is a leaderboard algorithm that stays accurate under adaptive resubmission: because participants who repeatedly score against a holdout begin to overfit it, the Ladder controls what the leaderboard reveals, achieving strong guarantees in a fully adaptive estimation model while remaining practical — including a parameter-free variant deployable with no tuning.

## Explanation

The problem is structural, not adversarial in intent: every published score is information about the holdout, and a sequence of submissions guided by those scores is an optimization loop running against the evaluation data itself — the leaderboard drifts from measuring quality to measuring holdout-fitting. Prior practice resisted with folk heuristics (limited resubmission rates, truncated score precision) that the paper characterizes as poorly understood. The Ladder's contribution is a principled mechanism with a competition-tailored accuracy notion, guarantees that hold under full adaptivity, demonstrated resistance to practical attacks, and validated utility on real Kaggle submission data — while sidestepping a hardness result that rules out seemingly similar accuracy notions. The design lesson for any score-gated eval: the reporting channel is part of the mechanism, and what you reveal per run determines how fast your holdout depletes. The staged source is the abstract; procedure detail is in the paper.

## Key Properties

- Adaptive resubmission overfits the holdout through the scores themselves
- Guarantees in a fully adaptive model; resistant to practical attacks; validated on real Kaggle data
- Parameter-free deployable variant
- Reporting policy is part of the eval mechanism, not an afterthought

## Relationships

- [[adaptive-data-analysis]] — is the deployed instance of that theory for the leaderboard special case
- [[golden-dataset-retrieval-evals]] — supplies the mechanism-level justification for that harness's ratchet-style gating and restrained score reporting

## Applications

Designing what a CI eval publishes per run (ratchets, noise bands, thresholds) so the sealed subset's validity survives repeated consultation.

## Sources

- https://arxiv.org/abs/1502.04585

## See Also

- [[adaptive-data-analysis]]
- [[golden-dataset-retrieval-evals]]
