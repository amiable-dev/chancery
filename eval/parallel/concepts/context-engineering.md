---
title: Context engineering
aliases:
  - Attention budget curation
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, agents, llm, prompting, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    class: external-primary
---

# Context engineering

## Definition

**Context engineering** is the practice of treating a model's context window as a finite, depleting resource and curating, at every turn of inference rather than once at authoring time, the smallest set of high-signal tokens that will produce the behaviour you want — spanning system instructions, tool definitions, examples, retrieved data and accumulated message history alike, rather than the prompt text alone.

## Explanation

The discipline follows from one constraint rather than being a collection of tips. Self-attention lets every token attend to every other, so an input of n tokens carries on the order of n squared pairwise relationships, and training corpora contain far more short sequences than long ones, leaving models with less experience of context-wide dependency. The result is a performance gradient, not a cliff: a model stays capable at length but loses precision, so attention behaves like a budget that every added token draws down. Everything else is a consequence. System prompts should sit at the right altitude, between hardcoded if-else logic that is brittle to maintain and guidance so vague it assumes shared context the model does not have. Tool sets should be minimal and non-overlapping, on the test that if a human engineer cannot say which tool applies in a situation, an agent will not do better. Examples should be a few diverse canonical cases rather than an exhaustive catalogue of edge cases. Retrieval shifts from pre-computing everything into the prompt toward just-in-time loading, where the agent holds lightweight identifiers — file paths, stored queries, links — and pulls data through tools at runtime, which buys progressive disclosure and the metadata signal carried by names, sizes and timestamps at the cost of slower exploration and the need for good navigation tools. When a task outruns the window entirely, three levers apply: compaction, which summarises the history and reinitialises, tuned by maximising recall first and then trimming for precision, with clearing of stale tool results as its safest form; structured note-taking to files that live outside the window and are read back after a reset; and sub-agent isolation, where a subagent spends tens of thousands of tokens exploring and returns one or two thousand tokens of distillate. The source is an Anthropic engineering post, so its worked examples double as descriptions of the vendor's own products and the strength of the advice should be judged on the mechanism rather than the demonstrations.

## Key Properties

- Context is a depleting attention budget, not a container: quadratic pairwise cost means every added token dilutes the rest
- Curation is per-turn and covers prompts, tools, examples, retrieved data and history — not the prompt alone
- Right altitude: specific enough to steer, general enough not to be brittle; minimal does not mean short
- Just-in-time retrieval holds identifiers and loads through tools, trading latency for relevance and metadata signal
- Three long-horizon levers — compaction, notes persisted outside the window, and sub-agents that return summaries

## Relationships

- [[context-rot]] — is the measured phenomenon this practice exists to manage — the finding that reliability declines with input length is why context is treated as a scarce budget rather than a container to fill
- [[subagent-delegation]] — is one of its long-horizon levers, used here specifically as context isolation: the subagent's exploration never enters the coordinator's window, only its distilled result does
- [[memory-as-harness-capability]] — shares its premise from the architecture side, since what survives compaction and what gets written to durable notes are exactly the curation decisions this practice makes explicit
- [[agent-harness]] — is where these decisions are implemented — the harness owns the prompt assembly, tool set, compaction step and retrieval path that context engineering tunes

## Applications

Deciding what belongs in an agent's system prompt, tool set and retrieval path; choosing between compaction, external notes and sub-agents when a task outruns the window; diagnosing an agent whose quality decays over a long session.

## Sources

- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## See Also

- [[context-rot]]
- [[subagent-delegation]]
- [[agent-harness]]
