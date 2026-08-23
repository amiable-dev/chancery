---
title: "Just-in-Time Context"
date: 2026-04-29
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, patterns]
tags: [concept, ai-agents, llm, context, retrieval, architecture, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/patterns]
status: draft
sources:
  - url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    hash: sha256:afe8cb4270cce6ee7104903471226f908b70ad751336a80844ebe7b45832641a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.anthropic.com/research/building-effective-agents
    hash: sha256:a1f2257ff438964f64caa04bbfd0b5cc1f93f3236202a67412a5990369e3433a
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Just-in-Time Context

## Definition
**Just-in-time context** is a retrieval strategy where agents maintain lightweight references (file paths, stored queries, web links, identifiers) in context rather than pre-loading full content, then dynamically fetch data at runtime using tools only when it is needed for the current inference step.

## Explanation
The alternative approach — loading all potentially-relevant data upfront — mirrors rote memorisation: stuffing everything into working memory on the off-chance it might be needed. This is expensive in tokens, causes [[context-rot]] by adding noise, and often loads stale data.

Just-in-time context mirrors how humans actually work: we maintain *references* to information (bookmarks, file paths, database queries, URLs) and retrieve only what we need, when we need it. This is how filing systems, inboxes, and search engines work — they're indexing and retrieval systems, not memory dumps.

In practice, this means:
- An agent working on a codebase stores the *path* to a file, not the file's contents
- An agent querying a database stores the *query string*, not the result set
- An agent tracking a web resource stores the *URL*, not the page text
- When needed for the next step, the agent fetches via grep, glob, read, query, or HTTP tool

### Progressive disclosure as a consequence
Just-in-time loading naturally enables **progressive disclosure** — agents explore incrementally, each fetch yielding context that informs the next decision. File sizes, naming conventions, and timestamps provide implicit signals that help agents decide what to retrieve next without loading everything upfront.

### Trade-off: speed vs. freshness
Just-in-time retrieval is *slower* than pre-computed embedding retrieval — each fetch is a real tool call at runtime. It also requires thoughtful tooling: the agent needs the right exploration tools (grep, glob, head/tail, SQL) and heuristics for using them. The payoff is fresher data, smaller context windows, and better alignment between what's in context and what the current task actually needs.

### Hybrid strategy
The most effective agents blend upfront and just-in-time context:
- **Upfront:** Project config (AGENTS.md, CLAUDE.md), task specification, known entry points
- **On-demand:** File contents, database records, API responses, search results

Claude Code exemplifies this: CLAUDE.md files load upfront, while grep and glob enable targeted just-in-time file retrieval.

## Key Properties
- **Reference-first** — context holds identifiers, not content, until content is needed
- **Runtime-dynamic** — retrieval happens during inference, not during preprocessing
- **Tool-dependent** — requires agents to have well-designed exploration and retrieval tools
- **Freshness-preserving** — avoids stale-index problems common in pre-computed retrieval systems

## Relationships
- Core strategy within [[context-engineering]]: one of the primary ways to manage the [[attention-budget]]
- Contrasts with [[retrieval-augmented-generation]]: RAG pre-computes embeddings and retrieves before inference; JIT context retrieves *during* inference via tool calls
- Enables [[progressive-disclosure-agents|progressive disclosure]]: incremental exploration within the same context window
- Related to [[memory-as-harness]]: the harness decides which references to maintain and which tools enable retrieval
- Complements [[context-compaction]]: JIT keeps context lean; compaction handles cases where it fills despite JIT usage

## Applications
- **Coding agents:** Store file paths found via initial exploration; read file contents only when needed to write code
- **Research agents:** Store URLs and query strings; fetch documents only when the current reasoning step requires them
- **Data analysis:** Store query templates; execute against live databases rather than caching result sets in context
- **Long-running agents:** Combine JIT context with structured note-taking — notes track progress and references, tools fetch content on demand

## Study
- Flashcards: [[flashcards/just-in-time-context|Practice this concept]]

## Sources
- [Effective context engineering for AI agents — Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — primary definition and Claude Code examples
- [Building effective AI agents — Anthropic Research](https://www.anthropic.com/research/building-effective-agents) — foundational agent design patterns that JIT context builds on

## See Also
- [[context-engineering]]
- [[context-rot]]
- [[attention-budget]]
- [[context-compaction]]
- [[retrieval-augmented-generation]]
- [[memory-as-harness]]
- [[compilation-stage-knowledge-layer]] — the opposite end of the spectrum: instead of fetching at runtime (JIT), knowledge is pre-compiled into persistent artifacts before any query is issued
