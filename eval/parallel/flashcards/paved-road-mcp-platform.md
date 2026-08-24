---
tags: [flashcards, infrastructure, governance, platform-engineering, domain/infrastructure, maturity/established, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Paved-road MCP platform — Flashcards

#flashcards/infrastructure

## Definition <!-- kb:card:3fb7e9 -->
What is a paved-road MCP platform?
?
A platform that bakes governance into the template a team copies to ship a server: after approval, an engineer scaffolds from a shared monorepo template and inherits default-deny write controls, audit logging, CI/CD, and secrets management for free — the governed way to deploy is also the fastest way.

## Why centralizing the template works <!-- kb:card:cd3e91 -->
Why does centralizing MCP server scaffolding into one template solve the governance problem, given the problem isn't malice?
?
The problem is variance — every hand-rolled implementation makes its own security decisions and review can't keep pace. A shared template inverts the economics: standing up a governed server becomes minutes of scaffolding, so teams take the paved road because it's genuinely easier, and controls come along invisibly.

## What stays human <!-- kb:card:323d87 -->
In a paved-road MCP platform, what step stays human rather than being automated?
?
The approval step — an AI-governance team gates what gets exposed. Everything after approval (write controls, audit logging, CI/CD, secrets management) is inherited defaults.

## The transferable design rule <!-- kb:card:752aea -->
What is the transferable design rule behind the paved-road pattern, when adoption speed and control appear to trade off?
?
Move the control into the artifact that makes people fast — so compliance stops being a tax and becomes a side effect of taking the easiest path.

## Evidence of success <!-- kb:card:d62eff -->
What evidence does Cloudflare's write-up give that the paved-road pattern worked?
?
Company-wide adoption spread beyond engineering, because governance was baked into the platform itself rather than imposed as a separate step — the adoption speed showed governance had stopped being the bottleneck.
