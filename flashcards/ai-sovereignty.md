---
tags: [flashcards, ai-agents, governance, architecture, geopolitics]
sr-due: 2026-06-25
sr-interval: 1
sr-ease: 250
---

# AI Sovereignty — Flashcards

#flashcards/ai-agents

## Definition <!-- kb:card:b621fd -->
What is AI sovereignty?
?
An organisation's (or nation's) capacity to maintain uninterrupted access to capable AI systems regardless of the regulatory, geopolitical, or commercial decisions of any single AI provider — achieved through multi-vendor diversification, portable workloads, and architectures that dynamically reroute around provider restrictions.

## Triggering event <!-- kb:card:a7449b -->
What 2026 event demonstrated AI sovereignty risk was real, not hypothetical?
?
Anthropic imposed export controls on Fable 5 and Mythos Preview, cutting off access overnight for organisations in affected jurisdictions. Organisations with provider-agnostic architectures experienced this as a minor model substitution; those tightly coupled to Anthropic integrations faced workflow disruption.

## Threat vectors <!-- kb:card:b2e575 -->
Name four threat vectors to AI sovereignty beyond export controls.
?
1. Provider business failure (startup shutdown)
2. Terms-of-service changes mid-contract
3. API/model version deprecation
4. Commercial leverage (dominant provider raising prices knowing customers are locked in)

## Architecture <!-- kb:card:4dd997 -->
What four architectural elements are required for genuine AI sovereignty (beyond a policy statement)?
?
1. **Abstraction layer** — provider-agnostic interface (e.g., OpenAI-compatible API, LLM gateway)
2. **Swappable model pool** — pool membership configurable at runtime
3. **Dynamic rerouting** — automatic degradation/rerouting when a pool member is unavailable
4. **Learned orchestration** — don't hardcode "use provider X for task Y"; let an orchestration model coordinate dynamically

## Application <!-- kb:card:ff34c6 -->
What is the practical engineering step with the highest ROI for AI sovereignty?
?
Wrap all LLM calls behind an OpenAI-compatible gateway (Portkey, LiteLLM, Fugu, etc.) and define fallback model chains in configuration, not code. This decouples the application from specific providers and makes substitution a config change rather than a code change.

## Relationship <!-- kb:card:54ad40 -->
How does AI sovereignty differ from, but relate to, vendor lock-in generally?
?
Vendor lock-in is the general concept (switching costs due to proprietary APIs, data formats, etc.). AI sovereignty is the AI-specific form, with the additional dimension that access itself — not just switching cost — can be restricted overnight by regulatory action, which is unique to AI models vs. most other software services.
