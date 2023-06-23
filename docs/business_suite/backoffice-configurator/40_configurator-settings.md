---
id: configurator-settings
title: Configurator settings
sidebar_label: Configurator-settings
---
:::caution
This is a **BETA** feature and, as such, is currently under **active development**. Pay attention using this section.
:::

These settings are only related to the Console plugin itself and will not affect your runtime environment. 

## Environment variables

A common use-case when configuring a Backoffice instance is to use **interpolated variables** in configuration files 
(e.g., for the version of a web-components library). The configurator automatically pulls the unsecreted variables of
the project and uses them to correctly interpret configurations with interpolated sections.

To manage the variables used by the configurator, a dedicated modal can be opened with the *Variables* button on the top
right corner of both the [structure](./20_structure.md) and the [compose configuration](./30_compose-pages.md) pages.

The modal is divided into two section. The *Public* section lists the project unsecreted variables divided for environment
(the variables are **readonly**). The environment can be switched to try the configuration with the different variables
values.

![Environment modal public tab](img/environment_public-tab.png)

The *Test* section can be used to define **volatile**, test-only variables in a key-value pair fashion. This can be
useful for example to simulate secreted variables or to temporarily override unsecreted variables, since the configurator
will use test variables over public variables when they have the same key.

![Environment modal test tab](img/environment_test-tab.png)

:::tip
Variables defined in the *Test* section of the modal are shared between all sections of the configurator. However, if
you leave the page and return, your will lose your environment.
:::

## Source maps

The Configurator preview can only load resources that are publicly available on the net and with the right
[CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). 

This poses an issue if you would like to view [external components](./60_external-components/10_overview.md), 
images, or assets deployed in a production environment, CDN, or authenticated route.

Let's consider, for example, the following compose page configuration, where web-components are sourced from the
authenticated endpoint `https://my-domain/back-kit`:

```json
{
  "content": {
    "tag": "bk-button"
  },
  "sources": ["https://my-domain/back-kit/bk-web-components.esm.js"]
}
```

When the Configurator preview tries to call the endpoint, the request fails, since it is not authenticated.

To solve this issue, the Configurator loads a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 
with the purpose of reverse proxying unreachable requests to URLs reachable by the preview. The Service Worker can be
configured in the _Source Map_ tab of the _Configurator Settings_ modal.

![Source map tab](img/configurator-settings_source-map.png)

Here you can specify pairs of locations in a _from-to_ fashion: the Service Worker will intercept any request made to the
`from` URL and redirect it to the `to` URL, which may be, for example, a public CDN.

![Source map source](img/configurator-settings_source-map-source.png)

On top of that, for each pair you can specify any **query** or **header** to be attached to the request made to the `to` URL.

![Source map fetch options](img/configurator-settings_source-map-fetch-options.png)
