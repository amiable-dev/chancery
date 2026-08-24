---
tags: [flashcards, security, supply-chain, extensibility]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Defense-in-depth for unsandboxed extension marketplaces — Flashcards

#flashcards/security

## Definition <!-- kb:card:fe9eb9 -->
What is defense-in-depth for unsandboxed extension marketplaces?
?
The compensating security architecture a distribution channel adopts when extensions run with the host application's full unrestricted permissions rather than inside a runtime sandbox — layering publish-time scanning, identity signals, and reactive monitoring since no single control substitutes for confinement.

## VS Code's permission model <!-- kb:card:56bf4d -->
What permissions does a VS Code extension run with, relative to the editor itself?
?
Exactly the same permissions as the editor — it can read/write any file the user can, make arbitrary network requests, and launch external processes; there is no separate sandbox boundary.

## Publish-time gates <!-- kb:card:7ff4db -->
What three checks does an extension pass through before it can be published?
?
Automated malware scanning, dynamic behavioral analysis in an isolated clean-room VM, and secret scanning that blocks publishing outright if the package contains embedded credentials.

## Identity signals <!-- kb:card:fb3b79 -->
What two identity signals help a user weigh trust in a published extension?
?
Package signature verification, confirming the extension hasn't been tampered with since publishing, and an opt-in domain-verification badge proving the publisher controls their claimed domain, gated on six months of good standing.

## Post-publish monitoring <!-- kb:card:338d76 -->
What happens when a published extension is later confirmed malicious?
?
It's added to a block list that triggers automatic uninstallation from every machine that has it installed, not just removal from the storefront.

## Trust prompt granularity <!-- kb:card:52a91e -->
Is the install-time trust prompt granted per extension or per publisher?
?
Per publisher — approving one extension from a publisher extends trust to that publisher's other extensions and dependencies until explicitly revoked.
