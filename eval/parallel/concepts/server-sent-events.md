---
title: Server-sent events
date: 2026-08-24
domain: standards
maturity: established
source_type: vendor-doc
tags: [concept, web-platform, protocols, streaming, domain/standards, maturity/established, source-type/vendor-doc]
status: draft
sources:
  - url: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
    class: external-primary
---

# Server-sent events

## Definition

**Server-sent events (SSE)** is a web platform standard for one-way server-to-client push: the client opens a long-lived HTTP response and the server writes messages into it whenever it has something to say, each arriving in the page as a DOM event carrying data, so the page stops polling for new information and instead reacts to it.

## Explanation

The mechanism is deliberately thin. A client constructs an EventSource over a URL; the server answers with an ordinary HTTP response of type text/event-stream and simply never closes it, appending newline-delimited records whose fields — data, event, id, retry — the browser parses into events dispatched at the EventSource object. Because the transport is a plain HTTP response rather than a protocol upgrade, everything already built for HTTP applies unchanged: cookies and auth headers, TLS termination, reverse proxies, gzip, CDN and gateway routing. The client, not the application, owns liveness: on disconnect the browser reconnects automatically after the interval the stream last advertised, and replays the last id it saw in a Last-Event-ID request header so the server can resume from that point. The cost of that thinness is a hard set of constraints — the channel is unidirectional, UTF-8 text only with no binary frames, and under HTTP/1.1 each open stream consumes one of the small number of connections a browser allows per origin, a limit that HTTP/2 multiplexing removes. This makes SSE the cheaper half of the SSE-versus-WebSocket decision: choose it when the server does the talking and the client only listens. The MDN page captured here is a landing stub that names the EventSource interface and defers all usage guidance to a separate article, so it establishes what the feature is rather than how to build with it; the normative behaviour lives in the WHATWG HTML standard it links.

## Key Properties

- One-directional: server to client only, over a normal long-lived HTTP response
- Wire format is text/event-stream — newline-delimited data, event, id and retry fields, UTF-8 text only
- Automatic client-side reconnection with Last-Event-ID resumption is part of the standard, not the application
- Rides existing HTTP infrastructure (auth, proxies, compression) with no protocol upgrade
- Under HTTP/1.1 each stream holds one of a browser's few per-origin connections; HTTP/2 multiplexing relieves this

## Relationships

- _No relationships recorded yet._

## Applications

Streaming incremental output such as model token streams, log tails, build and job progress, price or score tickers, and notification feeds — anywhere the server has updates to push and the client's replies can travel as ordinary separate requests.

## Sources

- https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events

## See Also

- _None yet._
