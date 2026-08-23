---
tags: [flashcards, ai-agents, devops, repository, documentation]
sr-due: 2026-04-23
sr-interval: 1
sr-ease: 250
---

# Repository as Agent Interface — Flashcards

#flashcards/devops

## Definition <!-- kb:card:f8cc19 -->
What does "repository as agent interface" mean?
?
The design principle that when AI agents become regular code contributors, the repository becomes the primary interface for both humans and agents — requiring all conventions, patterns, and policies to be explicit, machine-readable, and enforceable rather than relying on tribal knowledge or implicit shared understanding.

## Five Categories <!-- kb:card:3e5e4e -->
What five categories of documentation must be explicit in an agent-first repository?
?
1. Architecture patterns — how new features should be structured
2. Dependency policies — which packages are approved/prohibited
3. Testing conventions — style, coverage expectations, test type requirements
4. File organisation rules — where new files belong, naming standards
5. Security requirements — input validation, auth, rate limiting, data handling

## Skill Profiles <!-- kb:card:420328 -->
What are "skill profiles" in the context of repository design for agents?
?
Files like `.github/copilot-instructions.md` or constitution files that give agents the same onboarding context a senior engineer receives — architectural boundaries, accepted patterns, dependency rules, and quality expectations. They are operational inputs, not just reference documentation.

## Failure Mode <!-- kb:card:6fe19b -->
What class of failures results from missing or weak skill profiles?
?
Contextual failures that erode trust: agents add the wrong technology (Redis when in-memory is standard), create new patterns when they should extend existing ones, or introduce packages when a utility already exists — all because implicit conventions weren't surfaced.

## Application <!-- kb:card:7ab1a1 -->
How does the repository-as-agent-interface principle apply to OpenClaw?
?
AGENTS.md, SOUL.md, and TOOLS.md in the workspace are a direct application — they make operational conventions explicit for an AI agent, not just documentation for human readers. They are consumed at task time, shaping every agent contribution.

## Human Onboarding Test <!-- kb:card:0cf97c -->
What is the "human onboarding test" for evaluating repository readiness for agents?
?
If a new hire couldn't on-board from the repository documentation alone and needed to ask questions or pair program to learn conventions, then an agent can't either — those conventions need to be made explicit before agents are enabled.
