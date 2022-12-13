---
id: configuration
title: Mia FHIR Server Configuration
sidebar_label: Configuration
---
This service can be added to your project by visiting Mia-Platform [Marketplace](../../marketplace/overview_marketplace.md) and creating a new microservice from the **Mia FHIR Server** plugin.

In order to start using the Mia FHIR Server, all you have to do is adding it from the Marketplace: all the ConfigMaps and environment variables it needs will be precompiled with default values, if available.

## Environment variables
* **TRUSTED_PROXIES** (*default: `10.0.0.0/8,172.16.0.0/12,192.168.0.0/16`*): the string containing the trusted proxies values.
* **HTTP_PORT**: the port exposed by the service.
* **LOG_LEVEL** (*default: `info`*): level of the log. It could be trace, debug, info, warn, error, fatal.
* **FHIR_SERVER_HOSTNAME**: the url of the Mia FHIR Server swagger. It is needed to exploit the web application capabilities, since it is used by the web application frontend to contact the FHIR APIs.
* **FHIR_DB_CONNECTION_STRING**: the connection string of the DB used to store the data. The connection must be in [`jdbc` format](https://docs.oracle.com/cd/E19509-01/820-3497/confdbdriver_intro/index.html). For example, for a MySQL connection you will have: `jdbc:mysql://<server-name>:<server-port>/<database-name>`.
* **FHIR_DB_DRIVER_CLASS_NAME**: the driver class name related to DB used to store the data. In order to find the right driver class name you can refer to the [official jdbc documentation](https://docs.oracle.com/cd/E19509-01/820-3497/confdbdriver_intro/index.html). For example, if you are using a MySQL DB instance, the driver class name will be: `com.mysql.jdbc.Driver `.
* **FHIR_DB_USER**: the username used to access the DB instance.
* **FHIR_DB_PASSWORD**: the password used to access the DB instance.
* **FHIR_VERSION** (*default: `R4`*): the FHIR version of the server. The available options are: `DSTU3`, `R4` and `R5`.
* **OPENAPI_ENABLED** (*default: `true`*): it enables the swagger UI as well as the openapi yaml documentation.
* **ALLOW_EXTERNAL_REFERENCES** (*default: `false`*): it enables the presence in the FHIR resource payloads of references external from the current Mia FHIR Server context.
* **DEFAULT_PAGE_SIZE** (*default: `20`*): the default number of records returned by the Mia FHIR Server.
* **NARRATIVE_ENABLED** (*default: `false`*): it enables the presence of the narrative, which is an HTML code snippet containing a resume of the resource. For further details about the narrative, please refer to the [official FHIR documentation](https://hl7.org/fhir/narrative.html).
* **RESUE_CACHED_SEARCH_RESULTS_MILLIS** (*default: `0`*): it defines the value of the cache TTL (Time-To-Live) for the search results. Note that, setting a value greater than zero can lead to unexpected behavior for search requests. Indeed, the inserted entities could be not immediately visible due to this TTL cache setting.

:::warning
All the environment variables are **required**.
:::
