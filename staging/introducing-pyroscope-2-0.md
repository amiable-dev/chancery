# Introducing Pyroscope 2.0: faster, more cost-effective continuous profiling at scale

**Source:** https://grafana.com/blog/pyroscope-2-0-release/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Pyroscope 2.0 makes continuous profiling practical at scale, reducing storage costs, simplifying operations, and helping you find performance bottlenecks faster.

---

Continuous profiling is becoming a standard part of the observability stack, and for good reason. It's the only signal that tells you _why_ your code is slow or expensive, not just that it is. Metrics tell you CPU usage is high. Logs tell you a request was slow. Traces tell you which service is the bottleneck. But only a profile tells you which function, on which line, is burning the cycles.

As systems grow more complex, that level of visibility becomes essential. OpenTelemetry recently [declared its Profiles signal as alpha](https://opentelemetry.io/blog/2026/profiles-alpha/), marking a clear step toward profiling becoming a first-class observability signal. 

Now, we’re also taking a next step with the release of [Pyroscope 2.0](https://github.com/grafana/pyroscope/releases), a ground-up rearchitecture of our [open source continuous profiling database](https://grafana.com/docs/pyroscope/latest/?pg=pyroscope-2-0-release&plcmt=in-text). It’s designed to make continuous profiling more cost-effective at scale, and with native support for OpenTelemetry Protocol (OTLP) profiling, you can start ingesting profiles using the emerging standard today.

## [](#the-case-for-always-on-profiling)The case for always-on profiling

Before we get into what's new in Pyroscope 2.0, it's worth talking about why continuous profiling matters, especially because the payoff is larger than most teams realize.

### [](#cut-infrastructure-costs-with-data-not-guesswork)Cut infrastructure costs with data, not guesswork

Cloud spend is one of the biggest line items in engineering budgets, and a significant part of it is CPU and memory. Teams routinely overprovision because they don't have fine-grained visibility into what's actually consuming resources.

Continuous profiling changes that equation. When you can see exactly which functions are responsible for CPU and memory consumption—across every service, in production, over time—you can make targeted optimizations instead of throwing hardware at the problem. 

### [](#faster-root-cause-analysis)Faster root cause analysis

When an incident hits, the first question is always _why_. Metrics and traces narrow the blast radius; you know which service, which endpoint, and maybe which deployment introduced the regression. But the last mile of root cause analysis is where teams lose hours.

With continuous profiling, that last mile shrinks to minutes. You can compare a profile from before and after the regression, [diff](https://grafana.com/docs/pyroscope/latest/view-and-analyze-profile-data/pyroscope-ui/?pg=pyroscope-2-0-release&plcmt=in-text#diff-page-identify-changes-with-differential-analysis) them, and see exactly which code paths changed. No reproducing in staging, no adding ad-hoc logging, and no guessing.

### [](#understand-latency-at-the-code-level)Understand latency at the code level

While distributed tracing tells you where wall clock time is spent, profiling tells you where the CPU spends that time. Together, they close the observability gap. A trace might show that your auth service added 200ms to a request, while a profile shows you that 150ms of that was in a regex compilation that could be cached.

This is especially powerful for tail latency, where the p99 spikes are hard to reproduce and harder to diagnose. Continuous profiling captures these moments as they happen, so you don't have to rely on luck with a debugger.

## [](#pyroscope-20-a-closer-look-at-whats-new)Pyroscope 2.0: a closer look at what’s new

The original Pyroscope architecture was based on [Cortex](https://cortexmetrics.io/docs/architecture/), which is the same foundation that  the [Mimir](https://grafana.com/docs/mimir/latest/?pg=pyroscope-2-0-release&plcmt=in-text) and [Loki](https://grafana.com/docs/loki/latest/?pg=pyroscope-2-0-release&plcmt=in-text) projects started with. It worked, but it carried overhead that made large-scale continuous profiling expensive to run and operationally heavy.

All three projects have since outgrown that foundation. [Mimir recently redesigned its architecture](https://grafana.com/blog/the-next-generation-of-grafana-mimir-inside-mimirs-redesigned-architecture-for-increased-reliability/?pg=pyroscope-2-0-release&plcmt=in-text) to eliminate write-path replication, decouple reads from writes, and make object storage the single source of truth. Pyroscope 2.0 applies similar architectural principles, adapted for the unique characteristics of profiling data: large payloads, heavy symbolic information, and bursty query patterns. The result is a system that's dramatically cheaper, faster, and simpler to operate.

![Blog image](https://grafana.com/mw/_next/image/?url=https%3A%2F%2Fa-us.storyblok.com%2Ff%2F1022730%2F1006x503%2Fdc38c83fe8%2Fpyroscope-v2-architecture.png%2Fm%2Ffilters%3Aformat\(webp\)%3Aquality\(100\)%2F&w=3840&q=75)

### [](#profiling-at-scale-without-the-cost-penalty)Profiling at scale without the cost penalty

The [v1 architecture](https://grafana.com/docs/pyroscope/latest/reference-pyroscope-architecture/about-grafana-pyroscope-architecture/?pg=pyroscope-2-0-release&plcmt=in-text) for Pyroscope replicated every profile three times on the write path. For a signal where a single profile can be tens of megabytes, that 3x amplification added up fast. Pyroscope 2.0 eliminates write-path replication entirely, so each profile is written exactly once to object storage.

But the bigger win is data co-location. Profiles from the same service now are stored close together, which means symbolic information like function names, source locations, and stack traces—which are often 60% or more of a profile's size—is deduplicated and kept within as few objects as required by the service’s data volume. In our production environment, this reduced the symbol storage footprint by up to 95%.

For teams that avoided continuous profiling because of storage and compute costs, these architectural changes make it practical to run profiling at scale.

### [](#query-performance-that-matches-the-workflow)Query performance that matches the workflow

Profiling queries are inherently expensive due to the sheer volume of data involved. Each pod continuously emits stack trace samples, so querying 100 pods over 12 hours means scanning and merging hundreds of millions of samples, which can require hundreds of CPU-seconds of processing. 

In v1, this work happened inside stateful components that couldn't scale elastically; you had to reserve capacity for peak query load, even if that capacity sat idle 99% of the time.

Pyroscope 2.0 makes the entire read path stateless. Any querier can process any query, and queriers scale up and down based on demand. You pay for query compute when you're _actually_ querying instead of all the time.

This matters because profiling has a bursty access pattern. There is essentially no base load; nobody is polling profiles on a dashboard every 30 seconds. But when an incident happens, multiple engineers start running heavy queries simultaneously. And increasingly, LLM-powered agents are querying profiling data autonomously as part of automated investigations, adding significant traffic. With stateless queriers, the system can handle these spikes gracefully without paying for idle capacity the rest of the time.

### [](#operational-simplicity)Operational simplicity

Fewer stateful components means fewer things that can break and faster recovery when they do. Rollouts that took 8-12 hours in v1 now complete in minutes. The segment writer is diskless. The store-gateway is gone. The operational surface area is significantly smaller.

![A chart showing deploy durations for Pyroscope.](https://grafana.com/mw/_next/image/?url=https%3A%2F%2Fa-us.storyblok.com%2Ff%2F1022730%2F1520x307%2F9485d6373a%2Fpyroscope-2-0-deploy-duration-chart.png%2Fm%2Ffilters%3Aformat\(webp\)%3Aquality\(100\)%2F&w=3840&q=75)

For teams running Pyroscope themselves, this is the difference between "we need a dedicated person to operate this" and "it just runs."

## [](#pressure-tested-in-grafana-cloud)Pressure-tested in Grafana Cloud

[Grafana Cloud Profiles](https://grafana.com/products/cloud/profiles/?pg=pyroscope-2-0-release&plcmt=in-text), our hosted continuous profiling tool powered by Pyroscope, has been running Pyroscope 2.0 in production since April 2025. We rolled it out to every region by September, and have since processed 19.5PB of profiling data. The challenges we set out to fix, including wasteful replication, coupled read/write paths, and slow rollouts, are measurably gone.

If you're a Grafana Cloud Profiles user, the migration has already happened. This release brings the same production-proven architecture to the open source community.

## [](#a-foundation-for-new-capabilities)A foundation for new capabilities

Beyond the operational improvements, the cleaner architecture in Pyroscope 2.0 enables features that simply weren't feasible in v1, including:

-   **Metrics from profiles**: aggregate profiling data into fleet-wide metrics to compare resource consumption across services, versions, or deployments without querying individual profiles.
    
-   **Individual profile inspection**: drill into a single profile instance rather than only viewing aggregates.
    
-   **Heatmap queries** (shown below): visualize profile distributions over time to spot patterns and outliers.
    
-   **Richer query types**: the stateless read path and cleaner data model make it possible to build new analysis capabilities without touching every component in the system.
    

![A screenshot of a heatmap query in Pyroscope 2.0.](https://grafana.com/mw/_next/image/?url=https%3A%2F%2Fa-us.storyblok.com%2Ff%2F1022730%2F622x343%2Fbe8685f6e7%2Fpyroscope-2-0-heatmap.png%2Fm%2Ffilters%3Aformat\(webp\)%3Aquality\(100\)%2F&w=3840&q=75)

## [](#getting-started)Getting started

[Pyroscope 2.0](https://github.com/grafana/pyroscope/releases) is available now. If you're upgrading from v1, the key change is that **object storage is required** for distributed deployments, as it's the single source of truth for all profile data. 

For step-by-step migration instructions, please reference our [Pyroscope 2.0 migration guide](https://grafana.com/docs/pyroscope/next/reference-pyroscope-v2-architecture/migrate-from-v1/?pg=pyroscope-2-0-release&plcmt=in-text). You can also learn more in our [release notes](https://grafana.com/docs/pyroscope/latest/release-notes/v2-0/?pg=pyroscope-2-0-release&plcmt=in-text#version-200-release-notes).

_To learn more about all the announcements coming out of GrafanaCON 2026, read our_ _[GrafanaCON announcements blog post](https://grafana.com/blog/grafanacon-2026-announcements/?pg=pyroscope-2-0-release&plcmt=in-text)__._ 

Tags
