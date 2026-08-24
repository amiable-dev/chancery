---
tags: [flashcards, agents, knowledge, operations, domain/knowledge-management, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Rare context — Flashcards

#flashcards/agents

## Definition <!-- kb:card:681008 -->
What is rare context?
?
Organisation-specific knowledge an AI system needs but couldn't have learned in pretraining — local vocabulary, thresholds, conventions and worked examples that give internal terms (like 'zombie node') their actual operational meaning.

## Signature failure <!-- kb:card:d1a8d0 -->
What does failure look like when a model lacks rare context, rather than lacking capability?
?
A confident near-miss, not a refusal — the model reasons plausibly from whatever it can reach and produces an answer shaped exactly like what was wanted, which is the hardest kind of wrong to catch.

## No zero-shot vendor agent <!-- kb:card:b26f77 -->
Why can't a vendor's agent be zero-shot competent at operational work, according to rare context?
?
Because the missing ingredient — organisation-specific vocabulary and thresholds — is by construction absent from any pretrained model, so competence must be built bottom-up from one team's language, not delivered top-down as a general capability.

## Where rare context lives <!-- kb:card:77b43c -->
Where does rare context actually live?
?
In few places, none of them the public internet: incident write-ups, the queries experienced operators actually run, local names for failure modes, and the thresholds a particular team treats as abnormal.

## Quality inheritance <!-- kb:card:541530 -->
Why does grounding an agent in a company's internal wiki risk making things worse, per rare context?
?
Rare context inherits the reliability of wherever it was written down, and internal wikis and databases are often full of confident errors themselves — so grounding should use curated, vetted data products, not raw internal corpora.
