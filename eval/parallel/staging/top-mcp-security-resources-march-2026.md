# Top MCP security resources — March 2026

**Source:** https://adversa.ai/blog/top-mcp-security-resources-march-2026/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> March 2026 in MCP security: overthinking loops that drain API budgets, high-privilege RCE in Claude desktop extensions, and a widening MCP attack surface.

---

As the [Model Context Protocol](https://adversa.ai/blog/top-mcp-threats-resources-a-comprehensive-guide-to-model-context-protocol-security/) ecosystem grows, the attack surface is shifting from theoretical risks to concrete exploitation. This month’s digest highlights critical architectural weaknesses, ranging from “overthinking loops” that drain API budgets to high-privilege RCE vulnerabilities in Claude Desktop extensions.

## Statistics:

Total resources: 8  
Category breakdown:

Category

Count

[Threat Model](#threat-model)

3

[Defense](#defense)

2

[Vulnerability](#vulnerability)

1

[Research](#research)

1

[CISO](#ciso)

1

## GenAI security resources:

### Threat Model

#### MCP’s first year: what 30 CVEs and 500 server scans tell us

Analysis reveals that MCP has become AI’s fastest-growing attack surface, with 30 CVEs filed in just 60 days. The data shows that [38% of 500+ scanned servers](https://medium.com/ai-security-hub/mcps-first-year-what-30-cves-and-500-server-scans-tell-us-about-ai-s-fastest-growing-attack-6d183fc9497f) completely lack authentication.

#### MCP security: understanding vulnerabilities in Model Context Protocol

This post demonstrates three distinct MCP attack techniques, providing working code examples and PoC implementations. It specifically details [external prompt injection](https://marmelab.com/blog/2026/02/16/mcp-security-vulnerabilities.html), tool prompt injection, and cross-tool hijacking.

#### The hidden dangers of AI agents: 11 critical security risks in MCP

This article provides a systematic catalog of 11 MCP vulnerability classes, highlighting supply chain typosquatting and cross-server context abuse. It includes details on [CVE-2025-6514 (CVSS 10.0 RCE)](https://dev.to/jayavelu_balaji_7a99a6187/the-hidden-dangers-of-ai-agents-11-critical-security-risks-in-model-context-protocol-mcp-2hi5) and tool poisoning risks.

### Defense

#### Building a secure MCP server with OAuth 2.1 and Azure AD

This guide presents a Microsoft ISE [production-ready MCP server](https://devblogs.microsoft.com/ise/aca-secure-mcp-server-oauth21-azure-ad/) implementation. It features detailed code examples for OAuth 2.1, JWKS-cached token validation, and OBO flows.

#### Enterprise MCP access control: managing tools, servers, and agents

This post outlines a comprehensive [tool-level access control architecture](https://www.truefoundry.com/blog/enterprise-mcp-access-control) for MCP. It covers per-tool permissions, server-level policies, and agent-scoped access boundaries suitable for enterprise deployments.

### Vulnerability

#### Anthropic’s DXT poses ‘critical RCE vulnerability’

A critical architectural decision in Claude Desktop Extensions allows MCP servers to run with high privileges. This configuration enables chaining low-risk tools to high-risk local executors, potentially leading to [zero-click RCE via malicious calendar invites](https://www.csoonline.com/article/4129820/anthropics-dxt-poses-critical-rce-vulnerability-by-running-with-full-system-privileges.html).

### Research

#### Overthinking loops in agents: a structural risk via MCP tools

Researchers have identified that malicious MCP tool servers can exploit tool-using LLM agents by inducing [cyclic ‘overthinking loops’](https://arxiv.org/html/2602.14798v1). This attack surface amplifies token consumption up to 142.4x and increases latency, creating a severe denial-of-wallet risk.

### CISO

#### Model Context Protocol (MCP): the layer that elevates a chatbot into an agent

This article provides a comprehensive risk catalog of [MCP attack surfaces](https://medium.com/@number40/model-context-protocol-mcp-the-layer-that-elevates-a-chatbot-into-an-agent-d9b99a22120e) including supply chain threats and tool poisoning. It specifically addresses chaining abuse and transitive trust violations with compliance mapping.

## Harden your tools now

The discovery of critical RCEs in both reference and downstream MCP implementations proves that isolation is no longer optional for agentic systems. Security teams must enforce privilege restrictions, timeouts, and cost controls for all MCP servers in production to prevent significant financial and technical compromise. Once those measures are in place, consider [red teaming your AI stack](https://adversa.ai/ai-red-teaming-agentic-ai/) to verify that these controls hold.
