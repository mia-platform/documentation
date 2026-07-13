---
id: namespaces-and-dns
title: Namespace and DNS Layout
sidebar_label: Namespace & DNS Layout
sidebar_position: 0.5
---

# Namespace and DNS Layout

This page describes the recommended Kubernetes namespace naming convention for a Mia Platform v15 self-hosted installation.

## Naming convention

When installing one or more products of the suite, a simple and effective convention is to combine the **product name** with the **environment** it runs on:

```
{product}-{environment}
```

Examples: `console-production`, `catalog-development`, `ai-foundry-preproduction`.

The same logic can be applied to DNS names, prefixing the environment to the product's subdomain (e.g. `dev.catalog.example.com`), with production typically having no prefix (e.g. `catalog.example.com`).

## Non-production vs. production

As a general guideline, keep non-production environments (development, staging/preproduction, experimental, etc.) logically separated from production — ideally in dedicated namespaces, and on a dedicated cluster where feasible. This limits the blast radius of changes and allows independent upgrade cycles. The exact set of non-production environments and their names is up to each installation's needs.

## Keycloak: a single shared instance

Unlike the other products, **Keycloak should be deployed as a single, dedicated instance** dealing with authentication/authorization ("auth tooling"), independent of the product/environment namespace pattern above. It typically lives in its own `keycloak` namespace and is shared across the products it serves.

Isolating Keycloak this way limits the blast radius of any change to it and allows the operator/Keycloak instance to be upgraded independently from the products.

Each product deployment must simply reference this shared Keycloak instance via the correct `urls.keycloak` (Realm Management values) and `configurations.keycloak.host` (Helm values) settings.
