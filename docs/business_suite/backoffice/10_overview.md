---
id: overview
title: Overview
sidebar_label: Overview
---
## What is Mia-Platform Backoffice?

The Mia-Platform Backoffice is thought of as an evolution of the previous Mia-Platform CMS. Moreover, it can be considered as a UI builder if you intend to heavily customize the web components or create your custom web components that can be imported into the Mia-Platform Backoffice.

Using this tool, it is possible to create a custom CMS, or a generic User Interface, with the ability to compose custom pages, putting whatever web component coming from the back-kit library or from a custom component library.

### Structure

Talking about Mia-Platform Backoffice, so considering only the capabilities of this tool, its structure is basically composed of two main components:

- The layout: managed by [micro-lc](https://www.micro-lc.io/docs)
- The components: based on Mia-Platform [back-kit library](./60_components/10_adapters.md)

The back-kit library is basically a set of W3C Web Components customizable with a JSON configuration or through the [Backoffice configurator](../../business_suite/backoffice-configurator/10_overview.md).

The backoffice pages can be built upon the usage of the proper configuration of the micro-lc layout, like configuring the menu (e.g. sidebar menu, top-bar menu, and other possibilities provided by micro-lc) and the composition of a various number of web components coming from back-kit library.

It is also possible to configure it easily from the Mia Platform Console, go to the [dedicated section](../../business_suite/backoffice-configurator/10_overview.md) to know how!

## Why do you need Mia-Platform Backoffice?

As already mentioned above, the Mia-Platform Backoffice is a tool intended to build a custom CMS or to build a custom User Interface.

You need Mia-Platform Backoffice if you need a CMS to be configured behind your application management. Moreover, if you intend to build your custom web components or if you want to create your own internal tool or custom User Interface, you can exploit the flexibility of micro-lc and the ease and user-friendly interface of the [Backoffice Configurator](../../business_suite/backoffice-configurator/10_overview.md) to do so. You just have to add your own web component library to the sources from which the Backoffice can retrieve data.

## Architecture overview

![Frontend overview](img/frontend.jpg)

Back-Kit library provides a full set of [W3C Web Components](https://www.w3.org/TR/components-intro/).

```html
<div>
  <crud-client base-path="my-collection"></crud-client>
  <bk-table></bk-table>
</div>
```

Packed within a configuration file, a set of components creates a **layout** that can be plugged in a rendering engine, for instance a `composition` feature like the one provided by [micro-lc](https://micro-lc.io/docs/concepts/composition).

At runtime, when a customized configuration is injected, components are enriched with properties.

Properties may be component-specific or related to the `composer`. Indeed, components can receive properties concerning an
**authenticated user** and/or a **communication channel**. Such channel is paramount to realize an event-driven communication
amongst web components which in return provides isolation for each of them.

:::info
microlc-element-composer sets properties `currentUser` and `eventBus` on each rendered component, injecting respectively
the authenticated user, if any, and an instance of a [rxjs ReplaySubject](https://rxjs.dev/api/index/class/ReplaySubject)
as communication channel.
:::

A Back-Kit component **should do one thing**, hence a web page header composed by a search bar, buttons and, typographies
will contain the same amount of components, linked via the `eventBus`.

Back-Kit prefers to provide **highly scoped components** with fewer configuration degrees of freedom instead of large
configuration options that can easily go wrong due to typos that might become really hard to investigate and debug.
Thus, back-kit provides refresh-buttons, add-new-buttons, *specific-task*-button, in order to aim small and miss small
when conceiving a configuration.

Components expose **properties** (set by the `element-composer` via JS script) and/or **attributes** (as the former but
accessible also from the HTML document as tag attributes with camelCase syntax re-mapped to hyphen-separated-case), interact
via **events** (messages from/to the `eventBus`), and instantiate a [bootstrap](page_layout#bootstrap-aka-initial-state-injection) interface.

As a rule of thumb, a component:

1. **sets** default values and user-provided configurations by evaluating **properties**/**attributes**
2. (may/or may not) **reads** the window URL to **bootstrap** an initial state
3. **makes aware/achieves awareness** of happenings onto the webpage using **output/input events**

After the initialization is completed, each component internal state can be modified either by the component own business logic
or by an external event the component has been instructed to listen to.

Components interfacing with a given event, either **listen to** it or **emit** it. In the latter case, it requires the page
to be aware, for instance, of a *loading* event, or that is *sending* data, whereas the former is referred to event-driven
behavior where the component reacts to something that happened elsewhere.
