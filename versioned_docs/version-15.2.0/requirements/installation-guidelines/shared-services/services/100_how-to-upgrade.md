---
id: how-to-upgrade
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

### From 0.2.65-hotfix.0 to 0.3.16 (Mia-Platform v15.0.1 to v15.1.0)

1. If you enabled `hooks.seedData` and set `hooks.seedData.secretName`, remove that value: the chart no longer reads it. The seed job now always reads the PostgreSQL connection string from the `rbac-management-keys` Secret, under the key set in `hooks.seedData.secretKey` (default `postgres-connection-string`). Before you upgrade, make sure that Secret contains the connection string under that key.

Also note:

- The new optional `namespacePrefix` value (default empty) adds a `<namespacePrefix>-` prefix to the names of all the resources the chart creates, including the `rbac-management-keys` Secret, the image pull Secret set in `global.imagePullSecret.name` and the TLS Secret set in `ingressRoute.tls.secretName`. Secrets that you create yourself must then use the prefixed names. Setting it on an existing installation renames its resources.
- The name of the Traefik IngressRoute can be set with `ingressRoute.name`. The default is `default-ingress`, the previous name.
- The hook resources have new names: for example, the Secret `postgres-db-check-credentials` is now `postgres-db-connectivity-credentials`. Jobs left behind under the old names by an earlier failed hook are not cleaned up by Helm: delete them by hand.

### From 0.2.65 to 0.2.65-hotfix.0 (Mia-Platform v15.0.0 to v15.0.1)

No manual action required: install the new chart version.

No breaking changes have been introduced yet. This section will be updated whenever a major release requires migration steps.
