---
title: "Prompt Caching"
date: 2026-06-23
domain: llm
maturity: established
source_type: practitioner
topics: [context-engineering, cost-control]
tags: [concept, ai-agents, performance, cost-optimisation, llm, infrastructure, domain/llm, maturity/established, source-type/practitioner, topic/context-engineering, topic/cost-control]
status: draft
sources:
  - url: https://newsletter.systemdesign.one/p/agentic-engineering
    hash: sha256:4348e1666b2fd47113aea3b3b5bceb8dfcaf370266ef152e866b36e38742d0d4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://platform.openai.com/docs/guides/prompt-caching
    hash: sha256:14d5a7335d9dc98e18da1801d399ad386f77ce0087fc85853a8b83f4d5a48361
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69
    hash: sha256:f041e2f6202d4dad79856cbe698f460cc51ae46eb6d8b13a8a4353d5a638e51e
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Prompt Caching

## Definition

A provider-side mechanism that stores the **stable prefix** of a conversation — system prompt, config files, loaded skills — so that subsequent turns in the same session do not pay the full inference cost to re-read it. The cached prefix is served at a steep per-token discount; later turns only pay full price for the new, non-cached tokens.

## Explanation

In agentic workflows without prompt caching, every tool call sends the entire conversation history — including the system prompt, project config file, and all loaded skills — to the model. For sessions with long config files or many prior turns, this re-reads thousands of tokens on every iteration, paying full inference cost each time.

Prompt caching replaces that re-reading with a cache lookup. The first call writes the prefix to the provider's cache (at a small premium); subsequent calls re-use the cached prefix at a fraction of the cost.

**The mechanism:**
1. **Write:** The first API call marks the stable prefix with a cache breakpoint. The provider processes the full prefix, computes its key-value (KV) cache, and stores it.
2. **Hit:** Subsequent calls with the same prefix are recognised as cache hits. The provider skips re-processing the cached portion, serving it directly from the KV cache.
3. **Discount:** Cache hits are typically billed at 10–20% of the normal per-token cost (provider-dependent). Latency also improves because prefix re-computation is skipped.

**The TTL problem:**  
Caches expire after a period of inactivity. Provider-typical TTLs:
- Anthropic: ~5 minutes (context-dependent; may be longer for paid tiers)
- OpenAI: variable based on tier and model
- Google: configurable TTL on "context caches"

If the session goes idle — the user steps away, reads a spec, attends a meeting — the cache can expire, forcing a full rewrite on the next call. An active session keeps the cache warm. Long gaps between turns undercut the savings.

**How this changes the economics of [[agent-config-files|config files]]:**  
Without caching, a 2000-token config file costs 2000 tokens *per agent turn*, so its size is a significant ongoing expense. With caching, it costs ~200 tokens per turn (at a 10x discount) after the first call. This makes large config files much more economical — the argument for keeping configs under 100 lines is *still valid* (because of [[context-rot]] and [[attention-budget]], not just cost), but the marginal token cost argument weakens considerably.

**What can be cached:**
- System prompts (always eligible)
- Project config files loaded at session start
- Reusable [[reusable-agent-skills|skills]] that remain loaded throughout a session
- Large reference documents or codebases injected at the start (useful for RAG pre-loading)

**What cannot be cached:**
- Dynamic content that changes per turn (tool results, user messages)
- Content inserted after the cache breakpoint

**Provider implementations:**
- **Anthropic (Claude):** Two modes — *automatic* (top-level `cache_control` field, system places breakpoint on last cacheable block) and *explicit* (per-block markers for fine-grained control). See [[automatic-prompt-caching]] and [[explicit-cache-breakpoints]] for details. Pricing: 1.25× write (5-min), 2× write (1-hour), 0.1× read. See [[llm-cache-write-economics]] for full economics.
- **OpenAI:** Automatic — the provider caches long-prompt prefixes without user intervention
- **Google Gemini:** "Context Caches" API — explicit cache creation with configurable TTL and stored file references

## Key Properties

- **Prefix-only** — only the stable, unchanged beginning of the conversation can be cached; dynamic content after the breakpoint is always recomputed
- **Provider-side** — the cache lives on the provider's infrastructure; clients have no direct control over eviction
- **TTL-limited** — caches expire; active sessions stay warm, idle sessions pay full rewrite cost on the next call
- **Latency benefit** — cache hits also reduce response latency, because prefix processing is skipped
- **Transparent** — most agentic frameworks manage caching in the background; the application doesn't need to change its logic

## Relationships

- Changes the economics of [[agent-config-files]]: cached config files cost ~10x less per turn, weakening the cost argument for brevity (but not the [[context-rot]] argument)
- Works against [[context-rot]] financially: it makes the constant context cost of always-on configuration much cheaper
- Related to [[attention-budget]]: caching reduces cost but not attention pressure — the model still attends to all cached tokens
- Related to [[reusable-agent-skills]]: skills that are loaded and kept in the session prefix are cacheable, reducing per-turn cost for skill-heavy workflows
- Related to [[agent-harness]]: harnesses that handle caching automatically (Claude Code, OpenClaw) give cost benefits without application-level changes

## Applications

- **Long-running coding sessions:** A session with a 2000-token AGENTS.md and 30 iterations without caching costs ~60,000 tokens in prefix-reading alone. With caching, that drops to ~6,000.
- **Knowledge-heavy agents:** Pre-loading a large codebase or reference document into the prompt prefix and caching it amortises the document ingestion cost across many turns.
- **Batch processing:** For batch jobs that run many sub-calls with the same system prompt, caching the system prompt dramatically reduces total cost.
- **Configuring TTL awareness:** For workflows with predictable idle gaps (e.g., a developer who takes a lunch break mid-session), choose providers/settings with longer TTLs to keep the cache warm through those gaps.

## Study
- Flashcards: [[flashcards/prompt-caching|Practice this concept]]

## Sources

- [Agentic Engineering (System Design Newsletter)](https://newsletter.systemdesign.one/p/agentic-engineering) — "Prompt Caching" section; economics explanation and TTL discussion
- [Anthropic Prompt Caching Docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — official API documentation with cache control syntax
- [OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching) — automatic caching for long prompts
- [30 Core Agentic Engineering Concepts Every Developer Should Know](https://medium.com/lets-code-future/30-core-agentic-engineering-concepts-every-developer-should-know-5066b3117f69) — prompt caching in the configuration layer taxonomy

## See Also

- [[agent-config-files]]
- [[context-rot]]
- [[attention-budget]]
- [[reusable-agent-skills]]
- [[agent-harness]]
- [[automatic-prompt-caching]] — Anthropic's simplified top-level `cache_control` mode for multi-turn conversations
- [[explicit-cache-breakpoints]] — fine-grained per-block cache control with prefix ordering (`tools → system → messages`)
- [[llm-cache-write-economics]] — pricing mechanics: 1.25× write, 0.1× read, 1-hour TTL option at 2× write
- [[managed-agent-split-plane-architecture]] — split-plane providers manage prompt caching automatically as a platform convenience
