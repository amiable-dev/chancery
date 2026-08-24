---
tags: [flashcards, security, agents, authorization, policy-as-code]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Decoupled policy decision engines — Flashcards

#flashcards/security

## Core architecture <!-- kb:card:29a7b5 -->
What does a decoupled policy decision engine separate from the enforcing application?
?
The decision of whether an action is allowed — the enforcing code sends structured data to a general-purpose engine that evaluates a declarative policy and returns a structured decision.

## Output shape <!-- kb:card:b92c69 -->
How does a decoupled policy engine's output typically differ from a static allowlist's?
?
It returns arbitrary structured data (e.g. a reason, a remaining budget, a required follow-up action), not just allow or deny.

## Reference instance <!-- kb:card:d80931 -->
What is the reference instance of a decoupled policy decision engine, and what language does it write policy in?
?
Open Policy Agent (OPA), a CNCF-graduated project; its declarative policy language is Rego.

## Where statefulness lives <!-- kb:card:a61f14 -->
Does OPA itself maintain session state, or does the statefulness come from elsewhere?
?
OPA evaluates each query fresh against its current data and doesn't maintain session memory itself; the calling application (or a sidecar like OPAL) feeds it mutable state — e.g. accumulated spend, rate-limit counters, risk scores — as ordinary data.

## Why a static allowlist can't compete <!-- kb:card:662463 -->
Why can't a static allowlist express a budget that tightens as it's consumed or a rate that adapts to recent behavior?
?
A static allowlist enumerates permitted actions once; encoding adaptive or consumable conditions means abandoning the list and writing bespoke code around it, whereas a policy program can condition on supplied data directly.
