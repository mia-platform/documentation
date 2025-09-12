---
id: configuration
title: Booking Module configuration
sidebar_label: Configuration
---



## Proxies

Define one `cross-project` proxy to the `USER_MANAGER_MODULE_NAMESPACE` with this specifications:

- host: `user-manager-service`;
- port: `80`.

Define one `cross-project` proxy to the `NOTIFICATION_MANAGER_NAME` with this specifications:

- host: `notification-manager-service`;
- port: `8080`.

## Endpoints

No additional endpoints are required.
