# Release v1.42.0 · open-telemetry/semantic-conventions

**Source:** https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.42.0
**Added:** 2026-08-24
**Tags:** #unsorted

---

> 📣 Highlights 📣

Generative AI Migration: All gen_ai.* attributes, metrics, events, and spans have been deprecated and moved to the dedicated OpenTelemetry GenAI Semantic Conventions Repository. (#3...

---

## 📣 Highlights 📣

-   **Generative AI Migration:** All `gen_ai.*` attributes, metrics, events, and spans have been deprecated and moved to the dedicated [OpenTelemetry GenAI Semantic Conventions Repository](https://github.com/open-telemetry/semantic-conventions-genai). ([#3696](https://github.com/open-telemetry/semantic-conventions/issues/3696))
-   **Graduations to Stable:** A core selection of Kubernetes and container registry resource attributes have officially graduated to `stable` status. ([#3382](https://github.com/open-telemetry/semantic-conventions/issues/3382))
-   **Promotions to Release Candidate:** Several conventions advanced to `release_candidate`, including `cpu.mode` ([#3694](https://github.com/open-telemetry/semantic-conventions/issues/3694)), process attributes ([#3041](https://github.com/open-telemetry/semantic-conventions/issues/3041)), and core CPU time metrics (`k8s.pod.cpu.time`, `k8s.node.cpu.time`, and `container.cpu.time`) ([#3001](https://github.com/open-telemetry/semantic-conventions/issues/3001)).

## Changelog

### 🛑 Breaking changes 🛑

-   `gen-ai`: Move Generative AI semantic conventions to a dedicated repository. ([#3696](https://github.com/open-telemetry/semantic-conventions/issues/3696))  
    All `gen_ai.*` attributes, metrics, events, and spans previously defined under  
    `model/gen-ai/`, `model/openai/`, and `model/mcp/` (and documented under  
    `docs/gen-ai/`) are deprecated in this repository and have moved to the  
    [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
    
    Instrumentations following the new repository's conventions should refer to  
    it for the corresponding `schema_url` to use.
    
-   `http`: Change `network.peer.address` attribute requirement level from Recommended to Opt-In on the `http.client.open_connections` and `http.client.connection.duration` metrics. ([#3279](https://github.com/open-telemetry/semantic-conventions/issues/3279))  
    `network.peer.address` is typically high-cardinality (one time series per remote IP)  
    and causes unbounded growth of metric streams over the lifetime of the process when  
    exported with cumulative temporality (always the case for `http.client.open_connections`  
    since it is an UpDownCounter, and possible for `http.client.connection.duration` when  
    the histogram is configured for cumulative). Operators that need this attribute can  
    still opt-in.
    
-   `v8js`: Rename `v8js.memory.heap.limit` to `v8js.memory.heap.space.size` (per-space pre-allocated size from `v8.getHeapSpaceStatistics()`),  
    and add a new `v8js.memory.heap.limit` UpDownCounter representing the absolute heap size limit from `v8.getHeapStatistics().heap_size_limit`  
    (controlled by `--max-old-space-size` or V8 defaults).  
    ([#3476](https://github.com/open-telemetry/semantic-conventions/issues/3476))
    

### 🚀 New components 🚀

-   `browser`: Introduce `browser.document.url.full` attribute and `browser.document` entity to capture the absolute URL of the current browser document. ([#174](https://github.com/open-telemetry/semantic-conventions/issues/174))  
    The `browser.document` entity is introduced as a separate entity from `browser` because  
    the browser runtime attributes (brands, platform, language) are immutable for the SDK  
    lifetime, while the document URL changes on every navigation. The new attribute follows  
    RFC3986 and has `Recommended` requirement level at `Development` stability.

### 💡 Enhancements 💡

-   `app`: Defines a basic crash of an end-user facing app that requires a minimal amount of information. ([#3448](https://github.com/open-telemetry/semantic-conventions/issues/3448))
    
-   `cpu`: Promote `cpu.mode` attribute and its enum members to `release_candidate` ([#3694](https://github.com/open-telemetry/semantic-conventions/issues/3694))
    
-   `docs`: Add guidance for defining events in semantic conventions. ([#1855](https://github.com/open-telemetry/semantic-conventions/issues/1855))
    
-   `docs`: Don't allow signal definition to reference attributes with lower stability than the signal itself (unless they are opt-in).  
    ([#3752](https://github.com/open-telemetry/semantic-conventions/issues/3752))
    
-   `gcp`: Add GCE instance labels as resource attributes. ([#2617](https://github.com/open-telemetry/semantic-conventions/issues/2617))
    
-   `k8s`: Promote `k8s.pod.cpu.time`, `k8s.node.cpu.time` and `container.cpu.time` metrics to `release_candidate` ([#3001](https://github.com/open-telemetry/semantic-conventions/issues/3001))
    
-   `k8s`: Add metric `k8s.container.ephemeral_storage.usage` to track ephemeral storage usage by containers. ([#3681](https://github.com/open-telemetry/semantic-conventions/issues/3681))  
    This metric includes an attribute `k8s.container.ephemeral_storage.fs_type` to distinguish between `rootfs` and `logs` usage.
    
-   `k8s`: Promote a selection of k8s and container registry attributes to `stable` ([#3382](https://github.com/open-telemetry/semantic-conventions/issues/3382))
    
-   `otel`: Clarify semantics of SDK exporter metrics when the exporter performs retries: an export operation is considered finished only after the final attempt has concluded, items are counted exactly once per operation, and `otel.sdk.exporter.operation.duration` records one observation per operation covering all attempts and backoff. Also drop a spurious `error.type` note from the `*.inflight` metrics, which do not carry an `error.type` attribute.  
    ([#3770](https://github.com/open-telemetry/semantic-conventions/issues/3770))
    
-   `otel`: Reserve `already_shutdown` as a value for `error.type` on the `otel.sdk.processor.span.processed` and `otel.sdk.processor.log.processed` metrics, used when a processor drops items because it has already been shut down.  
    ([#3710](https://github.com/open-telemetry/semantic-conventions/issues/3710))
    
-   `process`: Promote process attributes to release\_candidate ([#3041](https://github.com/open-telemetry/semantic-conventions/issues/3041))
    
-   `profile`: Extend the list of known frame types with a value for LuaJIT ([#3707](https://github.com/open-telemetry/semantic-conventions/issues/3707))
    
-   `service`: Mark `service.criticality` attribute as alpha. ([#2986](https://github.com/open-telemetry/semantic-conventions/issues/2986))  
    The `service.criticality` attribute and its allowed values (`critical`, `high`, `medium`, `low`)  
    are now in alpha status.
    
-   `system, file`: Add support for filesystem lock counts ([#3611](https://github.com/open-telemetry/semantic-conventions/issues/3611))
    
-   `v8js`: Update `v8js.gc.duration` metric to match bucket boundaries used by Node.js instrumentation. ([#3761](https://github.com/open-telemetry/semantic-conventions/issues/3761))
    

### 🧰 Bug fixes 🧰

-   `browser`: remove the condition to include `user_agent.original` attribute in browser resource ([#3738](https://github.com/open-telemetry/semantic-conventions/issues/3738))
-   `cicd`: Consistent spelling of "CI/CD" throughout the CICD registry. ([#3634](https://github.com/open-telemetry/semantic-conventions/issues/3634))
-   `container`: Remove kernel from cpu.mode enum and clarify container cpu states ([#3700](https://github.com/open-telemetry/semantic-conventions/issues/3700))
-   `k8s`: Exclude `k8s.container.cpu.limit_utilization` and `k8s.container.cpu.request_utilization` metrics from code generation ([#3711](https://github.com/open-telemetry/semantic-conventions/issues/3711), [#3705](https://github.com/open-telemetry/semantic-conventions/issues/3705))

## New Contributors

-   [@mquentin](https://github.com/mquentin) made their first contribution in [#3633](https://github.com/open-telemetry/semantic-conventions/pull/3633)
-   [@Hronom](https://github.com/Hronom) made their first contribution in [#3481](https://github.com/open-telemetry/semantic-conventions/pull/3481)
-   [@Dipanshusinghh](https://github.com/Dipanshusinghh) made their first contribution in [#3739](https://github.com/open-telemetry/semantic-conventions/pull/3739)
-   [@mcollina](https://github.com/mcollina) made their first contribution in [#3761](https://github.com/open-telemetry/semantic-conventions/pull/3761)
-   [@david-luna](https://github.com/david-luna) made their first contribution in [#3738](https://github.com/open-telemetry/semantic-conventions/pull/3738)
-   [@Ayushi-12](https://github.com/Ayushi-12) made their first contribution in [#3781](https://github.com/open-telemetry/semantic-conventions/pull/3781)

**Full Changelog**: [v1.41.0...v1.42.0](https://github.com/open-telemetry/semantic-conventions/compare/v1.41.0...v1.42.0)
