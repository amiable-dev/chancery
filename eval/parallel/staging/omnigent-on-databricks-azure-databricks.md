# Omnigent on Databricks - Azure Databricks

**Source:** https://learn.microsoft.com/en-us/azure/databricks/omnigent/
**Added:** 2026-08-24
**Tags:** #unsorted

---

> Omnigent on Databricks is a managed meta-harness for composing, governing, and collaborating on agents on top of harnesses like Claude Code and Codex.

---

Omnigent provides a common layer over Claude Code, Codex, Cursor, Pi, and the agents you write yourself: swap or combine harnesses without rewriting, keep them in check with policies and sandboxing, and collaborate in real time on the same live session, from any device. Define an agent in a short YAML file, then swap one line to change its harness or model while your tools, prompts, skills, and policies stay the same.

![Animated overview of the Omnigent workspace UI on Databricks.](https://learn.microsoft.com/en-us/azure/databricks/_static/images/omnigent/omnigent-carousel.gif)

Azure Databricks provides a fully managed version of Omnigent, including:

-   A Azure Databricks-operated Omnigent server that integrates with your workspace's identity provider.
-   Model access through the [Foundation Model APIs](https://learn.microsoft.com/en-us/azure/databricks/machine-learning/foundation-model-apis/) and [AI Gateway](https://learn.microsoft.com/en-us/azure/databricks/ai-gateway/).

Omnigent is an open source project. For complete documentation, including concepts, harnesses, custom agents, interfaces, policies, and sandboxes, see the [Omnigent documentation](https://omnigent.ai/).

## Get started

To set up Omnigent against your workspace and launch your first agent, see the [Omnigent quickstart](https://learn.microsoft.com/en-us/azure/databricks/omnigent/quickstart).

## Availability

-   Omnigent requires the **Omnigent** preview enabled for your workspace. See [Manage workspace-level previews](https://learn.microsoft.com/en-us/azure/databricks/admin/workspace-settings/manage-previews#workspace).
-   Omnigent requires a workspace in a region that supports Databricks Unity AI Gateway. See [Databricks feature availability by region](https://learn.microsoft.com/en-us/azure/databricks/resources/feature-region-support).

## Limitations

-   Omnigent on Azure Databricks only supports the [built-in contextual policies](https://omnigent.ai/docs/policies/builtin) as policy handlers. [Custom policy functions](https://omnigent.ai/docs/policies/custom) that run arbitrary code are not supported.
-   Native Windows support is not available. For now, run Omnigent inside [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows Subsystem for Linux) and follow the Linux instructions from your WSL2 distribution.
