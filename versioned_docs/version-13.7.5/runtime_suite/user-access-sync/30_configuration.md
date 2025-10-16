---
id: configuration
title: Configuration
sidebar_label: Configuration
---



## Environment Variables
The following environment variables are required:
- CRUD_RULES_URL: url to database where all rules are stored
- CRUD_PROVIDER_CONFIGURATION_URL: url to database where all providers configuration are stored
- MIA_CONSOLE_NAME: name of the default provider used to interact with the console

Can be used also the platform environment variables:
- USERID_HEADER_KEY: (optional, default: miauserid)
- USER_PROPERTIES_HEADER_KEY: (optional, default: miauserproperties)
- GROUPS_HEADER_KEY: (optional, default: miausergroups)
- CLIENTTYPE_HEADER_KEY: (optional, default: client-type)
- BACKOFFICE_HEADER_KEY: (optional, default: isbackoffice)
- MICROSERVICE_GATEWAY_SERVICE_NAME: (optional, default: microservice-gateway)
- ADDITIONAL_HEADERS_TO_PROXY: (optional, default: additional-headers)


## Provider Configuration
Provider configurations are stored on database.
All the configurations file have the following fields required:
- *ID*: unique identifier for the provider; is a custom string, the value can be chosen by the user.
- *Type*: identify which kind of provider this configuration is referred to; there are fixed values depending on the specific provider
- *Configuration*: object with provider related information. It is a custom object for each provider.

For further details on how configure each provider you can refer to the dedicated documentation:
- [Mia Platform Console](/runtime_suite/user-access-sync/90_providers/91_mia_platform.md)
- [Okta](/runtime_suite/user-access-sync/90_providers/92_okta.md)
- [Gitlab](/runtime_suite/user-access-sync/90_providers/93_gitlab.md)
- [GitHub](/runtime_suite/user-access-sync/90_providers/94_github.md)
