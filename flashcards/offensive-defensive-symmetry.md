---
tags: [flashcards, security, red-team, blue-team, patterns]
sr-due: 2026-04-29
sr-interval: 1
sr-ease: 250
---

# Offensive-Defensive Symmetry — Flashcards

#flashcards/security

## Definition <!-- kb:card:a8308a -->
What is offensive-defensive symmetry?
?
A security design principle where every offensive technique, finding, or attack vector is systematically paired with its corresponding defensive context — detection methods, mitigation controls, and remediation guidance — within the same tool, report, or knowledge artifact. Attack knowledge and defence knowledge are co-located rather than siloed.

## Why It Matters <!-- kb:card:d5e97a -->
Why does co-locating offensive and defensive knowledge matter?
?
Faster remediation (engineers get detection guidance alongside the finding — no extra research); coverage visibility (you immediately see which findings you can and can't detect); shared vocabulary via ATT&CK IDs; better red team design (red teams who understand detection can test detection evasion).

## Application <!-- kb:card:18e31c -->
How would you apply offensive-defensive symmetry to an AI pentest agent?
?
Design execution agents to always write paired output: attack narrative + ATT&CK ID + detection signatures + mitigation controls. The AI has full context to generate both sides in one step. The findings database stores both, so the report generator produces immediately actionable output for both red and blue teams.

## Relationship to ATT&CK <!-- kb:card:e34615 -->
How does the MITRE ATT&CK framework enable offensive-defensive symmetry?
?
ATT&CK technique IDs serve as the neutral join key connecting the offensive action to its defensive countermeasure. Each technique entry documents both how attackers use it and how defenders detect it. MITRE D3FEND extends this with explicit defensive mappings to ATT&CK techniques.

## Detection Gap Reveal <!-- kb:card:3c45a6 -->
How does offensive-defensive symmetry make detection gaps visible?
?
When every attack finding is paired with its detection guidance, the absence of a detection becomes explicit — you see "this finding has no current detection coverage" rather than discovering gaps later. The pairing structure reveals the gap at the moment of finding, not in a quarterly review.
