---
id: how-to-upgrade
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How to Upgrade the AI Services chart

To upgrade the `ai-services` chart, update the chart version and run `helm upgrade`.

:::tip
Always review the chart changelog before upgrading. On every upgrade the `temporal-schema-setup` Job runs as a pre-upgrade hook and applies Temporal's schema migrations; it is safe to re-run.
:::

:::caution

- Temporal guarantees data compatibility only between consecutive minor versions. When an upgrade changes the Temporal server image (`temporal.image.tag`) on a cluster with data to keep, move one minor version at a time.
- Never change `secrets.litellmProxyKeys.saltKey` on an existing installation: the credentials already stored with it become unreadable.
- `temporal.numHistoryShards` cannot be changed after the first install.

:::

## Direct chart upgrade

If you installed the chart directly:

```bash
helm repo update

helm upgrade ai-services mia-platform/ai-services \
  --version <CHART_VERSION> \
  --namespace ai-services \
  --values values.yaml \
  --atomic \
  --timeout 10m
```

## Upgrade via the ai-services-deployment wrapper

If you use the `ai-services-deployment` wrapper repository, update the chart version constraint in `Chart.yaml`:

```yaml
dependencies:
  - name: ai-services
    alias: aiServices
    version: ">=0.1.0-0 <0.2.0"   # ← bump to the new target version constraint
    repository: "https://nexus.mia-platform.eu/repository/helm-internal/"
```

Then update and deploy:

```bash
helm dependency update

helm upgrade ai-services . \
  --namespace ai-services \
  --values values.yaml \
  --values values/<env>.yaml \
  --values <encrypted-secrets-values-file> \
  --atomic \
  --timeout 10m
```

## Version-specific upgrade notes

No version-specific migration steps required yet.
