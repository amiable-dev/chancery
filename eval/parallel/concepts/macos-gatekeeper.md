---
title: macOS Gatekeeper
aliases:
  - Gatekeeper
date: 2026-08-24
domain: software-distribution
maturity: established
source_type: vendor-doc
topics: [licensing]
tags: [concept, code-signing, app-notarization, desktop-app-distribution, licensing, domain/software-distribution, maturity/established, source-type/vendor-doc, topic/licensing]
status: draft
sources:
  - url: https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web
    hash: sha256:5bf83ab4fc3796714a77c97d79511b4fc170b5846f0b21f07f9d44cd17f3fff6
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# macOS Gatekeeper

## Definition

macOS Gatekeeper is the operating system's trust check on downloaded software: before letting a user run an app, plug-in, or installer that did not come from the App Store, it verifies the code carries a signature from an identified Apple Developer ID, has been notarized by Apple's automated malware scan, and has not been altered since signing, and it asks the user to confirm the first time that software runs. Unsigned or unnotarized software is blocked or flagged with a warning by default, which makes code signing and notarization a practical precondition for distributing a macOS app outside the App Store rather than an optional hardening step.

## Explanation

Gatekeeper's check fires the first time a downloaded file executes, keyed off the quarantine attribute macOS attaches to anything that arrived over the network; passing requires both a valid Developer ID signature and a notarization ticket, which is Apple's own automated scan for known malicious content rather than full App Store review. Because the default policy blocks or interrupts anything that fails either check, an unsigned or unnotarized build gives users a generic, alarming warning on first launch that most people will not click through — this is the actual mechanism behind the common experience that code signing and notarization are what let a downloaded macOS app open cleanly at all. Organizations can loosen or tighten the policy — restrict to App Store software only, allow additional identities, or disable Gatekeeper outright — typically through device management, and Gatekeeper separately opens apps from randomized read-only locations so a malicious plug-in bundled with a legitimate app cannot load unnoticed. Being a standing OS security control rather than a product feature, the check itself is durable even as the specific cost of a Developer ID enrollment or the notarization submission workflow changes.

## Key Properties

- Requires both a Developer ID signature and an Apple notarization ticket before first run
- Triggered by the quarantine attribute macOS attaches to files that arrived over the network
- Default policy blocks or warns on unsigned or unnotarized software regardless of how it was downloaded
- Organizations can restrict to App Store only, trust more identities, or disable it via device management
- Opens apps from randomized read-only locations to stop a bundled malicious plug-in loading unnoticed

## Relationships

- _No relationships recorded yet._
- [[unsandboxed-extension-marketplace-defenses]] — runs the same signature-plus-automated-scan-plus-first-use-consent pattern this marketplace layers for its own unsandboxed extensions — a Developer ID signature and Apple's notarization scan stand in for package signing and publish-time behavioral analysis, and the first-launch warning stands in for the per-publisher trust prompt.
- [[slsa-build-provenance-levels]] — checks who signed a finished app and that it passed an automated malware scan, which is exactly the consumer-facing trust question that stops at identity — it says nothing about how trustworthy the build process behind that signature actually was, the gap these levels grade.

## Applications

Treat code signing and notarization as required infrastructure for any macOS app distributed outside the App Store, not a late-stage compliance task, since an unsigned or unnotarized build fails Gatekeeper's first-run check and most users will not know how to override the resulting warning.

## Sources

- https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web

## See Also

- _None yet._
