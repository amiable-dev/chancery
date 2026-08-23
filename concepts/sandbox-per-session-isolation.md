---
title: "Sandbox-Per-Session Isolation"
date: 2026-06-13
domain: infrastructure
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, ai-agents, architecture, security, isolation, docker, sandbox, infrastructure, domain/infrastructure, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://e2b.dev/docs/agents/claude-managed-agents
    hash: sha256:1ed755afb2e2c15c7173c14d804502e3c5844262418567c2cc677e51d4e68092
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://x.com/ClaudeDevs/status/2065494480837583297
    hash: sha256:392195f86feda6201057beca14ae44d1fe4e347adf879be711be6e19787bf921
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Sandbox-Per-Session Isolation

## Definition
Sandbox-per-session isolation is an agent execution pattern in which each agent session is given its own ephemeral, isolated execution environment — typically a fresh container or VM — that starts with a clean filesystem, enforces resource limits, applies per-session network controls, and is destroyed (or archived) at session end. No state, secrets, or side-effects from one session can leak to another.

## Explanation
The naive way to run an [[environment-worker-pattern|environment worker]] is **in-process**: the worker executes tool calls in the worker process's own filesystem. This is fast and operationally simple, but comes with risks:

- **Filesystem bleeding** — files written or modified in one session persist and are visible to the next
- **Credential contamination** — secrets accessed or cached in one session may be readable from a subsequent session
- **Resource interference** — a runaway session (infinite loop, disk fill) can degrade or kill the worker process and all other in-flight sessions
- **Blast radius** — a malicious or buggy agent has access to the worker's full filesystem, including the environment key and any mounted secrets

Sandbox-per-session isolation solves all four by making each session's execution context throwaway.

**Container-per-session pattern (Docker):**

```
# Dockerfile: a minimal image with the ant CLI installed
FROM your-base-image
ARG ANT_VERSION=1.12.0
RUN curl -fsSL ".../ant_${ANT_VERSION}_linux_${ARCH}.tar.gz" | tar -xz -C /usr/local/bin ant
WORKDIR /workspace
VOLUME /mnt/session/outputs          # outputs survive container death
ENTRYPOINT ["ant", "beta:worker", "run"]

# spawn.sh: called once per session by the poller
#!/bin/bash
mkdir -p "/host/outputs/$ANTHROPIC_SESSION_ID"
exec docker run --rm \
  -e ANTHROPIC_SESSION_ID \
  -e ANTHROPIC_ENVIRONMENT_KEY \
  -e ANTHROPIC_WORK_ID \
  -e ANTHROPIC_ENVIRONMENT_ID \
  -v "/host/outputs/$ANTHROPIC_SESSION_ID":/mnt/session/outputs \
  --memory=2g --cpus=1.5 \          # resource limits (not shown in docs, but composable)
  your-image
```

The poller process (`ant beta:worker poll --on-work ./spawn.sh`) injects session credentials as environment variables. The container is the *only* process that holds those credentials; they are not accessible to other sessions or the host worker process itself.

**Lifecycle:**
1. Poller claims work item from queue
2. Poller execs `spawn.sh` with session env vars
3. `spawn.sh` starts a fresh container with clean `/workspace`
4. Container runs `ant beta:worker run` → handles one session end-to-end
5. Container exits (or is killed by resource limits) → Docker removes it (`--rm`)
6. Outputs survive via the bind mount at `/mnt/session/outputs`

**Platform variants:**
The same pattern is implemented differently by platform partners:
- **E2B**: Each session gets its own sandbox VM with persistent `/mnt/session` filesystem; SDK creates and destroys via `Sandbox.create()` / `sandbox.kill()`
- **Modal**: Ephemeral containers with configurable CPU/memory; session credentials injected as secrets
- **Cloudflare**: Workers + Durable Objects provide isolation at the edge; each DO instance is a clean execution context
- **Daytona / Namespace**: Workspace VMs per session; full VM-level isolation

**Output persistence strategy:**
Ephemeral containers can't persist deliverables in their own filesystem (container gone = files gone). The solution is a bind mount or volume:
- **Docker bind mount:** `-v /host/outputs/$SESSION_ID:/mnt/session/outputs`
- **Cloud storage:** Worker scripts can `aws s3 cp` or `gcloud storage cp` outputs before exiting
- **Platform native:** E2B's persistent `/mnt/session` survives sandbox destruction by design

## Key Properties
- **Clean slate guarantee** — every session starts from a known-good filesystem state; no prior session state is visible
- **Blast radius containment** — a compromised or runaway session can only affect its own container
- **Resource limits enforced** — CPU, memory, and network can be capped per session; one session cannot starve others
- **Credential scoping** — session credentials are injected into only the container that needs them; not held in a shared worker process
- **Audit-clean** — container exit logs are a natural session audit record; image digest ensures reproducible execution environment
- **Higher overhead than in-process** — container startup time (~1-5s) adds latency to session start; trade-off for the isolation guarantees

## Relationships
- Implements the execution context for [[environment-worker-pattern]]: the `--on-work spawn.sh` flag is the integration point
- Part of [[managed-agent-split-plane-architecture]]: customer-side execution plane; defines how strong the execution boundary is
- Related to [[constrained-agent-actions]]: sandbox isolation constrains *what the agent can reach*; constrained actions constrain *what outputs the agent can produce*
- Related to [[agent-budget-caps]]: resource limits (CPU, memory, wall-clock time) on containers are a runtime enforcement of agent budget caps
- Contrast with [[human-in-the-loop-pattern]]: isolation is a safety mechanism that operates without human involvement; HITL adds human gates at decision points
- Related to [[plugin-extension-trust-model]]: sandbox-per-session is a runtime trust boundary, analogous to plugin sandboxing in extension platforms

## Applications
**Multi-tenant SaaS:** Each customer's agent sessions run in isolated containers. A customer's uploaded files, API keys, and outputs are physically separated from other customers' sessions.

**Security-sensitive workloads:** Red team agents, penetration testing tools, or code analysis agents that run untrusted code need hard process and filesystem isolation. Sandbox-per-session provides this without a full VM.

**Reproducible agent execution:** Pin to a specific container image digest. Every session runs in an identical environment. Useful for debugging ("the agent worked on Tuesday, why not today?") and compliance ("we can reproduce this session exactly").

**Cost-controlled automation:** Hard memory and CPU caps prevent runaway agent sessions from burning cloud compute. Timeout enforcement ensures sessions can't run indefinitely.

**Offline deliverable retrieval:** The bind mount pattern (`/mnt/session/outputs`) allows human review of exactly what the agent produced, organised by session ID, without the agent having write access outside its designated output directory.

## Sources
- [Claude Managed Agents — Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) — primary source; Dockerfile pattern, spawn.sh example, output volume convention
- [E2B Claude Managed Agents guide](https://e2b.dev/docs/agents/claude-managed-agents) — platform-specific implementation; persistent `/mnt/session` design
- [ClaudeDevs tweet thread](https://x.com/ClaudeDevs/status/2065494480837583297) — platform ecosystem announcement

## See Also
- [[environment-worker-pattern]]
- [[managed-agent-split-plane-architecture]]
- [[constrained-agent-actions]]
- [[agent-budget-caps]]
- [[agent-audit-gap]]
- [[egress-proxy-secret-injection]]: complementary network-layer control — the sandbox isolates the process; the egress proxy isolates credential access
- [[environment-fork-primitive]]: contrasting isolation strategy — fresh-per-session isolation vs. state-sharing pre-warmed forks
- [[idle-cost-sandbox-design]]: the resource-management concern that becomes dominant once sandboxes are cheap enough to run at scale
