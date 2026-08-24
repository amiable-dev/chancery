---
tags: [flashcards, security, governance, ai-native-sdlc, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Governing the automation loop — Flashcards

#flashcards/security

## Definition of governing the automation loop <!-- kb:card:378d5f -->
What is 'governing the automation loop' in the context of AI-driven security review?
?
The shift from inspecting individual bugs and changes to maintaining the automation itself: confirming reviewers earn trust, sampling automated approvals, feeding bug classes back into instructions, and keeping every agent action attributable.

## Why this needs scheduling, not triggering <!-- kb:card:65e3e4 -->
Why must governing the automation loop be scheduled rather than event-triggered?
?
Because the structure decays in ways that raise no alert: a skill goes stale, a discovered bug class never gets written back into instructions, or an approval path drifts unsampled — the drift is found by incident, not inspection.

## Shadow mode for new reviewers <!-- kb:card:dd1325 -->
What is shadow mode for a new AI reviewer?
?
A probation period in which the reviewer posts comments for human approval, and the team red-teams it with inserted malicious changes, until its findings earn confidence.

## Risk-weighted sampling <!-- kb:card:5a1626 -->
What does risk-weighted sampling do in agent-loop governance?
?
It re-reviews a proportion of automated approvals by hand, so a failing approval path surfaces through inspection rather than through an incident.

## Routing agent actions to the SIEM <!-- kb:card:af6d7e -->
What gets routed to the SIEM under this governance model, and why?
?
Every automated approval, tool call, and agent-to-agent message, along with the signals behind it — making any decision reconstructable and letting agents be treated as a new insider-threat class.

## Relation to loop-engineering <!-- kb:card:92ef7a -->
How does governing the automation loop relate to loop-engineering?
?
Loop-engineering builds the loops; agent-loop governance is the same cycle watched from the assurance side afterward, rather than the construction side.
