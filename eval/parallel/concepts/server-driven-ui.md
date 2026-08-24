---
title: Server-driven UI
date: 2026-08-24
domain: software-distribution
maturity: emerging
source_type: practitioner
tags: [concept, mobile, architecture, frontend, domain/software-distribution, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    class: external-secondary
---

# Server-driven UI

## Definition

**Server-driven UI** splits a client application into a generic renderer and a server-supplied description of what to render: the deployed binary knows how to draw a catalogue of components but not which ones appear, in what order or with what data, so screens and flows change by shipping a new payload rather than a new build.

## Explanation

The mechanism is a contract between two halves. The client ships a fixed vocabulary of components and the logic to lay them out and handle their interactions; the server sends a structured document — typically JSON — naming components, their content and their actions, which the renderer walks to produce the screen. What that buys is release decoupling, and on mobile that is the whole point: every UI change would otherwise wait on an app store review and on users updating, so experiments, merchandising changes and flow adjustments move at the pace of a deploy instead of a release cycle, and one server-side definition keeps platforms consistent instead of each client re-implementing the same logic. The costs are equally structural. The payload format is now a protocol, and protocols accrete: the recognisable failure is a configuration language that has grown to express anything, understood by nobody, and impossible to change without breaking older clients still in the wild — the reason earlier judgements of the pattern were harsh. Versioning is permanent overhead, since a payload must remain renderable by every client version still installed, and debugging spans a boundary where the failing screen exists in no repository. That is why the pattern is recommended for the highly dynamic parts of an application rather than as a blanket replacement, and why the investment in a proprietary framework is justified mainly at a scale where many teams and platforms share the same surfaces. The source is Thoughtworks' Technology Radar returning the technique to its trial ring, citing patterns published by large consumer companies and its own engagements rather than measurement.

## Key Properties

- The client ships a component vocabulary and renderer; the server ships the structure, content and actions
- UI changes deploy as payloads, bypassing app store review and user update lag
- One server-side definition keeps platforms consistent instead of duplicating logic per client
- The payload format becomes a long-lived protocol that must stay renderable by every installed client version
- Its failure mode is an over-configurable god-protocol; scope it to the dynamic parts of an app rather than all UI

## Relationships

- _No relationships recorded yet._
- [[agent-state-residence]] — server-driven UI and state residence share a resent-not-remembered architecture applied at different layers — a stateless renderer trades a per-request payload for no persistence tier on the receiving side, the same way a caller-resends design keeps a service instance stateless.

## Applications

Changing merchandising, onboarding or promotional flows in a mobile app without a release; running UI experiments where the release cycle is the bottleneck; keeping iOS, Android and web presentations of the same flow in step from one definition.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- _None yet._
