# SEP-1766: Digest-Pinned Tool Versioning and Interceptor-Based Validation in MCP

**Source:** https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1766
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Digest-Pinned Tool Versioning and Interceptor-Based Validation in MCP Preamble Title: Digest-Pinned Tool Versioning and Interceptor-Based Validation in MCP Status: Proposed Created: 2025-11-05 Auth...

---

## Preamble

Title: Digest-Pinned Tool Versioning and Interceptor-Based Validation in MCP  
Status: Proposed  
Created: 2025-11-05  
Authors: [@ev3rl0ng](https://github.com/ev3rl0ng)

## Abstract

This SEP proposes a lightweight tool versioning protocol for Model Context Protocol (MCP): servers MUST publish a stable content digest (SHA256) for every exposed tool version in tool registries (e.g., in `tools/list`). All additional metadata (signatures, provenance, SBOM, revocation) is OPTIONAL and reserved for future phases. The digest enables deterministic client, or chained server as chaining progresses, pinning and fast detection of accidental or unauthorized updates, serving as a pragmatic foundation for supply chain integrity. Robust runtime validation and behavioral guardrails are delegated to the interceptor framework proposed in [#1763](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1763).

## Motivation

-   Accidental or unplanned tool mutations threaten agent reliability; drift detection by digest is simple, high-impact and easy to integrate.
-   Full artifact signing and provenance infrastructure carries high initial overhead; digest alone gives most value at lowest cost.
-   Interceptor-based runtime validation (mutation/validation/observability) as proposed in [SEP-1763: Interceptors for Model Context Protocol #1763](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1763), provides practical defense against malicious or unsafe tool behavior.
-   Pinning by digest emulates proven workflows in open ecosystems (e.g., GitHub Action SHA pinning).

## Specification

### 1\. Digest Field for Tool Versions

-   Each tool listed in MCP servers MUST include a SHA256 digest, e.g.:
    
    {
      "name": "search\_repos",
      "semanticVersion": "1.4.2",
      "digest": "sha256:7d9f9c2e3d2e6c0a9e..."
    }
    
-   The digest MUST be calculated over a canonical code archive (ZIP/TAR) or binary payload. Servers SHOULD document the precise hashing recipe for their ecosystem. Clients MAY request the canonical archive for deferred reproducibility.
-   Tool authors MAY optionally include a `commit` or `sourceRepo` field to aid reproducibility.
-   All additional metadata (signature, provenance, SBOM, revocation) MAY be included but is NOT REQUIRED.

### 2\. Client Pinning and Digest Validation

-   MCP clients and agents MAY pin tool versions by digest in configuration or workflow manifests.
-   Tool invocation MUST be preceded by a client-side digest check if pinned. Mismatches SHOULD result in warnings or block execution depending on policy.
-   Digest pinning prohibits silent downgrade or unintentional update.

### 3\. Interceptor Enforcement (see [#1763](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1763))

-   Interceptors (mutation, validation, observability) MAY be used to enforce digest pins at runtime:
    -   Block or warn on digests not previously allowlisted
    -   Require manual approval for new tool digests
    -   Audit digests in logs for forensic traceability
    -   Downscope tool invocation parameters on unvetted digests
-   This enables human or automated review of tool changes without heavy cryptographic tooling.

### 4\. Minimal Manifest Example

{
  "name": "search\_repos",
  "semanticVersion": "1.4.2",
  "digest": "sha256:7d9f9c2e3d2e6c0a9e...",
  "commit": "b3f6d9e7c1a44d2f8e5a19c..."
}

### 5\. Security Considerations

-   Digest pinning provides tamper evidence and integrity but NOT authenticity or non-repudiation.
-   Reliance on interceptors covers runtime anti-abuse, input/output validation, audit logging, and environmental controls; together this approach gives practical defense for most operational risks.
-   Malicious tool authors or compromised repos can still publish harmful code; SEP recommends escalation to signature/provenance if this threat becomes significant.
-   Clients SHOULD maintain an explicit allow/blocklist of approved digests if security policy requires.

### 6\. Upgrade Path

-   Future phases could introduce optional manifest signature, provenance attestation, SBOM, transparency logs, and revocation lists.
-   Backwards compatibility: servers publishing only digest + optional commit remain compliant.
-   Clients and interceptors MAY opt into deeper validation as the ecosystem evolves.

## Example Interceptor Policy

-   Validator interceptor blocks tool invocation unless digest observed in a trusted history list.
-   Observability interceptor logs tool execution with digest and agent id.
-   Mutation interceptor applies strict argument schema for new/unfamiliar digests.

## References

-   [SEP-1763: Interceptors for Model Context Protocol #1763](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1763): Standardized Interceptor Framework
-   GitHub Actions SHA pinning workflows
-   OCI image digest patterns

* * *

This proposal deliberately maximizes practicality and developer adoption, with clear forward compatibility for higher assurance tooling.
