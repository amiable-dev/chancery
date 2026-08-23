---
tags: [flashcards, security, threat-intelligence, frameworks]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# MITRE ATT&CK Framework — Flashcards

#flashcards/security

## Definition <!-- kb:card:3f0cb6 -->
What is MITRE ATT&CK?
?
A publicly accessible knowledge base of adversary tactics and techniques derived from real-world cyber attack observations. It provides a structured taxonomy that enables consistent classification and communication of attacker behaviour across the full attack lifecycle.

## Hierarchy <!-- kb:card:6bc954 -->
What is the ATT&CK hierarchy from broadest to most specific?
?
Tactic (the *why* — adversary goal, e.g. Privilege Escalation) → Technique (the *how* — general method, e.g. T1055 Process Injection) → Sub-technique (specific implementation, e.g. T1055.001 DLL Injection) → Procedure (actual observed usage by a named threat actor group).

## Blue Team Use <!-- kb:card:2af7c7 -->
How does a blue team use ATT&CK?
?
Map existing detections to ATT&CK IDs to identify coverage gaps; prioritise detection engineering based on techniques used by relevant threat groups; evaluate security controls via ATT&CK Navigator heat maps; communicate findings to leadership in vendor-neutral terms.

## Red Team Use <!-- kb:card:4339bd -->
How does a red team use ATT&CK?
?
Plan engagements using ATT&CK as a technique checklist for comprehensive lifecycle coverage; document findings with standard technique IDs for clear reporting; chain techniques into realistic attack paths; simulate specific threat group TTPs (tactics, techniques, and procedures).

## AI Integration <!-- kb:card:2c46cd -->
How do AI security agents use ATT&CK?
?
Auto-tag every executed technique with the ATT&CK ID at write time; pair offensive findings with mapped defensive detections from the same framework; generate structured reports with standard IDs that both red and blue teams understand; enable cross-engagement analysis ("which ATT&CK techniques recur?").

## Relationship to ATLAS <!-- kb:card:047a6c -->
How does MITRE ATT&CK relate to MITRE ATLAS?
?
ATT&CK covers adversarial attacks on traditional systems (Windows, Linux, cloud, etc.). ATLAS is the equivalent framework for adversarial attacks on AI/ML systems — covering techniques like prompt injection, model poisoning, training data attacks, and model inversion.
