---
id: api-interactions
title: API Interactions
sidebar_label: API Interactions
---

# API Interactions

The Catalog API lets you query and manipulate items in the Context Catalog. It is RESTful: clients create, update, delete, and read objects via standard HTTP verbs, and the API preferentially accepts and returns JSON. Every payload has a schema identified by the `kind` and `apiVersion` fields of the object.

To support evolution and extension, the Catalog implements API groups and multiple API versions. This information is encoded both in the REST path (`/{GROUP}/{VERSION}/*`, e.g. `/mia-platform.eu/v1/*`) and in the `apiVersion` field of serialized objects.

:::tip
You can view and interact with the API of your Catalog with the Mia-Platform API Portal. The API Portal for your Catalog installation is exposed under `<your-catalog-host>/documentations/api-portal/`.
:::

## MCP server

In addition to the REST API, the Context Catalog exposes an **MCP (Model Context Protocol) server**, allowing AI agents and MCP-compatible clients to interact with the catalog through a standardized protocol. This enables natural-language exploration of catalog items, programmatic discovery of resources, and integration into agentic workflows without writing custom API clients.

The codebase of the Catalog MCP is [publicly available on GitHub](https://github.com/mia-platform/catalog-mcp-server). The MCP for your Catalog installation is exposed under `<your-catalog-host>/mcp`.

## Terminology

- A **resource type** is the name used in the URL (e.g. `services`, `projects`, `virtualmachines`).
- A resource type has a concrete representation called a **kind**.
- A list of instances of a resource type is a **collection**.
- The act of returning a collection is **list**; retrieving a single instance is **get**.
- PUT requests are classified as **create** or **update** based on the state of the existing object. **Patch** is a partial update and uses the PATCH verb.

## Resource URIs

Item URIs generally take the form:

```text
/{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}/*
```

## Item Type Definitions

[Item Type Definitions (ITDs)](./basic-concepts/20_item-types.md) are themselves catalog objects, but they are not exposed under `/items/`. They live at a dedicated endpoint, scoped to the core API group:

```text
/mia-platform.eu/v1alpha1/item-type-definitions/{name}
```

Once an ITD is registered, the API server provisions the resource path it declares (`/{spec.group}/{spec.versions.name}/items/{spec.names.plural}/*`), and items of the new kind become reachable through the standard item URIs described above.

The ITD endpoint supports a restricted set of operations:

| Operation  | HTTP                                                             | Notes                                                                                                               |
| :--------- | :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| List ITDs  | `GET /mia-platform.eu/v1alpha1/item-type-definitions`            | Same query parameters as item `list` (`limit`, `continue`, `label`, `field`, `rawq`, `sort`).                       |
| Get ITD    | `GET /mia-platform.eu/v1alpha1/item-type-definitions/{name}`     | Returns the ITD object.                                                                                             |
| Upsert ITD | `PUT /mia-platform.eu/v1alpha1/item-type-definitions/{name}`     | Creates the ITD if missing, replaces it otherwise. The `metadata.name` must equal `<spec.names.plural>.<spec.group>`. |
| Delete ITD | `DELETE /mia-platform.eu/v1alpha1/item-type-definitions/{name}`  | Removes the ITD; the resource endpoints it had registered are unregistered as a consequence.                        |

:::note
The ITD endpoint does not accept `POST` or `PATCH`: ITDs can only be created or replaced through `PUT`. [Concurrency control](#concurrency-control) via `resourceVersion` applies as for items.
:::

## Operations

The Catalog maps HTTP verbs to operation verbs as follows:

| HTTP verb | Operation |
| :-------- | :-------- |
| GET, HEAD | `get` (single resource), `list` (collection) |
| POST      | `create` |
| PUT       | `update` |
| PATCH     | `patch` |
| DELETE    | `delete` |

### List

`GET /{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}`

Returns a `List` object whose `items` array contains the matching resources.

```http title="Request"
GET /mia-platform.eu/v1/items/dockerimages HTTP/1.1
Accept: application/json
```

```http title="Response"
HTTP/1.1 200 OK
Content-Type: application/json
Vary: Accept

{
  "apiVersion": "mia-platform.eu/v1alpha1",
  "kind": "List",
  "metadata": { ... },
  "items": [ ... ]
}
```

The list operation supports content negotiation: clients may request metadata-only responses by setting `Accept: application/json;as=PartialObjectMetadata`.

Supported query parameters: `limit`, `continue`, `label`, `field`, `rawq`, `sort`. See the dedicated sections below.

### Get

`GET /{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}/{NAME}`: returns a single resource. Supports content negotiation as for `list`.

### Create

`POST /{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}`

The body must contain the full object to create. The server validates types, presence of required fields, and rejects unknown fields with `400 Bad Request`.

### Update

`PUT /{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}/{NAME}`

Upserts the resource: omitted fields are interpreted as a request to clear them; PUT does not accept partial updates. The body must include the `resourceVersion` for optimistic concurrency control.

### Delete

`DELETE /{GROUP}/{VERSION}/items/{RESOURCE_NAME_PLURAL}/{NAME}`: returns `204 NoContent` on success. The optional `resourceVersion` query parameter enforces concurrency control.

## Filtering

In a `list` operation, results can be filtered by object fields. Every kind supports filtering on `metadata.name`, `metadata.title`, `metadata.tags`, `metadata.labels.*`, `metadata.urn`, and any field declared as *selectable* in its Item Type Definition.

Three query parameters drive filtering, all chained in **AND**:

### `label`

Selects objects by their labels. Supported operators:

- Equal: `label=<key>=<value>`
- Not equal: `label=<key>!=<value>`
- Exist: `label=<key>`
- In: `label=<key> in (v1,v2,...)`
- Not in: `label=<key> notin (v1,v2,...)`

The parameter can carry only a single selector; repeat the parameter to combine selectors in AND. Selectors must be URL-encoded.

### `field`

Selects objects by the value of one or more fields. Supported operators:

- Equal: `field=<json-path>=<value>`
- Not equal: `field=<json-path>!=<value>`
- Match (string fields, regex slash-delimited): `field=<json-path>~=<regex>`
- Exist: `field=<json-path>`
- Not exist: `field=!<json-path>`

Selectable fields must hold primitive values or homogeneous arrays of primitives.

### `rawq`

For complex queries (disjunctions, regex, relationship navigation), `rawq` accepts a full query expressed in the Catalog [Query Language](./basic-concepts/70_query-language.md), sent as a URL-safe base64-encoded JSON object. The decoded payload must not exceed roughly 4 KiB. See the dedicated page for the grammar and examples.

## Sorting

Use the `sort` query parameter on a `list` operation. Allowed fields: `metadata.creationTimestamp`, `metadata.name`, `metadata.title`. Prefix with `-` for descending order. Specifying the same field more than once results in `400 Bad Request`.

## Pagination

The `list` operation paginates results.

- `limit`: maximum number of items to return. Default `50`, maximum `200`.
- `continue`: opaque, server-generated token returned in `metadata.continue` when more results are available. Pass it back to retrieve the next page.

Clients should rely on the presence of `continue` to determine whether more results exist, not on the actual count returned.

## Concurrency control

Each resource carries a `resourceVersion` integer. When updating or conditionally deleting a resource, supply the `resourceVersion` you observed: if it does not match the current value the server returns `409 Conflict`. Treat the value as opaque: only its equality matters.

## Fields validation

The server validates the type and presence of required fields, and rejects unknown fields under `metadata` (outside of standard meta) or under `spec` (outside the resource's OpenAPI schema). Validation errors return `400 Bad Request` with the offending fields in the response message.

## Content negotiation

Read operations (`get`, `list`) honor the `Accept` header:

| Representation | `Accept` header                              | Body                                                 |
| :------------- | :------------------------------------------- | :--------------------------------------------------- |
| Full object    | `application/json`, `*/*`, `application/*`, or absent | Complete object including `spec` and `customFields` |
| Metadata-only  | `application/json;as=PartialObjectMetadata`  | `apiVersion`, `kind`, `metadata`, `resourceVersion` only |

If the `Accept` header is present but contains only unsupported media types, the server returns `406 Not Acceptable`. The response always includes a `Vary: Accept` header.

## Error responses

Errors return a JSON body of the form:

```json
{
  "status": 400,
  "error": "NotFound",
  "message": "A human-readable message explaining what went wrong"
}
```

## The `Warning` header

The Catalog API leverages the standard `Warning` response header to deliver non-blocking notices (e.g., API deprecations) without altering the status code or response body:

```http
Warning: 299 - "mia-platform.eu/v1alpha1 Service is deprecated; use mia-platform.eu/v1 Service"
```
