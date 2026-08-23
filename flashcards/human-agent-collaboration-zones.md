---
tags: [flashcards, ai-agents, devops, collaboration, workflow]
sr-due: 2026-04-23
sr-interval: 1
sr-ease: 250
---

# Human-Agent Collaboration Zones — Flashcards

#flashcards/devops

## Definition <!-- kb:card:5016b9 -->
What are human-agent collaboration zones?
?
A framework structuring human-AI agent collaboration across software delivery into four distinct zones — IDE/Editor, Pull Request, CI/CD Pipeline, and Production — each with explicitly defined human roles, agent roles, and governance mechanisms.

## Four Zones <!-- kb:card:3b108e -->
What are the four collaboration zones and their governance mechanisms?
?
- **IDE/Editor:** real-time accept/reject; editor-level context files
- **Pull Request:** branch protection; required human approval; agent-specific labels
- **CI/CD Pipeline:** agent-specific verification layers; scope validation; provenance checks
- **Production:** runbook-based automation; human approval gates for high-risk actions

## Production Zone <!-- kb:card:ab6bd3 -->
What distinguishes agent behaviour in the Production zone?
?
Agents only execute pre-approved remediation actions defined in runbooks — not ad hoc decisions. Human approval gates are required for high-risk actions. This is the highest-blast-radius zone, so governance is strictest.

## Three Engineer Roles <!-- kb:card:083eda -->
What three emerging engineer roles map to the collaboration zone framework?
?
1. **System Designer** — defines constraints agents work within (upstream of all zones)
2. **Agent Operator** — selects, configures, monitors agents (IDE + PR zones)
3. **Quality Steward** — reviews and validates output (PR zone primarily)

## Unstructured Collaboration Risk <!-- kb:card:a256aa -->
Why is unstructured human-agent collaboration problematic?
?
It leads to inconsistent outputs, duplicated work, unclear accountability, and trust erosion. Without defined zones, humans and agents step on each other; structured zones produce predictable, reviewable, and improvable results.

## Our Self-Healing Pipeline <!-- kb:card:65ada5 -->
How does our ADR-005 self-healing pipeline map to the collaboration zones framework?
?
It maps to the Production zone — tiered approval via Telegram inline buttons implements the "runbook-based automation with human gates for high-risk actions" governance mechanism. The framework validates the design approach.
