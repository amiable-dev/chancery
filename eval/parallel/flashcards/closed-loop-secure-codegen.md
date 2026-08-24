---
tags: [flashcards, security, ai-native-sdlc, agents, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Closed-loop secure code generation — Flashcards

#flashcards/security

## Definition <!-- kb:card:6de507 -->
What does closed-loop secure code generation move, and where does it move it to?
?
It moves security guidance out of documents developers are asked to follow and into the instruction files and shared skills a coding agent loads automatically every session — so a rule shapes code at the moment it's written, not after the fact.

## What closes the loop <!-- kb:card:b09c70 -->
What makes this practice a "loop" rather than just automated guidance delivery?
?
Every newly discovered bug class is treated as an edit to the instructions themselves — remediation is not just the patch, but writing the finding back into the instruction that produced the vulnerable code, so it becomes a standing control against recurrence.

## Concurrent review <!-- kb:card:175a6d -->
How has the review step evolved beyond running as the agent's last action before opening a pull request?
?
A security-guidance plugin can now run concurrently with generation, reading the conversation and code as they're produced and repairing issues in the same session — collapsing the discover-and-fix interval to nothing.

## Enforcement placement <!-- kb:card:8eb217 -->
What are the three points at which this control can be enforced, from weakest to strongest?
?
An instructed step the agent may skip; a hard pre-tool-use gate that blocks until review runs; or a gate held further downstream in CI.

## Dual-edged channel <!-- kb:card:dd19ad -->
Why is the same auto-loading channel that makes this control reliable also a liability?
?
A convention file shapes generated code just as reliably when an attacker, rather than the security team, is the one who wrote it — the channel's reliability is exactly what makes it worth attacking.
