# MCP Security Statistics 2026: CVEs, Vulnerabilities & Breach Data

**Source:** https://www.practical-devsecops.com/mcp-security-statistics-2026-report/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> 97M+ monthly MCP downloads, 82% vulnerable to path traversal, only 8.5% using OAuth. The hard numbers on MCP security risks, CVEs, and agent incidents in 2026.

---

A data-led briefing for developers and security engineers building on the Model Context Protocol.  

## **TL;DR**

-   MCP adoption exploded in 2025 (97M+ monthly SDK downloads, 10,000+ active public servers, first-class client support across ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, and VS Code), but security maturity lagged badly: independent scans repeatedly find 30–82% of public MCP servers carry exploitable flaws, only 8.5% use OAuth, and major CVEs (CVE-2025-6514, CVE-2025-49596, CVE-2025-54136) have already hit hundreds of thousands of developer environments.
-   The threat data is real, not hypothetical: 47–53% of organizations have had AI agents exceed permissions or suffer an incident, HackerOne logged a 540% surge in prompt-injection reports, and Trend Micro found 492 MCP servers exposed to the open internet with zero authentication. 
-   The biggest gap is governance: only ~23% of organizations have a formal AI-agent identity strategy, and only 14.4% of agents reach production with full security approval, even as Gartner predicts MCP-driven incident rates will climb sharply through 2028–2029.

### Certified MCP Security Expert

Attack, defend, and pen test MCP servers in 30+ hands-on labs.

![Certified MCP Security Expert](https://www.practical-devsecops.com/wp-content/uploads/2026/04/cmse-learn-sec-scaled-1.webp)

## **Key Findings (statistics organized by category)**

### **1\. MCP adoption & growth (2025–2026)**

-   **97 million+ monthly SDK downloads** across Python and TypeScript (Anthropic/modelcontextprotocol.io ecosystem update, December 9, 2025). MCP Lead Core Maintainer David Soria Parra summarized it as “over 97 million monthly SDK downloads, 10,000 active servers, and first-class client support across major AI platforms like ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, and Visual Studio Code.”
-   **10,000+ active public MCP servers** (Anthropic, December 9, 2025). An independent May 24, 2026, pull of the official MCP Registry API counted 9,652 latest server records and 28,959 server/version records (Digital Applied, 2026).
-   **15,926 GitHub repositories** carried the mcp-server topic as of May 24, 2026; the reference modelcontextprotocol/servers repo had 86,148 stars (Digital Applied, 2026).
-   Download growth: from ~100,000 (November 2024) to 8 million (April 2025) (Pulse data, cited by mcpevals.io and others, 2025).
-   Vendor adoption timeline: OpenAI (March/April 2025), Google DeepMind (April 2025), Microsoft/GitHub (May 2025). **Anthropic donated MCP to the Agentic AI Foundation (AAIF) under the Linux Foundation on December 9, 2025** (Linux Foundation press release); platinum members include AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, and OpenAI, with Block’s Goose and OpenAI’s AGENTS.md as founding projects.
-   Enterprise: 28% of Fortune 500 companies had deployed MCP servers for production AI workflows by early 2026 (Truto, 2026 – vendor/analyst estimate, treat with caution). Team8’s 2025 CISO Village Survey found 70% of enterprises already run AI agents in production with another 23% planning deployment in 2026.
-   **Deployment reality:** Clutch Security found 86% of MCP servers run locally on developer machines; only 5% run in production environments (Clutch Security, cited by Lenses.io, 2026).

![MCP Growth: SDK Downloads & Active Servers (Nov 2024 - Mid 2026)](https://www.practical-devsecops.com/wp-content/uploads/2026/06/1-1024x614.png)

![MCP Vendor Adoption & Ecosystem Milestone Timeline (2024 -2026)](https://www.practical-devsecops.com/wp-content/uploads/2026/06/2-1024x512.png)

![MCP Vendor Adoption & Ecosystem Milestones](https://www.practical-devsecops.com/wp-content/uploads/2026/06/3-1024x819.png)

![Model Context Protocol (MCP) Growth Metrics (Nov 2024 - Mid 2026)](https://www.practical-devsecops.com/wp-content/uploads/2026/06/4-1024x819.png)

## **2\. MCP-specific vulnerabilities & attack vectors**

**Command injection:** 43% of tested MCP servers vulnerable (Equixly, 2025–Feb 2026 offensive-security assessment  
**Path traversal:** 82% use file operations prone to path traversal across 2,614 MCP implementations (Endor Labs, 2025).

**SSRF:** 36.7% of 7,000+ servers vulnerable (BlueRock Security, 2026); a related Equixly figure put SSRF at 30%. 

**Critical vulnerabilities:** 33% of 1,000 scanned servers had critical vulnerabilities (Enkrypt AI, October 2025).

**Tool poisoning prevalence:** ~5.5% of 1,899 servers showed tool poisoning (Hasan et al. academic study, 2025); an AgentSeal scan of 1,808 servers reported 66% had some security finding. 

**Cross-server cascade:** 72.4% cascade rate when multiple MCP servers are compromised.

**Named attack classes documented in 2025:** tool poisoning, rug pulls (silent redefinition), tool shadowing, cross-server attacks, confused-deputy/OAuth weaknesses, prompt injection / “toxic agent flows,” and the “lethal trifecta” (Simon Willison, April 2025; Invariant Labs, April–May 2025; OWASP MCP Top 10, 2025).

**Note on scanner noise:** one independent audit found a ~78% false-positive rate from YARA-based MCP scanners (AppSec Santa, April 2026) – flag that raw “X% vulnerable” figures vary by methodology.

![MCP Server Vulnerabilities Rates by Vulnerability Class](https://www.practical-devsecops.com/wp-content/uploads/2026/06/5-1024x512.png)

## **3\. CVEs & security advisories tied to MCP**

-   **CVE-2025-6514** (mcp-remote): CVSS 9.6 OS command injection, affecting mcp-remote v0.0.5–0.1.15 (fixed v0.1.16). Discovered by Or Peles of the JFrog Security Research Team and published July 9, 2025; with 437,000+ downloads, it was “the first time that full remote code execution is achieved in a real-world scenario on the client operating system when connecting to an untrusted remote MCP server” (JFrog).
-   **CVE-2025-49596** (Anthropic MCP Inspector): CVSS 9.4 RCE via browser/DNS rebinding + 0.0.0.0; patched in v0.14.1, June 13, 2025 (Oligo Security; Tenable).
-   **CVE-2025-54136 (“MCPoison,” Cursor):** CVSS 7.2 persistent RCE via trusted-but-swapped MCP config; disclosed by Check Point, patched in Cursor 1.3 (July 29, 2025).
-   **CVE-2025-54135 (“CurXecute,” Cursor):** RCE via MCP auto-start prompt injection (Aim Labs, August 2025).
-   **CVE-2025-53110 / CVE-2025-53109** (Filesystem MCP Server): directory containment bypass (CVSS 7.3) and symlink bypass (CVSS 8.4) (Trend Micro, 2025).
-   **Anthropic Git MCP server:** three CVEs (CVE-2025-68143/68144/68145) disclosed January 2026 incl. path traversal and argument injection (Cyata/Dark Reading, 2026).
-   **CVE-2026-33032 (“MCPwn,” nginx-ui MCP):** CVSS 9.8 auth bypass, actively exploited; patched March 15, 2026 (Pluto Security/Recorded Future).
-   **Volume: 30+ CVEs filed against MCP servers in a single 60-day window in early 2026** (multiple researchers; 13 of 30 ≈ 43% were command-injection patterns).

![MCP Security CVSS Key](https://www.practical-devsecops.com/wp-content/uploads/2026/06/6-1024x572.png)

## **4\. Public registries & % audited**

-   Registries: official MCP Registry (~9,652 records, May 2026), plus mcp.so, Smithery, Glama (5,867 verified servers as of June 2025), MCP Market (18,000+ listings cited in academic work).
-   **Credential audit (5,200+ servers, Astrix, October 2025):** 88% require credentials; **53% rely on static API keys/PATs; only 8.5% use OAuth; 79% pass keys via environment variables.** ~20,000 MCP repos exist on GitHub.
-   Exposure: 492 MCP servers exposed to the public internet with zero auth/encryption (Trend Micro, July 2025, “MCP Security: Network-Exposed Servers Are Backdoors to Your Private Data”) – running “without any client authentication or traffic encryption…access to 1,402 MCP tools,” with 90%+ allowing direct read access and 74% hosted on AWS/Azure/GCP/Oracle. A follow-up found the count “nearly tripled to 1,467.
-   No registry publishes a “% security audited” figure; the de-facto answer is that the vast majority are unreviewed. Flag this as a genuine data gap; the closest proxy is CoSAI’s audit scoring 17 MCP servers an average of 34/100 on security (CoSAI, 2026).

![Credential Audit: MCP Server Authentication Methods](https://www.practical-devsecops.com/wp-content/uploads/2026/06/7-1024x559.png)

## **5\. AI agent / agentic security incident data**

**Gartner:** 25% of enterprise breaches will be traced to AI agent abuse by 2028 (Gartner, Oct 2024). Through 2029, >50% of successful attacks on AI agents will exploit access-control issues (Gartner, 2025). 

**Gartner (April 9, 2026):** 25% of enterprise GenAI apps will experience ≥5 minor security incidents/year by 2028 (up from 9% in 2025). Sr. Director Analyst Aaron Lord: “We will eventually see 15% of all enterprise GenAI applications experience at least one major security incident per year by 2029, up from 3% in 2025” ; explicitly tying the rise to MCP.

**IBM X-Force 2026 Threat Index:** 44% increase in attacks beginning with public-facing app exploitation; 40% of incidents from vulnerability exploitation; 300,000+ ChatGPT credentials exposed by infostealers in 2025; supply-chain compromises ~4× since 2020. 

**HiddenLayer 2026 AI Threat Report (250 IT leaders):** autonomous agents now account for >1 in 8 (>12%) reported AI breaches; shadow AI flagged by 76% (up from 61% in 2025).

**Cisco State of AI Security 2026:** only 29% of organizations feel prepared to secure agentic AI.

Only 23% have a formal enterprise-wide agent identity strategy; only 18% are highly confident their IAM can handle agent identities (CSA/Strata, Feb 2026).

88% of organizations reported confirmed or suspected AI agent incidents in the last year (Gravitee 2026); 92.7% in healthcare.

Only 24% of enterprises have a dedicated AI security governance team.

![Agentic AI Security Gap: Confidence Vs Reality](https://www.practical-devsecops.com/wp-content/uploads/2026/06/8-1024x559.png)

### **7\. LLM/AI supply-chain attacks tied to MCP tool/server compromise**

-   **postmark-mcp (npm):** malicious version (~1.0.16) silently BCC’d all processed emails to an external domain (Snyk, September 25, 2025) — first tracked malicious-MCP-server supply-chain incident.
-   **mcp-remote (CVE-2025-6514):** supply-chain RCE across 437,000+ downloaded environments.
-   **GitGuardian:** 24,008 secrets found in MCP-related config files on public GitHub; 2,117 still valid (GitGuardian State of Secrets Sprawl 2026).
-   **OpenClaw/ClawHub agent-skill ecosystem:** Antiy CERT confirmed 1,184 malicious skills; Snyk’s ToxicSkills audit of 3,984 skills found 13.4% contained at least one critical security issue (Snyk/VentureBeat, Feb 2026).
-   **Broader context:** 75% of organizations hit by software supply-chain attacks in a single year (BlackBerry, 2024); third-party breaches = 30% of all breaches (Verizon DBIR 2025).

### **8\. API security stats relevant to MCP (HTTP/SSE + OAuth 2.1)**

-   **99% of organizations encountered API security issues in the past 12 months** (Salt Security Q1 2025, 200+ professionals).
-   **95% of API attacks originated from authenticated sources; 98% targeted external-facing APIs; 80% align with OWASP API Top 10** (Salt Labs, 2025).
-   Only 10% have an API posture-governance strategy (43% plan one within 12 months) (Salt, 2025).
-   98.9% of AI-related vulnerabilities are API-related (Wallarm, 2025); AI vulns grew 398% YoY (Wallarm, 2026).
-   Relevance: MCP’s June 2025 spec separates resource server from authorization server and recommends OAuth 2.1 + PKCE; yet only 8.5% of servers use OAuth (Astrix), so MCP inherits classic API risks. 

### **9\. Bug bounty findings on AI agents / MCP**

-   **HackerOne 9th Annual Hacker-Powered Security Report (Oct 1, 2025):** organizations expanded AI program adoption by 270% while the platform reported a **540% surge in prompt-injection vulnerabilities; “the fastest-growing threat in AI security.”** CEO Kara Sprague: “AI vulnerabilities increased by more than 200% this year.” The report also logged $2.1M+ paid for AI vulns (+339% YoY) and 560+ valid reports from autonomous “hackbots.”
-   **Bugcrowd “Inside the Mind of a Hacker 2026” (Jan 27, 2026):** 82% of hackers now use AI in their workflow (up from 64% in 2023, 77% in 2024); 74% say AI increased the value of hacking.
-   **Anthropic** made its HackerOne bug bounty public (May 2026) with MCP integrations explicitly in scope; a separate Model Safety bounty offers up to $15,000 for universal jailbreaks.
-   **OpenAI** launched a Safety Bug Bounty (March 2026, via Bugcrowd) that explicitly names agentic/MCP risks in scope (dollar pool reported by a third-party aggregator — confirm before citing).
-   **Google AI VRP (Oct 2025):** up to $30,000 per AI report; $890,000 in total AI-related payouts in 2025; note it excludes direct prompt injection/jailbreaks.

## **10\. Developer awareness / survey data on MCP security risk**

**Zuplo State of MCP Report (survey Nov–Dec 2025, ~100 builders):** 50% cite security/access control as their #1 challenge; 38% say security concerns actively block increased adoption; 24–25% of MCP servers have no authentication at all; 58% are wrapping existing APIs. 

**Docker State of Agentic AI (800+ developers):** 46% of teams earlier in their journey name security/compliance the top MCP challenge; 40% cite security as the top blocker to building agents; 85% are familiar with MCP. 

**Sonar 2026 State of Code (1,149 developers, Jan 2026):** 96% don’t fully trust AI-generated code, yet only 48% always verify it.

**Stack Overflow 2025 Developer Survey (49,009 respondents):** 46% actively distrust AI accuracy vs. 33% who trust it; trust in AI accuracy fell to 29% from 40%.

**Snyk:** ~58% of tech decision-makers cite security fears as the biggest concern with AI coding tools; 84% apply the same scrutiny to AI-suggested packages as human-suggested ones (“cognitive dissonance”).

## Conclusion

The data in this report makes one thing clear: MCP adoption moved fast, and security didn’t keep up. Over 97 million monthly SDK downloads, 10,000+ public servers, and Fortune 500 production deployments. But 82% of implementations carry path traversal risks, only 8.5% use OAuth, and 88% of organizations reported confirmed or suspected AI agent incidents last year. Gartner links the coming wave of GenAI security breaches directly to MCP. The exposure is real and it’s already being exploited.

30+ CVEs in a single 60-day window. CVE-2026-33032 at CVSS 9.8, actively exploited. A supply-chain attack that silently BCC’d emails from 437,000+ environments. These aren’t theoretical risks.

The gap right now isn’t awareness. It’s qualified engineers who understand MCP security at a technical level, not just the surface-level talking points.

The **[Certified MCP Security Expert (CMCPSE)](https://www.practical-devsecops.com/certified-mcp-security-expert/)** from Practical DevSecOps is built for security professionals who need to close that gap. It covers MCP attack vectors, tool poisoning, OAuth 2.1 misconfigurations, and agentic threat modeling with hands-on labs. If you’re securing systems that run MCP today, or will within 12 months, this is the certification worth getting first.

### Certified MCP Security Expert

Attack, defend, and pen test MCP servers in 30+ hands-on labs.

![Certified MCP Security Expert](https://www.practical-devsecops.com/wp-content/uploads/2026/04/cmse-learn-sec-scaled-1.webp)
