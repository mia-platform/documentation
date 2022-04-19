---
id: adapters
title: Adapters
sidebar_level: Adapters
---


Adapters constitute a layer of logic that allows communication between the `window` and the `plugin`.

## State adapter

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

This component does not use bootstrap.
