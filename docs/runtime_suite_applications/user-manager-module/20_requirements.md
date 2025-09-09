---
id: requirements
title: User Manager Module requirements
sidebar_label: Requirements
---



## Auth0

The User Manager Service is configured to use Auth0 as the external authentication provider. Follow this [guide to configure Auth0][auth0-configuration].

## Secrets

Secrets must be manually defined in an mlp.yaml file inside the project repository in order to interpolate their values in the environment variables. You can download the file <a download target="_blank" href="/docs_files_to_download/user-manager-module/mlp.yaml">here</a>.

This is the list of *Secrets* that must be manually configured:

- **REDIS_HOSTS**, redis host required by the `Auth0 Client`;
- **MONGODB_URL**, necessary to connect the `CRUD Service` and the `User Manager Service` to MongoDB.

## Service request for network policies

Define the network policies necessary to allow traffic between the User Manager Module namespace and other projects namespaces. Open a Service Request and ask for specialist support to add these policies:

- allow ingress and egress traffic between `user-manager-module` and `notification-module` 
- allow ingress and egress traffic between `user-manager-module` and `therapy-device-module`
- allow ingress and egress traffic between `user-manager-module` and `ehr-module`
- allow ingress and egress traffic between `user-manager-module` and `booking-module`
- allow ingress and egress traffic between `user-manager-module` and `patient-monitoring-portal`
- and also one similar policy for each additional internal module...

[mia-crud-service]: /runtime_suite/crud-service/10_overview_and_usage.md
[auth0-configuration]: /runtime_suite/auth0-client/30_configure_auth0.md
[umm-configuration]: /runtime_suite_applications/user-manager-module/30_configuration.md
[mlp-secrets-example]: https://github.com/mia-platform/mlp/blob/main/examples/example-cm-secret-config.yaml
