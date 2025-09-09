---
id: marketplace
title: Marketplace
sidebar_label: Marketplace
---



Mia-Platform Console is shipped with a Marketplace full of useful services that can be used by Developers within their Projects.

> **Note**
>
> From release _v13.7.0_ of Mia-Platform Console, the public definition of Marketplace items has been moved to a public repository on GitHub named [Public Catalog](https://github.com/mia-platform-marketplace/public-catalog) to simplify the process of adding and updating items.
>
> This transaction is seamless and does not require any action from the user.

The Marketplace receives updates with every Mia-Platform Console upgrade but can be disabled or filtered with the following options (set inside the `configurations` object):

| Name | Type | Description | Default | Optional |
|:----:|:----:|:-----------:|:-------:|:--------:|
|`enableMarketplaceSync`| `boolean` | Enable Marketplace Sync hook. If false, any other marketplace related value is ignored. | `true` | ✅ |
|`marketplaceSyncFilters`| `string` | A comma separated list of services types that needs to be updated (possible values are plugin,template,example,application,sidecar). | `plugin` | ✅ |
|`enableProvidersSync` | `boolean` | Enable Providers Sync hook for runtime service providers updates. | `true` | ✅ |
|`registry` | `string` | Allows for the definition of a custom registry host to be used for all marketplace-managed plugins |  | ✅ |

:::caution
If `marketplaceSyncFilters` is set to an empty string (`""`) the script will be deployed but it will immediately exit: if you plan to avoid marketplace synchronization please consider using the `enableMarketplaceSync` set to `false`.
:::

## Examples

### Disable the whole sync process

```yaml
mia-console:
  configurations:
    ...
    enableMarketplaceSync: false
```

### Only sync plugins

```yaml
mia-console:
  configurations:
    ...
    marketplaceSyncFilters: "plugin,sidecar"
```
