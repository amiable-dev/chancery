---
title: "Local Model Viability Funnel"
date: 2026-07-13
domain: llm
maturity: emerging
source_type: practitioner
topics: [evaluation, agentic-coding]
tags: [concept, ai-agents, local-models, evaluation, agentic-coding, llm, domain/llm, maturity/emerging, source-type/practitioner, topic/evaluation, topic/agentic-coding]
status: draft
sources:
  - url: https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html
    hash: sha256:2db275abc283e503ae8f6c36a7cd7940e6d479557c8be60e84585884b9f27d71
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Local Model Viability Funnel

## Definition
The **Local Model Viability Funnel** is a staged evaluation framework for assessing whether a small, locally-run language model can be used for agentic coding tasks. It orders viability checks from cheapest/most-basic to most-demanding, so that a model can be eliminated early — before investing time in deeper, more expensive evaluation stages.

## Explanation
Evaluating small local models is tedious: downloads are slow, each model needs reconfiguring in a harness, and results require careful interpretation. The viability funnel gives that process structure by treating viability as a sequence of gates, each one a precondition for the next:

1. **Does it fit into RAM?** If the model's weights (at a given quantization) don't fit in available memory, none of the later questions matter. A practical baseline used in this framing is ~48GB of available RAM.
2. **Does it run at reasonable speed?** A first smoke test: how quickly does it respond to a simple request?
3. **Can it handle tool calling?** Give it a task involving reading and writing files through a coding harness — does it invoke tools correctly?
4. **Does it build functionally correct code?** Setting aside code quality entirely — does the output actually work?
5. **Can it handle continued conversation / more context?** Does quality hold up as the conversation (and context window usage) grows?
6. **Can it handle a larger or more complex task?** If a setup survives steps 1–5, does it scale to harder problems?
7. **Is the code quality acceptable?** The final, most subjective gate: what's the tradeoff between coding speed and the review effort the output demands?

The funnel shape matters: each stage filters out models that fail cheaply, so effort is spent proportionally to how promising a model already looks. A model that fails at "fits in RAM" costs nothing further to evaluate; a model that fails only at "code quality" has already earned a lot of evaluation investment.

In practice (per the source), this framework was applied across three phases — manual evals (subjective UX), automated evals (a small hand-built harness for more data points), and finally day-to-day use with the model that survived furthest through the funnel (Qwen3.6 35B MoE, 4-bit).

## Key Properties
- **Sequential and gated** — later stages are only worth running if earlier stages pass; failure at any gate is a hard stop for that configuration
- **Increasing cost and specificity** — early gates (RAM, speed) are near-instant checks; late gates (code quality on complex tasks) require real task attempts and human judgment
- **Task-dependent, not just model-dependent** — the same model can pass the funnel for one task type and fail it for another (see [[task-model-fit]])
- **Hardware-sensitive** — passing the RAM/speed gates is a function of the specific machine, not just the model (see [[hardware-dependent-inference-variance]])
- **Distinct from property-based evaluation** — the funnel is about elimination through sequential capability checks, not scoring outputs against a hierarchy of acceptable-output properties

## Relationships
- Contrasts with [[genai-eval-envelope]]: the eval envelope evaluates *whether an output's properties* fall within an acceptable range; the viability funnel evaluates *whether a model configuration clears a sequence of capability thresholds* before output quality is even assessed
- Depends on [[agent-harness]]: tool-calling and context-handling gates are only testable once the model is wired into a harness (OpenCode, Pi, etc.)
- Interacts with [[task-model-fit]]: how far a given model gets through the funnel depends heavily on the task characteristics it's tested against
- Complicated by [[hardware-dependent-inference-variance]]: the same model can clear different gates on different machines, undermining a clean pass/fail reading of the funnel

## Applications
- **Local/self-hosted model evaluation:** Before adopting a local model for any agentic workflow, run it through the funnel to fail fast on hardware or capability mismatches rather than jumping straight to subjective quality judgments
- **Fallback model selection:** When evaluating a local model as a fallback option (e.g. for cost or availability reasons), the funnel gives a structured way to document exactly where a candidate model breaks down
- **Harness/runtime comparisons:** Running the same model through the funnel with different harnesses (OpenCode vs. Pi) isolates whether failures are model-driven or harness-driven

## Sources
- [Experiences with local models for coding](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html) — Birgitta Böckeler, Thoughtworks, martinfowler.com. Second memo on hands-on local-model agentic coding experiments on Apple Silicon (M3 Max 48GB, M5 Pro 64GB).

## See Also
- [[genai-eval-envelope]]
- [[agent-harness]]
- [[task-model-fit]]
- [[hardware-dependent-inference-variance]]
