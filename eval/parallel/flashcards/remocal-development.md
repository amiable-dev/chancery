---
tags: [flashcards, developer-experience, kubernetes, tooling, domain/infrastructure, maturity/emerging, source-type/vendor-doc]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Remocal development — Flashcards

#flashcards/developer-experience

## Definition <!-- kb:card:b0eba4 -->
What is remocal development?
?
Running a service's process on the developer's own machine while its inputs/outputs come from a real remote environment — incoming requests mirrored or stolen from a live pod, outgoing traffic egressing through that pod, file I/O and env vars from the remote deployment — to remove the deploy step from the inner dev loop.

## How interception works <!-- kb:card:a4359a -->
How does remocal development intercept traffic, and how does that differ from a VPN-style tool?
?
A layer loaded into the local process's memory overrides individual syscalls, redirecting per-operation (this file read remote, that one local); a cluster-scheduled agent pod runs in the target pod's network namespace. A VPN-style tool instead joins the whole machine to the cluster network — coarse, and it usually needs elevated local privileges.

## Mirrored vs. stolen traffic <!-- kb:card:7e5f71 -->
What is the difference between mirroring and stealing incoming traffic in remocal development?
?
Mirrored traffic is copied to the local process while the remote pod keeps serving it; stolen traffic is redirected so the local process serves it instead of the remote pod.

## Benefits of process-level interposition <!-- kb:card:2c104b -->
What two benefits follow from remocal development intercepting at the process level rather than the network level?
?
No local root privileges are required, and multiple sessions can run concurrently, each local process bound to a different remote pod.

## Security caveat <!-- kb:card:9575c4 -->
What security risk does remocal development's own mechanism create for a developer's laptop?
?
Reading the remote filesystem and importing the pod's environment variables means the local process holds that pod's real credentials — so the developer laptop inherits production blast radius.
