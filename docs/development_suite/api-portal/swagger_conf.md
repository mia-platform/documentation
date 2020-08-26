This microservice is responsible for aggregating the individual swaggers of all the microservices indicated in the configuration.
He collect all paths from the specified microservice swaggers and show them all on a single swagger page.
Because the microservices are not aware of the prefixes prefixed by the gateways, this service can be configured to correct the swagger paths with the correct prefix.

The file to configure the swagger aggregator must exist in the Configuration project.

This Microservice is configured via a configuration file similar to this:

`````
/*
 * Copyright © 2018-present Mia s.r.l.
 * All rights reserved
 */

module.exports = {
  title: 'Documentation',
  descriptionMarkdownFilePath: 'tests/DESCRIPTION.md',
  version: '1.0.0',
  services: [
    {
      type: 'url',
      url: 'http://localhost:3000/documentation/json',
      prefix: '/',
      includePaths: [
        {
          path: '/pathToInclude-1',
        },
        {
          path: '/pathToInclude-2',
        }
      ],
      excludePaths: [
        {
          path: '/pathToExclude-1',
        }
      ]
    },
    {
      type: 'url',
      url: 'http://petstore.swagger.io/v2/swagger.json',
      prefix: '/foo',
    },
    {
      type: 'file',
      path: 'tests/localSwaggers/localSwagger.yaml',
      prefix: '/v1',
      includePaths: [
        {
          path: '/pathToInclude-1',
        }
      ]
    },
  ],
  baseSwagger: {
    swagger: '2.0',
    consumes: [
      'application/json',
    ],
    produces: [
      'application/json',
    ],
    securityDefinitions: {
      APISecretHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'secret',
      },
    },
    security: [
      {
        APISecretHeader: [],
      },
    ],
  },
}
`````

At the begenning the swagger-aggregator file needs the generic information like **title**, **version** and **description**, that will generically describe the API set provided by all microservices.
> There are two ways to provide a description:

> * using the field `**_description_**: requires a simple string;
  * using the field **_descriptionMarkdownFilePath_**: requires the path of a _MarkDown_ file with the description of the swagger (if specified, the content will be shown in the Swagger UI instead of the description).

The `services` array contains the URLs and files list from which retrieve the swaggers of every microservice; in details, there are two ways to retrieve a microservice swagger:
 * **_URL_**: by specifying `url` as type the swagger-aggregator will download the microservice swagger by the provided _url_ field;
 * **_File_**: by specifying `file` as type the swagger-aggregator will take the microservice swagger configurations by the provided _path_ field.

In both of them the user can specify a `prefix` to place before. 

In both of them, the user can specify an `includePaths` and an `excludePaths` to filter the paths to be accessible from outside. The filter will include first all the paths according to the object passed by `includePaths` then the result will be filtered by the `excludedPaths`.

Please be sure of validate the configuration with the following _jsonschema_ before run the service, otherwise the microservice will not correctly start.

`````
/*
 * Copyright © 2018-present Mia s.r.l.
 * All rights reserved
 */

module.exports = {
  definitions: {
    prefixDefinition: {
      type: 'string',
      pattern: '^(((\\/[a-z0-9-/]+([^\\/]))|\\/)|)$',
    },
    url: {
      type: 'object',
      required: ['type', 'url', 'prefix'],
      properties: {
        type: { enum: ['url'] },
        url: { type: 'string' },
        prefix: { $ref: '#/definitions/prefixDefinition' },
        excludePaths: {
          type: 'array',
          items: {
            type: 'object',
            required: ['path'],
            properties: {
              path: { type: 'string' },
            },
          },
        },
        includePaths: {
          type: 'array',
          items: {
            type: 'object',
            required: ['path'],
            properties: {
              path: { type: 'string' },
            },
          },
        },
      },
    },
      },
    },
    file: {
      type: 'object',
      required: ['type', 'path', 'prefix'],
      properties: {
        type: { enum: ['file'] },
        path: { type: 'string' },
        prefix: { $ref: '#/definitions/prefixDefinition' },
        excludePaths: {
          type: 'array',
          items: {
            type: 'object',
            required: ['path'],
            properties: {
              path: { type: 'string' },
            },
          },
        },
        includePaths: {
          type: 'array',
          items: {
            type: 'object',
            required: ['path'],
            properties: {
              path: { type: 'string' },
            },
          },
        },
      },
    },
      },
    },
    baseSwagger: {
      type: 'object',
      required: ['swagger'],
      properties: {
        swagger: { type: 'string' },
      },
      additionalProperties: true,
    },
    subswaggers: {
      type: 'object',
      patternProperties: {
        '^\/.+\.json$': {
          type: 'object',
          required: ['name', 'expression'],
          properties: {
            name: { type: 'string' },
            expression: { type: 'string' },
          },
        },
      },
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['title', 'description', 'version', 'services', 'baseSwagger'],
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        version: { type: 'string' },
        services: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/url' },
              { $ref: '#/definitions/file' },
            ],
          },
        },
        baseSwagger: {
          $ref: '#/definitions/baseSwagger',
        },
        subswaggers: {
          $ref: '#/definitions/subswaggers',
        },
      },
    },
    {
      type: 'object',
      required: ['title', 'descriptionMarkdownFilePath', 'version', 'services', 'baseSwagger'],
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        descriptionMarkdownFilePath: { type: 'string' },
        version: { type: 'string' },
        services: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/url' },
              { $ref: '#/definitions/file' },
            ],
          },
        },
        baseSwagger: {
          $ref: '#/definitions/baseSwagger',
        },
        subswaggers: {
          $ref: '#/definitions/subswaggers',
        },
      },
    },
  ],
}
`````
