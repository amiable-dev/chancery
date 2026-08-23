---
tags: [flashcards, security, architecture, zero-trust]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Zero Trust Architecture — Flashcards

#flashcards/security

## Definition <!-- kb:card:a2ac93 -->
What is Zero Trust Architecture?
?
A security model premised on "never trust, always verify." Every access request — regardless of network location — must be continuously authenticated, authorised, and validated before access is granted. There is no implicit trust from being on the internal network.

## Core Principles <!-- kb:card:0c1c11 -->
What are the three core Zero Trust principles?
?
1. **Verify explicitly** — authenticate every request using all available signals (identity, device health, location, anomalies)
2. **Least-privilege access** — grant minimum permissions for minimum time; JIT/JEA
3. **Assume breach** — design as if attackers are already inside; microsegment, encrypt everything, log everything

## Pillars <!-- kb:card:0f50c7 -->
What are the five CISA Zero Trust pillars?
?
1. **Identity** — verify who is requesting (MFA, SSO, conditional access)
2. **Device** — verify posture and health of the requesting device
3. **Network** — microsegmentation; encrypt all traffic; no VLAN-based trust
4. **Application/Workload** — authenticate at app layer, not network layer
5. **Data** — classify data; control access by classification; monitor data flows

## Application <!-- kb:card:d9ac6a -->
How does Zero Trust apply to AI agents?
?
Agents are non-human principals. Apply ZTA by giving each agent its own identity (service account), scoping tool permissions to least-privilege per-invocation (not per-session), using short-lived credentials, logging all agent actions with attribution, and requiring authentication for every agent-to-agent call.

## Relationship <!-- kb:card:498db8 -->
How does Zero Trust relate to the perimeter security model?
?
Perimeter security trusts everything inside the firewall — breaching the perimeter gives broad access. Zero Trust eliminates the perimeter concept: location is not a trust signal. Identity + continuous verification replaces network boundary as the trust anchor. A lateral move inside the network gains nothing in a properly implemented Zero Trust environment.
