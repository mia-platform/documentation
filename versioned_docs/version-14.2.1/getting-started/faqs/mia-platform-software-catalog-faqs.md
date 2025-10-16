---
id: mia-platform-software-catalog-faqs
title: Mia-Platform Software Catalog FAQs
sidebar_label: Software Catalog FAQs
---

### Core Concepts & Purpose

#### What is the Mia-Platform Software Catalog?
The Mia-Platform Software Catalog is a centralized repository for discovering, managing, and governing all the software assets within your organization. It acts as a single source of truth for reusable components, enabling developers to find and use approved tools and templates quickly. This fosters a composable architecture and is a cornerstone of building an effective **internal developer platform (IDP)**.
[Discover more](/products/software-catalog/overview.md)

#### What is the difference between the Software Catalog and the Marketplace?
* The **Marketplace** is the user-facing view within the Console where developers can browse and consume available assets like Plugins and Templates to add them to their projects.
* The **Software Catalog** is the underlying management solution that allows **platform engineers** and administrators to create, manage, version, and govern the items that are then exposed in the Marketplace.
  Essentially, the Software Catalog is the "backend" for the Marketplace.
  [Discover more](/runtime-components/overview_marketplace.md)

#### Why is a Software Catalog essential for a software engineering platform?
A Software Catalog is crucial because it promotes:
* **Reusability**: Prevents teams from reinventing the wheel by providing a library of tested, approved components.
* **Standardization**: Enforces **platform engineering best practices** by ensuring developers use consistent templates and tools.
* **Governance**: Allows platform teams to control which assets are available, manage their versions, and track their usage.
* **Velocity**: Accelerates development by making it easy for developers to find and bootstrap new services and applications.
  It transforms a collection of services into a cohesive **software engineering platform**.
  [Discover more](/products/software-catalog/overview.md)

#### What kind of assets can be managed in the Software Catalog?
The Software Catalog is designed to manage a wide variety of software assets, including:
* **Plugins**: Ready-to-use microservices.
* **Templates**: Boilerplate code repositories for creating new microservices.
* **Examples**: Complete, working examples of applications.
* **Applications**: Pre-composed sets of services and configurations.
* **Sidecars**: Auxiliary containers that add functionality to primary container.
* **Proxies**: Specific configurations used to invoke APIs that are not part of the current project but may be exposed by an external provider or another project
* **Infrastructure resources**: Kubernetes manifests for infrastructure components.
* **Extensions**: Custom extensions to the Mia-Platform Console.
* **Infrastructure Component runtime**: Pre-packaged infrastructure components.
  [Discover more](/products/software-catalog/items-manifest/overview.md)

#### How does the Software Catalog support a composable architecture?
A composable architecture relies on the principle of assembling applications from independent, reusable components. The Software Catalog is the key enabler of this approach. It provides the central, governed library of building blocks (Plugins, Templates, etc.) that developers can "compose" to build new applications quickly and consistently, much like assembling with LEGO bricks.
[Discover more](/products/software-catalog/overview.md)

#### What is the relationship between the Software Catalog and an Internal Developer Platform (IDP)?
The Software Catalog is a fundamental feature of a mature **internal developer platform**. While an IDP provides the overall infrastructure and workflows (**CI/CD**, environments, etc.), the Software Catalog provides the "golden path" assets. It's the curated set of tools and starting points that the **IDP platform** offers to its developers to ensure productivity, reliability, and governance.
[Discover more](/getting-started/mia-platform-overview.md)

### Using the Catalog & Marketplace

#### How do I find a component in the Marketplace?
Inside a project in the Mia-Platform Console, when you go to create a new microservice, you are presented with the Marketplace view. You can:
* Use the search bar to find an item by name.
* Filter by type (e.g., "Template", "Plugin").
* Filter by category (e.g., "Messaging", "Database").
  [Discover more](/products/console/api-console/api-design/custom_microservice_get_started.md)

#### How do I use a "Template" to create a new microservice?
When you select a Template from the Marketplace, the Console will prompt you for a service name and a new Git repository path. Upon confirmation, it clones the Template's source code into the new repository within your project's Git provider. You now have a complete, ready-to-code microservice that you own and can modify as needed.
[Discover more](/products/console/api-console/api-design/custom_microservice_get_started.md)

#### Can I see different versions of a Marketplace item?
Yes. If an item has multiple versions, you can select the specific version you want to use when adding it to your project. This is crucial for managing dependencies and ensuring that you can test new versions of a plugin before rolling them out to production environments.
[Discover more](/products/software-catalog/items-management/ui.md#versions)

#### How do I know what a Marketplace item does before using it?
Each item in the Marketplace has a detail page that provides comprehensive metadata, including:
* A detailed description of its functionality.
* Links to its official documentation.
* Information about its version, category, and owner.
  This allows developers to understand the purpose and usage of an asset before adding it to their project.
  [Discover more](/runtime-components/overview_marketplace.md)

#### Where can I see the items I've already added to my project?
Based on the type of item instantiated (e.g., microservices, sidecars, etc), it will appear in the corresponding list within the Design section of your project.
[Discover more](/products/console/api-console/api-design/overview.md)

### Creating & Managing Catalog Items

#### Who can create and manage items in the Software Catalog?
Typically, creating and managing catalog items is a responsibility of the **platform engineers** or a central governance team. In the Console, users need specific permissions, usually `Company Owner` or `Project Administrator` with access to the Software Catalog section, to create, edit, or delete items.
[Discover more](/products/software-catalog/items-management/overview.md)

#### How do I create a new item in the Software Catalog?
There are several ways to create Software Catalog items and their versions:
* [Software Catalog UI](/products/software-catalog/items-management/ui.md): a user-friendly graphical interface within the Console, ideal for manual and quick operations,
* [miactl](/products/software-catalog/items-management/miactl.md), the official Mia-Platform command-line tool. Perfect for automation, scripting, and advanced workflows,
* [Mia-Platform GitHub Community](https://github.com/mia-platform/community): for community-driven contributions or support requests — such as proposing new items or requesting changes — you can open an issue on the dedicated page, and
* [API Access](/products/software-catalog/items-management/api.md): you can interact directly with the underlying APIs to perform programmatic changes.

#### What is an "Item Manifest"?
An Item Manifest is a JSON file that defines all the necessary information required to create or update an item — more specifically, an item release — in the system.
The manifest follows a standard top-level structure across all item types. However, the resources section within the manifest is customized based on the specific item type you are working with.
To better understand how a manifest should be structured:

[Discover more](/products/software-catalog/items-manifest/overview.md) or use the specific pages in this section to learn how the resources field should be formatted for each item type.

#### Can I manage the Software Catalog declaratively using GitOps?
Yes, and this is the recommended approach for production environments. You can manage your item manifests as YAML files in a dedicated Git repository. Then, you can set up a **CI/CD** pipeline that uses the `miactl` command-line tool to apply these manifests to the Software Catalog. The command `miactl catalog apply -f <path-to-manifests>` synchronizes the state of the catalog with your Git repository.
[Discover more](/products/software-catalog/items-management/miactl.md#declarative-approach)

#### What is `miactl` and how does it relate to the Software Catalog?
`miactl` is the Mia-Platform Command Line Interface. It provides a set of commands for interacting with the Software Catalog API, allowing you to script the creation, updating, and deletion of catalog items. This is the key tool for implementing a declarative, **Infrastructure as Code** approach to managing your catalog.
[Discover more](/products/software-catalog/items-management/miactl.md)

#### How do I add an icon to my catalog item?
In the item's metadata, you can provide a URL for an icon. This icon will be displayed in the Marketplace card view, making your item more recognizable. The URL should point to a publicly accessible image (e.g., a PNG or SVG hosted on a CDN or in a public **aws s3** bucket).
[Discover more](/products/software-catalog/items-manifest/overview.md)

#### What are categories and how do they help organize the catalog?
Categories are user-defined labels (e.g., "Database", "Messaging", "AI") that you can assign to catalog items. They act as filters in the Marketplace UI, helping developers to quickly find the type of component they are looking for.
[Discover more](/products/software-catalog/items-manifest/overview.md)

#### How does versioning work for catalog items?
Items like Plugins and Templates support versioning. When you create or edit an item, you can create a new version. Each version has its own immutable manifest (`resources`). This means to update a Plugin's Docker image or a Template's source, you must create a new version. The general metadata (like description and category) is shared across all versions of an item.
[Discover more](/products/software-catalog/basic-concepts/20_items-versioning.md) 

#### How do I delete an item from the catalog?
You can delete an item from its detail page in the [Software Catalog UI](/products/software-catalog/items-management/ui.md#delete-item), with [miactl](/products/software-catalog/items-management/miactl.md) or [API access](/products/software-catalog/items-management/api.md). This action requires high-level permissions. Note that deleting an item from the catalog does not affect any projects that are already using it.

### Item Types Explained

#### What is the difference between a Plugin, a Template, and an Example?
* **Template**: A starting point. It's a Git repository that gets cloned into your project, giving you full ownership of the code to modify and extend. Use this to build custom services.
* **Plugin**: A black box. It's a pre-built, ready-to-use Docker image that you configure but don't modify the source code of. Use this for common, standardized functionalities.
* **Example**: A learning tool. It's a more complete, working application that demonstrates how to solve a specific problem or use a particular architecture. It's also a Git repository that gets cloned.
  [Discover more](/runtime-components/overview_marketplace.md)

#### What is an "Application" item type?
Applications are bundles of resources that brings together services (i.e., plugins, templates, and examples), endpoints, CRUD collections, and public variables to ease the setup of large-scale artifacts.
[Discover more](/products/software-catalog/items-manifest/application.md)



#### When should I create a Plugin instead of a Template?
Create a **Plugin** when you have a piece of functionality that is:
* **Standardized**: It should be used in the exact same way across multiple projects.
* **Stable**: It doesn't require frequent, project-specific changes.
* **Governed**: You want to control its version and rollout centrally.
  A good example is a service for sending emails or a standardized authentication client.
  Create a **Template** when you want to provide a starting point that developers will then own, customize, and evolve independently.

### Advanced Configuration & Management

#### How do I add a Template from a private Git repository to the catalog?
To use a template from a private repository, you must:
1. Create a **Marketplace Provider** in the **Company -> Providers** section of the Console. This provider will securely store the credentials (e.g., a Git access token) needed to access your private Git provider.
2. When creating the Template item in the Software Catalog, link it to this provider by specifying its `providerId` in the item's manifest. This tells the Console to use the stored credentials when cloning the template's source code.
[Discover more](/products/software-catalog/items-manifest/template.md#private-repositories)

#### How can I programmatically interact with the Software Catalog?
The Console exposes a full set of REST APIs for the Software Catalog. You can use these APIs to build your own custom clients, integrate the catalog with other systems, or perform advanced automation. The API documentation is available in OpenAPI 3.0 format. You can authenticate with these APIs using a [service account](/products/console/identity-and-access-management/manage-service-accounts.md).
[Discover more](/products/software-catalog/items-management/api.md)

#### Can I define default environment variables for a Plugin?
Yes. In a Plugin's manifest, you can define a set of default environment variables. When a developer adds this Plugin to their project, these variables will be pre-populated, simplifying the configuration process.
[Discover more](/products/software-catalog/items-manifest/plugin.md)

#### How can I suggest resource allocations (CPU/Memory) for a Plugin?
The Plugin manifest allows you to specify default Kubernetes resource requests and limits (CPU and memory). This is a crucial **site reliability engineering (SRE)** practice, as it ensures that plugins are deployed with sensible resource allocations by default, preventing them from consuming too many resources or being starved.
[Discover more](/products/software-catalog/items-manifest/plugin.md)

#### Can I link a catalog item to its documentation?
Yes, the item manifest has a `documentation` field where you can provide a URL to the item's detailed documentation. This link will be displayed on the item's detail page in the Marketplace, allowing developers to easily access the information they need.
[Discover more](/products/software-catalog/items-manifest/overview.md)

### Troubleshooting & Best Practices

#### A developer can't see an item in the Marketplace. What could be the cause?
* **Item Visibility**: Check if the item is marked as `public`. If not, it might have restricted visibility.
* **Company Association**: Ensure the item is associated with the correct Company. By default, items are only visible within the Company where they were created.
* **Permissions**: While less common for visibility, ensure the user's role has not been customized to restrict Marketplace access.

#### My `miactl catalog apply` command failed. How do I debug it?
1. **Check the Error Message**: `miactl` usually provides a descriptive error message from the API.
2. **Validate the Manifest**: The most common cause is a syntax error in your YAML/JSON manifest file. Ensure it's well-formed and conforms to the required schema for the item type.
3. **Check Permissions**: Ensure the service account or user running `miactl` has the necessary permissions to manage the Software Catalog.
4. **Check Console Logs**: The logs for the Console's backend pods may contain more detailed information about why the API request failed.
[Discover more](/products/software-catalog/items-management/miactl.md)

#### What are the best practices for naming and describing catalog items?
* **Be Clear and Concise**: The name should clearly indicate the item's purpose.
* **Use a Consistent Naming Convention**: For example, prefix all Go templates with `go-`.
* **Write a Good Description**: The description should explain what the item does, why someone would use it, and any important prerequisites.
* **Use Categories and Tags**: Properly categorize and tag items to make them easily discoverable.

#### How should I manage the lifecycle of a catalog item?
1. **Development**: Develop the new template or plugin.
2. **Creation**: Add the new item to the catalog, perhaps initially as non-public.
3. **Versioning**: As you make improvements, release new versions of the item. Don't make breaking changes in patch releases.
4. **Deprecation**: When an item is outdated, you can mark it as deprecated in the catalog. This signals to developers that they should migrate to a newer version or an alternative.
5. **Deletion**: Remove the item from the catalog only when you are sure no one should be using it anymore.
[Discover more](/products/software-catalog/basic-concepts/30_items-lifecycle.md)

#### Is it better to have many small, focused templates or a few large, generic ones?
This is a key question for **platform engineers**. The best practice is generally to favor **smaller, more focused templates**. A template for a "Go event consumer" is better than a generic "Go service" template that tries to do everything. Focused templates are easier to understand, maintain, and use, and they lead to more consistent and specialized services. This aligns with the principles of a good **service oriented architecture**.
