---
id: create_application
title: Create an Application
sidebar_label: Create an Application
---

The following page describes how an Application Marketplace Item has to be built, in order to have it added to the Console Marketplace.

## The Application Resources

Currently, applications support 4 types of resources:

- Services (Plugins, Templates, Examples)
- Endpoints
- CRUD collections
- Public Variables

Therefore an application will include a `resources` field with the following structure:

```json
{
  "services": {...},
  "endpoints": {...},
  "collections": {...},
  "unsecretedVariables": {...},
  "listeners": {...},
}
```

:::info
Only the `services` field must be configured for an application configuration to be valid.
:::

### Configure Services

The `service` object has the same structure found in the Plugins, Templates and Examples, as explained in the [dedicated paragraph](/software-catalog/manage-items/mia-ctl/create/create-item-by-type/create_plugin.md#properties-of-plugin-resources).

Thus, if you plan to add a plugin, a template, or an example to your application you can follow the same configuration. Remember to add general details to every microservice, such as name and description.

:::tip

If you need to include a Plugin, Template or Example that is already on the Marketplace within your application, you can simply download it with `miactl get` and copy its services to your application.

:::

### Configure Endpoints

The `endpoints` field of an application is an object composed of properties named as the endpoints composing it.

Here below are listed all the properties that must be provided for each endpoint:

- **`defaultBasePath`**: the base path of the endpoint
- **`defaultPathRewrite`**: the default path rewrite of the endpoint
- **`description`**: a brief description (10 to 20 words) regarding the endpoint functionalities
- **`type`**: a label to identify the type of endpoint:
  - **`custom`**: linked to a Microservice
  - **`crud`**: linked to a CRUD collection
  - **`view`**: linked to a MongoDB view
  - **`external`**: linked to an External Proxy
  - **`cronjob`**: linked to a CronJob
  - **`cross-project`**: linked to a cross-project proxy
  - **`fast-data-projection`**: linked to a Fast Data projection
  - **`fast-data-single-view`**: linked to a Fast Data single view
- **`tags`**: array of strings to arbitrarily catalog the endpoint in the Console
- **`public`**: whether the endpoint should require authentication
- **`showInDocumentation`**: whether the endpoint should appear in the API Portal section
- **`secreted`**: whether the endpoint should require an API key
- **`service`**: present only in custom type endpoints, identifies the microservice the endpoint is linked to
- **`collectionId`**: present only in CRUD type endpoints, identifies the collection the endpoint is linked to
- **`pathName`**: present only in CRUD type endpoints, identifies the path name of the collection di endpoint is linked to
  
:::caution
When you add an endpoint to an application make sure the resource the endpoint is linked to (microservice, collection, etc.) is also present in the application configuration.
:::

- **`routes`**: routes already configured for your endpoint.
  Each route should specify the following properties:
  - **`id`**: route id (e.g. POST/users)
  - **`verb`**: route verb: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
  - **`path`**: route path (e.g. /)
  - **`public`**: whether the route should require authentication
  - **`showInDocumentation`**: whether the endpoint should appear in the API Portal section
  - **`secreted`**: whether the endpoint should require an API key
  - **`allowUnknownRequestContentType`**: permit request content type different from application/json
  - **`allowUnknownResponseContentType`**: permit response content type different from application/json.

:::info
Every route boolean value (such as public, secreted, etc.) must comply with the following inheritance structure:

```json
{
  "inherited": {"type": "boolean"},
  "value": {"type": "boolean"}
}
```

:::

### Configure Collections

The **collections** field of an application is an object composed of properties named as the collections composing it.

Here below are listed all the properties that must be provided for each collection:

- **`id`**: the collection identifier (e.g. users)
- **`description`**: a brief description (10 to 20 words) regarding the collection functionalities
- **`defaultName`**: name proposed to the user when creating the collection
- **`type`**: `collection`, `view`
- **`tags`**: array of strings to arbitrarily catalog the collection in the Console
- **`fields`**: array of fields composing your collection data model.  
  Each field should specify the following properties:
  - **`name`**: the name of the field
  - **`description`**: a brief description (10 to 20 words) regarding the field purpose
  - **`type`**: `string`, `number`, `boolean`, `date`, `Geopoint`, `RawObject`, `Array_string`, `Array_number`, `Array_RawObject`, `ObjectId`
  - **`required`**: whether this field should be required in the data model
  - **`nullable`**: whether this field could be set to null
  - **`sensitivityValue`**: the level of data sensitivity associated with this field
  - **`sensitivityDescription`**: a brief description regarding the sensitivity classification
  - **`encryptionEnabled`**: whether this field should be encrypted in the database
  - **`encryptionSearchable`**: a brief description regarding the reason for the encryption
  
:::info

You can find more information regarding **sensitivity** and **encryption** properties in the [**gdpr** section](/development_suite/api-console/api-design/gdpr.md) of the documentation.

:::

- **`indexes`**: array of indexes used in your collection.  
  Each index should specify the following properties:
  - **`name`**: name of the index
  - **`type`**: `normal`, `geo`, `hash`, `TTL`
  - **`unique`**: whether this index should be unique
  - **`fields`**:array of fields composing your index data model. Index fields follow the same configuration expressed for collection fields
- **`internalEndpoints`**: array of internal endpoints present in your collection.  
  Each field should specify the following properties:
  - **`basePath`**: path of the internalEndpoint
  - **`defaultState`**: `DRAFT`, `PUBLIC`.

### Configure Public Variables

The **unsecretedVariables** field of an application is an object composed of properties named as the public variables composing it.

Here below are listed all the properties that must be provided for each public variable:

- **`productionEnv`**: value to be used in production environments
- **`noProductionEnv`**: value to be used in no production environments

#### Configure Listeners

The **listeners** field of an application is an Object where the object `key` is the name of the listener and the value is an object made of the following properties:

- **name**: the name of the listener (same as the `key` of the Object)
- **port**: the port that listener will be listening to
- **description**: optional description for the listener
- **selectedByDefault**: whether new Endpoints should be exposed on this listener or not
- **ownedBy**: an Object made of the `componentIds` array. This array includes component ids of services that supports listeners and [created by the same application template 
]

## Example of an Application configuration

<details><summary>Click to expand an example of Application configuration</summary>
<p>

```json
{
  "name": "Developer Portal",
  "description": "Use this application to set up your Developer Portal in a few clicks.",
  "type": "application",
  "categoryId": "dev-portal",
  "tenantId": "my-tenant",
  "visibility": {
    "allTenants": true
  },  
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "Dev Portal.png",
      "file": "image.png",
      "size": 1532,
      "location": "/path/to/your/image.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "supportedByImage": [
    {
      "_id": "5db0106143875a0011618816",
      "name": "MiaPlatform.png",
      "file": "imageSupport.png",
      "size": 139694,
      "location": "/path/to/your/imageSupport.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "documentation": {
    "type": "externalLink",
    "url": "https://docs.mia-platform.eu/docs/dev_portal/overview"
  },
  "resources": {
    "services": {
      "crud-service": {
        "defaultConfigMaps": [
          {
            "name": "crud-service-collections",
            "mountPath": "/home/node/app/collections",
            "files": [],
            "link": {
              "targetSection": "collections"
            },
            "viewAsReadOnly": true
          }
        ],
        "defaultDocumentationPath": "",
        "defaultEnvironmentVariables": [
          {
            "name": "LOG_LEVEL",
            "value": "{{LOG_LEVEL}}"
          },
          {
            "name": "HTTP_PORT",
            "value": "3000"
          },
          {
            "name": "COLLECTION_DEFINITION_FOLDER",
            "value": "/home/node/app/collections"
          }
        ],
        "defaultResources": {
          "cpuLimits": {
            "max": "200m",
            "min": "100m"
          },
          "memoryLimits": {
            "max": "250Mi",
            "min": "70Mi"
          }
        },
        "description": "",
        "dockerImage": "nexus.mia-platform.eu/core/crud-service:5.2.1",
        "mapEnvVarToMountPath": {
          "collections": {
            "envName": "COLLECTION_DEFINITION_FOLDER",
            "type": "folder"
          }
        },
        "name": "crud-service",
        "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/crud-service",
        "type": "plugin",
        "componentId": "crud-service"
      },
      "docusaurus": {
        "archiveUrl": "https://git.tools.mia-platform.eu/api/v4/projects/8576/repository/archive.tar.gz",
        "defaultEnvironmentVariables": [
          {
            "name": "HTTP_PORT",
            "value": 8080
          }
        ],
        "defaultLogParser": "mia-nginx",
        "description": "",
        "name": "docusaurus",
        "repositoryUrl": "https://git.tools.mia-platform.eu/platform/dev-portal/mia-docusaurus/",
        "type": "template"
      }
    },
    "collections": {
      "components": {
        "id": "components",
        "description": "Collection of components",
        "defaultName": "components",
        "tags": [],
        "fields": [
          {
            "name": "name",
            "type": "string",
            "required": true,
            "nullable": false,
            "sensitivityValue": 0,
            "encryptionEnabled": false,
            "encryptionSearchable": false
          },
          {
            "name": "description",
            "type": "string",
            "required": false,
            "nullable": false,
            "sensitivityValue": 0,
            "encryptionEnabled": false,
            "encryptionSearchable": false
          }
        ],
        "indexes": [
          {
            "name": "_id",
            "type": "normal",
            "unique": true,
            "fields": [
              {
                "name": "_id",
                "order": 1
              }
            ]
          }
        ],
        "internalEndpoints": [
          {
            "basePath": "/components",
            "defaultState": "DRAFT"
          }
        ]
      }
    },
    "endpoints": {
      "/bff": {
        "defaultBasePath": "/bff",
        "defaultPathRewrite": "/",
        "description": "Endpoint /bff",
        "type": "custom",
        "tags": [],
        "public": false,
        "showInDocumentation": false,
        "secreted": false,
        "allowUnknownRequestContentType": false,
        "allowUnknownResponseContentType": true,
        "forceMicroserviceGatewayProxy": true,
        "service": "dev-portal-marketplace-backend",
        "routes": {
          "POST/requests": {
            "id": "POST/requests",
            "path": "/requests",
            "verb": "POST",
            "public": {
              "inherited": true
            },
            "secreted": {
              "inherited": true
            },
            "acl": {
              "inherited": true
            },
            "backofficeAcl": {
              "inherited": true
            },
            "showInDocumentation": {
              "inherited": true
            },
            "allowUnknownRequestContentType": {
              "inherited": true
            },
            "allowUnknownResponseContentType": {
              "inherited": true
            },
            "preDecorators": [],
            "postDecorators": []
          }
        }
      },
      "/components": {
        "defaultBasePath": "/components",
        "defaultPathRewrite": "/components",
        "description": "Endpoint /components",
        "type": "crud",
        "tags": [],
        "collectionId": "components",
        "pathName": "/",
        "public": true,
        "showInDocumentation": true,
        "secreted": false,
        "allowUnknownRequestContentType": false,
        "allowUnknownResponseContentType": false,
        "forceMicroserviceGatewayProxy": false,
        "routes": {}
      }
    },
    "unsecretedVariables": {
      "LOG_LEVEL": {
        "productionEnv": "info",
        "noProductionEnv": "debug"
      },
      "COMPONENTS_VERSION": {
        "productionEnv": "0.10.4",
        "noProductionEnv": "latest"
      }
    }
  }
}
```

</p>
</details>


<details><summary>Example Application with Envoy and Listeners</summary>
<p>

```json
{
  "name": "API Documentation Aggregator",
  "description": "This application groups the plugins API Portal and Swagger Aggregator in order to aggregate the individual Open APIs of all the microservices and show them through a graphical interface.",
  "type": "application",
  "categoryId": "devportal",
  "supportedBy": "Mia-Platform",
  "image": [
    {
      "_id": "5db0105743875a0011618815",
      "name": "Dev Portal.png",
      "file": "image.png",
      "size": 1532,
      "location": "/path/to/your/image.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "supportedByImage": [
    {
      "_id": "5db0106143875a0011618816",
      "name": "MiaPlatform.png",
      "file": "imageSupport.png",
      "size": 139694,
      "location": "/path/to/your/imageSupport.png",
      "sync": 0,
      "trash": 0
    }
  ],
  "services": {
    "api-portal": {
      "defaultEnvironmentVariables": [
        {
          "name": "HTTP_PORT",
          "value": "8080"
        }
      ],
      "defaultLogParser": "mia-nginx",
      "defaultDocumentationPath": "",
      "description": "Use Mia-Platform core API Portal to expose the swagger documentation of your development services in one unique place.",
      "dockerImage": "nexus.mia-platform.eu/api-portal/website:1.16.6",
      "name": "api-portal",
      "repositoryUrl": "https://git.tools.mia-platform.eu/platform/api-portal/website",
      "type": "plugin",
      "componentId": "api-portal",
      "containerPorts": [
        {
          "name": "http",
          "from": 80,
          "to": 8080,
          "protocol": "TCP"
        }
      ]
    },
    "swagger-aggregator": {
      "name": "swagger-aggregator",
      "dockerImage": "nexus.mia-platform.eu/core/swagger-aggregator:3.5.1",
      "defaultEnvironmentVariables": [
        {
          "name": "HTTP_PORT",
          "value": "3000"
        },
        {
          "name": "LOG_LEVEL",
          "value": "{{LOG_LEVEL}}"
        },
        {
          "name": "TRUSTED_PROXIES",
          "value": "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
        },
        {
          "name": "CONFIG_FILE_PATH",
          "value": "/home/node/app/configs/config.json"
        }
      ],
      "type": "plugin",
      "description": "Use Mia-Platform core Swagger Aggregator to aggregate the individual swaggers of all the microservices indicated in the configuration file.",
      "componentId": "swagger-aggregator",
      "defaultDocumentationPath": "",
      "repositoryUrl": "https://git.tools.mia-platform.eu/platform/core/swagger-aggregator",
      "mapEnvVarToMountPath": {
        "swagger-aggregator-config": {
          "type": "file",
          "envName": "CONFIG_FILE_PATH"
        }
      },
      "defaultConfigMaps": [
        {
          "name": "swagger-aggregator-config",
          "mountPath": "/home/node/app/configs",
          "files": [],
          "viewAsReadOnly": true
        }
      ],
      "containerPorts": [
        {
          "name": "http",
          "from": 80,
          "to": 3000,
          "protocol": "TCP"
        }
      ]
    },
    "api-gateway": {
      "name": "api-gateway",
      "type": "plugin",
      "description": "Envoy API Gateway to route requests to the correct service and verify the need of authentication",
      "image": "api-gateway-envoy-plugin.png",
      "dockerImage": "envoyproxy/envoy:v1.26.2",
      "componentId": "api-gateway-envoy",
      "documentation": {
        "type": "externalLink",
        "url": "https://docs.mia-platform.eu/docs/runtime_suite/envoy-api-gateway/overview"
      },
      "defaultDocumentationPath": "",
      "publishOnMiaDocumentation": false,
      "defaultArgs": [
        "-c",
        "/etc/envoy/envoy.json",
        "-l",
        "{{LOG_LEVEL}}",
        "--log-format",
        "{\"level\":\"%l\",\"time\":\"%Y-%m-%dT%T.%fZ\",\"scope\":\"%n\",\"message\":\"%j\"}",
        "--drain-time-s",
        "50"
      ],
      "defaultLogParser": "mia-json",
      "defaultEnvironmentVariables": [],
      "defaultResources": {
        "memoryLimits": {
          "max": "250Mi",
          "min": "150Mi"
        },
        "cpuLimits": {
          "min": "150m",
          "max": "200m"
        }
      },
      "defaultProbes": {
        "liveness": {
          "port": "frontend",
          "path": "/healthz",
          "initialDelaySeconds": 15,
          "periodSeconds": 20
        },
        "readiness": {
          "port": "frontend",
          "path": "/healthz",
          "initialDelaySeconds": 5,
          "periodSeconds": 10
        }
      },
      "containerPorts": [
        {
          "name": "frontend",
          "from": 8080,
          "to": 8080
        },
        {
          "name": "backoffice",
          "from": 8081,
          "to": 8081
        },
        {
          "name": "admin",
          "from": 9901,
          "to": 9901
        }
      ],
      "execPreStop": [
        "bash",
        "-c",
        "echo -e 'POST /drain_listeners?graceful HTTP/1.1\r\nHost: localhost:9901\r\n\r' > /dev/tcp/localhost/9901 && sleep 55s"
      ],
      "defaultTerminationGracePeriodSeconds": 60,
      "defaultConfigMaps": [
        {
          "name": "api-gateway-envoy-config",
          "mountPath": "/etc/envoy",
          "files": [],
          "viewAsReadOnly": true,
          "link": {
            "targetSection": "endpoints"
          }
        }
      ]
    }
  },
  "endpoints": {
    "/documentations/api-portal": {
      "allowUnknownRequestContentType": true,
      "allowUnknownResponseContentType": true,
      "defaultBasePath": "/documentations/api-portal",
      "defaultPathRewrite": "/",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "routes": {
        "GET/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/",
          "path": "/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": false,
            "value": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        },
        "GET/api/swagger/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/api/swagger/",
          "path": "/api/swagger/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        }
      },
      "secreted": false,
      "service": "api-portal",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/api-portal/api": {
      "allowUnknownRequestContentType": false,
      "allowUnknownResponseContentType": false,
      "defaultBasePath": "/documentations/api-portal/api",
      "defaultPathRewrite": "/",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/openapi": {
      "allowUnknownRequestContentType": false,
      "allowUnknownResponseContentType": false,
      "defaultBasePath": "/documentations/openapi",
      "defaultPathRewrite": "/openapi",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    },
    "/documentations/swagger": {
      "allowUnknownRequestContentType": true,
      "allowUnknownResponseContentType": true,
      "defaultBasePath": "/documentations/swagger",
      "defaultPathRewrite": "/swagger",
      "description": "",
      "forceMicroserviceGatewayProxy": false,
      "public": true,
      "routes": {
        "GET/": {
          "acl": {
            "inherited": false,
            "value": "true"
          },
          "allowUnknownRequestContentType": {
            "inherited": true
          },
          "allowUnknownResponseContentType": {
            "inherited": true
          },
          "backofficeAcl": {
            "inherited": true
          },
          "id": "GET/",
          "path": "/",
          "postDecorators": [],
          "preDecorators": [],
          "public": {
            "inherited": true
          },
          "secreted": {
            "inherited": true
          },
          "showInDocumentation": {
            "inherited": true
          },
          "verb": "GET"
        }
      },
      "secreted": false,
      "service": "swagger-aggregator",
      "showInDocumentation": true,
      "tags": [
        "api-docs"
      ],
      "type": "custom"
    }
  },
  "listeners": {
    "frontend": {
      "name": "frontend",
      "port": "8080",
      "selectedByDefault": true,
      "description": "Default listener for frontend API",
      "ownedBy": {
        "componentIds": [
          "api-gateway-envoy"
        ]
      }
    }
  }
}
```

</p>
</details>
