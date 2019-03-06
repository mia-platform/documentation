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

Si parte con le informazioni generali come: **title**, **version**, **description** che devono fare riferimento al set di API complessive fornite da tutti i microservices come un intero sistema. La descrizione può essere fornita come stringa (`description` field) o come percorso di un file Markdown (`descriptionMarkdownFilePath` field). Se il percorso `descriptionMarkdownFilePath `è specificato, questo verrà mostrato nell'interfaccia utente di Swagger anziché nella description.

L'array dei `services` è semplicemente la lista di tutti gli URL di ciascun microservizio e il prefisso corrispondente da anteporre.

Si prega di convalidare la configurazione con questo jsonschema prima di avviare il servizio. Una configurazione che non supera la convalida infatti impedirà l'avvio del microservice.

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
      },
    },
    file: {
      type: 'object',
      required: ['type', 'path', 'prefix'],
      properties: {
        type: { enum: ['file'] },
        path: { type: 'string' },
        prefix: { $ref: '#/definitions/prefixDefinition' },
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
