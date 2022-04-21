---
id: adapters
title: Adapters
sidebar_label: Adapters
---
## bk-state-adapter

Allows to inject `window` state into the payload of arbitrary events.

```html
<bk-state-adapter></bk-state-adapter>
```



### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`configMap`| - |Record<string, string>|{}|map to configure the adapter casting object properties to events labels |
|`debounce`|`debounce`|number|500|delay for initial event emition |
|`initKey`|`init-key`|string|...|key for events to emit once upon connection |

### Listens to

This component listens to no event.

### Emits


| event | description |
|-------|-------------|
|`configurable-label`|generic event based on its `configMap` property.|

### Bootstrap

None
