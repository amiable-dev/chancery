---
tags: [flashcards, retrieval, graphs, cognitive-science, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Spreading activation — Flashcards

#flashcards/retrieval

## Spreading activation: definition <!-- kb:card:611d0d -->
What is the basic mechanism of spreading activation?
?
Source (seed) nodes are labeled with initial activation weights that propagate iteratively along links to neighbours, decaying as they spread, until a termination condition is reached.

## Origin <!-- kb:card:9129f9 -->
Where does spreading activation originate as a model, and who proposed it?
?
Cognitive psychology, as a model of semantic memory, proposed by Collins & Loftus; later applied to information retrieval over document-term networks.

## Termination conditions <!-- kb:card:04bc80 -->
What three conditions can terminate a spreading-activation propagation?
?
A threshold, a hop bound, or independently propagating paths converging on the same node.

## Marker passing and convergence <!-- kb:card:c895a0 -->
What does it mean when activation paths from distinct seeds converge on the same node?
?
With discrete weights this is called marker passing, and the convergence itself is a relevance signal — the met node relates to multiple seeds.

## Explainability <!-- kb:card:ed6006 -->
Why is spreading activation naturally explainable compared to fixed-point ranking methods like PageRank?
?
A node's final activation fully decomposes into the explicit paths that delivered it, and its parameters (weights, decay, thresholds, hop bounds) are declared data rather than emergent properties.

## Cost scaling <!-- kb:card:017cc5 -->
How does spreading activation's computational cost scale, compared to global methods like PageRank?
?
It is bounded and local — cost scales with the traversed neighbourhood, not with the size of the whole graph.
