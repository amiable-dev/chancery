---
tags: [flashcards, licensing, distribution, security, desktop-apps]
sr-due: 2026-05-03
sr-interval: 1
sr-ease: 250
---

# License-Gated Software Distribution — Flashcards

#flashcards/licensing

## Definition <!-- kb:card:b14d45 -->
What is license-gated software distribution?
?
An architectural pattern where access to software binaries and auto-update payloads is gated by the consumer's current license status — valid, expired, revoked, or version-constrained — so updates are only delivered to authorised license holders.

## Enforcement point <!-- kb:card:287be4 -->
Where does license enforcement happen in license-gated distribution, and why does it matter?
?
Enforcement happens in the delivery layer (CDN/update endpoint), not only in app code. This is stronger than client-side checks because the binary is never handed over at all when the license fails — bypassing an app-level check doesn't help if the download is refused upstream.

## Application <!-- kb:card:115c2c -->
When would you use license-gated distribution instead of (or alongside) device-bound licensing?
?
Use license-gated distribution when you want access control at the delivery pipeline level — especially for subscription models where you need expiry enforcement and don't want to maintain your own update server. Combine with device-bound licensing when you also need to prevent license key sharing between devices.

## Tauri integration <!-- kb:card:931d5d -->
How does Tauri's updater integrate with a license-gated distribution platform?
?
Point `tauri.conf.json`'s `updater.endpoints` at the platform's endpoint (e.g. `https://dist.anystack.sh/v1/tauri/PRODUCT-ID/{{current_version}}`). The platform returns a JSON update manifest (or non-2xx) based on license validity. The `pubkey` in the config ensures only platform-signed builds are installed — the client code is otherwise unchanged.

## Relationship <!-- kb:card:abefe5 -->
How does license-gated distribution differ from device-bound licensing?
?
Device-bound licensing uses cryptographic keypairs to prevent license transfer between machines — the license is tied to hardware. License-gated distribution controls access to the binary at the CDN/endpoint level, regardless of cryptographic binding. The two patterns are complementary: a platform can gate downloads by license status while the app additionally binds the license to the device.
