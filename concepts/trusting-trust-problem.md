---
title: "Trusting Trust Problem"
date: 2026-07-17
domain: security
maturity: established
source_type: research
topics: [supply-chain]
tags: [concept, security, supply-chain, provenance, software-engineering, domain/security, maturity/established, source-type/research, topic/supply-chain]
status: draft
sources:
  - url: https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf
    hash: sha256:8ab9d339a2c2781382e6aa4c3c472a94edfcc05d10e3eedf63cbaac9530e9932
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://semgrep.dev/blog/2026/ai-supply-chain-problem/
    hash: sha256:b130f856114455884ee99d5a470063f08cf3ac888b4db423b37ef72dd34343ee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# Trusting Trust Problem

## Definition
The Trusting Trust Problem is the security principle — originating in Ken Thompson's 1984 Turing Award lecture "Reflections on Trusting Trust" — that you cannot establish the trustworthiness of a system by inspecting only what is directly in front of you; you must also trust everything that was used to *build* it, recursively, because a compromise can be inherited through the build chain without leaving any trace in the artefact's own visible source or documentation.

## Explanation
Thompson's original demonstration used a modified C compiler. The compiler was altered to do two things: (1) insert a backdoor whenever it compiled the login program, and (2) insert *itself* — the malicious modification — whenever it compiled a new version of the compiler. Once this modified compiler had been used once to build the "clean" compiler source, the backdoor propagated forward invisibly into every future compiler build, forever, even though the compiler's own source code (as read by a human) contained no trace of the backdoor. Reviewing the source told you nothing; the compromise lived in the *lineage*, not the artefact.

**The generalisable lesson:** inspection of an artefact's visible inputs (source code, documentation, current state) is necessary but not sufficient for trust. You also need to trust the *chain of tools and processes* that produced those visible inputs — and that chain can extend arbitrarily far back, through versions of the tool you can no longer inspect.

**Why this resurfaces for AI models.** A trained model is, in effect, the output of a build process: a training pipeline consuming data, applying filters, running fine-tuning stages, sometimes distilling from or inheriting weights from an earlier "parent" model. A model's *lineage* — what data it was trained on, what earlier checkpoints it derives from, what fine-tuning was applied by intermediate parties — plays the same role the compiler's build history played in Thompson's example. Just as a clean-looking compiler source could still produce backdoored binaries because of a poisoned ancestor compiler, a model with clean-looking outputs on your test prompts could still carry inherited behaviour from an earlier stage in its lineage that you never had visibility into. See [[ai-model-black-box-risk]] for the model-specific consequences.

**Why "unknown unknowns" matter here specifically.** With the compiler example, once Thompson explained the attack, engineers at least knew *what question to ask* (has this compiler's ancestry been compromised?), even if answering it was hard. With model lineage, the industry is arguably earlier than that: there isn't yet broad consensus on what the equivalent verification questions are, let alone tooling to answer them. This is the "we don't know what we don't know" framing — distinct from merely having hard-to-answer known questions (opaque datasets, undisclosed fine-tuning), which are difficult but at least identified.

## Key Properties
- **Trust is not transitive through inspection alone** — reading the current source/artefact does not reveal compromises introduced upstream in the build chain
- **Self-propagating** — in Thompson's example, the backdoor re-inserts itself into every future build of the compromised tool, without requiring ongoing attacker intervention
- **Invisible at the inspection layer** — the compromise exists in the *process* that produced the artefact, not in anything a code/weights review of the artefact itself would surface
- **Recursive** — trusting a system requires trusting everything used to build it, which itself required trusting what built *that*, and so on
- **Predates AI** — this is a foundational, decades-old computer security principle now being re-applied to model training pipelines rather than compilers

## Relationships
- Foundational to [[ai-model-black-box-risk]]: model lineage inheriting undetectable behaviour from earlier training/fine-tuning stages is a direct application of this problem to AI training pipelines rather than compiler toolchains
- Related to [[agent-attestation-standards]]: attestation standards are one concrete attempt at a partial fix — cryptographically binding an artefact to its immediate build inputs (agent, model version, spec) narrows, but does not eliminate, the trusting-trust gap, since the attested inputs themselves could still have compromised ancestry
- Related to [[cyclonedx-sbom]] and [[supply-chain-endpoint-gap]]: SBOMs and endpoint inventories address the "what is currently present" question; the trusting-trust problem is a level deeper — even a fully accurate inventory doesn't tell you whether the *build process* that produced each listed component was itself compromised

## Applications
- **Toolchain security reviews:** When auditing a build pipeline (compilers, CI runners, base container images, model training infrastructure), explicitly ask "what built the thing that builds this?" rather than stopping at the immediate tool
- **Reproducible builds:** Reproducible build initiatives (Debian, SLSA build levels) exist specifically to give independent verifiers a way to counter this problem — if multiple independent parties can rebuild the identical artefact from source, a compiler-level backdoor becomes detectable by discrepancy
- **AI model provenance requirements:** When evaluating a model vendor, ask not just "what's in your latest training run" but "what checkpoints/models did this one inherit from, and were those independently verified?" — treating model lineage with the same suspicion Thompson's argument demands of compiler lineage
- **Teaching security fundamentals:** Use this as the canonical example when explaining to engineers why "I read the code and it looks fine" is an insufficient trust bar for critical infrastructure

## Study
- Flashcards: [[flashcards/trusting-trust-problem|Practice this concept]]

## Sources
- Ken Thompson, [Reflections on Trusting Trust](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf), 1984 ACM Turing Award Lecture — the original source
- [The AI Supply Chain Has a Supply Chain Problem (semgrep.dev, 2026)](https://semgrep.dev/blog/2026/ai-supply-chain-problem/) — applies the argument to model lineage and AI supply chain trust

## See Also
- [[ai-model-black-box-risk]]
- [[agent-attestation-standards]]
- [[cyclonedx-sbom]]
- [[supply-chain-endpoint-gap]]
