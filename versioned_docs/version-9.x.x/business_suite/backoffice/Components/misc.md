---
id: misc
title: Misc
sidebar_label: Misc
---
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



## bk-confirmation-modal

prompts the user for confirmation on certain actions
```html
<bk-confirmation-modal></bk-confirmation-modal>
```
![confirmation-modal](../img/bk-confirmation-modal.png)
#### Configure actions
It is possible to mount custom components as confirmation/cancel buttons in the modal.
For instance, the following example shows how to request for confirmation before the action of a button is performed.
#### Example
The following snippet of configuration shows an "Abort" button which performs a POST request to a given endpoint.
```json
{
  "tag": "bk-button",
  "properties": {
    "content": "Abort",
    "clickConfig": {
      "type": "http",
      "actionConfig": {
        "url": "lambdas/abort",
        "method": "POST",
        "config": {
          "headers": ...
        },
        "body": ...
      }
    }
  }
}
```
In order to require confirmation for this action, it is possible to:
- have the button spawn a Confirmation modal
- have the "confirm" button of this modal perform the POST request
as the following snippet shows:
```json
{
  "tag": "bk-button",
  "properties": {
    "content": "Abort",
    "clickConfig": {
      "type": "event",
      "actionConfig": {
        "label": "require-confirm",
        "payload": {
          "title": {
            "en": "Abort order?",
            "it": "Cancellare ordine?"
          },
          "content": {
            "en": "Are you sure you want to abort this order?",
            "it": "Sei sicuro di voler cancellare l'ordine?"
          },
          "configCancel": {
            "tag": "bk-button",
            "properties": {
              "content": "No",
              "type": "ghost"
            }
          },
          "configOk": {
            "tag": "bk-button",
            "properties": {
              "content": "Ok",
              "clickConfig": {
                "type": "http",
                "actionConfig": {
                  "url": "lambdas/abort",
                  "method": "POST",
                  "config": {
                    "headers": ...
                  },
                  "body": ...
                }
              }
            }
          }
        }
      }
    }
  }
}
```
The "Abort" button will now launch a `require-confirm` event. The Confirmation modal listens to it and becomes visible, using its payload to match its state as follows:
- 'title': the title of the modal
- 'content': the text content of the modal
- 'configCancel': a 'tag' / 'properties' pair for the cancel button
- 'configOk': a 'tag' / 'properties' pair for the confirmation button
In particlar, the 'configOk' field is used to build the confirmation button. In this case, we build a button that will perform the POST call that was performed directly by the button in the previous configuration.
Once one of the buttons is clicked, the confirmation modal automatically closes.
The cancel button does not perform any action: if clicked, the modal will simply close and the endpoint will not be called.

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`height`|`height`|string|'50px'|height of the modal |
|`width`|`width`|string|'520px'|width of the modal |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[require-confirm](../events#require-confirm)|displays a `confirmationModal` with buttons for the user to confirm or cancel the triggering of certain actions| - | - |


### Emits

| event | description |
|-------|-------------|
|Configurable events|on confirm or on cancel, it can forward events that were specified in the payload as the callback for the relative button click|


### Bootstrap

None



## bk-drawer

Generic drawer container for custom content and custom footer
```html
<bk-drawer></bk-drawer>
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |Taggable \\| Taggable[]| - |configurable content of the drawer. Supports both object or array, as: {tag: string; properties?: Record\<string, any\>; children?: string \| ReactNode} |
|`dataCustomActions`| - |DataCustomAction[]| - |list of actions|
|`drawerId`|`drawer-id`|string| - |identifier associated to the drawer |
|`drawerTitle`| - |LocalizedText| - |title of the drawer |
|`footerCallToAction`| - |CallToAction| - |alternative way to specify the footer of the drawer. This property is to be set programmatically only |
|`footerComponent`| - |null \\| Taggable \| Taggable[]| - |configurable footer of the drawer. Supports both object or array, as: {tag: string; properties?: Record\<string, any\>; children?: string \| ReactNode} |
|`loading`|`loading`|boolean|false|whether or not the drawer is loading |
|`mask`|`mask`|boolean|true|whether to mask or not the drawer|
|`requireConfirm`| - |boolean \\| RequireConfirmOpts|false|whether or not the drawer requires confirmation to close with unsaved data |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`subTitle`| - |LocalizedText| - |sub-title of the drawer |
|`titleIcon`|`title-icon`|string| - |icon to place next to to the title |
|`width`| - |string \\| number| - |width of the drawer |
|`zIndex`|`z-index`|number| - |zIndex of the drawer |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-form-container](../events#using-form-container)|notifies a drawer is in use| - | - |


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
|`content`| - |undefined \\| Record\<string, LayoutNode\> \| Record\<string, LayoutNode[]\>| - |layouts configuration |
|`currentLayout`|`current-layout`|string| - |default layout to view on landing |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[layout/change](../events#layout---change)|requires the connection of the layout which is referenced in the event payload| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-modal

Generic modal container for custom content and custom footer
```html
<bk-modal></bk-modal>
```

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |Taggable \\| Taggable[]| - |configurable content of the modal. Supports both object or array, as: {tag: string; properties?: Record\<string, any\>; children?: string \| ReactNode} |
|`footerCallToAction`| - |CallToAction| - |alternative way to specify the footer of the modal. This property is to be set programmatically only |
|`footerComponent`| - |null \\| Taggable \| Taggable[] \| Object| - |configurable footer of the modal. Supports both object or array, as: {tag: string; properties?: Record\<string, any\>; children?: string \| ReactNode} |
|`height`|`height`|string| - |height of the modal |
|`loading`|`loading`|boolean|false|whether or not the modal is loading |
|`modalId`|`modal-id`|string| - |identifier associated to the modal |
|`modalTitle`| - |LocalizedText| - |title of the modal |
|`requireConfirm`| - |boolean \\| RequireConfirmOpts|false|whether or not the modal requires confirmation to close with unsaved data |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the modal to |
|`subTitle`| - |LocalizedText \\| Taggable \| Taggable[]| - |sub-title of the modal |
|`titleIcon`|`title-icon`|string| - |icon to place next to to the title |
|`width`|`width`|string| - |width of the modal |
|`zIndex`|`z-index`|number| - |zIndex of the modal |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[open-modal](../events#open-modal)|opens the modal| - | - |
|[close-modal](../events#close-modal)|closes the modal| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-notifications

displays toast notifications about events happening on the EventBus according to the maps provided as props
![notifications](../img/bk-notifications.png)
```html
<bk-notifications></bk-notifications>
```
### Notifications properties
Properties `successEventMap` and `errorEventMap` map the `triggered-by` field of [success](../events#success) and [error](../events#error) events into notification properties.
### Triggering notifications from bk-button
Using the following keys, it is possible to trigger a notification as a result of a HTTP-call triggered by a `bk-button` component:
| key | operation |
|-----|-----------|
| `get-http-generic-button` | GET http call |
| `post-http-generic-button` | POST http call |
| `delete-http-generic-button` | DELETE http call |
| `bk-button-file-upload` | File upload |
### Example
```json
{
  "create-data": {
     "title": {
       "en": "Data was created correctly!",
       "it": "Dato creato correttamente!"
     },
     "content": {
       "en": "The data has been created correctly",
       "it": "I dati sono stati creati correttamente"
     },
     "type": "success"
  },
  "update-data": {
     "title": {
       "en": "Data was updated correctly!",
       "it": "Dato aggiornato correttamente!"
     },
     "content": {
       "en": "The data has been updated correctly",
       "it": "I dati sono stati aggiornati correttamente"
     },
     "type": "success"
  },
  "update-data": {
     "title": {
       "en": "Data was updated correctly!",
       "it": "Dato aggiornato correttamente!"
     },
     "content": {
       "en": "The data has been updated correctly",
       "it": "I dati sono stati aggiornati correttamente"
     },
     "type": "success"
  },
  "bk-button-file-upload": {
    "title": {
       "en": "File was upladed correctly!",
       "it": "File caricato correttamente!"
     },
     "content": {
       "en": "The file has been uploaded correctly",
       "it": "Il file ?? stati caricato correttamente"
     },
     "type": "success"
  }
}
```
| property | type | values | description |
|----------|------|--------|-------------|
| title   | [localizedText](../core_concepts#localization-and-i18n) | any | localized text to be used as notification title |
| content | [localizedText](../core_concepts#localization-and-i18n) | any | localized text to be used as notification content |
| type    | string | `success`, `error`, `info`, `warning` | enum of possible notification styling (i.e. icons, color...) |

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`customEventMap`| - |NotificationsMap|{}|map containing the labels of any event that should be notified and the related `notificationProps` |
|`duration`|`duration`|number| - |lingering time for the notification in seconds |
|`errorEventMap`| - |NotificationsMap|{}|map containing the labels of any event that triggered a `error` that should be notified with the related `notificationproperties` |
|`location`| - |"topRight" \\| "topLeft" \| "bottomRight" \| "bottomLeft"|'topRight'|corner location where the notification should be displayed |
|`rootElementSelectors`|`root-element-selectors`|string| - |selector to specify where the notification should be appended |
|`successEventMap`| - |NotificationsMap|{}|map containing the labels of any event that triggered a `success` that should be notified with the related `notificationproperties` |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[success](../events#success)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `successEventMap` property| - | - |
|[error](../events#error)|displays a notification if the `triggeredBy` field contained in the `meta` of the event has been mapped in the `errorEventMap` property| - | - |
|Configurable custom events|displays a notification on any event mapped in the `customEventMap` property| - | - |


### Emits

This component emits no event.


### Bootstrap

None
