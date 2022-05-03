---
id: misc
title: Misc
sidebar_label: Misc
---
## Confirmation Modal

prompts the user for confirmation on certain critical actions
![confirmation-modal](../img/bk-confirmation-modal.png)
```html
<bk-confirmation-modal></bk-confirmation-modal>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`rootElementSelectors`|`root-element-selectors`|string| - | - | - |selector to specify where the `confirmationModal` should be appended|


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[require-confirm](../Events/Events#require-confirm)|displays a `confirmationModal` with buttons for the user to confirm or cancel the triggering of certain actions| - | - |


### Emits

| event | description |
|-------|-------------|
|Configurable events| - |


### Bootstrap

None



## Notifications

displays toast notifications about events happening on the EventBus according to the maps provided as props
![notifications](../img/bk-notifications.png)
```html
<bk-notifications></bk-notifications>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`customEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that should be notified and the related `notificationProps`|
|`duration`|`duration`|number| - | - | - |lingering time for the notification in seconds|
|`errorEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that triggered a `error` that should be notified with the related `notificationProps`|
|`location`| - |"bottomLeft" \\| "bottomRight" \| "topLeft" \| "topRight"| - | - | - |corner location where the notification should be displayed|
|`rootElementSelectors`|`root-element-selectors`|string| - | - | - |selector to specify where the notification should be appended|
|`successEventMap`| - |NotificationsMap| - | - |{}|map containing the labels of any event that triggered a `success` that should be notified with the related `notificationProps`|
- > #### notificationProps
>
> ```json
> {
>   "create-data": {
>      "title": {
>        "en": "Data was created correctly!",
>        "it": "Dato creato correttamente!"
>      },
>      "content": {
>        "en": "The data has been created correctly",
>        "it": "I dati sono stati creati correttamente"
>      },
>      "type": "success"
>   },
>   "update-data": {
>      "title": {
>        "en": "Data was updated correctly!",
>        "it": "Dato aggiornato correttamente!"
>      },
>      "content": {
>        "en": "The data has been updated correctly",
>        "it": "I dati sono stati aggiornati correttamente"
>      },
>      "type": "success"
>   }
> }
> ```
>
> | property | type | values | description |
> |----------|------|--------|-------------|
> | title   | [localizedText](../Core_concepts#localization-and-i18n) | any | localized text to be used as notification title |
> | content | [localizedText](../Core_concepts#localization-and-i18n) | any | localized text to be used as notification content |
> | type    | string | `success`, `error`, `info`, `warning` | enum of possible notification styling (i.e. icons, color...) |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[success](../Events/Events#success)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `successEventMap` property| - | - |
|[error](../Events/Events#error)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `errorEventMap` property| - | - |
|Configurable custom events|displays a notification on any event mapped in the `customEventMap` property| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## Template

```html
<bk-template></bk-template>
```

### Properties & Attributes

| property | attribute | type | optional | required | default | description |
|----------|-----------|------|----------|----------|---------|-------------|
|`defaultValue`|`default-value`|string| - | - | - | - |


### Listens to

This component listens to no event.


### Emits

This component emits no event.


### Bootstrap

None



## bk-layout-container

allows swapping layouts
```html
<bk-layout-container></bk-layout-container>
```
This component is meant to allow multiple configurations to live within the same plugin by:
1. re-using `back-kit` components without letting functionalities (mostly clients') to trump each other
2. render multiple layouts together like a page with table, then a card detail, then another table and so on
3. condensate plugins into a single one.
A simple instance would be a user which might want to explore multiple details connected with its user but
persisted on different entities.
Since a backend resource, like a database collection/table, is mostly mapped 1:1 on a `Backoffice` plugin using a single client, like the `bk-crud-client`, it is recommendable to use different plugins to render different collections.
For those cases falling outside the previous scope, for instance a customer which might want to check simultaneously both its purchases and its current shopping cart which, if the latter is persisted, are 
definitively stored on different places, a layout that can be switched might come in handy.
By reproducing an `element-composer`-compatible configuration, `bk-layout-container` provides a wrapper for different configurations wired to one or many `eventBus`.
Such configurations can be switched by using a single event on the default bus coming from the `element-composer`, or anyway injected in the `bk-layout-container` instance on the page.
### customer example
Let's then suppose we have a customer, a list of their previous purchases and a list of their 
current basket items.
We could use different plugins. For previous purchases it would look like:
```json
// previous-purchases.json
{
  "$ref": {
    "ppSchema": {
      "type": "object",
      "properties": {
        "_id": {"type": "string"},
        "items": {"type": "array"}
      }
    }
  },
  "content": {
    "type": "row",
    "content": [
      {
        "type": "element",
        "tag": "bk-table",
        "properties": {
          "dataSchema": {"$ref": "ppSchema"} 
        }
      },
      {
        "type": "element",
        "tag": "bk-crud-client",
        "properties": {
          "dataSchema": {"$ref": "ppSchema"} 
        }
      }
    ]
  }
}
```
while current basket would look like:
```json
// current-basket.json
{
  "$ref": {
    "cbSchema": {
      "type": "object",
      "properties": {
        "_id": {"type": "string"},
        "description": {"type": "string"},
        "price": {"type": "number"}
      }
    }
  },
  "content": {
    "type": "row",
    "content": [
      {
        "type": "element",
        "tag": "bk-table",
        "properties": {
          "dataSchema": {"$ref": "cbSchema"} 
        }
      },
      {
        "type": "element",
        "tag": "bk-crud-client",
        "properties": {
          "dataSchema": {"$ref": "cbSchema"} 
        }
      }
    ]
  }
}
```
If the UI should instead include two tables in a page that can be visually swapped by a set of buttons or tabs, 
by wrapping both configurations in the `bk-layout-container` does the job.
```json
// single-plugin.json
{
  "$ref": {
    "ppSchema": {
      "type": "object",
      "properties": {
        "_id": {"type": "string"},
        "items": {"type": "array"}
      }
    },
    "cbSchema": {
      "type": "object",
      "properties": {
        "_id": {"type": "string"},
        "description": {"type": "string"},
        "price": {"type": "number"}
      }
    }
  },
  "content": {
    "type": "element",
    "tag": "bk-layout-container",
    "properties": {
      "content": {
        "$default": {/* first plugin */},
        "currentBasket": {/* second plugin */}
      }
    }
  }
}
```
The `$default` key is not mandatory but is reserved and marks the layout to render on landing. The `bk-layout-container` has another property to avoid `$default` which is `currentLayout`. By setting `currentLayout` to `currentBasket`, the layout starts on the `currentBasket` config. 
Each layout has a dedicated `EventBus` instance which has the same name of the configuration key (
  in this case `$default` and `currentBasket`). `$default` is the `EventBus` currently injected in the 
  `bk-layout-container`.
To override this behavior there is the key `busDiscriminator` which defaults to `$inherit` and takes the
`EventBus` of its parent. Overriding means giving a new key to get a different bus, like `$default`. Any previously not existent key spawns a new `EventBus`.
To swap layout an event has been reserved with label: `layout/change` and payload
```typescript
type LayoutChangePayload = {
  layout: string
}
```
and layout must contain a valid `bk-layout-container` `content` prop key. A `bk-button` can be for instance used 
```json
{
  "type": "element",
  "tag": "bk-button",
  "properties": {
    "content": "View Orders",
    "clickConfig": {
      "type": "event",
      "actionConfig": {
        "label": "layout/change",
        "payload": {
          "layout": "orders"
        }
      }
    }
  }
}
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |undefined \\| Record<string, LayoutNode> \| Record<string, LayoutNode[]>| - |layouts configuration |
|`currentLayout`|`current-layout`|string| - |default layout to view on landing |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[layout/change](../Events/Events#layout---change)|requires the connection of the layout which is referenced in the event payload| - | - |


### Emits

This component emits no event.


### Bootstrap

None
