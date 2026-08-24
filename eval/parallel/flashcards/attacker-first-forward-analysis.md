---
tags: [flashcards, security, static-analysis, agents, domain/security, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Attacker-first forward analysis — Flashcards

#flashcards/security

## Definition: attacker-first forward analysis <!-- kb:card:cc7417 -->
How does attacker-first forward analysis reverse the usual direction of vulnerability search?
?
Instead of starting at dangerous sinks and reasoning backward to a hypothetical attacker, it starts at surfaces an attacker demonstrably controls (API parameters, network messages, uploaded files) and reasons forward to see if any reach a dangerous operation with attacker-controlled data intact.

## Why sink-first search is noisy <!-- kb:card:9abd3a -->
Why does sink-first vulnerability search tend to produce a backlog dominated by unreachable findings?
?
Because proving a sink unreachable means proving a negative across the whole program, which is expensive — so tools instead emit the unproven reachability hypothesis as a finding and hand the proof obligation to the analyst.

## Existence claim vs. universal claim <!-- kb:card:66fb73 -->
What kind of claim does forward search need to settle, versus what backward (sink-first) search must settle?
?
Forward search settles an existence claim — does this path reach something dangerous — which is cheap to settle affirmatively; backward search must settle a universal claim, that no path exists, which is expensive to settle at all.

## Paths anchored to actual capability <!-- kb:card:d668ae -->
What is every path explored by forward analysis anchored to, rather than to a syntactic pattern?
?
A capability the attacker demonstrably has — e.g. this endpoint is exposed, this parameter is attacker-supplied — rather than a code pattern like a concatenated query or deserialization call that is merely a hypothesis.

## Trade-off: the blind spot moves <!-- kb:card:c6768b -->
What is the symmetric trade-off of forward search compared to sink-first search?
?
Forward search inherits the quality of its entry-point enumeration, so it misses sinks reached only through unenumerated paths — an internal caller, a second-order flow through stored data, or a background job consuming a queue.
