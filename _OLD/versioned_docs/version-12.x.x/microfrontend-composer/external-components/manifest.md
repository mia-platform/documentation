---
id: manifest
title: The Webcomponent Manifest
sidebar_label: Manifest
sidebar_position: 20
---

Any webcomponent is or aims to be:

1. an HTML tag
2. a CSS encapsulated environment
3. a JS business logic unit

As HTML tag, a custom webcomponent has `attributes` and `properties`. Moreover a pair `attribute` and `property` can be coupled by reflecting changes: a change on the former is mirrored on the latter, and viceversa.

## Basics

The Configurator layout section queries the webcomponents to discover their properties/attributes using a static getter promise called a _Manifest_.

:::tip
You can use the [JSON schema](https://raw.githubusercontent.com/micro-lc/compose-toolkit/main/schemas/manifest.schema.json) to check your components manifests.
:::

The `__manifest` static getter must return a JavaScript object that has a key `type` which must be `object` (to be JSON schema compatible) and a map of `properties`.

```typescript
const manifest = {
  type: 'object',
  properties: {
    // list of properties
  }
}
```

A custom button might look like:

```typescript
// my-button.ts

import { LitElement } from 'lit'

class MyButton extends LitElement {
  static get __manifest() {
    return import('./manifest').then(({default: manifest}) => manifest)
  }

  @property() hidden?: boolean
}
```

and thus will instruct the Configurator preview section with the following manifest

```typescript
// manifest.ts
import type { Manifest } from '@micro-lc/compose-toolkit'

const manifest = {
  type: 'object',
  properties: {
    hidden: {
      type: 'boolean'
    }
  }
}

export default manifest
```

In the outlined example, the Configurator layout section will provide its configuration form with a boolean toggle for the `hidden` property.

Types can be **almost** anything that JSON schema provides:

1. `boolean`
2. `string`
3. `number`
4. `object`
5. `array`
6. a `oneOf` array of primitives

For each of these, the Configurator layout will provide a consistent form input to edit the property.

Trivially, primitive types `boolean`, `string`, and `number` are simple to edit from a form input.

Complex properties such as objects and arrays are also handled in a `no-code` fashion so far the manifest is precise in describing their nested properties.

The most basic visualization for an `object` without a schema is an IDE-like editor, with basic JSON validation capabilities. Likewise an array has a `no-code` item selector, which again, without schema will spawn an IDE-like editor for each one of its items.

The owner/developer of custom webcomponents can enforce `no-code` configurability by nesting the component manifest.

For instance:

```typescript
// my-button.ts

import { LitElement } from 'lit'

interface Action {
  type: 'http-request' | 'file-upload'
  url: string
}

class MyButton extends LitElement {
  static get __manifest() {
    return import('./manifest').then(({default: manifest}) => manifest)
  }

  @property() action?: Action
}
```

can be described by the following manifest

```typescript
// manifest.ts
import type { Manifest } from '@micro-lc/compose-toolkit'

const manifest: Manifest = {
  type: 'object',
  properties: {
    action: {
      type: 'object',
      properties: {
        type: {type: 'string', enum: ['http-request', 'file-upload']},
        url: {type: 'string'}
      }
    }
  }
}

export default manifest
```

Despite the `action` being an object, the Configurator layout section will spawn a modal (which can have potentially infinite levels of nesting) to configure `type` as a string with at most 2 fixed values and `url` as a string.

## Mia's Configuration Advanced

The Webcomponent manifest is a superset of a compliant draft-07 JSON schema. The Configurator guarantees to display a `no-code` comfortable version of each property.

Beside this specification, Configurator can enforce some extra logic using a special property, available to any webcomponent property or nested property: `__mia_configuration`.

Let's consider a custom button

```typescript
// my-button.ts

import { LitElement } from 'lit'

class MyButton extends LitElement {
  static get __manifest() {
    return import('./manifest').then(({default: manifest}) => manifest)
  }

  @property() hidden?: boolean
}
```

with manifest

```typescript
// manifest.ts
import type { Manifest } from '@micro-lc/compose-toolkit'

const manifest = {
  type: 'object',
  properties: {
    hidden: {
      type: 'boolean'
      __mia_configuration: {
        // mia specific configurations
      }
    }
  }
}

export default manifest
```

The `__mia_configuration` object targets the following use cases:

1. `deprecated` ▶️ mark a property for deprecation
2. `label` ▶️ The label to show on the form input/editor used to configure the given property. This label supports i18n by
   supporting both a `string` and a dictionary where the key is the language 2 letters code and the translation.
3. `description` ▶️ helpful when the property configuration is complicated or nested: provides a description tooltip to help the user.
4. `docLink` ▶️ replaces the `description` tooltip with a link to external documentation
5. `oneOfGuard` ▶️ see [ref](#the-oneofguard-key)
6. `oneOfDefault` ▶️ allows to select a `default` branch of a JSON schema `oneOf` section.
7. `priority` ▶️ groups properties in 3 levels inside the Configurator layout section form. Helpful when multiple personas
   are interacting with the configuration by highlighting those properties which are most likely to be tuned.
8. `attribute` ▶️ instructs the Configurator layout section that the property is mirrored by an HTML attribute (**NOT USED ATM**).
9. `schema-hint` ▶️ Configurator layout section knows some often used property schemas and provides [labels](#the-schema-hint-key)
    to select them instead of writing the whole property JSON schema.
10. `shared-key` ▶️ Configurator allows to share JSON schema definitions by resolving in-place their [references](#the-shared-key-key).
11. `enumLabels` ▶️ provides the capability to i18n-ify string enums

Summarizing the `__mia_configuration` property must comply with the following type:

```typescript
/**
 * This interface was referenced by `MiaSchema`'s JSON-Schema
 * via the `definition` "__mia_configuration".
 */
export interface MiaConfiguration {
  deprecated?:
    | boolean
    | {
        since?: string
        description?: LocalizedText
        [k: string]: unknown
      }
  label?: LocalizedText
  description?: LocalizedText
  docLink?: string
  oneOfGuard?: string
  oneOfDefault?: number
  priority?: "high" | "medium" | "low"
  attribute?: boolean | string
  "schema-hint"?:
    | "localized-text"
    | "dynamic-icon"
    | "on-off-toggle"
    | "color"
    | "event"
    | "mia/endpoints"
    | "mia/endpoints/crud"
    | "mia/endpoints/crud-and-generate-data-schema"
    | "micro-lc/applications"
  "shared-key"?: "back-kit/data-schema" | string
  enumLabels?: {
    [k: string]: LocalizedText
  }
}
```

### The `oneOfGuard` key

Suppose your property is a JSON `oneOf` an there's a guard key which allows to distinguish non-overlapping types. For instance:

```typescript
// manifest.ts
import type { Manifest } from '@micro-lc/compose-toolkit'

const manifest = {
  type: 'object',
  properties: {
    action: {
      type: 'object',
      oneOf: [
        {
          properties: {
            type: {const: 'http-post'},
            url: {type: 'string'},
            payload: {type: 'string'}
          }
        },
        {
          properties: {
            type: {const: 'event'},
            payload: {type: 'object'}
          }
        }
      ]
      __mia_configuration: {
        oneOfGuard: 'type'
      }
    }
  }
}

export default manifest
```

By using `oneOfGuard` set to `type` Configurator layout section is able to provide a `no-code` configuration to the property `action` by requesting the user to select a `type` between `http-post` and `event` and then the rest of the object.

If the user selects `http-post` then 2 string input will appear in order to configure `url` and `payload`, otherwise an IDE-like editor will allow to type directly the `payload` property since no schema was provided.

### The `schema-hint` key

Configurator provides some types that are well known and often used in order to avoid writing down a repeating JSON schema multiple times.

1. A `localized-text` hints for a string or a dictionary of translations
2. A `dynamic-icon` is a property that complies with the `@micro-lc/iconic` icon interface
3. An `on-off-toggle` is a number, either `0` and `1` which will be rendered as a boolean toggle
4. A `color` spawns a color picker
5. An `event` expects an object with at least 2 properties:
   1. a `label` which must be a `string`
   2. and a `payload` which must be an `object`
6. A `mia/endpoints` spawns a selection with a fixed list of options which are **Mia Platform's Console** currently available http endpoints.
7. A `mia/endpoints/crud` is the list of `mia/endpoints` coming from a `CRUD Service` microservice.
9. A `mia/endpoints/data-source` is the list of `mia/endpoints` coming from a `CRUD Service` microservice, a Mongo View, a Fast Data
   projection, or a Fast Data Single View.
10. A `micro-lc/applications` is the list of currently configured applications in the Configurator initial section.

### The `shared-key` key

JSON schema supports referencing of property definitions. Despite not being a fixed pattern there's a recommendation for draft-07 which suggests to use the key `definitions` at the first level of your JSON configuration. In the most recent drafts it will be substituted by the `$defs` keyword.

The following example shows how it works:

```json
{
  "definitions": {
    "propertyUsedMultipleTimes": {
      // property schema
    }
  },
  "type": "object",
  "properties": {
    "first": {
      "$ref": "#/definitions/propertyUsedMultipleTimes"
    },
    "second": {
      "$ref": "#/definitions/propertyUsedMultipleTimes"
    }
  }
}
```

The `shared-key` property suggests to the Configurator how to group properties using JSON `definitions` (refer to the [dedicated documentation](/microfrontend-composer/composer/20_compose_pages.md#shared-properties) for more information).
