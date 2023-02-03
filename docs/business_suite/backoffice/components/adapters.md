---
id: adapters
title: Adapters
sidebar_label: Adapters
---
## bk-state-adapter

Allows to inject `window` state into the payload of arbitrary events. Window `state` could be set, for instance, through a [push-state](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) method.

```html
<bk-state-adapter></bk-state-adapter>
```

`bk-state-adapter` property `configMap` and the `window` state are merged based on their keys, generating `label`-`payload` pairs that are emitted as events. The label is extracted from `configMap`, while the payload from the `window` state.

### Example

Given the following configuration of `bk-state-adapter`:
```json
{
  ...
  "tag": "bk-state-adapter",
  "properties": {
    ...
    "configMap": {
      "key_1": "loading-data",
      "key_2": "add-new"
    }
  }
}
```

and assuming the page state to be:
```json
{
  "key_1": {
    "loading": true
  },
  "key_2": {
    "foo": "bar"
  }
}
```

`bk-state-adapter` emits a [loading-data](../events#loading-data) event such as:
```json
{
  "label": "loading-data",
  "payload": {
    "loading": true
  }
}
```
and an [add-new](../events#add-new) event such as:
```json
{
  "label": "add-new",
  "payload": {
    "foo": "bar"
  }
}
```

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`configMap`| - |{[name: string]: string}|{}|map to configure the adapter casting object properties to events labels |
|`debounce`|`debounce`|number|500|delay for initial event emition |
|`initKey`|`init-key`|string|"__BK_INIT"|key for events to emit once upon connection |

### Listens to

This component listens to no event.

### Emits


| event | description |
|-------|-------------|
|`configurable-label`|generic event based on its `configMap` property|

### Bootstrap

None


## bk-url-parameters

Allows to emit events upon connecting, based on the value of the URL.

```html
<bk-url-parameters></bk-url-parameters>
```

`bk-url-parameters` attempts current URL matching against the given mask in property `urlMask`.
If it fails, it will redirect according to the provided property `redirectUrl`. Otherwise it will attempt to emit the matched content as payload of an event using its property `eventLabel` as label of the event, which defaults to `change-query`.

### Example

Assuming the component to be configured as:
```json
{
  ...
  "tag": "bk-url-parameters",
  "properties": {
    "urlMask": "/order-details/:_id"
  }
}
```

and assuming the url to be `/order-details/test-id`, then `bk-url-parameters` emits the following a [change-query](../events#change-query) event upon connection to the DOM:

```json
{
  "label": "change-query",
  "payload": {
    "_id": "test-id"
  }
}
```

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`waitTime`| `wait-time` |number|500|wait time before initialization event, in milliseconds|
|`urlMask`| `url-mask` |string| - | url mask to apply to the current path to extract dynamic parameters |
|`eventLabel`|`event-label`|string|'change-query'|label of the event that will be dispatched as result|
|`redirectUrl`|`redirect-url`|string| - |optional parameter that contains the url to redirect when urlMask does not completely match|

### Listens to

This component listens to no event.

### Emits

| event | description |
|-------|-------------|
|`configurable-label`|generic event based on its properties|

### Bootstrap

None
