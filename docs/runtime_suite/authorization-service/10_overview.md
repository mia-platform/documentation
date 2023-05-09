---
id: overview
title: Overview
sidebar_label: Overview
---
The authorization service is responsible for authorizing a route to request certain resources.

This service exposes an endpoint `/auth` that, given a [configuration file](configuration.md), validates whether the request can be authorized or not, and thus be propagated to the services below the API Gateway.

In order to decide whether the request can be authorized, the service will attempt to gather information about the entity (user or machine) that is performing the request (this is done by leveraging the OIDC `/userinfo` endpoint). Combining these information with the original request route and method and the [Group Expression](../../development_suite/api-console/api-design/endpoints#manage-the-security-of-your-endpoints) defined in the Console a proper status code is returned, as specified in the [usage doc](./usage.md).

Alternatively, the service can skip the "entity resolution" step if set to do so. In that case, the service will trust the headers in which the information about the user is provided. This alternative mode is explained in the [usage doc](./usage.md#trust-mia-platform-user-headers).
