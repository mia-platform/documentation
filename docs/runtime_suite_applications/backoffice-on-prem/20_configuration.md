---
id: configuration
title: Configuration
sidebar_label: Configuration
---
The configuration of the application is pretty straight forward. You just need to follow the wizard and choose for each
service if you want to deploy a new resource or link an existing one.

The available resources will be:

- [`micro-lc`](https://www.micro-lc.io) javascript bundle at `/micro-lc/micro-lc.production.js` (and relative assets)
- [`back-kit`](/business_suite/backoffice/10_overview.md) javascript bundles under `/back-kit`
- the frontend `index.html` entrypoint at `/backoffice`
- configurations at `/micro-lc-configurations`

Your new Backoffice instance will be exposed under `/backoffice`, but you can always change that in the endpoints
section.

## Architecture

All the resources needed for the Backoffice are available through a _single pod_, that contains a
modified instance of [micro-lc config server](https://micro-lc.io/add-ons/backend/middleware). This server is responsible for exposing
both micro-lc entrypoint (`index.html` file) and configurations, moreover, `micro-lc` bundle and `back-kit` bundles are served by this
service **instead of fetching from a CDN**.

Four config maps are mounted on the config server with just enough to spawn a functioning Backoffice instance.

- `micro-lc-static-files` with the `index.html` micro-lc entrypoint,
- `micro-lc-configurations` with micro-lc configuration files,
- `micro-lc-server-configuration` with the configuration file of the server itself, and
- `micro-lc-assets` with any other static file you wish to serve.

Apart from `micro-lc-assets`, the config maps are marked as readonly since they are meant to be managed through the
[Backoffice Configurator](../../business_suite/backoffice-configurator/overview) Console
section.

:::caution
Moreover `micro-ls-static-files` must preserve any local file already mounted
:::

Then, inside `micro-lc-static-files`, `index.html` is exposed at `/backoffice`, `/backoffice/` or `/backoffice/index.html`,
or under any not found route scoped by `/backoffice` (this allow the micro-lc router to work).
Also `micro-lc-assets` files are exposed through `/backoffice` endpoint, while configuration
files (the content of `micro-lc-configurations`) is exposed through `/micro-lc-configurations` endpoint.

:::caution
If you wish to change endpoints, pay attention to path rewrites: the endpoint exposing static files needs to be
rewritten to `/public`, while the one exposing configurations needs to be rewritten to `/configurations`.
:::
