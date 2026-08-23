---
tags: [flashcards, ai-llm-gateway, llm, infrastructure, cost-management]
sr-due: 2026-04-18
sr-interval: 1
sr-ease: 250
---

# AI LLM Gateway — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:d0ecb7 -->
What is an AI LLM Gateway?
?
A reverse-proxy layer sitting between AI clients/agents and LLM provider APIs. It provides: provider switching/fallback, per-user/per-team token budget enforcement, rate limiting, semantic caching, unified request logging, and cost attribution — without requiring application-level changes per capability.

## Position in stack <!-- kb:card:38e2d1 -->
Where does an AI LLM Gateway sit in an enterprise MCP architecture?
?
Between the MCP Server Portal and the LLM provider API. The portal governs tool access; the gateway governs LLM API access — they address orthogonal concerns at different points in the request flow.

## Core capabilities <!-- kb:card:d837a1 -->
What are the five core capabilities of an AI LLM Gateway?
?
1. **Provider switching** — failover between LLM providers transparently
2. **Token budget enforcement** — per-user/team limits before bills arrive
3. **Semantic caching** — return cached responses for similar prompts
4. **Unified logging** — every request logged with user, cost, tokens, latency
5. **Rate limiting** — prevent runaway agents from monopolising capacity

## Budget enforcement <!-- kb:card:f45d10 -->
How does a gateway prevent agentic workflows from generating unexpected LLM bills?
?
By tracking token consumption per user/agent/session and enforcing hard limits (reject requests), soft limits (downgrade to cheaper model), or alert-only thresholds — all at the infrastructure layer, before requests reach the LLM provider API.

## Vendor lock-in <!-- kb:card:7d3fd5 -->
How does an AI Gateway eliminate LLM vendor lock-in?
?
All AI clients target the gateway's single endpoint. The gateway normalises requests and routes them to the configured provider. Switching providers or adding fallback providers is a gateway configuration change — no application code changes required.

## Relationship to observability <!-- kb:card:c1795c -->
How does an AI Gateway relate to LLM observability?
?
The gateway is a primary *source* of LLM observability signals (token counts, cost, latency, prompt/completion logs) as a side-effect of proxying all traffic — no per-application instrumentation required. Teams get observability for free by routing through the gateway.

## Caching benefit <!-- kb:card:955a32 -->
What types of workloads benefit most from gateway-level semantic caching?
?
Deterministic, repeated tasks with similar inputs: sentiment classification, entity extraction, content moderation, FAQ answering. When inputs are semantically similar, cached responses return instantly at zero LLM cost.
