---
tags: [flashcards, security, ai-agents, prompt-injection, code-review, domain/security, maturity/emerging, source-type/research]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Non-text channel injection — Flashcards

#flashcards/security

## Definition <!-- kb:card:f45499 -->
What is non-text channel injection?
?
An attack that places an instruction for an AI agent in a representation the defending review pipeline doesn't parse but the agent does — classically, prose rendered as pixels in a committed image, invisible to human diff review, regex scanners, and LLM reviewers, but read and followed by a vision-capable coding agent.

## Payload-splitting mechanism <!-- kb:card:e99bcb -->
How does the payload-splitting mechanism in a non-text channel injection attack work?
?
A harmless-looking convention file (e.g. an auto-loaded AGENTS.md) points the agent to derive a value from a build spec inside a committed image. The image's rendered text holds the actual malicious instructions. No single file in the pull request contains a complete exploit.

## Why text pipelines miss it <!-- kb:card:b7fe39 -->
Why do text-based review pipelines miss the malicious instructions embedded in a committed image?
?
They treat committed images as opaque binary blobs — one commercial reviewer excludes image paths from review by default, and another returned no findings even on an image containing explicit attack prose.

## Defeating coherence checks <!-- kb:card:d38082 -->
How does the attack defeat a reviewer's coherence check that flags conventions with no supporting code?
?
By adding fabricated supporting artifacts — such as a plausible validator module or a fake postmortem about a past incident — that make the malicious convention look backed by real history.

## Dormancy across sessions <!-- kb:card:bf2074 -->
Why doesn't merging the pull request immediately trigger the exploit?
?
The payload lies dormant until an unrelated later session, when the agent reads the merged convention, follows the pointer into the image, and acts on it — separating review from exploitation in time.

## Bidirectional blindness <!-- kb:card:40d084 -->
Why do secret scanners typically fail to catch the exfiltrated data going back out in this attack?
?
The stolen value is emitted in an encoding (e.g. a tuple of integer codepoints) that isn't credential-shaped, and deployed scanners don't convert such encodings back to ASCII to check them.
