---
title: "MCP Extensions Architecture"
date: 2026-07-27
domain: standards
maturity: emerging
source_type: vendor-doc
topics: [mcp, protocols]
tags: [concept, mcp, protocols, architecture, ai-agents, governance, domain/standards, maturity/emerging, source-type/vendor-doc, topic/mcp, topic/protocols]
status: draft
sources:
  - url: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
    hash: sha256:41ac604fbe79fbb905ca0b2bed18394fccab871c1fd521c363c5cc913881b227
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/modelcontextprotocol/modelcontextprotocol/releases
    hash: sha256:8d8420770e0767da44376543bedb1e1480d05feb3e7b437db34061ba97f819e1
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MCP Extensions Architecture

## Definition
The governance model, promoted to first-class status in MCP **2026-07-28** (SEP-2133), under which optional protocol capabilities are packaged as independently-versioned **Extensions**: reverse-DNS-namespaced (e.g. `io.modelcontextprotocol/apps`), negotiated via an `extensions` capability map at connection time, and maintained in their own `ext-*` repositories with delegated maintainers — rather than being baked into the monolithic core spec.

## Explanation
Before this release, adding a capability to MCP meant proposing a change to the single core specification, coupling its lifecycle (and versioning, and maintainership) to everything else in the protocol. Extensions decouple that: a capability lives in its own repo, ships its own version, and is negotiated à la carte. A client and server only need to agree on the extensions they both support; unsupported extensions are simply absent from the capability map, with no core-spec churn required to add or remove one.

The first two official extensions illustrate the model at opposite ends of the spectrum:

**MCP Apps (SEP-1865)** — servers ship interactive HTML UIs that hosts render inside a **sandboxed iframe**. The key design choice is that tools declare their UI templates *ahead of time*, so hosts can prefetch, cache, and security-review the UI before anything executes — rather than trusting arbitrary HTML returned at call time. Any action a user takes inside that UI still traverses the same audit/consent path as a direct tool call; the UI is a rendering surface, not a privilege escalation.

**Tasks (demoted from core)** — the 2025-11-25 spec had an *experimental* core Tasks API for long-running work. In 2026-07-28 it's demoted to an extension, and `tasks/list` is removed outright because a task list can't be scoped safely without a protocol-level session (see [[mcp-stateless-protocol]]) — there's no session to scope "my tasks" against. Anyone who built against the experimental core API must migrate to the extension.

This pairing shows why Extensions exist as a category: MCP Apps is a genuinely new, self-contained capability that doesn't need to touch the stateless core; Tasks is an existing capability that turned out to depend on statefulness the core no longer provides. Both are better served living outside core than forcing the core to either keep sessions alive or drop the feature.

**Governance backdrop:** the release also formalizes a feature lifecycle policy — every feature moves through Active → Deprecated → Removed, with a mandatory minimum of 12 months between deprecation and earliest removal. Roots, Sampling, and Logging are the first features deprecated under this policy (not removed — still functional, just superseded).

## Key Properties
- Reverse-DNS extension IDs prevent naming collisions across independent maintainers
- Extensions are negotiated via an `extensions` capability map — absence just means "not supported," no core-spec involvement
- Each extension versions independently of the core spec and of other extensions
- MCP Apps UIs render in a sandboxed iframe with pre-declared, pre-reviewable templates — no arbitrary runtime HTML trust
- Tasks' demotion is a direct consequence of the stateless core: a feature requiring session scoping can no longer live at the core level
- Formal Active → Deprecated → Removed lifecycle with a ≥12-month floor applies protocol-wide, not just to extensions

## Relationships
- Depends on [[mcp-stateless-protocol]]: Tasks' demotion exists specifically because it can't be scoped safely without the session model the stateless core removed
- Revises [[model-context-protocol]]: extensions supersede the informal "prompt templates and sampling" primitives described in the base concept
- Related to [[plugin-extension-trust-model]]: the pre-declared/pre-reviewable UI template pattern in MCP Apps is a concrete instance of trust-model design for extensible plugin surfaces
- Related to [[shadow-mcp-detection]]: reverse-DNS extension IDs give network/audit tooling a stable namespace to detect unauthorized extension usage against

## Applications
- **Building interactive MCP tools:** use MCP Apps instead of returning raw HTML from a tool result — hosts can prefetch and security-review a declared template but not an arbitrary runtime payload
- **Long-running agent workflows:** migrate any code depending on the experimental 2025-11-25 core Tasks API (especially `tasks/list`) to the Tasks extension before the RC finalizes
- **Protocol extension design:** when proposing a new MCP capability, evaluate whether it needs core-spec statehood or can ship as an independently-versioned extension — the latter is now the preferred default
- **Deprecation planning:** any team building on Roots, Sampling, or Logging has a confirmed ≥12-month runway to migrate, not an immediate break

## Sources
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) — SEP-2133 (extensions), SEP-1865 (MCP Apps), Tasks demotion, deprecation policy
- [MCP GitHub releases](https://github.com/modelcontextprotocol/modelcontextprotocol/releases) — RC release notes and draft changelog

## See Also
- [[mcp-stateless-protocol]]
- [[model-context-protocol]]
- [[mcp-oauth-mixup-hardening]]
- [[plugin-extension-trust-model]]
- [[shadow-mcp-detection]]
