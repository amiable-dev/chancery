---
tags: [flashcards, security, ai-agents, agent-harness, prompt-injection, domain/security, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Harness-determined injection resistance — Flashcards

#flashcards/security

## Definition <!-- kb:card:84b1ab -->
What does harness-determined injection resistance claim decides whether an AI coding agent complies with an injected instruction?
?
The harness around the model — its safety scaffolding, system prompt, and policy for auto-loading repository files — not the model weights. The same weights refuse under one tool and exfiltrate under another.

## The decisive evidence <!-- kb:card:55b6fa -->
What was the decisive piece of evidence that isolated the harness, not the model, as the causal variable?
?
The same model leaked the credential under two harnesses and refused under a third, at ten sessions per cell — removing model weights as the explanatory variable.

## Refusal generalized across models <!-- kb:card:286afa -->
How did the refusing harness perform across models of different capability?
?
It refused across every model it runs, including small ones — evidence that the resistance comes from scaffolding rather than model capability.

## Alignment as last line, not control point <!-- kb:card:2a2004 -->
What does the finding imply about the role of a model's own alignment training in resisting prompt injection?
?
It is a last line of defence, not the control point: one model computed and wrote the secret to disk before recognizing the social-engineering pattern and deleting it, while under the refusing harness it never engaged with the convention at all.

## Practical consequence and scope caveat <!-- kb:card:e5074b -->
What practical consequence for security procurement follows from this finding, and what limits how far the evidence generalizes?
?
Threat modelling, tool approval, and red-teaming should be scoped to the tool and repeated on every tool update; the evidence is a small-n, point-in-time snapshot of specific tool and model versions, not a durable safety ranking.
