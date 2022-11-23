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
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits


| event | description |
|-------|-------------|
|[filter](../events#filter)|notifies the request for creating a filter|

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
|[loading-data](../events#loading-data)|sets internal loading state| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|keeps track of navigation steps| - | - |
|[nested-navigation-state/push](../events#nested-navigation-state---push)|keeps track of navigation steps| - | - |

### Emits


| event | description |
|-------|-------------|
|[add-new](../events#add-new)|notifies the request for creating a new item|

### Bootstrap

None

## bk-bulk-actions

This component allows to change the value of a object key in all the selected objects

```html
<bk-bulk-actions></bk-bulk-actions>
```

:::info
It works only with **enum or boolean** data and it appears once one or more items are selected.
Remember to pass the dataschema in the configuration file.
:::

### How it works

1. It reads the dataschema to look for the properties that can be changed, so the ones with enum or boolean type.
2. It listens to `selected-data-bulk` which is often called when one or more rows in a table are selected.
3. Once one or more rows are selected, it appears in the UI.
4. Now it is possible to interact with the left side of the component (three dots) and select the property to change the value to.
5. Once a property is selected, it checks if each selected row has the same value. If it does, it shows the property name with the common value, otherwise it shows the property name with '\*various\*'.
6. Now it is also possible to interact with the right side of the component and select the value to assign to the property
7. Once selected the value, a `bulk-update` event is emitted and data are updated.


### Configuration

This component is reachable as `bk-bulk-actions`.
Add the component's configuration wherever you want to display it.
```json
  ...
  {
    "type": "element",
    "tag": "bk-bulk-actions",
    "properties": {
      "dataSchema": {
        "$ref": "dataSchema"
      }
    }
  },
  ...
```

### Confirmation dialog on selected value

It is possible to ask for confirmation on selected value, and also customize the dialog texts.

It can be done using the `requireConfirmation` prop. It accepts three different values and it is defaulted as `false`:

#### 1. Boolean type

It can be set as `true` to open the dialog on close or as `false` otherwise.

#### 2. Object of type RequireConfirmOpts

An object such as:
```typescript
{
  cancelText?: any; // cancel button text
  okText?: any; // ok button text
  content?: any; // the content text
  title?: any; // the title text
}
```
to customize the dialog texts. They can also be localized, passing an object containing the language acronymous key and the text as value, for example:

```json
{
  "content": {
    "it": "Verrà creato un nuovo elemento, procedere?",
    "en": "A new element will be created, continue?"
  }
}
```


### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`requireConfirm`| - |boolean \\| RequireConfirmOpts|false|whether or not the button should ask for confirmation before updating all the selected data with the chosen value|
|`dataSchema`| - |undefined \\| ExtendedJSONSchema7Definition| - |[data schema](../page_layout#data-schema) describing the fields of the collection |

### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[select-data-bulk](../events#select-data-bulk)|keeps track of user selections to prompt `selected` export option configuration| - | - |

### Emits


| event | description |
|-------|-------------|
|[bulk-update]|notifies the client to update more items at the same time with a specific value|

### Bootstrap

None

## bk-bulk-delete

this button creates a new item

```html
<bk-bulk-delete></bk-bulk-delete>
```

This component allows to delete one or more items at the same time.


### How it works

1. A disabled button is displayed.
2. It listens to `selected-data-bulk` which is often called when one or more rows in a table are selected.
3. Once one or more rows are selected, it activates.
4. If the button is clicked, emits a `require-confirm` event to open a dialog to ask for confirmation.
5. If the action is confirmed, it emits a `delete-data` event to delete all the selected items.

:::warn
Items in 'PUBLIC' or 'DRAFT' \_\_STATE\_\_, change the state to 'TRASH' while items in 'TRASH' \_\_STATE\_\_ change the state to 'DELETED'.
:::


### Configuration

This component is reachable as `bk-bulk-delete`.
Add the component's configuration wherever you want to display it.
```json
  ...
  {
    "type": "element",
    "tag": "bk-confirmation-modal"
  },
  ...
```

:::warn
Remember to add the `bk-confirmation-modal` component to the configuration otherwise the `bk-bulk-delete` won't work properly
```json
  ...
  {
    "type": "element",
    "tag": "bk-confirmation-modal"
  },
  ...
```
:::

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|


### Listens to


| event | action | emits | on error |
|-------|--------|-------|----------|
|[select-data-bulk](../events#select-data-bulk)|keeps track of user selections to prompt `selected` export option configuration| - | - |

### Emits


| event | description |
|-------|-------------|
|[require-confirm]|opens a dialog to ask for confirmation|
|[delete-data]|deletes selected data|

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

The button is configurable to define an action to be fired when the button is clicked, the possible actions are:

- event: push an event into the eventBus
- href: perform a redirect
- push: push a value into browser state
- http: perform an http request
- file-upload: perform an XHR multipart/form-data file upload

In some cases the configurable onClick action can receive args as parameters that are used to enrich the request, actually the args are managed in this way:

- for event the args are added to the eventBus payload
- for http the args are used as post payload if the config is not provided

### Actions

All the parameters inside `clickConfig` can be dynamically interpolated into the WebComponent properties throw handlebars. With this syntax it is possible to access information about the current user or the URL of the page. Specifically, there are 3 objects available:

- `currentUser`, contains information about the current user, for example name and email.
- `pathnameParams`, contains information about the pathname of the current page. It contains the property `params` with the keys specified in the `urlMask` and the property `path` with the full path.

```json
{
  "params": {...},
  "path": "/currentPath"
}
```

- `searchParams`, contains information about the URL query parameters. It contains the property `params` with the keys specified in the `urlMask` and the property `path` with the full query parameters string.

```json
{
  "params": {...},
  "path": "?query1=value1"
}
```

The two objects `pathnameParams` and `searchParams` can be accessed by specifing the `urlMask` property of the `bk-button` component. With no `urlMask` specified (or without a match between URL and `urlMask`), they will be empty. 

Example of configuration:

```json
{
  "type": "element",
  "tag": "bk-generic-button",
  "properties": {
    "content": "Example button",
    "urlMask": "\\?pageNumber=:myPageNumber",
    "stopPropagationOnClick": true,
    "clickConfig": {
      "type": "event",
      "actionConfig": {
        "label": "add-new",
        "payload": {"pageNumber": "{{searchParams.params.myPageNumber}}"}
      }
    }
  }
}
```

In this configuration the property `urlMask` is specified to get the value of the first query parameter `pageNumber` and is saved in the `myPageNumber` key of the `searchParams.params` object. The example configuration will create a button that on click action will emit a `add-new` event with the information about the current page number in the payload.

#### HTTP Request

There are 3 available configurations on `clickConfig` with `type` `http`

- `GET`
- `POST`
- `DELETE`

`POST` and `DELETE` are allowed to parse a body from configuration beside any other `http-client` configuration

For instance an `http` configuration con be set as

```json
{
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "some body"
    }
  }
}
```

Query params can be specified in the `config` property:
```json
{
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "some body",
      "config": {
        "params": {
          "some": "query-params"
        }
      }
    }
  }
}
```


If the button is mounted on a component which provides context, say a `bk-table`, it is possible to achieve body dynamic construction as per

```json
{
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "{{rawObject args.[1]}}"
    }
  }
}
```

#### File Upload

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
For instance if a plugin reload is required after successful upload one could pipe a [change-query](../events#change-query)

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

#### File Download

By setting `clickConfig` type to `file-download`, on click the button perform a browser native file download.
For instance a `file-download` configuration con be set as

```json
{
  "clickConfig": {
    "type": "file-download",
    "actionConfig": {
      "url": "/v2/image.png"
    }
  }
}
```

in case an event should be piped when upload is successful, `actionConfig` contains a key `returnEvent` which 
takes either a `string`, an `array` of `string`s, an `Event` or an `array` of `Event`s that will follow `success` event into the pipeline.
For instance if a plugin reload is required after successful upload one could pipe a [change-query](../events#change-query)

```json
{
  "clickConfig": {
    "type": "file-download",
    "actionConfig": {
      "url": "/v2/imgage.png",
      "returnEvent": "change-query"
    }
  }
}
```

File download can be also executed configuring an [HTTP request](#http-request), adding `downloadAsFile` to the `config` property in `actionConfig`. It works with `GET` and `POST` requests.

For example:
```json
{
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "some body",
      "config": {
        "downloadAsFile": true
      }
    }
  }
}
```


### Require confirmation before executing an action

It is possible to ask for confirmation before executing an action using a `require-confirm` event and nesting the desired action inside its configuration.

#### Basic example:

```json
{
  ...
  "clickConfig": {
    "type": "event",
    "actionConfig": {
      "label": "require-confirm",
      "payload": {
        "configOk": {
          "tag": "bk-button",
          "properties": {
            "content": "Delete",
            "clickConfig": {
              "type": "http",
              "actionConfig": {
                "url": "/order-service/{{args.[1]._id}}",
                "method": "DELETE",
                "body": {},
              }
            }
          }
        }
      }
    }
  }
}
```


### Bulk button

It is possible to create a button that listens to `selected-data-bulk` event by setting `bulkButton` property to `true`.

Selected data can be sent through an HTTP request or an event  setting `{{rawObject selectedData}}` in http request body or event payload in configuration.


#### Example with an HTTP request:

```json
{
  ...
  "bulkButton": true,
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "{{rawObject selectedData}}"
    }
  }
}
```

#### Example with an event

```json
{
  ...
  "bulkButton": true,
  "clickConfig": {
    "type": "event",
    "actionConfig": {
      "label": "display-data",
      "payload": {"data": "{{rawObject selectedData}}"}
    }
  }
}
```

:::info

After the action on click is executed, rows in table remain selected. It is possible to deselect them by sending a `change-query` event with an empty payload.

Example of configuration:

```json
{
  ...
  "bulkButton": true,
  "clickConfig": {
    "type": "http",
    "actionConfig": {
      "url": "/v2/users/",
      "method": "POST",
      "body": "{{rawObject selectedData}}",
      "returnEvent": {
        "label": "change-query",
        "payload": {}
      }
    }
  }
}
```

:::

### Properties & Attributes


| property | attribute | type | default | description |
|----------|-----------|------|---------|-------------|
|`content`| - |LocalizedText|{}|button content |
|`danger`|`danger`|boolean| - |danger flag |
|`disableOnAction`|`disable-on-action`|boolean|false|configures the button to be disabled while action is in progress |
|`disabled`|`disabled`|boolean|false|button disabled property |
|`fileFormKey`|`file-form-key`|string|'file'|when `clickConfig` is of `type` `file-upload`, file is set to this key when appending values to the multipart/form-data that is sent |
|`iconId`|`icon-id`|string| - |defines which icon should be rendered into the button, if this property is not defined or doesn't match any icon no icon will be rendered |
|`iconPlacement`| - |"default" \\| "left" \| "right"|'default'|defines where icon should be rendered, either left or right defaulting on left |
|`listenToLoadingData`|`listen-to-loading-data`|boolean|false|configures the button to be loading when trigger by a loading-data event |
|`loading`|`loading`|boolean|false|button loading property |
|`loadingDebounce`|`loading-debounce`|number|400|min time in milliseconds between loading swaps (when less it doesn't trigger `loading` rendering) |
|`loadingOnAction`|`loading-on-action`|boolean|false|configures the button to be loading while action is in progress |
|`navigationStrategy`| - |undefined \\| "disable" \| "hide"| - |determines the button behavior upon navigating nested objects. Allowed values are 'disable' and 'hide'. By default, the button does not react to navigation events. |
|`pathnameParams`| - |Record\<string, string\>|{}|property to inject the object-like source from URL pathname |
|`searchParams`| - |Record\<string, string\>|{}|property to inject the object-like source from URL search params |
|`shape`|`shape`|string|'round'|button shape property |
|`stopPropagationOnClick`|`stop-propagation-on-click`|boolean|true|configures the onClick to disable propagation when action is fired |
|`type`|`type`|string|'primary'|button type property |
|`urlMask`|`url-mask`|string|''|url mask to apply to the current path to extract dynamic parameters |
|`clickConfig`| - |undefined \\| ClickConfig| - |schema describing how to configure onCLick event |
|`bulkButton`| - | boolean | false | whether to use it as a bulk button or not. If set to true, it listens to selected-data-bulk event |
### Listens to

This component listens to no event.

### Emits


| event | description |
|-------|-------------|
|`configurable-label`|generic event configurable through the event type configuration|
|[error](../events#error)|contains error messages for an http event|
|[success](../events#success)|notifies a successful http request|

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
|[nested-navigation-state/push](../events#nested-navigation-state---push)|updates internal representation of the current navigation path by adding one step| - | - |
|[nested-navigation-state/back](../events#nested-navigation-state---back)|updates internal representation of the current navigation path by removing the specified number of steps| - | - |

### Emits


| event | description |
|-------|-------------|
|[nested-navigation-state/back](../events#nested-navigation-state---back)|notifies to go back one step in the navigation path|

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
|[loading-data](../events#loading-data)|sets internal loading state| - | - |

### Emits


| event | description |
|-------|-------------|
|[change-query](../events#change-query)|requires refresh without modifying current `CRUD` query by attaching an empty payload|

### Bootstrap

None
