---
title: Split-payload prompt injection
date: 2026-08-24
domain: security
maturity: emerging
source_type: practitioner
tags: [concept, security, prompt-injection, supply-chain, domain/security, maturity/emerging, source-type/practitioner]
status: draft
sources:
  - url: https://cybersecuritynews.com/ghostcommit-attack-hides-prompts/
    class: external-secondary
---

# Split-payload prompt injection

## Definition

**Split-payload prompt injection** is an attack that defeats automated code review by separating a malicious instruction into a bland-looking pointer and a payload placed in a channel the reviewer never parses — characteristically a repository convention file that innocuously tells a coding agent to consult a referenced image, with the actual procedure rendered as text inside that image — so that no single reviewed artifact contains anything incriminating and the theft happens later, in an unrelated session, when a developer asks the agent for something ordinary.

## Explanation

The mechanism converts two independent blind spots into one clean pass. A pull request that states in plain text that the agent should exfiltrate a repository's environment file is caught immediately and rated high severity by model-based reviewers, so the ASSET Research Group's Ghostcommit demonstration split it in two: a harmless-reading convention file asks the agent to derive a build constant from a referenced PNG, while the procedure — read the environment file byte by byte, encode it as ASCII integers — lives as rendered text inside that PNG. Text-diff reviewers treat images as opaque binary, and one widely used reviewer excludes PNGs from review by default, so the whole pull request merges with no findings at all. Nothing is stolen at merge time; the trap arms on merge and fires later, when the agent reads the convention file during unrelated work, follows the pointer and emits a module-level constant holding several hundred integers that decode byte-for-byte into the secrets, which the attacker reads straight off the public commit. The exfiltration channel is chosen on the same principle as the instruction channel: secret scanners match string patterns, and a numeric sequence is not credential-shaped. The most transferable finding is that across eleven tool-and-model combinations the outcome tracked the harness far more than the model — identical Sonnet weights leaked the file under one agent and refused under another, and in one run a model computed and wrote the secret, then recognized the social-engineering pattern and deleted it before finishing. The source is trade-press coverage of a disclosed technique with a linked disclosure page and an open-source proof of concept including the decoder, so the mechanism is reproducible while the per-tool leak table is a snapshot that will age quickly. The researchers' prototype defence is multimodal by construction — invisible-character detection, code-shape analysis and model passes over both convention text and embedded images — and is reported catching 49 of 50 attacks with no false positives on thirty benign pull requests, on a small open model running on a single 4GB GPU.

## Key Properties

- Instruction and payload are split so that no individually reviewed artifact is incriminating
- The payload rides a channel text-diff reviewers skip, and at least one reviewer excludes PNGs by default
- Activation is deferred to a later, unrelated session, decoupling the merge from the theft
- Secrets leave encoded as integer tuples, which string-pattern secret scanners do not recognize as credentials
- Leak versus refusal tracked the surrounding harness more than the underlying model weights

## Relationships

- [[mcp-tool-poisoning]] — is the same manoeuvre one layer over — instructions smuggled into a channel the agent consumes as trusted metadata rather than as user input, while the review surface that would have caught them is looking somewhere else
- [[agent-harness]] — is what these results actually indict, since identical model weights leaked under one harness and refused under another, which places the injection defence in the harness rather than in the model
- [[agent-skills-format]] — shares the delivery vehicle, because a markdown convention file that an agent reads as instructions is executable surface, and merging one is closer to merging code than to merging documentation
- [[non-text-channel-injection]] — split-payload prompt injection is the same image-payload attack non-text-channel injection names generally — splitting a malicious instruction into a bland pointer plus a payload in an unparsed channel is the specific mechanism behind that general parser gap.
- [[closed-loop-secure-codegen]] — split-payload prompt injection is exactly the kind of newly-discovered bug class closed-loop secure codegen's loop converts into a standing instruction-file edit — once identified, the fix becomes a rule every future agent loads warning it not to treat image content as authoritative instruction.

## Applications

Configuring AI code review so that images and other binaries are not silently exempt from inspection; treating merged convention, rules and skill files as executable changes that need human review; extending secret scanning to encoded, non-string-shaped representations of credentials.

## Sources

- https://cybersecuritynews.com/ghostcommit-attack-hides-prompts/

## See Also

- [[mcp-tool-poisoning]]
- [[agent-harness]]
- [[agent-skills-format]]
