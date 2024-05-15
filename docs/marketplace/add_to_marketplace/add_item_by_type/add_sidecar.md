---
id: add_sidecar
title: Create a sidecar
sidebar_label: Create a sidecar
---

[Sidecar containers](/development_suite/api-console/api-design/microservice-containers.md#sidecar-containers) are secondary utility containers running side by side with the [main container](/development_suite/api-console/api-design/microservice-containers.md#main-container) in the same host.

Sidecars can be added to your Project from the Marketplace or directly specifying a docker image.

Sometimes you may want to add your sidecar to multiple Services. Adding the sidecar from docker image and setting up the correct values for the sidecar configuration for each Service might be a little tricky and error prone.

To ease this process, Mia-Platform lets you upload your sidecar resource definitions to the Marketplace. This way you can define once the correct sidecar configuration and then replicate the same configuration each time you add the sidecar on your Projects.

### Define the sidecar resource

Create a `my-sidecar.json` file and fill it with the sidecar resource definition.

```json
{
  "name": "My sidecar", 
  "itemId": "my-sidecar",
  "description": "A very simple sidecar",
  "type": "sidecar",
  "tenantId": "my-tenant-id",
  "documentation": {
    "type": "externalLink",
    "url": "https://github.com/my-sidecar/docs"
  },
  "resources": {
    "name": "my-sidecar",
    "dockerImage": "ghcr.io/my-sidecar:1.0",
    "containerPorts": [
      {
        "from": 80,
        "name": "http",
        "protocol": "TCP",
        "to": 5000
      }
    ],
  },
}
```

> Note the `"type": "sidecar"` is required to specify that this resource is a sidecar.

In this example, the configuration defines a very simple sidecar resource by specifying only the docker image of the sidecar application and exposing it to the `5000` port of the container. To define a more specific configuration with `ConfigMaps`, `Probes` or `EnvironmentVariables` too just follow the `json-schema` below.

<details>
<summary>Click to view the full JSON Schema for a sidecar</summary>
<p>

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "itemId": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "type": {
      "const": "sidecar"
    },
    "tenantId": {
      "type": "string"
    },
    "documentation": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "url": {
          "type": "string"
        }
      },
    },
    "resources": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "dockerImage": {
          "type": "string"
        },
        "containerPorts": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "from": {
                  "type": ["integer", "string"]
                },
                "to": {
                  "type": ["integer", "string"]
                },
                "protocol": {
                  "type": "string"
                },
              },
            }
          ],
        },
        "defaultArgs": {
          "type": "array",
          "items": [
            {
              "type": "string"
            }
          ]
        },
        "defaultConfigMaps": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "files": {
                  "type": "array",
                  "items": [
                    {
                      "type": "object",
                      "properties": {
                        "content": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        }
                      },
                    }
                  ]
                },
                "mountPath": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                }
              },
            }
          ]
        },
        "defaultEnvironmentVariables": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                },
                "valueType": {
                  "type": "string"
                }
              },
            }
          ]
        },
        "defaultProbes": {
          "type": "object",
          "properties": {
            "liveness": {
              "type": "object",
              "properties": {
                "path": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                }
              },
            },
            "readiness": {
              "type": "object",
              "properties": {
                "path": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                }
              },
            },
            "startup": {
              "type": "object"
            }
          },
        },
        "defaultResources": {
          "type": "object",
          "properties": {
            "cpuLimits": {
              "type": "object",
              "properties": {
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              },
            },
            "memoryLimits": {
              "type": "object",
              "properties": {
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              },
            }
          },
        },
        "defaultSecrets": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "mountPath": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                }
              },
            }
          ]
        }
      },
      "required": [
        "name",
        "dockerImage"
      ]
    },
  },
  "required": [
    "name",
    "itemId",
    "description",
    "type",
    "tenantId",
    "documentation",
    "resources"
  ]
}
```

</p>
</details>

### Publish a new sidecar resource via `miactl`

This section describes the steps required to publish a sidecar resource to the Marketplace via [miactl](/cli/miactl/10_overview.md), the Command Line Interface by Mia-Platform designed to interact with the Mia-Platform Console. Make sure to [configure miactl](/cli/miactl/20_setup.md) before proceeding with the next steps.

To upload the resource to the marketplace, run the following command, specifying the file name and your Company (tenant) id:

```bash
> miactl marketplace apply -f ./my-sidecar.json --company-id my-company-id
```

You should receive a success response similar to this one:

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID     STATUS   

  66423781fdd3d6dd3ca62b7b  my-sidecar  Created 
```

Congratulations! You just created your first sidecar and it is now available on your `Internal Company Marketplace`.

### Update the sidecar resource via `miactl`

You already published a sidecar and you want to update its configuration. In this section we will see how to update it from `miactl`.

In the previous section we created a sidecar resource but we now want to update it to use the version `2.0` of the docker image. To do this, just update the `my-sidecar.json` by changing the relative line.

```js
{
  ... other sidecar configuration
  "resources": {
  ... other sidecar configuration
    "dockerImage": "ghcr.io/my-sidecar:2.0",
  }
}
```

Now run the same `miactl` command, passing the updated `my-sidecar.json` file:

```bash
> miactl marketplace apply -f ./my-sidecar.json --company-id my-company-id
```

You will receive a similar response with `STATUS: Updated`

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID     STATUS   

  66423781fdd3d6dd3ca62b7b  my-sidecar  Updated  
```

Done! Your sidecar resource has been updated and all the new instances will now be created with the correct version.
