# REST API endpoints for Copilot usage metrics - GitHub Enterprise Cloud Docs

**Source:** https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Use the REST API to view Copilot usage metrics.

---

Use the REST API to view Copilot usage metrics.

To enable these endpoints, the "Copilot usage metrics" policy must be set to **Enabled everywhere** for the enterprise. See [Managing policies and features for GitHub Copilot in your enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies#defining-policies-for-your-enterprise).

For more information on the metrics returned by these endpoints, see [GitHub Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/copilot-usage-metrics).

## [Get Copilot enterprise usage metrics for a specific day](#get-copilot-enterprise-usage-metrics-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot enterprise usage metrics report for a specific day. The report provides comprehensive usage data for Copilot features across the enterprise.

The report contains aggregated metrics for the specified day, including usage statistics for various Copilot features, user engagement data, and feature adoption metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed. Reports are available starting from October 10, 2025, and historical data can be accessed for up to 1 year from the current date.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot enterprise usage metrics for a specific day"](#get-copilot-enterprise-usage-metrics-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot enterprise usage metrics for a specific day"](#get-copilot-enterprise-usage-metrics-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot enterprise usage metrics for a specific day"](#get-copilot-enterprise-usage-metrics-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot enterprise usage metrics for a specific day"](#get-copilot-enterprise-usage-metrics-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/enterprise-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/enterprise-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot enterprise usage metrics](#get-copilot-enterprise-usage-metrics)

Use this endpoint to retrieve download links for the latest 28-day enterprise Copilot usage metrics report. The report provides comprehensive usage data for Copilot features across the enterprise.

The report contains aggregated metrics for the previous 28 days, including usage statistics for various Copilot features, user engagement data, and feature adoption metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date range covered by the report. The report covers a complete 28-day period ending on the most recent day for which data has been processed.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot enterprise usage metrics"](#get-copilot-enterprise-usage-metrics--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot enterprise usage metrics"](#get-copilot-enterprise-usage-metrics--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

### [HTTP response status codes for "Get Copilot enterprise usage metrics"](#get-copilot-enterprise-usage-metrics--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot enterprise usage metrics"](#get-copilot-enterprise-usage-metrics--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/enterprise-28-day/latest

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/enterprise-28-day/latest`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_start_day": "2025-07-01", "report_end_day": "2025-07-28" }`

## [Get Copilot enterprise repository report for a specific day](#get-copilot-enterprise-repository-report-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot enterprise repository report for a specific day. The report provides per-repository pull request metrics for Copilot across the enterprise, with one entry per repository.

The report contains repository-level pull request activity for the specified day, including the Copilot Coding Agent (CCA) and Copilot Code Review (CCR) breakdowns. Only repositories that had activity on the specified day are included. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot enterprise repository report for a specific day"](#get-copilot-enterprise-repository-report-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot enterprise repository report for a specific day"](#get-copilot-enterprise-repository-report-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot enterprise repository report for a specific day"](#get-copilot-enterprise-repository-report-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`204`

A header with no content is returned.

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot enterprise repository report for a specific day"](#get-copilot-enterprise-repository-report-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/repos-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/repos-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot enterprise user-teams report for a specific day](#get-copilot-enterprise-user-teams-report-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot enterprise user-teams report for a specific day. The report provides user-team join data for Copilot across the enterprise, with one entry per user-team pair.

The report contains user-team membership data for the specified day, enabling consumers to join with the existing enterprise user reports to compute team-level usage metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot enterprise user-teams report for a specific day"](#get-copilot-enterprise-user-teams-report-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot enterprise user-teams report for a specific day"](#get-copilot-enterprise-user-teams-report-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot enterprise user-teams report for a specific day"](#get-copilot-enterprise-user-teams-report-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot enterprise user-teams report for a specific day"](#get-copilot-enterprise-user-teams-report-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/user-teams-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/user-teams-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot users usage metrics for a specific day](#get-copilot-users-usage-metrics-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot user usage metrics report for a specific day. The report provides detailed user-level usage data and engagement metrics for Copilot features across the enterprise.

The report contains user-specific metrics for the specified day, including individual user engagement statistics, feature usage patterns, and adoption metrics broken down by user. This report allows authorized users to analyze Copilot usage at the user level to understand adoption patterns and identify opportunities for increased engagement.

Reports are generated daily and made available for download through signed URLs with a limited expiration time. The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed. Reports are available starting from October 10, 2025, and historical data can be accessed for up to 1 year from the current date.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot users usage metrics for a specific day"](#get-copilot-users-usage-metrics-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot users usage metrics for a specific day"](#get-copilot-users-usage-metrics-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot users usage metrics for a specific day"](#get-copilot-users-usage-metrics-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot users usage metrics for a specific day"](#get-copilot-users-usage-metrics-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/users-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/users-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot users usage metrics](#get-copilot-users-usage-metrics)

Use this endpoint to retrieve download links for the latest 28-day enterprise users Copilot usage metrics report. The report provides detailed user-level usage data and engagement metrics for Copilot features across the enterprise.

The report contains user-specific metrics for the previous 28 days, including individual user engagement statistics, feature usage patterns, and adoption metrics broken down by user. This report allows authorized users to analyze Copilot usage at the user level to understand adoption patterns and identify opportunities for increased engagement.

Reports are generated daily and made available for download through signed URLs with a limited expiration time. The response includes download links to the report files, along with the specific date range covered by the report. The report covers a complete 28-day period ending on the most recent day for which data has been processed.

Enterprise owners, billing managers, and authorized users with fine-grained "View Enterprise Copilot Metrics" permission can retrieve Copilot metrics reports for the enterprise. OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot` or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot users usage metrics"](#get-copilot-users-usage-metrics--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have the following permission set:

-   "Enterprise Copilot metrics" enterprise permissions (read)

### [Parameters for "Get Copilot users usage metrics"](#get-copilot-users-usage-metrics--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

### [HTTP response status codes for "Get Copilot users usage metrics"](#get-copilot-users-usage-metrics--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot users usage metrics"](#get-copilot-users-usage-metrics--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/metrics/reports/users-28-day/latest

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ https://api.github.com/enterprises/ENTERPRISE/copilot/metrics/reports/users-28-day/latest`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_start_day": "2025-07-01", "report_end_day": "2025-07-28" }`

## [Get Copilot usage records for an enterprise](#get-copilot-usage-records-for-an-enterprise)

Note

This endpoint is in public preview and is subject to change.

Use this endpoint to retrieve Copilot agent session activity records for a specific enterprise. The endpoint provides comprehensive observability into Copilot session data across your enterprise.

The response includes detailed usage records aggregated and forwarded from all Copilot clients where your end users operate under enterprise-paid Copilot licenses. This includes cloud agents operating on github.com and data resident deployments on ghe.com, Copilot CLI, VS Code, Visual Studio, and partner IDEs such as those provided by JetBrains and Eclipse.

Only EMU (GHEC and GHEC with Data Residency) enterprise owners can access this endpoint.

OAuth app tokens and personal access tokens (classic) need the `read:enterprise` scope to use this endpoint.

### [Fine-grained access tokens for "Get Copilot usage records for an enterprise"](#get-copilot-usage-records-for-an-enterprise--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

The fine-grained token must have at least one of the following permission sets:

-   "Copilot usage records" enterprise permissions (read)
-   "Enterprise administration" enterprise permissions (read)

### [Parameters for "Get Copilot usage records for an enterprise"](#get-copilot-usage-records-for-an-enterprise--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`enterprise` string Required

The slug version of the enterprise name.

Query parameters

Name, Type, Description

`phrase` string

A search phrase to filter usage records. Supported qualifiers: `type` (request/response), `user_id`, `created`.

`per_page` integer

The number of results per page (max 25). Values are clamped to the range `[1, 25]`.

Default: `25`

`after` string

A cursor, as given in the [Link header](https://docs.github.com/enterprise-cloud@latest/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for events after this cursor.

`before` string

A cursor, as given in the [Link header](https://docs.github.com/enterprise-cloud@latest/rest/guides/using-pagination-in-the-rest-api#using-link-headers). If specified, the query only searches for events before this cursor.

`order` string

The order of audit log events. To list newest events first, specify `desc`. To list oldest events first, specify `asc`.

The default is `desc`.

Can be one of: `desc`, `asc`

### [HTTP response status codes for "Get Copilot usage records for an enterprise"](#get-copilot-usage-records-for-an-enterprise--status-codes)

Status code

Description

`200`

OK

`400`

Bad Request

`403`

Forbidden

`404`

Resource not found

`422`

Validation failed, or the endpoint has been spammed.

### [Code samples for "Get Copilot usage records for an enterprise"](#get-copilot-usage-records-for-an-enterprise--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/enterprises/{enterprise}/copilot/usage-records

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ https://api.github.com/enterprises/ENTERPRISE/copilot/usage-records`

#### 

Response

`Status: 200`

`[ { "type": "request", "user_id": 12345, "enterprise_id": 1, "github_request_id": "req-abc-123", "endpoint": "/chat/completions", "body": "{\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}", "@timestamp": 1719600000000 }, { "type": "response", "user_id": 12345, "enterprise_id": 1, "github_request_id": "req-abc-123", "endpoint": "/chat/completions", "body": "{\"choices\":[{\"message\":{\"content\":\"Hi there!\"}}]}", "@timestamp": 1719600000500 } ]`

## [Get Copilot organization usage metrics for a specific day](#get-copilot-organization-usage-metrics-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot organization usage metrics report for a specific day. The report provides comprehensive usage data for Copilot features across the organization.

The report contains aggregated metrics for the specified day, including usage statistics for various Copilot features, user engagement data, and feature adoption metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization usage metrics for a specific day"](#get-copilot-organization-usage-metrics-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization usage metrics for a specific day"](#get-copilot-organization-usage-metrics-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot organization usage metrics for a specific day"](#get-copilot-organization-usage-metrics-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`204`

A header with no content is returned.

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization usage metrics for a specific day"](#get-copilot-organization-usage-metrics-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/organization-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/orgs/ORG/copilot/metrics/reports/organization-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot organization usage metrics](#get-copilot-organization-usage-metrics)

Use this endpoint to retrieve download links for the latest 28-day organization Copilot usage metrics report. The report provides comprehensive usage data for Copilot features across the organization.

The report contains aggregated metrics for the previous 28 days, including usage statistics for various Copilot features, user engagement data, and feature adoption metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date range covered by the report. The report covers a complete 28-day period ending on the most recent day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization usage metrics"](#get-copilot-organization-usage-metrics--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization usage metrics"](#get-copilot-organization-usage-metrics--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

### [HTTP response status codes for "Get Copilot organization usage metrics"](#get-copilot-organization-usage-metrics--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization usage metrics"](#get-copilot-organization-usage-metrics--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/organization-28-day/latest

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ https://api.github.com/orgs/ORG/copilot/metrics/reports/organization-28-day/latest`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_start_day": "2025-07-01", "report_end_day": "2025-07-28" }`

## [Get Copilot organization repository report for a specific day](#get-copilot-organization-repository-report-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot organization repository report for a specific day. The report provides per-repository pull request metrics for Copilot across the organization, with one entry per repository.

The report contains repository-level pull request activity for the specified day, including the Copilot Coding Agent (CCA) and Copilot Code Review (CCR) breakdowns. Only repositories that had activity on the specified day are included. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization repository report for a specific day"](#get-copilot-organization-repository-report-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization repository report for a specific day"](#get-copilot-organization-repository-report-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot organization repository report for a specific day"](#get-copilot-organization-repository-report-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`204`

A header with no content is returned.

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization repository report for a specific day"](#get-copilot-organization-repository-report-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/repos-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/orgs/ORG/copilot/metrics/reports/repos-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot organization user-teams report for a specific day](#get-copilot-organization-user-teams-report-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot organization user-teams report for a specific day. The report provides user-team join data for Copilot across the organization, with one entry per user-team pair.

The report contains user-team membership data for the specified day, enabling consumers to join with the existing organization user reports to compute team-level usage metrics. Reports are generated daily and made available for download through signed URLs with a limited expiration time.

The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization user-teams report for a specific day"](#get-copilot-organization-user-teams-report-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization user-teams report for a specific day"](#get-copilot-organization-user-teams-report-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot organization user-teams report for a specific day"](#get-copilot-organization-user-teams-report-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`204`

A header with no content is returned.

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization user-teams report for a specific day"](#get-copilot-organization-user-teams-report-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/user-teams-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/orgs/ORG/copilot/metrics/reports/user-teams-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot organization users usage metrics for a specific day](#get-copilot-organization-users-usage-metrics-for-a-specific-day)

Use this endpoint to retrieve download links for the Copilot organization user usage metrics report for a specific day. The report provides detailed user-level usage data and engagement metrics for Copilot features across the organization.

The report contains user-specific metrics for the specified day, including individual user engagement statistics, feature usage patterns, and adoption metrics broken down by user. This report allows authorized users to analyze Copilot usage at the user level to understand adoption patterns and identify opportunities for increased engagement.

Reports are generated daily and made available for download through signed URLs with a limited expiration time. The response includes download links to the report files, along with the specific date of the report. The report covers a complete day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization users usage metrics for a specific day"](#get-copilot-organization-users-usage-metrics-for-a-specific-day--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization users usage metrics for a specific day"](#get-copilot-organization-users-usage-metrics-for-a-specific-day--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

Query parameters

Name, Type, Description

`day` string Required

The day to request data for, in `YYYY-MM-DD` format.

### [HTTP response status codes for "Get Copilot organization users usage metrics for a specific day"](#get-copilot-organization-users-usage-metrics-for-a-specific-day--status-codes)

Status code

Description

`200`

OK

`204`

A header with no content is returned.

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization users usage metrics for a specific day"](#get-copilot-organization-users-usage-metrics-for-a-specific-day--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/users-1-day

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ "https://api.github.com/orgs/ORG/copilot/metrics/reports/users-1-day?day=DAY"`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_day": "2025-07-01" }`

## [Get Copilot organization users usage metrics](#get-copilot-organization-users-usage-metrics)

Use this endpoint to retrieve download links for the latest 28-day organization users Copilot usage metrics report. The report provides detailed user-level usage data and engagement metrics for Copilot features across the organization.

The report contains user-specific metrics for the previous 28 days, including individual user engagement statistics, feature usage patterns, and adoption metrics broken down by user. This report allows authorized users to analyze Copilot usage at the user level to understand adoption patterns and identify opportunities for increased engagement.

Reports are generated daily and made available for download through signed URLs with a limited expiration time. The response includes download links to the report files, along with the specific date range covered by the report. The report covers a complete 28-day period ending on the most recent day for which data has been processed.

Organization owners and authorized users with fine-grained "View Organization Copilot Metrics" permission can retrieve Copilot metrics reports for the organization. OAuth app tokens and personal access tokens (classic) need the `read:org` scope to use this endpoint.

For more information about organization metrics attribution, see [How are metrics attributed across organizations](https://docs.github.com/enterprise-cloud@latest/copilot/concepts/copilot-metrics#how-are-metrics-attributed-across-organizations).

### [Fine-grained access tokens for "Get Copilot organization users usage metrics"](#get-copilot-organization-users-usage-metrics--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

-   [GitHub App user access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
-   [GitHub App installation access tokens](https://docs.github.com/en/enterprise-cloud@latest/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
-   [Fine-grained personal access tokens](https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have the following permission set:

-   "Organization Copilot metrics" organization permissions (read)

### [Parameters for "Get Copilot organization users usage metrics"](#get-copilot-organization-users-usage-metrics--parameters)

Headers

Name, Type, Description

`accept` string

Setting to `application/vnd.github+json` is recommended.

Path parameters

Name, Type, Description

`org` string Required

The organization name. The name is not case sensitive.

### [HTTP response status codes for "Get Copilot organization users usage metrics"](#get-copilot-organization-users-usage-metrics--status-codes)

Status code

Description

`200`

OK

`403`

Forbidden

`404`

Resource not found

`500`

Internal Error

### [Code samples for "Get Copilot organization users usage metrics"](#get-copilot-organization-users-usage-metrics--code-samples)

If you access GitHub at GHE.com, replace `api.github.com` with your enterprise's dedicated subdomain at `api.SUBDOMAIN.ghe.com`.

#### Request example

get/orgs/{org}/copilot/metrics/reports/users-28-day/latest

`curl -L \ -H "Accept: application/vnd.github+json" \ -H "Authorization: Bearer <YOUR-TOKEN>" \ -H "X-GitHub-Api-Version: 2026-03-10" \ https://api.github.com/orgs/ORG/copilot/metrics/reports/users-28-day/latest`

#### 

Response

`Status: 200`

`{ "download_links": [ "https://example.com/copilot-usage-report-1.ndjson", "https://example.com/copilot-usage-report-2.ndjson" ], "report_start_day": "2025-07-01", "report_end_day": "2025-07-28" }`
