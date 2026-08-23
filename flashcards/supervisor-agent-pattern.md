---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- patterns
- multi-agent
---


# Supervisor Agent Pattern — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:14a9fd -->
What is the Supervisor Agent Pattern?
?
A multi-agent pattern where a **supervisor agent** performs centralised planning and assigns tasks to specialised **worker agents**. The supervisor decides at each step which worker to invoke next or when the goal is achieved. Workers execute within their specialisation without needing the full goal context.

## Structure <!-- kb:card:8e3e37 -->
What are the two roles in the Supervisor Pattern?
?
- **Supervisor** — plans, routes, aggregates. Knows the overall goal; decides which worker handles what.
- **Workers** — specialised agents that execute focused tasks and return results. Don't need to understand the broader context.

## Real-World Example <!-- kb:card:b5a4a3 -->
What is a real-world production example of the Supervisor Pattern?
?
Anthropic's Multi-Agent Research System: a central agent plans the research process from a user query, then dispatches parallel sub-agents to research individual sub-topics. Each sub-agent searches and reads independently; the supervisor synthesises their outputs into a final report.

## Scaling <!-- kb:card:a2365f -->
How does the Supervisor Pattern scale when there are too many workers?
?
It extends into a **Hierarchical Agent Pattern**: team-level supervisors manage groups of workers, with a master supervisor coordinating the team supervisors. Example: master fulfilment agent → regional supervisors → warehouse-level agents.

## Relationship to ReAct <!-- kb:card:44a64e -->
How does the Supervisor Pattern relate to the ReAct pattern?
?
They're complementary. A supervisor often uses ReAct internally for its coordination loop. Workers may themselves be ReAct agents. The key difference: ReAct is a single self-contained loop; the Supervisor Pattern is a coordination layer that manages *other agents*.
