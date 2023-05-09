---
id: configuration
title: Proxy Google FHIR Configuration
sidebar_label: Configuration
---
This service proxies FHIR HTTP calls to [Cloud Healthcare API](https://cloud.google.com/healthcare/docs/concepts/fhir).

## Environment variables

The service needs the following environment variables:
- **GOOGLE_APPLICATION_CREDENTIALS** (required): JSON returned by Google Cloud Console with the credentials to authenticate 
  as a service account. It should be created as Console level environment variable;
- **FHIR_STORE_URL** (required): URL of the fhir store created through Google Cloud Console. It should be created as 
  Console level environment variable;
- **FHIR_PLATFORM_URL** (required): base URL to use in the response payload instead of that of Google. It should be created as public variable;
- **ACTIVE_RESOURCES** (required): Names of FHIR resources to be used, comma separated names;

### Credentials
The credential must follow this schema:
```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "project_id": {
      "type": "string"
    },
    "private_key_id": {
      "type": "string"
    },
    "private_key": {
      "type": "string"
    },
    "client_email": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    },
    "auth_uri": {
      "type": "string"
    },
    "token_uri": {
      "type": "string"
    },
    "auth_provider_x509_cert_url": {
      "type": "string"
    },
    "client_x509_cert_url": {
      "type": "string"
    }
  }
}
```
In order to use the `$purge` operator, it's required to add the role `Healthcare FHIR Store Administrator` to the service account through the Google Cloud Console (IAM & Admin).
### FHIR store URL
This URL should match the following format
```html
https://healthcare.googleapis.com/v1/projects/:progect_name/locations/:geographical_location/datasets/:dataset_name/fhirStores/:fhir_store_name
```
### FHIR platform URL
This URL should be the base path you use when calling the proxy service, for example:
```html
https://[project_console_name].[environment].mia-platform.eu
```

### FHIR resources
An example of value for `ACTIVE_RESOURCES` can be `Patient,Practitioner,Procedure`. If one or more of the
resources names are incorrect, then the server will fail to start.

## FHIR category in API Portal
In order to explore the endpoints belonging to the activated FHIR resources in a simpler way, it's possible to group them
in a category that can be selected.
To define the category you can go in the `Advanced` section of the Console and under `swagger-aggregator` --> `swagger-aggregator.json`
copy the following configuration:
```json
{
  "subswaggers": {
    "/fhir-category.json": {
      "name": "FHIR endpoints",
      "tagName": "FHIR endpoints",
      "expression": "Boolean(tags) && 'FHIR' in tags"
    }
  }
}
```
