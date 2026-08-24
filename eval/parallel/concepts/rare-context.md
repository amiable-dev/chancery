---
title: Rare context
aliases:
  - Organisation-specific operational vocabulary
date: 2026-08-24
domain: knowledge-management
maturity: emerging
source_type: practitioner
tags: [concept, agents, knowledge, operations, domain/knowledge-management, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://www.infoq.com/presentations/reliable-ai-platforms/
    class: external-primary
---

# Rare context

## Definition

**Rare context** is the organisation-specific knowledge an AI system needs but could not have learned in pretraining — the local vocabulary, thresholds, conventions and worked examples that give an internal term such as a zombie node its actual operational meaning — and its absence is why a general agent dropped into a company behaves like a capable new hire nobody told what the words mean.

## Explanation

The failure this names is under-specification rather than incapability, and its signature is worse than a refusal. Asked where the zombie nodes are, a model reasons plausibly from whatever metrics it can reach and produces something almost right, shaped exactly like the answer an operator wanted, which is the hardest kind of wrong to catch. The knowledge that closes the gap is rare in a precise sense: it lives in few places and none of them are the public internet — incident write-ups, the queries experienced operators actually run, the local names for failure modes, the thresholds a particular team treats as abnormal. Two consequences follow. The first is a claim about vendors: an agent that works in any company zero-shot cannot exist for operational work, because the missing ingredient is by construction not in the model, so the work is bottom-up from one team's language rather than top-down from a general capability. The second is a warning about where the context comes from. Rare context inherits the quality of wherever it was written down, and the talk is blunt that internal wikis and databases are themselves full of confident errors, so grounding an agent in company knowledge means grounding it in curated and vetted data products rather than in whatever the intranet happens to contain. This is a practitioner's account from a named production project, and the mechanism is easy to reproduce: give the same question to a general agent with and without the local examples.

## Key Properties

- The gap is vocabulary and thresholds, not capability, and its signature failure is a confident near-miss
- By construction absent from pretraining, so no vendor agent is zero-shot competent at operational work
- Supplied bottom-up as canonical queries, incident history and examples in one team's actual language
- Inherits the reliability of its source, and internal wikis and databases carry their own confident errors
- Argues for vetted data products rather than raw internal corpora as the grounding surface

## Relationships

- [[context-engineering]] — names the specific ingredient that curation must not economise away, since the smallest high-signal token set is useless if the tokens defining the local vocabulary are the ones cut
- [[unknowns-inventory-prompting]] — occupies that inventory's hardest quadrant — rare context is mostly unknown knowns, the criteria an expert recognises instantly and would never think to write down
- [[agent-led-elicitation]] — is one practical way to extract it, because interrogating the operator surfaces the local meanings faster than asking them to document knowledge they do not experience as knowledge
- [[current-state-grounding]] — rare context names the category of knowledge that fills current-state grounding's second bucket — what only a live source can supply — since organisation-specific vocabulary is precisely what no amount of pretraining could have covered.

## Applications

Estimating what a bought-in agent will actually do on day one in an operations org; deciding what to write down first when grounding an internal assistant; explaining why a demo that impressed on public data disappoints on the company's own.

## Sources

- https://www.infoq.com/presentations/reliable-ai-platforms/

## See Also

- [[context-engineering]]
- [[unknowns-inventory-prompting]]
- [[agent-led-elicitation]]
