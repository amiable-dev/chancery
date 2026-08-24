---
tags: [flashcards, ai-agents, security, autonomy, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Classifier-mediated action approval — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:6a59c3 -->
What does classifier-mediated approval replace, and what does the substitute model see?
?
It replaces a human's permission-prompt judgment with a model that approves or denies each proposed agent action. The approver sees only the user's own messages and the agent's literal tool calls — the agent's prose reasoning and all tool outputs are stripped out.

## Why strip reasoning and outputs <!-- kb:card:08c8de -->
Why does the approver deliberately not see the agent's reasoning or tool outputs, and what evidence supports that choice?
?
Reading the agent's justification lets a rationalization talk the approver into a bad call; reading tool outputs lets injected content reach it too. This was measured: including them lowered recall on real overeager actions, while a tool-calls-only variant lost the user-intent anchor and blocked plainly requested work.

## Threat model <!-- kb:card:6e7a74 -->
What are the two dominant incident classes this design defends against, and how is each one handled?
?
Overeagerness (an agent takes irreversible initiative past what was authorized) and honest blast-radius mistakes (believing a shared resource is its own) — ahead of prompt injection and misalignment. All four are answered identically: block the action.

## Two-stage cascade trade-off <!-- kb:card:2b98ac -->
What did the two-stage cascade (cheap over-blocking filter, then reasoning review only on flagged actions) achieve, and at what cost?
?
It took false positives from 8.5% down to 0.4%, but misses on real overeager actions rose from 6.6% to 17% — a concrete accuracy-versus-cost trade-off from tuning the cheap filter to over-block.

## Consent-scope errors <!-- kb:card:e18f0f -->
What is a "consent-scope error," and why does it remain the dominant residual failure after the cascade?
?
Approval-shaped evidence being accepted without checking whether it actually covers this specific action's blast radius — the classifier sees evidence of some prior approval but doesn't verify its scope matches the current request.

## Recoverable denial <!-- kb:card:0b95b2 -->
What happens when the approver denies an action, and why does that design choice matter?
?
The denial comes back to the agent as a tool result it can route around, not a halt waiting for a human — so a false positive costs a retry, not the whole session, which is what makes aggressive over-blocking tunable without destroying usability.
