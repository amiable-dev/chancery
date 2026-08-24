---
tags: [flashcards, llm, knowledge-graph, interfaces, domain/llm, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Natural-language-to-Cypher querying — Flashcards

#flashcards/llm

## Definition <!-- kb:card:becd58 -->
What is natural-language-to-Cypher querying?
?
A pattern where an LLM, given graph context retrieved for a user's plain-language question, generates a precise Cypher query plus a human-readable explanation — making a graph's exactness available without anyone learning the query language.

## Two-step pipeline <!-- kb:card:ae859d -->
What are the two steps of the natural-language-to-Cypher pipeline?
?
First retrieve the graph elements (nodes, edges, schema fragments) relevant to the question; then have the model generate a Cypher query against that retrieved context, plus an explanation of what it does.

## Division of labor <!-- kb:card:bf9b4c -->
In natural-language-to-Cypher, what determines correctness — the LLM or the graph engine — and why does that matter?
?
The graph engine computes the answer via deterministic traversal; the LLM only translates intent into a query. Correctness rests on the traversal, not on the model's recall of the underlying data.

## Inspectable artifact <!-- kb:card:bc43f0 -->
Why are natural-language-to-Cypher generated queries considered safer to trust than a model's direct generated answer would be?
?
The generated query is an inspectable, auditable artifact that can be checked before it runs — unlike a model's answer, which must simply be trusted.

## Generalization <!-- kb:card:9eb68c -->
Does natural-language-to-Cypher only apply to code graphs?
?
No — the pattern generalizes to any structured store with a query language; code graphs are just where the source demonstrates it.
