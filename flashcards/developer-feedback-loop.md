---
tags: [flashcards, ai-agents, engineering, product-development, human-in-the-loop]
sr-due: 2026-07-04
sr-interval: 1
sr-ease: 250
---

# Developer Feedback Loop — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:7b6ff7 -->
What is the developer feedback loop?
?
The middle of three nested loop engineering loops. The cycle in which a developer reviews the current product built by a coding agent, applies their context advantage (knowledge about users and domain the AI lacks), and steers the agent toward the next target. Operates at tens of minutes to hours timescales. The locus of higher-level product decisions: features, UI quality, user flow, spec evolution.

## Role Shift <!-- kb:card:07680d -->
How has the developer's role in the developer feedback loop changed as agentic coding loops improved?
?
Previously: developers spent significant time as QA — manually finding bugs and prompting the agent to fix them. As agents became more capable at testing their own code, developer QA time decreased significantly. Now: developers focus on higher-level product decisions (features, UI, user flow) and spec evolution rather than bug-hunting. The QA function migrated to the inner loop.

## Spec Translation <!-- kb:card:2000d1 -->
What is the "spec translation problem" in the developer feedback loop?
?
Even with a clear mental vision, translating that vision into a precise agent-executable specification is non-trivial. And after seeing an implementation, the developer often updates the spec to better capture what they actually wanted ("I'll know it when I see it"). The developer feedback loop is where both initial spec-crafting and spec-refinement after implementation happen.

## Automation Limits <!-- kb:card:aa74d4 -->
Why can't the developer feedback loop be fully automated?
?
Because the loop depends on context advantage — knowledge the developer holds that the AI does not (user needs, domain context, team conventions, operating constraints). As long as this information asymmetry exists, removing the human also removes the information. AI can assist (summarising feedback, analysing usage data) but cannot substitute for the human's unique contextual knowledge.

## Relationship to Inner Loop <!-- kb:card:8a6d4c -->
How does the developer feedback loop interact with the agentic coding loop?
?
The developer feedback loop's output is an updated product spec or steering instruction, which becomes the input for a new agentic coding loop run. The developer reviews what the agent built, makes product-level decisions (including spec updates), and hands those back to the agent. The inner loop runs autonomously within the bounds set by the outer loop.
