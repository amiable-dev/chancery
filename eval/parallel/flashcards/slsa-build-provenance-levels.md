---
tags: [flashcards, security, supply-chain, ci-cd, standards]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# SLSA build provenance levels — Flashcards

#flashcards/security

## The four levels <!-- kb:card:03f318 -->
What do SLSA's four build provenance levels (L0-L3) grade, and how do they relate to each other?
?
How trustworthy and tamper-resistant an artifact's build provenance is; the levels are cumulative, each requiring everything the level below it plus one additional guarantee.

## L1 requirement and weakness <!-- kb:card:531333 -->
What does L1 require, and why is it weak?
?
Only that provenance describing the build exists. It's trivially forgeable or omittable, so it only catches honest mistakes, not attacks.

## L2 requirement <!-- kb:card:d5ced3 -->
What does L2 add over L1, and what does that buy?
?
Provenance must be signed by a dedicated hosted build platform, so forging it requires an explicit attack rather than just skipping a step or a configuration mistake.

## L3 requirement <!-- kb:card:34fd9b -->
What does L3 add over L2, and what gap does it close?
?
The build platform must isolate concurrent runs from each other and keep the signing key inaccessible even to the build's own steps, closing the gap where a malicious build step could forge its own provenance.

## Why the scale is useful <!-- kb:card:702fdc -->
What makes SLSA's level scale usable as a yardstick rather than a marketing claim?
?
Each level states both what it protects against and what it still leaves open, so a consumer can know precisely what a given level does and does not rule out.

## What provenance means <!-- kb:card:146986 -->
What does 'provenance' mean in SLSA's sense?
?
A verifiable record of what entity built an artifact, by what process, and from what inputs.
