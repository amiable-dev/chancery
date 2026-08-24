---
title: Spreading activation
date: 2026-08-24
domain: llm
maturity: established
source_type: research
tags: [concept, retrieval, graphs, cognitive-science, domain/llm, maturity/established, source-type/research]
status: draft
sources:
  - url: https://en.wikipedia.org/wiki/Spreading_activation
    hash: sha256:68fc945b83abc8f64922e06c00c3f9f30347b122b27728877283ff339e262ada
    retrieved: 2026-08-24
    class: external-secondary
    reachability: ok
---

# Spreading activation

## Definition

**Spreading activation** is the associative-network search method in which source nodes are labeled with initial activation weights that then propagate iteratively along links to neighbours, decaying as they spread, until termination — originally a cognitive-psychology model of semantic memory (Collins & Loftus), later applied to information retrieval over document-term networks.

## Explanation

The mechanism is a bounded, local alternative to global graph ranking: activation originates at seeds, each propagation step passes decayed weight across links, and the process terminates by threshold, hop bound, or when independently propagating paths converge on the same node (with discrete weights this is marker passing, and path convergence itself is a signal — the met node relates to multiple seeds). Everything is inspectable: a node's final activation decomposes into the paths that delivered it, which makes the method naturally explainable where fixed-point methods are not. Its parameters — initial weights, per-link decay, firing thresholds, hop bounds — are declared data rather than emergent properties, and with a fixed traversal order the computation is exactly reproducible. The cognitive-psychology origin is not decoration: the method models how related concepts prime each other in memory, which is the same intuition a curated concept graph encodes deliberately in its typed links.

## Key Properties

- Seeds → iterative decayed propagation → threshold/convergence termination
- Path convergence from distinct seeds is itself a relevance signal (marker passing)
- Fully decomposable: every activation traces to explicit paths
- Parameters (weights, decay, thresholds, bounds) are declared, not emergent
- Bounded and local — cost scales with the traversed neighbourhood, not the graph

## Relationships

- [[pagerank]] — trades that method's global stationary distribution for bounded local propagation — converging behaviour at aggressive damping, but with retained paths and declared parameters
- [[associative-trail]] — mechanizes the associative traversal that concept describes as a human practice — activation follows the trails

## Applications

Seed-based ranking over typed concept graphs where explainability is a requirement; a bake-off candidate for graph-stage retrieval with every parameter reviewable as data.

## Sources

- https://en.wikipedia.org/wiki/Spreading_activation

## See Also

- [[pagerank]]
- [[associative-trail]]
