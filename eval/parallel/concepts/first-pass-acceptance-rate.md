---
title: First-pass acceptance as a productivity measure
date: 2026-08-24
domain: software-engineering
maturity: emerging
source_type: practitioner
tags: [concept, metrics, ai-assisted-development, delivery, domain/software-engineering, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.thoughtworks.com/radar/techniques
    class: external-secondary
---

# First-pass acceptance as a productivity measure

## Definition

**First-pass acceptance** measures how often an agent's output is usable with minimal rework, and is proposed as the leading indicator to replace coding-throughput counts — lines generated, pull requests opened, tasks completed — which rise precisely when a tool produces more material that someone else must fix, and therefore reward the behaviour they were meant to detect.

## Explanation

The failure of throughput metrics is mechanical, not philosophical. Generated volume is the cheap quantity in an AI-assisted workflow, so measuring it captures the step that no longer constrains delivery while missing the one that does: the residual effort to reconcile that output with a team's architecture, conventions and intent. Optimising the visible number then produces the observable pathology — a queue of insufficiently reviewed changes, reviewers as the bottleneck, longer cycle times and repeated back-and-forth — so the metric degrades the outcome it claims to track. First-pass acceptance inverts this because it can only be improved by reducing rework, and rework falls through actions that are actually available: sharper specifications, better priming documents and shared instructions, more design conversation before generation, narrower tasks. It also connects to delivery outcomes rather than floating free — low acceptance shows up downstream as a higher change failure rate, and repeated iteration cycles show up as longer lead time — which is why it is proposed alongside established delivery metrics rather than instead of them, together with related signals such as iteration cycles per task, post-merge rework, failed builds and review burden. Two cautions travel with it: it belongs at team level, since individual-level measurement recreates the incentive distortion in a new variable, and it works as a prompt for reflection in retrospectives rather than as a dashboard target. The source is Thoughtworks' Technology Radar, which places throughput measurement in its caution ring on the basis of consulting observation rather than a study.

## Key Properties

- Measures usability of output on the first attempt, not the volume produced
- Throughput metrics reward generating more material for someone else to fix, worsening review load and cycle time
- Improving acceptance requires acting on specs, priming documents and design conversation — actions teams control
- Correlates with delivery outcomes: low acceptance raises change failure rate, repeated iteration extends lead time
- Tracked at team level and used for reflection; individual-level targets recreate the distortion

## Relationships

- [[contract-driven-agent-development]] — supplies the definition of accepted this metric needs — when every task carries written acceptance criteria, first-pass acceptance becomes a check against a contract rather than against a reviewer's mood
- [[skill-enforced-development-workflow]] — is the kind of process investment this metric evaluates — spec-first planning and per-task review are supposed to raise first-pass acceptance, and if the measured rate does not move, the process is not paying for itself

## Applications

Replacing lines-of-code or PR-count reporting on AI adoption with a metric tied to rework; deciding whether better instructions or narrower tasks are improving agent output; pairing with delivery metrics to show whether faster generation reached faster delivery.

## Sources

- https://www.thoughtworks.com/radar/techniques

## See Also

- [[contract-driven-agent-development]]
- [[skill-enforced-development-workflow]]
