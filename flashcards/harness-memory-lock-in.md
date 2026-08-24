---
tags: [flashcards, ai-agents, memory, lock-in, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Harness-memory lock-in — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:28f6ef -->
What is harness-memory lock-in, and why does it follow from memory being a harness capability rather than a plugin?
?
Managing context (what loads at session start, what survives compaction, how long-term stores work) is the harness's core job, so whoever controls the harness controls the memory. Running a closed or API-hosted harness converts accumulated interaction state into switching cost held by the provider, not an asset held by the builder.

## Why memory can't be swapped in standalone <!-- kb:card:b6f688 -->
Why can't memory currently be swapped in as a standalone service, independent of the harness?
?
Memory is context the harness chooses to persist and re-inject — the harness decides how memory files load, what survives compaction, and whether interactions are stored queryably — so no mature harness-independent memory abstraction exists.

## The ownership gradient <!-- kb:card:9720c1 -->
What is the ownership gradient of memory lock-in, from least to most severe?
?
Stateful provider APIs (thread state held on provider servers, can't swap models mid-thread), then closed-source harnesses (memory artifacts of undocumented, non-transferable shape), then fully API-hosted harnesses (accumulated long-term memory invisible and unexportable entirely).

## Why providers are incentivized toward lock-in <!-- kb:card:4925a4 -->
Why are providers incentivized to push toward the API-hosted end of the memory ownership gradient?
?
Accumulated interaction state personalizes an agent and compounds into a proprietary dataset that is forfeited on switching — it restores the lock-in that stateless, interchangeable model APIs had removed.

## The due-diligence rule <!-- kb:card:ce65af -->
What is the practical rule for evaluating a harness or stateful API feature before adopting it?
?
Establish where session and long-term state physically lives and whether it exports — before adopting, not after.
