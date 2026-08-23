---
title: "Automatic Prompt Caching"
date: 2026-07-04
domain: llm
maturity: emerging
source_type: vendor-doc
topics: [context-engineering, cost-control]
tags: [concept, llm, api, cost-optimisation, caching, anthropic, multi-turn, domain/llm, maturity/emerging, source-type/vendor-doc, topic/context-engineering, topic/cost-control]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Automatic Prompt Caching

## Definition

A prompt-caching mode where a single top-level `cache_control` field is added to the API request body; the provider automatically applies the cache breakpoint to the **last cacheable block** and advances it forward as the conversation grows. No per-block annotation is required.

## Explanation

Anthropic's prompt caching supports two modes: explicit breakpoints (per-block control) and **automatic caching** (top-level control). Automatic caching is the simpler of the two.

With automatic caching, you add one field to the request:

```json
{
  "model": "claude-opus-4-8",
  "cache_control": { "type": "ephemeral" },
  "system": "...",
  "messages": [...]
}
```

The provider handles placement: it identifies the last cacheable block in the prompt (the full prefix `tools → system → messages`) and marks that as the cache point. On the next request with the same prefix, the cached portion is reused at 10% of the normal input price.

**Why "automatic" matters for multi-turn conversations:**

In a growing conversation, the cacheable prefix expands with every turn — the full message history becomes the new prefix for the next call. With automatic mode, you don't need to update `cache_control` placements as the conversation grows. The system moves the breakpoint forward to the last block automatically, always caching as much of the stable prefix as possible.

Compare this to [[explicit-cache-breakpoints]]: with explicit mode, you must annotate specific content blocks yourself — useful when you only want to cache part of the conversation (e.g., a large system prompt but not the growing message history), but more work to maintain.

**Typical setup:**

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    cache_control={"type": "ephemeral"},   # <-- top-level, one line
    system="You are a code reviewer...",
    messages=conversation_history
)
```

Each call after the first will get a cache hit on everything that hasn't changed, without any additional application-level logic.

## Key Properties

- **Zero per-block annotation** — one field at the request level; no manual content-block markup needed
- **Auto-advancing breakpoint** — as the conversation history grows, the breakpoint moves to the new last block automatically
- **Same pricing as explicit mode** — 5-minute TTL at 1.25× write / 0.1× read; optionally 1-hour TTL at 2× write
- **Supported on all active Claude models** — no model-specific limitations
- **ZDR-compatible** — eligible for Zero Data Retention arrangements; cached prefixes not stored after response

## Relationships

- Counterpart to [[explicit-cache-breakpoints]]: same caching mechanism, different control granularity
- Both modes sit inside the broader [[prompt-caching]] concept
- Directly reduces costs described in [[llm-cache-write-economics]]: automatic mode makes those savings trivially easy to capture
- Relevant to [[agent-config-files]]: a long system prompt or config file is the ideal candidate — stable, repeated on every turn, cheap to keep cached automatically

## Applications

- **Multi-turn chat sessions:** Each turn extends the history; automatic mode caches the full history prefix each time without any code changes.
- **Agent sessions with stable system prompts:** OpenClaw, Claude Code, and similar harnesses can add a single top-level flag and immediately benefit from prefix caching across all turns.
- **Rapid prototyping:** Add `cache_control: {"type": "ephemeral"}` to your existing API calls and immediately reduce costs on any conversation that runs more than 1–2 turns.
- **LLM Council and batch pipeline calls:** When many sub-calls share the same system prompt, automatic caching captures savings without per-call annotation.

## Study
- Flashcards: [[flashcards/automatic-prompt-caching|Practice this concept]]

## Sources

- [Anthropic Prompt Caching Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — primary reference; automatic caching section

## See Also

- [[prompt-caching]]
- [[explicit-cache-breakpoints]]
- [[llm-cache-write-economics]]
- [[agent-config-files]]
