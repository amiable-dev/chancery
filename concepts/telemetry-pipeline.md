---
title: "Telemetry Pipeline"
date: 2026-04-26
domain: observability
maturity: established
source_type: practitioner
topics: [cost-control, devops]
tags: [concept, observability, infrastructure, cost-management, otel, data-engineering, domain/observability, maturity/established, source-type/practitioner, topic/cost-control, topic/devops]
status: draft
sources:
  - url: https://opentelemetry.io/docs/collector/
    hash: sha256:0eb96678cc804084a4b6ac3e22d54e2946189f1e163c2e18cffd258c1e3dee86
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://oneuptime.com/blog/post/2026-02-06-reduce-observability-costs-intelligent-sampling/view
    hash: sha256:53c73ced4f7a44f08bddf01b5f767be8e4b6bd76220c1ce2b96ecd1ecf3035aa
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://www.forbes.com/sites/stevemcdowell/2026/04/09/dynatrace-moves-upstream-bindplane-acquisition-targets-data-control/
    hash: sha256:910f9ef0b6715146775a1638e076479a21c7f99eeef5d16c0e99b2c1cbe35f23
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cribl.io/resources/rpt/2026-trends-and-predictions-report/
    hash: sha256:97f4f67d08bcf333c46face71dbf5ac53753f51f81211b784f7261b042c93d07
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Telemetry Pipeline

## Definition
An infrastructure layer that sits between telemetry producers (instrumented applications, agents) and telemetry consumers (observability backends), providing a control plane for routing, filtering, transforming, sampling, and reducing observability data. The telemetry pipeline decouples the *what you collect* from *where it goes* and *how much you keep*, enabling cost control, multi-destination routing, and governance without application changes.

## Explanation
In a naive observability architecture, applications send telemetry directly to backends. This creates coupling: changing backends requires application changes; sending data to multiple backends (e.g., Grafana for infrastructure + Langfuse for AI) requires multiple SDK configurations; controlling costs requires SDK-level sampling logic per application.

A telemetry pipeline breaks this coupling by inserting a policy enforcement layer:

```
Applications ──OTLP──► Telemetry Pipeline ──► Backend A (Grafana)
                               │────────────► Backend B (Langfuse)
                               │────────────► Backend C (S3 archive)
                               │
                        [Filter | Sample | Transform | Route]
```

**Why telemetry pipelines are now essential:**

Telemetry data growth exceeds 250% year-over-year. 70% of observability spend goes to logs that are never queried. Without a pipeline, the only cost levers are: collect less (reducing coverage), pay more (accepting cost), or change backends (painful migration). A pipeline adds a fourth option: collect everything, then intelligently reduce before storage.

**The OTel Collector:**

The de facto open-source telemetry pipeline. A single binary with a composable processor chain:

```yaml
receivers:
  otlp: {}          # Accept OTLP from apps
  prometheus: {}    # Scrape Prometheus metrics

processors:
  tail_sampling:    # Keep 100% of errors, 5% of successes
    decision_wait: 10s
    policies:
      - name: errors, type: status_code, status_code: {status_codes: [ERROR]}
      - name: sample-healthy, type: probabilistic, probabilistic: {sampling_percentage: 5}
  filter:           # Drop verbose health check spans
    spans:
      exclude:
        match_type: strict
        attributes: [{key: http.target, value: /health}]
  resource:         # Add environment metadata
    attributes:
      - action: insert
        key: deployment.environment
        value: production

exporters:
  otlp/grafana:     # Send traces to Grafana Tempo
    endpoint: tempo:4317
  loki:             # Send logs to Loki
    endpoint: http://loki:3100
  prometheusremotewrite:  # Send metrics to Mimir
    endpoint: http://mimir:9009/api/v1/push
```

**Key pipeline strategies:**

**1. Tail-based sampling (highest-value cost lever)**
Head-based sampling (decide at span start) must make decisions before the full trace is known — you sample 10% of ALL requests including errors. Tail-based sampling waits until the full trace is received, then makes decisions:
- Keep 100% of traces with errors
- Keep 100% of traces with high latency
- Keep 5% of healthy traces
This dramatically reduces storage cost while preserving the data you actually need for debugging.

**2. Attribute filtering**
High-cardinality attributes that are useful for debugging but expensive to store long-term can be stripped after N days or replaced with hashed values. HTTP request bodies, user-agent strings, full SQL queries — filter these for long-term retention.

**3. Fan-out routing**
Send the same telemetry stream to multiple destinations simultaneously. Example: route all LLM traces to both Grafana Tempo (for infrastructure correlation) AND Langfuse (for AI-specific analysis) — without duplicating SDK configuration in the application.

**4. Data tiering via routing**
Route 100% of data to hot storage (fast, expensive, short retention), route a sampled/filtered subset to warm storage (slower, cheaper, longer retention), and route compliance-critical events to cold archive (S3, indefinite retention).

**5. Dynamic sampling (Mezmo pattern)**
Normally sample at 10%. When synthetic monitors detect an incident, bump to 100% automatically. Reduces normal-state cost while ensuring full fidelity during incidents.

**Commercial pipeline tools:**

- **Cribl Stream** — market leader for enterprise telemetry pipelines. Vendor-neutral routing (security + observability data). Visual pipeline builder. Processing 10s of TB/day for large enterprises. Dynatrace's Bindplane acquisition (April 2026) validates the commercial pipeline category.
- **Mezmo Pipeline** — dynamic telemetry routing with incident-aware sampling.
- **Datadog Observability Pipelines** — routes to Datadog and other destinations; useful for reducing Datadog ingest costs.

**Impact metrics:**
- Research shows **57% of observability leaders have reduced costs** by adopting OTel Collector as a pipeline gateway
- Intelligent tail sampling alone can reduce trace storage by 80–95%
- Log-level filtering (WARN+ only in production) typically reduces log volume by 60–70%

## Key Properties
- **Backend decoupling** — applications send to one OTLP endpoint; the pipeline handles routing and fanout
- **Policy enforcement point** — data governance, cost controls, and compliance requirements implemented once in the pipeline
- **Sampling flexibility** — head-based (fast, simple), tail-based (smart, requires buffering), or dynamic (incident-aware)
- **Transformation** — enrich events with environment metadata; strip PII; normalise attribute names across teams
- **Multi-destination** — send one stream to many backends simultaneously without application changes
- **Operational overhead** — the pipeline itself becomes critical infrastructure; requires HA deployment and monitoring

## Relationships
- Core infrastructure for [[observability]]: the OTel Collector is the default pipeline for OTel-native setups
- Critical for [[observability-2-0]]: wide events need intelligent sampling (tail-based) to be cost-effective; the pipeline is where sampling policy lives
- Receives data from [[ebpf-observability]]: OBI emits OTLP to the Collector, which routes to backends
- Related to [[data-governance]]: the pipeline is the enforcement point for data residency, PII masking, and retention policies
- Related to [[llm-observability]]: fan-out routing sends LLM traces to both general backends and AI-specific tools (Langfuse)

## Applications
- **Multi-backend routing:** OpenLLMetry instruments the application once; Collector fans out to Grafana (infra) + Langfuse (AI evals) + S3 (compliance archive) simultaneously
- **Cost reduction:** Tail sampling cuts trace storage from $8K/month to $400/month by keeping errors and slow requests but sampling 1% of healthy traffic
- **Compliance enforcement:** Strip PII fields (email, user names) from logs before they reach the US-based SaaS backend; retain full logs in EU-region object storage
- **Homelab:** Single OTel Collector receives all signals; routes metrics to Mimir, traces to Tempo, logs to Loki — clean separation with one config file
- **Incident-aware sampling:** Synthetics detect availability drop → Collector switches from 5% to 100% sample rate → full fidelity data during investigation window

## Sources
- [OTel Collector Documentation](https://opentelemetry.io/docs/collector/) — comprehensive reference
- [Reduce Observability Costs 80% with OTel Sampling](https://oneuptime.com/blog/post/2026-02-06-reduce-observability-costs-intelligent-sampling/view) — sampling strategies
- [Dynatrace Acquires Bindplane — Forbes](https://www.forbes.com/sites/stevemcdowell/2026/04/09/dynatrace-moves-upstream-bindplane-acquisition-targets-data-control/) — validates telemetry pipeline category
- [Cribl 2026 Trends Report](https://cribl.io/resources/rpt/2026-trends-and-predictions-report/) — enterprise pipeline landscape
- Observability Landscape Guide 2025–2026

## See Also
- [[observability]]
- [[observability-2-0]]
- [[ebpf-observability]]
- [[llm-observability]]
- [[data-governance]]
- [[otel-genai-semantic-conventions]] — the GenAI span/attribute schema whose high-cardinality, potentially-PII-bearing content this pipeline layer needs to govern
