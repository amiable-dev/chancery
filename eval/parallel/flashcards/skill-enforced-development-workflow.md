---
tags: [flashcards, ai-agents, software-process, tdd, domain/software-engineering, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Skill-enforced development workflow — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:6a4b22 -->
What is a "skill-enforced development workflow," and how does it differ from process guidance placed in a prompt?
?
A software process (spec, decompose into judgement-free tasks, implement test-first, review, land) encoded as a chain of agent skills that trigger automatically at phase boundaries — mandatory files the agent must consult when it reaches each phase, rather than prompt-based advice that a long session drifts away from.

## Bootstrap mechanism <!-- kb:card:dad996 -->
What single standing rule does the session-start bootstrap instruction establish, and when is it re-injected?
?
Check for a relevant skill before starting any task; on harnesses that expose the hook, it is re-injected after context compaction too.

## Planning skill granularity <!-- kb:card:465a3f -->
How granular are the tasks the planning skill produces, and who are they written for?
?
Tasks of a few minutes each, carrying exact file paths, complete code, and verification steps — written explicitly for "an enthusiastic junior engineer with no judgement and no project context," i.e. specified until execution requires no judgement at all.

## Fresh subagent per task <!-- kb:card:c7d5d0 -->
Why does implementation dispatch a fresh subagent per task with two-stage review, rather than one continuous session?
?
So working context never accumulates across tasks — the plan, not the transcript, carries continuity, enabling hours of unattended progress without transcript drift. The two review stages check spec compliance first, then code quality.

## Test-first enforcement <!-- kb:card:39dd9f -->
How is test-first development enforced in this workflow, as opposed to merely recommended?
?
Destructively: any code written before its failing test exists is deleted.

## Portability across harnesses <!-- kb:card:d435b9 -->
Why is this methodology portable across many different agent harnesses?
?
The whole process ships as a set of skill files rather than harness-specific code, so it installs into a dozen unrelated harnesses through each one's own plugin mechanism, and it is testable via a meta-skill for authoring skills plus an eval harness that exercises skill behaviour.
