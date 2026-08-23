---
tags: [flashcards, governance, architecture, enterprise, devops]
sr-due: 2026-04-15
sr-interval: 1
sr-ease: 250
---

# Platform-Baked Governance — Flashcards

#flashcards/governance

## Definition <!-- kb:card:5bbb20 -->
What is Platform-Baked Governance?
?
An architectural pattern where security, compliance, and operational controls are embedded into shared platform infrastructure (templates, scaffolding, CI/CD, base configs) so that any team building on the platform automatically inherits those controls — without needing to implement them individually.

## Core Insight <!-- kb:card:c60277 -->
What is the key insight that makes Platform-Baked Governance enable fast adoption rather than slow it?
?
When the governed path is also the easy path, developers take the governed path. Governance as friction reducer rather than friction adder. Cloudflare's MCP adoption spread quickly *because* governance was baked in — new servers take minutes to stand up, not weeks of security review.

## Checklist vs Baked <!-- kb:card:0d8699 -->
What distinguishes Platform-Baked Governance from checklist governance?
?
Checklist governance is applied after build, requires developer security knowledge, is inconsistently applied, and slows teams down. Platform-Baked Governance is inherited during build, requires zero security knowledge from developers, is uniform by construction, and adds no friction.

## MCP Example <!-- kb:card:975ed5 -->
What governance controls does Cloudflare's MCP monorepo template provide automatically?
?
Default-deny write controls, audit logging, auto-generated CI/CD pipelines, secrets management (runtime injection, no hardcoding), Cloudflare Access authentication, and global distribution — all inherited by any team that uses the template.

## Analogous Patterns <!-- kb:card:3d1b46 -->
Name three patterns analogous to Platform-Baked Governance from other domains.
?
- **Paved road** (Netflix/Spotify) — pre-built, compliant internal developer paths
- **Golden path** (Backstage/ThoughtWorks) — opinionated scaffolding for new services
- **IaC with policy** — Terraform modules with security constraints baked in; teams use the module, not raw resources

## Application to AI <!-- kb:card:f58ec6 -->
How does Platform-Baked Governance apply to AI agent deployments?
?
Build a governed agent harness template that pre-configures rate limits, PII filters, audit hooks, and access controls. Mandate that all production agents use the template. Governance happens at template design time, not per-agent review time. New agents inherit safety controls by construction.
