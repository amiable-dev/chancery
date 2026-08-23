---
tags: [flashcards, security, patterns, false-positives]
sr-due: 2026-08-01
sr-interval: 1
sr-ease: 250
---

# Diff Classifier Pattern — Flashcards

#flashcards/security

## Definition <!-- kb:card:7dcfbf -->
What are the two stages of the diff classifier pattern, and what does each stage optimise for?
?
Detection (cheap, mechanical, high-recall — e.g. a hash comparison flagging that something changed) followed by classification (judgement-based, lower-volume, high-precision — deciding whether the change is cosmetic or material). Only material changes reach a human.

## Application <!-- kb:card:dc88e9 -->
Why does a binary allow-or-deny gate for change detection tend to fail over time, even if the underlying detector is accurate?
?
An accurate detector still flags a high volume of harmless drift alongside real risk. If every flagged event is routed to a human as an equally-weighted alert, reviewers learn most alerts are noise and start approving without genuinely inspecting — the control keeps running but stops providing real protection.

## Relationship <!-- kb:card:116366 -->
Give a non-security example from the source material where the same "detector without a classifier" failure occurred, and what the missing piece was.
?
The PKM weekly audit repeatedly surfaced the same ~22 link suggestions, which sat unactioned for months. The detection step (finding broken/suggested links) was fine; the missing piece was a second-stage judgement distinguishing genuinely new, actionable findings from restatements of long-standing low-priority ones.

## Consequence <!-- kb:card:f1e520 -->
When designing a new detective control (security or otherwise), what should be budgeted for from the start, according to this pattern?
?
The classification stage, not just the detector. A detector without a classifier is described as "a fast path to operator fatigue, not a finished control" — the materiality/cosmetic judgement should be planned as a first-class part of the control, not bolted on after alert fatigue is already observed.
