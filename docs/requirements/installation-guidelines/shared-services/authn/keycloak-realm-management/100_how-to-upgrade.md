---
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How To Upgrade — Keycloak Realm Management chart

This page describes upgrade considerations for the `keycloak-realm-management` chart.

## Keycloak version compatibility

The realm management chart renders configuration for a specific version of Keycloak. Some realm fields are version-gated — they are only emitted when the target Keycloak version supports them.

When upgrading Keycloak, ensure the `keycloak-config-cli` image version used during import matches the Keycloak version you are importing into. Mismatched versions can cause `keycloak-config-cli` to reject or silently drop unsupported fields.

The Keycloak version used for import is controlled by the `KEYCLOAK_CONFIG_CLI_IMAGE` variable in the `Makefile`. Update this value when upgrading Keycloak.

## Re-applying after a Keycloak upgrade

After upgrading Keycloak, re-import all realm components to ensure that any new version-gated fields (e.g. new security policies, updated token settings) are applied to the existing realms:

```bash
make import \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=admin \
  KEYCLOAK_PASSWORD=<admin_password>
```

All imports are idempotent and non-destructive — re-applying is always safe.

## Chart version migration notes

This chart is at its initial release (`v0.x`). No prior chart versions exist, so there are no migration notes at this time.

Future releases that require user action — such as renamed values, removed fields, or changed default behaviors — will include step-by-step migration instructions in this section. Always review the chart `CHANGELOG.md` before upgrading.
