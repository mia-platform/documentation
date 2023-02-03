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
|`content`| - |Taggable \| Taggable[]| - |configurable content of the drawer. Supports both object or array, as: {tag: string; properties?: Object; children?: string} |
|`dataCustomActions`| - |DataCustomAction[]| - |list of actions|
|`drawerId`|`drawer-id`|string| - |identifier associated to the drawer |
|`drawerTitle`| - |[LocalizedText](../core_concepts#localization-and-i18n)| - |title of the drawer |
|`footerCallToAction`| - |CallToAction| - |alternative way to specify the footer of the drawer. This property is to be set programmatically only |
|`footerComponent`| - |null \| Taggable \| Taggable[]| - |configurable footer of the drawer. Supports both object or array, as: {tag: string; properties?: Object; children?: string} |
|`loading`|`loading`|boolean|false|whether or not the drawer is loading |
|`mask`|`mask`|boolean|true|whether to mask or not the drawer|
|`requireConfirm`| - |boolean \| RequireConfirmOpts|false|whether or not the drawer requires confirmation to close with unsaved data |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the drawer to |
|`subTitle`| - |[LocalizedText](../core_concepts#localization-and-i18n)| - |sub-title of the drawer |
|`titleIcon`|`title-icon`|string| - |icon to place next to to the title |
|`width`| - |string \| number| - |width of the drawer |
|`zIndex`|`z-index`|number| - |zIndex of the drawer |


### Listens to

| event | action | emits | on error |
|-------|--------|-------|----------|
|[using-form-container](../events#using-form-container)|notifies a drawer is in use| - | - |


### Emits

This component emits no event.


### Bootstrap

None



## bk-layout

Displays a menu, analogous to the [micro-lc](https://github.com/micro-lc/micro-lc) (version 2.0.0+) menu, which allows to navigate amongst plugins.

![layout](../img/bk-layout.png)
```html
<bk-layout></bk-layout>
```

:::caution
`bk-layout` is not supported by [micro-lc](https://github.com/micro-lc/micro-lc) version <2.0.0. `micro-lc` version 2.0.0+ (or a custom rendering engine) should be used.
:::

`bk-layout` can be configured in a number of ways:

### Mode
Three modes are available:

```typescript
type Menu = 'fixedSideBar' | 'overlaySideBar' | 'topBar'
```

Controlling how the menu is rendered - either as a side-bar (overlay or fixed) or a top-bar.

### Logo

<!-- TODO: url supports {urlDarkImage: string, urlLightImage: string} type too, update once dark-mode is supported -->
```typescript
type Logo {
  /** Alternative text to display if the logo is not found  */
  altText?: string

  /** Link to navigate to when the logo is clicked */
  onClickHref?: string

  /** URL of the logo image */
  url?: string
}
```

### Help Menu

```typescript
type HelpMenu {
  /** Link to the help page */
  helpHref: string
}
```

### User Menu

```typescript
type UserMenu {
  /** Configuration needed to perform user logout */
  logout?: {
    /** Method used to perform the call to the URL specified in the 'url' property */
    method?: 'GET' | 'POST'

    /** URL to be redirected to after the logout */
    redirectUrl?: string

    /** URL called to log out the user. The method used is the one specified in the 'method' property */
    url?: string
  }

  /** URL called in GET to retrieve user data */
  userInfoUrl: string

  /** Mapping between the properties returned from the user info URL call and the ones expected by the component */
  userPropertiesMapping?: Record<string, 'name' | 'avatar' | string>
}
```

### Head

```typescript
type Head {
  /** Url of the fav icon */
  favIconUrl?: string

  /** Title of the tab */
  title?: string
}
```

### Custom locale

It is possible to override default labels.
<!-- TODO: `light` and `dark` are also available, update once dark-mode is supported -->
```typescript
type Locale = {
  collapse?: string
  logout?: string
}
```

### Menu Items

Items in the menu. These can be of two types, `href` or `application`. `href` menu items behave lie links, navigating to a configurable page upon click; while `application` pages navigate to a plugin.

Multiple menu items can be grouped into recursive structures, `categories` (collapsible) and `groups` (non-collapsible).

All types of menu item have internationalized labels [LocalizedText](../core_concepts#localization-and-i18n).

#### Href
```typescript
export interface HrefMenuItem {
  /** Link's destination */
  href: string

  /** Icon of the menu item */
  icon?: string

  /** Unique identifier of the href */
  id: string

  /** Label of the menu item */
  label?: LocalizedText

  /** Specifies where to open the linked document */
  target?: '_blank' | '_self' | '_parent' | '_top'

  /** Type of the item: hyperlink to another page */
  type: 'href'
}
```

### Application
```typescript
export interface ApplicationMenuItem {
  /** Icon to visualize */
  icon?: string

  /** Unique identifier of the corresponding micro-lc application  */
  id: string
  
  /** Label of the menu item */
  label?: LocalizedText
  
  /** Identifiers of micro-lc other applications that also correspond to the item */
  selectedAlsoOn?: string[]
  
  /** Type of the item: micro-lc application */
  type: 'application'
}
```

### Category
```typescript
export interface CategoryMenuItem {
  /** Menu items included in the category */
  children?: MenuItem[]

  /** Icon to visualize */
  icon?: string

  /** Unique identifier of the category */
  id: string

  /** Label of the menu item */
  label?: LocalizedText

  /** Type of the item: collapsible sub-menu */
  type: 'category'
}

```

### Group
```typescript
export interface GroupMenuItem {
  /** Menu items included in the group */
  children?: MenuItem[]

  /** Unique identifier of the group */
  id: string

  /** Label of the menu item */
  label?: LocalizedText

  /** Type of the item: non-collapsible group of items */
  type: 'group'
}
```

### Properties & Attributes
| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
| mode | mode | Mode | overlaySideBar | controls how the menu is visualized |
| logo | - | Logo | - | logo to be visualized in the menu |
| menuItems | - | MenuItem[] | - | describes the items in the menu |
| helpMenu | - | HelpMenu  | - | controls the help button on the menu |
| userMenu | - | UserMenu  | - | controls the user information section of the menu |
| head | - | Head  | - | controls tab visualization options |
| locale | - | {[x: string]: string} | - | allows to override component labels |

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

### Disable shadow dom

Adding the attribute `disable-shadow-dom` allows to disable the shadow dom for this component, which can be useful when it has to embed children which bubble events up to the document root such as `bk-calendar`.

:::caution
`disable-shadow-dom` must be passed as attribute to `bk-layout-container`, and not as property. For instance:
```json
{
  "type": "element",
  "tag": "bk-layout-container",
  "attributes": {
    "disable-shadow-dom":""
  },
  "properties": {
    ...
  }
}
```
:::

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - | {[x: string]: LayoutNode} \| {[x: string]: LayoutNode} | - |layouts configuration |
|`disableShadowDom`| `disable-shadow-dom` \| boolean | false | disable the shadow dom as render root |
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
|`content`| - |Taggable \| Taggable[]| - |configurable content of the modal. Supports both object or array, as: {tag: string; properties?: Object; children?: string} |
|`footerCallToAction`| - |CallToAction| - |alternative way to specify the footer of the modal. This property is to be set programmatically only |
|`footerComponent`| - |null \| Taggable \| Taggable[] \| Object| - |configurable footer of the modal. Supports both object or array, as: {tag: string; properties?: Object; children?: string} |
|`height`|`height`|string| - |height of the modal |
|`loading`|`loading`|boolean|false|whether or not the modal is loading |
|`modalId`|`modal-id`|string| - |identifier associated to the modal |
|`modalTitle`| - |[LocalizedText](../core_concepts#localization-and-i18n)| - |title of the modal |
|`requireConfirm`| - |boolean \| RequireConfirmOpts|false|whether or not the modal requires confirmation to close with unsaved data |
|`rootElementSelector`|`root-element-selector`|string| - |root element to append the modal to |
|`subTitle`| - |[LocalizedText](../core_concepts#localization-and-i18n) \| Taggable \| Taggable[]| - |sub-title of the modal |
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

### NotificationsMap

```typescript
type NotificationsMap {
  [key: string]: {
    title?: LocalizedText
    content?: LocalizedText
    type?: "success" | "error"
  }
}
```

Properties `successEventMap` and `errorEventMap` map the `triggeredBy` field of [success](../events#success) and [error](../events#error) events to an object having keys `title`, `content`, `type`, which is then used to render the corresponding notification.
Both title and content fields are [localizedText](../core_concepts#localization-and-i18n) strings or objects.

### Triggering notifications from bk-button

Using the following keys, it is possible to trigger a notification as a result of a HTTP-call triggered by a `bk-button` component:

| key | operation |
|-----|-----------|
| `get-http-generic-button` | GET http call |
| `post-http-generic-button` | POST http call |
| `delete-http-generic-button` | DELETE http call |
| `bk-button-file-upload` | File upload |

### Example
For instance, given the following configuration:
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
  "bk-button-file-upload": {
    "title": {
       "en": "File was upladed correctly!",
       "it": "File caricato correttamente!"
     },
     "content": {
       "en": "The file has been uploaded correctly",
       "it": "Il file è stati caricato correttamente"
     },
     "type": "success"
  }
}
```

Assuming the current locale of the browser being set to english, a [success](../events#success) event with `meta.triggeredBy` field set to `created-data` (which for instance might happen as a consequence of a successful POST request), triggers the display of a success notification having title "Data was created correctly!", and content "The data has been created correctly".


| property | type | values | description |
|----------|------|--------|-------------|
| title   | [LocalizedText](../core_concepts#localization-and-i18n) | any | localized text to be used as notification title |
| content | [LocalizedText](../core_concepts#localization-and-i18n) | any | localized text to be used as notification content |
| type    | string | `success`, `error`, `info`, `warning` | enum of possible notification styling (i.e. icons, color...) |

### Properties & Attributes

| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`customEventMap`| - |NotificationsMap|{}|map containing the labels of any event that should be notified and the related `notificationProps` |
|`duration`|`duration`|number| - |lingering time for the notification in seconds |
|`errorEventMap`| - |NotificationsMap|{}|map containing the labels of any event that triggered a `error` that should be notified with the related `notificationproperties` |
|`location`| - |"topRight" \| "topLeft" \| "bottomRight" \| "bottomLeft"|"topRight"|corner location where the notification should be displayed |
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
