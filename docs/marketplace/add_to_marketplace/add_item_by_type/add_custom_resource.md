---
id: add_custom_resource
title: Publish your custom resources to the Marketplace
sidebar_label: Create a Custom Resource
---

It is possible to include in the Marketplace Kubernetes [custom resources](/console/design-your-projects/custom-resources.md) to extend the Kubernetes API or include your own API into the project.

They are basically defined by two fields:

- the `apiVersion` field, which is the API version of the resource
- the `kind` field, which is the kind of the resource

Custom resources can be added to your project by creating one anew or by installing an existing one from the Marketplace, using the `miactl` tool. They are defined with the usual marketplace item schema, by having the _type_ field equal to `custom-resource`.

Custom resources items in the Marketplace supports _versioning_, allowing to update the resource without overwriting the previous ones.

## Custom Resource definition

Inside the panel there is the JSON Schema to use to create a resource with _type_ `custom-resource` you want to add to the marketplace.

<details><summary>JSON Schema</summary>
<p>

```json
{
    "type": "object",
    "additionalProperties": false,
    "properties": {
    "name": {
        "type": "string"
    },
    "generator": {
        "type": "object",
        "properties": {
        "type": {
            "type": "string",
            "enum": ["template"]
        },
        "configurationBaseFolder": {
            "type": "string"
        },
        "templates": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "template": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "fileExtension": {
                        "type": "string",
                        "description": "The extension of the file to generate. If not set, default is .yml"
                    },
                    "folderName": {
                        "type": "string",
                        "description": "The name of the folder where the file will be created, below the configurationBaseFolder"
                    }
                },
                "required": [
                    "template",
                    "name"
                ]
            }
        }
        },
        "required": ["type", "templates"]
    },
    "meta": {
        "type": "object",
        "properties": {
            "kind": {
                "type": "string"
            },
            "apiVersion": {
                "type": "string"
            }
        }
    },
    "spec": {
        "type": "object"
    },
    "attributes": {
        "type": "object",
        "description": "Attributes to be used to generate the form to manage the Custom Resource",
        "additionalProperties": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": [
                    "input"
                ]
            }
        }
        }
    },
    "service": {
        "type": "object",
        "properties": {
        "archive": {
            "type": "string"
        }
        }
    },
    "labels": {
        "type": "array",
        "items": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "value": {
                "type": "string"
            }
        }
        }
    },
    "annotations": {
        "type": "array",
        "items": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "value": {
                "type": "string"
            }
        }
        }
    }
    }
}
```

</p>
</details>

A simple example in YAML of a Custom Resource that follows the schema is the following:

<details>
<summary>SleepInfo</summary>
<p>

```yaml
name: sleepInfo
  meta:
    apiVersion: kube-green.com/v1alpha1
    kind: SleepInfo
  spec:
    sleepAt: "20:00"
    timeZone: Europe/Rome
    weekdays: "1-5"
```

</p>
</details>

## Defined the new Custom Resource

::: info
In the paragraphs to follow, wwe are going to use the `miactl` tool to show how to create a new Custom Resource.
:::

First of all, we need to create a new file that includes the marketplace information and the Custom Resource that we want to add.

```yaml
name: 'Traefik IngressRoute'
description: The configuration of the IngressRoute resource for Traefik
type: custom-resource
tenantId: my-company-id
itemId: traefik-ingressroute
imageUrl: imageUrl.png
supportedByImageUrl: supportedByImageUrl.png
supportedBy: my-company-id
categoryId: kubernetes-custom-resource
version:
  name: 1.0.0
  releaseNote: 'Initial release'
documentation:
  type: externalLink
  url: 'https://docs.mia-platform.eu/docs/infrastructure/paas/tools/traefik#expose-an-endpoint'
resources:
  name: "default"
  meta:
    apiVersion: traefik.io/v1alpha1
    kind: IngressRoute
  labels:
    - name: app.kubernetes.io/instance
      value: "ingress-controller"
  spec:
    entryPoints:
      - "websecure"
    routes:
      - match: Host(`{{PROJECT_HOST}}`)
        kind: Rule
        services:
        - name: "api-gateway"
          port: 8080
```

Please note that:

- the `type: custom-resource` is required to specify that this resource is a Custom Resource
- the `version` property is included, to define this item as a version `1.0.0` with a specific release note: versions are not mandatory but highly suggested to avoid to overwrite previous versions

### Publish a new Custom Resource via `miactl`

This section describes the steps required to publish a sidecar resource to the Marketplace via [miactl](/cli/miactl/10_overview.md), the Command Line Interface by Mia-Platform designed to interact with the Mia-Platform Console. Make sure to [configure miactl](/cli/miactl/20_setup.md) before proceeding with the next steps.

To upload the resource to the marketplace, run the following command, specifying the file name and your Company (tenant) id:

```bash
> miactl marketplace apply -f ./my-custom-resource.yaml --company-id my-company-id
```

You should receive a success response similar to this one:

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID             STATUS   

  66423781fdd3d6dd3ca62b7b  my-custom-resource  Created 
```

You just created your custom resourced, which is now available on your `Company Marketplace`.

### Update the Custom Resource via `miactl`

You can update a Custom Resource Marketplace item by using the same `miactl marketplace apply` explained before, by including an updated file (either in `json` or `yaml` format). 

In case you are trying to update a versioned Marketplace Custom Resource, remember that only few fields can be modified. For more information, refer to the [dedicated section on the "Create your Company Marketplace" page](./add_to_marketplace/create_your_company_marketplace.md#editing-a-versioned-resource).

Considering also the fact that custom resources are defined by the `apiVersion` and the `kind`: in case of updates on the resource you need to actually create a new marketplace item with a different version (possibly with a release note) and the resource with the updates you require.

#### Update non-versioned custom resources

In case the Custom Resource you need to update is not versioned, you can update it always by using the `miactl marketplace apply` command, passing the company id (`tenantId` of your resource) and the resource file you created before with the modifications you need.

Since this is a non-versioned element, there are no limitations on apply changes. However ensure you use the same `itemId` and the same `tenantId` of the resource you want to update.

In case you lost the original resource file (or simply you do not have it anymore), you can retrieve it from the Marketplace by using the `miactl marketplace get` command:

```bash
miactl marketplace get --object-id 66423781fdd3d6dd3ca62b7b > my-custom-resource.yaml
```

You can use the result as a template to modify the resource you want to update.
