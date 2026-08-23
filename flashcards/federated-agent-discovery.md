---
tags: [flashcards, ai-agents, protocols, discovery, distributed-systems]
sr-due: 2026-06-18
sr-interval: 1
sr-ease: 250
---

# Federated Agent Discovery — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:4b6a67 -->
What is federated agent discovery?
?
A discovery architecture in which no single authority owns the index of AI capabilities. Multiple independent registries crawl and index the same published catalogs, serve different communities with different trust policies, and collectively form a global discovery network — analogous to how multiple competing web search engines all independently index the same public web.

## Key Contrast <!-- kb:card:939b2c -->
What is the alternative to federated discovery, and why does ARD reject it?
?
Centralised registry (e.g., one canonical database like the App Store). ARD rejects this because it creates a single point of control, censorship risk, vendor lock-in, and governance bottleneck. Federated design allows any organisation to publish without permission and any registry to index without exclusivity.

## Three Real-World Analogies <!-- kb:card:f17694 -->
Name three existing federated systems that ARD's model mirrors.
?
1. **DNS** — No single entity owns all records; any registrar can issue domains, any resolver can query
2. **Web search** — Google, Bing, DuckDuckGo all index the same public web with different policies
3. **Email (SMTP)** — Any domain can send and receive email; no central email authority required

## Direct Fetch Escape Hatch <!-- kb:card:6e6727 -->
How can an agent discover a capability without using any registry?
?
By fetching `/.well-known/ai-catalog.json` directly from a known partner's domain. This bypasses all registries entirely — useful when you already know who to trust and don't need to search. Registries are optional, not mandatory.

## Application — Regulatory Segmentation <!-- kb:card:f907d3 -->
How can federated discovery serve regulated industries?
?
A healthcare consortium runs its own registry that only indexes HIPAA-verified capabilities. General-purpose public registries are never consulted by healthcare agents. The protocol is the same (ARD), but the registry layer enforces the compliance boundary — without needing to change the underlying catalog format.

## Relationship to No-Central-Authority Trust <!-- kb:card:8de008 -->
Why can a federated discovery model work without a central authority?
?
Because trust is anchored in domain ownership (DNS + TLS), not in registration with a central body. A registry doesn't need to "vouch for" a publisher — it indexes the catalog and passes along the trust manifest; the client performs its own cryptographic verification. The registries are search helpers, not trust authorities.

## Real-World Evidence (July 2026) <!-- kb:card:a2168b -->
What two live, independently-operated registries prove the federated model works in practice, and what did Microsoft's Jennifer Marsman say federation does NOT cover?
?
GitHub's **Agent Finder** (in Copilot) and Hugging Face's **Discover Tool** are both live, independent ARD registries — proof multiple parties can index the same catalog format without a single owner. Marsman clarified the boundary: ARD federates *discovery* only — it "doesn't replace authentication, authorization, governance, or organizational trust decisions," which remain org-local.
