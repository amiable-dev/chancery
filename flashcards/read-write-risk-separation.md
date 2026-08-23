---
tags: [flashcards, ai-agents]
sr-due: 2026-07-15
sr-interval: 1
sr-ease: 250
---

# Read-Write Risk Separation — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:dd182e -->
What is read-write risk separation for agentic systems?
?
The principle that read operations and write operations belong to fundamentally different risk categories, and an agent's permission boundaries should reflect that difference — via output validation before writes, scope constraints, and human-in-the-loop confirmation for high-stakes/irreversible actions — rather than granting broad access by default.

## Application <!-- kb:card:ea889f -->
When would you apply read-write risk separation?
?
When granting a new tool/capability to an agent: first determine if it reads or writes, then assess the blast radius of a wrong write, and size the mitigation accordingly — validation only for low-stakes reversible writes, up to human-in-the-loop confirmation for high-stakes/irreversible ones.

## Relationship <!-- kb:card:15a073 -->
How does read-write risk separation relate to human-in-the-loop pattern?
?
HITL is the specific mechanism this principle prescribes for high-stakes or irreversible writes — it's the circuit breaker in a graduated set of mitigations that also includes output validation and scope constraints.
