---
tags: [flashcards, security, vulnerability-management, supply-chain]
sr-due: 2026-06-07
sr-interval: 1
sr-ease: 250
---

# OSV Advisory Database — Flashcards

#flashcards/security

## Definition <!-- kb:card:3d2206 -->
What is the OSV (Open Source Vulnerabilities) database?
?
A distributed, community-maintained vulnerability advisory database backed by Google and OpenSSF. It provides a standardised JSON schema that maps vulnerability IDs precisely to open-source package versions and commit hashes, aggregating advisories from GitHub GHSA, NVD, PyPI, npm, crates.io, and others into a single queryable feed.

## Schema <!-- kb:card:401b39 -->
What does the OSV schema's `affected[].ranges` field express, and why does it matter?
?
Version ranges in ecosystem-native semantics (npm semver, Python PEP 440, Go module versions, git SHAs). This matters because it enables precise matching without CPE guessing — a scanner can directly compare a lockfile version against the advisory range rather than parsing ambiguous CPE strings.

## Relationship <!-- kb:card:505ca5 -->
How does OSV differ from the NVD (National Vulnerability Database)?
?
NVD uses CPE (Common Platform Enumeration) strings to identify affected software, which map poorly to package manager versions. OSV uses ecosystem-native version ranges, making it far more reliable for automated dependency scanning. OSV also aggregates from multiple upstream databases; NVD is a single canonical source.

## Application <!-- kb:card:72a6dc -->
Why do tools like CVE Lite CLI sync the OSV advisory corpus locally instead of querying the API per-package?
?
Speed and offline availability. ~217K advisory records download in under 9 seconds and are stored in a local SQLite DB. Repeated scans then query the local DB (milliseconds per lookup) rather than making HTTP requests per package. This also enables air-gapped/enterprise environments where outbound network calls during CI are prohibited.

## Format <!-- kb:card:1f214c -->
What is the OSV `id` field format, and what does aliasing solve?
?
Format: `<DB>-<ENTRYID>` (e.g. `GHSA-xxxx-xxxx-xxxx`). Each entry lists `aliases` (other IDs for the same vulnerability: CVE-2024-xxxx, RUSTSEC-xxxx). Aliasing solves the fragmentation problem where the same vulnerability has different IDs in different databases — a tool can map between them bidirectionally.
