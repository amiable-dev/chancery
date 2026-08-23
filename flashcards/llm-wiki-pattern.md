---
tags: [flashcards, llm-wiki-pattern, ai-agents, knowledge-management, pkm]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# LLM Wiki Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:b4ae23 -->
What is the LLM Wiki Pattern?
?
A knowledge-management pattern (Andrej Karpathy, April 2026) where a shared, cross-linked Markdown library serves as persistent agent context. LLMs handle the bookkeeping (updating cross-references, multi-file edits) while humans curate the content. The wiki grows more useful over time instead of going stale.

## Core Insight <!-- kb:card:953346 -->
Why are LLMs better suited to wiki maintenance than humans?
?
LLMs don't get bored, don't forget to update cross-references, and can edit fifteen files in a single pass. The bookkeeping overhead that causes humans to abandon personal wikis is exactly the kind of work LLMs handle well.

## Instances <!-- kb:card:1679e8 -->
Name three instances of the LLM wiki pattern in the wild.
?
1. `AGENTS.md` / `CLAUDE.md` convention files in coding agent repos
2. Obsidian vaults wired to coding agents
3. "Metadata as code" repos in data teams (table schemas, metric definitions as Markdown)
OKF is the standardised, interoperable version of all of these.

## Relationship to OKF <!-- kb:card:b6bc13 -->
How does the LLM Wiki Pattern relate to Open Knowledge Format (OKF)?
?
OKF is Google Cloud's formalisation of the LLM wiki pattern. The pattern describes the concept (agent-maintained Markdown wiki as context layer); OKF provides the standardised interchange format that makes different instances interoperable without translation.

## Application <!-- kb:card:f00e24 -->
A team's on-call runbooks keep going out of date. How could the LLM wiki pattern help?
?
Store each runbook as a Markdown concept file. After incidents, an agent updates the relevant runbook pages, adds new cross-references, and keeps the graph consistent. Humans review the agent's changes via PRs. The wiki stays current because the maintenance burden is absorbed by the agent, not deferred by the human.
