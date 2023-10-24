---
id: configuration
title: Configuration
sidebar_label: Configuration
---
## Environemnt Variables

The service needs the following environment variables:
- **CRUD_URL**: url to the *crud service* with the collection used to store rules;
- **FLOW_MANAGER_URL** (optional, defaul to `null`): url to the flow manager to send events to;
- **HTTP_PORT** (optional, defaul to `8080`): port where the web server is exposed;
- **LOG_LEVEL** (optional, defaul to `INFO`): application log level;
- **USERID_HEADER_KEY** (optional, defaul to `miauserid`): name of the header carrying the identifier of the calling user;
- **USER_PROPERTIES_HEADER_KEY** (optional, defaul to `miauserproperties`): name of the header carrying properties of the calling user;
- **GROUPS_HEADER_KEY** (optional, defaul to `miausergroups`): name of the header carrying groups of the calling user;
- **CLIENTTYPE_HEADER_KEY** (optional, defaul to `client-type`): name of the header carrying client type of the calling user;
- **BACKOFFICE_HEADER_KEY** (optional, defaul to `isbackoffice`): the header key which identifies the value which determines if the service is considered backoffice;
- **MICROSERVICE_GATEWAY_SERVICE_NAME** (optional, defaul to `microservice-gateway`): which contains the host name (or IP address) pointing to the `microservice-gateway`;

## CRUD Collection

The **rules service** store rules on a CRUD. You need to create a collection with the same schema of the rule defined in [the previous section](./20_how_to_use.md).
