---
id: events
title: Back-Kit Events
sidebar_label: Events
---
[files-service]: /runtime_suite/files-service/configuration.mdx



`Events` are data structures sent into a communication channel to enable `event-driven` component behavior. They extend an `any` object and they come as

```typescript
type Event<P, M> = {
  label: string
  payload: P
  meta?: M
}
```

where `label` is a unique string identifying the event such as `"create-data"` or `"delete-file"`, `payload` contains transactional data and `meta` other data with extra information like what action triggered this event, a transaction ID if there's any and so on.

To create a new `event` within `src/events` there's a `factory` method which is a generic function that takes the `P` and `M` types with the `label`

```typescript
export function factory<P extends Payload = Payload, M extends Meta = Meta> (
  label: string, options: FactoryOptions = {}
): Factory<P, M> {
  ...
}
```

This function generates a function with hybrid prototype that contains:

1. an **event generator**
2. a **predicate** `.is(` to check  whether an event was made with the current generator
3. a **label** which returns the generator and its spawned events label

for instance

```typescript
const addNew = factory<Record<string, never>>('add-new')

const addNewEvent = addNew({})

expect(addNew.is(addNewEvent)).toBeTruthy()
expect(addNew.label).toStrictlyEqual('add-new')
```

There's also the concept of a `register` which automatically adds event is on factory call the constant

``` typescript
const REGISTERED = true
```

is provided. In that case, `src/events/eventRegister.ts` exports an `eventBuilderRegister` map that contains only registered event generators. It has an `.add(` method which is `idempotent` on a factory with the same label already contained in the register.

An `eventBus` conforming event is an object like

```typescript
{
  label: string,
  payload: object,
  meta: object,
}
```

- `label` is a unique event identifier. Standard Back-kit events are always kebab-case idiomatic strings,
- `payload` is an object, possibly empty,
- `meta` helps to keep track of transaction states or enhance event scoping. Meta is not required and its value might be an empty object.

For instance an `upload-file` event looks like:

```typescript
{
  label: "upload-file",
  payload: {
    file: {
      lastModified: 1627457290180,
      lastModifiedDate: "Wed Jul 28 2021 09:28:10 GMT+0200 (Central European Summer Time)",
      name: "file.pdf",
      size: "9090",
      type: "application/json",
      uid: "rc-upload-1630930409639-3"
    }
  },
  meta: {
    transactionId: "97de9662-70aa-48a0-bdee-25113fc66c8f"
  }
}
```

## A

### Add Filter

Delivers data to add a new filter

- Label: `add-filter`
- Payload:
  ```typescript
  {
    operator:
      | "equal"
      | "exists"
      | "notEqual"
      | "greater"
      | "greaterEqual"
      | "less"
      | "lessEqual"
      | "regex"
      | "includeSome"
      | "includeAll"
      | "includeExactly"
      | "notIncludeAny"
      | "between"
      | "notBetween"
      | "hasLengthEqual"
      | "hasLengthGreaterEqual"
      | "hasLengthLessEqual"
    property: string
    value: string | number | boolean | any[]
    applied?: boolean
    name: string
  }
  ```

- Meta:
  ```typescript
  {
    hash: string
  }
  ```

### Add New

Notifies adding a new item

- Label: `add-new`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  ```

### Add New External

Notifies adding a new item on an external collection

- Label: `add-new-external`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  ```

## B

### Bulk update - Boolean and Enums

Allows to modify enums or boolean values from an array of items

- Label: `bulk-update`
- Payload:
  ```typescript
  {
    data: {
      [key: string]: any
    }[]
    changes: {
      [key: string]: string | boolean
    }[]
  }
  ```

## C

### Cancel

Notifies operation abort via a given transactionId

- Label: `event-bus-cancel`
- Payload:
  ```typescript
  {}
  ```

- Meta:
  ```typescript
  {
    transactionId: string
  }
  ```

### Change Filter

Delivers data on an edited filter

- Label: `change-filter`
- Payload:
  ```typescript
  {
    operator:
      | "equal"
      | "notEqual"
      | "greater"
      | "greaterEqual"
      | "less"
      | "lessEqual"
      | "regex"
      | "includeSome"
      | "includeAll"
      | "includeExactly"
      | "notIncludeAny"
      | "between"
      | "hasLengthEqual"
      | "hasLengthGreaterEqual"
      | "hasLengthLessEqual"
    property: string
    value: string | number | boolean | any[]
    applied?: boolean
    name: string
  }
  ```

### Change Query

Requires a modification of the currently viewed dataset (filtering, sorting, paging)

- Label: `change-query`
- Payload:
  ```typescript
  {
    characteristic?: string
    pageNumber?: number
    pageSize?: number
    search?: string
    sortDirection?: SortDirection
    sortProperty?: string
    filters?: {
      operator:
        | "equal"
        | "notEqual"
        | "greater"
        | "greaterEqual"
        | "less"
        | "lessEqual"
        | "regex"
        | "includeSome"
        | "includeAll"
        | "includeExactly"
        | "notIncludeAny"
        | "between"
        | "hasLengthEqual"
        | "hasLengthGreaterEqual"
        | "hasLengthLessEqual"
      property: string
      value: string | number | boolean | any[]
      applied?: boolean
      name: string
    }[]
  }
  ```

### Close Modal

Closes a modal

- Label: `close-modal`
- Payload:
  ```typescript
  {
    modalId: string
  }
  ```

- Meta:
  ```typescript
  {
    sessionId?: string
  }
  ```

### Count Data

Sends count and pagination of current dataset

- Label: `count-data`
- Payload:
  ```typescript
  {
    total: number
    pageSize: number
    pageNumber: number
  }
  ```

### Create Data

Notifies the request for creation of a new item and carries its value

- Label: `create-data`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  ```

### Create Data With File

Create data that have one or more files within their properties, the current file property is set into meta

- Label: `create-data-with-file`
- Payload:
  ```typescript
  {
    data: {
      [key: string]: any
    }
  }
  ```

- Meta:
  ```typescript
  {
    property: string
  }
  ```

## D

### Delete Data

Notifies the request for deletion of an item

- Label: `delete-data`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  | {
    [key: string]: any
  }[]
  ```

### Delete File

Notifies that a given file, identified by its unique id, must be deleted

- Label: `delete-file`
- Payload:
  ```typescript
  {
    file: string
  }
  ```

- Meta:
  ```typescript
  {
    transactionId: string
  }
  ```

### Deleted File

Notifies that a given file was deleted, carries a transaction ID to rollback

- Label: `deleted-file`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  ```

- Meta:
  ```typescript
  {
    transactionId: string
  }
  ```

### Display Data

Carries a dataset

- Label: `display-data`
- Payload:
  ```typescript
  {
    data: any
  }
  ```

### Download File

Notifies that a given file must be downloaded. Payload could be either the file identifier or a structure that contains it. In the latter case, the object property to find the file must be set into the meta. It carries transaction ID to rollback. Allows to request in-browser view of the file.

- Label: `download-file`
- Payload:
  ```typescript
  {
    file?: string
    [key: string]: any
  }
  ```

- Meta:
  ```typescript
  {
    transactionId?: string
    property?: string
    showInViewer?: boolean | "skip-checks"
  }
  ```

### Downloaded File

Notifies that a given file was downloaded, carries a transaction ID to rollback

- Label: `downloaded-file`
- Payload:
  ```typescript
  {
    file: string
  }
  ```

- Meta:
  ```typescript
  {
    transactionId: string
  }
  ```

### Duplicate Data

Notifies the request for duplication of an item and carries its value

- Label: `duplicate-data`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  ```

## E

### Error

Notifies a generic error event

- Label: `error`
- Payload:
  ```typescript
  {
    error: any
  }
  ```

- Meta:
  ```typescript
  {
    triggeredBy: string
    transactionId: string
  }
  ```

### Export Data

Raised when the export button is clicked

- Label: `export-data`
- Payload:
  ```typescript
  {}
  ```

### Export Data - Request Config

Prompts for export configuration payload

- Label: `awaiting-for-export-configuration`
- Payload:
  ```typescript
  {
    total?: number
    selected?: number
    columns: {
      label: string
      value: T
    }[]
  }
  ```

- Meta:
  ```typescript
  {
    transactionId?: string
  }
  ```

### Export Data - User Config

Sends user configuration payload to perform export

- Label: `export-user-config`
- Payload:
  ```typescript
  {
    exportType: "json" | "csv" | "html" | "xlsx"
    csvSeparator?: "COMMA" | "SEMICOLON"
    filters: "all" | "filtered" | "selected"
    columns: string[]
  }
  ```

- Meta:
  ```typescript
  {
    transactionId?: string
  }
  ```

## F

### Filter

Notifies opening of UI component that handles form creation

- Label: `filter`
- Payload:
  ```typescript
  {}
  ```

## H

### Http Delete

Notifies the request for permanent deletion of an item

- Label: `http-delete`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  | {
    [key: string]: any
  }[]
  ```

## I

### Import Data

Notifies the request for an import of data from a file

- Label: `import-data`
- Payload:
  ```typescript
  {}
  ```

### Import Data - User Config

Send the configuration payload to perform an import

- Label: `import-data/user-config`
- Payload:
  ```typescript
  {
    file: File
    encoding?: 'utf8' | 'ucs2' | 'utf16le' | 'latin1' | 'ascii' | 'base64' | 'hex'
    delimiter?: string
    escape?: string
  }
  ```

## L

### Layout Change

Requires a layout change from `bk-layout-container`

- Label: `layout-change`
- Payload:
  ```typescript
  {
    layout: string
  }
  ```

### Link File To Record

Sends file upload data

- Label: `link-file-to-record`
- Payload:
  ```typescript
  {
    data: {
      [key: string]: any
    }
  }
  ```

- Meta:
  ```typescript
  {
    property: string
  }
  ```

### Loading Data

Notifies whether dataset is loading or not. It also advices that a dataset may be inbound

- Label: `loading-data`
- Payload:
  ```typescript
  {
    loading: boolean
  }
  ```

### Lookup Data

Carries lookup data information and dataset

- Label: `lookup-data`
- Payload:
  ```typescript
  {
    [key: string]: any[]
  }
  ```

- Meta:
  ```typescript
  {
    dataOrigin?: string
  }
  ```

### Lookup Live Found

Fired when options for a Select form input are found

- Label: `lookup-live-found`
- Payload:
  ```typescript
  {
    [key: string]: any[]
  }
  ```

### Lookup Live Searching

Fired upon searching on a Select form input

- Label: `lookup-live-searching`
- Payload:
  ```typescript
  {
    property: string
    input: string
  }
  ```

- Meta:
  ```typescript
  {
    limit: number
    input: {
      [key: string]: any[]
    }
    currentValues?: any[]
    keys?: string[]
  }
  ```

## N

### Nested Navigation State - Display

Displays data or a slice of data

- Label: `display-state`
- Payload:
  ```typescript
  Array<{
    data: Record<string, any>[]
    from?: number
    to?: number
  }>
  ```

- Meta:
  ```typescript
  {
    keys?: string[]
  }
  ```

### Nested Navigation State - Go Back

Goes back an arbitrary number of levels of nesting

- Label: `back-state`
- Payload:
  ```typescript
  {
    steps?: number
  }
  ```

### Nested Navigation State - Push

Adds a new level of nesting

- Label: `push-state`
- Payload:
  ```typescript
  {
    data: Record<string, any>[]
    origin: Record<string, any>
    selectedKey?: string
  }
  ```

## O

### Open Modal

Opens a modal

- Label: `open-modal`
- Payload:
  ```typescript
  {
    modalId: string
  }
  ```

- Meta:
  ```typescript
  {
    sessionId?: string
  }
  ```

## R

### Require Confirm

Signals that a certain action requires confirmation to be performed

- Label: `require-confirm`
- Payload:
  ```typescript
  {
    cancelText?: LocalizedText
    content?: LocalizedText
    okText?: LocalizedText
    onCancel?: () => {}
    onOk?: () => {}
    title?: LocalizedText
    configOk?: {
      tag: string
      properties?: Record<string, any>
      children?: string | ReactNode
    }
    configCancel?: {
      tag: string
      properties?: Record<string, any>
      children?: string | ReactNode
    }
  }
  ```

## S

### Search Lookups

Notifies that all lookups having `excludeFromSearch` set to false should be searched against a value

- Label: `search-lookups`
- Payload:
  ```typescript
  {
    input: string
  }
  ```

- Meta:
  ```typescript
  {
    limit: number
  }
  ```

### Search Lookups Found

Fired when values from a text search for lookups are found

- Label: `search-lookups-found`
- Payload:
  ```typescript
  {
    [key: string]: any[]
  }
  ```

- Meta:
  ```typescript
  {
    input: string
  }
  ```

### Selected Data

Notifies that a single datum has been selected from a dataset

- Label: `selected-data`
- Payload:
  ```typescript
  {
    data: {
      [key: string]: any
    }
  }
  ```

### Selected Data Bulk

Notifies data selection in a dataset

- Label: `selected-data-bulk`
- Payload:
  ```typescript
  {
    data: Array<{
      [key: string]: any
    }>
  }
  ```

### Show In Viewer

Notifies the request for starting/updating the visualization of a PDF file

- Label: `show-in-viewer`
- Payload:
  ```typescript
  {
    show: boolean
    url: string
  }
  ```

### Submit Form - Request

Requests submission of form

- Label: `submit-form-request`
- Payload:
  ```typescript
  {}
  ```

- Meta:
  ```typescript
  {
    openingEvent: string
    formId: string
  }
  ```

### Submit Form - Success

Notifies correct submission of form

- Label: `submit-form-success`
- Payload:
  ```typescript
  {}
  ```

- Meta:
  ```typescript
  {
    transactionId?: string
  }
  ```

### Success

Notifies a successful action

- Label: `success`
- Payload:
  ```typescript
  {}
  ```

- Meta:
  ```typescript
  {
    triggeredBy: string
    transactionId: string
  }
  ```

## U

### Update Data

Notifies the request for creation of a new item and carries its value

- Label: `update-data`
- Payload:
  ```typescript
  {
    [key: string]: any
  }
  | {
    [key: string]: any
  }[]
  ```

- Meta:
  ```typescript
  {
    transactionId: string
  }
  ```

### Update Data With File

Update data that have one or more files within their properties, the current file property is set into meta

- Label: `update-data-with-file`
- Payload:
  ```typescript
  {
    data: {
      [key: string]: any
    }
  }
  ```

- Meta:
  ```typescript
  {
    property: string
  }
  ```

### Update State Bulk

Updates multiple data state (__STATE__ or _st) in a dataset

- Label: `update-state-bulk`
- Payload:
  ```typescript
  {
    rows: any[]
    newState: string
  }
  ```

### Upload File

Requests the upload of a file and carries its data. [File][file]

- Label: `upload-file`
- Payload: [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) object

### Uploaded File

Returns file upload metadata, typically when storing on an external service like [files-service]

- Label: `uploaded-file`
- Payload:
  ```typescript
  {
    _id: string
    name: string
    file: string
    size: number
    location: string
  }
  ```

### Using Form Container

Notifies that a form container with given ID is currently in use

- Label: `using-form-container`
- Payload:
  ```typescript
  {
    id: string
  }
  ```
