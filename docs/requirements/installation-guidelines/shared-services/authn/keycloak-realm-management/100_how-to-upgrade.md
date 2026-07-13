---
title: How To Upgrade
sidebar_label: How To Upgrade
---

# How To Upgrade: Keycloak Realm Management chart

This page describes upgrade considerations for the `keycloak-realm-management` chart.

## Keycloak version compatibility

The realm management chart renders configuration for a specific version of Keycloak. Some realm fields are version-gated; they are only emitted when the target Keycloak version supports them.

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

All imports are idempotent and non-destructive, re-applying is always safe.

## Incremental realm updates (production workflow)

In production environments, realm updates should be applied using the `keycloak-config-cli` service account instead of admin credentials. This avoids storing or transmitting admin passwords and allows updates to be automated in CI/CD pipelines.

### Using the service account (`import-*`)

The `import-*` Makefile targets authenticate via OAuth2 `client_credentials` grant using the `keycloak-config-cli` client created during setup (see [Customer Keycloak via CLI](/requirements/installation-guidelines/shared-services/authn/federation-strategies/customer-keycloak-cli.md#step-11--create-the-keycloak-config-cli-service-account) or the equivalent bootstrap step for managed Keycloak installations).

```bash
# Update the mia-platform realm
make import-products \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/production/products-values.yaml

# Update the mia-platform-extensibility realm
make import-extensibility \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/production/extensibility-values.yaml

# Update the master realm
make import-master \
  KEYCLOAK_URL=https://keycloak.example.com \
  LOGIN_REALM=master \
  KEYCLOAK_CLIENT_SECRET=<CLIENT_SECRET> \
  VALUES=values/master-values.yaml
```

### Using admin credentials (`import-admin-*`)

The `import-admin-*` targets authenticate with username and password. Use these only for emergency access or when the service account is not yet configured:

```bash
make import-admin-products \
  ENV=production \
  KEYCLOAK_URL=https://keycloak.example.com \
  KEYCLOAK_USER=admin \
  KEYCLOAK_PASSWORD=<admin_password> \
  VALUES=values/production/products-values.yaml
```

### Recommended update sequence

When a new version of the `keycloak-realm-management` chart is released:

1. **Review the `CHANGELOG.md`** of the chart for renamed values, removed fields, or changed defaults that require values file updates.
2. **Update dependencies**: `make deps`
3. **Render without applying** (dry-run): `make template-products ENV=production VALUES=...`
4. **Review** the generated YAML in `rendered/production/products/<values-name>/` to confirm the changes are as expected.
5. **Apply**: `make import-products ENV=production ...` (repeat for each changed realm)

All imports are safe to run in any order and any number of times, the `no-delete` policy on all managed resource types ensures that removing an entry from a values file never deletes the corresponding resource in Keycloak.

## Chart version migration notes

This chart is at its initial release (`v0.x`). No prior chart versions exist, so there are no migration notes at this time.

Future releases that require user action, such as renamed values, removed fields, or changed default behaviors, will include step-by-step migration instructions in this section. Always review the chart `CHANGELOG.md` before upgrading.
