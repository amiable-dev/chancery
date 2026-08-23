---
title: "Context Rot"
date: 2026-04-29
domain: llm
maturity: emerging
source_type: research
topics: [context-engineering, evaluation]
tags: [concept, ai-agents, llm, context, attention, performance, domain/llm, maturity/emerging, source-type/research, topic/context-engineering, topic/evaluation]
status: draft
sources:
  - url: https://research.trychroma.com/context-rot
    hash: sha256:cd9d6d56edb0206ddd7946e8b9790771413425b7c29ded3afdffdb5b46253ecf
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Context Rot

## Definition
**Context rot** is the phenomenon where a language model's ability to accurately recall and reason over information in its context window degrades as the total token count increases. It is not a hard failure at a specific length threshold but a **performance gradient** — models remain capable at longer contexts but exhibit measurably reduced precision for information retrieval and long-range reasoning compared to their performance on shorter contexts.

## Explanation
Context rot was uncovered through needle-in-a-haystack style benchmarking: hide a specific fact ("needle") in a large document ("haystack") and ask the model to retrieve it. As haystack size grows, recall accuracy falls across all models — some degrade more gracefully than others, but none are immune.

The root cause is architectural. Transformer-based LLMs attend to every token in context, creating **n² pairwise attention relationships** for n tokens. As context grows, the model's fixed pool of attention capacity must be spread across exponentially more relationships. Important signals compete with noise for scarce attention, and the model's trained attention patterns — developed on shorter training sequences — are less specialised for very long contexts.

Techniques like **position encoding interpolation** partially address this by adapting models to longer sequences than they were trained on, but with some degradation in positional understanding. The net effect: a performance gradient, not a cliff.

### Practical implications
- A fact near the start of a long conversation may be effectively "forgotten" by turn 50
- Tool outputs deep in history consume attention budget without proportional recall value
- Relevant recent context may be crowded out by irrelevant older context
- All models are affected — but some providers (e.g., Gemini 1.5 Pro) show more graceful degradation

## Key Properties
- **Universal** — affects all transformer-based LLMs regardless of context window size
- **Gradient, not cliff** — degradation is gradual, not a sudden failure at a token limit
- **Attention-driven** — caused by the n² attention relationship scaling in transformers
- **Content-agnostic** — the model doesn't preferentially retain "important" tokens; position and attention patterns determine what survives

## Relationships
- Core motivation for [[context-engineering]]: context rot is why context curation matters
- Explained by [[attention-budget]]: the finite attention pool gets diluted across more relationships
- Mitigated by [[context-compaction]]: summarising and restarting the context window prevents rot accumulation
- Mitigated by [[just-in-time-context]]: loading data only when needed keeps context lean
- Related to [[cognitive-offloading]]: humans have analogous working memory limits; we offload to external systems

## Applications
- **Context window hygiene:** Clear old tool call results once they're no longer needed — they consume attention budget with diminishing value
- **Compaction triggers:** Monitor token count and trigger compaction before rot significantly impacts performance, not after a hard limit is hit
- **Tool result pruning:** The safest and cheapest form of compaction is clearing raw tool results from deep message history
- **Agent evaluation:** When debugging unexpected agent behaviour, check if the relevant context was present *and* recent enough to be attended to reliably

## Sources
- [Context Rot Research — Chroma](https://research.trychroma.com/context-rot) — needle-in-a-haystack benchmarking that defined the concept
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — framing of context rot as a core engineering constraint

## See Also
- [[context-engineering]]
- [[attention-budget]]
- [[context-compaction]]
- [[just-in-time-context]]
- [[durable-agent-state-machine]]: replaces conversation-history tracking with structured state, eliminating the root cause of idle-time context rot in long-running workflows
- [[long-running-agent-architecture]]: addresses context rot at the architectural level for multi-day/week agent workflows
- [[agent-config-files]]: config file quality directly affects context rot — generic boilerplate accelerates it; tight, specific rules minimise it
- [[reusable-agent-skills]]: on-demand loading of procedures keeps baseline context lean; a key mitigation for context rot
- [[subagents]]: distributing long tasks across child agents with fresh context windows is the primary architectural response to context rot
