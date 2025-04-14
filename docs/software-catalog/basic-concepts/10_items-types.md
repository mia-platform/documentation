---
id: items-types
title: Items types
sidebar_label: Items types
---

Each item of the Catalog has a certain **type** (field `type`) and different types represents different artifacts that are handled in specific ways by the Console.

The information needed to work with these artifacts are the **assets** (field `resources`) of an item, and their shape varies from type to type (refer to the [manifests section][items-manifest] for and in-depth explation).

What follows is the list of item types currently supported by the Software Catalog.

### Plugins

Plugins are services that can be instantiated from the [microservices](/development_suite/api-console/api-design/services.md) section of the Console Design area.
Practically speaking, plugins are **Docker images** that comes with some predefined configurations to make them work in Console projects (e.g., environment variables, config maps, probes...).

### Templates

Teamplates can be instantiated in Console the same as plugins. The difference is that they provide an **archive** that is cloned in the Project scope, instead of a Docker image, giving developers direct access to the codebase to evolve it at will.

Templates are meant to be starting points with the bear minimum needed to start a service. Just like plugins, templates may also come with some predefined configurations.

### Examples

Examples works no differently than templates, in the sense that they too provide an **archive** with base configurations. Unlike templates, examples should come with some features already implemented and tailored to help the user better familiarize with the development environment.

### Applications

Applications are **bundles of resources** that brings together [services](/development_suite/api-console/api-design/services.md) (i.e., plugins, templates, and examples), [endpoints](/development_suite/api-console/api-design/endpoints.md), [CRUD collections](/development_suite/api-console/api-design/crud_advanced.md), and [public variables](/development_suite/api-console/api-design/public_variables.md) to ease the setup of large-scale artifacts.

### Sidecars

Sidecars are secondary utility containers running side by side with the main container in the same host. They are **Docker images** that can be instantiated from the [dedicated section](/console/design-your-projects/sidecars.md) of the Console Design area.

### Proxies

Proxies are **specific configurations** used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. Proxies can be instantiated from the [dedicated section](/development_suite/api-console/api-design/proxy.md) of the Console Design area.

### Infrastructure resources

Infrastructure resources are **custom objects** that are not part of the standard Console supported resources. They can be managed from the [dedicated section](/console/design-your-projects/custom-resources/custom-resources.md) of the Console Design area.

### Extensions

Extensions are **custom pages** that enhances Console capabilities by integrating it into the sidebar navigation. Since extensions have their own [dedicated section](/console/company-configuration/extensions.md), they are left out by the [Software Catalog UI][ui]. Extensions can still be managed with [miactl][miactl], and API calls.

[miactl]: ../items-management/miactl.md
[ui]: ../items-management/ui.md
[items-manifest]: ../items-manifest//overview.md
