---
tags: [flashcards, ai-agents, architecture, quality-control, false-positives]
sr-due: 2026-05-10
sr-interval: 1
sr-ease: 250
---

# Multi-Agent Revalidation — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f7c242 -->
What is Multi-Agent Revalidation?
?
A pipeline pattern where a second, independent agent re-examines the outputs of a first agent — verifying findings, removing false positives, and reclassifying severity — before results pass downstream. The second agent sees the same evidence but not the first agent's reasoning, acting as a peer reviewer rather than a continuation.

## Independence <!-- kb:card:efe47c -->
Why must the revalidation agent NOT see the first agent's reasoning chain?
?
To prevent **anchoring bias** — if the second agent sees the first agent's conclusion and confidence, it tends to defer to it rather than independently assess the evidence. Independence is required for genuine peer review: the second agent should justify retaining a finding, not just validate one it was primed to accept.

## Trade-off <!-- kb:card:3be6c6 -->
What is the main cost of Multi-Agent Revalidation, and when is it worth paying?
?
**Cost:** Roughly 2× inference cost per candidate reviewed (two full agent passes).  
**Worth it when:** False positives are expensive — security tickets, alert fatigue, human triage time, or downstream automation that acts on findings. The break-even is fast in high-stakes pipelines.

## Relationship <!-- kb:card:ef212f -->
How does Multi-Agent Revalidation relate to Human-in-the-Loop (HITL)?
?
Multi-agent revalidation is a **scalable alternative to HITL** for moderate-stakes pipelines. Where HITL requires a human to review every finding, revalidation uses a second LLM pass as a cost-effective filter. Humans can still review the revalidation-approved subset — giving HITL a much smaller surface to cover.

## Contrast <!-- kb:card:8a318a -->
How is Multi-Agent Revalidation different from the LLM Council deliberation pattern?
?
- **Revalidation:** Binary verify/reject decision on pre-formed findings. Second agent has a specific brief: find reasons to reject.  
- **LLM Council:** Open deliberation across multiple models on an open question, with anonymous peer review and a chairman synthesis. Aimed at reaching novel consensus, not filtering existing outputs.
