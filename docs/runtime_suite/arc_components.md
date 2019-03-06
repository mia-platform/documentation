
Below you will find a detailed list of the components that compose Mia-Platform.

![](img/schema.PNG)

# API & Microservice Ecosystem #

## API Gateway ##

The API Gateway is the microservice responsible for routing requests to the correct service.
It also manages authentication, performs access control and rate limiting.

Its main features are:

* URL Mapping
* Rate Limit
* Http Secure Headers
* Request Dispaching
* Secret Management API
* Http Utilities
* Proxy-Pass Plain
* SSL Encryption
* URL Rewriting

The service is composed by default from multiple nginx servers, 2 listening on ports 80 and 8080, 4 listening on unix sockets to return the error messages.

Port 80 is used for application routing, while the backoffice is exposed to 8080.

![](img/gateway.PNG)

### Client Proxy ###

The image consists of a nginx.conf file that applies the format of the registers and the basic settings.
It also provides a secure.conf file that implements the best SSL security practice to include in the required server declaration. The path is /etc/nginx/secure.conf.
The SSL configuration is based on the availability of three files within the / etc / usr / ssl / directory:

- dhparam: a Diffie-Helman key generated with at least 2048 bits (4096 bits are a bit slow at this time)

- sslcrt: the certificate for SSL configuration

- sslkey: the private key for SSL configuration

By default the Nginx server will look for the server declaration within the .conf file within the /etc/nginx/conf.d directory.
To write the various server declarations, you must follow the [official Nginx documentation](https://nginx.org/en/docs/).

### Certificate Service ###

This microservice manages the creation of the SSL certificates needed by Nginx to allow https connections to the cluster.

## Microservice Ecosystem ##

### Microservice Gateway ###


This microservice provides the ability to specify http hooks to call before and after each request, to decorate it with additional services.
Such services can modify the request (`PRE` hook), for example to add ACL functionality, or to act after the request to the service has been done (` POST` hook), for example to add more data to the reply.

The Microservice Gateway takes care of making calls to these hook services specified by configuration at startup, and modifying (or interrupting) the request as indicated by the services.

Hook microservices must meet a precise http interface to be successfully interrogated by the Microservice Gateway.

![](img/mg.PNG)

### Marketplace Custom Microservice Template

#### NodJS Template

A **Custom Microservices** (CM) encapsulates ad-hoc business logic, which can be developed by any user of the platform and can potentially be written in any programming language. For an easily adoption and development, the Mia-Platform team has created ** custom-plugin-lib, a library in node.js, based on the fastify library. Using custom-plugin-lib it is possible to create a CM implementing:

* HTTP route handler
* change behavior based on the information of which client performed the request, the logged in user and the group they belong to
* requests to other services or CM of the platform
* PRE or POST decorators

[Here you can find all the information on how to configure it](../development_suite/plugin_baas_4.md)

## BaaS ##
### CRUD Service ###

The CRUD Service is a microservice that serves to expose an HTTP API to perform CRUD operations (Create, Read, Update, Delete) on mongodb collections.
It is configured at startup through the definition of collections (one or more), to provide a consistent HTTP interface and to perform the validation of operations before executing them on the database.

The definition of a collection involves indicating the list and the type of fields and optionally specifying indexes.

![](img/crud.PNG)

### Files Manager Service ###

This microservice offers the functionality of uploading and downloading files using third-party services (eg S3 or MongoDB). The http interface of the microservice is independent of the specific storage service used, which is configured at startup. The uploaded files are also recorded in a collection managed by the CRUD.
S3 and MongoDB are currently supported as storage services.

### Static Files Service ###

The microservice is responsible for the hosting and provision of static files and secure header configuation.

### Notification Service ###

This microservice allows you to send push notifications to Android and iOS clients.
It depends on two CRUD collections, whose path names and properties can be mostly configured, by internal convention they are called **devices** and **notifications**.
[Here you can find all the information to configure it](push_notifications_platform_4.md)

#### Mail Notification Service ##

This microservice allows sending e-mails via AWS SES and SMTP

### SDK Mobile ###

Mia-Platform provides an SDK that works as an intermediary to allow interactions between the application and the platform.

Mia provides two SDKs:

1. iOS SDK: [How to configure it](sdk_ios.md)
2. Android SDK: [How to configure it](sdk_android.md)

## Data Management ##

### SQL Generic Reader ###

### CQRS/Event Source Data Management ###

### GraphQL Gateway ###

### ETL Adapters ###

### Secure Data Exchange Service ###

With this microservice it is possible to associate tokens to a payload, verify the correctness of the token and configure the settings on the token (expiration, number of possible calls, etc.).
Thanks to this microservices, exchanges of data between suppliers or services can be secured.

### Soap To Rest ###

This library provides developers with some utilities to facilitate the conversion from SOAP to REST.
Starting from the describe.json generated by the node-soap client, the library creates JSON request and response schemes for each wsdl operation.

## M2M

### Stream-Processing###

### ChatBot (DialogFlow)

### IoT Gateway (MQTT)

### Payment Gateway

## API Automation

### Cronjobs Microservices ###

This microservice is responsible for managing the cron scripts within the platform.
[At this link all the rules to configure it](cron.md)

### API workflow (API BPM, business process Management) ###

### API Distributed Transaction

# Security #

## Access Management ##

### Auth Service ###

The microservice of Auth is responsible for managing the authentication and registration of a new user on the platform.
The microservice also manages all the integrations with external authentication services:
* OAuth2
* Social Auth (Facebook and Google)
* OAM
* LDAP

### ACL ###

The ACL microservice is a `PRE` hook whose purpose is to apply ACL rules for each request to indicate to the CRUD Service which rows or columns to filter.
These ACL rules are based on the current user and his membership groups.

Currently two types of ACL are provided by the service:

- *ACL by rows*: prepares a query that will filter documents based on the current user (for example, to show only documents created by the user).
- *ACL for read columns*: allows to limit the fields that the user can see in the answer on the basis of his group membership and the type of customer.

This service acts by reading and writing http headers. In fact, the user and group information are retrieved from the header, and the result of the application of the rules is the writing of ACL headers that the CRUD Service is able to interpret to actually perform the filters.

### Session Manager ###

The Session Manager microservice manages the users session within the platform, saving the information in session and managing Cookies and JSON Web Tokens.

The Session Manager also collaborates with the user management services for the authentication part. The control that this microservice does is currently quite sophisticated and the logical expression evaluates more parameters:

1. the **group**, a variable that identifies the group to which the caller belongs. The group must be written as "group-group". For more information see the following [link] (https://docs.mia-platform.eu/configurator/conf_cms/#5-controllo-accessi-sui-gruppi-acl-sui-groups).

2. **isBackOffice**, a Boolean variable that evaluates whether the call comes from the Back-Office or not.

3. **clientType**, which identifies where the call comes from (ex CMS, site, ...).

### User Service ###

User Service is responsible for managing Users on the Platform.
Allows login, registration and request of real information to a user.

Dialogue with the components: Auth, Session Manager, Email Service, Credential to ensure security and to allow numerous configurations according to customer needs.

The microservice can also be added to **user-properties** to enrich the user with all the information required for the services.

### Credential Service ###

Credential Service is the microservice that works with user service for user login and registration. It is in fact responsible for managing user credentials.

The microservice is also responsible for managing groups.

### Swagger Aggregator ###

This microservice is responsible for aggregating the individual swaggers of all the microservices indicated in the configuration.
Collect all paths from the specified microservice swaggers and show them all on a single swagger page.
Because the microservices are not aware of the prefixes prefixed by the gateways, this service can be configured to correct the swagger paths with the correct prefix.
Finally it checks the duplicates in the pairs of the path (for example two microservices answer to GET / prefix / me), signaling this with an error.
[At this link all the rules to configure it](swagger_conf.md)

### PDF Service ###


This plugin provided an easy way to generate PDF files from an initial HTML template. This service is based on the [Puppeteer library](https://github.com/GoogleChrome/puppeteer).
If you use this service on your computer, it is very important to set the DOCKER environment variable to false.

### Pingator ###

Pingator is a service that monitors the status of the services to check that they are active.
It allows to monitor the status of a service by offering a set of alarms for monitoring.

### v1Adapter ###

This microservice allows to use the CMS with the new service of CRUD Service, translating the requests from the CMS into HTTP calls adapted to the new interface.
In addition to the mapping of http routes, it also deals with the conversion of types (for example dates and geographic coordinates), and the transformation from sync and trash to the new state and vice versa.

### CMS Backend ###

Microservice used to configure the CMS to show both collections on BAAS 3 and collections managed by the new CRUD Service.
