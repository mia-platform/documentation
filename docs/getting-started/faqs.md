---
id: faqs
title: Mia-Platform FAQs
sidebar_label: Mia-Platform FAQs
---

# FAQ


### [Getting Categories to Work in the API Portal](https://github.com/mia-platform/community/discussions/532)
#### How can I properly configure path expressions in Swagger Aggregator to categorize endpoints in the API Portal?

Try using the path.startsWith('/doc-gen/') expression for your paths. This should properly match the endpoints under each category. For example:

```plaintext
"subswaggers": {
    "/document-generation.json": {
      "name": "DocumentGeneration - Routes",
      "tagName": "DocumentGeneration",
      "expression": "path.startsWith('/doc-gen/')"
    },
    "/document-generation-acl.json": {
      "name": "DocumentGenerationACL - Routes",
      "tagName": "DocumentGenerationACL",
      "expression": "path.startsWith('/doc-gen-acl/')"
    }
}
``` 
This should list the expected routes under each category in the API Portal.

### [Using Envoy Rate Limiter Plugin vs Endpoint Rate Limits](https://github.com/mia-platform/community/discussions/527)
#### Do I need the Envoy Rate Limiter plugin to set rate limits on specific endpoints, and how do they interact?
* Endpoint Rate Limits: These are applied directly to individual endpoints and work out-of-the-box without any additional plugins.
* Rate Limiter Plugin: This is for global, shared rate limits across multiple Envoy instances and provides more complex rate-limiting strategies.

When both are used, the global rate limits set by the plugin are applied first, followed by the endpoint-specific limits.

### [Retrieving Name and Surname in Users CRUD with Okta Authentication Service](https://github.com/mia-platform/community/discussions/512)
#### Why are the name and surname fields empty in the users CRUD after setting up the Authentication Service with Okta?
The issue likely arises from not having the correct scopes set in your Okta configuration. Ensure that you include the profile scope, which is needed to retrieve basic user information, including the name.
If the Okta userinfo endpoint is not returning the expected fields, check its configuration to ensure that it includes the necessary data. After adjusting the scope to include profile, the name field should be correctly populated.

### [Defining Environment-Specific TTL Expiry in MongoDB](https://github.com/mia-platform/community/discussions/510)
#### Can I define different TTL expiry times based on the environment (e.g., 7 days for preproduction, 30 days for production)?
Currently, in the Console, it's only possible to specify a static numeric value for TTL, meaning you can't use environment-specific values directly within the TTL form. However, consider the performance implications of using TTL indexes, especially on large collections, as they might impact database performance during peak times.

### [Managing Indexes in Mia-Platform Fast Data Projections](https://github.com/mia-platform/community/discussions/502)
#### Are all indexes created by Fast Data strictly necessary, or can some be safely deleted?
If you're using the Projection Storer in the ingestion step, the indexes mia_internal_counter_type_index and mia_internal_counter_index can be safely removed. These indexes are related to fields (__internal__counter and __internal__kafkaInfo) that are only populated by the RealTime Updater, not by the Projection Storer.

### [Avoid Storing Specific Projections in Mia-Platform Fast Data](https://github.com/mia-platform/community/discussions/501)
#### How can I avoid storing projections that match a specific filter to reduce the size of the projection collection?
A custom message adapter won't fully solve the issue, as the Projection Storer (PS) and Real-Time Updater (RTU) will still attempt to write a record in MongoDB even if the adapter returns null or undefined. Instead, consider using Debezium's message filtering capabilities to filter out unwanted projections before they reach the storage phase. This approach allows you to handle filtering more efficiently within your existing setup.

### [Debugging a Flow Manager application locally](https://github.com/mia-platform/community/discussions/495)
#### How can I debug a Flow Manager application locally when the microservices are implemented in Node.js?
You can debug a Node.js microservice locally using Visual Studio Code's "JavaScript Debug Terminal" found in the "Run and Debug" section. If your microservice interacts with the Flow Manager or other services, mock them using external tools mock-server to simulate their behavior. This allows you to debug without needing to deploy and wait for pipeline processes.

### [Retrieving Entries Without __STATE__ Field via CRUD](https://github.com/mia-platform/community/discussions/478)
#### How can I retrieve MongoDB entries without the __STATE__ field using the CRUD service?
If your services write directly to MongoDB without setting __STATE__: PUBLIC, the CRUD service won't find those entries.

### [Automatically Creating Public Variables in New Projects with Enhanced Workflow](https://github.com/mia-platform/community/discussions/435)
#### Can I set public variables to be automatically created in new projects using the Enhanced Workflow?
The Enhanced Workflow allows you to define public variables in an api-console-config.json file within your Project Template. When a new project is created, this configuration will be imported as the initial setup, including any public variables you define.

### [Configuring Envoy for HTTP/1.1 Communication](https://github.com/mia-platform/community/discussions/428)
#### How can we configure Envoy to use HTTP/1.1 instead of HTTP/2?
If your targets only support HTTP/1.1, you can modify Envoy's cluster configuration to use HTTP/1.1 explicitly. Update the configuration with the following snippet:

```yaml
protocol_selection: USE_CONFIGURED_PROTOCOL
typed_extension_protocol_options:
  envoy.extensions.upstreams.http.v3.HttpProtocolOptions:
    explicit_http_config:
      http_protocol_options: {}
```

### [Adding a Custom CA Certificate to Envoy Proxy in K8s](https://github.com/mia-platform/community/discussions/426)
#### How can we add a custom CA certificate to the Envoy proxy in our K8s setup to enable secure communication with legacy systems?
There are two main ways to add a custom CA certificate to the Envoy proxy:
* Modify the CA used by the service: You can mount the custom CA certificate directly to the service using ConfigMaps.
* Configure the Envoy Cluster: You can update the cluster configuration in Envoy to include the custom CA. This can be done through the advanced configuration section in the console.

Both methods allow you to establish trusted TLS connections between your Mia workloads and the legacy systems secured by the custom CA.

### [Understanding getUserProperties() and getClientType() Methods](https://github.com/mia-platform/community/discussions/412)
#### Where do the getUserProperties() and getClientType() methods get their values?
* getUserProperties(): Retrieves values from the USER_PROPERTIES_HEADER_KEY header, set by the Authorization Service using data from the user's access token.
* getClientType(): Retrieves values from the CLIENTTYPE_HEADER_KEY header, set by the Authorization Service based on the API key's client type.

### [Integrating Multiple Azure Key Vaults with Mia-Platform Console](https://github.com/mia-platform/community/discussions/406)
#### Can the Console handle multiple Azure Key Vaults per environment, where some vaults are shared across projects and others are specific to a project?
Mia-Platform Console supports only one store (vault) per environment. To work with multiple vaults, you'll need to:

* Manually Create Manifests for Generic Vaults: This can be done as part of the project template to ensure the generic vaults are accessible across projects.
* Let the Console Handle Project-Specific Vaults: The Console can automatically create the necessary manifests for vaults that are specific to a project and environment.

### [Auth0-Client Error: "Host Not Found" when calling from Custom Microservice](https://github.com/mia-platform/community/discussions/382)
#### Why am I getting a "host not found" error on my auth0-client when calling it from a custom microservice, even though it works fine with Postman?
The issue likely stems from the X-Forwarded-Host header not being forwarded from your custom microservice to the auth0-client. While the Envoy API Gateway forwards this header to your microservice, your microservice needs to propagate it when calling the auth0-client.
Ensure that your custom microservice forwards the X-Forwarded-Host header in its requests to the auth0-client.

### [Priority of environment variables in GitLab Secret Provider](https://github.com/mia-platform/community/discussions/375)
#### How does GitLab handle environment variables when both a generic and a specific variable are set for different environments?
The environment will use the most specific variable that matches. If you have both a generic and a specific variable, the specific one (e.g., for production) will take precedence in that environment, while the generic variable will be used in all other environments. The "best match" wins, meaning the longest or most specific variable name has priority.

For example:
* MIA_LOG_LEVEL=info (generic)
* PROD_LOG_LEVEL=error (specific for production)

In this case, LOG_LEVEL=info will be used in all environments except production, where LOG_LEVEL=error will be used.

### [Auth0 Client Returns "Service Not Found" Error](https://github.com/mia-platform/community/discussions/371)
#### Why am I getting a "Service not found" error when trying to reach the GET /authorize endpoint of the Auth0-client?
The error typically occurs when the audience configured in your Auth0-client doesn't match the unique identifier of the API configured in your Auth0 tenant. Ensure that the audience in your Auth0-client configuration matches exactly the API identifier set in your Auth0 tenant.
If you didn't specify an audience in the direct /authorize call to Auth0, it might not be required. In the Auth0-client configuration, the audience field is optional, and if left blank, it won't be passed to the underlying /authorize endpoint.

### [Error Creating Microservice from Marketplace Template](https://github.com/mia-platform/community/discussions/370)
#### Why am I getting a "service repository is empty" error when creating a microservice from a Marketplace template?
If the token doesn't have access to the repository group where your template is stored, you'll encounter this error.
To resolve:
* Create a new GitLab token: Ensure this token has access to the Marketplace group containing all the template repositories.
* Create a new Marketplace Provider: Use the new GitLab token when setting up this provider in the Mia-Platform Console.
* Update the Marketplace element: Add the new provider's ID in the "Provider ID" field of your Marketplace template element.

### [Auth0 client returning empty response instead of tokens](https://github.com/mia-platform/community/discussions/367)
#### Returning empty 200 response instead of tokens when using POST /oauth/token endpoint with Auth0 client
If your Auth0 client configuration uses the "website" scope, tokens are not returned in the response body. Instead, they are converted into a session, which you can find in the Set-Cookie response header.
To resolve this issue, check if the tokens are being set as cookies instead of being included in the response body.

### [Sorting in MongoDB with Back-Kit and CRUD](https://github.com/mia-platform/community/discussions/349)
How can we manage sorting in collections with multiple fields?
The bk-crud-client currently doesn't support multi-field sorting or default sort parameters. You can use initialSortProperty for the initial load, but it won't solve the issue for other fields.

### [Handling HTTP Responses in Kafka2Rest Microservice](https://github.com/mia-platform/community/discussions/345)
#### Can Kafka2Rest manage the response of a REST call, and if so, how?

Currently, Kafka2Rest does not offer customization options for directly handling HTTP responses beyond logging them. If you need to manage or act on the response, such as submitting a message to a Kafka topic based on the response body, this functionality is not available out of the box. For more complex scenarios requiring detailed response handling, it is recommended to implement a custom Kafka consumer. This approach allows for greater flexibility and control over the response, enabling you to tailor the solution to your specific needs.

### [Understanding Uniqueness in RLS Plugin Rate Limiting](https://github.com/mia-platform/community/discussions/334)
#### How does the RLS plugin define the uniqueness of addresses for rate limiting? Is it IP-based?
Yes, the uniqueness of addresses in the RLS plugin is IP-based. By default, the Console configures the plugin to match the remote address, meaning that the rate limit applies individually to each unique IP address.

### [Using different Git providers for project templates and projects](https://github.com/mia-platform/community/discussions/333)
#### Can I create a project using a template from one Git provider but have the project itself use a different Git provider?
Yes, it is possible to use different Git providers for the template and the project. When defining a project template in the CMS, you can specify a providerId for the template.  
This allows you to associate templates with specific Git providers, enabling the creation of projects on a different Git provider than the one where the template is stored.  
If the providerId for the template is not set, the Console will default to using the Git provider associated with the project being created.

### [Changing CI/CD provider during project creation](https://github.com/mia-platform/community/discussions/332)
#### How can I set a different CI/CD provider for my project during the project creation process when it seems pre-set?
If the default CI/CD provider is set at the company level, you may need to update the default provider configuration in the project creation settings. You can still change the CI/CD provider after the project is created.

### [Defining Custom Documentation Path for Swagger Aggregator](https://github.com/mia-platform/community/discussions/322)
#### How can I define a custom documentation path in the CMS for a Template Marketplace item to be used by the Swagger aggregator?
In the CMS, you can define a custom documentation path for a Template Marketplace item by adding the defaultDocumentationPath property in the service resource definition. This property specifies the path that the Swagger aggregator will use to retrieve the API documentation.

For example:
```json
{
  "defaultDocumentationPath": "/custom-docs-path"
}
```

### [Error Releasing RBAC Service Sidecar](https://github.com/mia-platform/community/discussions/320)
#### Why am I getting an error about missing environment variables when releasing the RBAC service sidecar?
This error occurs because either the API_PERMISSIONS_FILE_PATH or TARGET_SERVICE_OAS_PATH environment variable must be set for the RBAC service sidecar to function properly. This typically happens when the service does not have a documentation path configured or lacks at least one manual route.
To resolve this, ensure that your service has a documentation path configured or add at least one manual route. Once this is done, the sidecar should start correctly.

### [Exposing a Service on a Custom Port via Nginx API Gateway](https://github.com/mia-platform/community/discussions/317)
#### How can I expose a service running on a custom port (e.g., 8069) via Nginx API Gateway?
The API Gateway is configured to route traffic to services on port 80 by default. To expose your service via the API Gateway, you need to ensure that the container is also listening on port 80. You can achieve this by mapping your container's port 8069 to port 80. Once this configuration is in place, the API Gateway should correctly route the traffic to your service.

### [Setting custom port for Kubernetes Probes](https://github.com/mia-platform/community/discussions/312)
#### How can I set a custom port for Kubernetes probes in my deployment?
The port used by Kubernetes probes is determined by the HTTP_PORT environment variable in your configuration. Set HTTP_PORT to 8080, and the probes will target that port. This variable is used by the console to generate the probes' specification.

### [Centralized authentication-service for multiple projects](https://github.com/mia-platform/community/discussions/303)
#### How can I configure a centralized authentication-service to handle authentication for multiple projects without causing redirect loops or other issues?
Yes, you can achieve a centralized authentication setup. The key is to ensure that the redirectUrl in the authentication-service configuration matches the IDP settings and is correctly set for the client’s host.

Here’s a recommended approach:
* Single Login-Site: Use a single login-site on the common project. This avoids duplication and centralizes the login process.
* Envoy Configuration: If using Envoy, configure it with the JWT filter to verify user sessions, allowing the authorization-service to trust the headers passed by the authentication-service.
* Nginx Configuration: For Nginx, you can handle redirects by adding custom configurations in the backoffice-root-location-extension.conf and backoffice-server-extension.conf files to manage 401 errors and redirect to the login site.

### [Handling Email Variables in YAML Configuration](https://github.com/mia-platform/community/discussions/295)
#### How can I correctly format an email variable in a YAML configuration to avoid errors during deployment?
Yes, YAML supports email-formatted strings, but you need to enclose the email in quotes to avoid parsing errors. Update your variable like this:

```yaml
  MAIL_RECIPIENT='mail@example.com'
```

### [Creating a Multiselect Field with Lookup in Microfrontend Composer Forms](https://github.com/mia-platform/community/discussions/286)
#### Is it possible to create a multiselect field in a Microfrontend Composer form that pulls options from another collection?
Yes, you can use CRUD Service Views to aggregate data from multiple collections and configure a multiselect field in your form. Define the field in the data-schema as a "lookup," and the form components will render it as a select element, fetching options from the associated collection.

### [Frontend application deployed on a non-root path](https://github.com/mia-platform/community/discussions/281)
#### How can I modify an application to correctly retrieve static files when deployed on a non-root path?

To ensure your React application correctly retrieves static files when deployed on a non-root path, you can try the following solutions:

* Add a Base Tag to index.html: Include a `<base href="/your-path/" />` tag in your index.html file. This instructs the browser to prepend /your-path/ to all relative URLs in the application.
* Modify the homepage Field in package.json: Set the homepage field in your package.json to /your-path/. This ensures that when the application is bundled, the paths to static files are correctly adjusted to include the base path.
* Force a Trailing Slash in the URL: Ensure that the URL used to access the application ends with a trailing slash (e.g., /your-path/). This helps in correctly resolving the relative URLs for static files.

### [Namespace not found](https://github.com/mia-platform/community/discussions/278)
#### How to create a namespace when it is not found in the cluster?
If the pipeline not creating the namespace automatically fails with the error "Namespace not found", it is likely that the namespace was not created in the cluster.
When a new environment is created from the Console, the namespace should be created in the cluster if the service account used by the Console has the necessary permissions. If the namespace wasn't created automatically, you can:
* Ensure the service account has the required permissions to create namespaces.
* Manually create the namespace.

### [Handling deployment issues with multiple microservices and CPU Throttling](https://github.com/mia-platform/community/discussions/277)
#### How can I address microservices failing to start or liveness probes failing during a massive simultaneous deployment?
The startupProbe in Kubernetes delays liveness and readiness checks until the service has fully started. By setting a higher threshold for the startupProbe, you allow your microservices sufficient time to start, even under CPU throttling, preventing premature failures and ensuring a smoother deployment process.

### [Searching encrypted fields in MongoDB Views](https://github.com/mia-platform/community/discussions/269)
#### Is it possible to search by encrypted fields in a MongoDB view that originates from a collection with searchable encrypted fields?
Currently, searching encrypted fields in MongoDB views is not supported. This limitation is due to the fact that MongoDB itself does not support querying encrypted fields in views.

### [Using $in Operator in MongoDB Filter with RBAC\ Row Filter](https://github.com/mia-platform/community/discussions/268)
#### Is it possible to generate a MongoDB filter using the $in operator when configuring a Row Filter with RBAC?
Yes, the $in operator is supported since Rönd v1.7.0. You can use it to generate MongoDB filters in your Row Filter with RBAC.
Here’s an example:

```rego
my_rows_filter {
    input.request.method == "GET"
    company := data.resources[_]
    managed_companies := input.user.properties.metadata.managed_companies

    company._id in managed_companies
}
``` 
If you encounter issues, ensure that you have imported the future.keywords to use the in keyword correctly. This should resolve any syntax errors you might encounter, allowing you to use the $in operator as intended.
You can import it as follows:
```rego
import future.keywords
```

### [Deleting a Project](https://github.com/mia-platform/community/discussions/233)
#### How can I delete a project on the Console, especially one created for demo or testing purposes that is no longer needed?
You can now delete a project directly from the Console via the "Project Settings" section in the "Overview" area. Within this section, you will find an "Advanced" tab that allows you to access advanced information and perform sensitive operations on the project.

### [Handling scopes in POST /bulk endpoint of Files-Service](https://github.com/mia-platform/community/discussions/231)
#### How do scopes work when using the POST /bulk endpoint in the files-service? Can I assign different scopes to individual files in a single request?
When using the POST /bulk endpoint in the files-service, all files are uploaded under the scope defined in the URL path, regardless of any scope specified in the form-data. The scope specified in the form-data is ignored, and all files are assigned the scope from the URL path. This means that you cannot assign different scopes to individual files in a single bulk upload request.

### [Creating User Group Permission Rule for Multiple Permissions](https://github.com/mia-platform/community/discussions/217)
#### How can I correctly define a user group permission rule for multiple permissions in Mia-Platform's authorization service?
Permissions in Mia-Platform are handled as a map. The correct way to check multiple permissions is by using the following expressions:

```plaintext
"permA" in permissions && "permB" in permissions
```
or
```plaintext
permissions["permA"] && permissions["permB"]
```

### [Modify maximum response Body size in Envoy API Gateway](https://github.com/mia-platform/community/discussions/186)
#### How can I modify the default maximum response body size (4KB) in my Envoy API Gateway using Mia-Platform Console's advanced configurations?
You can use the "property patch" extension to modify this property as follows:
```yaml
    - listener_name: <your listener>
      'filter_chains.0.filters.0.typed_config.route_config.max_direct_response_body_size_bytes': <your body size>
```
However, please be cautious when changing this property, as Envoy holds the content of the direct response body in memory. Increasing this limit beyond the default 4KB could result in higher memory usage, which is not subject to data plane buffering controls.

### [Unexpected behavior with "Preserve Files" Flag in Config Map](https://github.com/mia-platform/community/discussions/185)
#### Why does my service return a MODULE_NOT_FOUND error when using the "Preserve files" flag in a Config Map configuration?
The "Preserve files" flag is designed to prevent a mounted ConfigMap from overriding existing files in the directory of the running image. When enabled, it ensures that only the files specified in the ConfigMap are mounted, while existing files in the directory are preserved. Without the flag, the contents of the ConfigMap would replace everything in the target directory, potentially removing pre-existing files.

### [Handling unique constraint violation errors in CRUD Service](https://github.com/mia-platform/community/discussions/175)
#### How should I handle a unique constraint violation error when inserting an item into a collection? Is the 422 status code always indicative of this error?
The 422 status code is only returned for unique constraint violations during insert or bulk insert operations. However, since future updates could introduce new scenarios where a 422 status code is used, it is advisable to parse the error message for the specific MongoDB error code E11000 to be certain.

### [Error with Post Decorator and Content-Type application/x-ndjson](https://github.com/mia-platform/community/discussions/161)
#### Why does the microservice gateway fail when I add a post decorator to an endpoint with Content-Type application/x-ndjson?
The error occurs because the microservice gateway only supports post decorators that receive the response body in JSON format. It is not possible to use a post decorator directly with a Content-Type of application/x-ndjson. However, you can create a new endpoint that calls the /export endpoint and handles the request/response as a stream (in this case, nd-json is treated as a stream), modifying the response body as needed. If you want to modify elements unrelated to the response body, such as headers or sending notifications, you can do so by setting the requireResponseBody parameter to false.

### [Request rejected due to invalid (not required) client-key](https://github.com/mia-platform/community/discussions/157)
#### Why is my API request rejected with an UNAUTHORIZED error even though the client-key header is not required?
Even if the client-key (or secret) header is not required, if it is provided, it must still be valid; otherwise, the request will be rejected. This behavior is intentional to prevent disclosing sensitive information during the authorization process. To better understand the issue, it is recommended to check the authorization service logs or use the x-mia-debug header if using the Nginx API gateway. Configuring an endpoint without security checks does not mean that an invalid client-key will be accepted.

### [Merging Branches in Mia-Platform](https://github.com/mia-platform/community/discussions/34)
#### How does the "Merge" feature in the Mia-Platform console work when merging configuration branches?
The "Merge" feature in the Mia-Platform console does not perform a traditional Git merge. Instead, it merges different configurations, including resources, extensions, and other files.

### How do I update the Console?
#### How can I update the Console for both PaaS and on-premise installations?
If you're using **Mia-Platform PaaS**, the Console updates automatically. For **on-premise installations**, contact your Mia-Platform referent to use the appropriate Helm chart as indicated in the [release notes](/release-notes/versions.md).

### Can I deploy selected microservices only?
#### Is it possible to deploy only certain microservices instead of the entire project?
No, deployment releases the entire project configuration. However, before deploying, you can compare the services being released with those currently running in the environment. See the [details here](/development_suite/deploy/overview.md#compare-services).

### How do I scale a microservice?
#### What are the options for scaling a microservice?
You can configure autoscaling directly in the Console by [configuring Replicas](/development_suite/api-console/api-design/replicas.md) or manually [editing the configuration](/development_suite/api-console/api-design/replicas.md#how-to-scale-services-manually).

### Can I remotely debug a microservice?
#### Is remote debugging of a microservice recommended?
We recommend focusing on writing good **tests** rather than remote debugging. Use [logs](/development_suite/monitoring/introduction.md) to understand microservice behavior. Additionally, you can deploy microservices in a dedicated environment via the Console for immediate online testing.

### Can I deploy an external microservice?
#### How can I deploy a microservice from a Docker image?
Yes, you can create a [microservice from a Docker Image](/development_suite/api-console/api-design/services.md#how-to-create-a-microservice-from-a-docker-image). The Docker Image must be pre-built and available in a registry. For **Mia-Platform PaaS**, supported registries are [Nexus](https://www.sonatype.com/nexus/repository-oss) and [Docker Hub](https://www.docker.com/products/docker-hub). For **on-premise installations**, contact your Mia-Platform referent.

### Do I have to start coding my microservice from a template?
#### Is starting from a Mia-Platform Template mandatory?
No, it's not mandatory. However, starting from a [Mia-Platform Template](/marketplace/templates/mia_templates.md) or using [Mia-Platform Service Libraries](/libraries/mia-service-libraries.md) ensures compliance with best practices.

### Can I create my own templates?
#### How can I create custom templates for my microservices?
Yes, you can. Follow this [guideline](/software-catalog/manage-items/overview.md) and [open an issue with the Marketplace contribution template](https://github.com/mia-platform/community/issues/new?labels=marketplace&template=marketplace-contribution.md&title=Add+new+marketplace+item).

### How can I change the state of a document?
#### What is the process to change the state of a document in CRUD?
You can change a document's state (**PUBLIC**, **DRAFT**, **TRASH**, **DELETED**) by making a POST request. See the [CRUD Service documentation](/runtime_suite/crud-service/10_overview_and_usage.md#state-transitions) for details.

:::tip
Visit the [Documentation Portal](/console/project-configuration/documentation-portal.md) to see your CRUDs APIs documentation.
:::

### How can I hide an endpoint from the API Portal?
#### How do I manage the visibility of an endpoint in the API Portal?
You can change endpoint visibility in the Endpoint Management section by disabling the `Show in API Portal` flag. See [this section](/development_suite/api-console/api-design/endpoints.md#manage-the-visibility-of-your-endpoints) for more details.

### How can I call a proxy endpoint from my microservices?
#### What is the procedure to call a proxy endpoint from a microservice?
[Proxy endpoints](/development_suite/api-console/api-design/proxy.md) are exposed on the [API gateway](/runtime_suite/api-gateway/10_overview.md). You can call them via HTTP requests to the API Gateway: `http://api-gateway:8080/your-endpoint`. You can also use the [Mia-Platform Service Libraries](/libraries/mia-service-libraries.md) to get a proxy towards the API Gateway.

:::tip
Check out the [Mia service Node.js Library documentation](https://github.com/mia-platform/custom-plugin-lib/blob/master/docs/http_client.md) to learn how to call platform services with a proxy object.
:::
