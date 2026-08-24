# Dynatrace Moves Upstream: Bindplane Acquisition Targets Data Control

**Source:** https://www.forbes.com/sites/stevemcdowell/2026/04/09/dynatrace-moves-upstream-bindplane-acquisition-targets-data-control/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Dynatrace acquires Bindplane to take control of the telemetry pipeline layer, closing a critical data governance gap as AI workloads demand higher-quality observability inputs.

---

![Observability and Log Management Software Solutions - 3D Illustration](https://imageio.forbes.com/specials-images/imageserve/69d727160cf1b12cf0c84bd0/Observability-and-Log-Management-Software-Solutions---3D-Illustration/0x0.jpg?width=960)

Observability and Log Management Software Solutions

getty

[Dynatrace](https://www.forbes.com/companies/dynatrace/), a leader in enterprise IT observability, [announced](https://www.dynatrace.com/news/blog/dynatrace-to-acquire-bindplane-telemetry-pipeline/) it has signed a definitive agreement to acquire Bindplane, a modern telemetry pipeline company whose technology manages, optimizes, and routes observability data before it reaches backend systems. The deal is expected to close later this month.

Observability has become the foundation of modern enterprise IT. Without insight into what occurs inside distributed systems, AI pipelines, and cloud-native applications, teams can't control costs, ensure reliability, or make the automated decisions required by today's operations. However, observability platforms are only as effective as the data they receive, and that data challenge is growing faster than most organizations anticipated.

The acquisition allows Dynatrace to address a critical gap that has become more pronounced as telemetry volumes increase and AI workloads require higher-quality, better-governed inputs.

## A Worsening Data Problem

Cloud-native architectures have fundamentally changed the nature of observability data. Logs, metrics, traces, and events were once generated at a manageable rate by a relatively small number of systems. Today, AI-powered applications, edge deployments, and ephemeral microservices produce telemetry continuously and at scale, from hundreds or thousands of sources that are active simultaneously.

The consequences are both financial and operational. Ingesting unfiltered telemetry at scale is costly. Fragmented collection across multiple agents and tools makes normalization more difficult. Without a control plane to govern what data is collected, enriched, and routed, the signal-to-noise ratio worsens precisely when teams need clarity most, such as when AI systems make automated decisions on their behalf.

MORE FOR YOU

## What is Bindplane?

Built on [OpenTelemetry](https://opentelemetry.io/), the open-source observability framework that has become the standard for enterprise telemetry collection, Bindplane acts as a control plane for observability data, intercepting it at the edge before it reaches downstream platforms.

Bindplane enables teams to filter unnecessary data before ingestion, reducing costs without sacrificing visibility. It does this by normalizing signals across heterogeneous environments, enriching data with context to improve the accuracy of downstream analysis, and routing telemetry flexibly across observability, security, and analytics platforms. Importantly, it also fulfills compliance requirements by masking and encrypting sensitive data at the collection layer.

Perhaps equally important for enterprise buyers transitioning from legacy monitoring systems, Bindplane offers a structured migration path to modern, cloud-native observability. This alleviates one of the most common friction points in enterprise platform transitions: the cost and disruption of ripping out existing instrumentation.

## Why Dynatrace Acquired Bindplane

Dynatrace has built a leading AI-powered platform for understanding and acting on observability data by surfacing anomalies, root-cause insights, and automated remediation across complex distributed environments. What the platform has not fully owned, until now, is the data collection layer that sits upstream of analysis.

This gap is more crucial in the AI era than in previous IT generations because the value of AI-driven insights relies heavily on data quality. Noisy, unnormalized, or incomplete telemetry leads to unreliable results. As Dynatrace continues to integrate AI into its platform, data layer fidelity becomes a key competitive advantage.

I spoke with Dynatrace Chief Product Officer Steve Tack, who explained that as data volumes grow and AI becomes central to how teams develop and manage software, customers need a unified, open approach to handle their data. The combined offering will lay a foundation that provides customers with the clarity and control they need to operate confidently and foster innovation.

The acquisition also directly accelerates Dynatrace's Log Management and Analytics roadmap. Customers will benefit from increased ingest capacity across a wider variety of data sources and the ability to direct telemetry to any destination. This capability reinforces Dynatrace's commitment to open standards while expanding the platform's reach into adjacent security and compliance use cases.

## A TAM Expander

The telemetry pipeline market is still forming, but its significance is clear. Vendors like Cribl, Mezmo, and others have built dedicated businesses around telemetry routing and management, attracting enterprise customers who require greater control over data governance and costs than traditional observability platforms provide.

By acquiring Bindplane rather than building pipeline capabilities in-house, Dynatrace gains proven technology, an established customer base, and an OpenTelemetry-native architecture that aligns with where enterprise buyers are headed. Dynatrace will continue to offer Bindplane as a standalone product, maintaining existing customer relationships and partner ecosystem integrations.

A standalone offering also broadens Dynatrace's total addressable market. Organizations currently using Bindplane alongside competing observability platforms represent potential Dynatrace customers, and Bindplane's multi-destination routing capability means it can act as an entry point into accounts that Dynatrace's core platform has not yet reached.

## The Competitive Landscape

The observability market is highly competitive and rapidly consolidating. Dynatrace's main competitors—[Datadog](https://www.forbes.com/companies/datadog/), New Relic, Elastic, and [Cisco](https://www.forbes.com/companies/cisco-systems/)’s Splunk—each offer different strengths in the enterprise market. What this acquisition changes is the range of competitive challenges Dynatrace can now address.

Datadog has expanded rapidly by broadening its platform to include log management, security monitoring, and infrastructure features alongside its core metrics platform. It has also invested in telemetry pipelines, but its strategy relies heavily on its proprietary agent ecosystem. In contrast, Dynatrace with Bindplane offers an open-source, OpenTelemetry-native architecture, a key differentiator for enterprises seeking to standardize on open instrumentation and avoid vendor lock-in.

Cisco’s acquisition of Splunk created a combined entity with strong SIEM and security analytics abilities, along with traditional IT operations observability. The integration of network telemetry with application and infrastructure data is a central part of Cisco's value proposition. Dynatrace's acquisition of Bindplane broadens its presence in the telemetry governance space, strengthening its position in accounts where security and operations data pipelines overlap.

The more direct competitive response targets dedicated telemetry pipeline vendors. Cribl, for example, has built a substantial business around log and metrics routing, using a vendor-agnostic model that appeals to enterprises running multi-tool observability stacks. Mezmo and others occupy related positions. These vendors have all benefited from the gap that existed between data collection and observability analytics.

With Bindplane, Dynatrace moves directly into this space. Importantly, it does so with a product that supports multi-destination routing, meaning Bindplane customers can still route data to Datadog, Splunk, Elastic, or any other destination. This preserves Bindplane's appeal as a neutral pipeline layer while giving Dynatrace a presence in accounts it does not yet fully own. It is a classic land-and-expand strategy executed through acquisition.

The OpenTelemetry focus also has long-term competitive implications. As the CNCF-backed standard matures and more enterprise tools adopt it natively, the ability to collect, transform, and route OTel-formatted telemetry becomes a core platform competency. Dynatrace now offers that capability in a purpose-built form, rather than relying on piecemeal agent integrations.

## Analyst’s Take

This is a well-timed and strategically sound acquisition. Observability platforms have long competed on what they can do with data once it arrives. The next battleground is upstream, where those who control the collection, normalization, and routing layer determine what data arrives, in what form, and at what cost.

Dynatrace recognizes that AI-powered analytics are only as valuable as the data pipelines that feed them. By acquiring Bindplane, the company closes a gap that will become increasingly consequential as enterprise AI deployments mature and the cost of poor telemetry governance increases.

For enterprise IT leaders evaluating observability investments, this combination offers something the market has lacked. Dynatrace is now a single vendor capable of managing telemetry from the edge to AI-driven insights, built on open standards and flexible enough to operate across multi-cloud and hybrid environments.

The acquisition brings telemetry pipeline control upstream, positioning Dynatrace to capture a fast-growing market segment as AI-driven architectures push data volumes to new extremes. It’s a compelling story and a strong move by Dynatrace.
