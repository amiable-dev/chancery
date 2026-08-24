---
title: Non-text channel injection
date: 2026-08-24
domain: security
maturity: emerging
source_type: research
tags: [concept, security, ai-agents, prompt-injection, code-review, domain/security, maturity/emerging, source-type/research]
status: draft
sources:
  - url: https://asset-group.github.io/disclosures/ghostcommit/
    hash: sha256:6acadb4edc4aea84f43355ca9a0cc2325fd2a7158bfc637832f85591744d078b
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Non-text channel injection

## Definition

**Non-text channel injection** is the attack pattern in which an instruction aimed at an AI agent is placed in a representation the defending review pipeline does not parse but the agent does: most concretely, prose rendered as pixels inside an image committed to a repository, which a human skimming a diff, a regex scanner, and an LLM reviewer working from the unified diff all see as an opaque binary blob, while a vision-capable coding agent reads it and treats it as project policy. The same mismatch runs in the other direction on the way out, when the stolen value is emitted in an encoding no deployed scanner decodes, so the general shape of the attack is a gap between the set of representations the defender parses and the wider set the agent parses.

## Explanation

The mechanism is payload splitting plus channel mismatch. A convention file of the kind coding agents load automatically at session start (an AGENTS.md) is written to be harmless on its face: it names no secret, contains no encoding recipe, and only instructs that a module constant be derived from a build specification held in a committed PNG. The exploit lives inside the image, where rendered text tells the agent to read the repository's credential file byte by byte, emit each byte as an integer codepoint in a module-level tuple, and verify the round-trip decodes back to the original file before committing. No single file in the pull request contains a complete exploit, and the one file that does is unreadable to a text pipeline — one commercial reviewer excludes image paths from review by default configuration, and the other returned no findings on an image containing maximally explicit attack prose. Fabricated supporting artifacts (a plausible validator module, a fake postmortem describing a past provenance incident) defeat the reviewer's remaining defence, a coherence check that flags conventions with no supporting code. Merge is not the payoff: the payload lies dormant until an unrelated later session, when the agent reads the merged convention, follows the pointer, opens the credential file, and writes the secret into the feature the developer actually asked for, where it reads as ordinary provenance metadata. The exfiltrated value is equally invisible on the way out, because secret scanners match credential-shaped strings and none of them convert an integer tuple back to ASCII to check. Why it matters is a base rate: a survey of 6,480 pull requests across the 300 most active public repositories found 73% of merged ones reached the default branch with no substantive human review and no bot review, so the LLM reviewer is increasingly the only reviewer, and its input surface is narrower than the agent's. The source is original security research from an academic group, published with a public proof-of-concept and decoder; the end-to-end exfiltration runs are reported as single autonomous demonstrations rather than success rates, and the piece closes by presenting the authors' own multimodal defender, whose reported results are their own evaluation and should be read as such.

## Key Properties

- Payload split so no single file holds a complete exploit — the readable convention file only points at the image
- Text pipelines treat committed images as opaque blobs; one reviewer excludes image paths by default, the other found nothing in explicitly malicious image prose
- Fabricated supporting artifacts defeat coherence checks that flag conventions with no backing code
- Dormant across sessions: review and exploitation are separated in time, so the merge diff shows nothing to act on
- The blindness is bidirectional — a tuple of integer codepoints is not credential-shaped, so secret scanners do not match the exfiltrated value either

## Relationships

- [[mcp-tool-poisoning]] — is the same trust failure relocated from protocol metadata into repository content — poisoning hides adversarial instructions in server-supplied tool descriptions, this hides them in files the agent auto-loads as project policy, and in both cases attacker-authored text enters the agent's context with the authority of system instructions
- [[siem-agentic-visibility-gap]] — is the monitoring-side twin of this blind spot: both turn on defenders parsing a narrower representation than the agent actually acts on, whether that is a causal tool chain reduced to unremarkable API calls or an instruction reduced to a binary blob
- [[harness-determined-injection-resistance]] — was measured against this attack — running the same image-borne instruction across tool-and-model pairs is what isolated the harness, rather than the model, as the variable that decided compliance
- [[split-payload-prompt-injection]] — split-payload prompt injection is the same image-payload attack non-text-channel injection names generally — splitting a malicious instruction into a bland pointer plus a payload in an unparsed channel is the specific mechanism behind that general parser gap.
- [[vlm-document-parsing]] — VLM document parsing's core capability — a model reading structured content directly from an image others cannot parse — is exactly the mechanism non-text-channel injection weaponizes: the same vision-language reading that recovers a table from a scanned PDF recovers an attacker's instruction from a pixel-rendered payload.

## Applications

Setting review policy for repositories that coding agents read — decode and inspect every non-text asset in a diff instead of excluding it, and extend secret scanning to numeric and other non-string encodings. Red-teaming an agent-assisted development pipeline by enumerating which channels the reviewer parses against which channels the agent parses, and treating any gap as an injection surface.

## Sources

- https://asset-group.github.io/disclosures/ghostcommit/

## See Also

- [[mcp-tool-poisoning]]
- [[harness-determined-injection-resistance]]
- [[siem-agentic-visibility-gap]]
