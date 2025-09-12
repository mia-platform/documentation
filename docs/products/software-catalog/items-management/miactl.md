---
id: miactl
title: miactl
sidebar_label: miactl
---

One of the possible ways to interact with the Catalog is through [`miactl`](/products/console/cli/miactl/10_overview.md), the Mia-Platform Command Line Interface.

:::tip
Before getting started, make sure you have completed the [setup guide](/products/console/cli/miactl/20_setup.md).
:::

The commands related to the Catalog are described in the [dedicated section](/products/console/cli/miactl/30_commands.md#marketplace)

## Declarative approach

In addition to the basic use of the tool through individual application commands, miactl can be used in combination with a [Git Provider and a CI/CD system](/products/console/company-configuration/providers/overview.md) to set a **declarative management** of the Catalog. This approach allows for a centralized management of the items, enabling supervised control of the state of resources, while extending the possibility of contribution to users without the necessary permissions (e.g., the use of Pull Requests/Merge Requests supervised by a maintainer).

The resources required to implement a declarative journey are:

- a Git provider,
- a CI/CD Tool, and
- a Console [service account](/products/console/identity-and-access-management/manage-service-accounts.md).

:::tip
For a thorough explanation on supported Providers and how to configure them in the Console, [consult this guide](/products/console/company-configuration/providers/configure-provider.mdx).
:::

### Creation of the repository

The center of our journey is a **Git repository** that will store the [manifests](/products/software-catalog/items-manifest/overview.md) of the Catalog items, alongside any additional resource they might need (e.g., items logos).

The structure of the repository can vary, but a good setup may be something like the following one (actually taken from [Mia-Platform Public Catalog](https://github.com/mia-platform-marketplace/public-catalog) repository).

```txt
Root
├── 📁 items
│   ├── 📁 <item-type>
│   │   ├── 📁 <item-id>
│   │   │   ├── 📁 assets
│   │   │   │   ├── 🖼️ logo.png
│   │   │   │   └── ...
│   │   │   └── 📁 versions
│   │   │       ├── 📄 <version-name>.json
│   │   │       ├── 📄 <version-name>.yaml
│   │   │       └── ...
│   │   └── ...
│   └── ...
└── ...
```

The folders hierarchical structure reflects that fact that each item has a **type**, at least one **version**, and, possibly, some **assets**. The JSON and YAML files inside the `versions` folders are the items [manifests](/products/software-catalog/items-manifest/overview.md).

Keeping in mind that the item names are purely indicative, this may be an example:

```txt
Root
├── 📁 items
│   ├── 📁 plugins
│   │   ├── 📁 inventory-system
│   │   │   ├── 📁 assets
│   │   │   │   ├── 🖼️ inventory_system_logo.png
│   │   │   └── 📁 versions
│   │   │       ├── 📄 1.0.0.json
│   │   │       ├── 📄 1.1.0.json
│   │   │       └── 
│   │   └── 
│   └──
└──
```

### CI/CD Pipeline - An example with Gitlab

The idea behind the automation of the managing process is to leverage a CI/CD tool to setup a **pipeline** that will apply all the manifests using miactl.

Any CI/CD tool will do the trick, but in this example we will focus on a Gitlab pipeline.

First of all, you need to create a **service account** on the Console, using, for example, the [Client Secret Basic authentication](/products/console/identity-and-access-management/manage-service-accounts.md#adding-a-service-account).

With the account in place, create a `CLIENT_ID` and a `CLIENT_SECRET` [Gitlab CI/CD Variable](https://docs.gitlab.com/ee/ci/variables/) in your project and set the respective `client-id` and `client-secret` values you obtained during the setup of the service account.

:::tip
We suggest to mask the variable and to protect it, as suggested in [Gitlab documentation](https://docs.gitlab.com/ee/ci/variables/#cicd-variable-security).
:::

Now write your pipeline in a `.gitlab-ci.yml` file with the following contents:

```yaml
stages:
  - preparation
  - apply-catalog

variables:
  # make sure to use the latest miactl version available https://github.com/mia-platform/miactl/releases
  MIACTL_VERSION: "0.17.3"  

preparation:
  stage: preparation
  image: alpine:latest
  script:
    - apk add --no-cache git
    - git clone $CI_REPOSITORY_URL ./catalog-repo
    - cd ./catalog-repo

apply-catalog:
  stage: apply-catalog
  image: ghcr.io/mia-platform/miactl:$MIACTL_VERSION
  script:
    - 'echo "COMPANY_ID: $COMPANY_ID"'
    - 'echo "CONSOLE_ENDPOINT: $CONSOLE_ENDPOINT"'
    - miactl context auth new-auth --client-id $CLIENT_ID --client-secret $CLIENT_SECRET
    - miactl context set new-context --company-id $COMPANY_ID --endpoint $CONSOLE_ENDPOINT --auth-name new-auth
    - miactl context use new-context
    - miactl catalog apply -f ./items

  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

:::caution
This pipeline is just an example. You may need to implement additional checks and use different images.
:::

Here is an explanation of the environment variables needed in the pipeline:

- `MIACTL_VERSION`: the version of miactl, make sure to always use the latest version in order to benefit the latest features and bug fixes.
- `CLIENT_ID`: a secret env containing the service account client ID.
- `CLIENT_SECRET`: a secret env containing the service account client secret.
- `CONSOLE_ENDPOINT`: the base URL of your Console installation.
- `COMPANY_ID`: the Company ID where you want the Catalog items to be created in.

### Interaction with the repository

One of the main benefits of following a declarative approach is that you can leverage the Git provider to setup a **collaborative workflow**, where developers can open Merge Requests to the Catalog repository, and Maintainers can approve and merge them.

In this way, even users without the permission to manage the Catalog directly can propose additions or changes, and curators can review and apply those changes.

#### Deleting an item

When deleting an item or an item's version from the Catalog, keep in mind that you need to work both on the repository and on the Catalog itself, since a declarative approach usually works only in addition (i.e., deleting a manifest from the repository will not remove the item from the Catalog).

Therefore, remove the manifest from Git and use the `miactl catalog delete` command to clean the Catalog.
