---
tags: [flashcards, agentic-story-template, ai-agents, engineering, process, templates]
sr-due: 2026-05-21
sr-interval: 1
sr-ease: 250
---

# Agentic Story Template — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:821c9d -->
What is an Agentic Story Template?
?
A structured GitHub Issue template for human-agent development teams that encodes a complete work contract: scope (files to touch), interfaces to implement, invariants to preserve, acceptance criteria, negative constraints, dependencies, and per-wave file ownership. Gives agents an unambiguous spec to execute against.

## Key Sections <!-- kb:card:7a8ce2 -->
What are the sections of an Agentic Story and what does each prevent?
?
- **Files to Create/Modify** — prevents agents from touching files outside scope
- **Interfaces to Implement** — provides a structural API target, not just behavioural description
- **Invariants to Preserve** — states what must NOT be broken
- **Acceptance Criteria** — binary pass/fail conditions defining "contract satisfied"
- **Negative Constraints** — explicit scope exclusions (see negative-constraints-pattern)
- **File Ownership** — prevents write conflicts in parallel multi-agent execution

## Locked Specs <!-- kb:card:ae5982 -->
Why are issues treated as "locked specs" during execution, and what happens to new requirements?
?
If agents can modify the issue during implementation, specs drift and subsequent agents face conflicting information. By locking the issue as read-only once execution begins, the agent has a stable contract. New requirements go into new issues — keeping history clean and traceable.

## Dual Audience <!-- kb:card:bc5d0e -->
In what way is an Agentic Story "dual-audience"?
?
Every section is readable by human developers (who review and maintain it) AND directly executable by AI agents (who implement against it). Traditional issue templates serve only human inference; Agentic Stories resolve the ambiguities that agents would otherwise fill with plausible-looking but incorrect choices.

## Audit Trail <!-- kb:card:c7ccca -->
How do closed Agentic Story issues function as a knowledge base?
?
Closed issues + PR comments become a historical record of "what was done and why" — an external context window that future agents can reference to understand prior decisions, existing constraints, and completed work, without needing that history in their active context.

## Our Gaps <!-- kb:card:bfa8cb -->
What would we need to add to our current issue templates to make them fully Agentic Stories?
?
Three additions: (1) **Invariants to Preserve** section, (2) **Negative Constraints** section with "Does NOT modify X" entries, and (3) **File Ownership** table — especially important before running multiple conductor agents in parallel on the same repository.
