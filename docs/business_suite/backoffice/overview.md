---
id: overview
title: Overview
sidebar_label: Overview
---
![Frontend overview](img/frontend.jpg)

Back-Kit library provides a full set of `W3C Web Components`.

```html
<div>
  <crud-client base-path="my-collection"></crud-client>
  <bk-table></bk-table>
</div>
```

Packed within a configuration file, a set of components creates a **layout** that can be plugged in a rendering engine,
for instance a `composer` such as `microlc-element-composer`.

At runtime, when a customized configuration is injected, components are enriched with properties.

Properties may be component-specific or related to the `composer`. Indeed, components can receive properties concerning an
**authenticated user** and/or a **communication channel**. Such channel is paramount to realize an event-driven communication
amongst web components which in return provides isolation for each of them.

:::info
microlc-element-composer sets properties `currentUser` and `eventBus` on each rendered component, injecting respectively
the authenticated user, if any, and an instance of a `rxjs ReplaySubject`
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
via **events** (messages from/to the `eventBus`), and instantiate a [bootstrap](Page_layout#bootstrap-aka-initial-state-injection) interface.

As a rule of thumb, a component:

1. **sets** default values and user-provided configurations by evaluating **properties**/**attributes**
2. (may/or may not) **reads** the window URL to **bootstrap** an initial state
3. **makes aware/achieves awareness** of happenings onto the webpage using **output/input events**

After the initialization is completed, each component internal state can be modified either by the component own business logic
or by an external event the component has been instructed to listen to.

Components interfacing with a given event, either **listen to** it or **emit** it. In the latter case, it requires the page
to be aware, for instance, of a *loading* event, or that is *sending* data, whereas the former is referred to event-driven
behavior where the component reacts to something that happened elsewhere.
