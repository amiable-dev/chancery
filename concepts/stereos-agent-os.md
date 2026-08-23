---
title: "StereOS Agent OS"
date: 2026-04-29
domain: infrastructure
maturity: emerging
source_type: announcement
tags: [concept, ai-agents, security, sandbox, infrastructure, nixos, paper-compute, domain/infrastructure, maturity/emerging, source-type/announcement]
status: draft
sources:
  - url: https://github.com/papercomputeco/stereOS
    hash: sha256:905cabef744d74d809f4f0578bf4507f4a5d887645b198d7c2a019adfd49b834
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://thenewstack.io/paper-compute-agent-infrastructure/
    hash: sha256:8529036870265fb9607fa6adcfdbe80ee2c6381b086b84f75c17c1a15fc26a10
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/
    hash: sha256:5d5840265dd039f68b02b7b1f8435c3f04f7323eab1f4b8ccf982079197a0c1c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# StereOS Agent OS

## Definition
StereOS is a hardened, minimal Linux operating system (NixOS-based) purpose-built for running AI agents in isolation. Each agent runs in its own gVisor sandbox with a virtualised kernel boundary, while the host VM provides a second containment layer. Agents can install packages, spawn sub-agents, and access GPUs — all within this dual-layer isolation boundary.

## Explanation
Running AI agents directly on conventional Linux systems exposes the host to agents that escape their intended scope — whether due to bugs, prompt injection, or overly-broad tool grants. Containers help but share the host kernel; a container escape becomes a host escape. StereOS addresses this with a dedicated OS where every design choice optimises for agent isolation and operator [[observability|observability]].

**Architecture layers:**

```
Operator / Cloud Infrastructure
  └── StereOS VM (NixOS, read-only Nix store)
        └── stereosd (system daemon, control plane)
              └── agentd (agent lifecycle management)
                    └── gVisor sandbox(es)
                          └── AI Agent process(es)
```

**Key components:**

- **stereosd** — StereOS system daemon; handles VM-level lifecycle and acts as a control plane for agent operators
- **agentd** — Agent management daemon; spawns, monitors, and terminates individual agent processes within their gVisor sandboxes
- **gVisor sandbox** — Each agent runs with a virtualised kernel boundary. System calls are intercepted by gVisor's user-space kernel implementation rather than passing directly to the Linux kernel. A compromised agent cannot exploit kernel vulnerabilities.
- **Read-only Nix store** — The base filesystem is immutable. Agents cannot corrupt the system by modifying binaries or config.

**Mixtapes — pre-built agent images:**
StereOS ships as "mixtapes" — machine images that bundle the hardened OS with a specific agent binary and its dependencies. Each mixtape appends the agent binary to the `agent` user's restricted PATH. Available formats: raw EFI image, QCOW2 (for QEMU/KVM), and direct-kernel boot artifacts.

Example: `opencode-mixtape` ships the OpenCode agent binary pre-configured within StereOS, requiring only an API key to run.

**The dual-containment principle:** If an agent escapes its gVisor sandbox (extremely difficult), it is still inside the StereOS VM. Two independent containment boundaries must be broken to reach the host. This is analogous to defence-in-depth in network security — no single failure leads to full compromise.

**Sub-agent support:** Agents can spin up sub-agents within the same StereOS environment. Each sub-agent gets its own gVisor sandbox while sharing the same VM and controlled resource budget.

## Key Properties
- NixOS-based: reproducible, declarative builds; read-only immutable store
- gVisor per-agent sandbox: virtualised kernel boundary (not just namespaces/cgroups)
- Dual-layer isolation: gVisor sandbox + VM boundary
- Minimal attack surface: purpose-built, no general-purpose services
- Mixtapes: versioned, checksummed machine images per agent harness
- stereosd + agentd daemons provide operator-facing control plane

## Relationships
- Provides the sandboxed runtime for [[tapes-agent-observability]]: Tapes observes what agents do; StereOS constrains what they can do
- Addresses the [[agent-audit-gap]] from the containment side: limits blast radius of agent actions
- Stronger isolation model than Docker: relates to [[constrained-agent-actions]] (policy enforcement at OS layer, not just application)
- Builds on NixOS reproducibility principles for tamper-evident, declarative infrastructure
- Mixtape format is a specialised instance of the [[agent-harness]] concept: OS-level harness rather than runtime-level

## Applications
- **Production agent deployments** requiring containment guarantees: financial, healthcare, infrastructure automation
- **Multi-tenant agent platforms** where agents from different users must not interfere with each other
- **Parallel agent workloads** (e.g., 10 Pokémon bots, 5 lint-fixing agents) needing resource isolation
- **Compliance environments** where demonstrating containment is a regulatory requirement
- **Security research / red-teaming** where you want to observe adversarial agent behaviour without risk to the host

## Study
- Flashcards: [[flashcards/stereos-agent-os|Practice this concept]]

## Sources
- [GitHub - papercomputeco/stereOS](https://github.com/papercomputeco/stereOS) — official repository, README covers mixtapes, architecture, daemons
- [GitHub veteran Brian Douglas launches Paper Compute to fix AI agent infrastructure](https://thenewstack.io/paper-compute-agent-infrastructure/) — launch article
- [842 Lint Errors, 5 Parallel Agents, 54 Minutes](https://briandouglas.me/posts/2026/03/15/sweeper-why-agent-infrastructure-matters/) — real-world parallel agent use case

## See Also
- [[tapes-agent-observability]]
- [[agent-audit-gap]]
- [[constrained-agent-actions]]
- [[agent-harness]]
- [[zero-trust-architecture]]
- [[sandbox-per-session-isolation]]: lighter-weight Docker-per-session pattern vs. StereOS's gVisor+VM dual-containment; same isolation goal, different threat model
