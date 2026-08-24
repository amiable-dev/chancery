---
title: PageRank
date: 2026-08-24
domain: llm
maturity: established
source_type: research
tags: [concept, ranking, graphs, algorithms, domain/llm, maturity/established, source-type/research]
status: draft
sources:
  - url: https://en.wikipedia.org/wiki/PageRank
---

# PageRank

## Definition

**PageRank** is the link-analysis algorithm (Page and Brin; Google's founding ranker, patents now expired) that scores a node's importance as the stationary probability of a random surfer who follows out-links with damping probability d and teleports uniformly otherwise — so a page is important in proportion to being linked from important pages.

## Explanation

The recursion is the idea: importance flows along links, divided among a node's out-links, damped (canonically d≈0.85) so the walk restarts often enough to converge, computed by power iteration to a fixed point. Two structural properties matter to anyone importing it. Out-degree division means a node's endorsement is split among everything it links — many out-links dilute each one — and total score mass is conserved, so ranking is zero-sum across the graph. The **personalized/topic-sensitive variants** replace uniform teleportation with a preference distribution over seed nodes, turning global importance into importance-relative-to-the-seeds — the form retrieval systems use. Its manipulation history (link farms, PageRank sculpting) is the world's longest-running lesson in metric gaming: any score computed from a graph invites manufacturing the graph. The damping factor doubles as an expected walk length (≈1/(1−d) hops), which on small graphs can exceed the diameter — the walk then mixes toward global structure and the seeds stop mattering.

## Key Properties

- Recursive importance with damping d; power-iteration to a stationary distribution
- Out-degree division: endorsement splits across a node's out-links
- Personalized variant: teleport to seeds instead of uniformly — importance relative to a query
- Expected walk length ≈ 1/(1−d) — long walks wash out seeds on small graphs
- Two decades of documented gaming (link farms) — graph-derived scores invite graph manufacture

## Relationships

- [[goodhart-variants]] — supplies the canonical worked example of that taxonomy at web scale — the score became the target and the link graph was manufactured to it
- [[spreading-activation]] — reaches similar seed-relative rankings by bounded decaying propagation instead of a stationary distribution — the two ends of the graph-rank design space

## Applications

Ranking any linked corpus by endorsement structure; the personalized variant is a candidate rank stage for seed-based retrieval, with its small-graph and out-degree caveats weighed explicitly.

## Sources

- https://en.wikipedia.org/wiki/PageRank

## See Also

- [[goodhart-variants]]
- [[spreading-activation]]
