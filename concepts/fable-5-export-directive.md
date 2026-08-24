---
title: Fable 5 export-control directive
aliases: ["Fable 5 export-control directive"]
date: 2026-08-24
domain: governance
maturity: emerging
source_type: announcement
tags: [concept, governance, ai-safety, policy, domain/governance, maturity/emerging, source-type/announcement]
status: draft
sources:
  - url: https://www.anthropic.com/news/fable-mythos-access
    hash: sha256:59403c9be01303ca40c4223ddfc1f6d2ac432cb5d287ebcfc3f46dc1bec7b36b
    retrieved: 2026-08-24
    reachability: ok
    class: external-primary
---

# Fable 5 export-control directive

## Definition

The **Fable 5 export-control directive** is the August 2026 US government order, issued under national-security authorities, suspending all access to Anthropic's Fable 5 and Mythos 5 models by any foreign national — which in effect forced the models offline for all customers — making it the first government recall of a deployed frontier model.

## Explanation

Anthropic's on-record statement is the primary source, and it documents both the event and the conceptual frame the company defended. The government's stated basis was a demonstrated jailbreak; Anthropic's review found it narrow and non-universal — eliciting capability (reading a codebase and fixing flaws) it judged widely available in other deployed models. The statement's durable distinctions: a *universal* jailbreak broadly bypasses safeguards across a wide capability range, while *non-universal* jailbreaks elicit specific information in specific circumstances; perfect jailbreak resistance is asserted to be impossible for any current provider, so the deployed posture is *defense in depth* — make jailbreaks narrow or expensive, monitor, detect, and shut down — backed by a 30-day data-retention policy adopted for jailbreak research. The governance position is equally explicit: government should be able to block unsafe deployments, but through a statutory process that is transparent, fair, clear, and technically grounded — and this directive, in the company's view, met none of those tests. Applied industry-wide, it argues, the narrow-jailbreak standard would halt all frontier deployments. One party's account of a live dispute, valuable precisely as the on-record articulation of that party's framework.

## Key Properties

- First government suspension of a deployed frontier model, via export-control authority
- Universal versus non-universal jailbreak distinction, with perfect resistance asserted impossible
- Defense in depth as the stated deployment posture: narrow or expensive jailbreaks, plus monitoring
- Argues deployment-blocking power should exist but require transparent statutory process
- Primary source; one party's account of a contested action

## Relationships

- _No relationships recorded yet._

## Applications

Reference point for AI governance discussions about deployment-blocking authority and due process; the jailbreak taxonomy transfers to any safeguard-evaluation conversation.

## Sources

- https://www.anthropic.com/news/fable-mythos-access

## See Also

- _None yet._
