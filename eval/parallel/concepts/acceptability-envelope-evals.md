---
title: Acceptability-envelope evals
date: 2026-08-24
tags:
  - concept
  - llm
  - evaluation
  - testing
status: draft
sources:
  - url: https://zoyathinks.substack.com/p/evals-are-the-new-unit-tests-2c91f51399d6
    hash: sha256:b9b49ed9fd1f39d00c069617eedefa94865e0644c289774b5a87e1fa56ed8b29
    retrieved: 2026-08-24
    reachability: ok
---

# Acceptability-envelope evals

## Definition

The **acceptability-envelope** framing of GenAI evaluation holds that for a non-deterministic model there is no single expected output to assert against; the unit-test analogue is an *envelope of possible outputs acceptable to the target users*, so an eval asserts properties an output must exhibit rather than values it must equal.

## Explanation

A unit test checks that code maps a given input to an expected output; a generative model produces new content each run, so the expectation itself has to be reconceived. The essay's proposal has three load-bearing terms: the envelope (you often cannot enumerate acceptable answers, but you can postulate required properties), acceptability (a judgment, not an equality), and target users (whose identity and context determine which properties matter — technical quality, prompt alignment, harm potential, commercial safety — each decomposing into sub-properties like artifact rates or physical accuracy). Two consequences follow. Test sets must be curated to sample the infinite input space where the target audience actually operates, weighted toward likely usage while probing the outer limits for emergent capability and risk. And there can be no comprehensive prescriptive guide: evals are custom to the model, the business, and the user, and must evolve with the model. Individual checks are neither deterministic nor pass/fail; aggregated over a test set with confidence bounds, they become the quantitative signal that tracks progress and gates shipping.

## Key Properties

- Expected output redefined as a property envelope, not an enumerable answer set
- Acceptability is user- and context-relative; the property hierarchy follows the audience
- Test sets sample likely usage plus the outer limits, not the full infinite input space
- Signals are statistical aggregates with confidence bounds, not per-case pass/fail

## Relationships

- _No relationships recorded yet._

## Applications

Designing an eval suite by first naming target users and deriving the property hierarchy from them; explaining why a vendor's generic benchmark cannot certify a specific product; framing eval results for ship/no-ship decisions as envelopes with confidence bounds.

## Sources

- https://zoyathinks.substack.com/p/evals-are-the-new-unit-tests-2c91f51399d6

## See Also

- _None yet._
