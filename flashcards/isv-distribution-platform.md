---
tags: [flashcards, licensing, distribution, saas, monetisation, desktop-apps]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# ISV Distribution Platform — Flashcards

#flashcards/licensing

## Definition <!-- kb:card:2b4b9b -->
What is an ISV distribution platform?
?
A hosted SaaS platform that handles the complete commercial software pipeline for independent software vendors: payment/commerce, license key issuance, access policy management, binary distribution, and auto-update delivery — eliminating the need to maintain a custom update server, license database, or CDN.

## GitHub-release-as-source <!-- kb:card:a61545 -->
What is the GitHub-release-as-source pattern used by ISV distribution platforms?
?
The developer builds and publishes a standard signed GitHub release (unchanged CI/CD workflow). The platform auto-imports those release artifacts by webhook or polling, then re-serves them through its own CDN with license gating applied. The build pipeline and distribution platform remain decoupled.

## Spectrum comparison <!-- kb:card:94c882 -->
What is the key difference between a full-stack ISV distribution platform (like Anystack) and a licensing API (like Keygen.sh)?
?
A full-stack platform owns the entire pipeline: commerce, licensing, CDN distribution, and auto-update endpoint — minimal self-hosting needed. A licensing API provides the license management layer only — you bring your own commerce frontend, CDN, and delivery. Full-stack = faster to ship; licensing API = more flexibility and control.

## Application <!-- kb:card:8b2afc -->
When would an indie developer choose an ISV distribution platform over building their own update server?
?
When they want to ship quickly and don't need custom backend logic: the platform handles expiry enforcement, activation limits, revocation, and CDN distribution out of the box. If subscription expiry should automatically stop update access with no server-side code change, an ISV platform is the right choice.

## Private repo access <!-- kb:card:692525 -->
What is the private repository access grant feature offered by some ISV distribution platforms, and what business model does it enable?
?
The platform automatically grants customers read access to the developer's private GitHub repo when their license is active, and revokes it on expiry or cancellation. This enables open-core monetisation: the free product is public; the paid version lives in a private repo. Access lifecycle is managed by the platform, not custom code.
