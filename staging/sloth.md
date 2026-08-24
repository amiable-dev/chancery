# GitHub - slok/sloth: 🦥 Easy and simple Prometheus SLO (service level objectives) generator

**Source:** https://github.com/slok/sloth
**Added:** 2026-08-24
**Tags:** #unsorted

---

> 🦥 Easy and simple Prometheus SLO (service level objectives) generator - slok/sloth

---

[![sloth](https://github.com/slok/sloth/raw/main/docs/img/logo.png)](https://github.com/slok/sloth/blob/main/docs/img/logo.png)

[![CI](https://github.com/slok/sloth/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/slok/sloth/actions/workflows/ci.yaml) [![Go Report Card](https://camo.githubusercontent.com/f50792d149124e7e52fdb48dad234f8e052b3aff3e6b977afcc27569e723e997/68747470733a2f2f676f7265706f7274636172642e636f6d2f62616467652f6769746875622e636f6d2f736c6f6b2f736c6f7468)](https://goreportcard.com/report/github.com/slok/sloth) [![Apache 2 licensed](https://camo.githubusercontent.com/ce33a3fd6ab20839ed6f66e2bd9949372da1afd984bb0fc1c773f21f2c8b02f2/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d417061636865322d626c75652e737667)](https://raw.githubusercontent.com/slok/sloth/master/LICENSE) [![GitHub release (latest SemVer)](https://camo.githubusercontent.com/5500d287632b20645e117517c77bb3d7caea2890a627d5ee6e33722bdfc80ecf/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f762f72656c656173652f736c6f6b2f736c6f7468)](https://github.com/slok/sloth/releases/latest) [![Kubernetes release](https://camo.githubusercontent.com/04d9a0e34458382024a738bc5507706082711a35e4fb850c99e2fbdf6d8cdccf/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4b756265726e657465732d76312e33352d677265656e3f6c6f676f3d4b756265726e65746573267374796c653d666c617426636f6c6f723d333236434535266c6f676f436f6c6f723d7768697465)](https://camo.githubusercontent.com/04d9a0e34458382024a738bc5507706082711a35e4fb850c99e2fbdf6d8cdccf/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4b756265726e657465732d76312e33352d677265656e3f6c6f676f3d4b756265726e65746573267374796c653d666c617426636f6c6f723d333236434535266c6f676f436f6c6f723d7768697465) [![OpenSLO](https://camo.githubusercontent.com/7ba714a180097f8099516139115f6148de56836b3d549ce7b42c8c69fea85c4e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4f70656e534c4f2d7631616c7068612d677265656e3f636f6c6f723d343937344541267374796c653d666c6174)](https://github.com/OpenSLO/OpenSLO#slo)

## Project status

[](#project-status)

Sloth is actively maintained and in continuous development.

We’re currently working on internal improvements to make Sloth even more extensible and adaptable to real-world use cases. While Sloth already supports custom SLI plugins, upcoming changes will bring more flexibility to how SLOs are generated, making it easier to adapt Sloth to your custom needs. Stay tuned for updates!

## Introduction

[](#introduction)

Meet the easiest way to generate [SLOs](https://landing.google.com/sre/workbook/chapters/alerting-on-slos/) for Prometheus.

Sloth generates understandable, uniform and reliable Prometheus SLOs for any kind of service. Using a simple SLO spec that results in multiple metrics and [multi window multi burn](https://landing.google.com/sre/workbook/chapters/alerting-on-slos/#6-multiwindow-multi-burn-rate-alerts) alerts.

[https://sloth.dev](https://sloth.dev/)

## Features

[](#features)

-   Simple, maintainable and understandable SLO spec.
-   Reliable SLO metrics and alerts.
-   Based on [Google SLO](https://landing.google.com/sre/workbook/chapters/alerting-on-slos/) implementation and [multi window multi burn](https://landing.google.com/sre/workbook/chapters/alerting-on-slos/#6-multiwindow-multi-burn-rate-alerts) alerts framework.
-   Autogenerates Prometheus SLI recording rules in different time windows.
-   Autogenerates Prometheus SLO metadata rules.
-   Autogenerates Prometheus SLO [multi window multi burn](https://landing.google.com/sre/workbook/chapters/alerting-on-slos/#6-multiwindow-multi-burn-rate-alerts) alert rules (Page and warning).
-   SLO spec validation (including `validate` command for Gitops and CI).
-   Customization of labels, disabling different type of alerts...
-   A single way (uniform) of creating SLOs across all different services and teams.
-   Automatic [Grafana dashboard](https://grafana.com/grafana/dashboards/14348) to see all your SLOs state.
-   Single binary and easy to use CLI.
-   Kubernetes ([Prometheus-operator](https://github.com/prometheus-operator)) support.
-   Kubernetes Controller/operator mode with CRDs.
-   Support different [SLI types](#sli-types-manifests).
-   Support for [SLI plugins](#sli-plugins)
-   A library with [common SLI plugins](https://github.com/slok/sloth-common-sli-plugins).
-   [OpenSLO](https://openslo.com/) support.
-   Safe SLO period windows for 30 and 28 days by default.
-   Customizable SLO period windows for advanced use cases.

[![Small Sloth SLO dashboard](https://github.com/slok/sloth/raw/main/docs/img/sloth_small_dashboard.png)](https://github.com/slok/sloth/blob/main/docs/img/sloth_small_dashboard.png)

## Getting started

[](#getting-started)

Release the Sloth!

sloth generate -i ./examples/getting-started.yml

version: "prometheus/v1"
service: "myservice"
labels:
  owner: "myteam"
  repo: "myorg/myservice"
  tier: "2"
slos:
  # We allow failing (5xx and 429) 1 request every 1000 requests (99.9%).
  - name: "requests-availability"
    objective: 99.9
    description: "Common SLO based on availability for HTTP request responses."
    labels:
      category: availability
    sli:
      events:
        error\_query: sum(rate(http\_request\_duration\_seconds\_count{job="myservice",code=~"(5..|429)"}\[{{.window}}\]))
        total\_query: sum(rate(http\_request\_duration\_seconds\_count{job="myservice"}\[{{.window}}\]))
    alerting:
      name: "MyServiceHighErrorRate"
      labels:
        category: "availability"
      annotations:
        # Overwrite default Sloth SLO alert summmary on ticket and page alerts.
        summary: "High error rate on 'myservice' requests responses"
      page\_alert:
        labels:
          severity: "pageteam"
          routing\_key: "myteam"
      ticket\_alert:
        labels:
          severity: "slack"
          slack\_channel: "#alerts-myteam"

[This](https://github.com/slok/sloth/blob/main/examples/_gen/getting-started.yml) would be the result you would obtain from the above [spec example](https://github.com/slok/sloth/blob/main/examples/getting-started.yml).

## Documentation

[](#documentation)

[Check the docs to know more about the usage, examples, and other handy features!](https://sloth.dev/)

## SLI plugins

[](#sli-plugins)

Looking for common SLI plugins? Check [this repository](https://github.com/slok/sloth-common-sli-plugins), if you are looking for the sli plugins docs, check [this](https://sloth.dev/usage/plugins/) instead.

## Development and Contributing

[](#development-and-contributing)

Check [CONTRIBUTING.md](https://github.com/slok/sloth/blob/main/CONTRIBUTING.md).
