---
title: Golden-dataset retrieval evals
date: 2026-08-24
tags:
  - concept
  - llm
  - evaluation
  - retrieval
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
---

# Golden-dataset retrieval evals

## Definition

**Golden-dataset retrieval evals** are the trust infrastructure for a retrieval system: real questions labeled with the items required to answer them, scored deterministically (precision/recall against what the composer actually selected, recall at token-budget checkpoints), run nightly with regression alerting — with LLM judges reserved for what determinism cannot settle.

## Explanation

Retrieval quality degrades invisibly: no user files a ticket saying the context was eight percent worse this week, and standard APM sees traffic but not prompts. The harness makes degradation visible. Ground truth is a golden dataset of real user questions, each labeled with the items that must be present for a correct answer; the primary metrics are deterministic — did the required items appear in the composer's selection (precision/recall), and did they survive to the model at each token-budget checkpoint (recall@budget). Determinism keeps the signal cheap, stable, and diffable; model-graded judgment enters only where rules cannot decide. Every change to a strategy, embedding model, or filter prompt then becomes an experiment against the harness rather than a vibe check. The essay's ordering advice is the memorable part: build the harness before the third retrieval strategy, not after the thirtieth — you cannot safely refactor what you do not measure, and by the thirtieth strategy the system is too entangled to attribute regressions.

## Key Properties

- Golden set: real questions labeled with required items
- Deterministic first: precision/recall on composer selection, recall at token-budget checkpoints
- LLM judges only where determinism cannot settle the question
- Nightly runs with regression alerting; every change is an experiment
- Build the harness before the third strategy, not after the thirtieth

## Relationships

- [[context-layer]] — is the measurement layer that keeps that system's silent failure mode — invisible retrieval degradation — visible
- [[acceptability-envelope-evals]] — applies that framing's property-based testing to the retrieval stage specifically, where required-item labels make properties deterministic

## Applications

Regression-testing retrieval changes; separating retrieval failures from composition failures; justifying eval investment early in a retrieval project.

## Sources

- https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/

## See Also

- [[context-layer]]
- [[acceptability-envelope-evals]]
