---
tags: [flashcards, ai-agents, devops, security, supply-chain, attestation]
sr-due: 2026-04-23
sr-interval: 1
sr-ease: 250
---

# Agent Attestation Standards — Flashcards

#flashcards/devops

## Definition <!-- kb:card:aa3649 -->
What are agent attestation standards?
?
An emerging class of cryptographic provenance standards for agent-authored code — analogous to SLSA/Sigstore for software supply chains — that cryptographically bind each commit to the agent that produced it, the model version used, the specification provided, and the human who authorized the task.

## Four Bindings <!-- kb:card:ff1d57 -->
What four elements does agent attestation cryptographically bind to each commit?
?
1. The human who authorized the task (delegation authority)
2. The agent that executed it (agent identity + version)
3. The model version used (for reproducibility and regression investigation)
4. The specification or instruction set provided as input

## SLSA Analogy <!-- kb:card:dd2fc6 -->
How do agent attestation standards relate to SLSA?
?
SLSA establishes cryptographic guarantees about *how* software was built (from declared source, isolated build). Agent attestation extends this one step upstream: cryptographic guarantees about *how* agent-authored code was authorized and constrained, answering "was this an intentional, human-sanctioned change?"

## Current State <!-- kb:card:00b16c -->
What is the current state of agent attestation standards in 2026?
?
No industry standard exists yet — it's a near-term projected trend, not a deployed practice. Some organisations use ad hoc metadata in PR descriptions and commit messages. Formal cryptographic attestation is the next maturity step. SLSA and Sigstore communities are the likely venues for emerging standards.

## Near-Term Practice <!-- kb:card:049084 -->
What can teams do today before formal attestation standards exist?
?
Enforce PR conventions requiring agent-authored PRs to carry labels, commit message fields, or descriptions identifying agent identity, model version, and authorizing specification — creating an auditable (if non-cryptographic) attribution trail.

## Value in Incidents <!-- kb:card:bdd3ef -->
How does agent attestation help during incident investigation?
?
It lets you reconstruct what specification guided a change and whether the agent acted within sanctioned scope — answering "did an agent introduce this regression, and was it authorized to make this kind of change?"
