# Server-sent events - Web APIs | MDN

**Source:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Traditionally, a web page has to send a request to the server to receive new data; that is, the page requests data from the server. With server-sent events, it's possible for a server to send new data to a web page at any time, by pushing messages to the web page. These incoming messages can be treated as Events + data inside the web page.

---

**Note:** This feature is available in [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

Traditionally, a web page has to send a request to the server to receive new data; that is, the page requests data from the server. With server-sent events, it's possible for a server to send new data to a web page at any time, by pushing messages to the web page. These incoming messages can be treated as _[Events](https://developer.mozilla.org/en-US/docs/Web/API/Event) + data_ inside the web page.

## [Concepts and usage](#concepts_and_usage)

To learn how to use server-sent events, see our article [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

## [Interfaces](#interfaces)

[`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

Defines all the features that handle connecting to a server, receiving events/data, errors, closing a connection, etc.

## [Examples](#examples)

-   [Simple SSE demo using PHP](https://github.com/mdn/dom-examples/tree/main/server-sent-events "External link (opens in new tab)")

## [Specifications](#specifications)

Specification

[HTML  
\# server-sent-events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)

## [See also](#see_also)

### [Tools](#tools)

-   [Mercure: a real-time communication protocol (publish-subscribe) built on top of SSE](https://mercure.rocks/ "External link (opens in new tab)")
-   [Transmit: a native opinionated Server-Sent-Event (SSE) module built for AdonisJS](https://docs.adonisjs.com/guides/digging-deeper/server-sent-events "External link (opens in new tab)")
-   [EventSource polyfill for Node.js](https://github.com/EventSource/eventsource "External link (opens in new tab)")
-   Remy Sharp's [EventSource polyfill](https://github.com/remy/polyfills/blob/master/EventSource.js "External link (opens in new tab)")
-   Yaffle's [EventSource polyfill](https://github.com/Yaffle/EventSource "External link (opens in new tab)")
-   Rick Waldron's [jquery plugin](https://github.com/rwaldron/jquery.eventsource "External link (opens in new tab)")
-   intercooler.js [declarative SSE support](https://intercoolerjs.org/docs.html#sse "External link (opens in new tab)")

### [Related Topics](#related_topics)

-   [Learn: Making network requests with JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests)
-   [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
-   [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

### [Other resources](#other_resources)

-   [Creating a wall/feed social application](https://hacks.mozilla.org/2011/06/a-wall-powered-by-eventsource-and-server-sent-events/ "External link (opens in new tab)") powered by server-sent events and [its code on GitHub](https://github.com/mozilla/webowonder-demos/tree/master/demos/friends%20timeline "External link (opens in new tab)").
