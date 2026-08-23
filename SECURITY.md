# Security Policy

## Supported versions

Pre-1.0: only the latest 0.x release line receives security fixes. There are no backports.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

1. **GitHub private vulnerability reporting** (preferred): [Security tab → "Report a vulnerability"](https://github.com/amiable-dev/chancery/security/advisories/new) — a private channel visible only to the maintainer.
2. **Email**: security@amiable.dev.

Include: affected component (`kb` verb, library module, workflow), reproduction steps, and impact. Acknowledgement within 7 days; fix or advisory within 90 days or coordinated otherwise.

## Scope notes for this repository

- The `kb` engine's **gate path** (`kb verify` and its imports) is designed to hold no credentials and make no network calls; a violation of that property is a vulnerability even without a demonstrated exploit.
- Staged content (`staging/`) is *expected* to be untrusted; the interesting bugs are where untrusted content influences anything beyond its own quarantine — parser abuse (ReDoS, YAML), path traversal via slugs or wikilinks, or prompt-injection paths that reach a write surface. Reports in that class are very welcome.
