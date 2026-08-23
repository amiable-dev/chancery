---
title: "Retrieval Composition Engine"
date: 2026-08-01
domain: llm
maturity: emerging
source_type: practitioner
topics: [rag, orchestration]
tags: [concept, ai-agents, architecture, rag, retrieval, observability, domain/llm, maturity/emerging, source-type/practitioner, topic/rag, topic/orchestration]
status: draft
sources:
  - url: https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/
    hash: sha256:b20520de2900c93455d4757c6d6ed3ab57f2a8351623246c60ee9dbfe22da7ef
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Retrieval Composition Engine

## Definition
A **retrieval composition engine** runs retrieval as a dynamic graph of strategies, each guarded by a firing predicate ("run when entity phrases exist and no warehouse candidates do"), rather than as a single fixed pipeline. The graph's shape emerges per query — different queries trigger different subsets of strategies — and the executed graph is logged as a diagram on every run, turning "why didn't it know about X?" from archaeology into a five-minute trace read.

## Explanation
A fixed RAG pipeline (embed query → vector search → rerank → generate) treats every query identically, but real queries have very different retrieval needs: a query naming a specific table (`dim_customers_v3`) needs lexical search, not semantic similarity; a query about "our biggest customer last quarter" needs warehouse-aware SQL-shaped retrieval; a query mentioning a named entity needs entity resolution before anything else runs.

Rather than hand-coding branches for every combination, a composition engine expresses each retrieval strategy as a node with a firing predicate. At query time, the engine evaluates which predicates match and executes only the matching subgraph — the graph's shape (which nodes ran, in what order, feeding what into what) *emerges* from the query rather than being pre-declared for that query type.

This has a critical operational payoff: because the executed graph is a runtime artifact (which nodes fired, what each retrieved, what got dropped), it can be logged as a diagram for every single query. When a user asks "why didn't it know about the Q3 numbers," debugging stops being a search through logs and code paths and becomes reading one diagram: which strategies fired, what each one found, and where the composition step decided the item didn't make the cut.

The engine also decides *when to call an LLM at all* — a cheap, deterministic decision at each stage based on candidate count. A handful of candidates gets fetched wholesale (no ranking needed); hundreds get a cheap LLM relevance filter; thousands get vector search plus a reranker first. This count-based routing keeps the expensive LLM call reserved for the cases that actually need judgment.

## Key Properties
- **Per-query emergent shape** — the executed subgraph is not fixed per query type; it is determined by which firing predicates match at runtime
- **Firing predicates, not hard-coded branches** — new retrieval strategies are added as new predicate-gated nodes, not as new if/else branches in a monolithic pipeline
- **Self-documenting via execution trace** — the graph that actually ran on a given query is loggable as a diagram, making retrieval failures directly debuggable
- **Count-gated LLM usage** — the decision to invoke an LLM (vs. deterministic fetch, vs. vector search + reranker) is itself a function of candidate volume at each stage
- **Composes with a scope filter**: retrieval strategies operate inside an authoritative filter clause compiled once from the query's *skill* (permission + purpose scope), not as an afterthought check

## Relationships
- Composes [[context-layer-architecture]]: this is the "retrieval" pillar of a context layer — composition, not a single pipeline
- Extends [[retrieval-augmented-generation]]: RAG's "Agentic RAG" variant lets an agent decide *when* to retrieve; a composition engine generalizes this to *which combination of strategies* fires per query, evaluated by predicates rather than agent judgment alone
- Related to [[hybrid-search-reciprocal-rank-fusion]]: RRF merges multiple result sets into one ranking; a composition engine is the layer above that decides *which* retrieval streams should even run for a given query, of which RRF-fused hybrid search may be one node
- Related to [[tapes-agent-observability]] and [[ai-agent-activity-streaming]]: logging the executed retrieval graph as a diagram is the same instinct as tracing agent execution — make the runtime decision path inspectable, not just the final output

## Applications
- **Debugging "why didn't it retrieve X" complaints**: with an execution-graph log, this becomes reading which nodes fired and what they returned, rather than re-running the query with debug logging added after the fact
- **Cost control at scale**: count-gated LLM invocation keeps relevance filtering cheap for small candidate sets and reserves expensive reranking for genuinely ambiguous large sets
- **Adding a new retrieval strategy without touching existing ones**: because strategies are predicate-gated nodes, a new source type or query pattern gets a new node rather than a new branch threaded through an existing pipeline

## Sources
- [How to Build a Context Layer and a Company Brain — Towards Data Science](https://towardsdatascience.com/how-to-build-a-context-layer-and-a-company-brain/) — Tomer Mesika; described in the retrieval section as "a composition engine, not a pipeline"

## See Also
- [[context-layer-architecture]]
- [[retrieval-augmented-generation]]
- [[hybrid-search-reciprocal-rank-fusion]]
- [[datamap-pattern]]
