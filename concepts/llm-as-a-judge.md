---
title: "LLM-as-a-Judge"
date: 2026-07-13
domain: llm
maturity: established
source_type: practitioner
topics: [evaluation]
tags: [concept, ai-agents, llm, evaluation, testing, domain/llm, maturity/established, source-type/practitioner, topic/evaluation]
status: draft
sources:
  - url: https://zoyathinks.substack.com/p/evals-are-the-new-unit-tests-2c91f51399d6
    hash: sha256:b9b49ed9fd1f39d00c069617eedefa94865e0644c289774b5a87e1fa56ed8b29
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# LLM-as-a-Judge

## Definition
An evaluation approach in which one or more LLMs (or VLMs, for multimodal outputs) score the outputs of another model against a defined rubric or set of properties, standing in for — or supplementing — human raters so that evaluation can run at scale.

## Explanation
GenAI evals need a scoring mechanism to decide whether a given output falls inside the [[genai-eval-envelope|acceptable-output envelope]] for a target audience and context. Human review is the gold standard for judgment quality but doesn't scale: you cannot have humans manually rate every output for every model checkpoint, every test-set input, every release candidate. LLM-as-a-judge solves the scale problem by having a (typically stronger or differently-configured) model perform that rating task instead.

In practice, an LLM-as-a-judge setup takes:
1. The model output being evaluated
2. A rubric describing the properties that matter (technical quality, prompt alignment, harm potential, etc., decomposed into sub-properties)
3. Optionally, the original input/prompt and context about the target audience

...and produces a score, classification, or structured judgment per property, which is then aggregated across a test set into a statistical performance summary with confidence bounds — not a single pass/fail verdict.

LLM-as-a-judge is one of "two main modes" of powering evals mentioned in the source material — the other being direct human evaluation. In practice the two are often combined: human evaluation calibrates and validates the judge model's rubric application, while the judge model handles bulk throughput.

This pattern generalizes beyond single-output scoring. Multi-model deliberation approaches (e.g., LLM Council, `council-verify`) extend LLM-as-a-judge into multi-judge peer review with synthesis, aiming to reduce the bias/variance of any single judge model.

## Key Properties
- **Scalable** — enables evaluation of thousands of outputs without proportional human review cost
- **Rubric-driven** — judgment is structured around explicit properties/criteria, not free-form opinion
- **Not inherently deterministic** — judge models can disagree with themselves across runs or with human raters, so judge calibration matters
- **Composable with human review** — commonly used to triage or scale, with human spot-checks for calibration
- **Applicable to multimodal outputs** — VLM judges extend the pattern to image/video/audio generation evals

## Relationships
- Refined by [[deterministic-picker-pattern]]: judge prompts that ask for one holistic score are prone to LLM-as-Scorer flat-banding (outputs collapse into a narrow band regardless of real quality); decomposing the rubric into independently-scored categorical properties, composed in code, is the concrete fix
- Implements scoring for [[genai-eval-envelope]]: the judge determines whether an output falls within the defined envelope of acceptable properties
- Related to [[multi-agent-revalidation]]: revalidation is a specialised, adversarially-framed variant of LLM-as-judge focused on verifying discrete findings rather than scoring open-ended generative output
- Related to [[behavioral-qa-agents]]: behavioral QA explicitly names "LLM-as-Judge Evaluation" as one of its five techniques for scoring agent outputs against a rubric at scale
- Underlies our `llm-council`/`council-verify`/`council-gate` skills: multiple LLM judges score independently, then a chairman model synthesizes — a multi-judge extension of the basic pattern

## Applications
- **Automated eval pipelines:** Score generated outputs (text, image, audio) against a property rubric as part of a model development loop
- **CI/CD quality gates:** `council-gate`-style pass/fail/unclear decisions for pipeline approval, using judge models against a rubric instead of exact-match assertions
- **Benchmarking at scale:** Compare model versions or competitors on the same test set using consistent judge criteria
- **Shipping-readiness pulse checks:** Fast, cheap judge-model pass across a curated test set before a release decision

## Sources
- [Evals are the new unit tests](https://zoyathinks.substack.com/p/evals-are-the-new-unit-tests-2c91f51399d6) — Zoya Thinks; names LLM/VLM-as-judge as one of the two primary mechanisms powering GenAI evals at scale

## See Also
- [[genai-eval-envelope]]
- [[multi-agent-revalidation]]
- [[behavioral-qa-agents]]
- [[deterministic-picker-pattern]]
