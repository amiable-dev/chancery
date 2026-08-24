# OpenTelemetry eBPF Instrumentation (OBI) — The Complete Guide: KubeCon EU 2026 Beta Launch, Zero-Code Observability, and the 1.0 GA Roadmap

**Source:** https://dev.to/x4nent/opentelemetry-ebpf-instrumentation-obi-the-complete-guide-kubecon-eu-2026-beta-launch-5e2o
**Added:** 2026-08-24
**Tags:** #unsorted

---

> > **Published on the ManoIT Tech Blog (Korean original).** On April 2026 at KubeCon + CloudNativeCon Europe in Amsterdam, Splunk formally announced th

---

## [](#opentelemetry-ebpf-instrumentation-obi-the-complete-guide-kubecon-eu-2026-beta-launch-zerocode-observability-and-the-10-ga-roadmap)OpenTelemetry eBPF Instrumentation (OBI) — The Complete Guide: KubeCon EU 2026 Beta Launch, Zero-Code Observability, and the 1.0 GA Roadmap

> **Published on the ManoIT Tech Blog (Korean original).** On April 2026 at KubeCon + CloudNativeCon Europe in Amsterdam, Splunk formally announced the beta launch of **OpenTelemetry eBPF Instrumentation (OBI)** — the OpenTelemetry community's successor to Grafana Beyla. This post walks through v0.8.0 architecture, Kubernetes Helm deployment, HTTP header enrichment for multi-tenant incident response, the 2026 roadmap toward 1.0 GA, how OBI relates to Beyla/Pixie/Tetragon/Hubble, and a production adoption checklist grounded in what ManoIT ships to customers.

* * *

## [](#1-why-obi-matters-the-zerocode-observability-inflection-point)1\. Why OBI matters — the zero-code observability inflection point

CNCF's Observability TAG reported in Q1 2026 that **67% of production Kubernetes clusters** are already running at least one eBPF-based observability tool. But the existing landscape was fragmented: Pixie was tied to New Relic, Grafana Beyla skewed toward Grafana Cloud, and Cilium Hubble stopped at L3/L4 network flows without application-level tracing. OBI cleans this up using the **OpenTelemetry Protocol (OTLP)** and an **Apache 2.0** license.

Pain point

Traditional workaround

OBI answer

Operational effect

Go/Rust/C++ binary auto-instrumentation

OTel SDK insertion, rebuild required

**eBPF uprobes + kprobes, zero code**

Legacy and third-party binaries get visibility immediately

TLS-encrypted traffic tracing

Sidecar proxy (Envoy/Istio) injection

**Kernel-level SSL\_read/SSL\_write hooks**

HTTPS payloads observable without sidecars

Multi-tenant SaaS incident triage

"Error rate up" — no idea which tenant

**HTTP header enrichment (v0.7.0+)**

Filter by `x-tenant-id` / `x-user-segment`

SQL / Redis / Mongo query analysis

ORM instrumentation + sampling

**Native server spans (pgx, mysql, mongo, redis, couchbase)**

DB latency linked to app traces

OpenAI / Anthropic call tracing

Manual wrappers + custom token counting

**GenAI instrumentation with payload extraction**

LLM cost and latency collected automatically

In one line: **OBI collects only what the kernel can tell it, and leaves the SDK alone.** If you still need custom business events or application-specific attributes, OBI is designed to run **alongside** the OpenTelemetry SDKs — it fills visibility gaps, it doesn't replace language-level instrumentation.

## [](#2-obi-architecture-from-beyla-to-obi)2\. OBI architecture — from Beyla to OBI

OBI's technical lineage is **Grafana Beyla**. Grafana Labs donated Beyla to OpenTelemetry in 2025; a weekly SIG formed, test pipeline speeds improved **10×**, and after a late-2025 alpha release the project reached **v0.8.0 on April 16, 2026**. It ships as a binary, as a Docker image (`otel/ebpf-instrument`), and as a Helm chart.  

```
┌─────────────────────────── User-Space Agent ───────────────────────────┐
│  (obi binary, written in Go)                                           │
│                                                                        │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────────┐ │
│  │ eBPF Map     │→ │ Span Builder  │→ │ OTLP Exporter (gRPC/HTTP) │ │
│  │ Reader       │  │ (HTTP/gRPC/DB)│  │ → OTel Collector           │ │
│  └──────────────┘  └───────────────┘  └────────────────────────────┘ │
│         ↑                                                              │
│         │ eBPF maps (perf_event_array, ring_buffer)                    │
└─────────┼──────────────────────────────────────────────────────────────┘
          │
┌─────────┼────────────────── Kernel-Space Probes ───────────────────────┐
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│   │ uprobes      │  │ kprobes      │  │ tracepoints  │               │
│   │ (SSL_read,   │  │ (tcp_sendmsg,│  │ (sched, fs)  │               │
│   │  SSL_write)  │  │  tcp_recvmsg)│  │              │               │
│   └──────────────┘  └──────────────┘  └──────────────┘               │
│           │                                                            │
│           ▼ Linux 5.8+ kernel (RHEL 4.18+ backport), BTF required      │
└────────────────────────────────────────────────────────────────────────┘
```

Enter fullscreen mode Exit fullscreen mode

Two design decisions drive the low overhead: **kernel probes only capture raw events**, leaving heavy parsing, filtering, and mapping to the user-space agent — which keeps kernel-side CPU cost minimal. And because the output is **OTLP**, a single OBI deployment can feed Jaeger, Tempo, Splunk APM, Grafana Cloud, or Honeycomb through the same OpenTelemetry Collector.

System requirement

Detail

Notes

Linux kernel

**5.8+** (RHEL/Rocky/Alma 4.18+ with eBPF backport)

BTF (BPF Type Format) required

Architecture

amd64, arm64

Graviton / Ampere supported

Privileges

root or `CAP_BPF + CAP_SYS_PTRACE`

Configure DaemonSet securityContext

Pod settings

`hostPID: true` recommended

Required to discover host-namespace processes

Container image

`otel/ebpf-instrument:v0.8.0`

CycloneDX SBOM included

License

Apache 2.0

No commercial restrictions

## [](#3-kubernetes-helm-deployment-cluster-visibility-in-15-minutes)3\. Kubernetes Helm deployment — cluster visibility in 15 minutes

The officially recommended deployment topology is **Helm + DaemonSet**. A DaemonSet is required because OBI must reach every node's process namespace, and `hostNetwork` / `hostPID` are wired automatically when deployed this way.  

```
# Step 1: add the OpenTelemetry Helm repository
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update

# Step 2: default install (DaemonSet in the obi namespace)
helm install obi \
  -n obi --create-namespace \
  open-telemetry/opentelemetry-ebpf-instrumentation

# Step 3: verify the install
kubectl -n obi get daemonset
kubectl -n obi logs -l app.kubernetes.io/name=obi --tail=50

# Step 4: confirm probes were loaded on each node
kubectl -n obi exec ds/obi -- ls /sys/fs/bpf/obi/
```

Enter fullscreen mode Exit fullscreen mode

The default install is enough to start collecting RED metrics and traces for every HTTP/gRPC request. In production you'll want to combine **OTLP endpoint selection, service discovery, and header enrichment** into a custom values file.  

```
# helm-obi-prod.yaml — ManoIT production values
config:
  data:
    # OTLP destination (e.g. OTel Collector ClusterIP service)
    otel:
      endpoint: http://otel-collector.observability.svc:4318
      protocol: http/protobuf
    # Automatic process discovery
    discovery:
      services:
        - k8s_namespace: "^(shop|payment|auth)$"
          k8s_pod_labels:
            obi.enabled: "true"
      exclude_services:
        - exe_path_regex: ".*/istio-proxy$"
    # ⚠️ CNIs using eBPF datapaths (Cilium eBPF, Calico eBPF) can collide
    network:
      enabled: true
      cidrs:
        - 10.0.0.0/8
    # Protocol-specific instrumentation
    routes:
      unmatched: heuristic   # generate spans even for unknown HTTP paths
    log_level: info
    log_format: json

# Pod securityContext — required eBPF capabilities
securityContext:
  privileged: false
  capabilities:
    add: ["BPF", "PERFMON", "SYS_PTRACE", "NET_ADMIN"]
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true

# DaemonSet resource limits
resources:
  requests: { cpu: 100m, memory: 256Mi }
  limits:   { cpu: 500m, memory: 512Mi }

# Node selection (exclude ARM-only clusters, GPU nodes, etc.)
nodeSelector:
  kubernetes.io/arch: amd64
tolerations:
  - key: "node.kubernetes.io/not-ready"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 300
```

Enter fullscreen mode Exit fullscreen mode

```
helm upgrade --install obi \
  -n obi --create-namespace \
  -f helm-obi-prod.yaml \
  open-telemetry/opentelemetry-ebpf-instrumentation
```

Enter fullscreen mode Exit fullscreen mode

⚠️ **Watch out:** on clusters running Cilium eBPF mode or the Calico eBPF dataplane, some of OBI's network probes can collide with CNI programs. The official recommendation is to set `network.enabled: false` and split responsibilities: **OBI for L7 application traces, Cilium Hubble or Tetragon for network flows and kernel-level security.** This role-split has become the CNCF-recommended pattern in 2026.

## [](#4-http-header-enrichment-multitenant-saas-incident-triage)4\. HTTP header enrichment — multi-tenant SaaS incident triage

Header enrichment, introduced in **v0.7.0**, is the feature that moves OBI from "monitoring tool" to **incident-response platform**. Raw traces only tell you "error rate rose to 5% on this endpoint." Header enrichment tells you **which tenants and which user segments are affected** — without any code change.  

```
# OBI values.yaml — header enrichment policy
config:
  data:
    ebpf:
      track_request_headers: true
      payload_extraction:
        http:
          enrichment:
            enabled: true
            policy:
              default_action: exclude         # never collect by default
              obfuscation_string: "***"       # mask sensitive headers
            rules:
              # 1) tenant / segment identifiers → attach as span attributes
              - action: include
                type: headers
                match:
                  patterns:
                    - "x-tenant-id"
                    - "x-user-segment"
                    - "x-org-id"
              # 2) auth tokens → record a hash but mask the value
              - action: obfuscate
                type: headers
                match:
                  patterns:
                    - "authorization"
                    - "cookie"
                    - "x-api-key"
```

Enter fullscreen mode Exit fullscreen mode

The policy design is deliberately **explicit allowlist + selective obfuscation**. The default is `exclude`, so PII and tokens can't leak by accident. Pattern matching is case-insensitive and supports wildcards (`x-manoit-*`).

Incident scenario

With raw traces only

With header enrichment

Latency spike for one tenant

"Payment API latency up" → page the entire support team

Filter by `x-tenant-id` → only two enterprise customers affected → notify their CSM directly

B2B free vs. paid segmentation

Only sees "error rate 1.2%"

Filter `x-user-segment=paid` → track SLA cohort separately

Regional issue

Needs a separate ALB-log analysis

`x-region` header + OBI spans on the same Grafana panel

Per-API-key rate limiting

401/429 visible, which key is unclear

Masked `x-api-key` hash identifies the top offenders

## [](#5-2026-roadmap-four-axes-toward-10-ga)5\. 2026 roadmap — four axes toward 1.0 GA

The OBI SIG published its official 2026 roadmap with **four axes**, each with a named sponsor and GitHub milestones — making it possible to back-calculate adoption timelines.

Goal

Sponsor

Key deliverables

Production impact

**① 1.0 Stable Release**

@MrAlias

JSON Schema validation, declarative config standard, telemetry schema, versioning policy, test coverage targets

End of v0 breaking changes, LTS track becomes possible

**② Protocol expansion**

@marctc, @NimrodAvni78

MQTT, AMQP, NATS, Redis Pub/Sub, MongoDB enhancements, GCP/AWS/Azure SDKs, full gRPC context propagation

Coverage of message brokers and cloud SDKs

**③ .NET support**

@rafaelroquetto

.NET 8+, .NET Framework 4.x, 3.5 SP1 validation, distributed tracing + RED metrics verification

Enterprise Windows workloads covered

**④ Hybrid instrumentation**

@grcevski

Consistent labels with SDK traces, metric exemplars, multi-language composition

Organizations with existing SDK instrumentation can add OBI on top

The 1.0 GA checklist itself boils down to **configuration documentation complete, JSON Schema validation defined, per-service + per-process configuration supported, telemetry schema adopted, versioning policy formalized, test coverage targets hit**. v0.8.0 today is roughly at 60% of that checklist; the community is targeting late-2026 for 1.0 GA.

## [](#6-obi-vs-beyla-pixie-tetragon-cilium-drawing-the-lines)6\. OBI vs. Beyla / Pixie / Tetragon / Cilium — drawing the lines

With the 2026 eBPF observability space this crowded, positioning OBI correctly matters. Here's how it relates to the four most common adjacent projects.

Tool

Primary role

Relationship to OBI

Run side-by-side?

**Grafana Beyla**

HTTP/gRPC auto-tracing

**OBI's direct ancestor** — Grafana Cloud users can stay on Beyla, OBI is the upstream successor

New projects → OBI

**Pixie** (New Relic)

Auto APM + scripting (PxL)

Pixie ties to New Relic's backend, OBI is vendor-neutral via OTLP

Existing NR customers stay on Pixie; OTLP-first teams choose OBI

**Cilium Tetragon**

Process / file / network security + real-time enforcement (LSM)

Different role — OBI observes applications, Tetragon detects and enforces security

**Run both** (two DaemonSets, different jobs)

**Cilium Hubble**

L3/L4 network flow + service map

OBI is L7 (HTTP/gRPC) payloads; Hubble is L3/L4 packets

**Run both** — layered responsibility

**Grafana Alloy + Pyroscope**

Continuous profiling (CPU, memory)

OBI traces + RED; Pyroscope function-level profiles

Run together → trace-to-profile drilldown

In one sentence: **OBI is the OTLP-standard implementation of L7 application observability.** L3/L4 security belongs to Tetragon, network flows to Hubble, profiling to Pyroscope, and OBI handles application traces, RED metrics, SQL, and GenAI. That **role-separated architecture** has become the default CNCF observability stack in 2026.

## [](#7-production-adoption-checklist-8-steps)7\. Production adoption checklist (8 steps)

Step

Check

Tool / command

① Kernel

All nodes on **5.8+** with BTF enabled

`uname -r`, `ls /sys/kernel/btf/vmlinux`

② CNI collision

Audit for Cilium / Calico eBPF mode collisions

`cilium status`, OBI `network.enabled: false`

③ Privileges

DaemonSet has `CAP_BPF + CAP_PERFMON + CAP_SYS_PTRACE`

Verify against PodSecurityAdmission

④ OTLP pipeline

OTel Collector receives, backend (Tempo/Jaeger/Splunk) wired

`otelcol validate`, inspect receive metrics

⑤ Service discovery

Allowlist of namespaces / labels for instrumentation

Enforce labels via Kyverno / OPA Gatekeeper

⑥ Header enrichment

PII leakage prevented — obfuscate `authorization`, `cookie`, `api-key`

Test `obfuscation_string` + allowlist

⑦ Resource tuning

On high-traffic nodes (10k RPS+) adjust CPU / memory limits

Monitor Prometheus `obi_bpf_*` metrics

⑧ v0 instability

v0 minor releases may break — pin versions

GitOps: pin `v0.8.0`, never floating `main`

## [](#8-manoit-production-recommendations)8\. ManoIT production recommendations

-   **Three-DaemonSet architecture**: OBI (L7 traces) + Cilium Hubble (L3/L4) + Tetragon (security). Realistic per-node budget is about `cpu: 800m / mem: 1.5Gi` combined.
-   **Progressive namespace rollout**: attach the `obi.enabled=true` label only where you need it and expand horizontally over 1–2 weeks of observation. Rolling out to every namespace on day one will bottleneck the OTel Collector.
-   **OTLP backend sampling**: OBI is designed for **100% capture**, which can explode backend storage costs. Always set **tail-based sampling** at the Collector (latency > 1s, all error traces, 1% of normal traces).
-   **GenAI payload policy**: the OpenAI / Anthropic instrumentation is powerful, but **system prompts and user input can land in traces**. Make `payload_extraction.genai.redact: true` the default, and switch to a whitelist-only model when you need the payloads.
-   **Staging verification against v0**: v0 minors are allowed to break. Every OBI upgrade should re-validate the full trace field mapping in staging before rolling to prod.
-   **Header enrichment governance**: every new header addition should go through **security review**. Add "PII included? / obfuscation needed?" checkboxes to your Git PR template.

## [](#9-conclusion-observability-moves-to-the-kernel)9\. Conclusion — observability moves to the kernel

OBI's beta launch is a signal that observability's center of gravity is moving **from SDKs to the kernel** and **from vendor-specific agents to the OTLP standard**. Where OpenTelemetry in the early 2020s solved "vendor-locked instrumentation code," OBI in 2026 is solving "**don't write that instrumentation code in the first place.**" Application teams focus on business logic; platform teams deliver consistent observability at the kernel layer. That separation of responsibilities is closer than ever to what SRE and DevSecOps communities have been chasing for a decade. ManoIT recommends evaluating OBI as the default observability layer for every Kubernetes 1.28+ environment, and we plan to adopt it into our customer standard stack once 1.0 GA lands in late 2026. Grafana Labs donating Beyla, @grcevski leading the SIG, and the Splunk observability team carrying it over the KubeCon finish line — that model of community collaboration is the reason OpenTelemetry is still, in 2026, the healthiest CNCF project in the ecosystem.

* * *

_This article was co-authored by the ManoIT engineering team together with Anthropic's Claude Opus 4.7, based on: [OpenTelemetry eBPF Instrumentation official docs](https://opentelemetry.io/docs/zero-code/obi/), [OBI 2026 Goals](https://opentelemetry.io/blog/2026/obi-goals/), [OBI HTTP Header Enrichment](https://opentelemetry.io/blog/2026/obi-http-header-enrichment/), [GitHub opentelemetry-ebpf-instrumentation v0.8.0](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation), the [Splunk KubeCon EU 2026 announcement](https://cloudnativenow.com/kubecon-cloudnativecon-europe-2026/splunk-introduces-opentelemetry-ebpf-instrumentation-and-kubernetes-operator-at-kubecon-eu-2026/), and [the OBI First Release Announcement](https://opentelemetry.io/blog/2025/obi-announcing-first-release/)._

* * *

_Originally published at [ManoIT Tech Blog](http://www.manoit.co.kr/forum/view/1460143)._
