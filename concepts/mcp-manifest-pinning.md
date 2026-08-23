---
title: "MCP Manifest Pinning"
date: 2026-08-01
domain: security
maturity: emerging
source_type: practitioner
topics: [mcp, supply-chain, provenance]
tags: [concept, mcp, security, supply-chain, integrity, protocols, domain/security, maturity/emerging, source-type/practitioner, topic/mcp, topic/supply-chain, topic/provenance]
status: draft
sources:
  - url: https://www.infoq.com/articles/securing-mcp-production-gateway/
    hash: sha256:48f95cc7f93a3f008e28566a19e75ba14e2a7f2e4ba57881285db52984ac3488
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://medium.com/@Koukyosyumei/hacking-mcp-servers-in-ai-systems-the-rug-pull-tool-changes-after-approval-b4f1841da410
    hash: sha256:a76463bd0802de4eb79a374e6037b72c7f5b712449026ddbc0fc417055d852d6
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-ai-agent-exfiltration-2/
    hash: sha256:a9c83f36bdc1aaced60755dcc0023fcafa2ab7a98c86c824207814684c71689f
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1766
    hash: sha256:61cdd47d8623779cfb2ba37bddc81cb51ccc6028825b061aae9e9fea915409bc
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MCP Manifest Pinning

## Definition
A security pattern for MCP tool definitions in which a server's tool manifest (names, descriptions, and parameter schemas) is canonicalised and hashed with SHA-256 at registration time, stored as a signed baseline, and re-verified on every reconnect — so that any change to what a tool *means* is detected before the definition is loaded into an agent's reasoning context. It is, functionally, **Subresource Integrity (SRI) for MCP tools**, and it is the primary control for what the four-layer defense-in-depth model (see [[mcp-four-control-layers]]) calls semantic integrity — Layer 4.

## Explanation
MCP has no built-in mechanism for tool definition integrity: no signature, no client-enforced version pin, and no notification when a definition changes. A client typically re-fetches `tools/list` on each connection and trusts whatever comes back. This creates the **"rug pull"** attack: a server that behaved one way at approval time silently redefines a tool's description or parameter schema afterward, and because the agent reads the live surface at connection time, the change takes effect with no code change or pull request on the client side.

The danger is architecturally distinct from other MCP failure modes. A rug-pulled request can be well-formed, schema-valid, and authenticated all at once — none of the conventional controls catch it, because none of them evaluate whether the tool's *meaning* still matches what was originally approved:
- **Input validation** doesn't catch it — the input is valid against the (now-drifted) schema.
- **Authentication** doesn't catch it — the caller is legitimately authenticated.
- **Gateway policy** doesn't catch it — the request conforms to the current schema.

Maloyan & Namiot formalise this as an **absence of capability attestation**: the protocol gives a server no way to prove, at enforcement time, that its currently-advertised tool definitions match what the client's trust was originally granted against.

**The mechanism:**
1. At registration (first approval of a server/tool), canonicalise the manifest — a deterministic serialisation of tool names, descriptions, and JSON parameter schemas.
2. Compute a SHA-256 digest of the canonical form and store it as a signed baseline.
3. On every reconnect, re-fetch the manifest, re-canonicalise, re-hash, and compare against the stored baseline.
4. Same hash → allow silently. Different hash → do not auto-reject; route to a **diff classifier** (see [[diff-classifier-pattern]]) that separates cosmetic changes (typo fixes, formatting) from material changes (new parameters, altered semantics, expanded scope). Only material diffs escalate to a human for re-approval.

A related, more formal proposal is already moving through the MCP specification process: SEP-1766 ("Digest-Pinned Tool Versioning") would require servers to publish a stable SHA-256 content digest for every exposed tool version directly in `tools/list`, rather than leaving pinning entirely to client-side implementations. As of mid-2026 this remains a proposal, not an adopted part of the spec — which is why the InfoQ source frames manifest pinning as something teams have to build themselves today, using their own registration boundary as the enforcement point.

**Trade-off named honestly:** this is the highest-cost control of the four layers. Legitimate tool upgrades require re-approval, which creates friction, and without the diff classifier, a naive allow-or-deny gate generates enough false positives (every cosmetic wording change flagged) to train operators to rubber-stamp every alert — which defeats the control entirely.

## Key Properties
- Canonicalisation before hashing is essential — hashing raw JSON without a canonical form makes the hash sensitive to irrelevant formatting differences (key order, whitespace), producing false-positive drift alerts
- Detects drift, does not prevent connection — it is a detective control paired with a review workflow, not a blocking control on its own
- Re-verified on every reconnect, not just at install time — this is what catches post-approval "rug pull" changes rather than only supply-chain tampering at initial install
- Directly analogous to Subresource Integrity (SRI) in browsers and to Sigstore/SLSA-style artefact hashing in software supply chains, applied one layer up to tool *semantics* rather than binary artefacts
- Only effective when paired with a diff classifier — without one, operator fatigue neutralises the control
- Not yet a client-enforced protocol feature (SEP-1766 pending); currently an implementation pattern teams build at their own registration boundary

## Relationships
- Is the primary control for Layer 4 of [[mcp-four-control-layers]] — semantic integrity
- Complements [[diff-classifier-pattern]]: pinning detects that something changed; the diff classifier decides whether the change matters
- Distinct from [[agent-attestation-standards]]: agent attestation binds *code commits* to the human/agent/model that produced them; manifest pinning binds *tool definitions* to the state a client trusted them in — both are provenance patterns, but for different artefacts
- Related to [[supply-chain-endpoint-gap]] and the Shai-Hulud IOC scanner pattern: rug-pull tool redefinition is a live instance of the same "vendored surface can change underneath you" risk, one layer up from packages to MCP tool manifests
- Related to [[trusting-trust-problem]]: pinning only helps if the baseline was trustworthy at registration — it cannot detect a tool that was malicious from day one, only drift after that point

## Applications
- **Registration workflow:** require a manifest hash-and-sign step as part of any new MCP server or tool approval, before the server is added to any agent's active configuration
- **Session initialization:** re-verify manifest hashes automatically at every session/connection start, not only periodically — this is the point where a rug-pulled definition would otherwise silently enter an agent's context
- **Vendored skill surfaces:** for plugin-managed skills and third-party MCP servers (e.g. the `openclaw-skills:*` namespace), manifest pinning is the missing control — there is currently no hashing or drift detection on any installed MCP server or skill, making rug-pull a live risk rather than theoretical
- **Alert routing:** never route raw hash-mismatch events directly to a human; always pass them through a diff classifier first to preserve operator attention for material changes

## Study
- Flashcards: [[flashcards/mcp-manifest-pinning|Practice this concept]]

## Sources
- [Securing MCP in Production: Defense-in-Depth Beyond the Gateway — InfoQ](https://www.infoq.com/articles/securing-mcp-production-gateway/) — primary source; manifest pinning as the Layer 4 control
- [Hacking MCP Servers in AI Systems — The Rug Pull: Tool Changes After Approval (Medium, Apr 2026)](https://medium.com/@Koukyosyumei/hacking-mcp-servers-in-ai-systems-the-rug-pull-tool-changes-after-approval-b4f1841da410) — confirms MCP has no built-in signature/version-pin/notification mechanism for tool definitions
- [MCP Tool Poisoning: Adversarial Hijacking of AI Agent Workflows — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-ai-agent-exfiltration-2/) — recommends hashing and pinning tool definitions with automated re-verification at session initialization
- [SEP-1766: Digest-Pinned Tool Versioning and Interceptor-Based Validation in MCP — GitHub](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1766) — pending spec proposal for protocol-level SHA-256 digest publication per tool version

## See Also
- [[mcp-four-control-layers]]
- [[diff-classifier-pattern]]
- [[agent-attestation-standards]]
- [[supply-chain-endpoint-gap]]
- [[trusting-trust-problem]]
