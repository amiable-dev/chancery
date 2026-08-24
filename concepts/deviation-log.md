---
title: Deviation log
date: 2026-08-24
domain: ai-agents
maturity: emerging
source_type: vendor-doc
tags: [concept, ai-agents, software-engineering, observability, domain/ai-agents, maturity/emerging, source-type/vendor-doc]
status: draft
sources:
  - url: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
    hash: sha256:ddab0eb45dd176c5a5d118c577770304f076a84b2d8a65d68ed5670f43f44198
    retrieved: 2026-08-24
    class: external-primary
    reachability: ok
---

# Deviation log

## Definition

A **deviation log** is a running record an agent maintains during autonomous execution of every point where reality forced it off the agreed plan, together with the choice it made and why — governed by a standing rule such as prefer the conservative option, record the departure, and keep going — so that the difference between what was planned and what was built is inspectable afterwards rather than buried in a transcript.

## Explanation

It exists because planning has a hard floor: however thorough the pre-flight work, execution surfaces edge cases in the existing code that no plan anticipated, and the agent must decide something at that moment. Without a log, those decisions are invisible — they are neither in the plan nor obvious in the diff, since a diff shows what was written and not which of the writer's assumptions were abandoned. The log turns them into a short, reviewable list. Its second function is compounding across attempts: because a plan plus a prototype plus a deviation log are compact artifacts rather than a conversation, a fresh session can be started from them, giving the model a clean context window that still carries everything the previous run learned. That makes the log the mechanism by which a second attempt at the same task is materially better informed than the first, rather than a re-run. The instruction that makes it work has three parts — a named file, a rule for what to do when deviating, and a rule to continue rather than stop — because an agent that halts on every surprise defeats the point of delegating a long-horizon task at all.

## Key Properties

- Records only departures from the plan, not a full narration, keeping it short enough to read
- Pairs a logging instruction with a default policy for the moment of deviation, typically the conservative option
- Explicitly instructs the agent to continue, so long-horizon work is not interrupted by every surprise
- Deviations are invisible in a diff, which shows what was written and not which assumptions were dropped
- Compact enough to seed a fresh session, carrying prior learning without carrying prior context

## Relationships

- [[memory-as-harness-capability]] — is a hand-rolled instance of it — the model has no memory of the run, so the harness or the operator must instruct the writing of one
- [[unknowns-inventory-prompting]] — catches the residue that framing cannot eliminate, since some unknowns only exist once execution meets the real code
- [[comprehension-gate]] — supplies the raw material for it, because the deviations are exactly the part of a change a reviewer is least likely to reconstruct unaided

## Applications

Any delegated implementation long enough that the plan will not survive contact with the code — instruct a notes file with a deviations section, then read it before reviewing the diff and pass it into the next session as seed context.

## Sources

- https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns

## See Also

- [[memory-as-harness-capability]]
- [[comprehension-gate]]
- [[unknowns-inventory-prompting]]
