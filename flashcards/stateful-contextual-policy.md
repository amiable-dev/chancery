---
tags: [flashcards, ai-agents, governance, policy]
sr-due: 2026-06-15
sr-interval: 1
sr-ease: 250
---

# Stateful Contextual Policy — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:07f3b7 -->
What is a stateful contextual policy for agents?
?
An agent governance mechanism that tracks the *history and context of agent actions* within a session to make dynamic, situation-aware decisions — as opposed to static allow/deny lists or prompt instructions that apply the same rule regardless of what the agent has previously done.

## Core Example <!-- kb:card:fab2e5 -->
Give the canonical example of why stateful policies matter.
?
After `npm install`, require approval before `git push`. Individually both are fine. In sequence, they're a supply-chain risk: the agent may have installed a malicious package and is now about to commit it. A stateless policy can't see this; a stateful policy tracks the install and gates the push.

## Prompt vs Policy <!-- kb:card:a2f6b4 -->
Why is a stateful contextual policy better than a prompt-based guardrail?
?
Prompt guardrails rely on the model to self-police — they can be overridden by model outputs, are not auditable, and don't persist state. Stateful policies are **enforced programmatically at the meta-harness layer**: they cannot be overridden by the model, they maintain an auditable log, and they accumulate session state across actions.

## Policy Levels <!-- kb:card:abf61b -->
At what levels do stateful contextual policies stack in Omnigent?
?
Three levels, checked in descending specificity:
1. **Session-level** — strictest; applies to this specific session only
2. **Agent-level** — applies to all sessions of a given agent definition
3. **Server-level** — global defaults for all agents on the server
The stricter (more specific) level always takes precedence.

## Budget Cap Relationship <!-- kb:card:f443fe -->
How do agent budget caps relate to stateful contextual policies?
?
Budget caps are a *specific form* of stateful contextual policy: they track cumulative spend and enforce a threshold. More general stateful policies can track arbitrary action history — which packages were installed, which files were modified, which endpoints were called — and apply complex conditional logic. Budget caps are the most common specialisation.

## Application <!-- kb:card:d29305 -->
When should you use HITL vs a stateful contextual policy?
?
Use **stateful contextual policy** when risk is predictable from action sequences (e.g. "always gate push after install") — these can run fully automated and only trigger HITL on known risk patterns. Use **human-in-the-loop** for novel or high-stakes actions with no pre-defined policy. Well-designed stateful policies reduce approval fatigue by reserving HITL for genuinely uncertain situations.
