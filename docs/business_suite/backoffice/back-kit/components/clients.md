---
id: clients
title: Clients
sidebar_level: Clients
---



Clients manage interactions between the current page and other services. Typical use case encompasses http request managers, 
data retrieval facilities from any given resource, CRUD services, and state stores. Clients components ensure isolation between 
logical/business features and allow services encapsulation and adaption


## Crud Client

Manages http requests to a `MongoDB CRUD` service. Also it handles query mapping to conform to Mia's `CRUD` specifications.

:::info

This web component is designed to handle `CRUD` operations towards [Mia-Platform CRUD Service](https://docs.mia-platform.eu/docs/runtime_suite/crud-service/overview_and_usage).

:::

```html
<bk-crud-client></bk-crud-client>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`basePath`|`base-path`|string| - | - | - |API endpoint for HTTP calls|
|`dataSchema`| - |any| - | - | - |[data schema](../layout.md#data-schema) describing which field to retrieve from CRUD collection|
|`enableDefinitiveDelete`|`enable-definitive-delete`|boolean| - | - |false|when `true`, http DELETE cannot be rolled back|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[create-data](../events/events.md#create-data)|sends a `POST` to the `CRUD` service base path|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[update-data](../events/events.md#update-data)|sends a `PATCH` to the `CRUD` service base path|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[delete-data](../events/events.md#delete-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[change-query](../events/events.md#change-query)|sends `GET`s with endpoints `/` and `/count` to the `CRUD` service base path|[success](../events/events.md#success), [count-data](../events/events.md#count-data), [display-data](../events/events.md#display-data), [selected-data-bulk](../events/events.md#select-data-bulk)|[error](../events/events.md#error)|

### Emits

| event | description |
|-------|-------------|
|[loading-data](../events/events.md#loading-data)|raise awareness of incoming data|
|[display-data](../events/events.md#display-data)|contains data organized according with `crud-client`'s `schema` property|
|[count-data](../events/events.md#count-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`contains the `total` amount of document retrieved and the collection pagination offset|
|[error](../events/events.md#error)|contains http error messages when something goes wrong|
|[success](../events/events.md#success)|notifies a successful http request|

### Bootstrap

None

## Lookup Client

resolves lookups from a given data schema onto a given source

```html
<bk-crud-lookup-client></bk-crud-lookup-client>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`basePath`|`base-path`|string| - | - | - |API endpoint for HTTP calls|
|`dataSchema`| - |DataSchema| - | - | - |[data schema](../layout.md#data-schema) describing which field to retrieve from CRUD collection|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |

### Listens to

This component listens to no event.

### Emits

| event | description |
|-------|-------------|
|[lookup-data](../events/events.md#lookup-data)|contains lookup data|
|[error](../events/events.md#error)|contains http error messages when something goes wrong|
|[success](../events/events.md#success)|notifies a successfull lookup request|

### Bootstrap

- This component doesn't parse URL parameters.
- This component emits a [lookup-data](../events/events.md#lookup-data) event on lookup resolution.

## File Client

manages http requests towards an instance of [Mia Files Service](https://docs.mia-platform.eu/docs/runtime_suite/files-service/configuration) to upload/download/store files

```html
<bk-file-client></bk-file-client>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`basePath`|`base-path`|string| - | - | - |API endpoint for HTTP calls|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[upload-file](../events/events.md#upload-file)|sends a `POST` request to upload a file|[uploaded-file](../events/events.md#uploaded-file)|[error](../events/events.md#error)|
|[download-file](../events/events.md#download-file)|sends a `GET` request to download a file|[downloaded-file](../events/events.md#downloaded-file)|[error](../events/events.md#error)|
|[delete-file](../events/events.md#delete-file)|sends a `DELETE` request to remova a file from storage|[deleted-file](../events/events.md#deleted-file)|[error](../events/events.md#error)|

### Emits

This component emits no event.

### Bootstrap

None

## File Manager

Manages file upload transactions by holding a unique transaction ID hash map. Since files are often linked to a collection entry but stored on a different service, it might be handy to control file upload through a transaction manager. Two steps are needed to successfully upload a file:

1. file upload to storage service (handled by [file-client](#file-client))
2. update CRUD collection (handled by [crud-client](#file-client))

Events marked as *transaction required* must carry a `meta` property with a registered `transactionId`.

```html
<bk-file-manager></bk-file-manager>
```

### Properties & Attributes

This component has no properties.

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
| - |terminate a successful registered transaction| - | - |
|[update-data-with-file](../events/events.md#update-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events/events.md#upload-file)| - |
|[uploaded-file](../events/events.md#uploaded-file)|continues an `update-data-with-file` transaction by patching the `crud` collection with the `upload-file` metadata|[update-data](../events/events.md#update-data)| - |
|[error](../events/events.md#error)|interrupts a registered transaction due to an occurred `error` event carrying a `meta`. If the file was stored but the collection wasn't successfully patched, then the file is deleted|[delete-file](../events/events.md#delete-file)| - |

### Emits

| event | description |
|-------|-------------|
|[upload-file](../events/events.md#upload-file)|contains file and metadata to be stored|
|[update-data](../events/events.md#update-data)|after storage, contains reference metadata used to patch a collection containing reference to such file|
|[delete-file](../events/events.md#delete-file)|contains file metadata to trigger file deletion|

### Bootstrap

None

