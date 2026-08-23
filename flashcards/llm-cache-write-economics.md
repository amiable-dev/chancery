---
tags: [flashcards, llm, caching, cost-optimisation, pricing, anthropic]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# LLM Cache Write Economics — Flashcards

#flashcards/llm

## Pricing Tiers <!-- kb:card:089fd5 -->
What are the three pricing tiers for Anthropic prompt caching relative to base input price?
?
- **Cache write (5-min TTL):** 1.25× base input — 25% premium to store the cache
- **Cache write (1-hour TTL):** 2.00× base input — 100% premium for extended TTL
- **Cache read (hit):** 0.10× base input — 90% savings on every hit

## Break-Even <!-- kb:card:3bce8d -->
How many cache reads does it take to break even on a 5-minute cache write?
?
Less than 1 extra read after the write. The write costs an extra 0.25P per token (vs uncached); each read saves 0.9P. Break-even at ~0.28 reads — meaning **any session with 2 or more calls breaks even and saves money**.

## 1-Hour TTL <!-- kb:card:4a3a24 -->
When is the 1-hour TTL worth paying for (vs 5-minute)?
?
When your workflow has predictable idle gaps longer than 5 minutes — a developer stepping away, async review cycles, queued pipeline work. If the 5-min cache would expire during those gaps, upgrading to 1-hour avoids a fresh write (1.25×) per expiry. Rule of thumb: if you expect more than 1 cache expiry per hour, the 1-hour TTL pays for itself.

## TTL Refresh <!-- kb:card:e51eb3 -->
Does refreshing a cache (using it again) cost anything?
?
No. Cache hits refresh the TTL at no additional cost. An actively-used cache stays warm indefinitely with only read-cost pricing.

## Compounding Discounts <!-- kb:card:018ec2 -->
How does the Batch API discount combine with cache reads?
?
The multipliers stack: a cached batch call costs 0.10× (cache read) × 0.50 (Batch API discount) = 0.05× base input — 95% savings vs uncached non-batch calls.
