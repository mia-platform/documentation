---
id: buttons
title: Buttons
sidebar_label: Buttons
---
<!-- 
  Everything is is attached to the documentation as description
-->

Buttons are scoped by their signature event and often start event-driven processing notifying the `eventBus` about user actions.

## bk-add-filter-button

Notifies other components that a filter needs to be created. Such event could be collected by a `bk-filter-drawer`.

```html
<bk-add-filter-button></bk-add-filter-button>
```

![add-filter-img](../img/bk-add-filter-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../Events/Events#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../Events/Events#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../Events/Events#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[filter](../Events/Events#filter)|notifies the request for creating a filter|

### Bootstrap

None

## bk-add-new-button

this button creates a new item

```html
<bk-add-new-button></bk-add-new-button>
```

![add-new-img](../img/bk-add-new-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`browseOnButtonClick`| - |ClickPayload|{}|when provided with a valid schema, overrides the button JavaScript `onclick` listener handler allowing an `href` linking|
|`initialValues`| - |Payload|{}|arguments to pass upon click |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../Events/Events#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../Events/Events#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../Events/Events#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[add-new](../Events/Events#add-new)|notifies the request for creating a new item|

### Bootstrap

None

## bk-button

A button that is configurable in order to execute a specific action when the onClick event is fired.

:::info

The possible actions are:

- event: push an event into the eventBus
- href: perform a redirect
- push: push a value into browser state
- http: perform an http request

:::

```html
<bk-button></bk-button>
```

# bk-buttons

This button is a generic web component that is fully configurable.

:::info
This button is reachable as `bk-button` or `bk-generic-button`
:::

Also the button is configurable to define an action to be fired when the button is clicked, the possible actions are:

- event: push an event into the eventBus
- href: perform a redirect
- push: push a value into browser state
- http: perform an http request
- file-upload: perform an XHR multipart/form-data file upload

In some cases the configurable onClick action can receive args as parameters that are used to enrich the request, actually the args are managed in this way:

- for event the args are added to the eventBus payload
- for http the args are used as post payload if the config is not provided

## Possible args usage improvement

A good improvement of the use of the parameter args could be defining a priority flag into the configuration of the web component which defines if the args should overwrite the config parameters or not. Then based on this priority parameter would be possible to provide the args in each onClick function and merge these data with the configuration, following pseudocode:

```typescript
this.onClick = (...args) => {
    if (args[0].priority === 'ARGS_OVERWRITE_CONFIG') {
        properties = {
            ...actualProperties,
            ...args
        }
    } else (args[0].priority === 'ARGS_OVERWRITE_CONFIG') {
        properties = {
            ...args,
            ...actualProperties
        }
    }
}
```

Using a library (like loadhash) to recursively spread the object's properties.

## Actions

### File Upload

By setting `clickConfig` type to `file-upload`, on click the button perform and automatic file upload post. When clicking, browser opens its
native upload dialog allowing the user to pick a file from local file system. Once a file is picked, an automatic `POST` is performed by using
XMLHTTPRequest facility and  the file is appended to a brand new FormData with the key `file` unless overridden by the `fileFormKey` property on
`bk-button`.

For instance a `file-upload` configuration con be set as

```json
{
  "clickConfig": {
    "type": "file-upload",
    "actionConfig": {
      "url": "/v2/img-upload"
    }
  }
}
```

This config can be extended by using the `config` key enclosed by `actionConfig` which allows setting headers

```json
{
  "actionConfig": {
    ...
    "config": {
      "headers": {
        "key": "value"
      }
    }
  }
}
```

in case an event should be piped when upload is successful, `actionConfig` contains a key `returnEvent` which
takes either a `string`, an `array` of `string`s, an `Event` or an `array` of `Event`s that will follow `success` event into the pipeline.
For instance if a plugin reload is required after successful upload one could pipe a [change-query](../Events/Events#change-query)

```json
{
  "clickConfig": {
    "type": "file-upload",
    "actionConfig": {
      "url": "/v2/img-upload",
      "returnEvent": "change-query"
    }
  }
}
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |LocalizedText|{}|button content |
|`disableOnAction`|`disable-on-action`|boolean|false|configures the button to be disabled while action is in progress |
|`disabled`|`disabled`|boolean|false|button disabled property |
|`fileFormKey`|`file-form-key`|string|'file'|when `clickConfig` is of `type` `file-upload`, file is set to this key when appending values to the multipart/form-data that is sent
|
|`iconId`|`icon-id`|string| - |defines which icon should be rendered into the button, if this property is not defined or doesn't match any icon no icon will be rendered |
|`iconPlacement`| - |"default" \\| "left" \| "right"|'default'|defines where icon should be rendered, either left or right defaulting on left |
|`loading`|`loading`|boolean|false|button loading property |
|`loadingOnAction`|`loading-on-action`|boolean|false|configures the button to be loading while action is in progress |
|`navigationStrategy`| - |undefined \\| "disable" \| "hide"| - |determines the button behavior upon navigating nested objects. Allowed values are 'disable' and 'hide'. By default, the button does not react to navigation events. |
|`shape`|`shape`|string|'round'|button shape property |
|`stopPropagationOnClick`|`stop-propagation-on-click`|boolean|true|configures the onClick to disable propagation when action is fired |
|`type`|`type`|string|'primary'|button type property |
|`clickConfig`| - |undefined \\| ClickConfig| - |schema describing how to configure onCLick event |

### Listens to

This component listens to no event.

### Emits

| event | description |
|-------|-------------|
|`configurable-label`|generic event configurable through the event type configuration|
|[error](../Events/Events#error)|contains error messages for an http event|
|[success](../Events/Events#success)|notifies a successful http request|

### Bootstrap

None

## bk-navigation-back-arrow

allows to go back one step in the navigation path. It is not visible at the top page.

```html
<bk-navigation-back-arrow></bk-navigation-back-arrow>
```

![navigation-back-arrow](../img/bk-navigation-back-arrow.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../Events/Events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../Events/Events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[nested-navigation-state/back](../Events/Events#nested-navigation-state---back)|notifies to go back one step in the navigation path|

### Bootstrap

None

## bk-refresh-button

Allows refreshing some resource

```html
<bk-refresh-button></bk-refresh-button>
```

![refresh-button](../img/bk-refresh-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../Events/Events#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../Events/Events#change-query)|requires refresh without modifying current `CRUD` query by attaching an empty payload|

### Bootstrap

None
