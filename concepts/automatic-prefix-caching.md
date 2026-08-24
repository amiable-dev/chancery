---
title: Automatic prefix caching (RadixAttention)
date: 2026-08-24
domain: llm
maturity: established
source_type: research
topics: [cost-control]
tags: [concept, llm-inference, caching, performance, domain/llm, maturity/established, source-type/research, topic/cost-control]
status: draft
sources:
  - url: https://arxiv.org/html/2312.07104v2
    hash: sha256:96d7b2c47d0d9289efb9b0556028509ccfddc44e9492badb8ffb57c737ab67c6
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Automatic prefix caching (RadixAttention)

## Definition

Automatic prefix caching is a KV-cache reuse technique in which an LLM serving system indexes cached key-value tensors by the token sequence that produced them — typically using a radix tree — so that any new request sharing a literal prefix with a previously served request can skip recomputing that shared portion and reuse its cached attention state directly. Because reuse is triggered purely by matching token sequences rather than by any request-level session identifier, the technique works transparently across unrelated requests and multi-call programs, and its benefit is maximized when the prompts an application sends actually share long literal prefixes — a property of how the calling application orders and assembles its prompts, not something the cache can create on its own.

## Explanation

SGLang's RadixAttention implementation organizes the KV cache as a radix tree keyed by token-id sequences: each tree node holds the cached tensors for one shared prefix segment, insertion extends or branches the tree as new sequences arrive, and eviction uses an LRU-like policy over tree nodes so frequently reused prefixes — a system prompt or a set of few-shot examples shared across many calls — stay resident while unique suffixes are reclaimed first. This is the general mechanism underneath what most inference providers expose to callers as 'prompt caching': a cache hit requires an exact token-level prefix match, so it is broken by anything that changes upstream of the point where two prompts diverge — reordering a field, changing a value embedded near the top of the prompt, or inserting per-request content before shared content all invalidate the match for everything after that point. The practical corollary, independent of any one vendor's API, is to place stable, request-invariant content (system instructions, tool definitions, few-shot examples, retrieved-but-unchanging context) at the front of a prompt and push per-request variable content (the current user message, live retrieval results, conversation deltas) to the end, so the shared prefix stays as long as possible across calls.

## Key Properties

- Cache hits require an exact token-level prefix match, not semantic similarity
- A radix tree indexes cache entries by token sequence, enabling reuse across unrelated requests rather than only within one session
- Eviction is typically LRU-like over tree nodes, so infrequently reused branches are reclaimed first
- Any change upstream of a divergence point invalidates the cached match for everything after it in that prompt

## Relationships

- _No relationships recorded yet._
- [[context-engineering]] — this note's own guidance to order unchanging content before per-request content is a direct application of the token-curation discipline described here.
- [[agent-instruction-layering]] — the always-on layer described here, being identical across turns and requests, is precisely the stable literal prefix this technique indexes and reuses.
- [[agent-state-residence]] — the state-location choice described here determines whether the bytes reaching the inference server stay byte-identical across turns, the precondition this technique's cache hits depend on.

## Applications

Ordering the messages, system instructions and tool schemas an LLM-serving application sends so unchanging content precedes per-request content, to maximize prefix-cache hit rate and cut latency and cost in high-volume chat, agent and retrieval-augmented deployments; and designing or evaluating an inference server's own KV-cache eviction policy to keep high-reuse prefixes resident.

## Sources

- https://arxiv.org/html/2312.07104v2

## See Also

- _None yet._
