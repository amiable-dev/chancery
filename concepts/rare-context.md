---
title: "Rare Context"
date: 2026-07-13
domain: llm
maturity: emerging
source_type: practitioner
topics: [context-engineering, enterprise]
tags: [concept, ai-agents, enterprise, context-engineering, moat, domain/llm, maturity/emerging, source-type/practitioner, topic/context-engineering, topic/enterprise]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    hash: sha256:fa755eebcd198b9755000bc27e7269c2f02dba5c2d230183ad305e6338d1dc28
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Rare Context

## Definition
The company-specific, tacit vocabulary, examples, and operational knowledge that a domain expert holds but that generic large language models — and any "zero-shot, works in any company out of the box" agentic product — cannot access without explicit training or in-context supply. Rare context is what turns an unbriefed generalist model into a genuinely useful specialist, and its absence is why zero-shot agent claims routinely overpromise.

## Explanation
Coined by Aaron Erickson (NVIDIA) while describing the LLo11yPop GPU-fleet observability project, "rare context" names a specific, concrete failure mode: an operations team asks an agent "where are the zombie nodes?" The LLM has no idea what "zombie" means in this company's vocabulary. It makes a plausible-sounding guess — perhaps inferring it from generic monitoring metrics like network connectivity — that gets *close* but is not what an experienced operator means by the term.

**The "angry intern" framing:**
Erickson describes an ungrounded LLM given broad access as behaving like "an angry intern" — capable, eager to answer, but missing the specific institutional knowledge that makes an answer actually correct rather than merely plausible. The fix pairs two moves:
1. **Constrain the intern's access and task** — read-only access, flat/wide schemas, simple SELECT/GROUP BY operations, pagination hints, no destructive operations ("no Bobby Tables"). Simpler task surfaces measurably raise evaluation accuracy.
2. **Supply the rare context the intern is missing** — the company-specific terms, examples, and disambiguations that let the model map "zombie node" to the correct underlying signal.

**Why zero-shot agent vendors overpromise:**
A vendor claiming their agent "works in any company, out of the box, zero-shot" is, by this framing, necessarily missing the rare-context layer. Without your company's specific language and examples baked into the prompt, fine-tuning, or retrieval layer, the agent guesses like an unbriefed intern — it can only reason from generic training data, not from the vocabulary your operators actually use.

**Rare context is a moat, not a commodity:**
Because rare context is by definition specific to one organisation (or even one team within it), it cannot be purchased off-the-shelf the way generic model capability can. This makes rare-context capture — durable memory files, glossaries, incident histories, runbooks — one of the few genuinely defensible assets an organisation builds around agentic AI, since a competitor's agent (even a more capable one) starts from zero on it.

## Key Properties
- **Company-specific** — not transferable between organisations without re-supplying the equivalent local vocabulary and examples
- **Tacit by default** — usually held informally by experienced operators, not written down until someone is forced to encode it for an agent
- **A precondition for accuracy, not politeness** — without it, the model doesn't perform slightly worse, it answers a *different question* than the one asked
- **Cheap to supply once captured, expensive to discover** — the cost is in the initial elicitation (interviewing operators, mining incident history), not in storing or retrieving it afterward
- **Exposes the "zero-shot works anywhere" claim as false** for any domain with genuine specialist vocabulary

## Relationships
- Sharpens [[context-advantage]]: context advantage frames the human's information edge over AI generically; rare context is the specific, company-vocabulary instance of that edge in an operational/enterprise setting
- Captured by [[agent-knowledge-schema]]: a schema's entity taxonomy and relationship vocabulary is one durable mechanism for encoding rare context so it survives beyond any one conversation
- Enables [[tools-for-certainty-agents-for-discovery]]: deterministic tools (e.g. a "find zombie nodes" query) only work correctly once they're built around the organisation's rare-context definition of the term, not a generic one
- Related to [[minimal-viable-tool-set]] and [[constrained-agent-actions]]: narrowing an agent's task surface ("angry intern" constraints) is the complementary half of the fix — constrain access *and* supply missing context
- Related to [[human-in-the-loop-pattern]]: surfacing agent recommendations to a human owner (rather than auto-acting) is partly a hedge against rare-context gaps the agent doesn't know it has
- Contrasts with generic [[retrieval-augmented-generation]]: RAG retrieves documents; rare context is often *undocumented* — it must be elicited from experts and explicitly authored, not just indexed

## Applications
- **Evaluating "universal" AI agent vendors:** Ask what happens with your team's specific jargon, incident history, and edge cases — if the answer is "the model will figure it out," expect angry-intern-quality results on day one
- **Onboarding an agent to a new domain:** Before extending agent scope, run a rare-context audit — interview operators for terms, examples, and disambiguations the model would otherwise guess at
- **Durable memory / workspace files:** Treat glossaries, MEMORY.md-style notes, and runbook documents as rare-context capture — the same reasoning applies to why AGENTS.md/SKILL.md patterns matter for any long-lived agent deployment
- **Prioritising which agents to build first:** Domains with the most rare context (highly specific operational jargon, tribal knowledge) benefit most from purpose-built narrow agents; generic domains are better served by off-the-shelf zero-shot models

## Study
- Flashcards: [[flashcards/rare-context|Practice this concept]]

## Sources
- [Designing AI Platforms for Reliability: Tools for Certainty, Agents for Discovery](https://www.infoq.com/presentations/reliable-ai-platforms/) — Aaron Erickson (NVIDIA), InfoQ presentation; "rare context," "angry intern," and "zombie nodes" examples from the LLo11yPop GPU-fleet project

## See Also
- [[context-advantage]]
- [[agent-knowledge-schema]]
- [[tools-for-certainty-agents-for-discovery]]
- [[minimal-viable-tool-set]]
- [[constrained-agent-actions]]
- [[human-in-the-loop-pattern]]
- [[retrieval-augmented-generation]]
- [[observability]]
