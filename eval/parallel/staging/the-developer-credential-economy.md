# The developer credential economy: Why exposure data is the new front line in the supply chain war

**Source:** https://www.tenable.com/blog/the-developer-credential-economy-exposure-data-is-the-new-front-line-in-the-supply-chain-war
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Recent supply chain attacks have highlighted an urgent need for organizations to shift from a reactive security posture to a preemptive exposure management strategy. Learn why endpoint detection and response tools don’t have you covered when highly privileged developer credentials get exposed.

---

Recent supply chain attacks have highlighted an urgent need for organizations to shift from a reactive security posture to a preemptive exposure management strategy. Learn why endpoint detection and response tools don’t have you covered when highly privileged developer credentials get exposed.

## Key takeaways:

1.  Recent supply chain attacks are emblematic of an insidious new trend in cybercrime: Threat actors are increasingly using supply chain attacks to harvest highly privileged developer credentials and create a “Developer Credential Economy,” a lucrative black market for API keys, secrets, and cloud access tokens.  
     
2.  Relying on execution-layer detection, such as EDR, is insufficient against supply chain threats because these tools lack visibility into the ephemeral CI/CD environments where credential theft and weaponization actually occur.  
     
3.  Neutralizing the systemic infrastructure risk created by the Developer Credential Economy requires a continuous threat exposure management (CTEM) approach to proactively identify and eliminate exposure conditions, such as long-lived access tokens, before an attacker can exploit them.

## Background

The convergence of the [Anthropic Claude Code source leak](https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai) and the [Sapphire Sleet (UNC1069) Axios compromise](https://www.tenable.com/blog/faq-about-the-axios-npm-supply-chain-attack-by-north-korea-nexus-threat-actor-unc1069) has collapsed the boundary between traditional malware and systemic infrastructure risk. Our analysis of the exposure intelligence data reveals that the cluster of supply chain attacks observed in March 2026 should not be viewed as disparate incidents; rather, they signify the new operational reality of a high-velocity **“Developer Credential Economy,”** a black market for highly privileged developer credentials.

In this new reality, attackers are no longer just hacking software supply chains; they’re systematically using supply chain attacks to harvest the very keys to the kingdom from the tools security teams trust most.

## The myth of the EDR singularity

[Microsoft](https://www.linkedin.com/posts/microsoft-threat-intelligence_mitigating-the-axios-npm-supply-chain-compromise-activity-7445214271774556160-lusQ/) and [Google](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package) have independently attributed the recent Axios compromise to a North Korean state actor. Industry narratives have framed the compromise, which backdoored an npm-managed JavaScript library package with 100 million weekly downloads, as a victory for endpoint detection and response ([EDR](https://www.tenable.com/cybersecurity-guide/principles/endpoint-detection-and-response-edr)). The logic seems simple: EDR caught and stopped the payload at execution, therefore EDR is the solution.

**This is a dangerous miscalculation.** The concept of an EDR singularity, where Endpoint Detection and Response (EDR) solutions become so comprehensive, intelligent, and autonomous that they negate the need for virtually all other security tools and human intervention at the endpoint is a powerful and seductive myth dominating the current security landscape. This narrative suggests that, through advancements in machine learning, behavioral analytics, and automated response capabilities, a single, all-encompassing EDR platform will eventually unify and solve the bulk of security challenges.

Relying on EDR to stop a supply chain attack is like relying on a smoke detector while storing open canisters of gasoline in your kitchen. Our analysis shows that by the time an EDR agent fires on the **WAVESHAPER.V2 RAT**, the true damage — the exposure — has already occurred. This demonstrates the urgent need for organizations to shift from a reactive to a preemptive cybersecurity posture.

-   **EDR is reactive:** It monitors execution, not the conditions that allow it. It cannot see the misconfigured GitHub Action or the over-privileged npm token that enabled the compromise in the first place.
-   **The coverage gap:** EDR has zero visibility into the ephemeral CI/CD runners and build environments where these credentials are stolen. In the Developer Credential Economy, the theft happens where the agents aren't.
-   **The fail-deadly speed:** In the Axios campaign, the malware was designed to exfiltrate secrets and self-destruct within seconds; typically faster than an EDR alert can be triaged by a human analyst.
-   **EDR evasion is not theoretical:** EDR evasion is an active, industrialized capability. Threat actors routinely bypass kernel-level EDR through bring your own vulnerable driver (BYOVD) attacks, where adversaries load legitimately signed but vulnerable kernel drivers to disable or blind EDR agents.

## Targeting analysis: Mapping the credential generation layer

Adversaries are increasingly compromising and [weaponizing](https://www.sans.org/blog/when-security-scanner-became-weapon-inside-teampcp-supply-chain-campaign) critical chokepoint tools used by developers and security teams, like the Axios npm package and the KICS IaC scanner. This trend, which involves moving upstream in the development lifecycle, reveals a distinct division of labor within this emerging threat economy.

![Tenable Attack Path Interruption image](https://www.tenable.com/sites/default/files/images/blog/a019e575-eeaf-4789-89a4-e2fe01ec533d.png)

**Actor / Group**

**Operational focus**

**Primary target**

**Vertical Impact**

**TeamPCP**

**Generation layer:** Bulk credential harvesting via tool exploitation

Trivy, LiteLLM, KICS (Security/Dev tools)

Global SaaS & AI infrastructure

**Sapphire Sleet**

**Weaponization layer:** State-sponsored exfiltration and revenue generation

Axios, npm ecosystem

Fintech, Crypto, Government

**GlassWorm**

**Opportunistic layer:** High-volume automated theft

VSCode extensions, OpenVSX

Blockchain & Web3

Actors are successfully exploiting exposures, such as long-lived tokens, overprivileged CI/CD runners, and unpinned dependencies, to force organizations into a reactive posture.

## Exposure intelligence: The shift to CTEM

To escape this pattern, defenders must shift from merely reacting to malware to adopting **continuous threat exposure management (**[**CTEM**](https://www.tenable.com/cybersecurity-guide/learn/what-is-ctem)**)** as a preemptive strategy.

While AI companies market their frontier models as security tools, the recent leak of 512,000 lines of Claude source code demonstrates that AI is just another asset with its own massive exposure profile.

A mature CTEM program, powered by **exposure intelligence**, focuses on the preemptive actions that actually reduce risk:

1.  **Phase 1: Hardening (The Kill Switch)**: Organizations must audit lockfiles and kill lifecycle hooks (_\--ignore-scripts_) immediately. This eliminates the postinstall vector that Sapphire Sleet used to deploy WAVESHAPER.V2.
2.  **Phase 2: Human/Identity defense:** We must eliminate long-lived tokens. The Axios compromise succeeded because a single stolen token bypassed every security control. Transitioning to short-lived, OIDC-based automation is an exposure management requirement, not a nice-to-have.
3.  **Phase 3: Counter-recon:** Use **Tenable One** to map your full attack surface, including the [CI/CD pipelines](https://www.tenable.com/cybersecurity-guide/learn/shift-left-security-and-cicd-pipelines) and cloud-native build stages that EDR cannot reach.

## The bottom line

The Axios and Anthropic events are a wake-up call for the C-suite. Theoretical severity and reactive detection (EDR) are insufficient against an adversary that has industrialized the theft of developer identities.

[**Exposure management**](https://www.tenable.com/exposure-management) should be your first and primary line of defense. By identifying and remediating the exposure conditions that supply chain attacks depend on, we can stop the payload before it ever reaches the endpoint.

### Get more information

-   [Read the Tenable Research Special Operations Advisory on the Axios npm Compromise](https://www.tenable.com/blog/faq-about-the-axios-npm-supply-chain-attack-by-north-korea-nexus-threat-actor-unc1069)
-   [Accelerate your preemptive security with Tenable’s agentic engine, Hexa AI](https://www.tenable.com/blog/hexa-ai-agentic-ai-for-exposure-management)
-   [Explore Tenable One for Exposure Management](https://www.tenable.com/products/tenable-one)

_**Join**_ [_**Tenable's Research Special Operations (RSO) Team**_](https://connect.tenable.com/category/news-you-need/discussions/vulnerability-watch) _**on Tenable Connect for further discussions on the latest cyber threats.**_

_**Learn more about**_ [_**Tenable One**_](https://www.tenable.com/products/tenable-one)_**, the Exposure Management Platform for the modern attack surface.**_
