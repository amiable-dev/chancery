---
title: "LLM Cache Write Economics"
date: 2026-07-04
domain: llm
maturity: established
source_type: practitioner
topics: [cost-control, context-engineering]
tags: [concept, llm, cost-optimisation, caching, pricing, architecture, infrastructure, domain/llm, maturity/established, source-type/practitioner, topic/cost-control, topic/context-engineering]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.anthropic.com/en/about-claude/pricing
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# LLM Cache Write Economics

## Definition

The pricing model governing the cost-benefit trade-off of LLM prompt cache writes versus cache reads, including the choice between short-TTL (5-minute) and long-TTL (1-hour) cache options, and the break-even analysis for when caching is worthwhile.

## Explanation

Prompt caching introduces a three-tier pricing structure alongside base input costs:

| Token Type | Multiplier (vs base input) | Description |
|-----------|--------------------------|-------------|
| Cache write (5-min) | 1.25× | Paying to store the prefix in cache for 5 minutes |
| Cache write (1-hour) | 2.00× | Paying to store the prefix in cache for 1 hour |
| Cache read (hit) | 0.10× | Re-using a cached prefix — 90% savings |
| Base input | 1.00× | Normal, uncached input tokens |

**Concrete example (Claude Opus 4.6 at $5/MTok base):**

- 5-min cache write: $6.25/MTok
- 1-hour cache write: $10/MTok
- Cache read: $0.50/MTok

A 10,000-token system prompt costs:
- Uncached (every call): $0.05 per call
- 5-min cache write: $0.0625 (first call) → $0.005 (subsequent calls within 5 min)
- After 2 calls: total cost = $0.0625 + $0.005 = $0.0675 vs $0.10 (uncached) — **already cheaper**

**Break-even analysis:**

For the 5-minute cache:
- Extra cost to write vs uncached: 0.25P per token (25% premium)
- Savings per cache read vs uncached: 0.90P per token (90% savings)
- Break-even: 0.25 / 0.90 ≈ **0.28 extra reads** needed after the write
- In practice: **any 2-call session breaks even and saves money**

For the 1-hour cache vs 5-minute cache:
- Extra write cost: 0.75P (2× vs 1.25× base)
- Benefit: avoids a cache miss re-write (saves 1.25P) if the session would otherwise expire
- Worth it when: you have predictable idle gaps >5 minutes within the hour (meetings, reviews, async workflows)

**When 1-hour TTL is worth it:**

If your workflow has predictable pause points — a developer who steps away from the keyboard, an async agent waiting for a human review, a pipeline with queued work — the 5-min TTL may expire during those gaps, forcing a fresh write at 1.25× cost. Upgrading to the 1-hour TTL costs 2× on the write but prevents re-writes during those gaps.

Rule of thumb: **If you expect more than 1 cache expiry per hour, the 1-hour TTL pays for itself.**

**Stacking with other discounts:**

The cache pricing multipliers stack with:
- **Batch API discount** (50% reduction on input tokens): a cached batch call costs 0.10× × 0.50 = 0.05× base
- **Data residency pricing**: multipliers apply to the region-adjusted base price

**Model-specific pricing (per MTok, as of 2026-07-04):**

| Model | Base Input | 5m Write | 1h Write | Cache Read |
|-------|-----------|---------|---------|-----------|
| Claude Fable 5 / Mythos 5 | $10 | $12.50 | $20 | $1 |
| Claude Opus 4.x | $5 | $6.25 | $10 | $0.50 |
| Claude Sonnet 5 (→Aug 31) | $2 | $2.50 | $4 | $0.20 |
| Claude Sonnet 5 (Sep 1+) | $3 | $3.75 | $6 | $0.30 |
| Claude Sonnet 4.6 | $3 | $3.75 | $6 | $0.30 |
| Claude Haiku 4.5 | $1 | $1.25 | $2 | $0.10 |

> ⚠️ **Sonnet 5 pricing step-up:** Introductory pricing at $2/MTok through August 31, 2026; rises to $3/MTok on September 1. Worth planning for if running high-volume agent workloads.

## Key Properties

- **90% savings on cache reads** — the dominant economic driver; any prefix re-used more than once is cheaper with caching enabled
- **25% write premium (5-min)** — marginal cost to populate the cache; recovered on the very first re-use
- **100% write premium (1-hour)** — double the base price for extended TTL; justified by eliminating re-writes during idle gaps
- **TTL refresh is free** — cache hits refresh the TTL at no additional cost; active sessions stay warm indefinitely
- **Multipliers stack** — compose with Batch API discount for compounding savings in high-volume batch pipelines

## Relationships

- Economic foundation for [[prompt-caching]]: why caching is worth doing
- [[automatic-prompt-caching]] and [[explicit-cache-breakpoints]] are the two mechanisms to capture these savings
- Interacts with [[agent-config-files]]: large config files at $5/MTok × every turn is expensive; caching drops per-turn cost 10×
- Relevant to [[attention-budget]]: caching reduces *cost* but not the model's attention load — the full prefix is still attended to on each turn

## Applications

- **High-frequency agent loops:** An agent running 50 tool calls per session with a 5k-token system prompt saves ~$0.11 per session (Opus 4.6) — modest per session but material at scale.
- **LLM Council runs:** Multiple models reviewing the same large diff; cache the diff in the system prompt across all model calls in the council run.
- **Batch processing pipelines:** Batch API + cache reads compound to ~5× base price for the stable prefix portion.
- **Cost modelling:** When estimating API costs for a new agent or pipeline, budget cache write cost for the first call, then 0.1× base for all subsequent prefix reads.

## Study
- Flashcards: [[flashcards/llm-cache-write-economics|Practice this concept]]

## Sources

- [Anthropic Prompt Caching Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) — pricing table and TTL options
- [Anthropic Pricing Docs](https://docs.anthropic.com/en/about-claude/pricing) — full pricing with modifiers

## See Also

- [[prompt-caching]]
- [[automatic-prompt-caching]]
- [[explicit-cache-breakpoints]]
- [[agent-config-files]]
- [[attention-budget]]
