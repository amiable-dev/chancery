---
title: Internet-facing MCP servers are exposed by design
date: 2026-08-24
domain: security
maturity: emerging
source_type: research
topics: [mcp]
tags: [concept, security, mcp, measurement, domain/security, maturity/emerging, source-type/research, topic/mcp]
status: draft
sources:
  - url: https://arxiv.org/abs/2608.00150
    hash: sha256:38df306a356d49a17afe64579db68f258349452f80da0f097ad4ac7be6e6af67
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Internet-facing MCP servers are exposed by design

## Definition

Internet-facing MCP servers being exposed by design is the empirical finding that publicly reachable Model Context Protocol servers are, as a population, insecure not by isolated misconfiguration but as the predictable outcome of a deployment pace that outruns security review: large-scale internet scanning combined with active dynamic testing finds that the large majority of confirmed servers lack OAuth authentication entirely, a substantial share of exposed tools grant shell execution with no access control, and a large fraction of servers vanish within days of being observed — evidence of rapid, ad hoc deployment cycles rather than managed, reviewed ones.

## Explanation

The finding comes from combining passive discovery — crawling certificate transparency logs, package registries, and MCP-specific directories such as Smithery, glama.ai and pulsemcp.com alongside general-purpose scanners like Shodan, Censys and FOFA — with active dynamic testing through Corvus, a purpose-built open-source framework running 34 test modules across 10 MCP-specific vulnerability classes. Across four measurement runs in a single month, the study confirmed 640 production servers, dynamically audited 414 of them, and found 68 reportable vulnerabilities spanning SQL injection, SSRF against cloud metadata endpoints, prompt-template injection, and path traversal — but the headline is prevalence rather than any single bug: 91.8% of audited servers had no OAuth authentication at all, 687 individual tool instances exposed shell execution with no access control, and 41.6% of confirmed servers had disappeared by the next measurement run days later. That churn rate is the tell that distinguishes exposed-by-design from exposed-by-neglect: servers are not sitting unpatched for years, they are being stood up, exposed, and torn down again faster than any security review process could plausibly reach them, so the population's insecurity is a structural consequence of how fast MCP servers are shipped rather than a lag that better patching cadence would fix.

## Key Properties

- 91.8% of dynamically audited internet-facing servers had no OAuth authentication
- 687 tool instances across confirmed servers exposed shell execution with no access control
- 41.6% of confirmed servers disappeared within three days between measurement runs, indicating deployment without security review rather than unpatched persistence
- The methodology — passive discovery across eleven data sources plus active testing via the open-sourced Corvus framework — is itself a reusable, reproducible measurement instrument, not just a one-time count

## Relationships

- [[remote-first-mcp-governance]] — supplies the empirical baseline that architecture's local-server risk case argues from — this is the measured state of the ungoverned, internet-exposed population that governance moves servers out of
- [[mcp-attack-surface-taxonomy]] — confirms at internet scale that the taxonomy's insufficient-authentication-and-authorization category is not a theoretical risk but the majority condition of already-deployed servers
- [[mcp-oauth-discovery-ssrf]] — SSRF against cloud metadata endpoints is one of the vulnerabilities this measurement study actually found in the wild, giving that mechanism an empirical prevalence rather than only a described attack path
- [[mcp-registry-federation]] — measures the exposed, ungoverned population that this registry's self-report-then-moderate-reactively model does not vet before publication — a server can be listed the moment its publisher submits it, so registry discoverability does not by itself close the exposure this study found.

## Applications

Prioritizing MCP security investment with evidence rather than assumption: treating auth-by-default and access control on any shell-capable tool as non-negotiable before a server touches the public internet, and expecting that any internet-facing server will be discovered and probed within days rather than months, which argues against relying on obscurity or a slow patch-review cadence as a defense.

## Sources

- https://arxiv.org/abs/2608.00150

## See Also

- [[remote-first-mcp-governance]]
- [[mcp-attack-surface-taxonomy]]
