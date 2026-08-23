---
tags: [flashcards, agentic-note-taking, ai-agents, llm, memory]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Agentic Note-Taking — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:d693b1 -->
What is agentic note-taking?
?
A technique where an AI agent proactively writes structured notes to persistent external memory during task execution, then reads those notes back into context in future inference steps — enabling coherent behaviour across context window boundaries without relying on full context preservation.

## What to capture <!-- kb:card:65bb36 -->
What kinds of information should an agent typically capture in its notes?
?
- Progress state (completed, in-progress, blocked)
- Decision log (decisions made and reasoning, to prevent re-litigating)
- Dependency tracking (what's waiting on the current task)
- Discovered information (key facts found during exploration)
- Tactical strategies (what approaches work/don't work in this environment)

## Pokémon example <!-- kb:card:9ca271 -->
What did Claude's Pokémon-playing agent demonstrate about agentic note-taking?
?
Without explicit prompting about memory structure, the agent spontaneously developed precise step tallies, explored region maps, achievement checklists, and combat strategy notes. After context resets, it read its own notes and continued multi-hour training sequences — demonstrating that proactive note-taking enables long-horizon strategies impossible with in-context memory alone.

## Relationship <!-- kb:card:725359 -->
How does agentic note-taking relate to context compaction?
?
They're complementary: note-taking is proactive (agent maintains external notes throughout the task, reducing what compaction needs to preserve), while compaction is reactive (fires when context fills, summarising what happened). Well-maintained notes make compaction more reliable and less lossy.

## OpenClaw connection <!-- kb:card:145659 -->
How does OpenClaw implement the agentic note-taking pattern?
?
Via MEMORY.md, SOUL.md, AGENTS.md, and daily memory files (memory/YYYY-MM-DD.md). These are persistent notes that the agent reads at session start and updates throughout — exactly the same pattern as Claude Code's TODO.md, formalised as the harness's bootstrap architecture.
