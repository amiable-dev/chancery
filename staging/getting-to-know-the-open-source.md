# Getting to know the Open Source Vulnerability (OSV) format – Open Source Security Foundation

**Source:** https://openssf.org/blog/2023/05/02/getting-to-know-the-open-source-vulnerability-osv-format/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> By Oliver Chang, Google Open Source Security Team and Kate Catlin, GitHub Advisory Database Team

---

By Oliver Chang, Google Open Source Security Team and Kate Catlin, GitHub Advisory Database Team

To keep the modern technological world of open source software safe, it is critical to efficiently and accurately communicate information about open source vulnerabilities. Unfortunately, many existing vulnerability standards were designed for a broader set of software and when they are applied to our open source world, they’re clunky and can’t match the speed at which many communities work at. Imagine a widely adopted project is at critical risk—at that moment, can we afford inefficiency or lossy information models? 

The [OSV Schema](https://ossf.github.io/osv-schema/), created through the collaboration between OpenSSF members and housed within the [Vulnerability Disclosures Working Group](https://github.com/ossf/wg-vulnerability-disclosures), solves this problem. It provides a minimal, easy-to-use first class JSON format for describing vulnerabilities in open source software.  Each OSV advisory uses git commit hashes or package manager versions to describe vulnerabilities, which are familiar concepts for open source users and provide precise information on exactly what is vulnerable. The goal is to make both the production and consumption of open source advisories simple and precise.

OSV started as a way to communicate about vulnerabilities found through fuzzing open source projects using the [OSS-Fuzz service](https://github.com/google/oss-fuzz). After extensive collaboration and feedback from open source communities, the OSV Schema was [announced in 2021](https://security.googleblog.com/2021/06/announcing-unified-vulnerability-schema.html) and shortly after became an OpenSSF project. Since that time, it has seen significant adoption including services (GitHub Security Advisories), several language ecosystems (Rust, Go, Python), and Linux distributions (Rocky Linux). In total, OSV has been adopted by [18 ecosystems](https://github.com/ossf/osv-schema#open-source-vulnerability-schema) and [44,000](https://osv.dev/list) advisories are written in the format. Additionally, it’s been adopted by client tooling such as [Renovate](https://github.com/renovatebot/renovate), [OWASP Dependency-Track](https://owasp.org/www-project-dependency-check/), and [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck). OSV’s schema for describing affected version ranges has also directly informed the upcoming [CVE 5.0 standard](https://github.com/CVEProject/cve-schema/blob/master/schema/v5.0/docs/versions.md). 

OSV’s industry-wide collaboration enables an open, distributed model for managing vulnerabilities in open source–much like how open source software itself is developed! To read more about how OSV works with other vulnerability identifier standards, read [this blog](https://security.googleblog.com/2023/03/osv-and-vulnerability-life-cycle.html).

The GitHub Security Advisory Database is one example of this collaborative effort. In 2022, GitHub opened up an [open source repository of CVEs](https://github.com/github/advisory-database) formatted with the OSV schema and [welcomed the community to contribute](https://github.blog/2022-02-22-github-advisory-database-now-open-to-community-contributions/) via pull requests. They’ve since had over [1,800 proposed edits](https://github.com/github/advisory-database/pulls), each one making the information more complete and the community safer. The GitHub Security Advisory Database powers Dependabot, but by republishing the data in the OSV format the information becomes available beyond just Dependabot users. GitHub uses OSV because open, machine readable vulnerability data is critical to the security (and therefore, the success) of open source communities.

We look forward to further community adoption, whether through tools built on top of OSV, contributions of vulnerability information, or new vulnerability databases leveraging the OSV schema. Check out [OSV.dev](https://osv.dev/) for an aggregated list of all advisories from OSV sources and the list of tools and databases using OSV at [https://github.com/ossf/osv-schema](https://github.com/ossf/osv-schema)! If you’re maintaining a vulnerability database and would like to contribute OSV support and have questions, please [file an issue](https://github.com/ossf/osv-schema/issues/new) in our repo!
