---
id: create_infrastructure_resource
title: Publish your Infrastructure Resources to the Marketplace
sidebar_label: Create an Infrastructure Resource
---

When designing your Project in the Mia-Platform Console, you can define and configure [Infrastructure Resources](/console/design-your-projects/custom-resources/custom-resources.md), either from scratch or from the existing resources already included in the Marketplace. 

An infrastructure resource may be either Kubernetes type, and thus refer to a particular Custom Kubernetes Resource, or to Non-Kubernetes ones (Lambda functions, Terraform resources, etc.).

Here we explain how you can add your own Infrastructure Resources to the Marketplace.

Infrastructure Resources are basically defined by two fields:

- the `apiVersion` field, which should be set to `custom-generator.console.mia-platform.eu/v1` for generic template-based Infrastructure Resources, or to the version of the Kubernetes API used by the resource in case of Kubernetes-specific Custom Resources
- the `kind` field, which is the specific resource type of the resource

An Infrastructure Resource can be created from scratch or from an existing Marketplace item and added to your Project. Infrastructure Resources on the Marketplace follow the base Marketplace item schema defined in the ["Create your Company Marketplace" page](/software-catalog/manage-items/overview.md#how-to-configure-a-new-item), with the _type_ field set to `custom-resource`.

Infrastructure resource items in the Marketplace also support _versioning_, allowing you to update a resource without overwriting its previous versions. 

## Infrastructure Resource definition

The following JSON Schema can be used to create a Marketplace item with _type_ `custom-resource`.

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
        "runtime": {
          "type": "object", 
          "properties": {
            "type": {
              "type": "string",
              "enum": ["kubernetes"],
              "description": "The type of the Infrastructure resource. At the moment the only supported type by the marketplace is 'kubernetes'"
            },
            "resourceId": {
              "type": "string",
              "description": "The plural name for the Infrastructure resource definition."
            }
          }
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
            "description": "Attributes to be used to generate the form to manage the Infrastructure Resource",
            "additionalProperties": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["input"]
                    }
                }
            }
        },
        "service": {
            "type": "object",
            "properties": {
                "archive": {
                    "type": "string",
                    "description": "URL for an tar.gz archive to be used to generate a new repository"
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

This schema can be used to define both available types of Infrastructure Resources: generic **template-based** Infrastructure Resources, and **Kubernetes-specific** ones.

Here is an example of a template-based Infrastructure Resource:

<details>
<summary>ExternalOrchestratorLambda</summary>
<p>

```yaml
name: ExternalOrchestratorLambda
meta:
    kind: ExternalOrchestratorLambda
    apiVersion: custom-generator.console.mia-platform.eu/v1
spec:
  code: the code
generator:
  type: template
  configurationBaseFolder: base-folder-name
  templates:
    - template: this template can take some values from the spec, such as %spec.code%
      name: template-name
      fileExtension: json # default is yaml
      folderName: template-folder-name
```

</p>
</details>

Here is an example of a Kubernetes-specific Infrastructure Resource, used to configure [`kube-green`](https://kube-green.dev/):

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
runtime:
  type: kubernetes
  resourceId: sleepinfos
```

</p>
</details>

## Create a new Infrastructure Resource

:::info
In the following paragraphs, we are going to use the `miactl` tool to create a new Infrastructure Resource.

Make sure to [configure miactl](/cli/miactl/20_setup.md) before proceeding with the next steps.
:::

### Define the new Marketplace item

First of all, we need to create a new file that includes the Marketplace item information and the Infrastructure Resource that we want to add.

Here is an example of Marketplace item definition for a template-based Infrastructure Resource:

<details>
<summary>template-custom-resource.yaml</summary>
<p>

```yaml
name: Google Cloud Function External
description: Google Function Template with external repository handled by Developer Team
type: custom-resource
tenantId: my-company-id
itemId: google-function-external-template
image:
  localPath: ../../images/google-cloud-functions.png
supportedByImage:
  localPath: ../../images/mia-platform-logo.png
categoryId: serverless
version:
  name: 1.0.0
  releaseNote: Initial release
resources:
  meta:
    apiVersion: custom-generator.console.mia-platform.eu/v1
    kind: GoogleFunctionTemplateGenerator
  name: my-google-function
  spec:
    targetRuntime: nodejs20.x
    helloMessage: Say hello from your Cloud Function
    targetRepositoryId: 1234
  generator:
    configurationBaseFolder: googlecloudfunctions
    templates:
      - name: configs
        template: |
          TARGET_RUNTIME=%spec.targetRuntime%
          HELLO_MESSAGE=%spec.helloMessage%
          TARGET_REPOSITORY_ID=%spec.targetRepositoryId%
        fileExtension: env
    type: template
```

</p>
</details>

Here is an example of Marketplace item definition for a Kubernetes-specific Infrastructure Resource:

<details>
<summary>k8s-custom-resource.yaml</summary>
<p>

```yaml
name: Traefik IngressRoute
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
  releaseNote: Initial release
documentation:
  type: externalLink
  url: https://docs.mia-platform.eu/docs/infrastructure/paas/tools/traefik#expose-an-endpoint
resources:
  name: default
  meta:
    apiVersion: traefik.io/v1alpha1
    kind: IngressRoute
  labels:
    - name: app.kubernetes.io/instance
      value: ingress-controller
  runtime:
    type: kubernetes
    resourceId: ingressroutes
  spec:
    entryPoints:
      - websecure
    routes:
      - match: Host(`{{PROJECT_HOST}}`)
        kind: Rule
        services:
        - name: api-gateway
          port: 8080
```

</p>
</details>

Please note that:

- the `type: custom-resource` is required to specify that this resource is a Custom Resource
- the `version` property is required and must be composed by its _name_, e.g. to define this item as a version `1.0.0`, and the _releaseNote_ to highlight the latest updates of said release

:::info
Versions are not mandatory but highly recommended to avoid overwriting existing resources.

Also, it is required to follow the [Semantic Versioning](https://semver.org/) convention when creating new versions: this convention is used to group the different versions of the same marketplace items and determine the _latest_ version that will be used by the Console to help the user to determine the best version to use and be notified of further updates.
:::

### Publish the new Infrastructure Resource

To upload the resource to the Marketplace, run the following command, specifying the file name and your Company (tenant) id:

```bash
> miactl marketplace apply -f ./my-custom-resource.yaml --company-id my-company-id
```

You should receive a success response similar to this one:

```bash
1 of 1 items have been successfully applied:

  OBJECT ID                 ITEM ID             STATUS   

  66423781fdd3d6dd3ca62b7b  my-custom-resource  Created 
```

You just created your custom resource, which is now available on your `Company Marketplace`.

### Update the Infrastructure Resource

You can update a Infrastructure Resource Marketplace item by using the same `miactl marketplace apply` command explained before, by including an updated file (either in `json` or `yaml` format).

When updating a Infrastructure Resource, it is recommended to create a new version of the Marketplace item to avoid overwriting the existing one.
The new version should contain the updated resource definition and a release note detailing the changes.

In case you are trying to overwrite a versioned Marketplace Infrastructure Resource, remember that only few fields can be modified.
For more information, refer to the [dedicated section on the "Create your Company Marketplace" page](/software-catalog/manage-items/overview.md#editing-a-versioned-resource).

#### Update non-versioned Infrastructure Resources

In case the Infrastructure Resource you need to update is not versioned, you can update it by using the `miactl marketplace apply` command, passing the company id (`tenantId` of your resource) and the resource file you created before with the modifications you need.

Since this is a non-versioned element, all field values can be updated without limitations. However, please make sure to use the same `itemId` and the same `tenantId` of the resource you want to update.

In case you lost the original resource file (or simply you do not have it anymore), you can retrieve it from the Marketplace by using the `miactl marketplace get` command:

```bash
miactl marketplace get --object-id 66423781fdd3d6dd3ca62b7b > my-custom-resource.yaml
```

You can use the result as a template to modify the resource you want to update.

#### Update a Custom Kubernetes Resource in order to see it in the Runtime Area

If you've upgraded to Console release v13.3.0, you can now view the status of your Current Kubernetes Resources directly in the Runtime section. To enable this feature, please follow the instructions above to update the schema or publish a new version to include the following fields in `runtime` property in its definition:
```yaml
  runtime:
    type: kubernetes # "The type of the Custom Kubernetes resource
    resourceId: sleepinfos # The plural name for the Custom Kubernetes resource definition
```
