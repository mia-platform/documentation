---
title: Authentication Overview
sidebar_label: Overview
---

# Authentication in Mia Platform

The Mia Platform product suite — Console, Catalog, AI Foundry, Homepage & AuthZ, and extensions — shares a unified authentication and Single Sign-On (SSO) layer across all its components. This layer is built on [Keycloak](https://www.keycloak.org/), deployed and managed by Mia Platform as part of the platform installation.

## Mia-scoped Keycloak instance

Each Mia Platform on-premises installation includes a **dedicated Keycloak instance** that is:

- Deployed via the [**Keycloak chart**](/requirements/installation-guidelines/authn/keycloak/10_overview.md) — a Helm chart wrapping the official Keycloak Operator.
- Configured declaratively via the [**Keycloak Realm Management chart**](/requirements/installation-guidelines/authn/keycloak-realm-management/10_overview.md) — realm blueprints rendered into `keycloak-config-cli` import files.
- Scoped exclusively to the Mia Platform product suite — it does not replace or interfere with the customer's existing identity infrastructure.

This Keycloak instance runs in the same Kubernetes cluster as the Mia Platform products and its lifecycle (installation, upgrades, monitoring) is fully managed by Mia Platform through the two charts above.

## Identity Provider brokering

The Mia Platform Keycloak operates as an **Identity Provider (IdP) broker** — not as the source of truth for user identities. **The source of truth for user accounts always remains the customer's own Identity Provider**, whether that is:

- The customer's corporate Keycloak instance.
- An enterprise IdP such as Okta, Azure Active Directory (Microsoft Entra ID), or Auth0.
- Any OIDC-compliant identity provider.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Customer Infrastructure                        │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │               Mia Platform Helm Release                     │   │
│   │                                                             │   │
│   │   ┌────────────────────────────────────────────────────┐    │   │
│   │   │         Mia-scoped Keycloak (IdP broker)           │    │   │
│   │   │                                                    │    │   │
│   │   │   mia-platform realm  ◄── OIDC federation ──►      │    │   │
│   │   │   mia-extensions realm                             │    │   │
│   │   └──────────────────────┬─────────────────────────────┘    │   │
│   │                          │ issues OIDC tokens               │   │
│   │   ┌──────────────────────▼─────────────────────────────┐    │   │
│   │   │   Mia Platform Products                            │    │   │
│   │   │   (Console, Catalog, AI Foundry, Homepage, …)      │    │   │
│   │   └────────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │   Customer Identity Provider                                │   │
│   │   (corporate Keycloak, Okta, Azure AD, LDAP, …)             │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

When a user logs in to any Mia Platform product, the Mia-scoped Keycloak brokers the authentication request to the customer's IdP. Keycloak does not hold user credentials — it translates the identity assertion received from the upstream IdP into the OIDC tokens consumed by Mia Platform services.

### What this means for customers with an existing Keycloak

If the customer already operates a Keycloak instance, no migration is required. The customer's Keycloak simply needs to be **federated with the Mia-scoped instance via standard OIDC**. Both Keycloak instances communicate over the OIDC protocol — this is a stateless, stable interface that does not require any changes to the customer's realm, users, or existing applications.

The two Keycloak instances are fully independent: they can be upgraded separately, monitored independently, and their respective lifecycles do not interfere with each other.

## Why this architecture

### Security

The Mia-scoped Keycloak is deliberately configured only as a broker:

- Users are not created locally in the Mia realm — they authenticate exclusively through the federated customer IdP.
- The customer's IdP remains the authoritative source for user credentials, MFA policies, and account lifecycle.
- The Keycloak admin console can be restricted to a private hostname, keeping it isolated from the public-facing login endpoint.

### Upgrade independence

Because the Mia Keycloak instance is separate from the customer's identity infrastructure:

- Customers can upgrade their own Keycloak or IdP without impacting Mia Platform.
- Mia Platform can update its Keycloak version as part of a normal platform release without requiring any changes from the customer.
- The OIDC federation interface between the two sides is a versioned standard — it is not affected by internal upgrades on either side.

### Responsibilities

| Concern | Owner |
|---|---|
| User credentials, MFA, account lifecycle | Customer's IdP |
| Platform-level roles, OIDC clients, SSO policies | Mia Platform (managed Keycloak) |
| Realm configuration and incremental updates | Mia Platform (Realm Management chart) |
| Customer IdP availability and configuration | Customer |
| Federation setup and initial claim mappings | Shared — Mia Platform provides defaults, customer adapts for their IdP |

## Dual-realm model

Every Mia Platform installation uses two Keycloak realms:

| Realm | Purpose |
|---|---|
| **`mia-platform`** | Core product realm. Holds all Mia Platform OIDC clients, roles, authorization policies, and protocol mappers. This realm is the OIDC issuer for all Mia Platform services. |
| **`mia-extensions`** | Extensibility realm. Designed for customer-specific integrations, custom OIDC clients, and additional identity flows. Federated 1:1 with the `mia-platform` realm. |

Both realms are managed declaratively via the [Keycloak Realm Management chart](/requirements/installation-guidelines/authn/keycloak-realm-management/10_overview.md).

## Choosing a federation strategy

Before installing, review the [Federation Strategies](/requirements/installation-guidelines/authn/20_federation-strategies.md) page to select the integration model that best fits your identity infrastructure. It covers four scenarios — from a fully managed Keycloak with customer IdP federation to in-realm integration in constrained environments — with architecture diagrams, responsibility matrices, and a comparison table.

## Installation

The authentication layer requires two Helm charts, installed in order:

| Step | Chart | Purpose |
|---|---|---|
| 1 | [**Keycloak**](/requirements/installation-guidelines/authn/keycloak/10_overview.md) | Deploy the Keycloak Operator and the Keycloak instance |
| 2 | [**Keycloak Realm Management**](/requirements/installation-guidelines/authn/keycloak-realm-management/10_overview.md) | Configure realms, OIDC clients, roles, groups, and IdP federation |
