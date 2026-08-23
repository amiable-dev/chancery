---
title: "Agent SSE Event Stream"
date: 2026-06-13
domain: ai-agents
maturity: emerging
source_type: practitioner
topics: [protocols, orchestration]
tags: [concept, ai-agents, architecture, sse, real-time, streaming, protocols, observability, domain/ai-agents, maturity/emerging, source-type/practitioner, topic/protocols, topic/orchestration]
status: draft
sources:
  - url: https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes
    hash: sha256:8b74ee230aaa820a021286c73d031c3fea07676469ca2a62ace332fcfe3fc5b4
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://x.com/ClaudeDevs/status/2065494480837583297
    hash: sha256:392195f86feda6201057beca14ae44d1fe4e347adf879be711be6e19787bf921
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
    hash: sha256:2d2d309ccb34f7a3ef44cbdcbb53f50fe6ede47dcdfa05e2b318657d878e193f
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Agent SSE Event Stream

## Definition
An agent SSE event stream is a persistent Server-Sent Events (SSE) channel between an application and a running agent session that delivers real-time structured event messages — tool calls, text output, status transitions, errors — enabling both live observation of agent activity and programmatic steering (pausing, redirecting, or injecting additional instructions) without polling or websockets.

## Explanation
When an AI agent runs a multi-step task, the app that created it needs to know what's happening: what tools are being called, what output is emerging, whether the session is still alive, and when it completes. Polling an API every N seconds works but is laggy and wasteful. The SSE event stream solves this by keeping an HTTP connection open and pushing events as they happen.

**Why SSE (not WebSockets)?**
SSE is unidirectional at the protocol level (server → client) over plain HTTP/2. It:
- Works through most proxies, CDNs, and firewalls without special configuration
- Reconnects automatically on disconnect with `Last-Event-ID`
- Is trivially parseable (`data: {...}\n\n` framing)
- Requires no upgrade handshake; a standard `text/event-stream` content-type header is sufficient

In the Managed Agents model, "server → client" means "agent session → your app". The SSE stream carries the agent's output to you; you send steering events back via separate API calls (inject message, pause, resume).

**Core event types in a session stream:**

| Event type | Meaning |
|-----------|---------|
| `message_start` | New assistant message begun |
| `content_block_delta` | Streaming text chunk from the model |
| `tool_use` | Agent issued a tool call (name + input arguments visible) |
| `tool_result` | Tool execution result returned to the model |
| `message_stop` | Current message complete |
| `session.status_run_started` | Session began active execution |
| `session.status_run_ended` | Session reached a terminal state |
| `error` | Execution error; may include retry guidance |

**Steering via events:**
While the SSE stream is read-only, you can influence a running session by sending additional events to the session API. Common patterns:
- **Redirect:** Send a new user message to change the agent's immediate objective
- **Pause/resume:** Temporarily halt execution (e.g., for human review) and resume when approved
- **Context injection:** Provide updated context mid-run (e.g., "the file you requested is now available at /mnt/session/inputs/data.csv")

**Webhook-triggered worker connection:**
The `session.status_run_started` event type doubles as a webhook trigger for the [[environment-worker-pattern]]. When a session is assigned to a self-hosted environment, Anthropic fires this event to a configured webhook URL, waking the worker to begin polling and claim the session.

**Consuming the stream (example):**
```python
import anthropic, json

client = anthropic.Anthropic()

with client.beta.sessions.stream(session_id=session_id) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="", flush=True)
        elif event.type == "tool_use":
            print(f"\n[Tool: {event.name}] {json.dumps(event.input)}")
        elif event.type == "session.status_run_ended":
            break
```

**Observability pattern:**
The event stream is the natural tap point for [[llm-observability]] in agentic systems. Each event has a timestamp, sequence number, and structured payload — feeding directly into trace spans. A tool_use event + subsequent tool_result pair forms an observable trace span with latency, input, and output captured.

## Key Properties
- **Push-based** — no polling overhead; events arrive as they happen
- **HTTP-native** — no special protocol; works through standard infrastructure
- **Auto-reconnect** — `Last-Event-ID` header enables resumption after network interruption without data loss
- **Structured payloads** — each event is JSON; machine-parseable for routing, alerting, or logging
- **Dual-purpose** — same event schema is used for both app consumption (streaming output) and system coordination (webhook triggers for workers)
- **Read-only channel** — observation is decoupled from steering; steering happens via separate API calls

## Relationships
- Pairs with [[managed-agent-split-plane-architecture]]: the SSE stream is the observation channel from the control plane to your app
- Triggers [[environment-worker-pattern]]: `session.status_run_started` events launch webhook-triggered workers
- Enables [[llm-observability]]: tool_use + tool_result pairs are natural trace spans; stream is the real-time tap point
- Related to [[tapes-agent-observability]]: Tapes and similar tools consume event streams to build agent traces and replay sessions
- Related to [[event-driven-dormancy]]: SSE events drive wake-ups for dormant workers; the pattern is the same (event → wake → process → sleep)
- Contrast with [[agent-to-agent-protocol]]: A2A defines agent-to-agent communication; SSE event streams are app-to-agent (or agent-to-app) communication

## Applications
**Real-time UI:** Stream agent output directly to a user-facing interface as the session runs — token by token, tool call by tool call. The SSE stream eliminates the "loading..." spinner for long tasks.

**Audit and compliance:** Log every event (tool calls with inputs, results, timing) to an immutable audit trail. The structured payload makes this operationally trivial.

**Human approval gates:** Watch the stream for `tool_use` events matching sensitive operations (e.g., `bash` with `rm` or file writes to production paths); pause the session and require human sign-off before resuming.

**Alerting and monitoring:** Route `error` events and unexpected `session.status_run_ended` events to PagerDuty or equivalent. Set SLA timers on `session.status_run_started` → `session.status_run_ended` intervals.

**Agent observability pipelines:** Feed SSE events into OpenTelemetry collectors (as structured log events or trace spans) for full agent session tracing — correlatable with infrastructure metrics.

## Study
- Flashcards: [[flashcards/agent-sse-event-stream|Practice this concept]]

## Sources
- [Claude Managed Agents — Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes) — architecture context; webhook event types
- [ClaudeDevs tweet thread](https://x.com/ClaudeDevs/status/2065494480837583297) — Events described as "SSE message stream between your app and the agent"
- [MDN: Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) — protocol reference

## See Also
- [[managed-agent-split-plane-architecture]]
- [[environment-worker-pattern]]
- [[llm-observability]]
- [[tapes-agent-observability]]
- [[event-driven-dormancy]]
- [[human-in-the-loop-pattern]]
- [[ai-agent-activity-streaming]]: related pattern but at enterprise scale — platform-level session streaming to external SIEM/compliance systems, not app-to-agent protocol
