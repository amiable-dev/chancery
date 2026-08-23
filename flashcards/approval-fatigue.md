---
tags: [flashcards, ai-agents, safety, human-factors, ux]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Approval Fatigue — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:14bea8 -->
What is approval fatigue in the context of AI agents?
?
The cognitive degradation that occurs when an AI agent requests human confirmation so frequently that users stop critically reviewing what they're approving — either rubber-stamping all requests without reading them, or bypassing the mechanism entirely (e.g., `--dangerously-skip-permissions`). The result is the exact safety failure the approval mechanism was designed to prevent.

## Failure Modes <!-- kb:card:9ebe16 -->
What are the two failure modes caused by approval fatigue?
?
1. **Rubber-stamping** — users click approve without reading; the gate exists but provides no real oversight
2. **Permission bypass** — users disable all approval prompts entirely (removing all guardrails) to eliminate friction

## Evidence <!-- kb:card:e289cd -->
What data point demonstrates approval fatigue is a real problem in Claude Code's default mode?
?
Anthropic found that users accepted **93% of all permission prompts** — when almost everything is approved automatically, the approval mechanism stops being a meaningful decision point.

## Solution Direction <!-- kb:card:ae75f5 -->
What is the correct design response to approval fatigue?
?
Apply tiered classification: automatically allow demonstrably safe actions (file reads, in-project edits), reserve human approval for genuinely high-risk operations, and use a [[transcript-classifier|classifier-based system]] to make those distinctions accurately. Move the approval burden from humans to automation for routine cases.

## Relationship <!-- kb:card:2238ff -->
How does approval fatigue relate to the agent governance gap?
?
When approval fatigue drives organisations to automate approvals via AI classifiers, the human who was named as "approver" in governance documents is no longer the actual decision-maker. This creates the [[agent-governance-gap|agent governance gap]] — the governance record says human approved, but an AI classifier did.

## Diagnosis <!-- kb:card:332d88 -->
How would you detect approval fatigue in an agentic system?
?
- Approval acceptance rate >85–90% suggests users aren't discriminating
- Users configuring bypass flags (like `--dangerously-skip-permissions`)
- Long session lengths with high prompt volumes are the highest-risk context
