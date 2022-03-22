---
id: events
title: Events
sidebar_level: Events
---

# Back-Kit Events

`Events` are data structures sent into a communication channel to enable `event-driven` component behavior.
They extend an `any` object and they come as

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
function factory<P = {}, M = {}> (label: string) {
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

is provided. In that case, `src/events/eventRegister.ts` exports an `eventBuilderRegister` map that contains only
registered event generators. It has an `.add(` method which is `idempotent` on a factory with the same label already contained in the register.

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

Following is the list of available events, ordered alphabetically with respect to their `label`.

## A

### Add Filter

delivers data to add a new filter

- Label: `add-filter`
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
  property: string
  value: string | number | boolean | any[]
  applied?: boolean
  name: string
}
```

### Add New

notifies adding a new item

- Label: `add-new`
- Payload:

```typescript
{
  [key: string]: any
}
```

## B

### Nested Navigation State - Back

goes back an arbitrary number of levels of nesting

- Label: `back-state`
- Payload:

```typescript
{
  steps?: number
}
```

## C

### Change Filter

delivers data on an edited filter

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
  property: string
  value: string | number | boolean | any[]
  applied?: boolean
  name: string
}
```

### Change Query

requires a modification of the currently viewed dataset (filtering, sorting, paging)

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
    property: string
    value: string | number | boolean | any[]
    applied?: boolean
    name: string
  }
  date?: string
  view?: string
}
```

### Count Data

sends count and pagination of current dataset

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

notifies the request for creation of a new item and carries its value

- Label: `create-data`
- Payload:

```typescript
{
  [key: string]: any
}
```

### Create Data With File

create data that have one or more files within their properties,
 the current file property is set into meta

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

notifies the request for deletion of an item

- Label: `delete-data`
- Payload:

```typescript
{
  [key: string]: any
}
```

### Delete File

notifies that a given file, identified by its unique id, must be deleted

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

notifies that a given file was deleted, carries a transaction ID to rollback

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

carries a dataset

- Label: `display-data`
- Payload:

```typescript
{
  data: any
}
```

### Nested Navigation State - Display

displays data or a slice of data

- Label: `display-state`
- Payload:

```typescript
Array<{
  data: Record<string, any>[]
  from?: number
  to?: number
}>
```

### Download File

notifies that a given file must be downloaded. Payload could be either the file identifier or a structure that contains it.
In the latter case, the object property to find the file must be set into the meta. It carries transaction ID to rollback

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
}
```

### Downloaded File

notifies that a given file was downloaded, carries a transaction ID to rollback

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

notifies the request for duplication of an item and carries its value

- Label: `duplicate-data`
- Payload:

```typescript
{
  [key: string]: any
}
```

## E

### Error

notifies a generic error event

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
}
```

### Export Data

raised when the export button is clicked

- Label: `export-data`
- Payload:

```typescript
{}
```

## S

### Success

notifies a successful action

- Label: `success`
- Payload:

```typescript
{}
```

- Meta:

```typescript
{
  triggeredBy: string
}
```

### Selected Data

notifies that a single datum has been selected from a dataset

- Label: `selected-data`
- Payload:

```typescript
{
  data: {
    [key: string]: any
  }
}
```

### Select Data Bulk

notifies data selection in a dataset

- Label: `selected-data-bulk`
- Payload:

```typescript
{
  data: Array<{
    [key: string]: any
  }>
}
```

## F

### Filter

notifies opening of UI component that handles form creation

- Label: `filter`
- Payload:

```typescript
{}
```

## L

### Link File To Record

sends file upload data

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

notifies whether dataset is loading or not. It also advices that a dataset may be inbound

- Label: `loading-data`
- Payload:

```typescript
{
  loading: boolean
}
```

### Lookup Data

carries lookup data information and dataset

- Label: `lookup-data`
- Payload:

```typescript
{
  [key: string]: any[]
}
```

### Lookup Live Found

fired when options for a Select form input are found

- Label: `lookup-live-found`
- Payload:

```typescript
{
  [key: string]: any[]
}
```

### Lookup Live Searching

fired upon searching on a Select form input

- Label: `lookup-live-searching`
- Payload:

```typescript
{
  property: string
  input: string
}
```

## P

### Nested Navigation State - Push

adds a new level of nesting

- Label: `push-state`
- Payload:

```typescript
{
  data: Record<string, any>[]
  origin: Record<string, any>
  selectedKey?: string
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
}
```

## U

### Update Data

notifies the request for creation of a new item and carries its value

- Label: `update-data`
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

### Update Data With File

update data that have one or more files within their properties, the current file property is set into meta

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

updates multiple data state (`__STATE__` or `_st`) in a dataset

- Label: `update-state-bulk`
- Payload:

```typescript
{
  rows: any[]
  newState: string
}
```

### Upload File

requests the upload of a file and carries its data. [File](https://developer.mozilla.org/en-US/docs/Web/API/File)

- Label: `upload-file`
- Payload:

```typescript
{
  file: File
}
```

### Uploaded File

returns file upload metadata, typically when storing on an external service like [files-service](https://docs.mia-platform.eu/docs/runtime_suite/files-service/configuration)

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

notifies that a form container with given ID is currently in use

- Label: `using-form-container`
- Payload:

```typescript
{
  id: string
}
```
