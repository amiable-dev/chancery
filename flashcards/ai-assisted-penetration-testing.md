---
tags: [flashcards, security, ai-agents, penetration-testing]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# AI-Assisted Penetration Testing — Flashcards

#flashcards/security

## Definition <!-- kb:card:2713f8 -->
What is AI-assisted penetration testing?
?
The use of AI agents — typically LLM-backed specialist agents — to augment or partially automate phases of a penetration test. AI assists with reconnaissance, vulnerability analysis, exploit chaining, and reporting while keeping human professionals in control of scope, approval gates, and final judgment.

## Lifecycle Coverage <!-- kb:card:d1aa5f -->
What phases of the pentest lifecycle can AI specialist agents cover?
?
Reconnaissance (nmap/whois), web application testing (ffuf/sqlmap/dalfox), Active Directory attacks (BloodHound/Impacket/CrackMapExec), cloud and mobile, wireless and social engineering, exploit chaining (reasoning across findings for compound paths), and report generation from a persistent findings database.

## What AI Does Well <!-- kb:card:140c1f -->
What does AI do well in penetration testing workflows?
?
Recall (knows every tool flag without reference docs), breadth (monitors multiple attack surfaces simultaneously), continuity (maintains context via structured notes across session resets), and reporting (turns raw findings into professional prose with CVSS scores and remediation roadmaps).

## What Humans Must Still Do <!-- kb:card:3078c1 -->
What does AI-assisted penetration testing still require humans for?
?
Scope definition (authorised targets, rules of engagement, legal boundary), approval gates (every execution command requires human sign-off), creative insight (novel attack chains requiring deep contextual reasoning), and client relationship management (communicating risk in business terms).

## Architecture Pattern <!-- kb:card:fb2571 -->
What is the standard architectural pattern for an AI-assisted pentest toolkit?
?
28+ specialist agents with narrow domain expertise, automatic routing to the most appropriate specialist, a two-tier execution model (advisory agents analyse; execution agents act with per-command approval), a persistent SQLite findings database, and MITRE ATT&CK tagging for every finding with paired defensive context.

## Application <!-- kb:card:b4b9a2 -->
When would you use an advisory-only (Tier 1) pentest agent vs. an execution (Tier 2) agent?
?
Use a Tier 1 advisory agent when you have tool output to analyse and want methodology guidance or next-step recommendations — no commands run. Use a Tier 2 execution agent when you're ready to actively test an in-scope target and want the AI to compose and run commands — with each command requiring your explicit approval.
