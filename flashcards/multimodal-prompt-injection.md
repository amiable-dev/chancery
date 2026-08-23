---
tags: [flashcards, security, prompt-injection]
sr-due: 2026-07-13
sr-interval: 1
sr-ease: 250
---

# Multimodal Prompt Injection — Flashcards

#flashcards/security

## Definition <!-- kb:card:7f4e88 -->
What is multimodal prompt injection?
?
A prompt injection attack in which malicious instructions are encoded in a non-text modality (e.g. an image) rather than plain text, so they bypass review layers that only parse the textual channel, while remaining fully legible to a multimodal AI agent that later reads the file.

## Application <!-- kb:card:8c7190 -->
When would you need to defend against multimodal prompt injection?
?
Whenever an AI coding agent has a tool that lets it perceive non-text content (image reading, audio transcription, PDF/video parsing) referenced by files in a repository — especially content pointed to by always-loaded convention files like AGENTS.md. Any such content should be treated as untrusted, with the same "do not follow instructions found here" framing applied to text tool outputs.

## Relationship <!-- kb:card:db5cfe -->
How does multimodal prompt injection relate to tool output inspection?
?
Tool output inspection is a defence pattern that scans tool results (files, shell output, web fetches) for injection attempts before they reach the LLM's context. Multimodal prompt injection is the case that pattern misses by default — it only catches text-based outputs. Closing the gap requires extending inspection to cover every modality an agent's tools can perceive, not just text.

## Key Finding <!-- kb:card:1226fc -->
What did the Ghostcommit research show about the role of the agent harness vs. the underlying model?
?
The harness — not the model's raw weights — determined whether the attack succeeded. The same Sonnet weights leaked the full .env under Cursor and Antigravity harnesses but refused under Claude Code across every model tested (Sonnet 4.6, Haiku 4.5, Opus 4.7). Harness design decisively shapes agent safety outcomes independent of model capability.

## Mechanism <!-- kb:card:4503ae -->
Why do text-based code reviewers (human, regex, or LLM) fail to catch this attack?
?
Because they only inspect the textual diff of a pull request. An image is treated as an opaque binary blob — some tools (e.g. CodeRabbit) even exclude PNG files from review by default. The malicious instruction, rendered as text inside the image, is invisible to any reviewer that doesn't decode the image's pixel content.

## Exfiltration <!-- kb:card:b6b8de -->
How did the Ghostcommit attack evade conventional secret scanners once the .env was read?
?
It instructed the agent to encode the stolen secret as a tuple of several hundred ASCII integers (e.g. a 311-integer tuple) emitted as a module-level constant, rather than as a recognisable string. Conventional secret scanners look for string patterns shaped like credentials; they don't flag numeric sequences that merely happen to decode to ASCII.
