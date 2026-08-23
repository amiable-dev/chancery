---
title: "Attention Budget"
date: 2026-04-29
domain: llm
maturity: established
source_type: practitioner
topics: [context-engineering]
tags: [concept, ai-agents, llm, transformers, architecture, context, domain/llm, maturity/established, source-type/practitioner, topic/context-engineering]
status: draft
sources:
  - url: https://arxiv.org/abs/1706.03762
    hash: sha256:4a2f60095ef3b5ffb5b2bdb13941331531d8a7ca3d61dede0fad24920dacfec7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://journals.sagepub.com/doi/abs/10.1177/0963721409359277
    unreachable: true
    reason: HTTP 403
    checked: 2026-08-21
    class: unclassified
    reachability: blocked-4xx
---

# Attention Budget

## Definition
**Attention budget** is the finite capacity of a transformer-based LLM to form meaningful pairwise relationships between tokens in its context window. Because transformer self-attention scales as O(n²) with sequence length, each additional token depletes this budget by requiring n additional pairwise computations across all existing tokens — making attention a scarce resource that must be allocated carefully.

## Explanation
The transformer architecture enables every token to attend to every other token in context. For n tokens, this creates n² pairwise attention relationships. This is the source of the model's power — rich cross-token dependencies — but also its fundamental scaling constraint.

Think of it like human working memory. Humans don't memorise entire reference books; we use filing systems, indexes, and external retrieval because working memory is limited. LLMs have an analogous constraint: at some point, adding more tokens doesn't add more useful signal — it just spreads attention capacity thinner, causing useful signals to compete with noise.

### What depletes the budget fastest
- **Redundant tool outputs:** Large JSON blobs, full file contents loaded when only excerpts were needed
- **Stale message history:** Old turn-by-turn dialogue that's no longer relevant to the current subtask
- **Overlapping context:** The same information loaded in multiple forms (e.g., a file both in the system prompt and message history)
- **Long examples:** Few-shot examples that are more verbose than necessary

### What preserves it
- **Tool result clearing:** Dropping raw outputs from deep history once their value is extracted
- **Compaction:** Summarising conversation history before the budget is exhausted
- **Just-in-time retrieval:** Loading data on-demand rather than pre-loading everything
- **Lightweight references:** Keeping file paths, query strings, and identifiers in context rather than full content

## Key Properties
- **Finite and non-renewable** — adding tokens always costs attention capacity; there's no way to add context without cost
- **n² scaling** — the cost of each new token scales linearly with existing context length, not as a flat rate
- **Trained distribution bias** — models develop attention patterns on shorter sequences during training; very long contexts may have less specialised attention behaviour
- **Degradation, not cutoff** — budget exhaustion causes gradual performance degradation, not a hard error

## Relationships
- Root cause of [[context-rot]]: as budget thins, recall accuracy decreases
- Core constraint in [[context-engineering]]: all context engineering strategies are ultimately about managing the attention budget
- Mitigated by [[context-compaction]]: summaries spend far fewer attention tokens than the originals
- Mitigated by [[just-in-time-context]]: deferred loading avoids pre-spending budget on unused context
- Related to [[cognitive-offloading]]: the human analogue — we externalise to filing systems because working memory is limited

## Applications
- **Token accounting:** Instrument your agent to track approximate context size and alert when approaching degradation zones (typically 60-80% of the context window)
- **Tool result lifecycle:** Design tool outputs to be minimal by default; let the agent request more detail if needed
- **History pruning strategies:** Build compaction or summarisation triggers before the budget is critically low
- **System prompt hygiene:** Audit system prompts for redundancy, outdated sections, or verbose examples that could be compressed

## Study
- Flashcards: [[flashcards/attention-budget|Practice this concept]]

## Sources
- [Attention Is All You Need — Vaswani et al.](https://arxiv.org/abs/1706.03762) — the original transformer paper establishing the n² attention architecture
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — application of attention budget to agent context management
- [Working memory capacity — Cognitive Psychology literature](https://journals.sagepub.com/doi/abs/10.1177/0963721409359277) — human working memory as the analogue motivating the concept

## See Also
- [[context-rot]]
- [[context-engineering]]
- [[prompt-caching]] — reduces cost but not attention load; cached tokens are still attended to
- [[llm-cache-write-economics]] — pricing mechanics for caching those attention-consuming prefixes
- [[context-compaction]]
- [[just-in-time-context]]
- [[cognitive-offloading]]
- [[agent-budget-caps]]: a practical enforcement mechanism for attention budget limits — agents are halted when token budgets are exhausted
- [[prompt-altitude]]: system prompt quality is a primary attention budget lever; poorly calibrated prompts waste budget on noise
- [[progressive-disclosure-agents]]: a core strategy for managing attention budget by loading context only when needed
- [[reusable-agent-skills]]: skills consume attention budget only during the turns they are loaded
- [[minimal-viable-tool-set]]: reducing the tool set is a direct lever on per-turn attention budget consumption
