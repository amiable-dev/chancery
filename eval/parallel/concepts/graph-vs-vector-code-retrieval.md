---
title: Graph vs vector retrieval for code
date: 2026-08-24
tags:
  - concept
  - llm
  - retrieval
  - code-analysis
status: draft
sources:
  - url: https://www.falkordb.com/blog/code-graph/
    hash: sha256:030278b97b8f98026960c39895d831f42c5f379ed85f9e5d86f8659a41e39c1a
    retrieved: 2026-08-24
    reachability: ok
---

# Graph vs vector retrieval for code

## Definition

The **graph-versus-vector argument for code retrieval** holds that similarity search over embedded chunks fails precisely where code understanding gets hard — multi-hop structure — while graph retrieval hands an LLM connected subgraphs whose relationships (inheritance, dependency, call paths) are stated rather than approximated.

## Explanation

Vector databases excel at finding text that resembles the query; code questions are rarely resemblance questions. Whether a change is safe depends on callers-of-callers; whether a method is dead depends on the absence of inbound edges; blast radius is a transitive closure. Embeddings approximate these relationships statistically, and retrieval returns isolated chunks that the model must re-stitch. A graph stores the relationships directly: traversals surface recursive functions, unused methods, dependency chains and highly-utilised functions as exact answers, and retrieval can return a connected subgraph so the generation step receives context whose structure is explicit. The claim is scoped, not absolute — similarity search still wins for fuzzy conceptual lookup ('where do we handle retries?'), and the source advocating the graph side is a graph-database vendor. The durable decision rule it supports: when the question is structural, retrieve structure; when it is semantic, retrieve by similarity; production systems typically need both indexes over the same corpus.

## Key Properties

- Structural code questions are multi-hop: calls, inheritance, dependency closure
- Embeddings approximate relationships; graphs state them
- Subgraph retrieval preserves structure into the LLM context; chunk retrieval discards it
- Decision rule: structural question → graph traversal; semantic question → similarity search

## Relationships

- [[code-knowledge-graph]] — presupposes that graph as the structured index this comparison retrieves from
- [[retrieval-augmented-generation]] — specialises RAG's non-parametric memory: the index is a typed graph returning connected subgraphs instead of a vector store returning chunks

## Applications

Choosing an index for a code-assistant retrieval layer; explaining failure modes of chunk-based RAG on refactoring and impact-analysis tasks.

## Sources

- https://www.falkordb.com/blog/code-graph/

## See Also

- [[code-knowledge-graph]]
- [[retrieval-augmented-generation]]
