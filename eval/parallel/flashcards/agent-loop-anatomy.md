---
tags: [flashcards, ai-agents, reliability, architecture, domain/ai-agents, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Anatomy of a reliable agent loop — Flashcards

#flashcards/ai-agents

## The five parts of a reliable agent loop <!-- kb:card:28d779 -->
What five parts make up the anatomy of a reliable agent loop?
?
A mechanically testable goal, tools that genuinely touch the environment, context compaction, termination/escalation logic with several independent exits, and error handling that separates recoverable failures from hard blockers.

## The bounded loop's four steps <!-- kb:card:1b78ed -->
What four steps does the agent loop's skeleton run each iteration, before compacting and checking exhaustion?
?
Reason about the state, choose one concrete action, execute it against the environment, and fold the result back into state.

## Why termination needs layered exits <!-- kb:card:32e2c1 -->
Why does reliable termination need more than just a verifier check?
?
A verifier alone cannot catch a dead end, so layered exits are needed: verified success, a hard iteration ceiling, a token or wall-clock budget, and no-progress detection — each catches a case the others miss.

## Why compaction determines survival <!-- kb:card:3e76d0 -->
Why does how compaction works matter for whether a loop finishes real work?
?
Whether it summarizes old steps into shorter notes or drops them outright determines whether the loop survives long enough to finish, rather than overflowing its context window or degrading as the transcript grows.

## Tools as the source of trustworthy feedback <!-- kb:card:7c114e -->
Why is a loop's feedback only as trustworthy as its tools?
?
The model sits in the middle as a fixed component; an agent that reasons well but cannot run its own code against the real environment is just guessing with extra steps.

## Error handling: recoverable vs hard blocker <!-- kb:card:10d7d3 -->
What must an agent loop's error handling distinguish, and why does it matter?
?
A recoverable failure from a hard blocker, so a retry is deliberate adaptation to a transient problem rather than the loop spinning uselessly on one it cannot fix.
