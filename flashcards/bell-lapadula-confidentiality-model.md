---
tags: [flashcards, security, access-control, confidentiality]
sr-due: 2026-08-24
sr-interval: 1
sr-ease: 250
---

# Bell-LaPadula confidentiality model — Flashcards

#flashcards/security

## Secure state definition <!-- kb:card:ee0b3e -->
What does the original 1973 Bell-LaPadula report define a 'secure state' as?
?
A state where every current access relationship satisfies one dominance test: the subject's clearance dominates the object's classification and covers its need-to-know category.

## Compromise and security <!-- kb:card:e4e9ba -->
What is a 'compromise' in Bell-LaPadula, and when is a system defined as 'secure'?
?
A compromise is any state where some access pair fails the dominance test; a system is secure if and only if no reachable state is ever a compromise.

## Two access axes <!-- kb:card:a029d8 -->
What two axes is access graded on in the Bell-LaPadula model?
?
A hierarchical clearance/classification level, plus non-hierarchical need-to-know categories.

## Original scope vs later refinement <!-- kb:card:832a84 -->
Did the original 1973 Bell-LaPadula report split its dominance test by access mode (read vs. write)?
?
No — it stated one mode-independent test applied uniformly across read, write, copy, append, owner and control. The read/write-asymmetric refinement ('no write-down') came later in the same MITRE project.

## Why the refinement was needed <!-- kb:card:8b8289 -->
What gap in the original mode-independent test did the later 'no write-down' refinement close?
?
Nothing in a single mode-independent test stops a subject cleared to access protected data from copying or writing it into a less-protected object — that read and that write could each individually satisfy the same undifferentiated test.
