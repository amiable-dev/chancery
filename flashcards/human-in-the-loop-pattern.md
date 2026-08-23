---
sr-due: 2026-04-14
sr-ease: 250
sr-interval: 1
tags:
- flashcards
- ai-agents
- patterns
- safety
---


# Human-in-the-Loop Pattern (HITL) — Flashcards

#flashcards/ai-agents


## Definition <!-- kb:card:225b1b -->
What is the Human-in-the-Loop (HITL) pattern?
?
An agentic architecture pattern that inserts explicit human review or approval checkpoints into autonomous agent workflows. The agent pauses at defined points, presents the decision to a human, and waits for their input before continuing. Combines AI efficiency with human oversight for high-stakes or ambiguous decisions.

## Checkpoint Types <!-- kb:card:33e4cb -->
What are the four main types of HITL checkpoints?
?
1. **Approval gates** — agent proposes an action and waits for human confirmation before executing
2. **Ambiguity resolution** — agent lacks confidence and escalates to human judgment
3. **Review and correction** — agent produces a draft; human edits before workflow continues
4. **Exception handling** — unexpected error or edge case the agent can't resolve autonomously

## Calibration <!-- kb:card:7ae5fe -->
What's the risk of miscalibrated HITL?
?
- **Too many checkpoints** → humans become the bottleneck; automation efficiency disappears
- **Too few checkpoints** → unacceptable autonomous risk in production
Calibration should be risk-proportional: routine low-stakes decisions run autonomously; high-stakes or irreversible actions require HITL.
<!--SR:!2026-04-15,1,230-->

## ReAct Integration <!-- kb:card:47f24d -->
How does HITL integrate with the ReAct pattern?
?
As a breaking condition: when `should_terminate()` detects an escalation signal (e.g., `"ERROR" + "ESCALATE"` in a tool result), the ReAct loop breaks and routes to a human queue rather than continuing to iterate autonomously.

## OpenClaw Example <!-- kb:card:0e0116 -->
How does OpenClaw implement HITL?
?
The `/approve` command for elevated exec is a HITL pattern: the agent proposes a potentially destructive shell command, pauses, and requires explicit human approval before executing. The agent cannot self-approve or bypass this gate.
