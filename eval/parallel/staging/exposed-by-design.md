# Exposed by Design: A Dynamic Security Assessment of Internet-Facing MCP Servers at Scale

**Source:** https://arxiv.org/abs/2608.00150
**Added:** 2026-08-24
**Tags:** #unsorted

---

> The Model Context Protocol (MCP) has seen rapid adoption since its November 2024 launch, with over 21,000 server instances detectable on the public internet. We present the first dynamic behavioral security assessment of internet-facing MCP servers, combining passive discovery across eleven data sources (crt.sh, HuggingFace, GitHub, npm, Smithery, PyPI, Censys, FOFA, Shodan, glama.ai, and pulsemcp.com) with active dynamic testing using Corvus, a purpose-built framework implementing 34 test modules covering 10 MCP-specific vulnerability classes. Across four measurement runs spanning July 2026, we confirm 640 production MCP servers and dynamically audit 414, uncovering 68 reportable vulnerabilities including SQL injection, SSRF targeting cloud metadata services, prompt template injection, and path traversal via cursor manipulation. We find that 91.8% of dynamically audited servers lack OAuth authentication, 687 tool instances across confirmed servers expose shell execution capabilities without access controls, and 41.6% of confirmed servers disappear within three days between consecutive measurement runs---indicating rapid deployment cycles without security review. We report on our responsible disclosure pipeline and release Corvus as an open-source framework for MCP security evaluation.

---

[View PDF](https://arxiv.org/pdf/2608.00150) [HTML (experimental)](https://arxiv.org/html/2608.00150v1)

> Abstract:The Model Context Protocol (MCP) has seen rapid adoption since its November 2024 launch, with over 21,000 server instances detectable on the public internet. We present the first dynamic behavioral security assessment of internet-facing MCP servers, combining passive discovery across eleven data sources ([this http URL](http://crt.sh/), HuggingFace, GitHub, npm, Smithery, PyPI, Censys, FOFA, Shodan, [this http URL](http://glama.ai/), and [this http URL](http://pulsemcp.com/)) with active dynamic testing using Corvus, a purpose-built framework implementing 34 test modules covering 10 MCP-specific vulnerability classes. Across four measurement runs spanning July 2026, we confirm 640 production MCP servers and dynamically audit 414, uncovering 68 reportable vulnerabilities including SQL injection, SSRF targeting cloud metadata services, prompt template injection, and path traversal via cursor manipulation. We find that 91.8% of dynamically audited servers lack OAuth authentication, 687 tool instances across confirmed servers expose shell execution capabilities without access controls, and 41.6% of confirmed servers disappear within three days between consecutive measurement runs---indicating rapid deployment cycles without security review. We report on our responsible disclosure pipeline and release Corvus as an open-source framework for MCP security evaluation.

Comments:

13 pages, 3 figures

Subjects:

Cryptography and Security (cs.CR); Artificial Intelligence (cs.AI)

Cite as:

[arXiv:2608.00150](https://arxiv.org/abs/2608.00150) \[cs.CR\]

 

(or [arXiv:2608.00150v1](https://arxiv.org/abs/2608.00150v1) \[cs.CR\] for this version)

 

[https://doi.org/10.48550/arXiv.2608.00150](https://doi.org/10.48550/arXiv.2608.00150)

arXiv-issued DOI via DataCite

## Submission history

From: Nicolas Padilla \[[view email](https://arxiv.org/show-email/bb9b01dd/2608.00150)\]  
**\[v1\]** Fri, 31 Jul 2026 16:46:19 UTC (29 KB)
