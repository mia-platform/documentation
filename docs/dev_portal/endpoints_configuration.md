---
id: endpoints_configuration
title: Endpoints Configuration
sidebar_label: Endpoints Configuration
---

In this paragraph, we will describe the endpoints that must be configured to correctly use the dev portal.

We divided the configuration into macro areas: all these actions must be done in the `Endpoints` section of the console.

:::info
For each endpoint:
1. Create a new endpoint as specified in the **Endpoint** column;
2. Point this URL to the microservice specified in the **Microservice** column;
3. Use the **Rewrite Base Path** specified.
:::

## General configuration

Configure the endpoint exposing the aggregated frontend plugins:

<table style={{textAlign:'left'}}>
  <tr>
    <th width='30%'>Endpoint</th><th width='30%'>Microservice</th><th width='20%'>Rewrite Base Path</th>
  </tr>
  <tr>
    <td>/</td><td>aggregated-dev-portal-frontends</td><td>/</td>
  </tr>
</table>

## Backoffice configuration

Expose the APIs necessary for the creation of the backoffice section:

<table style={{textAlign:'left'}}>
  <tr>
    <th width='30%'>Endpoint</th><th width='30%'>Microservice</th><th width='20%'>Rewrite Base Path</th>
  </tr>
  <tr>
    <td>/back-office/api</td><td>backoffice-micro-lc-backend</td><td>/</td>
  </tr>
  <tr>
    <td>/files</td><td>files-service</td><td>/</td>
  </tr>
</table>

## Dev portal configuration

Expose the APIs necessary for the creation of the dev portal section:

<table style={{textAlign:'left'}}>
  <tr>
    <th width='30%'>Endpoint</th><th width='30%'>Microservice</th><th width='20%'>Rewrite Base Path</th>
  </tr>
  <tr>
    <td>/dev-portal/api</td><td>dev-portal-micro-lc-backend</td><td>/</td>
  </tr>
  <tr>
    <td>/bff</td><td>dev-portal-marketplace-backend</td><td>/</td>
  </tr>
  <tr>
    <td>/docusaurus</td><td>dev-portal-micro-lc-docusaurus</td><td>/</td>
  </tr>
  <tr>
    <td>/documentation/assets</td><td>dev-portal-micro-lc-docusaurus</td><td>/assets</td>
  </tr>
  <tr>
    <td>/dev-portal/documentation/assets</td><td>dev-portal-micro-lc-docusaurus</td><td>/assets</td>
  </tr>
  <tr>
    <td>/dev-portal/api-portal/api</td><td>swagger aggregator</td><td>/</td>
  </tr>
</table>

## CRUD configuration

Expose the following CRUD endpoints, in order to make the marketplace elements configurable on the backoffice:

<table style={{textAlign:'left'}}>
  <tr>
    <th width='26%'>Endpoint</th><th width='26%'>CRUD Collection</th>
  </tr>
  <tr><td>/components</td><td>components</td></tr>
  <tr><td>/categories</td><td>categories</td></tr>
  <tr><td>/requests</td><td>requests</td></tr>
  <tr><td>/icons</td><td>icons</td></tr>
</table>

For each endpoint:
1. Create a new endpoint called as specified;
2. Point this URL to the CRUD with the corresponding name;

## Advanced configuration

For this configuration step, move to the **Advanced** section of the console and select the `api-gateway` microservice.

:::info
These endpoints allow the two micro-lc instances, created respectively for the backoffice and dev portal sections, to exist simultaneously without conflicts.
:::

Search for the following files and paste the content below:

- **maps-proxyUrl.before.map**
```json
# micro-lc dev portal
"~^\w+-/dev-portal/.+/api/v1/microlc(?<path>[/\?].*|$)$" "/v1/microlc$path";

# micro-lc backoffice
"~^\w+-/back-office/.+/api/v1/microlc(?<path>[/\?].*|$)$" "/v1/microlc$path";

# micro-lc user info
"~^\w+-/.+/userinfo(?<path>[/\?].*|$)$" "/userinfo$path";
```

- **maps-proxyName.before.map**
```json
# micro-lc dev portal
"~^(secreted|unsecreted)-1-GET-/dev-portal/.*/api/v1/microlc/.*" "dev-portal-micro-lc-backend";

# micro-lc backoffice
"~^(secreted|unsecreted)-1-GET-/back-office/.*/api/v1/microlc/.*" "backoffice-micro-lc-backend";

# micro-lc user info
"~^(secreted|unsecreted)-1-\w+-/.*/userinfo([/\?].*|$)$" "auth0-client";
```

- **root-location-extension.conf**
```json
location = / {
  include /etc/nginx/customization.d/header-debug.conf;

  return 302 '$original_request_scheme://$original_request_host/dev-portal/';
}

location = /dev-portal {
  include /etc/nginx/customization.d/header-debug.conf;

  return 302 '$original_request_scheme://$original_request_host/dev-portal/';
}

location = /back-office {
  include /etc/nginx/customization.d/header-debug.conf;

  return 302 '$original_request_scheme://$original_request_host/back-office/';
}
```

<br/>

:::caution
Please ignore any red feedback that may appear when pasting this content within the advanced section files.
:::

## Final result

At the end of this configuration, the situation should look like this:

![Final endpoints result](img/final-endpoints-result.png)
