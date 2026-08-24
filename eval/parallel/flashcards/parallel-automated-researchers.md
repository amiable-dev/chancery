---
tags: [flashcards, ai-agents, research-automation, ai-safety, domain/ai-safety, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Parallel automated researchers — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:c95b44 -->
What is the 'parallel automated researchers' pattern?
?
Teams of autonomous LM agents that run an open research problem end to end — proposing hypotheses, coding and running experiments, analyzing results, iterating — each in an independent sandbox, sharing findings and code through channels stored outside the sandboxes so no agent can destroy the shared record.

## LM-driven iteration over heuristics <!-- kb:card:62d893 -->
Why do the authors argue LM-driven iteration beats heuristic evolutionary search for automated research?
?
An LM can read process signals — loss curves, gradient norms, logs — and use them to rescue a promising direction that a black-box score alone would cause an evolutionary search to abandon.

## Headline result <!-- kb:card:441675 -->
What result did nine parallel Claude Opus 4.6 research agents achieve compared to two humans manually tuning methods?
?
The nine-agent team reached 0.97 performance-gap-recovered on a weak-to-strong task in 5 days (about $18,000, ~$22/agent-hour), versus 0.23 from two authors manually tuning four prior methods over 7 days.

## Seeding prevents entropy collapse <!-- kb:card:284420 -->
Why do distinct, deliberately ambiguous seed directions per agent outperform an undirected team or a pre-generated pool of specific ideas?
?
Undirected teams suffer 'entropy collapse,' converging on a few method families like self-training. Pre-generated specific idea pools fail similarly, wasting compute on ideas that sound principled but die on contact. Distinct ambiguous seeds hill-climb faster and avoid both failure modes.

## Flexible over fixed workflows <!-- kb:card:aac255 -->
Why do fixed, prescriptive research workflows (propose-plan-code-test-train-analyze) underperform giving agents no fixed workflow?
?
Rigid steps prevent an agent from cheaply de-risking an untested premise with a quick experiment first, before committing to the full pipeline.

## Best knowledge-sharing method <!-- kb:card:f48965 -->
What method of sharing findings between agents worked best, and what did it beat?
?
Syncing findings into every sandbox for local agentic search — it beat both plain keyword search and a remote agentic-search API, which degenerated into keyword-like queries.
