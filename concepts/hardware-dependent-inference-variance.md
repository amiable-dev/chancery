---
title: "Hardware-Dependent Inference Variance"
date: 2026-07-13
domain: llm
maturity: emerging
source_type: practitioner
topics: [evaluation]
tags: [concept, ai-agents, local-models, evaluation, reproducibility, llm, domain/llm, maturity/emerging, source-type/practitioner, topic/evaluation]
status: draft
sources:
  - url: https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html
    hash: sha256:2db275abc283e503ae8f6c36a7cd7940e6d479557c8be60e84585884b9f27d71
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Hardware-Dependent Inference Variance

## Definition
**Hardware-dependent inference variance** is the empirical finding that running an identical model, at identical quantization and settings, against the identical task can produce meaningfully different *output quality* — not just different latency — depending on the underlying hardware it runs on. It is distinguished from ordinary sampling non-determinism because the variable is the machine, not the random seed or prompt.

## Explanation
The intuitive assumption when running a local model is that hardware differences should only affect *speed*: a faster chip or more RAM makes the model respond quicker, but the model weights are the model weights, so quality should be constant across machines. This assumption was directly contradicted in a controlled comparison.

**The observed case:** The same task, same model (Qwen 35B MoE, 4-bit quantization), same settings, run through the same automated evaluation harness, was tested on two machines:
- On a 48GB RAM M3 Max, the task failed 5 out of 7 runs.
- On a 64GB RAM M5 Pro, the same task failed only 1 out of *n* runs.

The author explicitly flags this as unexplained ("this remains a mystery to me") and frames it as a serious reproducibility warning for anyone evaluating local models: a result obtained on one machine may not transfer to another, even with every visible variable held constant. Available RAM headroom is one plausible contributing factor (a 4-bit 35B model is described elsewhere as "stretching" 48GB, requiring other applications to be closed) — but the article does not confirm memory pressure as the mechanism, only notes the correlation.

**Why this matters beyond curiosity:** Most evaluation methodology (and most of the [[genai-eval-envelope]] framing) assumes that a test result generalises across deployment environments, modulo latency. Hardware-dependent inference variance breaks that assumption specifically for local/self-hosted models running near their resource ceiling — a regime cloud-hosted large models don't typically operate in, since cloud infrastructure is provisioned with headroom and doesn't get shared with the developer's other running applications.

This is a distinct failure mode from the well-known manual-vs-automated eval disagreement (also observed in the same source: Gemma 4 26B looked best in manual testing but failed automated evals 3/3, while Qwen3 35B MoE succeeded 2/2) — that disagreement is about *evaluation method*, while hardware-dependent inference variance is about *evaluation environment*, holding model, task, and method constant.

## Key Properties
- **Quality variance, not just latency variance** — the standard expectation (same weights → same quality, different speed) is violated
- **Correlates with resource headroom** — observed most starkly when a model is sized close to a machine's RAM ceiling, though the article stops short of confirming causation
- **Undermines eval portability** — a benchmark result from one machine cannot be assumed to hold on another, even with identical model/settings/task
- **Orthogonal to sampling non-determinism** — this is variance across *hardware*, in addition to (not instead of) the ordinary run-to-run non-determinism LLMs already exhibit
- **More acute for local/self-hosted models** — cloud-served large models are provisioned with headroom precisely to avoid this class of resource-pressure effect

## Relationships
- Complicates the [[local-model-viability-funnel]]: a model's "does it run at reasonable speed / does it build correct code" gates may pass or fail differently depending on which machine ran the test — the funnel result is machine-specific unless explicitly re-validated
- Contrasts with [[deterministic-grounding]]: deterministic grounding is about achieving reproducible, traceable *retrieval* results; hardware-dependent inference variance is a reproducibility failure at the *inference* layer that no amount of grounding fixes
- Reinforces the aggregate/statistical measurement stance of [[genai-eval-envelope]]: because quality is not even reproducible across hardware, single-run pass/fail judgments are especially unreliable for local models — aggregated, confidence-bounded measurement (many runs, ideally across environments) is the more defensible approach
- Related to [[multi-agent-revalidation]]: re-running a result through a second pass is a partial mitigation, but this concept suggests the second pass should ideally happen on different hardware, not just a different agent invocation

## Applications
- **Local model evaluation reporting:** Document the exact hardware (chip, RAM) alongside any local-model benchmark result — a result is only valid for that machine profile, not the model in general, until cross-hardware validation is done
- **Local model deployment decisions:** Before committing a workflow to a local model near its RAM ceiling, test on the actual target hardware rather than trusting benchmarks gathered on a more spacious dev machine
- **Eval infrastructure design:** If building an automated local-model eval harness, consider running the suite across more than one hardware profile before drawing conclusions about a model's viability
- **Root-causing "flaky" local agent behaviour:** When a local-model-powered agent behaves inconsistently in production versus in testing, hardware/resource headroom differences are a candidate explanation worth ruling out before blaming the model or prompt

## Sources
- [Experiences with local models for coding](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html) — Birgitta Böckeler, Thoughtworks, martinfowler.com. Reports the 5/7 vs 1/n failure-rate discrepancy between an M3 Max (48GB) and M5 Pro (64GB) running the identical automated eval.

## See Also
- [[local-model-viability-funnel]]
- [[genai-eval-envelope]]
- [[deterministic-grounding]]
- [[multi-agent-revalidation]]
