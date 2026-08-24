---
tags: [flashcards, security, agents, remediation, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Independent fix verification — Flashcards

#flashcards/security

## Definition <!-- kb:card:4893a1 -->
What is independent fix verification, and what tool envelope does the verifying agent operate under?
?
A verification loop closed by an agent that took no part in producing the fix; it reads the repo and the finding report under an envelope excluding command execution, network access and writes, then emits a per-finding verdict.

## Why separate identity matters <!-- kb:card:3b60f0 -->
Why can't the agent that wrote a fix also be the one that verifies it?
?
It has already concluded the fix is correct, so asking it to verify would just replay the reasoning that produced the fix — a separate verifier has to re-derive the judgement from artifacts alone.

## Why the restricted envelope matters <!-- kb:card:6b0450 -->
Why is the read-only envelope essential to the verifier's credibility, not just a safety measure?
?
With no shell it can't make a test pass by re-running or adjusting the harness, with no write access it can't repair the code it's grading, and with no network it can't be steered by fetched content — read-only is what makes the verdict mean something.

## Per-finding granularity <!-- kb:card:500c75 -->
Why does the verifier emit a verdict per finding rather than one pass/fail over a whole batch?
?
So partial remediation stays legible instead of collapsing into a single misleading result.

## The durable artifact <!-- kb:card:1147c0 -->
What artifact from the surrounding remediation discipline outlives the agent session and keeps a fixed defect from returning?
?
The failing-then-passing security test — demonstrate the exploit, turn it into a failing test, fix until it passes, confirm no regressions.
