---
tags: [flashcards, ai-agents, reliability, operations, domain/reliability, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Production reliability for stateful agents — Flashcards

#flashcards/ai-agents

## Stateful agent reliability: definition <!-- kb:card:d360e1 -->
Why do stateful agents need a different reliability discipline than ordinary services?
?
Their errors compound rather than degrade — one failed step doesn't spoil a single response, it redirects the whole trajectory and changes every decision after it.

## Resume vs restart <!-- kb:card:42a163 -->
Why must a failed stateful agent resume from the point of failure rather than restart?
?
Restarting discards the accumulated trajectory, which is expensive to lose at agent run lengths — state, not just output, would be lost.

## Splitting the recovery mechanism <!-- kb:card:76d12e -->
How does recovery split between deterministic mechanisms and the model itself?
?
Deterministic mechanisms (retry logic, regular checkpoints) handle what can be handled by rule; the model handles the rest by adapting when informed a tool is failing.

## What must be traced <!-- kb:card:fff9ec -->
Why is tracing requests and latencies insufficient for debugging a stateful agent, and what must be traced instead?
?
Runs are non-deterministic even from identical prompts, so the agent's decision pattern and interaction structure must be traced, not just spans and latencies.

## Deployment hazard for stateful agents <!-- kb:card:871d9f -->
Why can't a stateful agent system deploy via a clean cutover, and what must it do instead?
?
Agents run almost continuously, so at any deploy some are mid-process; the system must shift traffic gradually with both versions live instead of cutting over.

## Synchronous subagent trade-off <!-- kb:card:7f0fbb -->
What trade-off does executing subagents synchronously create, and why is asynchrony deferred?
?
Synchronous execution simplifies coordination but blocks on the slowest worker and prevents mid-flight steering; asynchrony is deferred because result coordination, state consistency, and error propagation all get harder.
