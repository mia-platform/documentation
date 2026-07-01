---
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How To Upgrade — Keycloak chart

This page describes how to upgrade the Keycloak chart and the components it manages. Because the Keycloak Operator version and the Keycloak instance version are decoupled, upgrades follow specific procedures to minimise or eliminate downtime.

## Upgrade strategy overview

The chart defaults to `update.strategy: Auto` in the Keycloak CR. The operator evaluates the type of change on each reconciliation and chooses the appropriate strategy:

| Change type | Strategy | Downtime |
|---|---|---|
| Patch version bump (same major.minor) | Rolling update on the StatefulSet | None |
| Minor or major version bump | Recreate (scale to 0, then up) | Yes — expected for schema migrations |
| Operator image bump only | Operator pod restarts; StatefulSet untouched | None |

## Upgrade procedures

### Patch version upgrade (Keycloak image only)

Update `keycloak.image.tag` in your values file and run `helm upgrade`. The running operator detects the CR change and performs a rolling StatefulSet update.

```bash
helm upgrade keycloak . \
  --namespace keycloak \
  -f my-keycloak-values.yaml \
  --set keycloak.image.tag=0.3.0-26.6.5-postgres
```

The operator pod is **not** restarted.

### Operator version upgrade

Update `operator.image.tag` in a dedicated release, separate from any Keycloak image change. The operator pod restarts; the Keycloak StatefulSet is not modified.

```bash
helm upgrade keycloak . \
  --namespace keycloak \
  -f my-keycloak-values.yaml \
  --set operator.image.tag=26.6.5
```

### Minor or major Keycloak version upgrade

1. Upgrade the operator version first (separate `helm upgrade`) — the operator must support the target Keycloak version before the Keycloak image is changed.
2. Update `keycloak.image.tag` to the new version. The operator detects the incompatible change and uses the recreate strategy.
3. Keycloak is scaled down, applies database schema migrations, then scales back up.

Plan a maintenance window for minor and major upgrades.

## Chart version migration notes

This chart is at its initial release (`v0.x`). No prior chart versions exist, so there are no migration notes at this time.

Future releases that require user action will include step-by-step migration instructions in this section, along with the minimum Helm and operator versions required. Always review the chart `CHANGELOG.md` before upgrading.
