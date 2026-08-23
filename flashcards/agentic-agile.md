---
tags: [flashcards, agentic-agile, ai-agents, agile, engineering, process]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Agentic-Agile — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:839ba3 -->
What is Agentic-Agile?
?
The application of Agile engineering practices — structured backlog, acceptance criteria, incremental delivery, and governance — to human-agent development teams. Treats agents as contributors subject to the same process discipline as human developers, not as tools to be prompted ad hoc.

## Maturity Ladder <!-- kb:card:c7f06c -->
What are the three levels of the Agentic-Agile maturity ladder?
?
1. **Prompt-Driven** — no backlog, no concept of done, no governance
2. **Spec-Driven** — specs defined upfront, but no backlog lifecycle or change governance
3. **Agentic-Agile** — full Agile discipline applied to human+agent teams

## Core Problem <!-- kb:card:8fd264 -->
Why is process—not model—the fix for agent development failures at scale?
?
Upgrading the model doesn't fix missing acceptance criteria. A more capable agent working against an ambiguous spec produces *more sophisticated drift, not less* — better-looking broken code that's harder to catch. The failures are coordination and governance failures, not capability failures.

## Governance <!-- kb:card:458e6c -->
What does "governance from day one" mean in Agentic-Agile?
?
Safety constraints, validation rules, and CI/CD gates are acceptance criteria on individual stories — properties of the backlog itself — not phases added after delivery. CI/CD pipelines and automated tests should be the *first* stories implemented, not the last.

## Human Role <!-- kb:card:a8e272 -->
How does the human's role change in Agentic-Agile compared to prompt-driven development?
?
From directing every implementation action to acting as architecture-and-specification author — a Scrum Coach who defines contracts and constraints, then facilitates agent execution and shared review. Agents contribute implementation within those constraints.

## Documentation <!-- kb:card:870e0b -->
What is dual-audience documentation in Agentic-Agile?
?
Process standards live in files like `CLAUDE.md`, `.github/copilot-instructions.md`, and `STYLE.md` — readable by both human developers and AI agents. Documentation maintenance tables explicitly define *when* each doc must be updated to prevent drift between sessions.

## Application <!-- kb:card:4c28e6 -->
How does our conductor workflow map to Agentic-Agile, and what's missing?
?
Our workflow (GitHub Issues → agent picks up → implements → PR → council review → merge) is essentially Agentic-Agile. Gaps: (1) no file ownership enforcement for parallel agents, (2) no Negative Constraints section in issue templates, (3) no explicit documentation maintenance tables.
