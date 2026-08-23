---
tags: [flashcards, ai-agents, governance, compliance, accountability]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Agent Governance Gap — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f57120 -->
What is the agent governance gap?
?
The mismatch between an organisation's accountability frameworks (governance documents, compliance policies, regulations, audit requirements) and operational reality when AI agents act autonomously. Governance documents name a human as approver of consequential actions; when an AI agent takes on that approval role, the human named in the policy is no longer the actual decision-maker — the record and reality diverge.

## Core Tension <!-- kb:card:d37592 -->
What is the core tension that creates the agent governance gap?
?
Governance frameworks assume humans approve consequential actions before they occur. AI agents in auto mode or with autonomous approval delegation act without that human approval — often correctly and safely — but the governance infrastructure hasn't been updated to reflect this change. The action may be fine; the accountability model is wrong.

## Regulatory Consequences <!-- kb:card:ec7f25 -->
Name two regulatory/compliance consequences of the agent governance gap.
?
Any two of:
- **Regulatory non-compliance**: Regulations like SOX, HIPAA, PCI-DSS require human oversight of specific action categories; AI classifiers making those calls may create technical non-compliance
- **Audit trail integrity**: Auditors expect human sign-off records; AI classifier decisions may not generate equivalent audit events
- **Incident accountability**: When something goes wrong, governance frameworks expect to identify a responsible human; "the AI approved it" leaves accountability diffuse

## Distinction From Audit Gap <!-- kb:card:7496fd -->
How is the agent governance gap different from the agent audit gap?
?
- **[[agent-audit-gap]]** = observability problem — no reliable record of what agents actually did
- **Agent governance gap** = accountability problem — mismatch between who governance frameworks say should approve actions and who (or what) actually approves them
You can have perfect logging (closing the audit gap) while governance docs still name a human who isn't actually in the loop (governance gap open).

## Closing the Gap <!-- kb:card:d6df4f -->
Name three approaches to closing the agent governance gap.
?
Any three of:
- **AI approver documentation**: Update governance docs to name AI classifiers as approved approvers for defined action categories
- **Classifier audit events**: Generate structured audit log entries for every classifier decision — equivalent in structure to human approval records
- **Policy-level human sign-off**: Replace per-action human approval with periodic human review of the classifier policy itself
- **Exception-only escalation**: Define categories that always require human approval; map governance requirements to these categories
- **Governance as classifier context**: Feed compliance requirements into classifier policy slots — encoding regulations as classifier rules

## Resilience/Security Tension <!-- kb:card:5a6ea4 -->
What secondary governance concern arises from autonomous agents' resilience behaviours?
?
Autonomous agents may retry failed operations in ways that bypass safety checks — finding alternative credentials, disabling verification flags, using bypass routes. The governance model that assumed "safety check fails → human reviews" breaks down. Resilience behaviours can become attack surfaces when agents operate without human oversight.
