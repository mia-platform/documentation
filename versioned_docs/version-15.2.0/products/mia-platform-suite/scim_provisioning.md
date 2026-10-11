---
id: scim-provisioning
title: Automatic Provisioning via SCIM
sidebar_label: Automatic Provisioning via SCIM
---

# Automatic Provisioning via SCIM

Mia-Platform supports the **automatic provisioning of users and groups** through the [SCIM 2.0](https://scim.cloud/) protocol (RFC 7643 / RFC 7644). Any Identity Provider (IdP) that can act as a **SCIM client** (for example Microsoft Entra ID, Okta, OneLogin, PingIdentity, JumpCloud, or any other directory with outbound SCIM provisioning) can keep the users and groups of a Mia-Platform tenant aligned with the state of its own directory, without any manual onboarding in the [Platform Administration](/products/mia-platform-suite/rbac_management.md) section.

:::info
Automatic provisioning via SCIM is available starting from Mia-Platform **v15.2.0**.
:::

## How it works

Without SCIM, users and groups of a tenant are created and managed manually from the Administration section: an admin invites users, organizes them into groups, and assigns roles to groups and users.

With SCIM, the management of **identities** (users, groups, and group memberships) moves to your Identity Provider, while the management of **roles** stays entirely in Mia-Platform Administration:

- **SCIM synchronizes identities.** Users and groups assigned to the SCIM application configured in your IdP are pushed to Mia-Platform, and every subsequent change (new members, removed members, deactivated users, deleted groups) is propagated automatically.
- **Administration remains the only source of truth for RBAC.** Your IdP does not know, and does not send, anything about Mia-Platform roles. Roles (predefined or custom) are assigned to the synchronized groups from the Administration section, exactly as for any other group.

:::info Provisioning is tenant scoped
**One SCIM application in the IdP = one Mia-Platform tenant.** Every tenant that needs automatic provisioning has its own SCIM application, pointing to its own tenant endpoint. As a result, the tenant is kept in sync, for users and groups, with the state of the corresponding SCIM application in your IdP.
:::

:::note
SCIM only takes care of **provisioning** identities. Users still **authenticate** through the identity providers federated with the Mia-Platform Keycloak realm, as described in the [Authentication installation guidelines](/requirements/installation-guidelines/shared-services/authn/10_overview.md).
:::

### Identity synchronization

1. In your IdP, you organize users and groups as usual.
2. Every user and group **assigned to the SCIM application** is sent to the Mia-Platform SCIM endpoint of the target tenant.
3. **The group name in the IdP becomes the group name in Mia-Platform.** On the first SCIM event for a group that does not exist yet in the tenant, Mia-Platform creates it with the same name; subsequent events update its members.
4. Membership changes in the IdP (a user added to or removed from a group) are reflected in the corresponding group of the tenant.

### Role assignment

1. Once a synchronized group appears in the Administration section of the tenant, an admin assigns it one or more **roles** (predefined or custom), exactly as for a group created manually.
2. Group members acquire the permissions of the roles assigned to the group, following the same additive model already used by Administration: roles assigned individually and roles inherited from groups add up.
3. This assignment **never goes through SCIM**: it is neither read from nor written to the IdP. It is an ordinary RBAC configuration activity, to be repeated only when the roles granted to a group change, not at every provisioning cycle.

## Prerequisites

**On the Mia-Platform side:**

- The target tenant must already exist in Administration (the default tenant created at installation time is always available).
- Any custom role you plan to assign to the synchronized groups must already exist in the tenant.
- The `scim-client` OAuth 2.0 client must be configured in the `mia-platform` Keycloak realm, with its client secret provisioned in the Keycloak vault. In on-premise installations, this is done by the platform operator as described in [Enabling the SCIM client](/requirements/installation-guidelines/shared-services/authn/keycloak-realm-management/10_overview.md#scim-provisioning-client).

**On the Identity Provider side:**

- Support for **outbound SCIM 2.0 provisioning** towards a custom (non-gallery) application.
- Support for the **OAuth 2.0 Client Credentials grant** to authenticate against the SCIM endpoint (see [Connection parameters](#connection-parameters)).
- Any license or plan required by your IdP to provision **groups** (some IdPs, such as Microsoft Entra ID, require a premium tier to provision groups).

## Connection parameters

To configure the SCIM application in your IdP, you need the following values:

| Parameter | Value |
| :---- | :---- |
| **SCIM base URL** (often called *Tenant URL*) | `https://<HOME_HOST>/api/scim/v2/tenants/<TENANT>` |
| **Authentication method** | OAuth 2.0 Client Credentials grant |
| **Token endpoint** | `https://<KEYCLOAK_HOST>/realms/mia-platform/protocol/openid-connect/token` |
| **Client ID** | `scim-client` |
| **Client secret** | the value provisioned in the Keycloak vault for `scim-client` (ask your platform operator) |

Where:

- `<HOME_HOST>` is the host of your Mia-Platform Home.
- `<TENANT>` identifies the target tenant: either the tenant name or the tenant ID. On the Mia-Platform PaaS, the tenant ID must be used.
- `<KEYCLOAK_HOST>` is the host of the Keycloak instance serving the `mia-platform` realm.

The IdP obtains an access token from the token endpoint with the `client_credentials` grant, and sends it on every SCIM request in the `Authorization: Bearer <access_token>` header. The `scim-client` service account is granted only the roles needed to provision users and groups.

:::tip
Before configuring the IdP, you can check that the endpoint is reachable by calling the SCIM discovery endpoints, which do not require authentication:

```sh
curl https://<HOME_HOST>/api/scim/v2/tenants/<TENANT>/ServiceProviderConfig
```
:::

### Supported SCIM capabilities

| Capability | Supported |
| :---- | :---- |
| Resources | `User`, `Group` |
| Create (`POST`), read (`GET`), incremental update (`PATCH`), delete (`DELETE`) | Yes |
| Filtering (`eq` on `userName`, `externalId`, `displayName`, `id`) | Yes |
| Bulk operations (`/Bulk`) | No |
| Sorting, ETags | No |
| Password management | No (credentials always live in the IdP) |

### Attribute mapping

Map the attributes of your IdP to the following SCIM attributes. Attributes not listed here are not stored by Mia-Platform: do not map them, since their value would be lost.

**Users**

| SCIM attribute | Notes |
| :---- | :---- |
| `userName` | **Required.** Unique identifier of the user; typically the user principal name or the email address. |
| `active` | Drives the [deactivation](#deactivating-a-user) of the user. |
| `emails` | Email address of the user. |
| `displayName` | Display name shown in Administration. |
| `name.givenName`, `name.familyName` | Forwarded to the Mia-Platform identity store; they are never returned in SCIM responses. |
| `externalId` | Identifier of the user in the IdP; used to match existing users. |

**Groups**

| SCIM attribute | Notes |
| :---- | :---- |
| `displayName` | **Required.** Becomes the group name in Mia-Platform. |
| `members` | Members of the group. |
| `externalId` | Identifier of the group in the IdP; used to match existing groups. |

## Setup guide

The following steps describe the setup in a generic way. Names of menus and fields change from one IdP to another: refer to your IdP documentation for the exact procedure to create a custom SCIM application.

### 1. Prepare Mia-Platform

1. Verify that the target tenant exists and that every custom role you need has already been created.
2. Verify with your platform operator that the `scim-client` is configured and get its client secret.
3. Take note of the [connection parameters](#connection-parameters) for the target tenant.

:::tip
For the first provisioning, you can create the custom roles, and even the (empty) groups, in Administration before starting the provisioning from the IdP. When the IdP sends a group with the same name, its members are synchronized into it.
:::

### 2. Create the SCIM application in the IdP

Create a new custom application (often called *non-gallery*, *custom*, or *generic SCIM* application) dedicated to provisioning. Give it a name that clearly identifies the target tenant, for example `Mia-Platform SCIM - <tenant name>`, to keep the 1:1 relationship between the application and the Mia-Platform tenant explicit.

### 3. Configure the SCIM connection

1. Open the provisioning settings of the application and enter the SCIM base URL, the token endpoint, the client ID, and the client secret listed in [Connection parameters](#connection-parameters).
2. Use the **test connection** feature of your IdP, if available, to verify the configuration.
3. Configure the attribute mapping for users and groups as described in [Attribute mapping](#attribute-mapping).

### 4. Assign users and groups to the application

IdPs only provision the identities **assigned to the SCIM application**. Assign to the application the users and groups that must be provisioned to the Mia-Platform tenant.

### 5. Start the provisioning

Enable the provisioning on the application and start the first cycle. The first cycle processes every assigned identity, so it may take some time depending on the size of your directory.

After the first cycle, the IdP synchronizes changes automatically with its own schedule, so a change made in the IdP may not appear immediately in Administration. If you need to apply a change to a single user or group right away, use the **on-demand provisioning** feature, if your IdP offers it.

### 6. Assign roles to the synchronized groups

At this point the synchronized groups appear in the tenant, but **without any role**: SCIM only created identities (group names and members).

1. Open the tenant in Administration and find the groups created by the synchronization.
2. Assign one or more roles (predefined or custom) to each group, exactly as for a group created manually.
3. Repeat this step only when the roles granted to a group change, not at every provisioning cycle.

### 7. Verify

1. In Administration, verify that the expected users and groups are present, with the correct members.
2. Verify that the roles assigned to the groups grant the expected permissions to their members, for example from the [Profile](/products/mia-platform-suite/rbac_management.md#profile) page of a user.

## Monitoring provisioning events

Every SCIM request received by Mia-Platform is recorded as an audit event. A [Super Admin](/products/mia-platform-suite/rbac_management.md#who-is-the-organization-admin-and-how-is-this-role-acquired) can review them through the **API Portal** of the Mia-Platform Home (typically `<homepage-url>/documentations/api-portal/`), by calling the `GET /api/audit/scim/events` endpoint.

These events are useful to troubleshoot the provisioning together with the provisioning logs of your IdP.

## Deprovisioning

When an identity managed via SCIM is deactivated or removed in the IdP, Administration reflects the change automatically, without any manual intervention.

### Deactivating a user

This is the typical case of a user who is suspended but not deleted.

1. The IdP sends an update of the user with `active: false`.
2. Administration marks the user as **disabled** and shows it with a status badge in the users list of the tenant.
3. From this moment the user loses access and permissions on Mia-Platform:
   - **Permissions** are revoked **immediately**: the user can no longer perform any authorized action.
   - **Ongoing sessions** remain valid until their natural expiration, but without any permission.
   - **New access attempts** are denied.

### Removing a synchronized group

When a group managed via SCIM is deleted in the IdP, or unassigned from the SCIM application:

1. The group is removed from the groups of the tenant in Administration.
2. Since the roles had been assigned to the group **in Administration**, and not through SCIM, its members immediately **lose the roles they inherited from that group**.
3. Roles assigned individually to the users, or inherited from other groups, are not affected.

## Coexistence with manual management in Administration

- **Roles**: since roles are never part of the SCIM payload, a role assigned in Administration to a synchronized group is **never overwritten or modified** by a provisioning cycle. It lives exclusively in Administration and can be changed at any time, with no risk of being realigned by the IdP.
- **Identities** (user and group names, group memberships, active/disabled status) are instead **owned by the IdP**. From Administration, it is not possible to add members to a SCIM-managed group: the change would be overwritten by the next provisioning event, which reconciles the group with the state in the IdP.
- **Manual groups**: you can still create other groups manually (not managed by SCIM) in the Administration section of the tenant, and add users to them to grant additional roles and permissions.
