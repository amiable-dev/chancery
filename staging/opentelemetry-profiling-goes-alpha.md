# OpenTelemetry Profiling goes Alpha

**Source:** https://www.polarsignals.com/blog/posts/2026/03/26/opentelemetry-profiling-goes-alpha
**Added:** 2026-08-24
**Tags:** #unsorted

---

> How to use it with Polar Signals & Parca

---

For the past couple of years, we've participated in the OpenTelemetry Profiling Working Group, which has been working hard on specifying profiling as the fourth signal within the OpenTelemetry project. Today this protocol has entered the `Alpha` stage within the OpenTelemetry project.

In this post we won't focus on the details of the protocol, the [official announcement blog post](https://opentelemetry.io/blog/2026/profiles-alpha/) does a great job at that. Instead we want to show you two examples on how to use it with the [opentelemetry-ebpf-profiler](https://github.com/open-telemetry/opentelemetry-ebpf-profiler), which is also available via an opentelemetry collector distribution. Look for the "opentelemetry-collector-ebpf-profiler" distribution, for example a container image you may use could be:

While we generally recommend our customers to use our agent (which also builds on the opentelemetr-ebpf-profiler), it may make sense to use the built-in profiler within the collector if people are already running it anyway.

An example config for an OpenTelemetry collector to produce profiling data and send it to Polar Signals Cloud.

And you can see data!

You may have noticed, none of the native stacks have been symbolized, currently only JIT, interpreted, or Go stacks are symbolized on-host, and no support for asynchronous symbolization has been specified yet, this is among other things one of the follow ups we want to specify as the group, a protocol for uploading symbol data to a backend.

Or if you want to try it with the Parca open source server. Here's the config for the OpenTelemetry collector.

Putting it together with a `docker-compose.yaml`:

This has already been a monumental effort, and while we had a part in it, we want to give a huge shout out to everyone involved! We're not done, for one there is still a decent amount of work left to eventually declare it stable.

If this sounds interesting to you to work on, join an OpenTelemetry Profiling Working Group call, which happens every 2 weeks!
