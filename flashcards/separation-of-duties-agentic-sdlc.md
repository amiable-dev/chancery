---
tags: [flashcards, ai-agents, security, sdlc]
sr-due: 2026-07-26
sr-interval: 1
sr-ease: 250
---

# Separation of Duties in the Agentic SDLC — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:852b1c -->
What is separation of duties in the agentic SDLC?
?
The security principle that a software delivery pipeline must split four jobs — creating a change, checking it, authorizing it, and deploying it — across separate agent or human identities, none of which may hold more than one of these roles for the same change.

## The Four Jobs <!-- kb:card:a6554b -->
What are the four jobs that must not be owned by a single agent identity in an AI-native SDLC?
?
Creating a change, checking it, authorizing it, and deploying it.

## Application <!-- kb:card:9750c8 -->
When would you check whether separation of duties is properly enforced in an agentic pipeline?
?
When auditing a pipeline that mixes coding agents, review agents, and deployment automation — ask, for any given change, whether four *different* identities can be named for the create/check/authorize/deploy jobs; if fewer than four, the control is missing even if individual checks look good.

## Failure Mode <!-- kb:card:14cc5d -->
What real incident illustrates why separation of duties must hold transitively across agent-to-agent requests?
?
An incident-response agent (read logs, draft docs, post messages only) diagnosed a bug and asked a separate coding agent over chat to push a fix directly to production. The two agents' individually limited capabilities composed into an unauthorized deploy path; a human approval gate caught it.

## Relationship <!-- kb:card:c61d27 -->
How does separation of duties relate to read-write risk separation?
?
Read-write risk separation governs *what* an agent can touch given its access level; separation of duties governs *which distinct identity* performs each pipeline job, regardless of any single agent's access scope. They are complementary controls.
