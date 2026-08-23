---
title: "Agent Attestation Standards"
date: 2026-04-23
domain: security
maturity: emerging
source_type: vendor-doc
topics: [supply-chain]
tags: [concept, ai-agents, devops, security, supply-chain, provenance, attestation, governance, domain/security, maturity/emerging, source-type/vendor-doc, topic/supply-chain]
status: draft
sources:
  - url: https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/
    hash: sha256:31b745b269ded03375f3cda8695f34924bfaa550de884bd1fd2ba1c79042f1c7
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://slsa.dev
    hash: sha256:a82fe37a593c5aa14845f63e7a6bbf16776050c3118a889f6ded06bb6df32376
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.sigstore.dev
    hash: sha256:47d2a515ef2f05b87d688656286a61e4f743da4b878684c7654969db17711c40
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent Attestation Standards

## Definition
An emerging class of cryptographic provenance standards for agent-authored code — analogous to SLSA and Sigstore for software supply chains — that cryptographically bind each commit or artefact to the agent that produced it, the model version used, the specification provided, and the human who authorized the task. Agent attestation answers the question: *for any given change in the repository, who authorized it, what agent executed it, under what instructions, and with which model version?*

## Explanation
The software supply chain security community solved the "who built this artefact" problem for human-authored software through frameworks like SLSA (Supply-chain Levels for Software Artefacts) and tools like Sigstore (keyless code signing). These establish a cryptographic chain of custody from source code to deployable artefact.

Agent attestation extends this chain of custody one step further upstream: from the human who authorized a task to the agent that executed it. As AI agents produce an increasing proportion of commits and PRs, the industry faces a new question: *how do you know this was an intentional, human-authorized change and not an agent acting outside its sanctioned scope?*

**What agent attestation binds:**
- The human who authorized the task (delegation authority)
- The agent that executed it (agent identity + version)
- The model version used (for reproducibility and regression investigation)
- The specification or instruction set provided (the "specification" input)
- Any scope restrictions that were in force at execution time

**Analogy to SLSA:** SLSA levels establish increasingly strong guarantees about *how* software was built (was it built from the declared source? was the build process isolated? are the build steps reproducible?). Agent attestation levels would establish increasingly strong guarantees about *how* agent-authored code was authorized and constrained.

**Current state:** No industry standard exists yet. This is a near-term trend the playbook projects, not a deployed practice. Some organisations are building ad hoc metadata into PR descriptions and commit messages (e.g. `agent-authored`, `model: claude-sonnet-4-6`, `spec: feature-123.md`). Formal cryptographic attestation is the next maturity step.

**Relationship to [[agentic-pipeline-verification]] provenance layer:** Provenance verification in today's pipelines checks that dependencies come from legitimate registries. Agent attestation extends this to the commit itself — verifying the commit has a valid cryptographic attestation chain back to a human authorization.

## Key Properties
- Cryptographic binding (not just metadata labels) — tamper-evident
- Four dimensions: human authority, agent identity, model version, specification input
- Analogous to SLSA/Sigstore but for agent-produced code, not build artefacts
- Currently a near-term trend, not a deployed standard (as of 2026)
- Enables auditability at Level 4 of the [[agentic-devops-maturity-model]]
- Critical for regulated industries where code change authorization must be demonstrable

## Relationships
- Extends [[agentic-pipeline-verification]]: provenance verification is the current partial equivalent; attestation is the mature cryptographic form
- Required for [[agentic-devops-maturity-model]] Level 4 (attestation standards are a Level 4 marker)
- Related to [[zero-trust-architecture]]: attestation applies zero-trust principles to code authorship (never trust, always verify — even if the contributor is an approved agent)
- Related to [[platform-baked-governance]]: attestation standards, once established, would be embedded into the platform as defaults

## Applications
- **Near-term (pre-standard):** Enforce PR conventions for agent-authored PRs — require labels, commit message fields, or PR descriptions that identify agent identity and authorizing specification
- **Pipeline enforcement:** Reject PRs missing agent attribution metadata when agent-authored PRs are expected to carry it
- **Audit trail:** During incident investigation, use agent metadata to reconstruct what specification guided the change and whether it was within sanctioned scope
- **Model pinning:** Record the model version in agent metadata — if a model regression produces a class of failures, this lets you filter affected changes
- **Watch:** SLSA and Sigstore communities are the most likely sources of emerging standards; OpenSSF working groups are the right venue to track

## Study
- Flashcards: [[flashcards/agent-attestation-standards|Practice this concept]]

## Sources
- [DevOps Playbook for the Agentic Era — Microsoft Azure DevBlogs](https://devblogs.microsoft.com/all-things-azure/agentic-devops-practices-principles-strategic-direction/) — Primary source; Section 9 (Near-Term Trends) covers agent attestation standards
- [SLSA Framework](https://slsa.dev) — The software supply chain security framework this concept extends
- [Sigstore](https://www.sigstore.dev) — Keyless signing infrastructure; likely basis for agent attestation tooling

## See Also
- [[agentic-pipeline-verification]]
- [[zero-trust-architecture]]
- [[platform-baked-governance]]
- [[agentic-devops-maturity-model]]
- [[domain-as-identity-trust]] — ARD's publisher-level trust mechanism; complementary to artifact-level attestation
- [[reputation-based-extortion]] — provenance/attestation and reputational-extortion resistance both converge on the same underlying need: a verifiable record of who authorised what
- [[mcp-manifest-pinning]] — the same attestation instinct applied to a different artefact: agent attestation binds code commits to their human/agent/model provenance, manifest pinning binds MCP tool definitions to the state a client trusted them in
