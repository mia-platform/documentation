---
id: how-to-upgrade
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

### From 0.1.35 to 0.1.47 (Mia-Platform v15.1.1 to v15.2.0)

1. If `products.authz` is enabled, add the `<realmId>_scim-client-secret` entry (for example `mia-platform_scim-client-secret`) to the Keycloak vault through the Keycloak chart `vault.*` values before you import the realm. The chart now always creates the `scim-client` client with `products.authz: true`, and the client reads its secret from `${vault.scim-client-secret}`.
2. If you install AI Services, set `products.aiServices: true` and `urls.aiServices` to the public AI Services URL, which must match the URL configured in the AI Services chart. Before the import, also add the `<realmId>_ai-services-temporal-ui-client-secret` entry to the Keycloak vault. The chart then creates the `ai-services-api`, `ai-services-access-control`, `ai-services-temporal-ui` and `ai-services-mcp-gateway` clients and adds the `mia:ai-services` scope to the token exchange clients of the other products.

Also note:

- With `products.authz: true`, the chart now creates the `authz-token-exchange` client, used by the Homepage & RBAC chart to exchange tokens for the Catalog and AI Services. It offers the `mia:catalog` scope only with `products.catalog: true` and the `mia:ai-services` scope only with `products.aiServices: true`.
- With `products.aiFoundry: true`, the chart now also creates the `ai-foundry-provisioner` service account client, which reads its keys from `<urls.aiFoundry>/.well-known/ai-foundry-provisioner/jwks.json`, and the public `ai-foundry-cli` client. The provisioner client also uses the `mia:authz`, `mia:authz-roles` and `mia:catalog` scopes, so enable `products.authz` and `products.catalog` as well.
- The `service-account-catalog-access-control` and `catalog-engine` users are now created only with `products.catalog: true`, and `service-account-ai-foundry-access-control` only with `products.aiFoundry: true`. Users created by an earlier version stay in Keycloak.
- The chart adds the `authz-api` client roles `urn:mia-platform-internal:role:authz:principals:reader`, `urn:mia-platform-internal:role:authz:provisioning:groups` and `urn:mia-platform-internal:role:authz:provisioning:users`, and gives `principals:reader` to the `catalog-engine` service account.
- The Keycloak version is unchanged: no newer Keycloak or Keycloak chart is required.

### From 0.1.28 to 0.1.35 (Mia-Platform v15.0.2 to v15.1.0)

No manual action required: install the new chart version.

Also note:

- With `products.console: true`, the chart now creates the `urn:mia-platform-internal:role:console:guest` client role on `console-api`, maps it to the `mia:console` client scope, and creates the `products/console/guest` group also when `options.isPaaS` is `false`. Check that these realm objects fit your access model.
- The `products/authz/superadmin` group is now created only when `products.authz` is `true`. Groups use the `no-delete` import policy, so a group created by an earlier version stays in Keycloak but is no longer managed by the chart.
- With `products.catalog: true`, the chart creates the `catalog-engine` service account client and its service account user, with the `urn:mia-platform-internal:role:authz:permissions:writer` role on `authz-api`. Catalog uses this client to sync its permissions (see the Catalog upgrade notes). The client reads its keys from `<urls.catalog>/.well-known/jwks.json`, so `urls.catalog` must point to the public Catalog URL.
- With `products.flow: true`, the chart creates the `flow-access-control` service account client and its service account user.
- The Mia Flow clients now offer the optional client scope `mia:authz` instead of `mia:ai-foundry`.
- With `options.cimd: true`, the Claude Code client also accepts the redirect URI `https://claude.ai/api/mcp/auth_callback`.

Future releases that require user action, such as renamed values, removed fields, or changed default behaviors, will include step-by-step migration instructions in this section. Always review the chart `CHANGELOG.md` before upgrading.
