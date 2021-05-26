---
id: overview
title: Micro Launch Complex
sidebar_label: Overview
---

`microlc` is the Mia-Platform solution for building flexible, multi-tenant front-end applications following the
[Micro Frontend](https://micro-frontends.org/) architecture.

`microlc` consists of a core interface that loads, embeds, and orchestrates **plugins** (your individual frontend
applications) at runtime, while providing configuration options and useful out-of-the-box features.

The project is open source, and it can be found on [GitHub](https://github.com/mia-platform/microlc). Although the
core components are written in Typescript and React, microlc is **technology-agnostic**, which means that it integrates
seamlessly with your favorite toolkit, being it Angular, React, Vue, or anything else you like: even vanilla JavaScript!

## Architecture

![Architecture](../img/microlc_architecture.png)

`microlc` is composed by three main blocks: **fe-container**, **be-config** and a varying number
of **plugins**.

## Front-end container

The front-end core of `microlc` is the **fe-container**: a lightweight launcher written in `React` and `Typescript` which is
responsible for rendering the plugins and for providing a set of core functionalities to the application.

These functionalities are for the most part configurable through a [core configuration](core_configuration.md)
retrieved by the launcher at runtime. The choice of consuming this configuration at runtime makes the fe-container
**multi tenant**: multiple tenants can use the same instance of microlc controlling the rendered plugins and the
application theme through different configurations.

:::info
The **fe-container** is also available as [Docker image](https://hub.docker.com/r/miaplatform/microlc).
:::

It follows a list of the features offered and handled by the **fe-container**.

### Base layout

The launcher provides the core navigation layout composed by a top bar and a side menu. The top bar is responsible for
the top-level functionalities, while the list of plugins and the routing capabilities can be placed on top bar or side menu, 
the latter is the default one.

While the top bar is always visible after the configuration load, the menu is designed as an overlay to leave as much space as possible to the
plugins.

:::tip
The plugins can implement their own sub-navigation with an eventual dedicated side menu.  
This will not graphically or logically interfere with `microlc`, which will integrate seamlessly the plugin routing in the main one.
:::

### User management

`microlc` doesn't provide any authentication system, but it can be plugged in using the procedure described in the [Authentication section](./authentication.md).

### Plugin management

One of the most important responsibilities of the **fe-container** is the management of the plugins.  
Each plugin is fetched and added to the side menu **at boot**, while it is rendered and embedded into the launcher **only when requested**.

:::note
If needed, a new route is registered at boot for accessing the plugin.
:::

All the information regarding the plugins to render are retrieved from the [Core configuration](core_configuration.md).

### Branding

Through the configuration, the **fe-container** handles the main branding of the application. Namely, it applies:

- the specified **[menu location](core_configuration#menulocation)** of the menu (topBar/sideBar)
- the specified **[logo](core_configuration#logo)** in the top bar;
- the specified **[favicon](core_configuration#favicon)** and **[document title](core_configuration#pagetitle)**;
- the specified **[navigation url](core_configuration#navigation_url)** to the logo
- the specified **[primary color](core_configuration#primarycolor)** to the different layout components.

:::info
From the **primary color** is derived its **89% tint**, a mixture of the **primary color** with white: both are available using
the [`css variables`](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties),
respectively named `--microlc-primary-color` and `--microlc-primary-color-tint-89`.

`--microlc-primary-color-tint-89` is used to color, for example, the selected menu entry.
:::

### Dark mode

In `microlc` is available the **dark mode**, where the colors are changed to darker tints.
The dark mode is managed using the [`css variables`](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
previously introduced.
It is possible to configure a secondary icon link for the dark theme inside the field `url_dark_image` of the logo object

:::info
A [qiankun plugin](plugin_configuration.md#qiankun-plugin) can programmatically check the attribute `dark-theme`,
on the `html` node, to know if dark mode is enabled.
:::

### Analytics

The integration with [Google Analytics](https://analytics.google.com/) is available and described in the [Analytics section](analytics.md).

## Backend configuration provider

The configuration consumed by the **fe-container** is served by **be-config**, detailed in its [dedicated section](backend.md).

## Plugins

The **plugins** are the `micro-fronted` that actually composes the end application.  
Each plugin is an **independent**, **self-contained** entity which can be written **in any framework**:
plugins can have their own dedicated back-end, and they can be extended or configured at will at runtime.

`microlc` offers different ways to integrate plugins, as outlined [in this section](plugin_configuration.md).  
Plugins can communicate with each other, or navigate to each other manipulating the history of the application:
see [Plugins communication](plugin_configuration.md#plugin-communication) section for a more detailed explanation.
