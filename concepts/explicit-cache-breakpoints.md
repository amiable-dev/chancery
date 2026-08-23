---
title: "Explicit Cache Breakpoints"
date: 2026-07-04
domain: llm
maturity: established
source_type: vendor-doc
topics: [context-engineering, cost-control]
tags: [concept, llm, api, cost-optimisation, caching, anthropic, architecture, domain/llm, maturity/established, source-type/vendor-doc, topic/context-engineering, topic/cost-control]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Explicit Cache Breakpoints

## Definition

A prompt-caching control mechanism where `cache_control` markers are placed directly on **individual content blocks** within the prompt (tools, system, or message items), giving precise control over which prefix segments get cached and at which point the cache boundary is drawn.

## Explanation

Anthropic's API allows placing `cache_control: { "type": "ephemeral" }` on any cacheable content block. When the provider processes the request, it caches everything **up to and including** that marked block — the full prefix from the start of the request to that block's position.

**Prefix ordering matters:**

The provider always processes blocks in this fixed order:
```
tools → system → messages (in order)
```

A cache breakpoint on a block caches all content from the start of the prompt to that block, following this order. This means:

- A breakpoint on the `system` block caches `tools + system`
- A breakpoint on the third message caches `tools + system + messages[0..2]`

**Example — caching a large reference document mid-conversation:**

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code reviewer.",
        },
        {
            "type": "text",
            "text": "<large_reference_doc>...",  # 50k tokens of docs
            "cache_control": {"type": "ephemeral"}  # <-- cache breakpoint here
        }
    ],
    messages=[
        {"role": "user", "content": "Review this PR..."}
    ]
)
```

Here only the system block (with the reference doc) is cached. The user message is always processed fresh.

**When to choose explicit over automatic:**

| Scenario | Recommended |
|----------|------------|
| Multi-turn chat, growing history | [[automatic-prompt-caching]] |
| Large reference doc in system, variable messages | Explicit breakpoints |
| Need to cache only tools definitions, not system | Explicit breakpoints |
| Simple agent with stable full prompt | [[automatic-prompt-caching]] |
| Want to cache multiple distinct sections separately | Explicit breakpoints |

Explicit breakpoints are the right choice when you want to cache a specific expensive section (like a large pre-loaded codebase or document) while leaving other parts intentionally uncached — giving you control over the cost/freshness trade-off at a block level.

## Key Properties

- **Block-level granularity** — cache boundary set per content block, not at request level
- **Prefix-based** — always caches from the start of the prompt to the marked block; you cannot cache a middle section without also caching everything before it
- **Fixed ordering** — cache prefix covers `tools → system → messages` in that order; block position within this ordering determines what's in scope
- **Same TTL options** — 5-minute default (1.25× write, 0.1× read) or 1-hour (2× write, 0.1× read)
- **Stable prefix requirement** — for a cache hit to occur, all content up to the breakpoint must be byte-for-byte identical across calls

## Relationships

- Counterpart to [[automatic-prompt-caching]]: more control, more annotation work
- Both modes are implementations of the broader [[prompt-caching]] pattern
- Pricing mechanics detailed in [[llm-cache-write-economics]]
- Works well with [[agent-config-files]]: large config files can be explicitly cached in the system block while messages remain dynamic

## Applications

- **Large document Q&A:** Load a 50k-token reference doc into the system prompt, mark it with a cache breakpoint; every question in the session hits the cache on that expensive document.
- **Tool-heavy agents:** Mark the tools block with a breakpoint; cache the full tool schema (which can be hundreds of tokens) across all turns.
- **RAG pre-loading:** Pre-load retrieved documents into the early part of the conversation and cache them; only new retrieval results need fresh processing.
- **Mixed fresh/stable prompts:** Cache the stable system context while always processing the dynamic user message fresh.

## Study
- Flashcards: [[flashcards/explicit-cache-breakpoints|Practice this concept]]

## Sources

- [Anthropic Prompt Caching Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — explicit cache breakpoints section; cache prefix ordering

## See Also

- [[prompt-caching]]
- [[automatic-prompt-caching]]
- [[llm-cache-write-economics]]
- [[attention-budget]]
