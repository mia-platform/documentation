'use strict'

const verbsEnum = ['options', 'get', 'post', 'head', 'patch', 'put', 'delete', 'trace', 'connect']

module.exports = {
  definitions: {
    filterPathDefinition: {
      type: 'array',
      items: {
        type: 'object',
        required: ['path'],
        properties: {
          path: {type: 'string'},
          verb: {
            type: 'string',
            enum: verbsEnum,
          },
        },
      },
    },
    transformPaths: {
      type: 'object',
      patternProperties: {
        '/*': {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: {type: 'string'},
              tags: {type: 'array', items: {type: 'string'}},
              verbsToTransform: {type: 'array', items: {type: 'string', enum: verbsEnum}},
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: true,
    },
    prefixDefinition: {
      type: 'string',
      pattern: '^\\/',
    },
    url: {
      type: 'object',
      required: ['type', 'url', 'prefix'],
      properties: {
        type: {enum: ['url']},
        url: {type: 'string'},
        prefix: {$ref: '#/definitions/prefixDefinition'},
        excludePaths: {$ref: '#/definitions/filterPathDefinition'},
        includePaths: {$ref: '#/definitions/filterPathDefinition'},
        transformPaths: {$ref: '#/definitions/transformPaths'},
      },
    },
    file: {
      type: 'object',
      required: ['type', 'path', 'prefix'],
      properties: {
        type: {enum: ['file']},
        path: {type: 'string'},
        prefix: {$ref: '#/definitions/prefixDefinition'},
        excludePaths: {$ref: '#/definitions/filterPathDefinition'},
        includePaths: {$ref: '#/definitions/filterPathDefinition'},
        transformPaths: {$ref: '#/definitions/transformPaths'},
      },
    },
    baseSwagger: {
      type: 'object',
      required: ['swagger'],
      properties: {
        swagger: {type: 'string'},
      },
      additionalProperties: true,
    },
    subswaggers: {
      type: 'object',
      patternProperties: {
        '^/.+.json$': {
          type: 'object',
          required: ['name', 'expression'],
          properties: {
            name: {type: 'string'},
            expression: {type: 'string'},
          },
        },
      },
    },
    securityInfo: {
      type: 'object',
      additionalProperties: {
        type: 'object',
      },
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['title', 'description', 'version', 'services', 'baseSwagger'],
      additionalProperties: false,
      properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        version: {type: 'string'},
        services: {
          type: 'array',
          items: {
            oneOf: [
              {$ref: '#/definitions/url'},
              {$ref: '#/definitions/file'},
            ],
          },
        },
        prefix: {
          $ref: '#/definitions/prefixDefinition',
        },
        baseSwagger: {
          $ref: '#/definitions/baseSwagger',
        },
        securityInfo: {
          $ref: '#/definitions/securityInfo',
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
        title: {type: 'string'},
        description: {type: 'string'},
        descriptionMarkdownFilePath: {type: 'string'},
        version: {type: 'string'},
        services: {
          type: 'array',
          items: {
            oneOf: [
              {$ref: '#/definitions/url'},
              {$ref: '#/definitions/file'},
            ],
          },
        },
        prefix: {
          $ref: '#/definitions/prefixDefinition',
        },
        baseSwagger: {
          $ref: '#/definitions/baseSwagger',
        },
        securityInfo: {
          $ref: '#/definitions/securityInfo',
        },
        subswaggers: {
          $ref: '#/definitions/subswaggers',
        },
      },
    },
  ],
}
