---
id: events
title: Events
sidebar_level: Events
---



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

Back-kit registers the following events


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



## R

### Require Confirm

Signals that a certain action requires confirmation to be performed


- Label: `require-confirm-payload`
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

updates multiple data state (__STATE__ or _st) in a dataset


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

### Using Drawer

notifies that a drawer with given ID is currently in use


- Label: `using-drawer`
- Payload:

```typescript
{
  id: string
}
```





