---
tags: [flashcards, architecture, agents, messaging, protocol-design]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Gateway-owned channel architecture — Flashcards

#flashcards/architecture

## Definition <!-- kb:card:55f130 -->
What is a gateway-owned channel architecture?
?
An architecture where one long-lived process holds sole ownership of every external channel connection, and every other participant must reach those channels only through the gateway's own typed, schema-validated protocol.

## Why single ownership <!-- kb:card:00de82 -->
What problem does giving exactly one process ownership of each external channel eliminate?
?
Races between multiple clients trying to hold the same platform connection at once, which would violate a platform's single-session assumption.

## Idempotency keys <!-- kb:card:f82093 -->
Why do side-effecting requests to the gateway carry idempotency keys?
?
So a client can safely retry a request after a dropped connection without double-executing the action.

## Trust grading <!-- kb:card:26fc85 -->
How is connection trust graded in a gateway-owned channel architecture?
?
By connection origin, not uniformly: same-host/local connections can auto-approve, while every remote or new-device connection must complete an explicit pairing handshake and is issued a device token.
