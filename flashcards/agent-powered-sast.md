---
tags: [flashcards, security, ai-agents, sast, static-analysis]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Agent-Powered SAST — Flashcards

#flashcards/security

## Definition <!-- kb:card:d366ef -->
What is Agent-Powered SAST?
?
A security analysis methodology where AI coding agents — not deterministic rule engines — investigate a codebase for vulnerabilities. A lightweight static (regex) pass narrows candidates, then agents trace data flows, check mitigations, and produce severity-rated findings with context-aware reasoning.

## Pipeline Stages <!-- kb:card:ff7c82 -->
What are the five stages of the deepsec agent-powered SAST pipeline?
?
**Scan** → **Investigate** → **Revalidate** → **Enrich** → **Export**
- Scan: regex identifies security-sensitive files
- Investigate: agents trace data flows and assess mitigations
- Revalidate: second agent removes false positives
- Enrich: git metadata links findings to responsible contributors
- Export: findings formatted as actionable tickets

## False Positive Rate <!-- kb:card:c7fe16 -->
What false positive rate does agent-powered SAST achieve, and how?
?
~10–20%, achieved by combining context-aware agent investigation (vs. blind regex matching) with a dedicated revalidation step where a second independent agent verifies each finding before it exits the pipeline.

## Contrast <!-- kb:card:f01376 -->
How does Agent-Powered SAST differ from AI-Assisted Penetration Testing?
?
Agent-powered SAST is **defensive** — it analyses your own codebase to find vulnerabilities before attackers do, without needing authorisation to attack.  
AI-assisted pen testing is **offensive/adversarial** — it simulates an attacker's perspective, often requiring explicit authorisation and red-team context.

## Application <!-- kb:card:da7945 -->
When would you choose Agent-Powered SAST over traditional SAST tools?
?
When you need **context-aware** analysis — e.g., whether a potentially dangerous code path actually has mitigations in place. Traditional SAST can't cross file boundaries or reason about runtime behaviour. Agent-powered SAST is especially valuable for large monorepos with complex auth models, custom data layers, or where false-positive fatigue has made traditional tooling ignored.
