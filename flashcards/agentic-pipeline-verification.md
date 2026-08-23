---
tags: [flashcards, ai-agents, devops, ci-cd, pipeline, verification]
sr-due: 2026-04-23
sr-interval: 1
sr-ease: 250
---

# Agentic Pipeline Verification — Flashcards

#flashcards/devops

## Definition <!-- kb:card:61fae1 -->
What is agentic pipeline verification?
?
An evolution of CI/CD pipelines from mechanical gatekeeper to active verifier, incorporating three verification layers (structural, semantic, provenance) and hallucination-specific quality gates to address failure modes introduced when AI agents, not humans, author the code.

## Three Layers <!-- kb:card:46184c -->
What are the three verification layers in an agentic pipeline?
?
1. **Structural** — code matches repository patterns (file placement, dependencies, naming, architecture)
2. **Semantic** — code does what it claims (validates against spec acceptance criteria or via behavioural diff)
3. **Provenance** — every artefact traces to a legitimate source (catches fabricated/typosquatted dependencies)

## Key Difference <!-- kb:card:b54fa8 -->
What is the key question agentic pipelines ask that traditional pipelines don't?
?
Whether the code matches the *specification* it was given, not just whether it compiles and passes tests. Also: whether the agent generated the tests too (potential bias), and whether all added dependencies actually exist in a registry.

## Semantic Layer Dependency <!-- kb:card:8a6c72 -->
What must be in place for the semantic verification layer to function?
?
Specification-driven development — the pipeline needs structured spec files with acceptance criteria to validate the implementation against. Without specs, semantic verification has nothing to check against.

## Agent Security Threats <!-- kb:card:e210ad -->
What are the three agent-specific security threats pipelines must address?
?
1. **Prompt injection** — malicious instructions in code comments or issue descriptions manipulating agent behaviour
2. **Supply chain poisoning** — agents adding unverified dependencies autonomously
3. **Scope creep** — agents modifying files outside their intended scope (workflow files, security configs)

## Self-Validating Tests <!-- kb:card:ae152c -->
How do pipelines detect agent-generated self-validating tests?
?
Via mutation testing — intentionally mutate the code and verify the tests catch the mutation. A self-validating test suite designed to pass regardless of correctness will fail to catch mutations.

## Our Council Review <!-- kb:card:19085b -->
How does our LLM Council review process map to agentic pipeline verification?
?
It implements the semantic verification layer — validating implementation against spec/requirements using multiple models. The playbook argues this should eventually be automated in CI rather than run manually per PR.
