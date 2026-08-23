---
tags: [flashcards, security, evasion]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Split-Payload Evasion Pattern — Flashcards

#flashcards/security

## Definition <!-- kb:card:37fbcf -->
What is the split-payload evasion pattern?
?
An attack-design technique that divides a malicious instruction across two or more artefacts — none individually coherent or suspicious enough to trigger detection — so the attack only assembles into meaning when a downstream agent reads all the pieces together and follows the pointer chain.

## Application <!-- kb:card:5e4577 -->
When would you use knowledge of the split-payload evasion pattern?
?
When threat-modelling or designing review pipelines for AI coding agents: assume any instruction referencing an external artefact (image, binary, encoded string) requires the same scrutiny as if that artefact's content were inlined, because attackers can hide the dangerous half of an instruction in a channel your reviewer doesn't parse.

## Relationship <!-- kb:card:649ce3 -->
How does the split-payload evasion pattern relate to multimodal prompt injection?
?
Multimodal prompt injection is a specific instantiation of the split-payload pattern — the "second channel" chosen is an image. The split-payload pattern is the general design technique (route the coherent, dangerous half of an instruction through an under-inspected channel); multimodal prompt injection is one concrete result of applying it.

## Structure <!-- kb:card:cc3b26 -->
What are the two pieces of a split-payload attack, and why is each individually low-suspicion?
?
Piece 1 is the pointer — a short, plausible instruction in a high-trust, always-loaded location (e.g. "derive a build constant from this image" in AGENTS.md); it's unremarkable on its own. Piece 2 is the payload — the actual malicious procedure, placed in a channel the reviewer doesn't inspect (e.g. rendered as text inside a PNG); it would be obviously malicious if read as plain text, but it never appears as plain text to the reviewer.

## Key Insight <!-- kb:card:21c632 -->
Why does the temporal separation between merge and trigger make this pattern especially dangerous?
?
Because nothing is stolen at merge time — the payload lies dormant in the pointer file until an unrelated future session causes an agent to follow the chain. This decouples the review event from the exploitation event, defeating "watch the next few commits" monitoring and making forensic attribution much harder.
