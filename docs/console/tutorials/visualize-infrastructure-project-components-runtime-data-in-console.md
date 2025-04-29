---
id: visualize-infrastructure-project-components-runtime-data-in-console
title: View Infrastructure Runtime Data In Console
sidebar_label: View Infrastructure Project Runtime
---

This tutorial will demonstrate you how to collect runtime data from your cloud provider and make it available to the your final user in Console.

The tutorial assumes you have the following prerequisites in place:

- you have created an [Infrastructure Project](/console/project-configuration/infrastructure-project.md#creating-an-infrastructure-project)
- you are using GitLab
- you have a repository with a [Terraform](https://www.hashicorp.com/en/products/terraform)/[OpenTofu](https://opentofu.org/) project in place that can produce a terraform plan file using the `show` command
- you can modify the CI/CD pipeline for that repository

## Architectural overview

The purpose of this tutorial is to

- re-use a [Terraform](https://www.hashicorp.com/en/products/terraform)/[OpenTofu](https://opentofu.org/) plan to extract insights from the cloud provider runtime,
- manipulate and push them to the Console using an [Infrastructure Component Runtime](/software-catalog/items-manifest/infrastructure-component-runtime.md) catalog item,
- visualize them in the Console using a Composer-based extension

### Scheduled Pipeline with a Plan

Create a scheduled pipeline on GitLab that runs a job looking like the following:

```yaml
runtime-data:
  image:
    name: ghcr.io/mia-platform/miactl:latest

  stage: apply

  dependencies:
    - plan

  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
      when: on_success

  variables:
    CLIENT_ID: <YOUR_CLIENT_ID>
    CLIENT_SECRET: <YOUR_CLIENT_SECRET>
    CONSOLE: <YOUR_CONSOLE_HOST>
    COMPANY_ID: <YOUR_COMPANY_ID>

  before_script:
    - apk add jq
    - cat tfplan.json

  script:
    # process plan file and create runtime manifest for catalog
    - cat tfplan.json | jq '.prior_state.values.root_module.resources[0]' > runtime_raw_data.json
    - jq --slurpfile runtimedata runtime_raw_data.json '.resources.runtimeData = $runtimedata[0]' manifest.tpl > runtime_manifest.json
    - cat runtime_manifest.json
    # publish to catalog with miactl
    - miactl context auth ci-auth --client-id "$CLIENT_ID" --client-secret "$CLIENT_SECRET"
    - miactl context set console --endpoint $CONSOLE --company-id $COMPANY_ID --auth-name ci-auth
    - miactl context use console
    - miactl catalog apply --company-id=$COMPANY_ID -f runtime_manifest.json
```

<details>
<summary>The manifest.tpl template file to be customized at need</summary>

```json
{
    "itemId": "my-item-id",
    "name": "my-item-id-name",
    "type": "infrastructure-component-runtime",
    "releaseDate": "2025-04-14T07:46:09.508Z",
    "tenantId": "<company-id>",
    "resources": {
        "projectId": "<project-object-id>",
        "name": "my-item-id-name",
        "tags": ["tag1", "tag2"],
        "runtimeData": "REPLACE"
    }
}
```

</details>

This will make it possible to extract runtime attributes from a plan file produced by the `plan` job and push it as a Catalog item in your company.

### Composer-based extension using Console API

To visualize data in Console you can add a new [Extension](/console/company-configuration/extensions.md#add-new-extension) with Composer type.

In the Composer you can use the [Console SDK WebComponent Client](https://github.com/mia-platform/console-sdk/tree/main/packages/console-client-wc) to fetch the Catalog API and display data.

:::caution
The Console SDK WebComponent is an experimental part of the product, and has limited API support.
:::

To use the WebComponent, make sure you add the following source to the sources list:

- `"https://cdn.mia-platform.eu/console/console-client/<VERSION>/dist/index.esm.js"`

and create the tag for micro-lc as follows:

```json
 {
    "tag": "console-client",
    "attributes": {
        "baseApi": "/api/marketplace/"
    }
}
```

Then you can add a base filter by using a Tab (or another visualization component) that applies the following base filters:

```json
[
    {
        "operator": "equal",
        "property": "types",
        "value": "infrastructure-component-runtime"
    },
    {
        "operator": "equal",
        "property": "tenantId",
        "value": "<YOUR_COMPANY_ID>"
    },
    {
        "operator": "equal",
        "property": "resolveResourcesData",
        "value": true
    }
]
```
