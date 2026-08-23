---
tags: [flashcards, ai-agents, security, sandbox, infrastructure, nixos, paper-compute]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# StereOS Agent OS — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:d6b047 -->
What is StereOS?
?
A hardened, minimal Linux operating system (NixOS-based) purpose-built for running AI agents in isolation. Each agent runs in its own gVisor sandbox with a virtualised kernel boundary, while the host VM provides a second containment layer — dual-layer isolation for agent workloads.

## Architecture Layers <!-- kb:card:87dd57 -->
What are the key architecture layers in StereOS from outer to inner?
?
1. **StereOS VM** (NixOS, read-only Nix store)
2. **stereosd** — system daemon / control plane
3. **agentd** — agent lifecycle management daemon
4. **gVisor sandbox(es)** — virtualised kernel boundary per agent
5. **AI Agent process(es)** — the actual agent running inside

## Dual-Containment Principle <!-- kb:card:160654 -->
What is the dual-containment principle in StereOS?
?
If an agent escapes its gVisor sandbox (extremely difficult), it is still inside the StereOS VM. Two independent containment boundaries must be broken to reach the host — analogous to defence-in-depth in network security, where no single failure leads to full compromise.

## gVisor vs Containers <!-- kb:card:160011 -->
Why does StereOS use gVisor instead of standard containers?
?
Standard containers share the host kernel — a container escape becomes a host escape. gVisor provides a virtualised kernel boundary where system calls are intercepted by a user-space kernel implementation rather than passing directly to the Linux kernel, so a compromised agent cannot exploit kernel vulnerabilities.

## Mixtapes <!-- kb:card:ce8537 -->
What are StereOS "mixtapes"?
?
Pre-built machine images that bundle the hardened StereOS with a specific agent binary and its dependencies. Each mixtape appends the agent binary to the `agent` user's restricted PATH. Available in raw EFI, QCOW2, and direct-kernel boot formats. Example: `opencode-mixtape` ships OpenCode pre-configured.

## Relationship to Tapes <!-- kb:card:05014d -->
How do StereOS and Tapes complement each other?
?
They address different sides of the Agent Audit Gap: **Tapes** observes what agents do (session capture, audit trail), while **StereOS** constrains what agents *can* do (sandboxed execution, limited blast radius). Together: "Tapes shows you what happened. StereOS makes sure it can't go further than it should."
