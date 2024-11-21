---
id: create_sidecar
title: Publish your Sidecar to the Marketplace
sidebar_label: Create a Sidecar
---

[Sidecar containers](/development_suite/api-console/api-design/microservice-containers.md#sidecar-containers) are secondary utility containers
running side by side with the [main container](/development_suite/api-console/api-design/microservice-containers.md#main-container) in the same host.

Sidecars can be added to your Project from the Marketplace or directly specifying a docker image.

Sometimes you may want to add your sidecar to multiple Services.
Adding the sidecar from docker image and setting up the correct values for the sidecar configuration for each Service might be a little tricky and error prone.

To ease this process, Mia-Platform Console allows you to define your sidecar resource in the Marketplace.
This way, you can define once the correct sidecar configuration and then replicate it every time you need to add it in your Projects.

### Define the sidecar resource

Create a `my-sidecar.yaml` file and fill it with the sidecar resource definition.

:::tip
We recommend `yaml` to define your resources, but you can use either `yaml` or `json` as these are both supported.
:::

```yaml
name: My sidecar
itemId: my-sidecar
description: My sidecar
type: sidecar
documentation:
  type: externalLink
  url: https://github.com/my-sidecar/docs
resources:
  name: my-sidecar
  dockerImage: ghcr.io/my-sidecar:1.0
tenantId: rocket-playground
```

:::info
Note the `"type": "sidecar"` is required to specify that this resource is a sidecar.
:::

### Publish a new sidecar resource via `miactl`

This section describes the steps required to publish a sidecar resource to the Marketplace via [miactl](/cli/miactl/10_overview.md),
the Command Line Interface by Mia-Platform designed to interact with the Mia-Platform Console. Make sure to [configure miactl](/cli/miactl/20_setup.md) before proceeding with the next steps.

To upload the resource to the marketplace, run the following command, specifying the file name and your Company (tenant) id:

```bash
> miactl marketplace apply -f ./my-sidecar.yaml --company-id my-company-id
```

You should receive a success response similar to this one:

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID     STATUS   

  66423781fdd3d6dd3ca62b7b  my-sidecar  Created 
```

Congratulations! You just created your first sidecar and it is now available on your `Internal Company Marketplace`.

### Update the sidecar resource via `miactl`

In the previous section we created our first sidecar resource. Now we want to update it in order to use the version `2.0` of the docker image.  
As a first step, retrieve the sidecar definition from `miactl`:

```bash
> miactl marketplace get --object-id 66423781fdd3d6dd3ca62b7b > my-sidecar-update.yaml
```

Then update the `my-sidecar` docker image version changing the relative line in the `my-sidecar-update.yaml` file.

```yaml
... other sidecar configuration
resources:
  ... other sidecar configuration
  dockerImage: ghcr.io/my-sidecar:2.0
```

And finally, run the same `miactl` command, passing the updated `my-sidecar-update.yaml` file:

```bash
> miactl marketplace apply -f ./my-sidecar-udapte.yaml --company-id my-company-id
```

You will receive a similar response with `STATUS: Updated`

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID     STATUS   

  66423781fdd3d6dd3ca62b7b  my-sidecar  Updated  
```

Done! Your sidecar resource has been updated and all the new instances will now be created with the correct version.

### Customize your sidecar definition

In these examples, the configuration defines a very simple sidecar resource by specifying only the docker image of the sidecar application and exposing it to the `5000` port of the container,
but you can define `ConfigMaps`, `Probes` or `Environment Variables` too.  
To do this, create a more specific sidecar definition following the `json-schema` below.

<details>
<summary>Click to view the full JSON Schema.</summary>
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
