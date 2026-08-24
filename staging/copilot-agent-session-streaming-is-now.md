# Copilot agent session streaming is now in public preview

**Source:** https://github.blog/changelog/2026-07-03-copilot-agent-session-streaming-is-now-in-public-preview/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> GitHub Enterprise Cloud customers with enterprise managed users can now access GitHub Copilot agent session data across all Copilot clients, including: Cloud agents operating on github.com and data resident deployments…

---

GitHub Enterprise Cloud customers with enterprise managed users can now access GitHub Copilot agent session data across all Copilot clients, including:

-   Cloud agents operating on github.com and data resident deployments on ghe.com
-   GitHub Copilot CLI
-   Visual Studio Code
-   Visual Studio
-   Partner IDEs, such as those provided by JetBrains and Eclipse

This gives you direct visibility into agent session activity (e.g., prompts, responses, and tool calls) so you can manage AI usage across your enterprise. You can choose to access this data via a streaming endpoint or the REST API. To enable this, go to the Copilot subpage in AI Controls and select **Enable everywhere** for both “Copilot Usage Records Streaming” and “Copilot Usage Records API”.

![A screen grab of the Enable Copilot Usage Records Streaming and Copilot Usage Records API settings from the Metrics section under Copilot in AI Controls. Each setting has an associated combo box with "Enable everywhere" selected in both boxes.](https://github.com/user-attachments/assets/b9915cc7-d37d-4641-a8ae-bfc1e05b2e52)

### [Streaming endpoint](#streaming-endpoint)

You can initiate a streaming connection to an event collector or SIEM tool of your choice from your audit log settings. Once configured, GitHub automatically streams all session data for your enterprise to that endpoint. Microsoft Purview is also available as a supported streaming endpoint in public preview, giving customers in the Microsoft ecosystem a direct pathway to send auditability data from all GitHub Copilot clients. For more information, see [our documentation on setting up audit log streaming](https://docs.github.com/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise#setting-up-audit-log-streaming).

### [REST API](#rest-api)

The REST API lets enterprise owners pull the last 48 hours of session data on demand using this endpoint:

-   `GET /enterprises/{enterprise}/copilot/usage-records`: Retrieve Copilot usage records for an enterprise.

To learn more, read the [Copilot Usage Records REST API documentation](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise).
