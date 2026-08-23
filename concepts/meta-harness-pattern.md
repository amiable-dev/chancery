---
title: "Meta-Harness Pattern"
date: 2026-06-15
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [multi-agent, orchestration, patterns]
tags: [concept, ai-agents, architecture, multi-agent, composition, infrastructure, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/multi-agent, topic/orchestration, topic/patterns]
status: draft
sources:
  - url: https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents
    hash: sha256:eee5c508eee013757287696ecc1d5830cbfc69f32ed34de21b9b69c7e23b614b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/
    hash: sha256:5707fa676606086cf31b8ff4282f139c2bbe641871fb90d7e8ed42c43f77ae9c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/omnigent-ai/omnigent
    hash: sha256:bf7244c586fd77af2b22081227fa05b0c261c7a132ea57c0e1a6e8e45b138cdc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Meta-Harness Pattern

## Definition
A **meta-harness** is an architectural layer that sits above individual [[agent-harness|agent harnesses]] (e.g. Claude Code, Codex, Pi) and provides a unified interface for composition, governance, and collaboration across them — without modifying the harnesses themselves. The meta-harness treats each underlying harness as an interchangeable, swappable part of a richer system.

## Explanation
The problem the meta-harness solves is siloing: each agent harness understands only its own sessions, its own context, and its own controls. Engineers working with multiple agents must manually copy-paste context between tools, re-implement policies per harness, and coordinate collaboration through ad-hoc channels like Docs and Slack.

**The key architectural insight (from Databricks/Omnigent):**
> "However a harness calls its model internally, the user-facing interface is the same: messages and files go in, text streams and tool calls come out."

This uniformity at the user-facing boundary means a single wrapper API can sit above *all* harnesses without needing to understand their internals. The meta-harness normalises this boundary and builds on top of it.

### The Three Layers

```
┌──────────────────────────────────────────────────────┐
│                   META-HARNESS                        │
│   Policies │ Shared sessions │ Composition │ Sandbox  │
├──────────────────────────────────────────────────────┤
│  Claude Code │ Codex │ Pi │ OpenAI Agents │ Custom   │
│                   (Agent Harnesses)                   │
├──────────────────────────────────────────────────────┤
│              LLM Models (Claude, GPT, etc.)           │
└──────────────────────────────────────────────────────┘
```

**What the meta-harness adds:**
- **Composition** — orchestrate multiple harnesses together; switch between them with one-line changes in config (e.g. change `harness: claude-sdk` to `harness: codex`)
- **Governance** — [[stateful-contextual-policy|stateful contextual policies]] that track agent actions across time and enforce guardrails without relying on prompts
- **Collaboration** — [[live-agent-session-sharing|live session sharing]] across terminal, web, desktop, and mobile simultaneously

**Omnigent (Databricks, Apache 2.0)** is the first open-source implementation of this pattern. It wraps both terminal-based coding agents and SDK-based agents behind a common API and adds a policy/sharing server.

### Analogy to Infrastructure Abstraction
The pattern parallels shifts in systems infrastructure:
- Just as Kubernetes sits above individual containers and manages a *fleet*, a meta-harness sits above individual agents and manages a *team*
- Just as Terraform abstracts provider-specific APIs behind declarative config, the meta-harness abstracts harness-specific interfaces behind a common YAML definition
- Just as a service mesh adds cross-cutting concerns (auth, observability, retries) without modifying each service, the meta-harness adds cross-cutting agent concerns without modifying each harness

### Custom Agents Are YAML
In the meta-harness model, a custom agent is a short declarative file specifying: prompt, harness, tools, and optional sub-agents. Changing the harness is a one-line swap:

```yaml
name: my_analyst
prompt: You are a helpful data analyst.
executor:
  harness: codex          # change to: claude-sdk, pi, openai-agents, etc.
tools:
  researcher:
    type: agent
    prompt: Search for relevant information and summarize it.
```

## Key Properties
- **Harness-agnostic** — does not depend on or favour any single harness; all are interchangeable
- **Non-invasive** — wraps harnesses without modifying them; zero changes to Claude Code or Codex required
- **Additive governance** — policies, policies, and sharing live at the meta-harness layer, not inside individual harnesses
- **Session-persistent** — a single session is reachable across terminal, web, mobile, and API simultaneously
- **Policy-separated from prompts** — guardrails enforced programmatically in the policy layer, not embedded in the system prompt (where they can be overridden or drift)

## Relationships
- Builds on [[agent-harness]]: meta-harness presupposes the existence of individual harnesses it wraps
- Enables [[stateful-contextual-policy]]: the meta-harness layer is where stateful policies live
- Enables [[live-agent-session-sharing]]: the meta-harness server provides the shared session endpoint
- Enables [[cross-vendor-agent-review]]: the meta-harness can compose harnesses from different vendors in one orchestration
- Related to [[supervisor-agent-pattern]]: the meta-harness often *is* the supervisor, with individual harnesses as workers
- Related to [[multi-agent-systems]]: meta-harness is one implementation model for multi-agent coordination
- Related to [[agentic-ai-platform-architecture]]: the meta-harness is a new distinct layer in the agentic platform stack, above harnesses but below the user
- Related to [[managed-agent-split-plane-architecture]]: both patterns separate *what the agent does* from *how it is controlled*; managed agents split on provider/customer boundary; meta-harness splits on harness/governance boundary
- Contrast with [[agent-memory-lock-in]]: meta-harness explicitly solves lock-in by making harnesses interchangeable

## Applications
**Multi-agent coding orchestration:** The Polly pattern — one orchestrator plans a task, delegates to parallel sub-agents (Claude Code, Codex, Pi) in separate git worktrees, routes each diff to a [[cross-vendor-agent-review|cross-vendor reviewer]], then merges. No single harness can do this alone.

**Vendor hedging:** Use frontier model harnesses for complex reasoning, open-source harnesses for cost-sensitive bulk work, all under one policy and session surface.

**Team collaboration:** Share a live coding agent session by URL so engineers can co-drive, comment on intermediate outputs, or take over without copy-pasting context.

**Enterprise governance:** Apply organisation-wide budget limits, approval gates, and audit logging at the meta-harness layer rather than re-implementing controls in each harness.

**Cloud sandboxed execution:** Launch disposable sandboxes on Modal or Daytona without local laptop setup — the meta-harness abstracts the infrastructure.

## Sources
- [Introducing Omnigent: A Meta-Harness to Combine, Control and Share Your Agents (Databricks Blog)](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) — primary source; introduces the concept and architecture
- [Databricks Open-Sources Omnigent (MarkTechPost)](https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/) — comprehensive overview with comparison table
- [Omnigent GitHub (Apache 2.0)](https://github.com/omnigent-ai/omnigent) — source code; YAML spec for agents and policies

## See Also
- [[agent-harness]]
- [[stateful-contextual-policy]]
- [[live-agent-session-sharing]]
- [[cross-vendor-agent-review]]
- [[egress-proxy-secret-injection]]
- [[supervisor-agent-pattern]]
- [[multi-agent-systems]]
- [[agentic-ai-platform-architecture]]
