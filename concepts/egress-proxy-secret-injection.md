---
title: "Egress Proxy Secret Injection"
date: 2026-06-15
domain: security
maturity: emerging
source_type: practitioner
topics: [patterns]
tags: [concept, ai-agents, security, architecture, secrets-management, network, sandbox, domain/security, maturity/emerging, source-type/practitioner, topic/patterns]
status: draft
sources:
  - url: https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents
    hash: sha256:eee5c508eee013757287696ecc1d5830cbfc69f32ed34de21b9b69c7e23b614b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://omnigent.ai/docs/omnibox
    hash: sha256:7e4aba8c51ff366e2cf6e0bd1a77e87934aba7268222a0f6ccaeb57f8ed0d987
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/
    hash: sha256:5707fa676606086cf31b8ff4282f139c2bbe641871fb90d7e8ed42c43f77ae9c
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Egress Proxy Secret Injection

## Definition
**Egress proxy secret injection** is a security pattern in which credentials and secrets are withheld from the agent entirely, and instead inserted into outbound network requests by a transparent proxy that sits between the agent's sandbox and the external network — so the agent can make authenticated API calls without ever possessing or seeing the secrets it uses.

## Explanation
The conventional approach to giving an agent credentials is to inject them as environment variables or context: `GITHUB_TOKEN=xxx` in the agent's shell, or the token listed in the system prompt. The agent then includes this token in API requests it constructs.

The problem: the agent now *has* the secret. Any of the following can expose it:
- The agent logs its environment to a file or output
- A malicious prompt injection tricks the agent into echoing the token
- The agent is in a shared sandbox and another session reads environment variables
- The model includes the token in a generated code snippet that ends up in a PR

**Egress proxy secret injection eliminates this attack surface entirely.** The agent never receives the token. The proxy holds it.

### How It Works

```
Agent sandbox                  Egress proxy              GitHub API
┌────────────────┐            ┌─────────────────┐       ┌──────────┐
│                │  HTTP GET  │                 │ Auth: │          │
│   Agent        │──────────→ │  Intercepts     │ Token │  GitHub  │
│   (no token)   │            │  Inspects URL   │──────→│          │
│                │            │  Injects token  │       │          │
│                │ ←──────────│  Forwards resp  │ ←─────│          │
└────────────────┘            └─────────────────┘       └──────────┘
```

The proxy:
1. Receives all outbound HTTP(S) requests from the agent sandbox
2. Inspects the destination (URL, host, path)
3. Matches against a policy: "requests to `api.github.com` may receive the GitHub token"
4. Injects the appropriate Authorization header (or query param, or body field)
5. Forwards the modified request to the external service
6. Strips the credential from any response reflection before returning to the agent

The agent only knows it sent a request to GitHub and got a response. It never saw the token.

### Omnigent's Omnibox Implementation

Omnigent implements this through its **Omnibox** OS sandbox, which combines:
- **Filesystem lockdown** — configurable OS-level access controls on which paths the agent can read/write
- **Network interception** — MITM proxy over all agent outbound traffic
- **Selective injection** — secrets injected only on approved destination patterns

The Databricks team's explicit framing:
> "Don't let an agent ever see your GitHub security token, but instead, inject it only in the egress proxy on approved requests."

### Comparison to Conventional Secret Handling

| Approach | Agent has secret? | Prompt injection risk | Leak via logs/output |
|----------|------------------|----------------------|---------------------|
| Environment variable | ✅ Yes | High | High |
| System prompt injection | ✅ Yes | Very high | High |
| Mounted secret file | ✅ Yes (readable) | Medium | Medium |
| Vault agent sidecar (read at startup) | ✅ Yes (in memory) | Medium | Medium |
| **Egress proxy injection** | ❌ No | None | None |

### Related: Infisical Agent Template Pattern

This pattern is an agent-layer analogue to the [[sandbox-per-session-isolation|Omnibox sandbox]] concept. It shares DNA with the Infisical Agent template pattern (from the homelab architecture): secrets are rendered into per-stack `.env` files by a trusted agent process, so each container only receives *its own* secrets. The egress proxy variant is stricter: not even the process receives the secret — the proxy holds it and only uses it on approved network requests.

### Trust Model

The proxy is a privileged process outside the agent sandbox. It must:
- **Hold secrets in memory, not log them** — the proxy's own security is critical; it is the new trust boundary
- **Apply destination policies** — prevent the agent from tricking the proxy into injecting credentials into attacker-controlled endpoints (e.g. `evil.example.com` that looks like `api.github.com`)
- **Verify TLS** — to prevent MITM of the proxy itself
- **Audit injections** — log *when* a secret was used, to *which endpoint*, without logging the secret value

A poorly implemented egress proxy trades one vulnerability for another. The proxy's own host must be hardened.

## Key Properties
- **Zero-knowledge agent** — the agent sandbox has no cryptographic material; secrets cannot be exfiltrated from agent output
- **Policy-gated injection** — credentials are injected only for pre-approved destination patterns; novel destinations get no credentials
- **Transparent to the agent** — the agent makes normal HTTP requests; it does not need special SDK support or awareness of the proxy
- **Centralised secret governance** — all credential usage goes through one auditable control point
- **Network-layer enforcement** — enforcement happens at the OS/network layer, not in the application or prompt layer; it cannot be bypassed by agent behaviour

## Relationships
- Complements [[sandbox-per-session-isolation]]: the sandbox isolates the agent's filesystem and process; the egress proxy isolates its credential access at the network layer
- Part of [[meta-harness-pattern]] security model: Omnigent's Omnibox is a meta-harness-layer component
- Addresses a gap in [[constrained-agent-actions]]: constrained actions limit *what the agent can do*; egress proxy injection limits *what the agent can steal*
- Related to [[plugin-extension-trust-model]]: both are about limiting what a less-trusted runtime (plugin/agent) can access from a more-trusted context
- Related to [[zero-trust-architecture]]: "never trust, always verify" applied to agent network access — the agent is treated as an untrusted caller even within the system boundary
- Contrast with [[managed-agent-split-plane-architecture]]: managed agents push trust boundaries to the provider side; egress proxy injection is a customer-side mechanism for the same secret-hiding goal

## Applications
**CI/CD coding agents:** A coding agent runs in a sandbox that has access to the repository but not the deployment secrets. The egress proxy injects the NPM publish token only when requests go to `registry.npmjs.org`.

**Data-access agents:** An agent can query a database via API but never receives the database password. The proxy injects the credential on requests to the allowed API host.

**Multi-tenant SaaS agent:** Each customer's agent session has its own proxy policy injecting only *that customer's* credentials on approved requests. Cross-customer credential leakage becomes structurally impossible.

**Agentic red team tools:** Security tools that make outbound requests during penetration tests receive credentials only for pre-scoped targets; the agent cannot exfiltrate credentials by calling an unintended endpoint.

**Regulatory compliance:** In regulated environments (HIPAA, PCI-DSS), audit trails must show *when* a secret was used and *for what*. The egress proxy provides a natural audit log of every credential injection.

## Sources
- [Introducing Omnigent (Databricks Blog)](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) — primary source; describes the Omnibox sandbox and egress proxy injection
- [Omnigent docs — Omnibox](https://omnigent.ai/docs/omnibox) — OS sandbox and network interception reference
- [MarkTechPost overview](https://www.marktechpost.com/2026/06/13/databricks-open-sources-omnigent-a-meta-harness-that-composes-governs-and-shares-ai-agents-across-claude-code-codex-and-pi/) — Omnibox sandboxing description

## See Also
- [[meta-harness-pattern]]
- [[sandbox-per-session-isolation]]
- [[constrained-agent-actions]]
- [[zero-trust-architecture]]
- [[plugin-extension-trust-model]]
- [[managed-agent-split-plane-architecture]]
