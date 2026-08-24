---
tags: [flashcards, security, ai-agents, agent-harness, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Tiered execution gating for AI agents — Flashcards

#flashcards/security

## Definition <!-- kb:card:a35ea0 -->
What is tiered execution gating for AI agents?
?
A permission design where every capability defaults to advisory-only (human runs the tool), and only a declared subset of agents is upgraded to direct execution, conditioned on an authorized scope and per-command human approval.

## Default state <!-- kb:card:d8e0bb -->
What is the default state for every capability in tiered execution gating?
?
Advisory — the agent analyzes and recommends commands, but a human copies and runs them; nothing is exposed by default.

## Prerequisite for execution <!-- kb:card:ac8795 -->
What must an operator do before a capability can cross into direct execution?
?
Declare the scope they are authorized to test; every target the agent proposes is then validated against that declared scope before the command runs.

## Approval granularity <!-- kb:card:e13d3d -->
Is approval granted per command or per session in tiered execution gating?
?
Per command — one approval does not grant standing execution rights for the rest of an engagement.

## Problem it solves <!-- kb:card:483280 -->
What specific tension does the two-tier split resolve?
?
An agent needs enough autonomy to be useful, such as chaining a scan into a follow-up exploit attempt, while that same autonomy applied to the wrong target or without the operator's knowledge turns a research assistant into unauthorized access.

## vs. classifier-mediated approval <!-- kb:card:851cf7 -->
How does tiered execution gating's approval mechanism differ from classifier-mediated approval?
?
Tiered execution gating keeps every command in front of a human and restricts up front which agents can even reach that gate, rather than delegating the approval decision to a trained model.
