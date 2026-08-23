---
title: "Managed Agent Split-Plane Architecture"
date: 2026-06-13
domain: infrastructure
maturity: emerging
source_type: vendor-doc
topics: [patterns, enterprise]
tags: [concept, ai-agents, architecture, infrastructure, security, anthropic, cloud, sovereignty, domain/infrastructure, maturity/emerging, source-type/vendor-doc, topic/patterns, topic/enterprise]
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

# Managed Agent Split-Plane Architecture

## Definition
Managed agent split-plane architecture is a deployment model in which an AI agent's **reasoning and orchestration layer** (the control plane) runs in the provider's cloud while **tool execution and code evaluation** (the execution plane) runs in infrastructure the customer controls. The model sees inputs and outputs; the data and compute that produce those outputs never leave the customer's boundary.

## Explanation
The challenge with hosted AI agents is a classic one: you want the model's intelligence but you don't want your data or code execution leaving your network. The split-plane approach resolves the tension by dividing the agent into two planes with different trust requirements.

**Control Plane (Provider — e.g. Anthropic)**
- Hosts the LLM (Claude)
- Manages the agent reasoning loop: planning, tool selection, [[prompt-caching|prompt caching]], context compaction
- Maintains conversation history and session state server-side
- Determines what tool to call and with what arguments
- Receives tool results and continues reasoning

**Execution Plane (Customer Infrastructure)**
- Runs an `EnvironmentWorker` process on the customer's own host/container
- Claims tool execution requests from the provider's work queue
- Executes tool calls (bash, file operations, web fetch, MCP calls) locally
- Posts results back to the control plane so the model can continue
- The filesystem, spawned processes, and network egress are all in the customer's environment

```
Your App
  │ create session (API)
  ▼
Anthropic Control Plane ──── reasoning ────►
  │                                         │
  │ "run bash command X"                    │
  ▼                                         │
Your EnvironmentWorker           ◄── tool result ──┤
  │ execute locally                         │
  └─────────────────────────────────────────┘
        (your network, your filesystem)
```

**What this means in practice:**
- The agent's *code* executes in your sandbox — a Docker container, Cloudflare Worker, Modal container, etc.
- The agent's *thinking* happens at Anthropic — tool inputs/outputs are the only data that crosses the boundary
- You control network egress (the agent can reach internal services not publicly routable)
- You control filesystem contents (data under `/workspace` never leaves your host)
- Anthropic controls what the agent *decides to do* (the reasoning remains proprietary)

**Trade-off vs. fully self-hosted:**
Fully self-hosted systems like OpenClaw place orchestration *and* execution in the customer's control. Split-plane gives Anthropic sovereignty over the reasoning loop in exchange for managed convenience (automatic model updates, prompt caching, compaction, session management). The open question is whether tool *inputs/outputs* traversing Anthropic's control plane constitutes acceptable data exposure for a given compliance posture.

**Supported platforms for the execution plane:** Blaxel, Cloudflare, Daytona, E2B, GKE Agent Sandbox, Modal, Namespace, Superserve, Vercel — plus any generic Linux host with `/bin/bash`.

## Key Properties
- **Asymmetric trust model** — provider is trusted for reasoning; customer retains sovereignty over execution
- **Data gravity** — sensitive files, databases, and internal services stay on-prem; only tool I/O crosses the boundary
- **Provider-managed conveniences** — prompt caching, context compaction, model upgrades are handled by the provider without customer involvement
- **Network-transparent** — customer's execution environment can reach private, non-routable internal services
- **Beta constraints** — currently ineligible for Zero Data Retention or HIPAA BAA because tool I/O still transits the control plane

## Relationships
- Contrast with [[agent-harness]]: a fully self-hosted harness keeps *both* planes on-prem; split-plane delegates the reasoning loop to the provider
- Related to [[ai-as-control-plane]]: the provider's side is literally a cloud-hosted AI control plane; this concept describes where execution runs in relation to it
- Related to [[environment-worker-pattern]]: the customer's execution plane is implemented via the environment worker
- Related to [[mcp-server-portal]]: MCP tunnels are an independent mechanism for connecting private MCP servers to the control plane — orthogonal to but composable with split-plane execution
- Contrast with [[agentic-ai-platform-architecture]]: enterprise agentic platforms often keep everything internal; split-plane is the SaaS variant

## Applications
**Regulated industries:** Run agent tool execution inside a compliant VPC/VPN while leveraging frontier model intelligence. Audit logs stay internal.

**Internal tooling access:** Give the agent access to internal APIs (e.g., a private GitHub Enterprise or on-prem databases) without exposing them to the internet. The worker runs inside the network; the agent reaches internal endpoints directly.

**Data residency requirements:** Customer data processed by tools (file reads, database queries) stays in the declared jurisdiction. Only the tool call signature crosses the border.

**Cost-sensitive isolation:** Rather than standing up a full agent infrastructure stack, teams can use managed orchestration (cheaper ops) while maintaining execution control (cheaper compliance).

## Sources
- [Claude Managed Agents — Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) — primary source; full architecture description, worker setup, and platform guides
- [ClaudeDevs tweet thread](https://x.com/ClaudeDevs/status/2065494480837583297) — launch announcement with platform ecosystem overview

## See Also
- [[environment-worker-pattern]]
- [[sandbox-per-session-isolation]]
- [[agent-sse-event-stream]]
- [[agent-harness]]
- [[mcp-server-portal]]
- [[agentic-ai-platform-architecture]]
