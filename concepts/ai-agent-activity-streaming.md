---
title: "AI Agent Activity Streaming"
date: 2026-07-05
domain: observability
maturity: emerging
source_type: practitioner
topics: [enterprise, provenance]
tags: [concept, ai-agents, observability, governance, compliance, enterprise, streaming, security, domain/observability, maturity/emerging, source-type/practitioner, topic/enterprise, topic/provenance]
status: draft
sources:
  - url: https://github.blog/changelog/2026-07-03-copilot-agent-session-streaming-is-now-in-public-preview/
    hash: sha256:af33bf34c73470934fc98ede94940c8f83cf38be503f8da9e19fae5fdd5cca14
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise
    hash: sha256:faa082d5b32efac647049e1a4e38918f8712a898698d8fc3e4ae15bdabee21ee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise
    hash: sha256:212b2b5c3289529d5edd16141449949a2bcce20be6e2bd324d19721d73043e04
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# AI Agent Activity Streaming

## Definition
AI agent activity streaming is the practice of continuously exporting structured records of AI agent sessions — including prompts, model responses, and tool calls — to external consumer systems (SIEM, DLP, audit storage, compliance platforms) in real time or near-real time, so that agent behaviour is observable to systems outside the AI vendor's platform.

## Explanation
When an AI agent works on a task it generates a rich event sequence: user messages, model completions, tool invocations with their inputs and outputs, retries, errors. Traditionally this session data lived only inside the AI platform's own logging infrastructure — useful for debugging but inaccessible to enterprise security and compliance tooling.

Agent activity streaming externalises this data. The AI platform becomes a *publisher* of structured session events; enterprise systems become *subscribers* that consume those events alongside all other organisational telemetry.

**GitHub Copilot's implementation (July 2026) illustrates the pattern:**
- **Scope:** All Copilot clients — cloud agents, CLI, VS Code, Visual Studio, JetBrains, Eclipse
- **Data exported:** Prompts, model responses, and tool calls per agent session
- **Streaming endpoint:** Real-time push to any event collector or SIEM via audit log streaming configuration
- **REST API:** `GET /enterprises/{enterprise}/copilot/usage-records` — on-demand pull of the last 48 hours
- **Microsoft Purview:** Supported as a direct streaming endpoint, routing AI activity into Microsoft's unified compliance platform

**Two delivery patterns:**

| Pattern | How it works | Best for |
|---------|-------------|---------|
| **Streaming endpoint** | Persistent connection; session events pushed as they occur | Real-time alerting, anomaly detection, live dashboards |
| **REST pull** | Batch query returning last N hours of records | Scheduled compliance reporting, SIEM backfill, periodic audit |

**Why this is structurally different from agent-side observability:**
An agent emitting its own logs is self-reporting — if the agent misbehaves or fails, it may fail to log accurately. External streaming captures session data at the platform level, independently of the agent's internal state, making the records suitable as compliance evidence. This closes a key dimension of the [[agent-audit-gap]]: organisations no longer have to instrument agents individually to get session records.

**What the session record typically contains:**
- Session ID and timestamps
- User identity (enterprise managed user)
- Prompts submitted (full text or content hash, depending on configuration)
- Model responses
- Tool calls: name, input arguments, and results
- Metadata: client type (VS Code, CLI, etc.), model version, session duration

**The governance shift this enables:**
Before streaming: "Did the agent do anything problematic?" → only answerable by examining vendor logs post-hoc, if accessible at all.  
After streaming: "Is the agent doing anything problematic *right now*?" → SIEM rules fire on live event streams; alerts are possible within seconds of a suspicious prompt or tool call.

## Key Properties
- **Platform-level capture** — recorded by the AI platform, not the agent itself; resistant to agent failure corrupting the record
- **Completeness** — covers all session data: prompts, responses, tool calls (not just token counts or timing metadata)
- **Dual-mode access** — streaming (real-time push) and REST pull (batch retrospective) serve different operational needs
- **External integration** — designed for consumption by enterprise tooling (SIEM, DLP, Purview) rather than internal AI platform dashboards
- **Identity-anchored** — tied to enterprise managed user identities; sessions are attributable to specific people or service accounts

## Relationships
- Directly addresses [[agent-audit-gap]]: provides the missing session record that makes AI agents auditable
- Feeds into [[siem-integrated-ai-governance]]: the streaming data is consumed by SIEM for real-time governance
- Architecturally related to [[agent-sse-event-stream]]: SSE streams are app-to-agent protocol; activity streaming is platform-to-SIEM — same event-driven delivery pattern, different scope and audience
- Related to [[telemetry-pipeline]]: session events can be routed through a telemetry pipeline before reaching SIEM backends
- Supports closing the [[agent-governance-gap]]: when session data flows into audit systems, governance documents can be updated to reference the AI session record as the audit artefact

## Applications
**Security operations:** Ingest Copilot session events into Splunk, Microsoft Sentinel, or Elastic SIEM. Write detection rules to alert when agents access sensitive file paths, submit prompts containing credential patterns, or invoke external network calls unexpectedly.

**Compliance auditing:** Answer auditor questions about AI usage from the SIEM query interface: "Show all agent sessions that accessed the payments module in Q2," or "List every tool call made by agents operating on production environments."

**DLP integration:** Route streaming events through a DLP policy engine. Flag sessions where model responses appear to contain PII or confidential IP. Microsoft Purview's integration with Copilot activity streaming provides this natively.

**Behavioural baseline:** Use batch REST pull to build usage baselines (typical prompt patterns, common tool calls, session durations). Alert when individual developers or teams deviate significantly — possible indicator of misuse or compromise.

**Incident investigation:** When a production incident occurs and an AI agent was involved, query session records to reconstruct exactly what the agent was asked, what it decided, and what tools it invoked — independently of the agent's own logs.

## Study
- Flashcards: [[flashcards/ai-agent-activity-streaming|Practice this concept]]

## Sources
- [Copilot agent session streaming is now in public preview](https://github.blog/changelog/2026-07-03-copilot-agent-session-streaming-is-now-in-public-preview/) — GitHub changelog announcing the feature; primary source for this concept note
- [Copilot Usage Records REST API documentation](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise) — API reference for the batch pull endpoint
- [GitHub Enterprise audit log streaming](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) — documentation on configuring the streaming endpoint

## See Also
- [[agent-audit-gap]]
- [[siem-integrated-ai-governance]]
- [[agent-governance-gap]]
- [[agent-sse-event-stream]]
- [[telemetry-pipeline]]
