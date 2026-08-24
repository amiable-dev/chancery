---
tags: [flashcards, code-signing, app-notarization, desktop-app-distribution, licensing]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# macOS Gatekeeper — Flashcards

#flashcards/code-signing

## Definition <!-- kb:card:53f9df -->
What does macOS Gatekeeper check before letting downloaded software run?
?
That the code carries a signature from an identified Apple Developer ID, has been notarized by Apple's automated malware scan, and has not been altered since signing.

## Trigger mechanism <!-- kb:card:2fb9f8 -->
What triggers Gatekeeper's check on a downloaded file?
?
The quarantine attribute macOS attaches to any file that arrived over the network.

## Default policy <!-- kb:card:4e523d -->
What happens by default when software fails Gatekeeper's signature or notarization check?
?
It is blocked or flagged with a generic, alarming warning on first launch that most users will not click through.

## Notarization vs App Store review <!-- kb:card:b4cd5a -->
Is Apple notarization the same as full App Store review?
?
No — notarization is Apple's automated scan for known malicious content, not full App Store review.

## Randomized launch locations <!-- kb:card:046142 -->
Why does Gatekeeper open apps from randomized read-only locations?
?
So a malicious plug-in bundled with a legitimate app cannot load unnoticed.
