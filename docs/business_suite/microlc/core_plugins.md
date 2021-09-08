---
id: core_plugins
title: Core plugins
sidebar_label: Core plugins
---

To extend the potential of `microlc`, Mia-Platform created some [configurable](./core_configuration.md#props) plugins called `core plugins`.

These plugins are open source and can be deployed using the console with low effort.

## microlc-element-composer

This plugin is [publicly available on GitHub](https://github.com/mia-platform/microlc-element-composer) and 
can be used to compose the UI of your page, with the precondition that each piece has been made as [`custom-elements`](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements).

The layout can be composed using rows and columns: it will be adaptive thanks to the `flex` layout.

:::caution
In addition to the [properties that you can configure](./core_plugins.md#config) for each `custom-element`, 
the plugin **always** injects two properties called `eventBus` and `currentUser`: 
`eventBus` is an [RxJS's Subject](https://rxjs.dev/guide/subject) used as communication channel between components,
`currentUser` is an object which may represent the session currently authenticated user.
:::

### elementsConfiguration
- _type_: object;
- _required_: `true`;
- _description_: is the main object that must be injected as [prop](./core_configuration.md#props).

#### type
- _type_: string;
- _enum_: `row`, `column`, `element`;
- _required_: `true`;
- _description_: type of object to render.

#### tag
- _type_: string;
- _required_: `false`;
- _description_: tag of the custom element to render.  
  **Is mandatory only for type `element`**.

#### url
- _type_: string;
- _required_: `false`;
- _description_: URL of  the entry point used to register and boot the custom element.  
  **Is considered only for type `element`**.

#### config
- _type_: object;
- _required_: `false`;
- _description_: property injection for the custom element.  
  **Is considered only for type `element`**.

#### style
- _type_: object;
- _required_: `false`;
- _description_: CSS style to inject to the DOM element.  
  **Is considered only for type `element`**.

#### busDiscriminator
- _type_: string;
- _required_: `false`;
- _description_: Event bus discriminator, used to create a dedicated communication channel.  
  By default, is injected the general communication channel.  
  **Is considered only for type `element`**.

#### content
- _type_: object;
- _required_: `false`;
- _description_: the definition of the child component. This field makes this structure recursive.

### Structure example
```json
{
  "type": "row",
  "content": [{
    "type": "column",
    "style": "width: 89%",
    "content": [{
      "type": "element",
      "tag": "button",
      "url": "https://your-host.com/your/component/entry.js",
      "config": {
        "property-a": "value-a"
      }
    }]
  }]
}
```
