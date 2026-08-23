---
tags: [flashcards, otel, observability]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# OpenTelemetry GenAI Semantic Conventions — Flashcards

#flashcards/otel

## Definition <!-- kb:card:7ff785 -->
What are the OpenTelemetry GenAI semantic conventions?
?
A set of vendor-neutral `gen_ai.*` attributes, spans, events, and metrics that standardise how LLM calls, agent steps, and tool invocations are recorded in OpenTelemetry traces, so telemetry is portable across frameworks and backends. As of July 2026 they live in a dedicated repository and remain in Development status — nothing GenAI-specific is Stable.

## Application <!-- kb:card:b8feed -->
When would you need to coalesce `gen_ai.system` and `gen_ai.provider.name` instead of just querying one?
?
When analysing traces from real-world frameworks, because compatibility-mode instrumentation emits both the old field name (`gen_ai.system`) and the new one (`gen_ai.provider.name`) with the identical value simultaneously. Querying only one misses data from frameworks still on the old default; summing both double-counts the same value.

## Relationship <!-- kb:card:4c738f -->
How does the MCP 2026-07-28 revision relate to the OTel GenAI semantic conventions?
?
MCP deprecates its own Logging feature in favour of OpenTelemetry, and fixes W3C Trace Context key names (`traceparent`, `tracestate`, `baggage`) in its `_meta` field — see [[mcp-otel-trace-context-interlock]]. This only works as a real observability story because the GenAI semantic conventions supply the standard vocabulary MCP is delegating to.

## Risk <!-- kb:card:3c619b -->
Why is content capture (full prompt/completion text) opt-in rather than default in these conventions?
?
Prompts, completions, tool calls, and tool results are high-cardinality and frequently contain PII or secrets. Capturing them by default would push sensitive data into telemetry backends without an explicit decision; token counts and model metadata are captured by default instead.
