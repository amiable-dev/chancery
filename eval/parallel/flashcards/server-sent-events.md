---
tags: [flashcards, web-platform, protocols, streaming, domain/standards, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Server-sent events — Flashcards

#flashcards/web-platform

## Definition <!-- kb:card:d4154b -->
What is server-sent events (SSE)?
?
A web platform standard for one-way server-to-client push over a long-lived HTTP response, where each server message arrives in the page as a DOM event, so the page reacts instead of polling.

## Wire format <!-- kb:card:150216 -->
How does the SSE wire format work?
?
The server answers a normal HTTP request with type text/event-stream and never closes it, appending newline-delimited records with data, event, id and retry fields that the browser parses into dispatched events.

## Rides on plain HTTP <!-- kb:card:8ed7ed -->
Why does SSE work unchanged with existing HTTP infrastructure like proxies, auth and CDNs?
?
Because it's a plain HTTP response, not a protocol upgrade — everything already built for HTTP (cookies, auth headers, TLS termination, reverse proxies, gzip, CDN routing) applies without change.

## Reconnection ownership <!-- kb:card:ff4e10 -->
Who owns reconnection after a dropped SSE stream, and how does resumption work?
?
The client (browser) does — it automatically reconnects after the server's advertised retry interval and sends the last event id it saw in a Last-Event-ID header so the server can resume from that point.

## Hard constraints <!-- kb:card:bcaaf7 -->
What are SSE's hard constraints on data format and connections?
?
It's UTF-8 text only, no binary frames; under HTTP/1.1 each open stream consumes one of a browser's few per-origin connections, a limit HTTP/2 multiplexing removes.

## SSE vs. WebSocket <!-- kb:card:922908 -->
When should you choose SSE over WebSocket?
?
When the server does the talking and the client only needs to listen, not reply on the same channel.
