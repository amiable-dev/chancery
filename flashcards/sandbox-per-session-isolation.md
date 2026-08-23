---
tags: [flashcards, ai-agents, architecture, security, isolation, docker]
sr-due: 2026-06-13
sr-interval: 1
sr-ease: 250
---

# Sandbox-Per-Session Isolation — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:c7a4fe -->
What is sandbox-per-session isolation?
?
An agent execution pattern where each session gets its own ephemeral, isolated environment — typically a fresh container — with a clean filesystem, enforced resource limits, per-session network controls, and destruction at session end. No state, secrets, or side-effects from one session can leak to another.

## Problems it solves <!-- kb:card:44ca12 -->
What four problems does sandbox-per-session isolation solve that in-process execution cannot?
?
1. **Filesystem bleeding** — files from one session persist and are visible to the next in in-process execution
2. **Credential contamination** — secrets cached by one session may be readable by another
3. **Resource interference** — a runaway session can degrade or kill the worker process
4. **Blast radius** — a malicious agent has access to the full worker filesystem including environment keys

## Docker pattern <!-- kb:card:623337 -->
In the Docker-based sandbox-per-session pattern, what does the spawn.sh script do?
?
Called once per session by the always-on poller. It creates a session-specific output directory, then `exec docker run --rm` with the session credentials injected as environment variables (-e flags) and the output directory bind-mounted to `/mnt/session/outputs`. The container handles the session and exits cleanly; `--rm` removes it automatically.

## Output persistence <!-- kb:card:418fd2 -->
How are session deliverables preserved when the container is ephemeral and destroyed at session end?
?
Via a bind mount: a host directory (e.g. `/host/outputs/$SESSION_ID`) is mounted to `/mnt/session/outputs` inside the container. Files written to that path survive container destruction because they exist on the host filesystem, not inside the container layer.

## Trade-off vs in-process <!-- kb:card:528e16 -->
What is the main cost of sandbox-per-session isolation compared to in-process execution?
?
Container startup latency (~1-5 seconds) adds overhead to every session start. In-process execution begins tool calls immediately. The isolation guarantees (clean filesystem, resource limits, credential scoping) are the trade-off for that latency cost.

## Relationship to agent-budget-caps <!-- kb:card:09923e -->
How does sandbox-per-session isolation relate to agent budget caps?
?
Resource limits (CPU, memory, wall-clock timeout) enforced on the per-session container are a runtime enforcement of [[agent-budget-caps]]. Rather than soft guidance in a prompt, the container's resource constraints are hard limits the OS enforces regardless of what the agent attempts to do.
