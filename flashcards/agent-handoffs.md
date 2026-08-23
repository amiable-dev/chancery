---
tags: [flashcards, ai-agents, multi-agent, coordination]
sr-due: 2026-06-23
sr-interval: 1
sr-ease: 250
---

# Agent Handoffs — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:f56707 -->
What is an agent handoff?
?
A **compressed summary** passed between agents in a multi-agent pipeline that gives the receiving agent enough context to proceed without access to the originating agent's full conversation history. Handoffs occur at the seams between agents — and those seams are where multi-agent work most frequently breaks.

## Why compress? <!-- kb:card:08acfe -->
Why must handoffs be compressed rather than passing full conversation history?
?
- The receiving agent's context window is isolated; it cannot read the sender's history
- Passing full history would exhaust the receiver's token budget
- An over-detailed handoff causes context rot in the receiver from the start
- Rule of thumb: if the handoff is more than a few paragraphs, the agent split is probably wrong

## Good handoff contents <!-- kb:card:676e01 -->
What five elements should a good agent handoff contain?
?
1. **Goal achieved** — what the originating agent accomplished
2. **Key outputs** — file references, decisions made, external state changes
3. **Open questions** — what the receiver needs to resolve
4. **Constraints discovered** — anything that limits the next agent's work
5. **Failure modes** — approaches tried that didn't work (prevent receiver from repeating them)

## Seam risk <!-- kb:card:750672 -->
Why are agent handoff seams the most fragile part of multi-agent pipelines?
?
Information loss in compression — the sender decides what's important; crucial context may be omitted. Implicit assumptions aren't surfaced. The receiver may not find files that were written if they're not enumerated in the handoff. Format mismatches between what the sender produces and what the receiver expects.

## Relationship <!-- kb:card:62eec1 -->
How do handoffs relate to agent state?
?
Handoffs bridge isolated context windows using **external state**. Files written by the originating agent are reachable by the receiver without being in the handoff itself — the handoff just needs to name them. This is why well-designed handoffs reference file paths rather than embedding content.
