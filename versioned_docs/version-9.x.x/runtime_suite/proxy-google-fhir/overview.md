---
id: overview
title: Proxy Google FHIR
sidebar_label: Overview
---
Proxy Google FHIR is a Mia-Platform plugin that forwards FHIR REST calls to the R4 FHIR implementation of
[Cloud Healthcare API](https://cloud.google.com/healthcare/docs/concepts/fhir).

When the service is instantiated you can go to the API portal and filter your endpoints through the category filter `FHIR`.
Moreover, each resource is labeled with a tag like `FHIR - resourceName`.

## Endpoints
As an example, after resource `Patient` is activated through the environment variable `ACTIVE_RESOURCES`, the following endpoints will
show up in the API Portal:

### GET /Patient
Request
```bash
curl --request GET \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient
```
Response
```json
{
  "entry":[
    {
      "fullUrl":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce",
      "resource":{
        "birthDate":"1980-01-01",
        "gender":"male",
        "id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
        "meta":{
          "lastUpdated":"2021-10-07T16:48:19.852969+00:00",
          "versionId":"MTYzMzYyNTI5OTg1Mjk2OTAwMA"},
        "name":[{"family":"Cognome","given":["Giovanni"],"use":"official"}],
        "resourceType":"Patient"
      },
      "search":{"mode":"match"}
    }
  ],
  "link":[
    {"relation":"search","url":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/?"},
    {"relation":"first","url":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/?"},
    {"relation":"self","url":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/?"}
  ],
  "resourceType":"Bundle",
  "total":1,
  "type":"searchset"
}
```
### GET /fhir/Patient/{id}
Request
```bash
curl --request GET \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce
```
Response
```json
{
  "birthDate":"1980-01-01",
  "gender":"male",
  "id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
  "meta":{
    "lastUpdated":"2021-10-07T16:48:19.852969+00:00",
    "versionId":"MTYzMzYyNTI5OTg1Mjk2OTAwMA"
  },
  "name":[{"family":"Cognome","given":["Giovanni"],"use":"official"}],
  "resourceType":"Patient"
}
```
### GET /fhir/Patient/{id}/_history
Request
```bash
curl --request GET \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce/_history
```
Response
```json
{
  "entry":[
    {
      "fullUrl":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce",
      "request":{
        "method":"POST",
        "url":"Patient"
      },
      "resource":{
        "birthDate":"1995-12-02",
        "gender":"male",
        "id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
        "meta":{
          "lastUpdated":"2021-10-07T14:25:41.023419+00:00",
          "versionId":"MTYzMzYxNjc0MTAyMzQxOTAwMA"
        },
        "name":[
          {
            "family":"Cognome",
            "given":[
              "Giovanni"
            ],
            "use":"official"
          }
        ],
        "resourceType":"Patient"
      },
      "response":{
        "lastModified":"2021-10-07T14:25:41.023419+00:00",
        "location":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce/_history/MTYzMzYxNjc0MTAyMzQxOTAwMA",
        "status":"200 OK"
      }
    }
  ],
  "resourceType":"Bundle",
  "total":1,
  "type":"history"
}
```

### GET /fhir/Patient/{id}/_history/{vid}
Request
```bash
curl --request GET \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce/_history/MTYzMzYxNjc0MTAyMzQxOTAwMA
```
Response
```json
{
  "birthDate":"1995-12-02",
  "gender":"male",
  "id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
  "meta":{
    "lastUpdated":"2021-10-07T15:15:05.923260+00:00",
    "versionId":"MTYzMzYxOTcwNTkyMzI2MDAwMA"
  },
  "name":[
    {
      "family":"Cognome",
      "given":["Giovanni"],
      "use":"official"
    }
  ],
  "resourceType":"Patient"
}
```

### POST /fhir/Patient
Request
```bash
curl --request POST \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"birthDate":"1995-12-02","gender":"male","name":[{"family":"Cognome","given":["Giovanni"],"use":"official"}],"resourceType":"Patient"}'```
```
Response
```json
{
  "birthDate":"1995-12-02",
  "gender":"male",
  "id":"fc2745c0-c69e-448c-92a3-13a979cdbffa",
  "meta":{
    "lastUpdated":"2021-10-08T08:15:30.015700+00:00",
    "versionId":"MTYzMzY4MDkzMDAxNTcwMDAwMA"
  },"name":[
    {"family":"Cognome","given":["Giovanni"],"use":"official"}
  ],
  "resourceType":"Patient"}
```

### PUT /fhir/Patient/{id}
Request
```bash
curl --request PUT \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce","resourceType":"Patient","birthDate":"1995-12-02","gender":"male","name":[{"family":"Cognome","given":["Giovanni"],"use":"official"}]}'
```
Response
```json
{
  "birthDate":"1995-12-02",
  "gender":"male","id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
  "meta":{
    "lastUpdated":"2021-10-08T08:31:38.750564+00:00",
    "versionId":"MTYzMzY4MTg5ODc1MDU2NDAwMA"
  },
  "name":[
    {
      "family":"Cognome",
      "given":["Giovanni"],
      "use":"official"
    }
  ],
  "resourceType":"Patient"
}
```
### PATCH /fhir/Patient/{id}
Request
```bash
curl --request PATCH \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce \
  --header 'content-type: application/json' \
  --data '[{"op":"replace","path":"/birthDate","value":"1980-01-01"}]'
```
Response
```json
{
  "birthDate":"1980-01-01",
  "gender":"male",
  "id":"ce7384fe-22f7-4721-a1fa-2b7a671544ce",
  "meta":{
    "lastUpdated":"2021-10-08T08:33:30.210386+00:00",
    "versionId":"MTYzMzY4MjAxMDIxMDM4NjAwMA"},
  "name":[
    {"family":"Cognome","given":["Giovanni"],"use":"official"}
  ],
  "resourceType":"Patient"
}
```
### DELETE /fhir/Patient/{id}
Request
```bash
curl --request DELETE \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/Patient/ce7384fe-22f7-4721-a1fa-2b7a671544ce
```
Response
```json
{}
```

### DELETE /fhir/Patient/{id}/$purge
Request
```bash
curl --request DELETE \
  --url 'https://mia-care-demo.preprod.mia-platform.eu/google/fhir/Patient/e33a49c7-e230-41dd-86a3-583f400d0eb7/$purge' \
  --header 'accept: application/json'
```

Response
```json
{}
```

## Independently of active Resources
The following endpoints can be found in the api portal regardless of the FHIR resources that has been activated.

### GET /fhir/Patient/{id}/$everything
Request
```bash
curl --request GET \
  --url 'https://mia-care-demo.preprod.mia-platform.eu/google/fhir/Patient/fc2745c0-c69e-448c-92a3-13a979cdbffa/$everything'
```

Response
```json
{
  "entry":[
    {
    "resource":
      {
        "birthDate":"1995-12-02",
        "gender":"male",
        "id":"fc2745c0-c69e-448c-92a3-13a979cdbffa",
        "meta":{
          "lastUpdated":"2021-10-22T11:59:47.805524+00:00",
          "versionId":"MTYzNDkwMzk4NzgwNTUyNDAwMA"
        },
        "name":[{"family":"Cognome","given":["Giovanni"],"use":"official"}],
        "resourceType":"Patient"
      }
    },
    {
      "resource":{"id":"76727822-93e5-4cb0-83aa-98b744511c4a",
        "meta":{"lastUpdated":"2021-10-22T13:08:24.594157+00:00","versionId":"MTYzNDkwODEwNDU5NDE1NzAwMA"},
        "resourceType":"Procedure",
        "status":"completed",
        "subject":{"reference":"Patient/fc2745c0-c69e-448c-92a3-13a979cdbffa"}
      }
    }
  ],
  "resourceType":"Bundle",
  "total":2,
  "type":"searchset"
}
```

### POST /fhir (batch/transaction operations)
Request
```bash
curl --request POST \
  --url https://mia-care-demo.preprod.mia-platform.eu/google/fhir \
  --header 'content-type: application/fhir+json; charset=utf-8' \
  --data '{"resourceType":"Bundle","id":"bundle-transaction","meta":{"lastUpdated":"2018-03-11T11:22:16Z"},"type":"transaction","entry":[{"resource":{"resourceType":"Patient","name":[{"family":"Smith","given":["Darcy"]}],"gender":"female","address":[{"line":["123 Main St."],"city":"Anycity","state":"CA","postalCode":"12345"}]},"request":{"method":"POST","url":"Patient"}}]}'
```

Response
```json
{
  "entry":[
    {
      "response":{
        "etag":"W/\"MTYzNTE1MTA3MjQzMjAyMTAwMA\"",
        "lastModified":"2021-10-25T08:37:52.432021+00:00",
        "location":"https://mia-care-demo.test.mia-platform.eu/fhir/Patient/e33a49c7-e230-41dd-86a3-583f400d0eb7/_history/MTYzNTE1MTA3MjQzMjAyMTAwMA",
        "status":"201 Created"}
    }
  ],
  "resourceType":"Bundle",
  "type":"transaction-response"
}
```

### GET /fhir/metadata
This endpoint is created regardless of the activated resources and return the capability statement of this specific FHIR implementation.

Request
```bash
curl --request GET \
  --url https://mia-care-demo.test.mia-platform.eu/fhir/metadata
```
Response
``` js
{
  "date":"2021-10-08",
  "description":"FHIR capability statement for the FHIR store specified by the request.",
  "experimental":true,
  "fhirVersion":"4.0.1",
  "format":["json"]
  // + a lot of other properties
}
```
