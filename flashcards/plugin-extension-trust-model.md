---
tags: [flashcards, security, plugins, trust, sandboxing]
sr-due: 2026-05-29
sr-interval: 1
sr-ease: 250
---

# Plugin Extension Trust Model — Flashcards

#flashcards/security

## Definition <!-- kb:card:94b64d -->
What is a Plugin Extension Trust Model?
?
A set of rules, mechanisms, and assumptions governing the execution of third-party code within a host system — covering: what permissions extensions have, whether execution is sandboxed, how provenance is established, and whether a curated registry or open marketplace is used for distribution.

## Signing vs Safety <!-- kb:card:f07d4d -->
Why is code signing insufficient for extension safety in an unsandboxed system?
?
Signing establishes *identity* (who wrote the code), not *safety* (what the code does). In a no-sandbox environment, a signed malicious extension still runs arbitrary commands — you just know who authored it. Safety requires either sandboxing (limits what code can do) or curation (limits what code exists in the distribution channel).

## Registry Trilemma <!-- kb:card:e2124d -->
What is the registry trilemma for plugin ecosystems?
?
Open plugin registries face three conflicting goals:
1. **Openness** — anyone can publish
2. **Safety** — arbitrary code runs in the host
3. **Quality** — curation doesn't scale to thousands of packages

Most ecosystems resolve this by accepting one failure: either sacrifice safety (open npm), safety via sandboxing (WebAssembly plugins), or openness (small vetted list).

## Curation Principle <!-- kb:card:3e50da -->
What does "a small vetted set beats a big unvetted marketplace" mean in practice?
?
A curated list of 10–50 reviewed extensions provides meaningful safety guarantees because each has been audited. A marketplace of thousands with nominal review provides a false sense of safety — the surface area is too large for real curation, and users assume someone else checked. Vigolium's author argues curation is the only meaningful safety lever when sandboxing is absent.

## Application <!-- kb:card:51a3e3 -->
Where does the plugin extension trust model apply beyond security scanners?
?
Anywhere third-party code runs inside a trusted host: AI agent frameworks (OpenClaw skills, MCP servers, LangChain tools), IDE plugins (VS Code extensions), browser extensions, package managers (npm, pip), and Obsidian community plugins. The same trust model questions apply in all cases.
