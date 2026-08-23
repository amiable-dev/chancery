---
title: "ISV Distribution Platform"
date: 2026-05-03
domain: software-distribution
maturity: established
source_type: practitioner
tags: [concept, licensing, distribution, saas, desktop-apps, monetisation, indie-dev, domain/software-distribution, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://anystack.sh/tauri-applications
    hash: sha256:f958253fe67cb4537e7885b56ea5b2a856490985887b0d952b3fc71852902712
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://anystack.sh/docs/integrations/tauri
    hash: sha256:98b0d0e6435982593a6a8d21f2e31611880d5658b6f3c6ac1387b7859d5d0997
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://keygen.sh/for-tauri-apps/
    hash: sha256:0644a7d3afac3bb07b3de2aa0b6c1046c41b50bc3377032738d6969b1d4f98a9
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://licenseseat.com/licensing-for-tauri-apps
    hash: sha256:c60a0c3aa18721255765b23eb8583ab7048481d866eebb8b1a63b5d322276d8b
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# ISV Distribution Platform

## Definition
A hosted SaaS platform that handles the complete commercial software pipeline for independent software vendors (ISVs): payment and commerce, license key issuance, access policy management, binary distribution, and auto-update delivery — removing the need for developers to maintain their own update server, license database, or CDN.

## Explanation
Shipping a commercial desktop app requires more than just building the binary. Developers must handle selling (payment processor, checkout), licensing (key generation, activation tracking, expiry), delivery (CDN, download pages), and updates (update server, delta detection, signature verification). An ISV distribution platform collapses all of these into a single hosted service.

**Core capabilities common to platforms in this category:**

| Capability | Description |
|---|---|
| Commerce layer | Checkout, payment processing, invoicing (sometimes via Paddle/LemonSqueezy integration) |
| License key issuance | Generate and track unique keys per purchase; support multi-seat and subscription models |
| Activation management | Track which devices activated a key; enforce activation limits |
| Access policy engine | Expiry, version constraints, revocation, repository access grants |
| Binary distribution | CDN-backed asset hosting; unique per-product repository URLs |
| Auto-update endpoint | Protocol-compatible endpoint (Tauri updater, Electron autoUpdater, package managers) |
| Access logs | Audit which customers downloaded which assets and when |

**GitHub-release-as-source pattern:**
Most platforms in this category use GitHub releases as the canonical build artifact source rather than requiring direct uploads to their storage:
1. Developer builds and publishes a signed GitHub release (standard CI/CD workflow, unchanged)
2. The platform auto-imports release assets by webhook or polling
3. Assets are re-served through the platform's CDN with license gating applied

This decouples the build pipeline from the distribution platform and means the developer's existing GitHub Actions workflow needs zero modification — distribution is a downstream concern.

**Spectrum: platforms vs. APIs:**
ISV distribution platforms exist on a spectrum:

- **Full-stack platforms** (Anystack): own the sell → license → distribute → update pipeline; minimal self-hosting; opinionated workflow
- **Licensing APIs** (Keygen.sh): provide the license management + distribution API; developer brings their own commerce, frontend, and CDN
- **Device-bound licensing libraries** (tauri-plugin-better-auth-license, CrabNebula): client-side SDK for cryptographic license binding; developer owns everything else

The right choice depends on how much control vs. convenience the developer needs. Full-stack platforms are faster to ship with; licensing APIs offer more flexibility.

**Private repository access grants:**
Some platforms (Anystack) extend license gating to GitHub repository access: customers with valid licenses are automatically granted read access to the developer's private GitHub repo and have that access revoked when the license expires. This enables open-core monetisation where the paid product is a private repo containing premium features.

## Key Properties
- **No update server to maintain:** Platform owns the update endpoint infrastructure; developer just points `tauri.conf.json` at the platform's URL
- **Commerce integrated:** Unlike pure CDNs or update servers, billing and license issuance are part of the same system
- **GitHub-native workflow:** Build artefacts sourced from GitHub releases; no extra upload step
- **Multi-ecosystem:** Platforms like Anystack support Tauri, Electron, and package ecosystems (Composer, npm, PyPI) from a single account
- **Access logs included:** Download audit trail without building custom analytics

## Relationships
- Implements [[license-gated-software-distribution]]: the platform is the hosted infrastructure that makes license-gated distribution work without self-hosting
- Related to [[device-bound-licensing]]: complementary pattern; device-bound binding can be layered on top of platform-gated distribution for defense-in-depth
- Related to [[zero-trust-architecture]]: the distribution platform acts as the enforcement point in a zero-trust model for software updates

## Applications
- **Solo/indie developers shipping paid Tauri or Electron apps:** removes the need to build and maintain a backend licensing and update service
- **Open-core monetisation:** Public free tier + private repo access for paid customers, lifecycle-managed by the platform
- **Subscription-based desktop software:** Annual licenses that automatically stop receiving updates on expiry — no cron job or server logic required
- **Multi-platform packages:** Distributing private Composer, npm, or PyPI packages to customers alongside desktop app licenses from one account

## Study
- Flashcards: [[flashcards/isv-distribution-platform|Practice this concept]]

## Sources
- [Anystack — Tauri Applications](https://anystack.sh/tauri-applications) — Primary source; full-stack ISV platform for Tauri and Electron apps
- [Anystack Tauri Integration Docs](https://anystack.sh/docs/integrations/tauri) — Technical integration guide showing GitHub-release-as-source and updater endpoint config
- [Keygen.sh for Tauri Apps](https://keygen.sh/for-tauri-apps/) — Licensing-API-focused alternative; useful contrast to Anystack's full-stack approach
- [LicenseSeat — Tauri Licensing Guide](https://licenseseat.com/licensing-for-tauri-apps) — Another platform in this category; shows breadth of the ecosystem

## See Also
- [[license-gated-software-distribution]]
- [[device-bound-licensing]]
- [[zero-trust-architecture]]
