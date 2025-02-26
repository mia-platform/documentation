---
id: items-types
title: Items types
sidebar_label: Items types
---

An **Item** (also referred to as a **Component**) is the basic unit of creating a resource within the catalog and represents a software resource that can be utilized in Mia-Platform Projects.

Directly from the Mia-Platform Marketplace, users can instantiate items into their Projects, integrating them to streamline development and configuration workflows.

### Item Types

The Software Catalog support the following item types:

- **Plugins**: items for which users have no access to the actual code. Users will still be able to download their Docker image, in order to configure and use them within their Projects.
- **Templates** and **Examples**: archives for which a new repository is generated. The developer will have direct access to the new repository (created in their Project scope) and will be able to evolve its code at will. A template is a repository that, net of the development environment and framework setup, is empty; an example, instead, also implements some features tailored to help the user better familiarize with the development environment.  
- **Applications**: bundles of resources that can be created and configured in the Mia-Platform Console within a few clicks. [Applications](/marketplace/applications/mia_applications.md) are composed of microservices (Plugins, Examples, and Templates), endpoints, CRUD collections, and public variables. Users can monitor if all the resources composing an application have been correctly set up inside the project, as well as access their corresponding repository or configuration.  
- **Proxies**: specific configurations used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project. You can find more information about proxies in [this section](/development_suite/api-console/api-design/proxy.md).
- **Sidecars**: secondary utility containers running side by side with the main container in the same host. Find more [here](/old_software-catalog/manage-items/mia-ctl/create/create-item-by-type/create_sidecar.md)
- **Infrastructure Resources**: custom objects that are not part of the standard Console supported resources. For more information, go to [this section](/old_software-catalog/manage-items/mia-ctl/create/create-item-by-type/create_infrastructure_resource.mdx)
- **Extensions**: custom page that enhances Console capabilities by integrating it into the sidebar navigation.

:::note
Items can be assigned a **Category** (e.g., Data Stream, Data Visualization, Insurance, Healthcare, etc.) to help organize and identify them.
:::