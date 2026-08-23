---
tags: [flashcards, ai-agents, architecture, patterns, infrastructure]
sr-due: 2026-06-13
sr-interval: 1
sr-ease: 250
---

# Environment Worker Pattern — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:8a4e9b -->
What is the environment worker pattern?
?
A process running on the customer's infrastructure that claims work items from a provider-managed queue, spawns an isolated execution context for each agent session, runs tool calls locally, and posts results back. The worker owns execution lifecycle; the provider owns the reasoning loop and work queue.

## Work item lifecycle <!-- kb:card:b64834 -->
What are the steps in an environment worker's session handling cycle?
?
1. App creates session → enqueued on the environment
2. Worker polls queue → claims session as a work item
3. Worker downloads agent skills → places in /workspace/skills/
4. Worker spawns execution context (in-process or container)
5. Control plane sends tool call → worker executes locally
6. Worker posts tool result back
7. Steps 5-6 repeat until session complete
8. Execution context cleaned up

## Two polling modes <!-- kb:card:85edcc -->
What are the two polling modes for an environment worker and when do you use each?
?
**Always-on:** Long-running process polls continuously. Simple; always ready; only needs outbound HTTPS. Cost: idle resource usage.
**Webhook-triggered:** Wakes on `session.status_run_started` event, then polls. Cost: requires a publicly reachable webhook endpoint. Benefit: zero idle resource cost.

## Authentication split <!-- kb:card:bdf4af -->
Why does the environment worker use an environment key separate from the Claude API key?
?
The environment key authenticates the worker to its work queue only. The worker host doesn't need to hold the full Claude API key (which creates sessions and has broader API access). This limits the blast radius if the worker host is compromised.

## Skills download <!-- kb:card:97672e -->
What happens to agent skills before tool execution begins in the worker pattern?
?
The worker downloads the agent's skills (reusable filesystem-based resources: prompt files, scripts, reference data) and places them under `<workdir>/skills/<name>/`. The agent's system prompt already references these paths, so no runtime discovery is needed.

## Relationship to sandbox-per-session <!-- kb:card:94ddf2 -->
How does the environment worker pattern relate to sandbox-per-session isolation?
?
The worker pattern defines *how sessions are claimed and orchestrated*; sandbox-per-session defines *where tool execution happens*. The two combine via the `--on-work spawn.sh` flag: the worker's poller executes a spawn script that starts a fresh Docker container for each session, implementing the isolation guarantee.
