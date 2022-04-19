---
id: buttons
title: Buttons
sidebar_level: Buttons
---



Buttons are scoped by their signature event and often start event-driven processing notifying the `eventBus` about user actions.

## Add Filter

Notifies other components that a filter needs to be created. Such event could be collected by a `bk-filter-drawer`.

```html
<bk-add-filter-button></bk-add-filter-button>
```

![add-filter](../img/components/bk-add-filter-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[filter](../events/events.md#filter)|notifies the request for creating a filter|

### Bootstrap

This component does not use bootstrap.

## Add New

this button creates a new item

```html
<bk-add-new-button></bk-add-new-button>
```

![add-new](../img/components/bk-add-new-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`browseOnButtonClick`| - |ClickPayload|{}|when provided with a valid schema, overrides the button JavaScript `onclick` listener handler allowing an `href` linking|
|`initialValues`| - |Payload|{}|arguments to pass upon click |

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits


| event | description |
|-------|-------------|
|[add-new](../events/events.md#add-new)|notifies the request for creating a new item|

### Bootstrap

This component does not use bootstrap.

## Button

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

This button is a generic web component that is fully configurable.

Also the button is configurable to define an action to be fired when the button is clicked, the possible actions are:

- event: push an event into the eventBus
- href: perform a redirect
- push: push a value into browser state
- http: perform an http request

In some cases the configurable onClick action can receive args as parameters that are used to enrich the request, actually the args are managed in this way:

- for event the args are added to the eventBus payload
- for http the args are used as post payload if the config is not provided

### Possible args usage improvement

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

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |LocalizedText|{}|button content |
|`disableOnAction`|`disable-on-action`|boolean|false|configures the button to be disabled while action is in progress |
|`disabled`|`disabled`|boolean|false|button disabled property |
|`iconId`|`icon-id`|string| - |defines which icon should be rendered into the button, if this property is not defined or doesn't match any icon no icon will be rendered |
|`loading`|`loading`|boolean|false|button loading property |
|`loadingOnAction`|`loading-on-action`|boolean|false|configures the button to be loading while action is in progress |
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
|[error](../events/events.md#error)|contains error messages for an http event|
|[success](../events/events.md#success)|notifies a successful http request|

### Bootstrap

This component does not use bootstrap.

## Refresh Button

allows to go back one step in the navigation path. It is not visible at the top page.

```html
<bk-navigation-back-arrow></bk-navigation-back-arrow>
```

![refresh](../img/components/bk-refresh-button.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[nested-navigation-state/push](../events/events.md#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits

| event | description |
|-------|-------------|
|[nested-navigation-state/back](../events/events.md#nested-navigation-state---back)|notifies to go back one step in the navigation path|

### Bootstrap

This component does not use bootstrap.

## Navigation Back Arrow

Allows refreshing some resource

```html
<bk-refresh-button></bk-refresh-button>
```

![navigation-back-arrow](../img/components/bk-navigation-back-arrow.png)

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|

### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[loading-data](../events/events.md#loading-data)|sets internal loading state| - | - |

### Emits

| event | description |
|-------|-------------|
|[change-query](../events/events.md#change-query)|requires refresh without modifying current `CRUD` query by attaching an empty payload|

### Bootstrap

This component does not use bootstrap.
