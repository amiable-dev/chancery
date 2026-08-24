# Ringkasan Agent Registry

**Source:** https://docs.cloud.google.com/agent-registry/overview?hl=id
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Mempelajari fitur dan manfaat Agent Registry

---

Agent Registry adalah katalog terpusat yang memungkinkan Anda menyimpan, menemukan, dan mengatur server Model Context Protocol (MCP), alat, kemampuan mandiri, dan agen AI dalam Google Cloud. Agent Registry mewakili pilar tata kelola dan inventaris terpadu agen, server, kemampuan, dan endpoint Anda di [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview?hl=id).

Saat Anda men-deploy dan memperluas kemampuan AI, Agent Registry menyediakan infrastruktur inti untuk lingkungan Anda, yang menyatukan agen otonom dengan konteks dan alat data yang konsisten yang ditawarkan server MCP. Dengan menggabungkan agen, server MCP, kemampuan, dan endpoint ini, Agent Registry mengatasi tantangan umum dalam deployment AI yang kompleks, seperti akses alat yang terfragmentasi, data yang terisolasi, dan penerapan yang berlebihan.

Berdasarkan [model data](https://docs.cloud.google.com/agent-registry/data-model?hl=id) yang digunakan Agent Registry API, Anda mengelola resource `Agent`, `McpServer`, `Endpoint`, `Skill`, `SkillRevision`, dan `Publisher` untuk mendaftarkan, menelusuri, dan mengatur agen, endpoint, server MCP, dan keterampilan di Agent Registry.

## Mengapa menggunakan Agent Registry?

Agent Registry disusun berdasarkan tiga sasaran utama untuk membantu Anda mengelola agen, server MCP, dan endpoint:

-   **Mempercepat pengembangan**: Temukan dan gunakan kembali kemampuan agentic yang ada seperti [keterampilan A2A](https://docs.cloud.google.com/agent-registry/concepts?hl=id#a2a-skill), [keterampilan](https://docs.cloud.google.com/agent-registry/concepts?hl=id#skill) mandiri, dan [alat](https://docs.cloud.google.com/agent-registry/concepts?hl=id#tool) MCP di seluruh organisasi Anda. Anda dapat membuat kueri registri untuk mengidentifikasi dan menggunakan kemampuan yang tersedia, sehingga tidak perlu membuat integrasi kustom untuk setiap proses baru.
-   **Menyederhanakan integrasi**: Gunakan protokol MCP atau Agent2Agent (A2A) standar untuk menemukan dan terhubung ke endpoint fungsional, serta membantu mengurangi overhead pengelolaan infrastruktur.
-   **Mendukung tata kelola**: Terapkan keamanan dan terapkan batasan di seluruh fleet agen Anda. Tentukan izin dan buat pendaftaran identitas terpadu untuk mengontrol agen yang dapat mengakses data Anda, termasuk memusatkan metadata agen di beberapa Google Cloud project untuk tata kelola dengan [Agent Gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview?hl=id).

## Langkah berikutnya

-   Pelajari [model data](https://docs.cloud.google.com/agent-registry/data-model?hl=id) Agent Registry untuk memahami cara mengelola kemampuan agen Anda.
-   Tinjau [konsep utama](https://docs.cloud.google.com/agent-registry/concepts?hl=id) untuk memahami istilah penting yang digunakan dalam Agent Registry.
-   Untuk memulai, [siapkan Agent Registry](https://docs.cloud.google.com/agent-registry/setup?hl=id).
