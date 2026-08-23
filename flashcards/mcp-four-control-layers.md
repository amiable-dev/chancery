---
tags: [flashcards, mcp, security, architecture]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# MCP Four Control Layers — Flashcards

#flashcards/security

## Definition <!-- kb:card:58674a -->
What organising question does the MCP four-layer defense-in-depth model apply to every failure mode, and what's the common answer?
?
"Where is the earliest trustworthy enforcement point?" For every MCP failure class, the answer is somewhere other than a single central gateway — execution failures belong in the tool handler/CI, management-plane failures at network isolation, outbound trust failures at egress policy, and semantic-integrity failures at the registration boundary.

## Application <!-- kb:card:db067a -->
Why is a central API gateway necessary but insufficient for MCP security, according to this model?
?
A gateway handles authentication, authorization, auditing, and policy evaluation — all protocol-layer, request-time concerns. It cannot make a tool handler treat arguments as data, cannot isolate inspectors/consoles around MCP, cannot bound a server's own outbound calls, and cannot detect when a previously-approved tool definition silently changes.

## Relationship <!-- kb:card:672ce1 -->
Which of the four layers (execution, management infrastructure, outbound trust, semantic integrity) is described as "architecturally novel," and why do conventional controls fail against it?
?
Semantic integrity (Layer 4). A rug-pulled tool request can be well-formed, schema-valid, and authenticated all at once — input validation, auth, and gateway policy all pass, because none of them evaluate whether the tool's *meaning* still matches what was originally trusted.

## Consequence <!-- kb:card:df03ee -->
Why does the recommended four-week rollout order (Layer 2, then 1, then 3, then 4) put manifest pinning last despite semantic integrity being the "genuinely new" risk?
?
The order is mature-and-verifiable-first, MCP-specific-last: auth hygiene and CI shell-injection rules are well-understood, low-cost controls to deploy quickly, while manifest pinning is the highest-cost, highest-friction control (legitimate upgrades require re-approval) and benefits from the other layers already being in place first.
