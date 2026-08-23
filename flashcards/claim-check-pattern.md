---
tags: [flashcards, security, data-governance, infrastructure]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Claim-Check Pattern — Flashcards

#flashcards/security

## Definition <!-- kb:card:e23e70 -->
What is the claim-check pattern?
?
Offloading any payload above a size/sensitivity threshold to your own encrypted store and persisting only a reference (a "claim check") in a durable workflow orchestrator, agent checkpoint, or persistent queue — instead of letting the orchestrator's event history capture the full payload.

## Application <!-- kb:card:783b8d -->
Why does a durable workflow orchestrator leak customer data even when nobody intended it to?
?
Durability works by recording every step's inputs and outputs in an event history so a crashed workflow can replay. That mechanism is indiscriminate — it persists whatever payload was passed, with no awareness of sensitivity, so customer data lands in the orchestration vendor's storage as a side effect of the durability guarantee itself, not a bug in any component.

## Relationship <!-- kb:card:4f502d -->
Besides workflow orchestrators, where else does this same exposure — and the same fix — apply?
?
Agent checkpoints (used for long-running agent resume) and persistent message queues carry the identical risk: anything durable enough to resume from also durably retains whatever was checkpointed or queued, so the claim-check fix (store the payload yourself, pass only a reference) applies equally there.
