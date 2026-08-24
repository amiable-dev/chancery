---
title: Bell-LaPadula confidentiality model
aliases:
  - Bell-LaPadula model
  - BLP model
  - clearance-classification dominance
date: 2026-08-24
tags:
  - concept
  - security
  - access-control
  - confidentiality
status: draft
sources:
  - url: https://archive.org/stream/DTIC_AD0770768/DTIC_AD0770768_djvu.txt
    hash: sha256:9f2ad13986eec855ae17ceb709cdeee809dde1908b213b57efeb7b8db16e32f0
    retrieved: 2026-08-24
    reachability: ok
  - url: https://archive.org/details/DTIC_AD0770768
    hash: sha256:8c6031ebd7b71a55925e42d1d41bf4e8b6d0672e083dff41090e9217c226157d
    retrieved: 2026-08-24
    reachability: ok
---

# Bell-LaPadula confidentiality model

## Definition

The Bell-LaPadula model is the foundational 1973 MITRE formalization of mandatory access control: it represents a computer system as a sequence of states, each pairing the current set of subject-object access relationships with a security-level assignment — a clearance for every subject and a classification for every object, drawn from a lattice that also carries need-to-know categories — and defines a state as secure only when every access relationship currently in effect satisfies one dominance test, the subject's clearance dominates the object's classification and covers its need-to-know category, with any state that violates this test for even one access pair defined as a compromise.

## Explanation

The report frames the problem in general-systems-theory terms and works out this single case in full: its access matrix carries read, write, copy, append, owner and control alike as access attributes, and the compromise/security-condition test it proves is stated over any current access pair without distinguishing which attribute is in force — a subject's clearance must dominate an accessed object's classification and cover its need-to-know category, full stop, whether the access is a read or a write. Neither this volume nor its immediate companion yet splits that single condition by access mode. The asymmetric refinement now usually meant by "the Bell-LaPadula model" in modern usage — a subject may read at or below its clearance (the simple security property) but may only write at or above the classification of everything it has already read (the star property, colloquially "no write-down") — was developed within the same MITRE project shortly afterward, to close a case a single mode-independent dominance test does not itself resolve: nothing stops a subject cleared to access protected data from copying it into a less-protected object, since that write and the read that preceded it can each individually satisfy the same undifferentiated test. What this report contributes is the formal machinery the later refinement is stated in terms of: the state/access/security-level model, the compromise and secure-state definitions, and the proof that a system is secure exactly when no reachable state is ever a compromise.

## Key Properties

- Defines a state as secure exactly when every current access relationship satisfies one test — subject clearance dominates object classification and covers its need-to-know category — applied uniformly across access modes (read, write, copy, append, owner, control), not split between them
- A "compromise" is any state where some access pair fails that test; a system is secure iff no state in its run is ever a compromise
- Access is graded on two axes at once: a hierarchical clearance/classification level plus non-hierarchical need-to-know categories
- The state/access/security-level formalism this report establishes is the ancestor the now-standard read/write-asymmetric refinement (simple security property plus the star property, "no write-down") builds on — that specific split is not itself stated in this volume

## Relationships

- [[agent-security-as-os-security]] — Bell-LaPadula's clearance/classification dominance test is the original, formally specified instance of the mediated-access mechanism that agent-security-as-os-security argues agent security should borrow from decades of OS access-control design.

## Applications

Tracing the formal ancestry of any mandatory-access-control or multi-level-security design — including a modern AI-agent policy engine's "no write-down" containment rule for shared-drive access — back to the clearance/classification/need-to-know vocabulary and the compromise/secure-state formalism this report establishes; recognizing that a single mode-independent dominance test does not by itself stop a Trojan-horse write-down leak, which is exactly the gap the later read/write-asymmetric refinement was built to close; or citing the original source when explaining where multi-level-security terminology originates.

## Sources

- https://archive.org/stream/DTIC_AD0770768/DTIC_AD0770768_djvu.txt
- https://archive.org/details/DTIC_AD0770768

## See Also

- [[agent-security-as-os-security]]
