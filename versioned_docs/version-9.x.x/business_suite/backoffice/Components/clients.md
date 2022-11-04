---
id: clients
title: Clients
sidebar_label: Clients
---
<!-- 
  The description below must give a general idea about what `clients` do
-->

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


## bk-crud-client

Manages http requests to a `MongoDB CRUD` service. Also it handles query mapping to conform to Mia's `CRUD` specifications.

:::info
This web component is designed to handle `CRUD` operations towards [Mia-Platform CRUD Service](../../../runtime_suite/crud-service/overview_and_usage).
:::

```html
<bk-crud-client></bk-crud-client>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`appendTrailingSlash`|`append-trailing-slash`|boolean|true|should append a trailingSlash to URLs |
|`bootstrapTimeout`|`bootstrap-timeout`|number|TIMEOUT|value in ms before default bootstrap starts and no `change-query` was received |
|`dataSchema`| - |ExtendedJSONSchema7Definition|...|[data schema](../page_layout#data-schema) describing which field to retrieve from CRUD collection |
|`enableDefinitiveDelete`|`enable-definitive-delete`|boolean|false|when `true`, http DELETE cannot be rolled back |
|`initialEvent`| - |ChangeQueryPayload|INITIAL_EVENT|in case of no `change-query` received, an initial event with this payload will be thrown |
|`keepStateWhileDuplicating`|`keep-state-while-duplicating`|boolean|false|if `true` duplicate will keep the original record __STATE__ |
|`shouldIncludeProjections`|`should-include-projections`|boolean|true|should append projection when exporting from CRUD service |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[create-data](../events#create-data)|sends a `POST` to the `CRUD` service base path|[success](../events#success)|[error](../events#error)|
|[update-data](../events#update-data)|sends a `PATCH` to the `CRUD` service base path|[success](../events#success)|[error](../events#error)|
|[delete-data](../events#delete-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`|[success](../events#success)|[error](../events#error)|
|[change-query](../events#change-query)|sends `GET`s with endpoints `/` and `/count` to the `CRUD` service base path|[success](../events#success), [count-data](../events#count-data), [display-data](../events#display-data), [selected-data-bulk](../events#selected-data-bulk)|[error](../events#error)|

### Emits


| event | description |
|-------|-------------|
|[loading-data](../events#loading-data)|raise awareness of incoming data|
|[display-data](../events#display-data)|contains data organized according with `crud-client`'s `schema` property|
|[count-data](../events#count-data)|sends a `PATCH` to the `CRUD` service base path on `state` endpoint, if `enableDefinitiveDelete` is `true` it sends a `DELETE`contains the `total` amount of document retrieved and the collection pagination offset|
|[error](../events#error)|contains http error messages when something goes wrong|
|[success](../events#success)|notifies a successful http request|

### Bootstrap

None

## bk-crud-lookup-client

resolves lookups from a given data schema onto a given source

```html
<bk-crud-lookup-client></bk-crud-lookup-client>
```

### Description

The `bk-crud-lookup-client` provides support to resolve `lookups`. The provided behavior is quite
alike to SQL join resolution, but on a frontend client.

Let's say our data schema, as JSON schema description, looks like:

```json
{
  "$defs": {
    ...,
    "city": {
      "type": "string",
      "lookupOptions": {
        "lookupDataSource": "cities",
        "lookupValue": "_id",
        "lookupFields": ["name"]
      }
    }
  },
  "dataSchema": {
    "type": "object",
    "properties": {
      "_id": "#/$defs/_id",
      "city": "#/$defs/city",
      "addresses": {
        "type": "array",
        "items": {
          "address1": "#/$defs/address1",
          "city": "#/$defs/city"
        }
      }
    }
  }
}
```

hence `city` is a lookup from another collection called by both first and second level of
an item described by the previous data schema.

`bk-crud-lookup-client` will perform a recursive analysis on the data schema. Starting from a given data sample

```json
[
  {
    "_id": "1",
    "city": "city_1",
    "addresses": [
      {
        "address1": "12 Byron St.",
        "city": "city_124"
      },
      {
        "address1": "1 Batman Rd.",
        "city": "city_124"
      }
    ]
  }
]
```

it will fetch a projection `lookupFields` of `lookupDataSource`

```
city_1 -> Sydney
city_124 -> Melbourne
```

and emit a `lookup-data` event with a resolved partial data structure as payload

```json
[
  {
    "city": "Sydney",
    "addresses": [
      {
        "city": "Melbourne"
      },
      {
        "city": "Melbourne"
      }
    ]
  }
]
```

such structure can be compared with the original datum, which is not modified.


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`allowLiveSearchCache`|`allow-live-search-cache`|boolean|false|allows to cache results of live-search queries. Cache lasts as long as the component lives |
|`dataSchema`| - |ExtendedJSONSchema7Definition|...|[data schema](../page_layout#data-schema) describing which field to retrieve from CRUD collection |
|`extraLookupKeys`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing which extra field (not included in dataschema) to retrieve from CRUD collection |
|`lookupDataLimit`|`lookup-data-limit`|number|25|limit data to require in a single lookup chunk |
|`lookupDefaultState`| - |string \\| string[] \| CrudState[]|...|default states to append on lookup queries. Lookup queries will overwrite this setting when required by the data schema |
|`maxQueryURLLength`|`max-query-urllength`|number|1500|external lookups might require a long query parameter. According with your base path trim it to a maximum using this prop |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[display-data](../events#display-data)|validates and resolves the lookup data|[success](../events#success), [lookup-data](../events#lookup-data)| - |
|[nested-navigation-state/display](../events#nested-navigation-state---display)|validates and resolves the lookup data upon navigating into a nested object|[success](../events#success), [lookup-data](../events#lookup-data)| - |
|[lookup-live-searching](../events#lookup-live-searching)|fetches lookup options|[lookup-live-found](../events#lookup-live-found)|[error](../events#error)|
|[search-lookups](../events#search-lookups)|fetches values from multiple lookups|[search-lookups-found](../events#search-lookups-found)|[error](../events#error)|

### Emits


| event | description |
|-------|-------------|
|[lookup-data](../events#lookup-data)|contains lookup data|
|[lookup-live-found](../events#lookup-live-found)|notifies successful fetching of lookup options|
|[search-lookups-found](../events#search-lookups-found)|notifies successful fetching of lookups values|
|[success](../events#success)|notifies a successful lookup request|
|[error](../events#error)|contains http error messages when something goes wrong|

### Bootstrap

None

## bk-export

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

`bk-export` listens to any filtering done on the plugin is mounted in by accessing any [change-query](../events#change-query) event 
and by keeping an internal representation of all applied filter.

`bk-export` listens also to an [export-data](../events#export-data) which triggers a http GET request.

Export modes are controlled by the boolean prop `nativeDownload`:

- when `false`, it performs an http GET and parses the content as ndjson
- when `true`, it delegates to the browser API by creating and clicking an anchor tag with the url specified by the `basePath` property

:::caution

in order to handle large sized file, on CRUD export data, a service worker is registered to perform local storage persistance operations instead of using large chunks of memory. To do so an external [resource] is needed. You can also use the same resource hosted with `back-kit` JS bundle available at `<back-kit endpoint>/export-service-worker.html`.
In the latter case set `streamSaverIFrameSrc` to the resource endpoint

:::

[CRUD-service]: ../../../runtime_suite/crud-service/overview_and_usage
[resource]: https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`dataSchema`| - |ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing which field to retrieve from CRUD collection |
|`nativeDownload`|`native-download`|boolean| - |when `true` it skips frontend blob parsing and uses browser native download API |
|`shouldIncludeProjections`|`should-include-projections`|boolean|false|should append projection when exporting from CRUD service |
|`streamSaverIFrameSrc`|`stream-saver-iframe-src`|string| - |location where stream saver service worker files are served |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|`change-query`|updates internal representation of current query| - | - |
|`export-data`|triggers data export| - | - |

### Emits

This component emits no event.

### Bootstrap

None

## bk-export-client

Frontend client for mia's [Export Service](../../../runtime_suite/export-service/overview)

```html
<bk-export-client></bk-export-client>
```

This component implements the `Export Service` interface on top of `fetch` http client on the browser.

It listens the `EventBus` to record the current state of the page:

1. filters and query changes (that modify data shown by the `bk-crud-client`)
2. counts the currently filtered items
3. counts and records the user selection on a table

According with `Export Service` it provides 2 modes:

1. CSV
2. Excel

To open an export transaction it listens to an `export-data` event and return an `export-data/awaiting-config`
event which carries along the following payload

```typescript
export type AwaitUserConfig = {
  total?: number
  selected?: number
  columns: Option[]
}
```

where `total` is the last count of queried items, `selected` is the count of currently selected items and 
`columns` are selectable columns from the `DataSchema`

a `Meta` contains the `transactionId` and must be re-cast when options are selected. An `export-data/user-config`
event must then follow with payload

```typescript
export type ExportUserConfig = {
  exportType: 'csv' | 'xlsx'
  csvSeparator?: 'COMMA' | 'SEMICOLON'
  filters: 'all' | 'filtered' | 'selected'
  columns: string[]
}
```

Once the config is received, the http client calls the `Export Service` and the download is completed natively by
a service worker registered within the browser. The UI is not locked.

To allow notifications in case of failure an `error` event is triggered.
Add to `bk-notifications` the following error trigger

```json
{
  ...,
  "errorEventMap": {
    "export-data": {
      "title": "Error",
      "content": "An error occurred while exporting data"
    },
    ...
  }
}
```


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`exportInternalUrl`|`export-internal-url`|string| - |url to be called internally to get `jsonl` formatted data |
|`primaryKey`|`primary-key`|string|'_id'|primary key to filter selected data when `selected only export` option is enabled
|
|`streamSaverIFrameSrc`|`stream-saver-iframe-src`|string| - |location where stream saver service worker files are served |
|`dataSchema`| - |void| - |[data schema](../page_layout#data-schema) describing which field to retrieve from CRUD collection |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[export-data](../events#export-data)|opens a new export transaction|export-data/awaiting-config| - |
|export-data/user-config|according to config, triggers an export|[success](../events#success)|[error](../events#error)|
|[count-data](../events#count-data)|notifies the user on how many items would be exported on `filtered` export option| - | - |
|[select-data-bulk](../events#select-data-bulk)|keeps track of user selections to prompt `selected` export option configuration| - | - |
|[change-query](../events#change-query)|stores current collection filtering| - | - |

### Emits


| event | description |
|-------|-------------|
|export-data/awaiting-config|registers a transaction and awaits for user configs|

### Bootstrap

None

## bk-file-client

manages http requests towards an instance of [Mia Files Service](../../../runtime_suite/files-service/configuration) to upload/download/store files

```html
<bk-file-client></bk-file-client>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`queryParams`| - |Record\<string, any\>|...|queryParams to be passed to the Files Service. According with documentation, it defaults to {"download": 1, "downloadWithOriginalName": 1}. To remove Content-Disposition with name and use it's
_id as name, use only "download"
|

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[upload-file](../events#upload-file)|sends a `POST` request to upload a file|[uploaded-file](../events#uploaded-file)|[error](../events#error)|
|[download-file](../events#download-file)|sends a `GET` request to download/visualize a file|[downloaded-file](../events#downloaded-file)|[error](../events#error)|
|[delete-file](../events#delete-file)|sends a `DELETE` request to remova a file from storage|[deleted-file](../events#deleted-file)|[error](../events#error)|

### Emits


| event | description |
|-------|-------------|
|[uploaded-file](../events#uploaded-file)|notifies successful file upload|
|[downloaded-file](../events#downloaded-file)|notifies successful file download |
|[deleted-file](../events#deleted-file)|notifies successful file deletion|
|[show-in-viewer](../events#show-in-viewer)|requests to visualizes a PDF inside a viewer|
|[success](../events#success)|notifies successful HTTP request|
|[error](../events#error)|contains http error messages when something goes wrong|

### Bootstrap

None

## bk-file-manager

Manages file upload transactions by holding a unique transaction ID hash map. Since files are often linked to a collection entry but stored on a different service, it might be handy to control file upload through a transaction manager. Two steps are needed to successfully upload a file:

1. file upload to storage service (handled by [file-client](#file-client))
2. update CRUD collection (handled by [crud-client](#file-client))

Events marked as *transaction required* must carry a `meta` property with a registered `transactionId`.

```html
<bk-file-manager></bk-file-manager>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|


### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[http-success](../events#http-success)|terminate a successful registered transaction| - | - |
|[update-data-with-file](../events#update-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events#upload-file)| - |
|[create-data-with-file](../events#create-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events#upload-file)| - |
|[create-data-with-file](../events#create-data-with-file)|initiates an upload file transaction attaching a unique ID and attempting upload file to the storage service|[upload-file](../events#upload-file)| - |
|[uploaded-file](../events#uploaded-file)|continues an `update-data-with-file` transaction by patching the `crud` collection with the `upload-file` metadata|[update-data](../events#update-data)| - |
|[error](../events#error)|interrupts a registered transaction due to an occurred `error` event carrying a `meta`. If the file was stored but the collection wasn't successfully patched, then the file is deleted|[delete-file](../events#delete-file)| - |

### Emits


| event | description |
|-------|-------------|
|[upload-file](../events#upload-file)|contains file and metadata to be stored|
|[update-data](../events#update-data)|after storage, contains reference metadata used to patch a collection containing reference to such file|
|[create-data](../events#create-data)|after storage, contains reference metadata used to create an item into collection containing reference to such file|
|[create-data](../events#create-data)|after storage, contains reference metadata used to create an item into collection containing reference to such file|
|[delete-file](../events#delete-file)|contains file metadata to trigger file deletion|

### Bootstrap

None
