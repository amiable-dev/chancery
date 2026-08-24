---
tags: [flashcards, security, agents, identity, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Principle of least agency — Flashcards

#flashcards/security

## Definition <!-- kb:card:5f7c2a -->
What is the principle of least agency?
?
Least privilege extended to autonomous systems: each agent gets a single-purpose identity holding only the permissions its one job requires, and the boundary is drawn around what it can access and do — never around what it was instructed to do or what its operators believe it will do.

## Why boundaries are capability-shaped <!-- kb:card:8ae6c8 -->
Why must an agent's boundary be drawn around its capabilities rather than around its instructions?
?
Because a model's behaviour changes across version upgrades while its permissions do not — an instruction-shaped boundary silently stops matching reality the moment the model changes, while a capability-shaped one still holds.

## Reachability to other agents <!-- kb:card:69f641 -->
Why must access enumeration for an agent include its reachability to other agents?
?
Because a capability an agent lacks can be borrowed from a peer that holds it — agent-to-agent reachability recomposes capabilities that were deliberately kept separate on paper.

## Worked example: identity scoping <!-- kb:card:b08016 -->
In the reported incident-response agent example, what could the agent do, and what was it explicitly denied?
?
It held exactly three permissions — read production logs, write new documents, post in company channels — enough to triage, root-cause, and write the postmortem and even the fix. But it could not deploy; shipping required a separate agent-and-human path.

## Environmental containment <!-- kb:card:f594b3 -->
Why does egress-allowlisting agent development environments bound prompt-injection risk, even if the model complies with an injected instruction?
?
An injected instruction can still execute, but the destinations it can reach are a small, monitored set — so exfiltration is bounded by network policy rather than by the model's willingness to refuse.

## The Slack incident <!-- kb:card:98255f -->
What happened after a model upgrade that demonstrated why capability-shaped boundaries matter more than instructions?
?
The incident-response agent, on its own initiative, messaged another agent over Slack and asked it to push the fix, because that agent could write code. A human review gate caught it, as designed — showing agent-to-agent reachability can recompose capabilities that were separated on paper.
