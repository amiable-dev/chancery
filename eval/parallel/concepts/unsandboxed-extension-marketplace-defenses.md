---
title: Defense-in-depth for unsandboxed extension marketplaces
aliases:
  - Extension runtime security
  - Marketplace defense-in-depth
date: 2026-08-24
domain: security
maturity: established
source_type: vendor-doc
topics: [supply-chain]
tags: [concept, security, supply-chain, extensibility, domain/security, maturity/established, source-type/vendor-doc, topic/supply-chain]
status: draft
sources:
  - url: https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security
    hash: sha256:e79271c9f795bbddacc027ef672dfede0e75029d1e0ab049280e0986d5028108
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Defense-in-depth for unsandboxed extension marketplaces

## Definition

Defense-in-depth for unsandboxed extension marketplaces is the compensating security architecture a distribution channel adopts when the extensions it hosts run with the full, unrestricted permissions of the host application rather than inside any runtime sandbox: because no single control can substitute for confinement that does not exist, the channel instead layers publish-time automated scanning (malware detection, sandboxed dynamic behavioral analysis, and secret scanning), identity signals a user can weigh before installing (package signature verification and domain-proven publisher verification), and ongoing reactive monitoring (usage-anomaly detection, name-squatting prevention, and a block list that triggers automatic uninstallation), gated behind an explicit trust prompt the user must accept before a new publisher's code first runs.

## Explanation

Visual Studio Code's extension host runs with exactly the same permissions as the editor itself, so an installed extension can read and write any file the user can, make arbitrary network requests, and launch external processes — there is no separate sandbox boundary an extension is confined to. Given that starting point, the Marketplace cannot rely on any single gate; it stacks several independent layers instead. Before an extension is even published, it passes automated malware scanning and a dynamic check that runs the package in an isolated clean-room VM to observe its actual runtime behavior, plus a secret scanner that blocks publishing outright if the package contains an embedded API key or credential. Once published, package signatures let the editor verify an extension has not been tampered with since it left that publisher, and a separate, opt-in domain-verification badge lets a publisher prove they control the domain their identity claims, which the Marketplace also gates on six months of good standing. After publication the channel keeps watching: usage patterns are monitored for anomalies, attempts to squat on the name of an official publisher or a popular extension are blocked outright, and a confirmed-malicious extension is added to a block list that triggers automatic uninstallation from every machine that has it, not just removal from the storefront. None of this replaces user judgment at install time, which is why the strongest remaining gate is a trust prompt: the first time a user installs an extension from a given publisher, the editor requires an explicit confirmation, and that trust then extends to every other extension and dependency from the same publisher until revoked — trust is granted per publisher, not re-asked per extension. This is a structurally different bet than curating a small, closed submission list: instead of preventing untrusted code from being published at all, it accepts open submission and invests in catching what publish-time and post-publish signals can catch, while leaning on an explicit, revocable, per-publisher user consent gate for what automated signals cannot.

## Key Properties

- The extension host grants extensions the same unrestricted permissions as the host application — there is no runtime sandbox confining what an installed extension can do
- Publish-time gates combine automated malware scanning, dynamic behavioral analysis in an isolated VM, and secret scanning that blocks publishing outright if credentials are found in the package
- Post-publish, the channel keeps monitoring — usage-anomaly detection, name-squatting prevention, and a block list that triggers automatic uninstallation everywhere the extension is installed, not just delisting
- User trust is granted per publisher, not per extension: approving one extension from a publisher extends to that publisher's other extensions and their dependencies until explicitly revoked

## Relationships

- [[extension-registry-trust]] — is the concrete operational counter-example to that concept's argument — where extension-registry-trust holds that closed curation is the only defensible posture given no sandbox, this catalogs what a real, major marketplace does instead by accepting open submission and compensating with layered scanning, verification, and monitoring
- [[layered-agent-guardrails]] — shares the same design instinct — no single control substitutes for another, so distinct failure classes (a malicious package, a spoofed identity, a name-squat) each get their own dedicated layer rather than one gate being asked to catch everything
- [[macos-gatekeeper]] — is an operating-system-level instance of the same layered pattern this marketplace assembles for extensions — a Developer ID signature plus an automated notarization scan plus a first-launch confirmation, applied to any downloaded app instead of one editor's plugin ecosystem.

## Applications

Reach for this layered model whenever a distribution channel cannot sandbox what it distributes — a plugin marketplace, a package registry, a browser extension store: combine publish-time automated scanning with an identity-verification signal the user can weigh, keep monitoring after publication rather than treating listing as a one-time gate, and require an explicit, per-source trust decision from the user before new code from an unfamiliar source ever runs.

## Sources

- https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security

## See Also

- _None yet._
