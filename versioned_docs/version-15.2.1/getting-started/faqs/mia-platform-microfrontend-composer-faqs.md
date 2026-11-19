---
id: mia-platform-microfrontend-composer-faqs
title: Mia-Platform Microfrontend Composer FAQs
sidebar_label: Microfrontend Composer FAQs
---

### Core Concepts & Architecture

#### What is the Microfrontend Composer?
The Microfrontend Composer is a low-code/no-code tool within the Mia-Platform Console that allows you to build user interfaces, such as backoffices, dashboards, and **developer portals**, by assembling pages from a library of pre-built or custom components. It provides a visual interface for designing layouts and configuring components, abstracting away much of the complexity of frontend development.
[Discover more](/products/microfrontend-composer/what-is.md)

#### What is the underlying technology that powers the Microfrontend Composer?
The Composer uses **micro-lc**, an open-source microfrontend orchestrator, to render the final application. micro-lc is responsible for dynamically loading and displaying different types of content, including pages composed of web components, iframes, or entire microfrontends built with frameworks like React or Angular.
[Discover more](/products/microfrontend-composer/architecture.md)

#### Why should I use a microfrontend architecture?
A microfrontend architecture breaks down a large monolithic frontend application into smaller, independent, and deployable pieces. The key benefits include:
* **Team Autonomy**: Different teams can work on different parts of the application independently.
* **Technology Agnosticism**: You can use different frameworks (React, Angular, Vue) for different microfrontends.
* **Incremental Upgrades**: You can update or rewrite parts of your application without affecting the whole.
* **Resilience**: An error in one microfrontend is less likely to bring down the entire application.
  This approach aligns well with a modern **service oriented architecture**.
  [Discover more](/products/microfrontend-composer/what-is.md)

#### What is a Web Component?
A Web Component is a standardized way to create custom, reusable HTML tags. They are framework-agnostic, meaning a web component can be used in any web application, regardless of whether it's built with React, Angular, or plain JavaScript. The Microfrontend Composer heavily relies on web components for its composable pages.
[Discover more](/products/microfrontend-composer/external-components/overview.md)

#### What is Back-Kit?
**Back-Kit** is Mia-Platform's official library of pre-built, production-ready web components designed specifically for the Microfrontend Composer. It includes a wide range of components for building data-intensive applications, such as tables, forms, buttons, cards, and data clients. These components are designed to work together seamlessly through an event-based communication system.
[Discover more](/products/microfrontend-composer/back-kit/10_overview.md)

#### What is the difference between a "compose" page and a "microfrontend" page?
* A **Compose Page** is built visually within the Composer configuring web components (like those from Back-Kit). This is the low-code approach.
* A **Microfrontend Page** is used to integrate an entire, independently developed microfrontend application (e.g., a React or Angular app). You provide the URL to the microfrontend's entrypoint, and the orchestrator loads it into the page.
  [Discover more](/products/microfrontend-composer/composer/10_structure.md#page-types)

#### What is the role of the `micro-lc-web-server`?
The `micro-lc-web-server` is a lightweight web server included in the Composer setup. Its job is to serve the static assets of your composed frontend application, including the main `index.html` file, the configuration files, and any other assets. It also handles routing for client-side navigation.
[Discover more](/products/microfrontend-composer/architecture.md)

#### How does the event-driven architecture of Back-Kit work?
Back-Kit components are decoupled and communicate with each other using an **event bus**. Instead of directly calling each other, components emit events to signal that something has happened (e.g., a button emits a `click` event). Other components can listen for these events and react accordingly (e.g., a modal opens when it hears the `click` event). This makes the system highly modular and extensible.
[Discover more](/products/microfrontend-composer/back-kit/10_overview.md#data-flow)

### Getting Started & Basic Configuration

#### How do I create my first application with the Microfrontend Composer?
You can create a frontend application from the **Design** area of a project in the Mia-Platform Console. Navigate to **Microfrontend Composer**, and if no application exists, you can create one from a template. The "Microfrontend Composer Toolkit" is a great starting point, as it comes with a pre-configured layout and several example pages.
[Discover more](/products/microfrontend-composer/tutorials/basics.mdx)

#### How do I create a new page?
In the Microfrontend Composer's configurator, go to the **Pages** tab in the left-hand navigation. Click the "Create new page" button. You will need to provide a unique ID for the page and choose its type (e.g., "Compose"). This creates a blank canvas where you can start adding components.
[Discover more](/products/microfrontend-composer/composer/10_structure.md#create-new-page)

#### How do I add a new item to the main navigation menu?
Assuming you are using the `bk-layout` component from Back-Kit:
1. Go to the **Layout** tab in the configurator.
2. Select the `bk-layout` component from the component tree.
3. In the properties panel on the right, find the **Menu Items** property and click "Edit property".
4. In the modal, add a new item. You must provide a unique `id` for the menu item and a `label` to display. To link it to a page, set the `href` property to the route of the page you created (e.g., `/my-new-page-route`).
[Discover more](/products/microfrontend-composer/faqs.md#components)

#### How do I add a component, like a button, to a page?
On a "Compose" page, you can add components from the **Add new component** panel. You can search for the component you want (e.g., `bk-button`), drag it, and drop it onto the desired location on your page canvas. Once added, you can select it to configure its properties in the right-hand panel.
[Discover more](/products/microfrontend-composer/composer/20_compose_pages.md)

#### How do I configure a component's properties?
After selecting a component on the page canvas, its configurable properties will appear in the right-hand panel. You can set properties like labels, icons, and colors directly in the form fields. For more complex properties like data schemas or event configurations, you can click "Edit property" to open a code editor.
[Discover more](/products/microfrontend-composer/composer/20_compose_pages.md#configure-a-component)

#### How can I see a preview of my application?
The Microfrontend Composer provides a live preview within the configurator itself. The page canvas shows you a real-time representation of what your page will look like. For a full application preview, you can open the application's public URL in a new browser tab.
[Discover more](/products/microfrontend-composer/composer/10_structure.md)

#### What is the difference between the "Layout" tab and the "Pages" tab?
* The **Pages** tab is where you create and manage the individual pages of your application.
* The **Layout** tab is where you configure the overall structure that is shared across all pages, such as the header, footer, and main navigation menu. Components placed here are visible on every page of the application.
  [Discover more](/products/microfrontend-composer/composer/10_structure.md)

### Working with Back-Kit Components & Data

#### How do I display data from a backend service in a `bk-table`?
1. Add a **data-client component**, like the `bk-crud-client`, to your page. Configure it with the base path of the backend service (e.g., a [CRUD Service](/runtime-components/plugins/crud-service/10_overview_and_usage.md)) that exposes the data.
2. Add a `bk-table` to the page.
3. Connect the table to the client by making them listen to and emit the same events. For example, configure the table to emit a `need-data` event on load, and configure the `bk-crud-client` to listen for `need-data` to trigger a data fetch. The client will then emit a `success` event with the data, which the table listens for to render the rows.
[Discover more](/products/microfrontend-composer/back-kit/60_components/100_crud_client.md)

#### How can I add a new column to a `bk-table`?
Select the `bk-table` component. In its properties, find the **Data schema** property and click to edit it. This will open a JSON editor. Inside the `properties` object of the schema, add a new key-value pair. The key is the field name from your data, and the value is an object defining the column's header, type, and other display options.
[Discover more](/products/microfrontend-composer/faqs.md#components)

#### How do I create a form to add a new record?
You would typically use a `bk-form` inside a `bk-modal`.
1. Add a button that emits an `add-new` event when clicked.
2. Configure a `bk-modal` to listen for the `add-new` event to open itself.
3. Place a `bk-form` inside the modal. Configure its data schema to define the form fields.
4. The form's "submit" button should emit an event like `create-data`.
5. A `bk-crud-client` can listen for `create-data` to send a POST request to your backend service with the form's data.
[Discover more](/products/microfrontend-composer/tutorials/basics.mdx)

#### How do events and data flow between components?
The flow is entirely managed by events. A typical flow for displaying data is:
1. A component (e.g., `bk-table`) emits a `need-data` event.
2. A data-client component (e.g., `bk-crud-client`) is listening for `need-data`. It receives the event and makes an HTTP request to a backend API.
3. Upon a successful response, the data-client emits a `success` event, with the fetched data as the event's payload.
4. The `bk-table` is listening for the `success` event. It receives the payload and uses it to render its rows.
   This declarative, event-based system keeps components decoupled.
[Discover more](/products/microfrontend-composer/back-kit/10_overview.md#data-flow)

#### What is an "event label"?
An **event label** is a string that acts as the name or identifier for an event. Components are configured to emit and listen for specific event labels. By using the same label, you create a communication channel between them. For example, multiple components could listen for the event label `user-selection-changed`.
[Discover more](/products/microfrontend-composer/back-kit/70_events.md)

#### How can I pass data with an event?
The component that emits an event can attach a **payload** to it. The payload can be any valid JSON data. For example, when a `bk-crud-client` fetches data, it emits a `success` event with the array of records as the payload. Any component listening for that event receives this payload and can use it.
[Discover more](/products/microfrontend-composer/back-kit/70_events.md#payload)

#### How can I debug the event bus?
The `micro-lc` orchestrator has a built-in event bus debugger. You can enable it by setting a specific property in the core configuration. When enabled, it will log all events, their labels, and their payloads to the browser's developer console. This is invaluable for understanding the interactions between your components.
[Discover more](/products/microfrontend-composer/back-kit/70_events.md#debugging)

#### Can I create nested layouts, like tabs within a page?
Yes. Back-Kit provides layout components like `bk-tabs` or `bk-grid`. You can place these components on your page and then drag other components *inside* them. For example, you can place a `bk-tabs` component and then put a different `bk-table` inside each tab.
[Discover more](/products/microfrontend-composer/back-kit/60_components/530_tabs.md)

### Integrating External Microfrontends & Components

#### How do I integrate a microfrontend built with React or Angular?
1. In the Composer, create a new page and set its **Type** to "Micro-Frontend".
2. In the page configuration, you must provide the URL to the HTML entrypoint of your microfrontend (e.g., `http://my-react-app.com/index.html`).
3. The `micro-lc` orchestrator will then load this microfrontend into an iframe-like container on the page.
[Discover more](/products/microfrontend-composer/tutorials/microfrontends.mdx)

#### What is a "parcel"?
A **parcel** is a piece of UI that is rendered by a framework (like React or Angular) but is not a full-blown application. It's a way to use framework-specific components within a composed page. The `micro-lc` orchestrator knows how to bootstrap, mount, and unmount these parcels.
[Discover more](/products/microfrontend-composer/what-is.md#parcels)

#### How can I use my own custom web components in a compose page?
1. **Build and Bundle**: Build your web components and bundle them into a JavaScript file (preferably an ESM module) that can be served statically.
2. **Serve the Bundle**: Host the bundle file at a URL that is accessible from the browser.
3. **Declare the Source**: In the "Advanced" tab of a compose page's configuration, add the URL of your component bundle to the `sources` array. This tells `micro-lc` where to load your component definitions from. After this, your custom components will appear in the "Add new component" panel.
[Discover more](/products/microfrontend-composer/external-components/overview.md)

#### What is a Web Component Manifest (`__manifest`)?
A **manifest** is a static JSON object that a web component can expose to describe its configurable properties. By implementing a static getter named `__manifest` in your component's class, you can provide a JSON schema for its properties. The Microfrontend Composer's no-code editor will then use this schema to automatically generate a user-friendly form for configuring your component, enabling a true no-code experience for other users.
[Discover more](/products/microfrontend-composer/external-components/manifest.md)

#### What tools are recommended for bundling custom web components?
Tools like **Vite** or **Rollup** are highly recommended. They provide the necessary capabilities to:
* Define multiple entry points if you want to bundle components separately.
* Handle external dependencies.
* Bundle assets like CSS, images, and fonts.
* Produce optimized ESM bundles, which is the preferred format for the Composer.
  [Discover more](/products/microfrontend-composer/external-components/bundling.md)

#### How can my custom microfrontend communicate with the host application?
The `micro-lc` orchestrator provides an API that can be accessed from the `window` object. Your microfrontend can use this API to emit events to the main event bus or to listen for events coming from other components in the host application. This allows for seamless integration between your custom code and the rest of the composed UI.
[Discover more](/products/microfrontend-composer/tutorials/microfrontends.mdx#communication-with-the-orchestrator)

### Styling, Security & Deployment

#### How can I show or hide a component based on user permissions?
The Composer supports **Access Control List (ACL)** expressions. You can add a special `aclExpression` property to any component's configuration. This expression is evaluated against the authenticated user's groups and permissions (e.g., `groups.includes('admin')`). If the expression evaluates to `false`, the component (and all its children) will be completely removed from the page before it is rendered.
[Discover more](/products/microfrontend-composer/faqs.md#components)

#### How do I change the URL path where my application is served?
By default, the application is exposed at `/front-end`. To change it:
1. In the **Design -> Endpoints** section of the Console, delete the `/front-end` endpoint and create a new one with your desired path.
2. In the **Microfrontend Composer -> Webserver Configuration** tab, update the `<base>` tag's `href` attribute in `index.html` to your new endpoint path.
3. Also in the Webserver Configuration, update the paths in the **Headers** section to match the new endpoint.
[Discover more](/products/microfrontend-composer/faqs.md#infrastructure)

#### How are the Composer configurations stored?
All the configurations you create in the Composer UI (pages, layouts, component properties) are stored as JSON files within your project's Git repository. This means your entire frontend application is version-controlled, and you can leverage Git workflows like branching and pull requests. This is a key principle of a robust **internal development platform**.
[Discover more](/products/microfrontend-composer/architecture.md)

#### Can I use my own `index.html` file?
Yes. The `index.html` file served by the `micro-lc-web-server` is fully configurable. You can access it in the **Webserver Configuration** tab. This allows you to add custom meta tags, import external scripts or stylesheets, or modify the core layout of the page where the orchestrator mounts.
[Discover more](/products/microfrontend-composer/composer/30_configurator_settings.md#webserver-configuration)

#### What happens when I "save" my configuration in the Composer?
When you save your changes in the Microfrontend Composer, it creates a new commit in your project's Git repository. This commit contains the updated JSON configuration files. To make your changes live, you must then deploy this new commit from the **Deploy** section of the Console, which triggers the project's **CI/CD** pipeline.
[Discover more](/products/microfrontend-composer/composer/10_structure.md)
