---
id: actions
title: Actions
sidebar_label: Actions
---
Some components may expose properties that allow to configure callbacks, or `actions`.
Multiple types of actions can be configured.

Actions are generally composed of a triple: `<type, config, hooks>`.

- `type` is used to identify the type of action to be performed.
- `config` defines the operations that the computed callback performs.
- `hooks` allows to specify further actions that are to be chained to the current one at specific times or under specific conditions.

Each action is compiled to a callback that can be executed by components, possibly providing some data as input (or `context`). Different components may provide different context, which can be utilized to specify dynamic action configurations, using [handlebars syntax](https://handlebarsjs.com/guide/expressions.html).

## Types of actions

### Events Emition

```typescript
type EventAction = {
  type: 'event'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* events to be emitted */
    events: string | string[] | Event | Event[]
  },
  hooks: {
    /* action executed at the start of the callback */
    onStart?: Action
    /* action executed at the end of the callback */
    onFinish?: Action
    /* action executed in case of eventBusCancel event */
    onCancel?: Action
    /* action executed in case of eventBusSuccess event */
    onSuccess?: Action
    /* action executed in case of eventBusError event*/
    onError?: Action
  }
}
```

Where:

```typescript
type Event = {
  label: string
  payload: Record<string, any>
  meta: Record<string, any>
}
```

Actions of type `event` emit the events specified in `config.events`.


### Rest calls

```typescript
type HttpAction = {
  type: 'http'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* endpoint to call */
    url: string
    /* REST method to use */
    method: 'GET' | 'POST' | 'DELETE'
    /* body of the call */
    body?: Record<string, any> | string
    /* extra configurations */
    config?: Omit<HttpClientConfig, 'body'>
    /* "triggeredBy" field to add to eventBusCancel/eventBusSuccess/eventBusError event meta and for reference to the data forwarded into context */
    triggeredBy?: string
  },
  hooks: {
    /* action executed at the start of the callback */
    onStart?: Action
    /* action executed at the end of the callback */
    onFinish?: Action
    /* action executed in case of eventBusCancel event */
    onCancel?: Action
    /* action executed in case of eventBusSuccess event */
    onSuccess?: Action
    /* action executed in case of eventBusError event*/
    onError?: Action
  }
}
```

Where:
```typescript
type HttpClientConfig = Omit<RequestInit, 'method'> & {
  params?: string | Record<string, string> | string[][] | URLSearchParams
  error?: (err: unknown) => Promise<unknown>
  raw?: boolean
  downloadAsFile?: boolean
}
```

Actions of type `http` allow to perform REST calls (`GET`, `POST`, `DELETE` methods are supported).

Field `config.config` allows to specify extra configurations to the rest call.

For instance: 
```json
{
  "type": "http",
  "config": {
    ...
    "config": {
      "headers": {"foo": "bar"},
      "downloadAsFile": true
    }
    ...
  }
}
```
adds `foo` to the headers of the call with value `bar`, and attempts to download the result as a file.

Field `config.triggeredBy` has a duplicate function:

- it is injected in the meta field of events `eventBusCancel`, `eventBusSuccess`, `eventBusError` that may be emitted as a consequence of the action. This may be useful, for instance, with components such as `bk-notifications`, in order to display notification messages upon success/failure of the action

- it allows to specify what key can be used to reference the returned data after this is forwarded into the context of the `onSuccess` action


### File Download

:::info
  For downloading files using a REST call, an action of type `http` should be used:
  ```json
  {
    "type": "http",
    "config": {
      ...
      "config": {
        "downloadAsFile": true
      }
      ...
    }
  }
  ```
:::

```typescript
type FileDownloadAction = {
  type: 'file-download'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* url to the file to download */
    url: string
  },
  hooks: {
    /* action executed before the download request has been issued */
    onStart?: Action
    /* action executed after the download request has been issued */
    onFinish?: Action
  }
}
```

Actions of type `file-download` attempt to download a file from the given url.

:::caution
The `onFinish` hook does not execute after the download is complete, but rather after the download request has been issued.
:::


### File Upload

```typescript
type FileUploadAction = {
  type: 'file-upload'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* url to the file to download */
    url: string
    /* extra configurations (headers) */
    headers?: HeadersInit
    /* "triggeredBy" field to add to eventBusCancel/eventBusSuccess/eventBusError event meta */
    triggeredBy?: string
  },
  hooks: {
    /* action executed before the before the upload the request has been issued */
    onStart?: Action
    /* action executed after the upload has completed */
    onFinish?: Action
    /* action executed in case of eventBusCancel event */
    onCancel?: Action
    /* action executed in case of eventBusSuccess event */
    onSuccess?: Action
    /* action executed in case of eventBusError event*/
    onError?: Action
  }
}
```

Actions of type `file-upload` allow the user to upload a file to the given url. The native file upload window is used.

Field `config.triggeredBy` is injected in the meta field of events `eventBusCancel`, `eventBusSuccess`, `eventBusError` that may be emitted as a consequence of the action. This may be useful, for instance, with components such as `bk-notifications`, in order to display notification messages upon success/failure of the action

### Navigation - push

```typescript
type PushAction = {
  type: 'push'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* url to navigate to */
    url: string
    /* state to inject to destination page */
    state?: Record<string, any>
    /* title (unused) */
    title?: string
  },
  hooks: {
    /* action executed before the navigation happens */
    onStart?: Action
  }
}
```

Actions of type `push` execute a [window.history.push](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) call, that allows navigation to the specified url.

### Navigation - replace

```typescript
type ReplaceAction = {
  type: 'replace'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* url to navigate to */
    url: string
    /* state to inject to destination page */
    state?: Record<string, any>
    /* title (unused) */
    title?: string
  },
  hooks: {
    /* action executed before the navigation happens */
    onStart?: Action
  }
}
```

Actions of type `replace` execute a [window.history.replace](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) call, that allows navigation to the specified url.


### Navigation - href

```typescript
type HrefAction = {
  type: 'href'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* href to navigate to */
    href?: string | undefined;
    /* target to use for navigating to href, defaults to "_self" */
    target?: string | undefined;
    /* query paramters to add to destination url */
    query?: LinkQueryParams | undefined;
  },
  hooks: {
    /* action executed before the navigation happens */
    onStart?: Action
    /* action executed after the navigation happens (if "target" is not "_self") */
    onFinish?: Action
  }
}
```

Actions of type `href` execute a [window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) or a [window.location.replace](https://developer.mozilla.org/en-US/docs/Web/API/Location/replace) call (depending on the value of `target`), that allows navigation to the specified url.

In case `config.target` is not "_self", `onFinish` hook is available.

### Navigation - go back

```typescript
type GoBack = {
  type: 'go-back'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
  },
  hooks: {
    /* action executed before the navigation happens */
    onStart?: Action
  }
}
```

Actions of type `go-back` execute a [window.history.back](https://developer.mozilla.org/en-US/docs/Web/API/History/back) call, that allows navigation to the last page in `window.history` stack.

### Copy to Clipboard

```typescript
type CopyAction = {
  type: 'copy'
  config: {
    /* whether or not event should stop propagating. Defaults to true */
    stopPropagation?: boolean
    /* data source to extract text to copy */
    path: XPath
    /* "triggeredBy" field to add to eventBusCancel/eventBusSuccess/eventBusError event meta and for reference to the data forwarded into context */
    triggeredBy?: string
  },
  hooks: {
    /* action executed before the before the data is copied to clipboard */
    onStart?: Action
    /* action executed after the upload has completed */
    onFinish?: Action
    /* action executed in case of eventBusCancel event */
    onCancel?: Action
    /* action executed in case of eventBusSuccess event */
    onSuccess?: Action
    /* action executed in case of eventBusError event*/
    onError?: Action
  }
}
```

Where:
```typescript
type XPath = string | {
  path?: string
  default?: LocalizedText
}
```

Actions of type `copy` allow to copy data to clipboard. They require input data to be provided in order to properly execute. Components that expose action properties should provide appropriate context when executing the actions callback.

`config.path` is the path to apply to the data source, in javascript notation, to reach the data to copy to clipboard. In case the data is not of type string, it is first stringified.

#### Example 1
With input data such as:
```json
{
  "objField": {
    "arrField": [
      "stringValue"
    ]
  }
}
```
the action:
```json
{
  "type": "copy",
  "config": {
    "path": "objField.arrField.[0]"
  }
}
```
results in "stringValue" being copied to clipboard.

#### Example 2 - default value

It is possible to specify a default value to be copied to clipboard, in case the `path` does not correspond to any data.
For instance, with input data such as:
```json
{
  "objField": {
    "arrField": []
  }
}
```
the action:
```json
{
  "type": "copy",
  "config": {
    "path": {
      "path": "objField.arrField.[0]",
      "default": "defaultValue"
    }
  }
}
```
results in "defaultValue" being copied to clipboard.


## Dynamic configurations

Actions support dynamic configurations using [handlebars syntax](https://handlebarsjs.com/guide/expressions.html). Data provided as input (`context`) to the actions callbacks is used to resolve dynamic configurations.

Components that expose actions as properties, have the responsibility to provide context upon executing them.

### Example 1

Action
```json
{
  "type": "event",
  "config": {
    "events": {
      "label": "add-new",
      "payload": {
        "data": "{{name}}"
      }
    }
  }
}
```
emits an event with a dynamic payload.

For dynamic actions to be correctly executed, appropriate context has to be provided. In the example, the input data should include a `name` field.

If
```json
{
  "name": "joe"
}
```
is provided as context to the action, this results in an `addNew` event being executed with payload:
```json
{
  "data": "joe"
}
```

### Example 2

Pair `<template, configMap>` can be used to specify dynamic configurations.

```json
{
  "type": "event",
  "config": {
    "events": {
      "label": "add-new",
      "payload": {
        "template": "{{color}}",
        "configMap": {
          "red": {"command": "stop"},
          "yellow": {"command": "slow-down"},
          "$default": {"command": "go"}
        }
      }
    }
  }
}
```
The value of `template` is matched against keys of `configMap`. On the first match, the corresponding value in `configMap` is used as value for the dynamic variable.

For instance, with context
```json
{
  "color": "red"
}
```
the above action is equivalent to:
```json
{
  "type": "event",
  "config": {
    "events": {
      "label": "add-new",
      "payload": {
        "command": "stop"
      }
    }
  }
}
```

`$default` key in `configMap` can be specified, and is used if no other `configMap` key matches `template`.

### Example 3
It is possible to avoid to stringify dynamic values within a configuration using the custom helper `rawObject`.
```json
{
  "iconId": "fas fa-users",
  "action": {
    "type": "http",
    "config": {
      "url": "/url",
      "method": "POST",
      "body": "{{rawObject data}}"
    }
  }
}
```
`rawObject` signals that the provided dynamic value (`data` in this case) should not be stringified.

With input data:
```json
{
  "data": {
    "name": "Joe",
    "surname": "Smith"
  }
}
```
the above action is equivalent to:
```json
{
  "iconId": "fas fa-users",
  "action": {
    "type": "http",
    "config": {
      "url": "/url",
      "method": "POST",
      "body": {
        "name": "Joe",
        "surname": "Smith"
      }
    }
  }
}
```

## Action chaining

Multiple actions can be chained using `hooks`. Each action exposes some `hooks`, each one corresponding to a specific moment / condition of the action execution.

### Example 1
The action
```json
{
  "type": "http",
  "config": {
    "url": "/endpoint",
    "method": "GET"
  },
  "hooks": {
    "onFinish": {
      "type": "push",
      "config": {
        "url": "/some/path"
      }
    }
  }
}
```
results in executing a GET call on endpoint `/endpoint`, and than navigating to `/some/path`.

The first (top-level) action
```json
{
  "type": "http",
  "config": {
    "url": "/endpoint",
    "method": "GET"
  }
  ...
}
```
is executed first, and results in a GET call.

Action of type `http` allow to specify a `onFinish` hook, which is itself an action and is executed after the REST call, independently of its response.

The `onFinish` hook
```json
{
  "type": "push",
  "config": {
    "url": "/some/path"
  }
}
```
is thus executed after the GET call, navigating to the url `/some/path`.

### Example 2 - result data is forwarded

Actions may forward extra data into some of their hooks.

For instance, the following is a valid configuration:
```json
{
  "type": "http",
  "config": {
    "url": "/url-1",
    "method": "GET",
    "triggeredBy": "data_1"
  },
  "hooks": {
    "onSuccess": {
      "type": "http",
      "config": {
        "url": "/url-2/{{data_1.field}}",
        "method": "GET",
        "triggeredBy": "data_2"
      },
      "hooks": {
        "onSuccess": {
          "type": "event",
          "config": {
            "events": {
              "label": "add-new",
              "payload": {
                "test": "{{data_1.field}}",
                "test2": "{{data_2.otherField}}"
              }
            }
          }
        }
      }
    }
  }
}
```

Assuming all actions to be successful, this action results in the following steps:

- the first action
```json
{
  "type": "http",
  "config": {
    "url": "/url-1",
    "method": "GET",
    "triggeredBy": "data_1"
  }
  ...
}
```
is executed, resulting in a GET call to the endpoint `/url-1`.

- Assuming the call is successful and the response to look like:
```json
{
  "field": "foo"
}
```
the `onSuccess` action
```json
{
  ...
  "type": "http",
  "config": {
    "url": "/url-2/{{data_1.field}}",
    "method": "GET",
    "triggeredBy": "data_2"
  },
  ...
}
```
is executed, with access to the response of the previous call, through the key `data_1`.
This results in a second GET call, this time to the endpoint `/url-2/foo`. The dynamic url value `/url-2/{{data_1.field}}` can be correctly resolved using the response of the previous call.

- Assuming the call succeeds, and the returned response to be:
```json
{
  "otherField": "bar"
}
```
the `onSuccess` hook of the second action
```json
{
  ...
  "type": "event",
  "config": {
    "events": {
      "label": "add-new",
      "payload": {
        "test": "{{data_1.field}}",
        "test2": "{{data_2.otherField}}"
      }
    }
  }
  ...
}
```
is executed, resulting in an event being emitted, with label `add-new` and payload:
```json
{
  "test": "foo",
  "test2": "bar"
}
```
which can be resolved as the responses from both previous calls are available, through keys `data_1` and `data_2` respectively.

Notice how the third chained action still provides access to the return value from the first action: each action always forwards all its context to its hooks (possibly adding additional data to it).Assuming the same return values for each GET call as previously, and assuming the first action to have context context:
```json
{
  "name": "joe",
  "obj": {
    "data": "test",
  }
}
```

then the second action is executed with context:
```json
{
  "name": "joe",
  "obj": {
    "data": "test",
  },
  "data_1": {
    "field": "foo"
  }
}
```

and the third with:
```json
{
  "name": "joe",
  "obj": {
    "data": "test",
  },
  "data_1": {
    "field": "foo"
  },
  "data_2": {
    "otherField": "bar"
  }
}
```
