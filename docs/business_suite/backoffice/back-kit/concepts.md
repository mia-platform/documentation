---
id: concepts
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
configuration **should** never interact with this property directly, since it is injected by the __element-composer__ on
configuration parsing. Anyway components mark this property as *immutable* and JavaScript should not be able to tamper with it.

### Filters

Back-kit web components refine data queries and data views using filters. Filters can be used to enrich a 
[change-query](events/events.md#change-query) and are building blocks of many tag properties. A filter is made of three 
required build blocks:

1. `property`: the unique identifier of the property they filter
2. `operator`: the operator used to filter (i.e., "equal", "includes", ...)
3. `value`: the value or the regex pattern (where it applies) to filter for

Operators and values vary according to the property type which is set by the [data schema](layout.md#data-schema).
