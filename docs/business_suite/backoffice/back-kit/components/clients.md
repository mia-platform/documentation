---
id: clients
title: Clients
sidebar_level: Clients
---



Clients manage interactions between the current page and other services. Typical use case encompasses http request managers,
data retrieval facilities from any given resource, CRUD services, and state stores. Clients components ensure isolation between
logical/business features and allow services encapsulation and adaption

## Configuration edge cases

In case `__STATE__` must be finely controlled upon creation/duplication/patching, some care must be taken while configuring.
As per `CRUD-Service` interface, `__STATE__` cannot be patched and requires a reserved endpoint call. Hence, no BO configuration
leads to patch with `__STATE__` included as part of the `$set` body.

`__STATE__` though can be tuned upon creation and duplication. The default behavior is

- on creation if not specified, `__STATE__` defaults to its CRUD collection default, i.e. no param is passed along with the HTTP request
- on duplication, to ensure, backward compatibility, HTTP post is performed without `__STATE__` param defaulting again according with CRUD collections default

This behavior can be overridden using the `bk-crud-client` props `keepStateWhileDuplicating`.
If set to `true` it will carry along the `__STATE__` of the original item duplicating it as well.

A good configuration could be (in case `__STATE__` must be tunable by the user and carry duplication `__STATE__` along),

- in the `dataSchema`:

```json
{
  "__STATE__": {
    "type": "string",
    "label": "CRUD State",
    "default": "PUBLIC",
    "enum": ["PUBLIC", "DRAFT", "TRASH"],
    "formOptions": {
      "hiddenOnSelect": true
    },
    ...
  }
}
```

- in the `bk-crud-client`:

```json
{
  "type": "element",
  "tag": "bk-crud-client",
  "properties": {
    ...
    "keepStateWhileDuplicating": true,
    "dataSchema": {
      "$ref": "dataSchema"
    }
  }
}
```

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
|`bootstrapTimeout`|`bootstrap-timeout`|number| - | - |TIMEOUT|value in ms before default bootstrap starts and no `change-query` was received|
|`dataSchema`| - |DataSchema| - | - | - |[data schema](../layout.md#data-schema) describing which field to retrieve from CRUD collection|
|`enableDefinitiveDelete`|`enable-definitive-delete`|boolean| - | - |false|when `true`, http DELETE cannot be rolled back|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`keepStateWhileDuplicating`|`keep-state-while-duplicating`|boolean| - | - |false|if `true` duplicate will keep the original record `__STATE__`|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[create-data](../events/events.md#create-data)|sends a `POST` to the `CRUD` service base path|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[update-data](../events/events.md#update-data)|sends a `PATCH` to the `CRUD` service base path|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[delete-data](../events/events.md#delete-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`|[success](../events/events.md#success)|[error](../events/events.md#error)|
|[change-query](../events/events.md#change-query)|sends `GET`s with endpoints `/` and `/count` to the `CRUD` service base path|[success](../events/events.md#success), [count-data](../events/events.md#count-data), [display-data](../events/events.md#display-data), [selected-data-bulk](../events/events.md#selected-data-bulk)|[error](../events/events.md#error)|

### Emits

| event | description |
|-------|-------------|
|[loading-data](../events/events.md#loading-data)|raise awareness of incoming data|
|[display-data](../events/events.md#display-data)|contains data organized according with `crud-client`'s `schema` property|
|[count-data](../events/events.md#count-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`contains the `total` amount of document retrieved and the collection pagination offset|
|[error](../events/events.md#error)|contains http error messages when something goes wrong|
|[success](../events/events.md#success)|notifies a successful http request|

### Bootstrap

This component does not use bootstrap.

## Lookup Client

resolves lookups from a given data schema onto a given source

```html
<bk-crud-lookup-client></bk-crud-lookup-client>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`allowLiveSearchCache`|`allow-live-search-cache`|boolean| - | - |false|allows to cache results of live-search queries. Cache lasts as long as the component lives|
|`basePath`|`base-path`|string|true| - | - |API endpoint for HTTP calls|
|`dataSchema`| - |DataSchema|true| - | - |[data schema](../layout.md#data-schema) describing which field to retrieve from CRUD collection|
|`headers`| - |{ [x: string]: string; }| - | - | - | - |
|`lookupDataLimit`|`lookup-data-limit`|number| - | - |25|limit data to require in a single lookup chunk|
|`lookupDefaultState`| - |CrudState[] \\| string \| string[]| - | - |['PUBLIC', 'DRAFT', 'TRASH']|default states to append on lookup queries. Lookup queries will overwrite this setting when required by the data schema|
|`maxQueryURLLength`|`max-query-urllength`|number| - | - |1500|external lookups might require a long query parameter. According with your base path trim it to a maximum using this prop|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[display-data](../events/events.md#display-data)|validates and resolves the lookup data|[success](../events/events.md#success), [lookup-data](../events/events.md#lookup-data)| - |
|[lookup-live-searching](../events/events.md#lookup-live-searching)|fetches lookup options|[lookup-live-found](../events/events.md#lookup-live-found)|[error](../events/events.md#error)|

### Emits

| event | description |
|-------|-------------|
|[lookup-data](../events/events.md#lookup-data)|contains lookup data|
|[lookup-live-found](../events/events.md#lookup-live-found)|notifies successful fetching of lookup options|
|[success](../events/events.md#success)|notifies a successful lookup request|
|[error](../events/events.md#error)|contains http error messages when something goes wrong|

### Bootstrap

- This component doesn't parse URL parameters.
- This component emits a `lookup-data` event on lookup resolution.

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

This component does not use bootstrap.

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
|[http-success](../events/events.md#http-success)|terminate a successful registered transaction| - | - |
|[update-data-with-file](../events/events.md#update-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events/events.md#upload-file)| - |
|[create-data-with-file](../events/events.md#create-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events/events.md#upload-file)| - |
|[create-data-with-file](../events/events.md#create-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events/events.md#upload-file)| - |
|[uploaded-file](../events/events.md#uploaded-file)|continues an `update-data-with-file` transaction by patching the `crud` collection with the `upload-file` metadata|[update-data](../events/events.md#update-data)| - |
|[error](../events/events.md#error)|interrupts a registered transaction due to an occurred `error` event carrying a `meta`. If the file was stored but the collection wasn't successfully patched, then the file is deleted|[delete-file](../events/events.md#delete-file)| - |

### Emits

| event | description |
|-------|-------------|
|[upload-file](../events/events.md#upload-file)|contains file and metadata to be stored|
|[update-data](../events/events.md#update-data)|after storage, contains reference metadata used to patch a collection containing reference to such file|
|[create-data](../events/events.md#create-data)|after storage, contains reference metadata used to create an item into collection containing reference to such file|
|[create-data](../events/events.md#create-data)|after storage, contains reference metadata used to create an item into collection containing reference to such file|
|[delete-file](../events/events.md#delete-file)|contains file metadata to trigger file deletion|

### Bootstrap

This component does not use bootstrap.

## Export

crud-service export webcomponent

```html
<bk-export></bk-export>
```

<!-- 
  ## bk-export
-->

`bk-export` **extends** `back-kit-engine`'s BkHttpBase

`bk-export` client is a business-logic webcomponent that handles the export of an entire collection from a backend CRUD-service resource.
It works as `ndjson` fetcher as well as native file downloader which uses browser download native API.

If export must be performed on a [CRUD-service] resource, an export route is available at `<collection-name>/export` and supports 
mongoDB queries as per CRUD-service specifications, along with `__STATE__` filtering.

`bk-export` listens to any filtering done on the plugin is mounted in by accessing any [change-query](../events/events.md#change-query) event 
and by keeping an internal representation of all applied filter.

`bk-export` listens also to an [export-data](../events/events.md#export-data) which triggers a http GET request.

Export modes are controlled by the boolean prop `nativeDownload`:

- when `false`, it performs an http GET and parses the content as ndjson
- when `true`, it delegates to the browser API by creating and clicking an anchor tag with the url specified by the `basePath` property

:::caution

in order to handle large sized file, on CRUD export data, a service worker is registered to perform local storage persistance operations instead of using large chunks of memory. To do so an external [resource] is needed. You can also use the same resource hosted with `back-kit` JS bundle available at `<back-kit endpoint>/export-service-worker.html`.
In the latter case set `streamSaverIFrameSrc` to the resource endpoint

:::

[CRUD-service]: https://docs.mia-platform.eu/docs/runtime_suite/crud-service/overview_and_usage
[resource]: https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |DataSchema| - |[data schema](../layout.md#data-schema) describing which field to retrieve from CRUD collection |
|`nativeDownload`|`native-download`|boolean| - |when `true` it skips frontend blob parsing and uses browser native download API |
|`streamSaverIFrameSrc`|`stream-saver-iframe-src`|string| - |location where stream saver service worker files are served |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|`change-query`|updates internal representation of current query| - | - |
|`export-data`|triggers data export| - | - |

### Emits

This component emits no event.

### Bootstrap

This component does not use bootstrap.
