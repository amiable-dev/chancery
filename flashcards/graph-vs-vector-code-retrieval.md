---
tags: [flashcards, llm, retrieval, code-analysis, domain/llm, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Graph vs vector retrieval for code — Flashcards

#flashcards/llm

## Definition <!-- kb:card:2ec2ce -->
What does the graph-versus-vector argument for code retrieval claim about where similarity search fails?
?
Similarity search over embedded chunks fails precisely at multi-hop structure (inheritance, dependency, call paths), while graph retrieval hands an LLM connected subgraphs whose relationships are stated rather than approximated.

## Why embeddings struggle with structure <!-- kb:card:49f3d2 -->
Why do code questions like 'is this change safe' or 'is this method dead' resist vector similarity search?
?
They depend on transitive relationships — callers-of-callers, absence of inbound edges, transitive closure — which embeddings only approximate statistically, and retrieval returns isolated chunks the model must re-stitch.

## What graph retrieval returns instead <!-- kb:card:7b7b10 -->
What does graph retrieval return that chunk-based vector retrieval cannot, for structural code questions?
?
A connected subgraph, so traversals surface recursive functions, unused methods, dependency chains and highly-used functions as exact answers rather than statistical approximations.

## Scope of the claim <!-- kb:card:c73ad0 -->
Where does similarity search still win over graph retrieval for code, according to this argument?
?
For fuzzy conceptual lookup, such as 'where do we handle retries?' — semantic questions rather than structural ones.

## The decision rule <!-- kb:card:172378 -->
What is the decision rule this argument supports for choosing between graph and vector retrieval?
?
Structural question, retrieve by graph traversal; semantic question, retrieve by similarity search. Production systems typically need both indexes over the same corpus.
