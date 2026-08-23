---
tags: [flashcards, ai-agents, architecture, sse, real-time, streaming]
sr-due: 2026-06-13
sr-interval: 1
sr-ease: 250
---

# Agent SSE Event Stream — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:824b9e -->
What is an agent SSE event stream?
?
A persistent Server-Sent Events (SSE) channel between an application and a running agent session that delivers real-time structured event messages — tool calls, text output, status transitions, errors — enabling live observation of agent activity and programmatic steering without polling or websockets.

## Why SSE over WebSockets for agents? <!-- kb:card:f4366c -->
What makes SSE preferable to WebSockets for agent observation channels?
?
SSE is HTTP-native (no protocol upgrade), works through most proxies/CDNs/firewalls, reconnects automatically via `Last-Event-ID`, and has trivial parsing (`data: {...}\n\n`). For agent monitoring — where you mostly *read* events — the unidirectional nature is sufficient; steering happens via separate API calls, not the same channel.

## Key event types <!-- kb:card:d79807 -->
Name four important event types in an agent SSE stream and what they signal.
?
1. `tool_use` — agent issued a tool call (name + input arguments visible)
2. `tool_result` — execution result returned to the model
3. `session.status_run_started` — session began active execution
4. `session.status_run_ended` — session reached a terminal state
(Also: `content_block_delta` for streaming text, `error` for execution failures)

## Steering mechanism <!-- kb:card:d6563b -->
How do you steer or influence a running agent session if the SSE stream is read-only?
?
By sending separate API calls to the session — injecting a new user message, pausing, or resuming. The SSE stream is observation-only; control commands go through the session REST API. This decouples reading agent output from controlling agent behaviour.

## Webhook trigger connection <!-- kb:card:f9f603 -->
How does the SSE event stream relate to the environment worker pattern's webhook-triggered mode?
?
The `session.status_run_started` event type is also the webhook payload fired to wake a webhook-triggered environment worker. When Anthropic assigns a session to a self-hosted environment, it fires this event to the configured webhook URL, which wakes the dormant worker to begin polling and claim the session.

## Observability application <!-- kb:card:feadcf -->
How can agent SSE event streams feed into an OpenTelemetry observability pipeline?
?
Each `tool_use` event + subsequent `tool_result` pair forms a natural trace span with timing, tool name, input arguments, and output. The SSE stream is the real-time tap point: route events into an OTel collector as structured log events or manually constructed spans. Session ID becomes the trace ID.
