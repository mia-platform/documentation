---
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the Services chart

To upgrade the `services` chart, update the chart version and run `helm upgrade`.

:::tip
The chart follows [semver](https://semver.org/): breaking changes are introduced only in **major** version bumps. Minor releases add new optional configuration; patch releases contain only fixes. Always review the changelog before upgrading across a major boundary.
:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade services mia-platform/services \
  --namespace services \
  --values values.yaml \
  --atomic \
  --timeout 5m
```

## Upgrade via the services-deployment wrapper

If you use the `services-deployment` wrapper repository, update the pinned chart version in `Chart.yaml`:

```yaml title="Chart.yaml" {4}
dependencies:
  - name: services
    version: "~X.Y"   # bump to the desired version
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then:

```bash
helm dependency update

helm upgrade --install services . \
  --namespace services \
  --values values/production.yaml \
  --atomic
```

## Version-specific notes

No breaking changes have been introduced yet. This section will be updated whenever a major release requires migration steps.
