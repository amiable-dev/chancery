---
title: "Uniform Architecture Contract"
date: 2026-07-15
domain: software-engineering
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, ai-agents, architecture, patterns, software-design, interoperability, domain/software-engineering, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://github.com/FareedKhan-dev/all-agentic-architectures
    hash: sha256:07f425aa4ca08f762dd08aefa3fe8286aff870ecee87b832d3e90b232671ea88
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Uniform Architecture Contract

## Definition
A software-design discipline for agentic-pattern libraries in which every distinct agentic architecture (Reflection, ReAct, Tree of Thoughts, MemGPT, and so on) is implemented behind the same abstract interface — a single `.run(task)` method and a single return shape (e.g. `ArchitectureResult`) — so that swapping which pattern handles a task requires swapping a class, not rewriting the calling code.

## Explanation
Agentic-pattern catalogues face a design choice: implement each pattern (Reflection, Tree of Thoughts, MemGPT, ReAct, Debate, etc.) as a bespoke script with its own inputs/outputs, or implement all of them against one shared abstract base class. The former is faster to write per-pattern but makes patterns non-comparable and non-swappable — you cannot A/B test two architectures on the same task without rewriting the harness around each one. The latter costs more up-front design effort but pays off exactly where agentic systems most need it: architecture selection is usually an empirical question ("which pattern fits *this* task?"), and empirical questions require being able to swap implementations cheaply.

**The contract, concretely (as implemented in the source library):**
- Every architecture is a subclass of a common `Architecture` abstract base class.
- Every architecture exposes the same call surface: `arch.run(task)`.
- Every architecture returns the same result shape: an `ArchitectureResult` object (holding at minimum the output and metadata about the run — e.g. iteration counts, scores, trace).
- Provider/model selection is decoupled from architecture choice entirely: swapping `LLM_PROVIDER` (Nebius, OpenAI, Anthropic, Groq, Ollama, Together, Fireworks, Mistral, Google) requires no code changes, because the LLM client is injected (`get_llm()`) rather than hardcoded per architecture.

**Concrete effect on downstream code:**
```python
from agentic_architectures import get_llm
from agentic_architectures.architectures import Reflection

arch = Reflection(llm=get_llm(), max_iterations=2, target_score=8)
result = arch.run("Write a haiku about a glacier.")
```
Swapping `Reflection` for `TreeOfThoughts` or `LATS` changes only the import and constructor arguments — the calling pattern (`arch.run(task)` → inspect `result.output`, `result.metadata`) is identical across all 35 architectures in the library, and this is what enables the library's benchmark harness to run all 35 against the same 17-task suite mechanically, without per-architecture glue code.

**Relationship to a "runnable textbook":** the same uniform contract is what lets the library ship each pattern with a fully-executed Jupyter notebook whose commentary is written against a captured real run (not synthetic examples) — because every notebook can drive its architecture through the same three lines of code, the notebook-generation and benchmark-generation tooling is itself pattern-agnostic.

## Key Properties
- **Single call surface** — `.run(task)` is identical across all implementations, regardless of internal complexity (a one-shot Reflection loop vs. a Playwright-driven BrowserAgent)
- **Single return shape** — a consistent `ArchitectureResult` means downstream code (loggers, benchmarks, comparison harnesses) is written once, not per-architecture
- **Decouples provider choice from pattern choice** — LLM provider is injected via `get_llm()`, so swapping the pattern and swapping the model backend are two entirely independent decisions
- **Enables mechanical benchmarking** — a shared contract is what makes it possible to run 35 architectures against the same task suite with one benchmark runner rather than 35 bespoke evaluation scripts
- **Trades implementation flexibility for comparability** — each architecture must fit the contract's shape even where a bespoke implementation might have been simpler, in exchange for uniform composability

## Relationships
- Enables [[thinker-worker-verifier-pattern]]-style role composition and [[orchestration-model|learned orchestration]]: a coordinator that dynamically assigns architectures to tasks (as in a Meta-Controller / router pattern) is only tractable when every candidate architecture shares one call interface — the coordinator's routing logic doesn't need per-architecture branches
- Related to [[minimal-viable-tool-set]]: both are examples of narrowing a variable interface (tools, or architectures) down to one predictable shape so the calling code (agent reasoning, or benchmark harness) doesn't need special-casing
- Related to [[task-model-fit]]: a uniform contract is what makes "try several architectures on this task type and measure which fits" a cheap, mechanical experiment rather than a rewrite exercise
- Complements the [[deterministic-picker-pattern]]: the two disciplines come from the same source library and both aim at making agentic behaviour comparable/auditable — the picker pattern standardises *how a step decides*, this pattern standardises *how a whole architecture is invoked and reported on*
- Related to [[ai-llm-gateway]] and multi-provider routing: injecting the LLM client (`get_llm()`) independently of the architecture mirrors how a gateway decouples model/provider choice from application logic

## Applications
- **Pattern-selection experiments:** When unsure which agentic architecture fits a task (ReAct vs. Planning vs. Tree of Thoughts), implement candidates behind a shared interface so a benchmark script can run all of them against the same test cases without bespoke glue per candidate.
- **Router/Meta-Controller architectures:** Building a system that dynamically picks an architecture per incoming task requires this contract — the router's dispatch logic stays simple only if every target architecture is invoked identically.
- **Comparative documentation ("runnable textbook") for internal pattern catalogues:** Adopting a uniform contract is what makes it feasible to auto-generate consistent worked-example notebooks/docs per pattern, since the harness driving each example doesn't change.
- **Cost/provider comparison harnesses:** Because provider selection is orthogonal to architecture selection under this contract, the same task can be re-run across LLM providers to compare cost/quality without touching architecture code — directly informs a provider-comparison harness for our own OpenRouter routing.

## Sources
- [All Agentic Architectures — 35 Production-Grade Patterns Library](https://github.com/FareedKhan-dev/all-agentic-architectures) — primary source; README and quickstart demonstrate the shared `Architecture` ABC, `.run(task)` contract, and `ArchitectureResult` shape across all 35 implementations.

## See Also
- [[deterministic-picker-pattern]]
- [[thinker-worker-verifier-pattern]]
- [[task-model-fit]]
- [[minimal-viable-tool-set]]
- [[ai-llm-gateway]]
