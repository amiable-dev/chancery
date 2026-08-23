---
title: "MITRE ATT&CK Framework"
aliases: ["MITRE ATT&CK Framework"]
date: 2026-04-29
domain: security
maturity: established
source_type: practitioner
tags: [concept, security, offensive-security, threat-intelligence, red-team, blue-team, frameworks, domain/security, maturity/established, source-type/practitioner]
status: draft
sources:
  - url: https://attack.mitre.org/
    hash: sha256:e8eb31926fed587131862991a06880b0902c0fad84b52570c9c27d4784258ef2
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
  - url: https://cybersecuritynews.com/pentest-ai-agents-tool/
    hash: sha256:682aa76268791695e6e07283f83d0a81b6f2f675a0ddddea7512972aad7f9aee
    retrieved: 2026-08-21
    class: unclassified
    reachability: ok
---

# MITRE ATT&CK Framework

## Definition
MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) is a publicly accessible, curated knowledge base of adversary tactics and techniques derived from real-world cyber attack observations. It provides a structured taxonomy — organised by platform (Enterprise, Mobile, ICS, Cloud) — that enables consistent classification, communication, and analysis of attacker behaviour across the full attack lifecycle.

## Explanation
Before ATT&CK, describing attacker behaviour was inconsistent: one team might call something "lateral movement," another "privilege escalation," with no shared vocabulary. MITRE ATT&CK provided a common language and a structured hierarchy:

**Core hierarchy:**
- **Tactic** — the *why*, the adversary's goal (e.g., Initial Access, Privilege Escalation, Exfiltration)
- **Technique** — the *how*, the general method (e.g., T1566 Phishing, T1055 Process Injection)
- **Sub-technique** — the specific implementation (e.g., T1566.001 Spearphishing Attachment)
- **Procedure** — the actual observed implementation by a specific threat actor group

**The Enterprise matrix** currently covers 14 tactics and 200+ techniques across Windows, macOS, Linux, cloud, containers, and network environments.

**How it's used:**

*By defenders (blue team):*
- Map existing detections to ATT&CK IDs to identify coverage gaps
- Prioritise detection engineering based on techniques used by relevant threat groups
- Evaluate security controls against ATT&CK coverage heat maps
- Communicate findings to leadership in a structured, vendor-neutral language

*By attackers/red teams:*
- Plan engagements using ATT&CK as a checklist of techniques to simulate
- Document findings with standard technique IDs for clear reporting
- Chain techniques into realistic attack paths (e.g., T1078 Valid Accounts → T1021 Remote Services → T1055 Process Injection)

*By AI agent systems:*
- Tag every executed technique with an ATT&CK ID automatically
- Pair offensive findings with the mapped defensive detections
- Generate structured reports with standard identifiers that both red and blue teams understand
- Enable cross-engagement analysis: "which ATT&CK techniques do we keep finding?"

**ATT&CK Navigator** is the canonical visualisation tool — a heat map showing which techniques are detected, tested, or uncharted. Teams use it to visualise coverage and plan red team scope.

**Related MITRE projects:**
- **MITRE ATLAS** — equivalent framework for adversarial attacks on AI/ML systems (prompt injection, model poisoning, training data attacks)
- **MITRE D3FEND** — defensive countermeasures mapped to ATT&CK techniques
- **MITRE ENGAGE** — adversary engagement and deception techniques

## Key Properties
- **Real-world grounded**: Techniques are derived from actual observed attacks, not theoretical — each has documented real-world usage examples and threat group attribution
- **Platform-specific**: Separate matrices for Enterprise (Windows/macOS/Linux/Cloud), Mobile, and ICS/OT environments
- **Versioned and maintained**: Regular updates add new techniques as threat landscape evolves
- **Vendor-neutral**: No commercial affiliation — widely adopted as a lingua franca across security industry
- **Bidirectional**: Used by both offensive (red team) and defensive (blue team) practitioners, enabling the same taxonomy on both sides

## Relationships
- Related to [[offensive-defensive-symmetry]]: ATT&CK enables the symmetry — the same technique ID connects the offensive action to its defensive countermeasure
- Related to [[ai-assisted-penetration-testing]]: AI pentest tools auto-tag findings with ATT&CK IDs, enabling structured reporting and coverage tracking
- Related to [[zero-trust-architecture]]: Zero-trust controls are often mapped to ATT&CK techniques they defend against

## Applications
**Detection engineering:** Use ATT&CK as the detection roadmap — build detections for high-priority techniques used by threat groups targeting your sector.

**Red team planning:** Structure engagements around ATT&CK tactics to ensure comprehensive lifecycle coverage (not just initial access).

**AI security tooling integration:** Auto-tag every AI agent action with an ATT&CK ID for structured findings databases, enabling cross-session and cross-engagement analysis.

**Executive reporting:** Express risk in ATT&CK terms ("we have no detection for T1078 Valid Accounts, which is used by 62% of ransomware groups") — translates technical findings to business risk.

**Security product evaluation:** Assess vendor coverage by mapping their detections to ATT&CK — compare products on a neutral standard.

## Sources
- [MITRE ATT&CK](https://attack.mitre.org/) — official knowledge base and documentation
- [pentest-ai-agents — 28 Claude Code Subagents for Penetration Testing](https://cybersecuritynews.com/pentest-ai-agents-tool/) — example of ATT&CK integration in AI-assisted pentesting

## See Also
- [[offensive-defensive-symmetry]]
- [[ai-assisted-penetration-testing]]
- [[zero-trust-architecture]]
- [[network-layer-ai-security]]
