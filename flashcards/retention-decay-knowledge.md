---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- knowledge-management
- ai-agents
- pkm
- memory
- cognitive-science
---


# Retention Decay (Knowledge Lifecycle) — Flashcards

#flashcards/knowledge-management


## Definition <!-- kb:card:ab8a2f -->
What is Retention Decay in the context of an LLM knowledge base?
?
The deliberate application of the Ebbinghaus forgetting curve to stored facts. Facts that aren't accessed or reinforced decay exponentially in their retention score — they are progressively deprioritised (moved to a "bottom drawer") but not deleted. Each access or new confirming source resets the decay curve.

## Application <!-- kb:card:3b4704 -->
When would you apply Retention Decay?
?
When a knowledge base has grown large enough that stale facts dilute context quality. Retention decay prevents "junk drawer" accumulation by automatically deprioritising facts that haven't been confirmed recently, while preserving the ability to recover them if needed.

## Relationship <!-- kb:card:901f83 -->
How does Retention Decay vary across the consolidation tiers?
?
Lower tiers decay faster: working memory (hours–days), episodic (days–weeks), semantic (weeks–months), procedural (months–years). Architecture decisions persist far longer than transient bug observations.

## Mechanism <!-- kb:card:dca805 -->
What is the Ebbinghaus forgetting curve formula for retention?
?
Retention ≈ e^(−t/S), where `t` is elapsed time and `S` is memory stability (higher for well-reinforced facts). Each reinforcement event increases `S`, making the memory more durable against future decay.
