---
id: overview
title: External Components
sidebar_label: Overview
sidebar_position: 10
---

The Configurator layout/advanced sections provide tools to visualize [composable pages](/microfrontend-composer/composer/20_compose_pages.md) which are made of webcomponents. For instance, the Configurator [main layout](/microfrontend-composer/composer/10_structure.md#layout) is a web page build with webcomponents.

Components usually are provided by JavaScript libraries like:

- [@micro-lc/layout](https://www.jsdelivr.com/package/npm/@micro-lc/layout)
- [@micro-lc/bk-web-components](https://www.jsdelivr.com/package/npm/@micro-lc/bk-web-components)

and served using CDN services or other tools. Each composable page configuration chooses which libraries to use via the JSON field `sources` that can be edited in the advanced sections of the Configurator.

The `sources` field has its own [JSON schema](https://raw.githubusercontent.com/micro-lc/micro-lc/96f86d9a02851e2d204d6245fe0196714d5f1ec9/packages/interfaces/schemas/v2/plugin.schema.json#definitions/sources) which states that `sources` can either be

- a string containing a single URL (absolute, with or without domain)
- an array of strings with multiple URLs (absolute, with or without domain)
- an object with a key `uris` that is equivalent to either of the cases above

for further references, check out the [micro-lc documentation](https://micro-lc.io/docs/guides/applications/compose#plugin-configuration) on composable page `sources`.

The only limitation, left to the user to check, is not to define the same webcomponent twice or more from different libraries. This might happen when different composable pages have different versions of the same library. The Configurator will not complain but errors might arise when the final website is deployed.

The default configuration of the Configurator section, once the [application](/runtime_suite_applications/backoffice/10_overview.md) is added to your Console project, on the branch you're currently working on, is preset to use the components library [@micro-lc/bk-web-components](https://www.jsdelivr.com/package/npm/@micro-lc/bk-web-components), which is well-suited to visualize data through tables, cards and galleries.

To improve your UX/UI experience, or even to just add some custom business logic, you can bring your own components to the table and use them in the Configurator section.

## Sourcing

Components must be available through at least one of the following:

<!-- cSpell:disable-next-line -->
1. public CDN (e.g., by publishing your package on npm and retrieving it via services like [jsdelivr](https://jsdelivr.com) or [unpkg](https://unpkg.com))
2. public endpoint supporting CORS headers
3. API key authenticated endpoint supporting CORS headers and preflight headers

### Public CDN

<!-- cSpell:disable-next-line -->
Any `npm` package is mirrored by free services such as [jsdelivr](https://jsdelivr.com) or [unpkg](https://unpkg.com). For instance `@micro-lc/layout` source code is available on [github](https://github.com/micro-lc/micro-lc/tree/main/packages/layout), built via a github pipeline and then deployed on [npm](https://www.npmjs.com/package/@micro-lc/layout). Automatically this makes it eligible for [cross origin resource sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) since CDN services expose such static assets including the CORS header [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) that browsers use to grant loading of external resources.

This strategy is also useful if you would like to keep your components source code private and the compiled, bundled, and eventually minified version of your code public. By using your pipeline strategy, publishing the final assets on npm allows the same CORS access described above.

In this case no further actions are needed in the Configurator section or anywhere else on **Mia-Platform Console**.

### Public endpoint

This strategy is recommended when new components libraries are deployed in a production environment that cannot act as a CDN service. Most of the times, static assets are served through a webserver like nginx and reached via either an API gateway or a reverse proxy.

If any custom header is required to access this resource, follow the [API key authenticated strategy](#api-key-authenticated-endpoint).

The webserver serving the library assets must provide an extra access control header. On an nginx webserver this can be achieved via the rule [`add_header`](http://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header). For instance, an nginx snippet might look like

```nginx
location / {
  add_header                      'Access-Control-Allow-Origin' '*';
  try_files                       $uri $uri/index.html /index.html =404;
}
```

This strategy is almost equivalent to deploy a public resource without authentication which might not be suitable to must production environments.

Also it is recommended to add the `Access-Control-Allow-Origin` as close as possible to the resource and as further away as possible from the API gateway in order to narrow down the access control header to the assets.

### API key authenticated endpoint

This strategy is suitable when either the components library must be kept private and/or the production environment must not expose endpoints without authentication.

An API key authentication can be provided by:

1. known headers, like [`Authorization`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
2. custom headers, like [`Secret`](/development_suite/api-console/api-design/api_key.md#how-to-use-an-api-key) on **Mia-Platform Console**

The custom headers approach requires special handling since browser issue a preflight call to the requested endpoint to validate acceptance of custom headers and the HTTP method (which is `GET` to fetch a resource).

If authentication is provided by known headers no further actions are needed beside configuring your authorization service.

Otherwise, preflight must be enabled on the resource webserver. If resources are served by an nginx webserver configurations might look like

```nginx
location / {
  if ($request_method = 'OPTIONS') {
    add_header                    'Access-Control-Allow-Origin' '*';
    add_header                    'Access-Control-Allow-Methods' 'GET';
    add_header                    'Access-Control-Allow-Headers' 'secret';
    add_header                    'Content-Type' 'text/plain; charset=utf-8';
    add_header                    'Content-Length' 0;
    return                        204;
  }

  add_header                      'Access-Control-Allow-Origin' '*';

  # 👇 for webserver => looks inside the root folder
  try_files                       $uri $uri/index.html /index.html =404;
}
```

or maybe proxy-reversed to another service by applying the following configuration to your API gateway

```nginx
location /backoffice-web-components/ {
  if ($request_method = 'OPTIONS') {
    add_header                    'Access-Control-Allow-Origin' '*';
    add_header                    'Access-Control-Allow-Methods' 'GET';
    add_header                    'Access-Control-Allow-Headers' 'secret';
    add_header                    'Content-Type' 'text/plain; charset=utf-8';
    add_header                    'Content-Length' 0;
    return                        204;
  }

  add_header                      'Access-Control-Allow-Origin' '*';

  # 👇 notice the proxy pass statement
  proxy_pass                      http://$proxy_name$proxy_url;
}
```

When a browser is instructed to fetch a resource (`GET` method) including a custom header `Secret`, according to the definition of a [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request), the Configurator section preview would request a cross origin resource with a custom header by issuing an `OPTIONS` HTTP request including headers:

1. `Access-Control-Allow-Headers: Secret` to ensure validity of header `Secret`
2. `Access-Control-Allow-Methods: GET` to ensure validity of method `GET`

such request must be **unauthenticated**. Then a successful 200 or 204 reply must be issued and your Configurator will perform the actual fetch including custom headers.

The authorization service must be instructed to serve resources by including an API key matching the `Secret` header.

Once the API key secret is set up, the _Backoffice Configurations_ section of the Mia-Platform Console must be instructed with advanced options in the [Source Maps](/microfrontend-composer/composer/30_configurator_settings.md#source-maps) section. A resource must thus include custom headers to perform the request:

1. add a resource in the _Source Map_ tab of the _Configurator Settings_ modal
2. edit the resource as a JSON file
3. add a key `headers` with the required custom header (see the image below)

### Configure **Mia-Platform Console** to support preflight requests

The following actions need to be addressed:

1. from the [design section](/development_suite/overview-dev-suite.md#design) or your project, issue an API key, by navigating to `API key` → `Add new` → `Generate Random API Key`, create a specific `ClientType` for your resource like `custom_components`, then click on `Active` and then `Create`

2. considering that static resources might be already available on an authenticated production endpoints as `/my-library`, create a new endpoint, like `/external/my-library`, and link it to the relevant resource. Once created, on `Endpoint settings` → `Security`, remove `Authentication required` and check `API Key required`, then on `User Group Permission` add the boolean rule `clientType == "custom_components"` matching the `ClientType` created previously.

3. if your API gateway is `nginx`-based, on the `Advanced` section reach for `maps-proxyName.before.map` and add the following section (where `<COMPONENTS_ENDPOINT>` is the newly created endpoint and `<COMPONENTS_WEBSERVER>` is the microservice destination of the endpoint)
>
> ```nginx
> # Custom Components
> "~^(secreted|unsecreted)-(0|1)-OPTIONS-<COMPONENTS_ENDPOINT>([/\?].*|$)$" "<COMPONENTS_WEBSERVER>";
> "~^secreted-(0|1)-GET-<COMPONENTS_ENDPOINT>([/\?].*|$)$" "<COMPONENTS_WEBSERVER>";
> "~^unsecreted-(0|1)-GET-<COMPONENTS_ENDPOINT>([/\?].*|$)$" "unauthorized";
> "~^(secreted|unsecreted)-(0|1)-(PUT|POST|PATCH|DELETE)-<COMPONENTS_WEBSERVER>([/\?].*|$)$" "unauthorized";
> ```

## No/Low-code Components Configuration

```tip
To view your external components, you may need to [configure](/microfrontend-composer/composer/30_configurator_settings.md#source-maps) the correct reverse proxying in the Configurator Service Worker .
```

Any HTML tag (native or custom) is eligible to be configured in the `low-code` configuration section, which is label by the tab `Advanced`.

Any custom webcomponent must be defined in at most one of the `sources` entries to be displayed in the preview otherwise it will not render anything beside an empty tag.

The absence of a custom webcomponent definition does not break the preview of a compose page, but somewhat limits the user experience of the whole section.

Any `low-code` configuration can be performed in the `Advanced` section in the form of plain JSON editing. Such editing is guided by the basic schema of a [compose page](https://github.com/micro-lc/micro-lc/blob/main/packages/interfaces/schemas/v2/plugin.schema.json), and is embedded in the editing IDE of the `Advanced` section.

`no-code` section, labelled by the tab `Layout` is aware of any defined custom webcomponent. To configure a webcomponent using the `no-code` section, the component itself must provide a dynamically imported manifest which describe itself to the configurator and allows the spawning of forms and modals apt to the task of filling webcomponent properties according to the proper type and schema validation.

There are different layers of integration for custom webcomponents with the `no-code` Configurator section:

1. editing properties using forms and modals
2. open/show when selected on the [left components list](/microfrontend-composer/composer/10_structure.md#layout)
3. share properties with other components to avoid code/configuration replication

### No-Code Properties Editing: `__manifest`

A webcomponent must explain to the configurator how it can be configured. Roughly any webcomponent scaffolding looks like:

```typescript
class MyCustomComponent extends HTMLElement {
  /*
   * business logic and lifecycle
   */
}
```

A webcomponent which exposes a static getter `__manifest` as per the following snippet:

```typescript
import type { Manifest } from '@micro-lc/compose-toolkit'

class MyCustomComponent extends HTMLElement {
  static get __manifest(): Promise<Manifest> {
    // implementation
  }
  /*
   * business logic and lifecycle
   */
}
```

To avoid loading unused code in production, we recommend dynamic loading of such manifest with the following implementation

```typescript
static get __manifest(): Promise<Manifest> {
  return import('./manifest').then(({default: manifest}) => manifest)
}
```

The **manifest** file, after JSON-stringify process, must validate an [extension](https://raw.githubusercontent.com/micro-lc/compose-toolkit/main/schemas/template.schema.json) of a draft-07  [JSON schema](https://json-schema.org) where the `type` is always `object` and the field `properties` is an object listing the configurable properties of the custom webcomponent.

Any object property has also a _special_ key `__mia_configuration` which allows to customize labels in the Configurator `Layout` section. The `__mia_configuration` key is not mandatory and does not affect the no-code configuration features on custom webcomponents.

Check out [the webcomponent manifest](/microfrontend-composer/external-components/manifest.md) for further details.

### Open/Show On Select: `__focus_handler`, `__unfocus_handler`

When a custom webcomponent has an open/close, hidden/shown behavior, like a modal or a collapsible drawer, the Configurator previews must be informed on how to make such item to appear and disappear. Considering the case of a modal, its initial state could be `closed`. A user interaction is often required to trigger its opening.

When clicking the webcomponent label on the left menu list corresponding to the modal, the presence of a `__focus_handler` function allows to mock the user action needed to open the component real context.

Once left menu selection is over, an `__unfocus_handler` is called to perform cleanup operations.

The webcomponent must implement the following interface:

<!-- cSpell:disable -->
```typescript
import type { FocusableComponent } from '@micro-lc/compose-toolkit'

class MyCustomComponent extends HTMLElement implements FocusableComponent {
  __focus_handler() => FocusCtx | Promise<FocusCtx> {
    // impl
  }
  __unfocus_handler() => void {
    // impl
  }
  /*
   * business logic and lifecycle
   */
}
```
<!-- cSpell:enable -->

## Bundling

As previously mentioned, webcomponents are served to the Configurator via library bundles. The recommended way to proceed is:

1. either an ESM bundle
<!-- cSpell:disable-next-line -->
2. a side-effect IIFE

Due to the nature of [manifests](/microfrontend-composer/external-components/manifest.md) and their retrieval dynamic policy, the ESM option is more than recommended.

Webcomponents can be build with any library (lit, stencil, and so on...) or going fully native. Examples with `lit` are provided [`@micro-lc/layout`](https://github.com/@micro-lc/layout) library while `micro-lc` [itself](https://github.com/micro-lc/micro-lc/main/packages/orchestrator/src/web-component/micro-lc.ts) is an example of a native webcomponent.

`vite` turned out to be very natural and comfortable tool to bundle and inspect webcomponents by embedding them in a test html page. The bundler, which is `rollup` provides the capabilities to:

1. select which sources to use as entry points. For instance, webcomponents can be bundled separately or all together in a unique bundle. Your use case is the only reference on whether to go the former or the latter way;
2. separate external sources, like manifests;
3. add external assets like images, fonts and so on...

Check out the [bundling section](/microfrontend-composer/external-components/bundling.md) for further details.
