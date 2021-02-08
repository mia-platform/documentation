---
id: configuration
title: CRUD Service Configuration
sidebar_label: Configuration
---
This service is fully integrated and totally configurable through the design section of the Console, in the `CRUD` page. If you use the Console, please read [how to create a crud](../../development_suite/api-console/api-design/crud_advanced.md).

## CRUD configuration

This service is configured with environment variables and collection definitions.

### Environment variables

* **MONGODB_URL** (*required*): the MongoDB connection string;
* **COLLECTION_DEFINITION_FOLDER** (*required*): the path to the folder where all collections are defined;
* **USER_ID_HEADER_KEY** (*required*): header key used to know which user makes the request. User id is useful to add `creatorId` and `updaterId` field in collection document;
* **CRUD_LIMIT_CONSTRAINT_ENABLED**: (*default: `true`*): a boolean value to enable the query limit constraint feature. If it is enabled, the max limit of the get list APIs is 200.

### Collection definition

The collection definition can be in `json` or in `js` format. You can also specify indexes in collection definition.

Collection definitions contains:

* **id** (*required*): unique id of the collection;
* **name** (*required*): name of the collection;
* **description**: collection description;
* **endpointBasePath** (*required*): path of the endpoint exposed by CRUD service;
* **defaultState** (default to `DRAFT`): default state when you save the document into collection. The possible states are: `PUBLIC`, `DRAFT`, `TRASH`, `DELETED`. You can insert a document with another state declaring it in creation.
* **fields** (*required*): an array with the object of the various types. The fields *MUST* contain [the default collection properties](overview_and_usage#predefined-collection-properties)
  * **name** (*required*): name of the field saved in mongo
  * **type** (*required*)
    * *string*
    * *ObjectId*
    * *number*
    * *boolean*
    * *Date*
    * *GeoPoint*
    * *RawObject*: an object with any nested properties. You can set JSON Schema to handle a specific set of properties
    * *Array*: an array of *strings*, *number*, *RawObject* or *ObjectId*
  * **description**: description of the field
  * **required** (not handled for Array type): set a field as required
  * **nullable** (not handled for Array type): set a property is nullable
  * **schema**: the schema for the field (available only for *RawObject*).
  * **items**: an object containing the various types possible for *Array*. If type *RawObject* is selected, it is possible to define the JSON Schema definition of the *RawObject* adding a *schema* property inside the *items* object.
* **indexes**: an array of index definition

Example of collection definition:

```js
[
  {
    name: 'metadata',
    type: 'RawObject',
    schema: {
      properties: {
        somethingString: { type: 'string' },
        somethingArrayOfNumbers: {
          type: 'array',
          items: { type: 'number' }
        },
      },
      required: ['somethingNumber'],
      additionalProperties: false
    },
    required: false
  },
  {
    name: 'attachments',
    type: 'Array',
    items: {
      type: 'RawObject',
      schema: {
        properties: {
          name: { type: 'string' },
          neastedArr: {
            type: 'array',
            items: { type: 'number' }
          },
        },
        required: ['name'],
        additionalProperties: false
      }
    },
    required: false
  }
]
```
