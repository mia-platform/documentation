---
id: cache-apis
title: Cache APIs
sidebar_label: Cache APIs
---

The Farm Data service exposes a REST API for managing cached data when operating in 'key-only'
mode. This API provides read operations for accessing message payloads and aggregation metadata.

## API Overview

The Farm Data API is designed around the concept of:
- **Nodes**: Aggregation nodes representing data streams in the DAG
- **Items**: Individual data records identified by keys
- **Aggregation Graph**: The complete DAG configuration and metadata

## Base Information

- **API Version**: 0.5.2
- **OpenAPI Version**: 3.1.0
- **Base Path**: Configurable via service configuration
- **Content Type**: `application/json`

## CRUD Operations

### READ Operations

#### 1. Get Item by Key

Retrieves a specific data item from an aggregation node using its message key.

**Endpoint**: `GET /heads/{node}/items/{key}`

**Parameters**:
- `node` (path, required): Aggregation node name (string)
- `key` (path, required): Key bytes as URL-safe, non-padded base64 UTF-8 string

**Response**: Returns a `CrudSinkDocument` containing:
- `value`: The actual JSON document value
- `dependencies`: Related dependency documents (for non-tail nodes)

**Response Codes**:
- `200 OK`: Item successfully retrieved
- `400 Bad Request`: Failed to decode the provided key
- `404 Not Found`: Aggregation node or item not found
- `500 Internal Server Error`: Failed to fetch item due to internal error

**Example Request**:
```http
GET /heads/user-profile/items/dXNlcjEyMw
```

**Example Response**:
```json
{
  "value": {
    "userId": "user123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-01-15T10:30:00Z"
  },
  "dependencies": {
    "orders": [
      {
        "value": {
          "orderId": "order456",
          "amount": 99.99,
          "status": "completed"
        },
        "dependencies": {}
      }
    ]
  }
}
```

#### 2. Get Aggregation Graph

Retrieves the complete aggregation graph configuration currently running in the service.

**Endpoint**: `GET /reflection/aggregation/graph`

**Parameters**: None

**Response**: Returns an `AggregationGraph` containing:
- `nodes`: Array of node definitions with edges and identifiers
- `edges`: Array of edge definitions with filters and identifiers

**Response Codes**:
- `200 OK`: Graph successfully retrieved
- `404 Not Found`: Aggregation graph not found

**Example Response**:
```json
{
  "nodes": [
    {
      "id": "user-events",
      "edges": {
        "in": [],
        "out": ["user-to-profile"]
      }
    },
    {
      "id": "order-events", 
      "edges": {
        "in": [],
        "out": ["order-to-profile"]
      }
    },
    {
      "id": "user-profile",
      "edges": {
        "in": ["user-to-profile", "order-to-profile"],
        "out": []
      }
    }
  ],
  "edges": [
    {
      "id": "user-to-profile",
      "filter": {
        "$eq": [
          {"foreign": ["userId"]},
          {"local": ["userId"]}
        ]
      }
    },
    {
      "id": "order-to-profile",
      "filter": {
        "$eq": [
          {"foreign": ["userId"]},
          {"local": ["userId"]}
        ]
      }
    }
  ]
}
```

#### 3. Get Aggregation Heads

Retrieves information about head nodes in the aggregation graph (nodes with no incoming edges).

**Endpoint**: `GET /reflection/aggregation/heads`

**Parameters**: None

**Response**: Returns either:
- Single default head node (if unique)
- Array of multiple head nodes

**Response Codes**:
- `200 OK`: Heads successfully retrieved
- `404 Not Found`: Aggregation graph contains no head nodes

**Example Response (Single Head)**:
```json
{
  "default": "user-events"
}
```

**Example Response (Multiple Heads)**:
```json
{
  "heads": ["user-events", "product-events", "order-events"]
}
```

## Data Models

### CrudSinkDocument

The primary data structure for items retrieved from the cache.

```json
{
  "value": {
    // JsonDocument: The actual record data as a JSON object
  },
  "dependencies": {
    // Dependencies_CrudSinkDocument: Map of dependency names to arrays of related documents
    "dependency_name": [
      {
        "value": { /* nested document */ },
        "dependencies": { /* recursive dependencies */ }
      }
    ]
  }
}
```

### AggregationGraph

Represents the complete DAG configuration.

```json
{
  "nodes": [
    {
      "id": "string", // Unique node identifier
      "edges": {
        "in": ["string"],  // Incoming edge IDs
        "out": ["string"]  // Outgoing edge IDs
      }
    }
  ],
  "edges": [
    {
      "id": "string", // Unique edge identifier
      "filter": {
        // GenericFilter: Complex filter definition for data relationships
      }
    }
  ]
}
```

### Filter Operations

The API supports sophisticated filtering operations for defining relationships between nodes:

- **Logical Operators**: `$and`, `$or`, `$not`
- **Comparison Operators**: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- **Array Operations**: `$in`, `$nin`, `$sizeEq`, `$sizeGt`, etc.
- **Type Checks**: `$isArray`
- **Pattern Matching**: `$regexMatch`

## Error Handling

All API endpoints return structured error responses in the following format:

```json
{
  "error": "string", // Error type or code
  "message": "string" // Optional detailed error message
}
```

## Usage Patterns

### 1. Data Retrieval Workflow

1. **Discover Head Nodes**: Use `/reflection/aggregation/heads` to identify entry points
2. **Explore Graph Structure**: Use `/reflection/aggregation/graph` to understand relationships
3. **Retrieve Specific Items**: Use `/heads/{node}/items/{key}` to fetch data

### 2. Key Encoding

Keys must be provided as URL-safe, non-padded base64 encoded strings. This ensures proper handling of binary key data through HTTP URLs.

```javascript
// Example: Encoding a key for the API
const originalKey = "user123";
const encodedKey = btoa(originalKey).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
// Result: "dXNlcjEyMw"
```

### 3. Dependency Traversal

The `CrudSinkDocument` structure allows recursive traversal of related data:

```javascript
function traverseDependencies(document) {
  console.log('Value:', document.value);
  
  if (document.dependencies) {
    Object.keys(document.dependencies).forEach(depName => {
      console.log(`Dependency ${depName}:`);
      document.dependencies[depName].forEach(dep => {
        traverseDependencies(dep);
      });
    });
  }
}
```

## Integration Examples

### Fetching User Profile with Orders

```bash
# Get user profile with all dependencies
curl -X GET "http://localhost:3000/heads/user-profile/items/dXNlcjEyMw" \
  -H "Accept: application/json"
```

### Exploring Available Data Streams

```bash
# Get all head nodes
curl -X GET "http://localhost:3000/reflection/aggregation/heads" \
  -H "Accept: application/json"

# Get complete graph structure
curl -X GET "http://localhost:3000/reflection/aggregation/graph" \
  -H "Accept: application/json"
```

## Limitations and Considerations

### Read-Only Operations

The current API specification only supports **READ** operations. There are no endpoints for:
- Creating new items (CREATE)
- Updating existing items (UPDATE)  
- Deleting items (DELETE)

This is by design, as Farm Data operates as a stream processor where data modifications occur through Kafka message processing rather than direct API calls.

### Performance Considerations

- **Caching**: The API operates on cached data when in 'key-only' mode
- **Dependency Loading**: Deep dependency trees may impact response times
- **Key Lookup**: Base64 key decoding and lookup operations are optimized for performance

### Security Considerations

- **Input Validation**: All path parameters are validated before processing
- **Error Information**: Error responses avoid exposing sensitive internal details
- **Access Control**: Consider implementing authentication/authorization as needed

## Troubleshooting

### Common Error Scenarios

1. **Invalid Key Format** (400 Error):
   - Ensure key is properly base64 encoded
   - Remove padding characters (`=`)
   - Use URL-safe characters (`-` and `_` instead of `+` and `/`)

2. **Node Not Found** (404 Error):
   - Verify node name matches aggregation graph configuration
   - Check that the requested node exists in the current graph

3. **Item Not Found** (404 Error):
   - Confirm the key exists in the specified node
   - Verify the aggregation has processed messages with this key

### Debugging Tips

- Use `/reflection/aggregation/graph` to verify current configuration
- Check service logs for detailed error information
- Validate key encoding using online base64 tools
