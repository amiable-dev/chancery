# New Ghostcommit Attack Hides Malicious Prompts in Images to Exploit AI Agents

**Source:** https://cybersecuritynews.com/ghostcommit-attack-hides-prompts/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> A novel supply chain attack called "Ghostcommit" that conceals prompt-injection instructions within PNG images to bypass AI code reviewers and trick coding agents into leaking secrets such as .env files. The ASSET Research Group demonstrated that a pull request containing an explicit, plain-text instruction to exfiltrate a repository's .env

---

A novel supply chain attack called “Ghostcommit” that conceals [prompt-injection instructions](https://cybersecuritynews.com/5-new-prompt-injection-techniques/) within PNG images to bypass AI code reviewers and trick coding agents into leaking secrets such as .env files.

The ASSET Research Group demonstrated that a pull request containing an explicit, plain-text instruction to exfiltrate a repository’s .env file is caught immediately by LLM-based reviewers like Cursor Bugbot and CodeRabbit, which flag the coherent, text-visible exploit as high severity before merge.

To evade this, the researchers split the payload: a harmless-looking AGENTS.md convention file instructs the coding agent to “derive a build constant” from a referenced image, docs/images/build-spec.png, while the actual malicious procedure, reading .env byte by byte and encoding it as ASCII integers, is rendered as text inside the image itself.

Because text-based reviewers treat images as opaque binary blobs, and CodeRabbit’s default configuration explicitly excludes PNG files from review, the entire pull request passes clean, with Bugbot returning no findings at all.

## **Ghostcommit Attack Hides Malicious Prompts**

Nothing is stolen at merge time. The trap activates later when a developer, in an unrelated session, asks the coding agent for an ordinary feature.

The agent reads the merged AGENTS.md, follows the pointer to the image, opens .env, and emits a module-level constant such as \_PROV\_CANARY as a tuple of several hundred integers, which decode byte-for-byte to the entire .env file.

![Ghostcommit Attack Hides Prompts](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4oP79OfU7hFYsM5dgINyunxxLJXZQnbwTlP-RCISwED9U_msrfMOfBvFsUbuRmte2Ou9KiVx4L_ePiP_nGXLrnGepoW9mH2BixYOD6CSJuMcR_2XZQQKMc2w9iaiZMJFd5qSfyQstfoUjkRcuwPxtbXscft3ocXJ89xH1VzxljHGrnAcfQFEa4gJifGJz/s1600/Ghostcommit%20Attack%20Hides%20Malicious%20Prompts1.webp)

Ghostcommit Attack Hides Prompts

[In one demonstrated run](https://asset-group.github.io/disclosures/ghostcommit/), Cursor driving Claude Sonnet produced a 311-integer tuple on the first try, embedding API keys, database URLs, and cloud credentials directly into a code review that looked routine. The attacker simply reads the public commit and converts the integers back into plaintext secrets.

The attack exploits two blind spots simultaneously. The malicious instruction hides inside an image, invisible to human reviewers, regex scanners, and LLM reviewers that only parse the unified text diff.

The stolen secret hides inside an integer tuple, a format no conventional secret scanner recognizes as credential-shaped, since detection tools look for string patterns rather than numeric sequences that decode to ASCII.

Testing across eleven combinations of coding tools and models revealed that outcomes depend more on the surrounding harness than the underlying model. Cursor leaked the full .env across Sonnet 4.6, Composer-2, and GPT-5.5, and Antigravity leaked it across Sonnet, Gemini 3.1 Pro, and Gemini 3 Flash.

Claude Code, however, refused across every model it ran, including Sonnet 4.6, Haiku 4.5, and Opus 4.7, showing that the same Sonnet weights leak under one harness and refuse under another.

In one edge case, Opus under Antigravity computed and wrote the secret, then recognized the social-engineering pattern and deleted it before finishing, a self-correction that never triggered under [Claude Code because](https://cybersecuritynews.com/cyber-ai-agents-hijacked/) Opus never engaged with the convention there.

Researchers built a prototype multimodal GitHub review app, running on a single 4GB GPU using a small open model, Gemma 4, that combines invisible-character detection, code-shape analysis, and LLM passes over both convention text and embedded images.

On a stress test of fifteen attack classes, it caught every malicious pull request with zero false positives, and against eighty unseen real pull requests, it detected 49 of 50 attacks, including every image-channel variant, while flagging none of the thirty benign submissions.

The [proof of concept](https://github.com/asset-group/ghostcommit), including the split-payload pull request and a decoder, has been published as open source for defenders to study.

**Stop Accepting SLAs Written for 2019 SOCs – Here’s the 2026 AI SLA **Vendor** Checklist** – **[Download Free **AI SOC SLA** Guide](https://underdefense.com/ai-soc-sla-in-2026-mttr-benchmarks-clause-tables-negotiation-checklist/?utm_source=cybersecuritynews.com&utm_medium=online_media&utm_campaign=csn_linkedin_newsletter_aisoc_sla_july_2026)**

[![Guru Baran](https://secure.gravatar.com/avatar/72f86da0bb72b6886d25f0ef0c881daba3a98356bc44f916f8d3a62c9e856579?s=96&d=mm&r=g)](https://cybersecuritynews.com/author/guru/ "Guru Baran")

[Guru Baran](https://cybersecuritynews.com/author/guru/)[https://cybersecuritynews.com](https://cybersecuritynews.com/)

Gurubaran KS is a cybersecurity analyst, and Journalist with a strong focus on emerging threats and digital defense strategies. He is the Co-Founder and Editor-in-Chief of Cyber Security News, where he leads editorial coverage on global cybersecurity developments.
