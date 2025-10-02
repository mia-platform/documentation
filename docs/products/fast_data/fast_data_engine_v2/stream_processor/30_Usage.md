---
id: usage
title: Usage
sidebar_label: Usage
---

## Requirements

To use the plugin, the following requirements must be met:

- Kafka connection must have permission to read and write the topics declared in the configuration file;
- Kafka topics must exist on the Kafka cluster, with the appropriate number of partitions (which constrain service replicas), retention and replication factor;
- when enabling the `cache` feature, it is necessary to provide
  a connection to a MongoDB cluster and the ad-hoc collection
  should be created with the appropriate indexes;

## Messages Spec

In this section are show the schema of each input and output message components.
The service expects those messages to comply with their corresponding schema to
effectively read and transform them.

### Input Message

JSON schema of the **key**:

```json
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "additionalProperties": true
    }
  ]
}
```

:::info

Input key can either be a `string` or a JSON `object`. In both case it will be
deserialized as `string` when given as argument to the processing function.  
As a result, when a key of type `object` is employed, to read it as an object
it is necessary to parse the key using `JSON.parse()` method.

It is recommended, whenever it is possible, to just forward the message key as-is,
so that message order is preserved across the payload transformation.

:::

JSON schema of the **payload**:

```json
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "additionalProperties": true
    },
    {
      "type": "null",
      "description": "tombstone event"
    }
  ]
}
```

#### Input Payload Deserialization

Input payload deserialization is controlled by `payload_serde_strategy` parameter,
which is part of the sandbox configuration in the service configuration file.
Depending on the chosen value, message payloads are deserialized differently before
being passed to the processing function.

In particular, serde strategy accepts one of the following modes:

- **`json` (default)**: Deserializes the payload as a standard JSON object. This is the most common mode for typical JSON payloads;

- **`jsonWithSchema`**: Deserializes JSON content with schema registry compatibility.
  When Kafka uses a schema registry, the actual payload data is nested under a `payload`
  subkey, and this mode handles that structure automatically;

- **`string`**: Deserializes the payload as a raw string without JSON parsing. This is
  useful when you need to process the raw byte content within the sandbox or handle
  non-JSON payloads;

**Configuration Example**

```json
{
  "processor": {
    "type": "javascript",
    "payloadSerdeStrategy": {
      "deserialize": "json"
    }
  }
}
```

Thus, the choice of serde strategy affects how the `message.payload` argument
appears in your processing function:

- with `json` mode: `message.payload` contains the parsed **JSON object**
- with `jsonWithSchema` mode: `message.payload` contains the content from the schema
  registry's payload field as parsed **JSON object**
- with `string` mode: `message.payload` contains the **raw string** representation

### Output Message

JSON schema of the **key**:

```json
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "additionalProperties": true
    }
  ]
}
```

JSON schema of the **payload**:

```json
{
  "oneOf": [
    {
      "type": "object",
      "additionalProperties": true
    },
    {
      "type": "null",
      "description": "tombstone event"
    }
  ]
}
```

:::warning

Here the main takeaway is the fact that output payload MUST be an **object**.

:::

### Processing Function

In this section are described all the details regarding the user-defined processing
function and its most common use cases.

#### Function Signature and Data Type 🫆

Below are described the function signature, defined by _typescript_ type `ProcessFn`,
alongside the data types involved in its arguments.

```typescript
// ------------------ PROCESSING FUNCTION DATA TYPES ------------------ // 

type ProcessFn<P = unknown> = (
    message: InMessage<P>, caches?: ProcessorCaches | null | undefined
) => Promise<OutMessage[] | null | undefined>

interface InMessage<P = unknown> {
    key: string | null | undefined,
    payload: P
}

interface OutMessage {
    key: unknown,
    payload: unknown
}

type ProcessorCaches = (name: string) => ProcessorCache | null | undefined

// ------------------ CACHE DATA TYPES ------------------ // 

interface ProcessorCache {
    get: (key: unknown) => Promise<GetResult | null | undefined>,
    set: (key: unknown, value: unknown) => Promise<SetResult>,
    update: (
        key: unknown, value: unknown, version: number
    ) => Promise<UpdateResult>,
    delete: (key: unknown) => Promise<DeleteResult | null | undefined>,
}

interface GetResult {
  op: 'get'
  value: unknown,
  v: number
}

interface SetResult {
  op: 'set',
  v: number
}

interface UpdateResult {
  op: 'update',
  v: number
}

interface DeleteResult {
  op: 'delete',
  value: unknown
}

type CacheError = Error & {message: string} & (
  | { cause: 'NotFound' }
  | {
    cause: 'AlreadyExists'
    payload: {
      value: unknown,
      v: number
    }
  }
  | {
    cause: 'ConcurrentModification',
    paylaod: {
      value: unknown,
      v: number
    }
  }
  | {
    cause: 'Unimplemented',
    payload: {
      op: 'get' | 'set' | 'update' | 'delete'
    }
  }
  | {
    cause: 'Unhandled',
    payload: string
  }
)
```

The above definition translates into the following example function. This represents
the most basic version of a processing function, which just forward input events.

```js
export default function identity({ key, payload }, caches) {
    return [{ key, payload }]
}
```

It is important to notice that the function may output **zero or more** events based
on some user-defined business logic, allowing for a great flexibility

#### Mapping 🤖

The main goal of the processor function is to transform an input event in one
or more output events. As a result, output events may have a different shape
with respect to the input ones.

```js
export default function transform({ key, payload }) {
    if (!payload) {
      // forward TOMBSTONE event
      return [{ key, payload }]
    }

    return [{ key, payload: mapFields(payload) }]
}

function mapFields(payload) {
  return {
    field_1: Number.parseInt(payload.field1),
    new_const_field: "PUBLIC",
    updatedAt: new Date().toISOString(),
    // other business logic
  }
}
```

#### Filtering 🔍

Processor function can also be employed to filter out events from the input
stream and retain only the _interested_ or _valid_ ones in the output stream.
This effect can be achieved by setting the function result to a _void_ value.

```js
export default function validate({ key, payload }) {
    if (!payload) {
      // forward TOMBSTONE event
      return [{ key, payload }]
    }
    
    if (!isValid(key, payload)) {
      // no messages are returned, since the input is invalid;
      // consequently no events are forwarded onto the output topic 
      return []
    }

    return [{ key, payload }]
}

function isValid(key, payload) {
  // custom business logic
}
```

:::info

Processor function does not produce any event onto the output topic when
its return value is any of the following:

- `[]` (a list of empty messages)
- `null`
- `undefined`

:::

#### Errors 🚨

It is important to notice that when the processor function throws an error, or
it rejects a promise that it has returned, the service treat it as an **unexpected
behavior**. Therefore, it stops the consumption of the input stream and terminates
itself to prevent improper handling of the events.

For this reason, please **ensure** that all the functions or methods that may throw
an error are either wrapped in a `try`/`catch` block or `.catch()` method
is attached to the promise.

Failing to do so would lead to a stop in the stream
consumption, which would cause the consumer group lag to increase and the losing
of the near real-time property.

In case this behavior is desired, that is no further processing would occur until
**manual intervention** is applied, it is recommended to set up an alarm on the
consumer group lag of the service. This prevents such situation to go unnoticed for
a long period of time. The alarm can monitor `kafka_consumer_group_lag` Prometheus
metric [exposed by the service](/products/fast_data/fast_data_engine_v2/stream_processor/40_Metrics.md).

```js
export default function transform({ key, payload }) {
    if (!payload) {
      // forward TOMBSTONE event
      return [{ key, payload }]
    }
    
    let parsedKey
    try {
      parsedKey = JSON.parse(key)
    } catch (error) {
      // DESIRED EFFECT: skip the input event when key
      //                 cannot be parsed as object
      return []
    }

    // DESIRED EFFECT: in case the function throws, this stream
    //                 processing is terminated until either the input
    //                 event is manually inspected and then skipped
    //                 (update consumer lag) or the function is updated
    //                 to account for such situation
    let updatedPayload = mayThrowFunction(payload)

    return [{ key, payload }]
}

function mayThrowFunction(payload) {
  // custom business logic
}
```

:::note

Manual intervention involves changes either on the stream data, on the consumer
offset or the actual implementation of the processor function.

:::

#### Promises 🌠

Async processing is supported by the processor function by means of
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object.  
Here is an example:

```js
export default function asyncProcessing({ key, payload }, caches) {
  return new Promise((resolve, reject) => {
    asyncTransform()
      .then(result => resolve([{ key, payload: result }]))
      // IMPORTANT: when the async execution throw an erorr,
      //            the outer promise MUST be rejected
      .catch(err => reject(err))
  })
}

async function asyncTransform() {
  // custom business logic
}
```

:::danger

`async/await` keywords are not supported. Construct a `Promise` object and return it.

:::

#### Cache Access 🪙

As described in the configuration file, the processor function can access an
external cache to enable _stateful stream processing_. In the configuration
file one or more caches can be defined, which are then provided to the function
in the `caches` argument.

`caches` function allows to retrieve an underlying cache object when specifying
its identifier that was set in the configuration file.

For example, `cache-1` can be defined as follows:

```json
{
  // other properties above
  "caches": {
    "cache-1": {
      "type": "mongodb",
      "url": "mongodb://localhost:27017/farm-data",
      "appName": "eu.miaplatform.fastdata.stream-processor",
      "database": "farm-data",
      "collection": "stream-processor-state"
    }
  }
}
```

and it can be retrieved by the `caches` function and used as shown in the function below:

```js
export default function cacheValue({ key, payload }, caches) {
  return new Promise((resolve, reject) => {
    const testCache = caches?.("cache-1")

    if (testCache) {
      testCache.get("testKey")
        .then(result => {
          if (!result) {
            // NOTE: set throws in case a value already exists for selected key
            testCache.set("testKey", payload)
          } else {
            // NOTE: to permit concurrent modifications, the current value version
            //       MUST be provided. On the contrary, a mismatched version
            //       would raise a concurrent modification
            testCache.update("testKey", payload, result.v)
          }
        })
        .then(() => testCache.get("testKey"))
        .then(value => {
          console.log(value)
          return value
        })
        .then(value => resolve([{ key, payload: value }]))
        // IMPORTANT: promises MUST be catched and the outer promise MUST be rejected
        //            to ensure proper closure of the sandbox process
        .catch(err => reject(err))
    } else {
      // IMPORTANT: when cache is not found, the outer promise MUST be rejected
      reject("cache not found")
    }
  })
}
```

:::warning

Always verify whether selected cache object exists. This ensures that _Stream Processor_
service stops its execution due to an unexpected error. This measure is to prevent
handling input events without the external state available.  
In addition, this check immediately notifies of configuration typos and help fixing
them quickly.

:::

##### Cache Supported Operations

The cache object interface exposes the following methods:

- `get(key)`: retrieves from the cache the value (and its version) associated
  to selected key. Returns void when no record is found;
- `set(key, value)`: inserts a value for selected key;  
  Possible errors:
  - `AlreadyExists`: it is not possible to set a key that already exists;
- `update(key, value, version)`: modifies the existing value associated to the selected
  key.  
  Possible errors:
  - `NotFound`: selected key does not exist within the cache;
  - `ConcurrentModification`: version parameter does not match the one currently stored
    for the selected key. Another operation may have occurred on it since last read;
- `delete(key)`: remove from the cache selected key and its associated value;

:::note

All cache methods are asynchronous operations.

:::

In the table below are reported the available cache types with their supported operations:

| Cache Type | Get | Set | Update | Delete |
|------------|:---:|:---:|:------:|:------:|
| `mongodb`  | ✔️  | ✔️  |   ✔️   |   ✔️   |

It is up to each cache implementation to provide their underlying logic. When
no logic is defined for one of the methods, calling it returns an `Unimplemented` error.

#### Tombstone Events Management 🪦

The service is able to handle tombstone events, that is events whose content is empty
(_empty vector of bytes_), passing them to the processing function with a payload set
to `null`.

As a result, when tombstone events may be expected in the input stream, it is recommended
to check for null equivalence in the processing function. In case such situation arise,
the event can be forwarded as-is, so that the tombstone logic is maintained also across
the output stream.

This check should be carried out as soon as possible within the processing function, as
shown below:

```js
export default function ({ key, payload }) {
  // just forward tombstone events
  if (payload === null) {
    return [{ key, payload }]
  }
  
  // user-defined processing logic

  return [{ key, payload }]
}
```

In case such events should be processed differently, the processor function may
be written to address them according to your business needs.  
For example, a tombstone event may be transformed into a "Fast Data" `DELETE` message,
whose `before` and `after` as set to `null` value. This transformation is useful to
notify a change event of delete when the record's prior value is not available within
the payload of the input event.   

```js
export default function ({key, payload}) {
  // transform tombstone events into "Fast Data" event
  // and forward the original event to maintain the cleanup
  // capability on the Kafka topic
  if (payload === null) {
    return [
      // Fast Data event
      {
        key,
        payload: {
          op: 'd',
          before: null,
          after: null
        }
      },
      // original tombstone event
      {
        key,
        payload: null
      }
    ]
  }

  // user-defined processing logic

  return [{ key, payload }]
}
```
