---
id: console-catalog
title: Mia-Platform Console Catalog Sink
sidebar_label: Console catalog
---



The Console Catalog sink allows you to save data into the [Mia-Platform Console Catalog](/products/software-catalog/overview.md).

It supports creating, updating, and deleting catalog items based on the events received from the sources.

:::caution
The Console Catalog sink does not support versioning of catalog items, yet.
:::

## Configuration

To configure the Console Catalog sink, you need to provide the following parameters in your configuration file:

- `type` (*string*): The type of the sink, which should be set to `console-catalog`.
- `url` (*string*): The base URL of the Console installation you want to connect to.
- `tenantID` (*string*): The tenant ID where the catalog items will be saved.
- `itemType` (*string*): The type of the generated catalog item.
- `clientId` (*string*): The client ID to use for authentication with the Console Catalog API.
- `clientSecret` ([*SecretSource*](/runtime-components/plugins/integration-connector-agent/20_install.md#secretsource)): The client secret to use for authentication with the Console Catalog API.
- `itemIDTemplate` (*string*, optional): A [template](#template-processing) used to generate the item ID for the catalog item. When not provided the itemId is derived from the event Primary Keys.
- `itemNameTemplate` (*string*): A [template](#template-processing) used to generate the name for the catalog item.

### Example Configuration

```json
{
	"type": "console-catalog",
	"url": "https://your-console-url.com",
	"tenantID": "my-tenant",
	"itemType": "my-item-type",
	"clientId": "my-client-id",
	"clientSecret": {
		"fromEnv": "CONSOLE_CLIENT_SECRET"
	},
	"itemIDTemplate": "{{itemId}}",
	"itemNameTemplate": "{{name}}"
}
```

### Template Processing

The `itemIDTemplate` and `itemNameTemplate` fields support template processing using a curly-braces syntax.

You can use `{{}}` syntax to reference any field from the event data, for example:

```json
{
	"name": "Event name",
	"metadata": {
		"itemId": "12345"
	},
	"key": "event-key"
}
```

You can use things like:

- `{{name}}` to reference the `name` field of the event.
- `{{metadata.itemId}}` to reference the `itemId` field inside the `metadata` object of the event.
- `{{name}}-{{key}}` to reference both the name and `key` field and create a composite string.
