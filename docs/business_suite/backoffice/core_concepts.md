---
id: core_concepts
title: Core concepts
sidebar_label: Core concepts
---
## Localization and i18n

Back-kit web components supports localization and internationalization. Component properties that in turn expose any kind
of typography can be easily internationalized by passing a `LocalizedString` object containing specific translations according
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

## Queries

Many components allow the user to build *dynamic queries*. Such queries are really helpful when an event needs to be aware
of situation-specific data, such as, while clicking a button onto a given table row, the event must be intertwined with
data of that row. In general, dynamic query output compiles to a URL query part.

To achieve dynamic query logic, Back-Kit components use [handlebars syntax](https://handlebarsjs.com/guide/expressions.html)
and embed a web component property (often called `query`) to register a handlebar template. By default, a string is parsed
by the handlebar parser without making any changes to it if no `{{}}`-syntax is present.

For instance, any Back-Kit component is aware of an authenticated user, if any, using the property `currentUser`. When
`currentUser` has property `email` with value `my-mail@mail.com`, a query with syntax

```json
{
    "user": "{{curentUser.email}}"
}
```

would compile to a string `"user=my-mail%40mail.com"`.

:::caution
Notice that handlebar compilation is always URL encoded.
:::

Rather complex queries can be built using handlebars while combining it with raw syntax. Queries are also well suited to
transfer state between pages.

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

A web component that contains state or data might implement [dynamic queries](#queries). In this case the `href` can be
enriched with query parameters that are bound to the internal state of the component that the user is interacting with.
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

## Shared Properties

Back-kit web components always retain an `eventBus` property. For this reason it is not listed on components. Moreover,
configuration **should** never interact with this property directly, since it is injected by the **element-composer** on
configuration parsing. Anyway components mark this property as *immutable* and JavaScript should not be able to tamper with it.

### Filters

Back-kit web components refine data queries and data views using filters. Filters can be used to enrich a
[change-query](events#change-query) and are building blocks of many tag properties. A filter is made of three
required build blocks:

1. `property`: the unique identifier of the property they filter
2. `operator`: the operator used to filter (i.e., "equal", "includeSome", ...)
3. `value`: the value or the regex pattern (where it applies) to filter for

Operators and values vary according to the property type which is set by the [data schema](page_layout#data-schema).
If a `DataSchema` should be filtered only according with a subset of available operators, a configuration key it available within
the field `filtersOptions`. The key `availableOperators` is an array of string which, if defined, enables only explicitly selected operators on the given field.
Operators can be selected from the following list:

```typescript
type FilterFormOperator = |
  'equal' |
  'doesNotEqual' |
  'contains' |
  'startsWith' |
  'endsWith' |
  'between' |
  'before' |
  'beforeOrEqual' |
  'on' |
  'notOn' |
  'after' |
  'afterOrEqual' |
  'is' |
  'isNot' |
  'greater' |
  'greaterOrEqual' |
  'less' |
  'lessOrEqual' |
  'includesAll' |
  'includesSome' |
  'includesExactly' |
  'doesNotInclude' |
  'hasLengthEqual' |
  'hasLengthGreaterEqual' |
  'hasLengthLessEqual'
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
