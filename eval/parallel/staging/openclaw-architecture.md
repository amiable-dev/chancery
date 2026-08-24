# openclaw/docs/concepts/architecture.md at main · openclaw/openclaw

**Source:** https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞  - openclaw/openclaw

---

summary

WebSocket gateway architecture, components, and client flows

read\_when

Working on gateway protocol, clients, or transports

title

Gateway architecture

## Overview

[](#overview)

-   A single long-lived **Gateway** owns all messaging surfaces (WhatsApp via Baileys, Telegram via grammY, Slack, Discord, Signal, iMessage, WebChat).
    
-   Control-plane clients (macOS app, CLI, web UI, automations) connect to the Gateway over **WebSocket** on the configured bind host (default `127.0.0.1:18789`).
    
-   **Nodes** (macOS/iOS/Android/headless) also connect over **WebSocket**, but declare `role: node` with explicit caps/commands.
    
-   One Gateway per host; it is the only place that opens a WhatsApp session.
    
-   The **hosted widget surface** is served by the Gateway HTTP server under:
    
    -   `/__openclaw__/canvas/` (hosted widget documents)
    -   `/__openclaw__/a2ui/` (A2UI renderer assets)
    
    It uses the same port as the Gateway (default `18789`).
    

## Components and flows

[](#components-and-flows)

### Gateway (daemon)

[](#gateway-daemon)

-   Maintains provider connections.
-   Exposes a typed WS API (requests, responses, server-push events).
-   Validates inbound frames against JSON Schema.
-   Emits events like `agent`, `chat`, `presence`, `health`, `heartbeat`, `cron`.

### Clients (mac app / CLI / web admin)

[](#clients-mac-app--cli--web-admin)

-   One WS connection per client.
-   Send requests (`health`, `status`, `send`, `agent`, `system-presence`).
-   Subscribe to events (`tick`, `agent`, `presence`, `shutdown`).

### Nodes (macOS / iOS / Android / headless)

[](#nodes-macos--ios--android--headless)

-   Connect to the **same WS server** with `role: node`.
-   Provide a device identity in `connect`; pairing is **device-based** (role `node`) and approval lives in the device pairing store.
-   Expose commands like `camera.*`, `screen.record`, and `location.get`; the macOS app also exposes widget-panel commands under `canvas.*`.

Protocol details: [Gateway protocol](https://github.com/openclaw/openclaw/blob/main/gateway/protocol)

### WebChat

[](#webchat)

-   Static UI that uses the Gateway WS API for chat history and sends.
-   In remote setups, connects through the same SSH/Tailscale tunnel as other clients.

## Connection lifecycle (single client)

[](#connection-lifecycle-single-client)

sequenceDiagram
    participant Client
    participant Gateway

    Client->>Gateway: req:connect
    Gateway-->>Client: res (ok)
    Note right of Gateway: or res error + close
    Note left of Client: payload=hello-ok<br>snapshot: presence + health

    Gateway-->>Client: event:presence
    Gateway-->>Client: event:tick

    Client->>Gateway: req:agent
    Gateway-->>Client: res:agent<br>ack {runId, status:"accepted"}
    Gateway-->>Client: event:agent<br>(streaming)
    Gateway-->>Client: res:agent<br>final {runId, status, summary}

Loading

## Wire protocol (summary)

[](#wire-protocol-summary)

-   Transport: WebSocket, text frames with JSON payloads.
-   First frame **must** be `connect`.
-   After handshake:
    -   Requests: `{type:"req", id, method, params}` → `{type:"res", id, ok, payload|error}`
    -   Events: `{type:"event", event, payload, seq?, stateVersion?}`
-   `hello-ok.features.methods` / `events` are discovery metadata, not a generated dump of every callable helper route.
-   Shared-secret auth uses `connect.params.auth.token` or `connect.params.auth.password`, depending on the configured gateway auth mode.
-   Identity-bearing modes such as Tailscale Serve (`gateway.auth.allowTailscale: true`) or non-loopback `gateway.auth.mode: "trusted-proxy"` satisfy auth from request headers instead of `connect.params.auth.*`.
-   Private-ingress `gateway.auth.mode: "none"` disables shared-secret auth entirely; keep that mode off public/untrusted ingress.
-   Idempotency keys are required for side-effecting methods (`send`, `agent`) to safely retry; the server keeps a short-lived dedupe cache.
-   Nodes must include `role: "node"` plus caps/commands/permissions in `connect`.

## Pairing and local trust

[](#pairing-and-local-trust)

-   All WS clients (operators + nodes) include a **device identity** on `connect`.
-   New device IDs require pairing approval; the Gateway issues a **device token** for subsequent connects.
-   Direct local loopback connects can be auto-approved to keep same-host UX smooth.
-   OpenClaw also has a narrow backend/container-local self-connect path for trusted shared-secret helper flows.
-   Tailnet and LAN connects, including same-host tailnet binds, still require explicit pairing approval.
-   All connects must sign the `connect.challenge` nonce. Signature payload `v3` also binds `platform` and `deviceFamily`; the gateway pins paired metadata on reconnect and requires repair pairing for metadata changes.
-   **Non-local** connects still require explicit approval.
-   Gateway auth (`gateway.auth.*`) still applies to **all** connections, local or remote.

Details: [Gateway protocol](https://github.com/openclaw/openclaw/blob/main/gateway/protocol), [Pairing](https://github.com/openclaw/openclaw/blob/main/channels/pairing), [Security](https://github.com/openclaw/openclaw/blob/main/gateway/security).

## Protocol typing and codegen

[](#protocol-typing-and-codegen)

-   TypeBox schemas define the protocol.
-   JSON Schema is generated from those schemas.
-   Swift models are generated from the JSON Schema.

## Remote access

[](#remote-access)

-   Preferred: Tailscale or VPN.
    
-   Alternative: SSH tunnel
    
    ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
    
-   The same handshake + auth token apply over the tunnel.
    
-   TLS + optional pinning can be enabled for WS in remote setups.
    

## Operations snapshot

[](#operations-snapshot)

-   Start: `openclaw gateway` (foreground, logs to stdout).
-   Health: `health` over WS (also included in `hello-ok`).
-   Supervision: launchd/systemd for auto-restart.

## Invariants

[](#invariants)

-   Exactly one Gateway controls a single Baileys session per host.
-   Handshake is mandatory; any non-JSON or non-connect first frame is a hard close.
-   Events are not replayed; clients must refresh on gaps.

## Related

[](#related)

-   [Agent Loop](https://github.com/openclaw/openclaw/blob/main/concepts/agent-loop) — detailed agent execution cycle
-   [Gateway Protocol](https://github.com/openclaw/openclaw/blob/main/gateway/protocol) — WebSocket protocol contract
-   [Queue](https://github.com/openclaw/openclaw/blob/main/concepts/queue) — command queue and concurrency
-   [Security](https://github.com/openclaw/openclaw/blob/main/gateway/security) — trust model and hardening
