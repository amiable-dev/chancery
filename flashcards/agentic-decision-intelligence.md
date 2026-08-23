---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- architecture
- automation
- patterns
---


# Agentic Decision Intelligence — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:742551 -->
What is Agentic Decision Intelligence?
?
A system architecture where an AI agent does not merely detect or flag conditions but autonomously decides and acts on them — closing the loop from detection through to resolution without requiring human intervention for each event.

## Pipeline <!-- kb:card:6dd3f4 -->
What is the Agentic Decision Intelligence pipeline, and how does it differ from traditional detection?
?
ADI: Detect → Classify Severity → Agent Reasons → Agent Acts.  
Traditional: Detect → Alert (human decides).  
The key difference is the agent closes the loop by autonomously selecting and executing an action, reserving human involvement for escalations only.

## Graduated Trust <!-- kb:card:7e604f -->
What is "severity-gated autonomy" in Agentic Decision Intelligence?
?
Lower-severity cases are fully automated (the agent acts without asking); higher-severity or ambiguous cases always route to humans. This creates graduated trust: the system earns autonomy for routine decisions while maintaining HITL for edge cases.

## Application <!-- kb:card:9c12d4 -->
Give a concrete example of Agentic Decision Intelligence applied outside of anomaly detection.
?
IT incident response: classify the alert severity → auto-remediate known patterns (e.g. restart a crashed container) → page on-call humans only for novel or critical incidents. Reduces alert fatigue while maintaining safety on unknowns.

## Relationship <!-- kb:card:981250 -->
How does Agentic Decision Intelligence relate to the Constrained Agent Actions pattern?
?
ADI is the architectural goal (closed-loop autonomous action); Constrained Agent Actions is the safety mechanism that enables it. By bounding the agent's output to N valid decisions, the system can safely automate without risk of the agent inventing unexpected behaviours.
