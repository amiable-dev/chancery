---
title: "Task-Model Fit"
date: 2026-07-13
domain: llm
maturity: emerging
source_type: practitioner
topics: [agentic-coding, cost-control]
tags: [concept, ai-agents, local-models, agentic-coding, orchestration, llm, domain/llm, maturity/emerging, source-type/practitioner, topic/agentic-coding, topic/cost-control]
status: draft
sources:
  - url: https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html
    hash: sha256:2db275abc283e503ae8f6c36a7cd7940e6d479557c8be60e84585884b9f27d71
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Task-Model Fit

## Definition
**Task-model fit** is the principle that the viability of delegating a task to a smaller, cheaper, or locally-run model is determined primarily by *characteristics of the task* — its reasoning complexity, the number of files/amount of context it requires, and how precisely it can be specified — rather than by model choice alone. A weak model matched to a well-fitted task can outperform the same model on a poorly-fitted one, independent of raw capability differences between models.

## Explanation
When comparing small/local models against large cloud models, it's tempting to frame the question purely as "how capable is this model?" In practice, the choice of *task* is one of the biggest determinants of whether any given model succeeds — sometimes bigger than the choice of model itself. Three task properties drive fit:

- **Reasoning complexity** — how much genuine problem-solving (as opposed to pattern application) does the task require? Small models degrade sharply on tasks requiring multi-step logical reasoning (e.g. cumulative percentage calculations on a chart's x-axis, or building game logic from scratch).
- **Context breadth** — how many files must the agent read and/or write, and how large are they? More files and larger files mean more tool calling, more context window consumption, and more pressure on RAM — all before the "real" task even begins.
- **Specification precision** — how exactly can the task be described? Big cloud models tolerate vague, high-level instructions because they can infer intent and fill gaps competently. Small/local models cannot: they need the prompt to point at exact files and be far more explicit, closer to how developers had to prompt models circa 2024.

**The observed sweet spot** for small local models: bash/Python scripts, small well-defined changes to existing code, and additive content changes ("often ok"). The failure zone: building something from scratch with non-trivial logic ("fell apart"). One tested model (Qwen Coder Next 80B MoE) was capable enough to solve a task correctly, but crashed on a follow-up message — illustrating that raw one-shot capability and task-fit-over-a-session are different axes.

**Task-model fit and orchestration:** This principle underlies a common orchestration pattern — plan with a large, capable model, then delegate the well-defined execution step to a smaller/cheaper/local model. The pattern only works when the delegated sub-task has been shrunk down to something with good task-model fit for the weaker model: small, well-defined, pre-planned. When a "build a game from scratch" task was planned by a strong model (Claude Sonnet) and handed to a local model for execution, it started well but fell apart once the logic got complex — the delegation broke down exactly where task-model fit failed, not where the plan was wrong.

**A secondary observation:** tech stack matters within task-model fit too — the same author found Python/Bash tasks more reliably successful with a local model than JavaScript/TypeScript tasks, though the sample was too small to generalise confidently.

## Key Properties
- **Task-first, not model-first** — asks "is this task well-suited to a weak model?" before asking "is this model good enough?"
- **Three primary drivers** — reasoning complexity, context/file breadth, specification precision
- **Session-length sensitive** — a task can be well-fitted for a single turn but poorly-fitted once conversation/context grows (see the funnel's "continued conversation" gate in [[local-model-viability-funnel]])
- **Enables cost-effective delegation** — the "plan big, execute small" orchestration pattern is only viable within the task-model fit envelope of the executing model
- **Degrades gracefully then catastrophically** — small models can partially succeed on borderline tasks (getting most of a feature right) then fail completely once complexity crosses a threshold, rather than failing proportionally

## Relationships
- Gates progress through the [[local-model-viability-funnel]]: a model only reaches the funnel's later, harder stages (complex task handling, code quality) if the task presented has been shrunk to fit the model
- Distinct from [[weak-to-strong-supervision]]: that concept is about a weak model *training* a strong one; task-model fit is about matching a weak model to *appropriately-scoped runtime tasks*, with no training involved
- Related to [[thinker-worker-verifier-pattern]] and the "plan with a strong model, execute with a weak one" pattern: task-model fit is the condition that determines whether the Worker role can be safely assigned to a weaker/local model
- Related to [[show-dont-tell-prompting]] and [[prompt-altitude]]: both concern how much explicit guidance a model needs; task-model fit adds that this need is *inversely correlated with model capability* — weaker models need lower-altitude, more explicit prompts, closer to "point at the exact file" than "make it feel right"
- Complements [[minimal-viable-tool-set]]: reducing the tools/context an agent must reason over is one lever for improving task-model fit for a given model
- Enabled by [[uniform-architecture-contract]]: when candidate architectures share one call interface, testing which pattern best fits a given model/task combination is a cheap swap-and-measure experiment rather than a rewrite
- Related to [[llm-as-strategy-engine]]: whether an LLM reliably outperforms a rule/ML engine at generating live decisions (e.g. trading signals) from noisy multi-factor data is itself a task-model-fit question

## Applications
- **Local/edge model deployment:** Before assigning any recurring workflow to a local model, evaluate the task against the three fit criteria (complexity, context breadth, specification precision) rather than solely benchmarking the model in the abstract
- **Cost-tiered agent orchestration:** When designing a pipeline that mixes an expensive planning model with a cheap execution model, invest planning effort in *shrinking* the execution sub-task until it clears task-model fit for the cheaper model, not just in writing a good plan
- **Harness and skill design:** Skills/harness tooling that narrows an agent's effective scope (pointing at specific files, reducing tool surface) is a practical way to manufacture better task-model fit for a given model, independent of model upgrades

## Sources
- [Experiences with local models for coding](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html) — Birgitta Böckeler, Thoughtworks, martinfowler.com. Reports task choice as "one of the biggest factors that determines viability of small, locally run models."

## See Also
- [[local-model-viability-funnel]]
- [[weak-to-strong-supervision]]
- [[thinker-worker-verifier-pattern]]
- [[show-dont-tell-prompting]]
- [[prompt-altitude]]
- [[minimal-viable-tool-set]]
- [[uniform-architecture-contract]]
- [[llm-as-strategy-engine]]
