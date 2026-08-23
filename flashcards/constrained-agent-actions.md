---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- architecture
- patterns
- safety
---


# Constrained Agent Actions Pattern — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:49f373 -->
What is the Constrained Agent Actions pattern?
?
A safety design pattern where an LLM agent is restricted to a fixed, finite vocabulary of valid output decisions (e.g. 2–5 choices), with any invalid response automatically mapped to a safe default such as human escalation.

## Fail-Safe <!-- kb:card:6adf90 -->
What happens when an LLM agent using the Constrained Agent Actions pattern returns an unexpected or invalid response?
?
The system falls back to the safest predefined action — typically a human escalation action (e.g. `FLAG_FOR_REVIEW`). The fallback is enforced in code, not by the prompt.

## Application <!-- kb:card:50f92a -->
When would you apply the Constrained Agent Actions pattern?
?
When an LLM must make autonomous decisions in production and unconstrained output would be unsafe — e.g. anomaly handling (fix / keep / flag), content moderation (approve / reject / escalate), or incident triage (auto-remediate / page / acknowledge).

## Relationship <!-- kb:card:65399d -->
How does the Constrained Agent Actions pattern relate to the Human-in-the-Loop pattern?
?
The constrained action set always includes a human escalation option (FLAG_FOR_REVIEW). This makes HITL deterministic — the system knows exactly when to hand off to a human and never invents novel paths that bypass it.

## Contrast <!-- kb:card:c15f0c -->
How does the Constrained Agent Actions pattern differ from the ReAct Agent pattern?
?
ReAct agents have open-ended tool selection and can reason through multi-step action chains. Constrained-action agents are closed-loop: no tools, just one decision from N valid strings. Constrained is safer and more auditable; ReAct is more flexible and capable.
