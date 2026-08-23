---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- ai-agents
- pkm
---


# Knowledge Confidence Scoring — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:8b0283 -->
What is Knowledge Confidence Scoring?
?
A metadata mechanism attaching a numerical score (0–1) to each fact in an LLM knowledge base, reflecting how many sources support it, how recently it was confirmed, and whether contradicting evidence exists. Scores decay over time and strengthen on reinforcement.

## Application <!-- kb:card:cacea6 -->
When would you use Knowledge Confidence Scoring?
?
When you want the LLM to reason about its own certainty — surfacing facts with appropriate hedging ("I'm fairly sure about X, less certain about Y"), flagging stale claims for review, and weighting contradicting claims by evidential strength.

## Relationship <!-- kb:card:4e8207 -->
How does Knowledge Confidence Scoring relate to Retention Decay?
?
Confidence score is the operational expression of retention. Retention decay (Ebbinghaus curve) reduces the confidence score over time when a fact isn't accessed or reinforced; new confirming sources reset and strengthen it.

## Mechanism <!-- kb:card:3bc0e9 -->
What three factors determine a confidence score?
?
(1) Source count — how many independent sources support the claim. (2) Recency — how recently the claim was last confirmed. (3) Contradictions — any conflicting evidence reduces the score.
