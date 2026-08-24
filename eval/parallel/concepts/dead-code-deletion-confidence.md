---
title: Deletion confidence for dead code
date: 2026-08-24
tags:
  - concept
  - dead-code-detection
  - static-analysis
  - testing
status: draft
sources:
  - url: https://kevinjalbert.com/find-and-bury-dead-code/
    hash: sha256:a5f58ec2554214623cd6f2c897b94bc2bb57cfd910738f0ec813bef65c9d8c11
    retrieved: 2026-08-24
    reachability: ok
---

# Deletion confidence for dead code

## Definition

Deletion confidence for dead code is the practice of treating a static analyzer's dead-code finding as a candidate, not a verdict, and confirming it against dynamic evidence that the code was not exercised while the running application was observed for long enough to rule out code that is merely rarely used rather than truly unreachable, before deleting it.

## Explanation

Static tools examine source text without running it, so they are fast and cheap but structurally unable to distinguish code that is provably unreachable from code that is reachable only through a path the tool cannot see, such as a method invoked via metaprogramming, a dynamic dispatch, or an entry point the tool's configuration never declared; the result is a candidate list with a real false-positive rate rather than a proof. Dynamic tools instead instrument the running application and record what actually executes, which turns unused into an empirical claim, but that claim is only as strong as the observation window: a code path exercised once a quarter will look identically dead to one that will never run again until the tool has watched long enough to catch that quarter. The deletion decision therefore does not belong to either tool alone, it belongs to the combination, where a static finding earns the right to be deleted only once a sufficiently long runtime observation has failed to exercise it, and a team's job is to decide, for their own traffic patterns and release cadence, how long that observation has to run before an unexercised path counts as gone rather than merely quiet.

## Key Properties

- A static-only finding is a candidate for deletion, not proof of deletion safety, because static tools cannot see dynamic dispatch, metaprogramming, or undeclared entry points
- A dynamic-only absence-of-execution reading is only as trustworthy as its observation window, so a rarely-used-but-live path looks identical to a dead one until the tool has watched long enough
- Deletion confidence comes from combining both: delete only what static analysis flags and dynamic observation has failed to exercise over a sufficient window
- The right observation window is a judgment call tied to the code's own usage cadence, such as quarterly billing logic needing longer observation than a request handler hit every second, not a fixed default

## Relationships

- [[reachability-based-dead-code-detection]] — both aim to prove code is safe to delete, but reachability-based detection proves it from static graph structure alone while this concept adds the runtime-observation step needed because a rarely-executed-but-live path is indistinguishable from a dead one without watching execution.

## Applications

Deciding whether to act on a static dead-code linter's findings, for example in a CI gate, by requiring a runtime-coverage or production-traffic signal to agree before deletion rather than the static flag alone; sizing the observation window to the code's own usage cadence, such as watching billing or month-end logic for a full cycle rather than a fixed week; and treating a still-dead-after-N-weeks result as a trigger to schedule a deletion PR rather than as an automatic delete.

## Sources

- https://kevinjalbert.com/find-and-bury-dead-code/

## See Also

- [[reachability-based-dead-code-detection]]
