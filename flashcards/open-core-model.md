---
tags: [flashcards, open-source, business-model, licensing]
sr-due: 2026-05-29
sr-interval: 1
sr-ease: 250
---

# Open Core Model — Flashcards

#flashcards/open-source

## Definition <!-- kb:card:c28a7b -->
What is the Open Core Model?
?
A commercial open-source strategy where core product functionality is released under a strong copyleft licence (typically AGPL), while operational features (hosting, collaboration, scheduling, enterprise integrations) are sold commercially. The open core is the technical engine; the commercial layer is the operational interface.

## Boundary Principle <!-- kb:card:af7c3c -->
Where should the functional boundary fall in an open core model?
?
**Open (capability):** Detection rules, scan logic, analysis algorithms, core integrations — everything that *does the job*.
**Commercial (operations):** Multi-tenant hosting, RBAC, audit logs, SLA, scheduling, SSO — everything that *runs it at scale*.
Boundary violation = moving capability into the commercial tier = trust destruction.

## AGPL Role <!-- kb:card:6d1059 -->
Why do open core projects often choose AGPL over MIT or Apache?
?
AGPL extends copyleft to network use: running a modified AGPL service requires releasing the modified source. This prevents the "SaaS loophole" (using open source as infrastructure without contributing back) and makes relicensing to a proprietary licence a highly visible, trust-breaking event. It gives users a structural guarantee that the core stays open.

## Trust Signal <!-- kb:card:fd6fa5 -->
How does contributor trust work in open core projects?
?
Trust is earned incrementally through consistent behaviour (new detection lands in the open repo first) and lost suddenly (the moment capability shifts to the commercial tier to upsell). The self-host guarantee is key: because anyone can fork + self-host the AGPL core, the commercial value must be in operational convenience, not in capability lock-in.

## Evaluation <!-- kb:card:3da552 -->
When evaluating a tool that claims to be open source, what three things should you check?
?
1. **Which licence?** (AGPL/GPL = strong copyleft; MIT/Apache = permissive, easier to relicence)
2. **Where does the functional boundary fall?** (capability open vs. capability commercial)
3. **Has the boundary ever shifted?** (check git history, release notes, changelogs for capability moving out of the open repo)
