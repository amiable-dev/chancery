---
title: "Environment Worker Pattern"
date: 2026-06-13
domain: infrastructure
maturity: emerging
source_type: practitioner
topics: [patterns, orchestration]
tags: [concept, ai-agents, architecture, patterns, infrastructure, distributed-systems, queue-based, domain/infrastructure, maturity/emerging, source-type/practitioner, topic/patterns, topic/orchestration]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://x.com/ClaudeDevs/status/2065494480837583297
    hash: sha256:392195f86feda6201057beca14ae44d1fe4e347adf879be711be6e19787bf921
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Environment Worker Pattern

## Definition
The environment worker pattern is an agent execution model in which a long-running or webhook-triggered process on the customer's infrastructure **claims work items from a provider-managed queue**, spawns an isolated execution context for each session, runs tool calls locally within that context, and posts results back to the provider's control plane. The worker owns the execution lifecycle; the provider owns the work queue and reasoning loop.

## Explanation
In [[managed-agent-split-plane-architecture]], the customer side needs a process that bridges the provider's reasoning engine to the customer's local execution environment. That bridge is the environment worker.

**Work item lifecycle:**

```
1. Your app creates a session → session is enqueued on the environment
2. EnvironmentWorker polls the queue → claims the session as a work item
3. Worker downloads agent skills → copies to /workspace/skills/<name>/
4. Worker spawns an execution context (in-process or new container)
5. Control plane sends tool call: { "tool": "bash", "input": "ls -la" }
6. Worker executes the call locally → captures stdout/stderr/exit code
7. Worker posts result back → control plane feeds it to the model
8. Steps 5-7 repeat until the session is complete
9. Worker signals completion → execution context cleaned up
```

**Two polling modes:**

| Mode | Implementation | Trade-off |
|------|---------------|-----------|
| **Always-on** | Long-running process polls queue continuously | Simplest; always ready; needs only outbound HTTPS; idle resource cost |
| **Webhook-triggered** | Wakes on `session.status_run_started` event; starts polling | No idle resource cost; requires a publicly reachable webhook endpoint |

**Two execution contexts:**

| Context | Isolation | Use case |
|---------|-----------|----------|
| **In-process** | Shared filesystem with the worker host | Lowest overhead; acceptable when sessions can share a workspace |
| **Sandbox-per-session** | Fresh Docker container per session | Stronger isolation; clean filesystem; resource limits; network controls per session → see [[sandbox-per-session-isolation]] |

**Skills download:** Before tool execution begins, the worker fetches the agent's skills (reusable filesystem-based resources — prompt files, scripts, reference data) and places them under `<workdir>/skills/<name>/`. The agent's system prompt already references these paths; no runtime discovery is needed.

**Authentication:**
- Worker authenticates to the queue with an **environment key** (generated in the Console, scoped to this environment)
- Sessions are created by your app using a standard **Claude API key**
- The two keys are intentionally separate — the worker host need not hold the full API key

**CLI vs SDK:**
```bash
# CLI: always-on, in-process
ant beta:worker poll --workdir /workspace

# CLI: always-on, sandbox-per-session
ant beta:worker poll --on-work ./spawn.sh

# SDK: either mode, more configuration surface
EnvironmentWorker(environment_id=..., on_work=handler)
```

**Filesystem conventions:**
- `/workspace` — working directory; skills, code, intermediate files
- `/mnt/session/outputs` — final deliverables; bind-mount a host directory here to retrieve outputs after session exit

## Key Properties
- **Pull-based** — worker pulls from queue; provider pushes tool calls to the claimed session (avoids firewall-hostile inbound connections)
- **Stateless worker process** — the worker itself holds no session state; all session state is server-side. The worker can restart mid-session and resume by re-claiming the work item
- **Execution context ownership** — the worker decides how to isolate each session: in-process, Docker, or any sandbox platform
- **Skills locality** — skills are downloaded per-session; the worker always has a fresh, correct copy
- **Graceful shutdown** — CLI and SDK workers drain in-flight tool calls before stopping on SIGTERM/SIGINT

## Relationships
- Implements the execution plane in [[managed-agent-split-plane-architecture]]: the worker is the concrete mechanism of the split
- Related to [[sandbox-per-session-isolation]]: the `--on-work spawn.sh` pattern is a direct instantiation of sandbox-per-session
- Related to [[event-driven-dormancy]]: webhook-triggered workers implement dormancy at the process level — completely idle when no sessions are running
- Related to [[agent-session-distillation]]: the outputs written to `/mnt/session/outputs` are the raw material for distillation
- Related to [[human-in-the-loop-pattern]]: webhook-triggered mode allows human approval gates to precede session launch (approve → create session → trigger worker)

## Applications
**Compliance-constrained workloads:** A worker inside a compliance boundary (PCI DSS, FedRAMP zone) ensures tool execution and output data never leave that zone.

**Internal network access:** Worker runs inside a corporate VPN; agent can reach internal APIs (e.g., private GitHub Enterprise, on-prem databases, internal wikis) that are not publicly routable.

**Resource-efficient scale-out:** Webhook-triggered workers stay dormant until a session starts, then scale up on-demand. Well-suited for workloads with bursty session patterns.

**Multi-tenant isolation:** Run one worker per customer tenant, each with its own environment key and isolated workspace. Sessions from different tenants cannot share filesystem state.

**Cost analysis workloads:** Run tool execution (bash, file ops) on lower-cost compute; leave the expensive inference to Anthropic's managed Claude.

## Sources
- [Claude Managed Agents — Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) — primary source; full worker setup, CLI/SDK options, filesystem conventions
- [ClaudeDevs tweet thread](https://x.com/ClaudeDevs/status/2065494480837583297) — launch announcement; platform partner guides

## See Also
- [[managed-agent-split-plane-architecture]]
- [[sandbox-per-session-isolation]]
- [[agent-sse-event-stream]]
- [[event-driven-dormancy]]
- [[agent-session-distillation]]
- [[environment-fork-primitive]]: the infrastructure change that would let a worker fork from a pre-loaded parent instead of paying full setup cost per session
