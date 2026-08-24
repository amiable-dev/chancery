---
tags: [flashcards, ranking, graphs, algorithms, domain/llm, maturity/established, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# PageRank — Flashcards

#flashcards/ranking

## PageRank: origin <!-- kb:card:71214e -->
Who created PageRank, and what was its original role?
?
Larry Page and Sergey Brin — it was Google's founding ranking algorithm (patents now expired).

## Random surfer model <!-- kb:card:60b358 -->
What stochastic process does PageRank compute the stationary distribution of?
?
A random surfer who follows out-links with damping probability d and otherwise teleports uniformly to a random node.

## Canonical damping value <!-- kb:card:c0b7c8 -->
What is the canonical value of the damping factor d in PageRank?
?
d is approximately 0.85.

## Out-degree division <!-- kb:card:b43127 -->
How does PageRank divide a node's endorsement among its out-links, and what does this imply about total score?
?
A node's score is split among all of its out-links, so many out-links dilute each endorsement; total score mass is conserved, making ranking zero-sum across the graph.

## Personalized PageRank <!-- kb:card:2296f9 -->
How does the personalized/topic-sensitive PageRank variant differ from standard PageRank?
?
It replaces uniform teleportation with a preference distribution over seed nodes, turning global importance into importance relative to the seeds.

## Expected walk length <!-- kb:card:df0367 -->
What is PageRank's expected random-walk length in terms of the damping factor d, and why does it matter on small graphs?
?
Approximately 1/(1-d) hops; on small graphs this can exceed the graph's diameter, so the walk mixes toward global structure and the seed nodes stop mattering.
