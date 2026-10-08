---
id: how-to-upgrade
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the Catalog chart

To upgrade the `catalog` chart, update the chart version and run `helm upgrade`.

:::tip
The chart follows [semver](https://semver.org/): breaking changes are introduced only in **major** version bumps. Minor releases add new optional configuration; patch releases contain only fixes. Always review the changelog before upgrading across a major boundary.
:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade catalog mia-platform/catalog \
  --namespace catalog \
  --values values.yaml \
  --atomic \
  --timeout 10m
```

## Upgrade via the catalog-deployment wrapper

If you use the `catalog-deployment` wrapper repository, update the pinned chart version in `Chart.yaml`:

```yaml
dependencies:
  - name: catalog
    version: "~0.X"   # ← bump to the new target version constraint
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then update and deploy:

```bash
helm dependency update

helm upgrade catalog . \
  --namespace catalog \
  --values values/<env>.yaml \
  --atomic \
  --timeout 10m
```

## Version-specific upgrade notes

No version-specific migration steps required yet.
