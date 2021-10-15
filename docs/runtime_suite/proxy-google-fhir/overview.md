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
