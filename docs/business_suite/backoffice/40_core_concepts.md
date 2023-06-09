---
id: core_concepts
title: Core concepts
sidebar_label: Core concepts
---
## Localization and i18n

Back-kit web components supports localization and internationalization. Component properties that in turn expose any kind
of typography can be easily internationalized by passing a `LocalizedString` (or `LocalizedText`) object containing specific translations according
to [ISO 639-1 codes](https://www.loc.gov/standards/iso639-2/php/code_list.php).

```json
{
  "en": "house",
  "fr": "maison",
  "de": "haus",
  "it": "casa",
  "zh": "房子",
  "ar": "منزل",
  ...
}
```

Fields that support i18n are marked through this guide as taking either `string` or `LocalizedString` as input type.

## Dynamic configuration

Many components allow the user to build *dynamic configurations*. Such configurations are really helpful when an event needs to be aware
of situation-specific data, such as, while clicking a button onto a given table row, the event must be intertwined with data of that row.

To achieve dynamic configurations logic, Back-Kit components use [handlebars syntax](https://handlebarsjs.com/guide/expressions.html) and embed a web component property to register a handlebar template. By default, a string is parsed by the handlebar parser without making any changes to it if no `{{}}`-syntax is present.

For instance, any Back-Kit component is aware of an authenticated user, if any, using the property `currentUser`. When `currentUser` has property `email` with value `my-mail@mail.com`, a configuration such

```json
{
  "user": "{{curentUser.email}}"
}
```

would be equivalent to
```json
{
  "user": "my-mail@mail.com"
}
```

### Helpers

Custom helpers to be used in conjunction with [handlebars](https://handlebarsjs.com/guide/expressions.html) are provided, most components that allow dynamic configurations support them.

#### rawObject

`rawObject` allows to avoid to stringify dynamic values within a configuration.

```json
{
  "url": "/url",
  "method": "POST",
  "body": "{{rawObject data}}"
}
```

`rawObject` signals that the provided dynamic value (`data` in this case) should not be stringified. So, with input data:
```json
{
  "data": {
    "name": "Joe",
    "surname": "Smith"
  }
}
```

the example is equivalent to:
```json
{
  "url": "/url",
  "method": "POST",
  "body": {
    "name": "Joe",
    "surname": "Smith"
  }
}
```

#### rawObjectOrEmptyStr

`rawObjectOrEmptyStr` is equivalent to `rawObject` but, if the input value is not defined, an empty string will be put in place of the dynamic configuration.

#### nFormat

`nFormat` allows to format numeric values specifying number of decimal places, decimal separator, group separator.

For instance, given the dynamic configuration:
```json
{
  "amount1": "$ {{nFormat '2.,' value}}",
  "amount2": "$ {{nFormat '4.,' value}}",
  "amount3": "$ {{nFormat '.,' value}}",
  "amount4": "$ {{nFormat '.' value}}",
  "amount5": "$ {{nFormat '' value}}"
}
```

and input data:
```json
{
  "value": 7654.321
}
```

the resulting configuration is:
```json
{
  "amount1": "7,654.32",
  "amount2": "7,654.3210",
  "amount3": "7,654.321",
  "amount4": "7654.321",
  "amount5": "7654.321"
}
```

### Template - ConfigMap

Some components allow to specify an object with fields `template`-`configMap` instead of a value for their dynamically configurable properties.

```json
{
  "command": {
    "template": "{{color}}",
    "configMap": {
      "red": "stop",
      "yellow": "slow-down",
      "$default": "go"
    }
  }
}
```
The value of `template` is matched against keys of `configMap`. On the first match, the corresponding value in `configMap` is used as value for the dynamic variable.

For instance, with context
```json
{
  "color": "red"
}
```
the above example is equivalent to:
```json
{
  "command": "stop"
}
```

`$default` key in `configMap` can be specified, and is used if no other `configMap` key matches `template`.

### Extracting data from URL - UrlMask

Some components may expose properties that allow to configure a `urlMask`. This leverages [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax to convert a string input (or `mask`) into a regular expression to be matched against the current URL, allowing to extract information from it, making it availbale in dynamic configurations.

`urlMask`s allow to specify masks for the `pathname` and `search` fields of `window.location`.

```typescript
type UrlMask = string | {
  pathname?: string,
  search?: string
}
```

If `urlMask` is a string, it is matched against both pathname and search fields.

#### Example

A `urlMask` such as
```json
{
  "urlMask": {
    "pathname": "/path-name/:field1/:field2",
    "search": "\\?pageSize=:pSize&sortDirection=:sDirection"
  }
}
```

matched againsta a `window.location` like
```json
{
  "pathname": "/path-name/field-1/field-2",
  "search": "?pageSize=25&sortDirection=descend"
}
```

will produce as output
```json
{
  "path": "/path-name/field-1/field-2",
  "params": {
    "field1": "field-1",
    "field2": "field-2"
  }
}
```
from `pathname` and
```json
{
  "path": "?pageSize=25&sortDirection=descend",
  "params": {
    "pSize": "25",
    "sDirection": "descend"
  }
}
```
from `search`.

Some components may allow to ignore part of the URL using wildcards, "(.*)". For instance:
```json
{
  ...
  "urlMask": "\\?pageNumber=:myPageNumber&pageNumber=(.*)"
}
```

## Links

A standard interface is available for encoding external links and href. This interface can be found as building block of
several Back-Kit web components properties.

A basic external href link rendering in a browser new tab can be implemented as

```json
{
  "href": "https://www.mia-platform.eu/",
  "target": "_blank",
  "icon": "fas fa-link"
}
```

Property `href` can either be absolute or relative, `target` can be picked amongst `_blank`, `_self`, `_parent`, `_top`:
most commonly either an href renders into the same window with `_self` or it opens a new tab with `_blank`.

The `icon` properties allow to attach a [Fontawesome fas or far icon](https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular,solid&m=free)
when the link is rendered by a component which support this interface.

A web component that contains state or data might implement [dynamic configurations](#dynamic-configuration). In this case the `href` can be
enriched with query parameters that are bound to the internal state of the component with which the user is interacting.
Suppose the user with email `my-mail@mail.com` is in session, then the following link

```json
{
  "href": "customers",
  "query": {
    "name": "John",
    "createdBy": "admin|{{currentUser.email}}"
  }
}
```

renders the dynamic link `./ingredients?name=John&createdBy=admin%7Cmy-mail%40mail.com`.


## Filters

Back-kit web components refine data queries and data views using filters. Filters can be used to enrich a
[change-query](events#change-query) and are building blocks of many tag properties. A filter is made of three
required build blocks:

1. `property`: the unique identifier of the property they filter
2. `operator`: the operator used to filter (i.e., "equal", "includeSome", ...)
3. `value`: the value or the regex pattern (where it applies) to filter for

Operators and values vary according to the property type which is set by the [data schema](./30_page_layout.md#data-schema).
If a `DataSchema` should be filtered only according with a subset of available operators, a configuration key it available within
the field `filtersOptions`. The key `availableOperators` is an array of string which, if defined, enables only explicitly selected operators on the given field.

### Filter Operators

Filter operators can be selected from the following list:

```typescript
type FilterOperator = |
  'equal' |
  'exists' |
  'notEqual' |
  'greater' |
  'greaterEqual' |
  'less' |
  'lessEqual' |
  'regex' |
  'includeSome' |
  'includeAll' |
  'includeExactly' |
  'notIncludeAny' |
  'between' |
  'notBetween' |
  'hasLengthEqual' |
  'hasLengthGreaterEqual' |
  'hasLengthLessEqual'
```

## Inline queries

Some components allow to filter data based on inline queries - that is, queries that are directly applied to the data in the state
of the component, no call to the backend is performed.

The supported syntax for inline queries is [mongo-like](https://www.mongodb.com/docs/manual/reference/operator/query/), and their implementation is based on the [SiftJS](https://github.com/crcn/sift.js) library.

Supported operators are:
  - [$in](https://www.mongodb.com/docs/manual/reference/operator/query/in/#mongodb-query-op.-in)
  - [$nin](https://www.mongodb.com/docs/manual/reference/operator/query/nin/#mongodb-query-op.-nin)
  - [$exists](https://www.mongodb.com/docs/manual/reference/operator/query/exists/#mongodb-query-op.-exists)
  - [$gte](https://www.mongodb.com/docs/manual/reference/operator/query/gte/#mongodb-query-op.-gte)
  - [$gt](https://www.mongodb.com/docs/manual/reference/operator/query/gt/#mongodb-query-op.-gt)
  - [$lte](https://www.mongodb.com/docs/manual/reference/operator/query/lte/#mongodb-query-op.-lte)
  - [$lt](https://www.mongodb.com/docs/manual/reference/operator/query/lt/#mongodb-query-op.-lt)
  - [$eq](https://www.mongodb.com/docs/manual/reference/operator/query/eq/#mongodb-query-op.-eq)
  - [$ne](https://www.mongodb.com/docs/manual/reference/operator/query/ne/#mongodb-query-op.-ne)
  - [$mod](https://www.mongodb.com/docs/manual/reference/operator/query/mod/#mongodb-query-op.-mod)
  - [$all](https://www.mongodb.com/docs/manual/reference/operator/query/all/#mongodb-query-op.-all)
  - [$and](https://www.mongodb.com/docs/manual/reference/operator/query/and/#mongodb-query-op.-and)
  - [$or](https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or)
  - [$nor](https://www.mongodb.com/docs/manual/reference/operator/query/nor/#mongodb-query-op.-nor)
  - [$not](https://www.mongodb.com/docs/manual/reference/operator/query/not/#mongodb-query-op.-not)
  - [$size](https://www.mongodb.com/docs/manual/reference/operator/query/size/#mongodb-query-op.-size)
  - [$type](https://www.mongodb.com/docs/manual/reference/operator/query/type/#mongodb-query-op.-type)
  - [$regex](https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex)
  - [$elemMatch](https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)

Most components allow queries to include [dynamic values](#dynamic-configuration).
If that is the case, it is the components responsibility to ensure that sufficient context is provided to resolve the query.

For instance, the following query
```json
{
  "$or": [
    {"$name": "{{searchedName}}"},
    {"age": {"$gte": 25}}
  ]
}
```

provided with context:
```json
{
  "searchedName": "Foo"
}
```

is equivalent to:
```json
{
  "$or": [
    {"$name": "Foo"},
    {"age": {"$gte": 25}}
  ]
}
```

Just like a regular mongo query, applying such it to data:
```json
[
  {"name": "Foo", "age": 15},
  {"name": "Bar", "age": 27},
  {"name": "Que", "age": 18},
  {"name": "Asd", "age": 10}
]
```

matches:
```json
[
  {"name": "Foo", "age": 15},
  {"name": "Bar", "age": 27}
]
```

## File Management

Upload and management of files related to a record is handled by 3 components that interact together:

- `bk-file-client`
- `bk-file-manager`
- `bk-form-drawer`

Any file property can be specified in the [data schema](page_layout#data-schema) as:
>
> ``` yaml
> type: 'object'
> format: 'file'
> ```

:::info Currently only "single-file" properties are supported :::

Once a file property is specified in the [data schema](page_layout#data-schema) and its form field is touched the routine will be as follows:

 1. `bk-form-drawer` fires a `create-data-with-file`/`update-data-with-file` event containing the full payload and list of all the `file` properties that have to be uploaded
 2. The above event is handled by the `file-manager` which will proceed to fire an `upload-file` event for each file in the list
 3. The `file-client` handles the `upload-file` event by taking its payload (the file object) and upload it to the file service, upon success will fire an `uploaded-file` event, containing the fileId to be linked to the record
 4. The `file-manager` listens for `uploaded-file` events and links each file to the proper record key, replacing it in the payload that was provided by the `bk-form-drawer`
 5. Once all the files have been uploaded, the `file-manager` fires a `create-data`/`update-data` event with the full payload as the `bk-form-drawer` would have, with the file objects correctly linked

:::caution Upon failure while uploading one file, any new file that was being uploaded in the same transaction (i.e. creating a new record that contained multiple file properties), will be deleted, even if already uploaded, because the final create/update of the record will not be performed :::

:::caution By design, any file that is unlinked from the record when updating an entry, isn't deleted from the file-service :::
