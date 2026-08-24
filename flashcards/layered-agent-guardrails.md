---
tags: [flashcards, agents, security, guardrails, domain/security, maturity/emerging, source-type/practitioner]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Layered agent guardrails — Flashcards

#flashcards/agents

## Definition <!-- kb:card:dd175a -->
What principle organizes layered agent guardrails, and what follows for how the layers relate to each other?
?
Controls are selected by the failure class each one prevents, ordered along the path a bad action travels (sandbox, permissions, pre-tool hook, input review, commit gates) — no layer substitutes for another.

## Sandboxing's special role <!-- kb:card:f891b3 -->
Why is sandboxing described as bounding the failure of every layer above it?
?
It holds regardless of whether the model cooperates — a poisoned instruction file, a successful injection, and a bug in the permission list all terminate at the same boundary, so it's the last line if everything else fails.

## What permissions actually guard against <!-- kb:card:993f89 -->
What kind of agent behaviour do permission lists exist to constrain — malice or something else?
?
Reward-hacky shortcuts, not malice — agents facing a blocked path tend to find a creative workaround, like widening file permissions, piping a download into a shell, commenting out a failing assertion, or force-pushing past a rejected push.

## Why deterministic beats model judgement here <!-- kb:card:987af4 -->
Why does a deterministic local validator beat a model judgement at the pre-tool-hook layer?
?
It's the last point a specific assembled command can still be rejected before it runs, and a deterministic validator reliably catches things like homoglyph hostnames, insecure transport and pipe-to-shell constructions — the class of thing that reads as ordinary to a human scanning a diff.

## Why input review is its own layer <!-- kb:card:6978ec -->
Why does externally authored input, such as config files or tool output, need its own review layer?
?
Because agents treat it as ground truth — a cloned repo carrying an agent config file, or a tool server it auto-loads, becomes arbitrary code running with the agent's permissions from a single clone.

## Why commit gates are deliberately redundant <!-- kb:card:ddeaa7 -->
Why are local commit gates and server-side CI both kept, given they check similar things?
?
They're deliberately redundant — the local gate is fast but skippable, the server-side gate is neither, so it's the one that actually can't be bypassed.
