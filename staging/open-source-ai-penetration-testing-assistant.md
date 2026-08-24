# METATRON - Open-Source AI Penetration Testing Assistant Brings Local LLM Analysis to Linux

**Source:** https://cybersecuritynews.com/metatron-ai-penetration-testing/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A new open-source penetration testing framework called METATRON is gaining attention in the security research community for its fully offline, AI-driven approach to vulnerability assessment. Built for Parrot OS and other Debian-based Linux distributions, METATRON combines automated reconnaissance tooling with a locally hosted large language model (LLM), eliminating the

---

A new open-source penetration testing framework called METATRON is gaining attention in the security research community for its fully offline, AI-driven approach to vulnerability assessment.

Built for Parrot OS and other Debian-based Linux distributions, METATRON combines automated reconnaissance tooling with a locally hosted large language model (LLM), eliminating the need for cloud connectivity, API keys, or third-party subscriptions.

METATRON is a CLI-based penetration testing assistant written in Python 3 that accepts a target IP address or domain and autonomously orchestrates a suite of standard reconnaissance tools.

These include nmap for port scanning, [nikto for web server vulnerability detection](https://cybersecuritynews.com/kali-linux-ai-driven-penetration-testing/), whois and dig for DNS and registration data, whatweb for technology fingerprinting, and curl for HTTP header inspection.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjkjs2nlGTipce3hOJwb1dJttbU3o8c1s39e6xP0bfDCy9LR-l51bFiMgzdnmPwP9c3aI7y0uSIbMBrM0fp1IdBAi8dWVHrA3E5WwiRQIClsq-RngyyqS89PNAT9uR2r-GWZVQr2wtnjTUqECenpvfhX6HFr7i1DkhUMjqZeGj9ckEaP5AoQgtZVwRhVoK-/s16000/METATRON%20AI%20Penetration%20Testing%20menu.webp)

Tool Scan Process

Once recon data is collected, all results are piped directly into a locally running AI model — metatron-qwen — a fine-tuned variant of the `huihui_ai/qwen3.5-abliterated:9b` base model, customized specifically for [penetration testing analysis](https://cybersecuritynews.com/autopentestx-penetration-testing-toolkit/).

The model is served via Ollama, a local LLM runner, and is configured with a 16,384-token context window, a temperature of 0.7, top-k of 10, and top-p of 0.9 — parameters optimized for precise, technically grounded security analysis rather than creative generation.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhm3QWTMBGxqnNOLmZMywxamvOXXAJHU6JdK_H6IApnTHLgxoR-0wmFway97IE15eJnsY_odRbeRUc926aDjDmep2iA32LT5p6ShemP9Zg1dXqyWqes8OonSOpYzo-XbsHW6HHB1W9OUvEV5GB8sr4Z8CvT90RiLCoecu2lcQKJufpi_-M3eJYQs6uY4i3O/s16000/METATRON%20AI%20Penetration%20Testing%20Scan.webp)

Scan Using nmap and other tools

## **Agentic Loop and CVE Integration**

One of METATRON’s more technically notable features is its agentic loop: the AI model can autonomously request additional tool executions mid-analysis if it determines more data is needed before rendering a verdict. This enables a dynamic, iterative assessment workflow rather than a single static scan pass.

The framework also integrates DuckDuckGo-based web search and CVE lookups without requiring any API credentials, allowing the model to cross-reference discovered services and versions against known public vulnerability databases in real time.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjClJISpR7iQ8r5FRr3QIXR9GMlxtqdEasY0hsFEHl41q5CsixLicHNKQDfNK9PJ31dG2LmGOzepKZigdTfF3O_lDdsKCBLZpaWzovi0PftiOTAYOFWWZT9KAdcRUtYkAykKKdAkSUX8RZDZTVMSQtv49V_XHWIPJRutW_yW9OrATTmCbyAQeYKEuu5NmVI/s16000/METATRON%20AI%20Penetration%20Testing%20CVE.webp)

Web Search and CVE Lookup

METATRON uses a five-table MariaDB schema to persist all scan data, structured around a central `history` table keyed by session number (`sl_no`). Linked tables store discovered vulnerabilities with severity ratings, recommended fixes sourced from AI analysis, attempted exploits with payloads and results, and a full summary table containing raw scan output alongside the complete AI analysis dump and overall risk level.

Users can edit or delete any saved record directly from the CLI, and export reports in PDF or HTML format for documentation or client delivery — a critical feature for professional penetration testers who need audit trails.

The project’s most significant differentiator in the current AI tooling landscape is its zero-exfiltration guarantee. All LLM inference happens on-device through Ollama, meaning sensitive target data, including internal IP ranges, banner information, and discovered vulnerabilities, never leaves the tester’s machine. This positions METATRON as a viable option for engagements with strict data handling requirements.

METATRON is available on GitHub under the MIT License at [github.com/sooryathejas/METATRON](https://github.com/sooryathejas/METATRON), with minimum hardware requirements of 8.4 GB RAM for the 9b model variant.

**Reduce MTTR and accelerate your SOC performance with actionable Threat Intelligence from 15K organizations. **[Integrate ANY.RUN’s TI](https://any.run/plans-ti/?utm_source=csn&utm_medium=article&utm_campaign=big+ti&utm_content=plans+ti+sales&utm_term=070426#contact-sales)**** 

[![Guru Baran](https://secure.gravatar.com/avatar/72f86da0bb72b6886d25f0ef0c881daba3a98356bc44f916f8d3a62c9e856579?s=96&d=mm&r=g)](https://cybersecuritynews.com/author/guru/ "Guru Baran")

[Guru Baran](https://cybersecuritynews.com/author/guru/)[https://cybersecuritynews.com](https://cybersecuritynews.com/)

Gurubaran KS is a cybersecurity analyst, and Journalist with a strong focus on emerging threats and digital defense strategies. He is the Co-Founder and Editor-in-Chief of Cyber Security News, where he leads editorial coverage on global cybersecurity developments.
