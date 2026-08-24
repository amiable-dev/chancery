# Introducing OpenTelemetry eBPF Instrumentation: Why we donated Grafana Beyla to OpenTelemetry

**Source:** https://grafana.com/blog/opentelemetry-ebpf-instrumentation-beyla-donation/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> We’re excited to share that we’ve made the initial code drop of Grafana Beyla to OpenTelemetry, under the new project name OpenTelemetry eBPF Instrumentation.

---

Here at Grafana Labs, we have a deep and long-standing commitment to the OpenTelemetry project. Over the years, we’ve prioritized building compatibility with OTel into our products and open source projects — and [Grafana Beyla](https://grafana.com/oss/beyla-ebpf/?pg=blog&plcmt=body-txt) has been a leading example of those efforts.

In fact, about six months ago, we started on a journey [to donate Beyla](https://github.com/open-telemetry/community/issues/2406) — the open source eBPF-based, zero-code instrumentation tool — to the OpenTelemetry project. With a lot of help and support from both Grafanistas and the open source community, we’re excited to announce at [GrafanaCON 2025](https://grafana.com/blog/2025/05/07/grafanacon-2025-announcements/?pg=opentelemetry-ebpf-instrumentation-beyla-donation&plcmt=in-text) that we’ve made the [initial code drop](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation/pull/15) of Beyla to OpenTelemetry, under the new project name **OpenTelemetry eBPF Instrumentation**.

We are working full time to meet the code acceptance criteria as outlined in the [due diligence document](https://docs.google.com/document/d/1ASIhxHCVCToo2lNrKgGHntb8cRzkShiZ43xlBcP5_Is/edit?tab=t.0), which will finalize the donation process.

First, as a Beyla maintainer, I’d like to take this opportunity to thank everyone who’s contributed to the project. Without your contributions, we would’ve never succeeded in making Beyla what it is today, or making this significant contribution to the open source community. I’d also like to thank everyone in the OpenTelemetry community who reviewed our proposal and the due diligence document (more on that below).

Now, let’s take a closer look at why we’re donating Beyla, what it means for users and the broader open source community, and what’s next.

## [](#why-grafana-labs-donated-beyla-to-open-telemetry)Why Grafana Labs donated Beyla to OpenTelemetry

When we started working on Beyla over two years ago, we didn’t know exactly what to expect. We knew we needed a tool that would allow us to capture application-level telemetry for compiled languages, without the need to recompile the application. Being an OSS-first and metrics-first company, without legacy proprietary instrumentation protocols, we decided to build a tool that would allow us to export application-level metrics using OpenTelemetry and eBPF.

The [first version of Beyla](https://grafana.com/blog/2023/11/14/grafana-beyla-1.0-release-zero-code-instrumentation-for-application-telemetry-using-ebpf/?pg=opentelemetry-ebpf-instrumentation-beyla-donation&plcmt=in-text), released in November 2023, was limited in functionality and instrumentation support, but it was able to produce OpenTelemetry HTTP metrics for applications written in any programming language. It didn’t have any other dependencies, it was very light on resource consumption, it didn’t need special additional agents, and a single Beyla instance was able to instrument multiple applications.

After successful deployments with a few users, we realized that the tool had a unique superpower: instrumenting and generating telemetry where all other approaches failed.

Our main Beyla users were running legacy applications that couldn’t be easily instrumented with OpenTelemetry or migrated away from proprietary instrumentation. We also started seeing users who had no easy access to the source code or the application configuration, who were running a very diverse set of technologies, and who wanted unified metrics across their environments.

We had essentially found a niche, or a gap in functionality, within existing OpenTelemetry tooling. There were a large number of people who preferred zero-code (zero-effort) instrumentation, who for one reason or another, couldn’t or wouldn’t go through the effort of implementing OpenTelemetry for the diverse sets of technologies that they were running. This is when we realized that Beyla should become a truly community-owned project — and, as such, belonged under the OpenTelemetry umbrella.

## [](#why-donate-beyla-to-open-telemetry-now)Why donate Beyla to OpenTelemetry now?

While we knew in 2023 that Beyla could address a gap in OpenTelemetry tooling, we also knew that the open source world is full of projects that fail to gain traction. We wanted to see how Beyla usage would hold and grow.

We also knew that there were a number of features missing in Beyla, as we started getting feedback from early adopters. Before donating the project, there were a few things we wanted to address.

For example, the first version of Beyla had no support for distributed tracing, and we could only instrument the HTTP and gRPC protocols. It took us about a year, and many iterations, to finally figure out generic OpenTelemetry distributed tracing with eBPF. Based on customer feedback, we also added support for capturing network metrics and additional protocols, such as SQL, HTTP/2, Redis, and Kafka.

In the fall of 2024, we were able to [instrument the full OpenTelemetry demo with a single Beyla instance](https://grafana.com/events/observabilitycon/2024/opentelemetry-grafana-alloy-beyla-demo-of-instrumentation-ingestion/?pg=opentelemetry-ebpf-instrumentation-beyla-donation&plcmt=in-text), installed with a single Helm command line (shown below). We also learned what it takes to support and run an eBPF tool in production. Beyla usage grew significantly, with more than 100,000 Docker images pulled each month from our official repository.

The number of community contributors to Beyla also outpaced Grafana Labs employees tenfold. At this point, we became confident that we can grow and sustain the project, and that it was time to propose the donation.

![A screenshot of a Grafana Beyla dashboard.](https://grafana.com/mw/_next/image/?url=https%3A%2F%2Fa-us.storyblok.com%2Ff%2F1022730%2Fbc980a4475%2Fbeyla-2-0-otel-demo-screenshot.png%2Fm%2Ffilters%3Aformat\(webp\)%3Aquality\(100\)%2F&w=3840&q=75)

## [](#looking-ahead-whats-next-for-beyla-after-the-donation)Looking ahead: what’s next for Beyla after the donation?

In short, Beyla will continue to exist as Grafana Labs’ distribution of the upstream OpenTelemetry eBPF Instrumentation. As the work progresses on the upstream OpenTelemetry repository, we’ll start to remove code from the Beyla repository and pull it from the OpenTelemetry eBPF Instrumentation project. Beyla maintainers will work upstream first to avoid duplication in both code and effort.

We hope that the Beyla repository will become a thin wrapper of the OpenTelemetry eBPF Instrumentation project, containing only functionality that is Grafana-specific and not suitable for a vendor-neutral project. For example, Beyla might contain functionality for easy onboarding with [Grafana Cloud](https://grafana.com/products/cloud/?pg=blog&plcmt=body-txt) or for integrating with [Grafana Alloy](https://grafana.com/docs/alloy/latest/?pg=opentelemetry-ebpf-instrumentation-beyla-donation&plcmt=in-text), our OpenTelemetry Collector distribution with built-in Prometheus pipelines and support for metrics, logs, traces, and profiles.

Again, we want to sincerely thank everyone who’s contributed to Beyla since 2023 and to this donation. In particular, I’d like to thank Juraci Paixão Kröhling, former principal engineer at Grafana Labs and an OpenTelemetry maintainer, who helped guide us through each step of the donation process.

I’d also like to specifically thank OpenTelemetry maintainer Tyler Yahn and OpenTelemetry co-founder Morgan McLean, who reviewed our proposal, gave us invaluable and continuous feedback, and prepared the due diligence document.

We look forward to driving further innovation around zero-effort instrumentation within the OTel community! To learn more and share feedback, we welcome you to join our [OpenTelemetry eBPF Instrumentation Special Interest Group (SIG) call](https://docs.google.com/document/d/1ZkmUT2EHKfgtLqrgx3WI8aBy2QNyZeTwSKXxe3DI6Pw/edit?tab=t.0#heading=h.qmcppej1vhtj), or reach out via [GitHub](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation). We can’t wait to hear what you think.
