---
tags: [flashcards, ai-agents, knowledge-management, skills, learning, infrastructure]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Agent Session Distillation — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:5d62af -->
What is agent session distillation?
?
The process of extracting reusable, transferable knowledge — skills, procedures, or reference examples — from successful agent session records. Rather than discarding completed session data, distillation mines sessions for patterns encoding *how* a successful outcome was achieved, making that knowledge replayable and composable.

## Dead Tokens Into Skills <!-- kb:card:5d0fa4 -->
What does Brian Douglas mean by "dead tokens into skills"?
?
Completed agent sessions consumed tokens and produced value. Distillation processes those "dead" sessions into reusable skills that can be replayed without re-incurring the full inference cost — turning spent compute into durable organizational knowledge.

## What Gets Extracted <!-- kb:card:72d25b -->
What four types of knowledge are extracted during agent session distillation?
?
1. **Procedure skills** — "To accomplish X, take steps A → B → C" from successful tool-call sequences
2. **Prompt patterns** — phrasings that reliably produced correct tool invocations
3. **Error recovery patterns** — what recovery actions succeeded when a step failed
4. **Domain knowledge** — facts and context assembled during the session, useful for seeding future agent context

## Prerequisite <!-- kb:card:9c1290 -->
What is the key prerequisite for agent session distillation?
?
Durable, structured session capture (e.g., Tapes). Without complete session records, there is nothing to distill. Only successful or explicitly curated sessions should enter the distillation pipeline.

## Human Benefit <!-- kb:card:7ab071 -->
How does agent session distillation help human engineers?
?
New engineers onboard by replaying distilled skills from real sessions instead of reading documentation. The session replay is a living example of how the system *actually behaves*, not how it was designed to behave — auto-derived documentation rather than manually authored runbooks.

## Feedback Loop <!-- kb:card:6cbcbd -->
What feedback loop does agent session distillation create?
?
Better agents generate better sessions → better sessions produce better skills → better skills prime future agents → those agents generate even better sessions. This creates a compounding improvement cycle that reduces redundant inference cost over time.
