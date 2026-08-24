---
tags: [flashcards, standards, governance, protocols, domain/standards, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Protocol feature lifecycle policy — Flashcards

#flashcards/standards

## Definition <!-- kb:card:a4e097 -->
What does the MCP feature lifecycle policy (SEP-2577/2596) guarantee?
?
Every protocol feature follows Active → Deprecated → Removed, with at least twelve months between deprecation and earliest removal, and removal itself requires a separate SEP — so implementers can build on a version knowing what they ship keeps working.

## The conformance-suite gate <!-- kb:card:ddb6a5 -->
What conformance-suite gate keeps a Standards-Track SEP from silently becoming a breaking change?
?
A Standards-Track SEP can no longer reach Final status until a matching scenario lands in the conformance suite — the same suite the SDK tier system scores official SDKs against, turning 'the spec says' into 'the suite checks'.

## Three governance mechanisms together <!-- kb:card:33e818 -->
Besides the lifecycle policy itself, what other two governance mechanisms does the same MCP release install so breaking changes stay exceptional?
?
The extensions framework, which lets new capabilities stabilise outside core; and the conformance-suite gate that blocks Standards-Track SEPs from reaching Final without a matching test scenario.

## Worked example: the three deprecated features <!-- kb:card:c2c22a -->
Which three core MCP features did the release immediately deprecate, and what happens to them in the meantime?
?
Roots (replaced by tool parameters, resource URIs, or configuration), Sampling (direct LLM-provider integration), and Logging (stderr for stdio, OpenTelemetry for structured). All three are annotation-only deprecations — methods and capability flags keep working in this release and every version published within a year.

## The transferable pattern <!-- kb:card:2a0fd7 -->
What is the transferable pattern behind this policy, applicable to any protocol?
?
Pair a dated deprecation window with named replacements and a conformance gate — that lets a protocol evolve aggressively at the edges while staying safe to build on at the core.
