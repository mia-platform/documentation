---
id: configuration
title: CRUD SQL Configuration
sidebar_label: Configuration
---



This service can be added to your project by visiting Mia-Platform [Marketplace](/runtime-components/overview_marketplace.md)
and creating a new microservice from the **CRUD SQL** plugin (there is a dedicated plugin for each supported vendor).

## Configure a CRUD SQL 

The CRUD SQL needs some environment variables, and a configurations file to work.

### Environment variables

Below you can find all the environment variables that you can edit.

| Variable                | Type   | Required | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|-------------------------|--------|----------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| USERID_HEADER_KEY       | String | -        | miauserid     | The name of the header that contains information of the user.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| HTTP_PORT               | Int    | -        | 3000          | The port on which the application server will serve status requests (default 3000).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| TABLE_DEFINITION_FOLDER | String | &check;  | -             | Absolute path of a folder containing the tables JSON schemas.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| LOG_LEVEL               | String | &check;  | -             | Specifies the log level to use.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| DB_URL                  | String | &check;  | -             | Required. The connection string to connect to the database with username and password. <br />Accepted formats: <br />- `[sqlserver\|postgresql]://[user[:[password]]@]host[:port][/database][?<key1\>=<value1\>[&<key2\>=<value2\>]]` <br /> - `jdbc:sqlserver://[serverName[\instanceName][:portNumber]][;property=value[;property=value]]` (see [Microsoft documentation](https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15)) <br /> - `jdbc:postgresql://[serverName[:portNumber]]/[databaseName][?property=value[&property=value]]` (see [Postgresql documentation](https://jdbc.postgresql.org/documentation/use/)) <br /> - `jdbc:oracle:thin:[user]/[password]@[host]:[port]/[database]` |

### Tables configuration
The tables should be included in separate JSON files in the folder defined with the environment variable `TABLE_DEFINITION_FOLDER`. Each tables object requires the following fields:

| Name             | Type               | Required | Default value | Description                                                                                                                                                                                                     |
|------------------|--------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| version          | String             | -        | -             | Configuration file version.                                                                                                                                                                                     |
| id               | String             | -        | -             | Additional identifier that can be associated to the collection definition.                                                                                                                                      |
| name             | String             | &check;  | -             | The name of the table.                                                                                                                                                                                          |
| endpointBasePath | String             | &check;  | -             | The endpoint path, used as entry point to CRUD operations.                                                                                                                                                      |
| schema           | JSONSchemaStandard | &check;  | -             | The JSON Schema configuration of the fields to be included in the collection object. A complete description of its fields can be found in the [ _schema_](#table-configuration-json-schema) section.            |
| metadata         | Object             | &check;  | -             | Object that contains service support metadata to handle standard fields such as updatedAt or updaterId. A complete description of its fields can be found [in the _metadata fields_ section](#metadata-fields). |

#### Metadata fields
| Name           | Type                   | Required | Default value | Description                                                                                                                   |
|----------------|------------------------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| primaryKey     | String / Array[String] | &check;  | -             | Column (or Columns) which identify the primary key of the table                              .                                |
| manageIdColumn | Boolean                | &check;  | -             | Boolean flag that specifies if SQL tables use identity columns as identifier for records                              .       |
| creatorId      | String                 | -        | -             | The name of the column you want to use to save the id of the user who created the record.                                     |
| updaterId      | String                 | -        | -             | The name of the column you want to use to save the id of the user who updated the record.                                     |
| createdAt      | String                 | -        | -             | The name of the column you want to use to represent the created at moment - if not set is handled internally by the service.  |
| updatedAt      | String                 | -        | -             | The name of the column you want to use to represent the updated at moment - if not set is handled internally by the service.  |
| timezone       | String                 | -        | -             | The timezone to be used for date type fields. The format to be used is [Time Zone Database](https://www.iana.org/time-zones). |

#### Table Configuration JSON Schema
```json
{
  "type": "object",
  "required": ["version","name", "endpointBasePath", "schema", "metadata"],
  "properties": {
    "version": {
      "type": "number",
      "description": "config schema version"
    },
    "id": {
      "type": "string",
      "description": "additional table identifier"
    },
    "name": {
      "type": "string",
      "description": "name of the table associated on DB - this also uniquely identifies the collection model"
    },
    "endpointBasePath": {
      "type": "string",
      "description": "APIs base path employed as entrypoint for all the CRUD operations"
    },
    "description": {
      "type": "string",
      "description": "brief description of the collection purpose",
      "nullable": true
    },
    "schema": {
      "type": "object",
      "description": "represents the schema of the table, each fields in this object represent a column of the table",
      "properties": {
        "$fieldName": {
          "type": {
            "enum": [
              "string",
              "number",
              "integer",
              "boolean"
            ],
            "required": true,
            "nullable": false
          },
          "format": {
            "enum": [
              "date-time"
            ],
            "required": false,
            "nullable": true
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["primaryKey", "manageIdColumn"],
      "description": "represents the schema of the table",
      "properties": {
        "primaryKey": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1
            },
            {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string",
                "minLength": 1
              }
            }
          ]
        },
        "manageIdColumn": {
          "type": "boolean",
          "description": "boolean flag that specifies if SQL tables use identity columns as identifier for records"
        },
        "creator": {
          "type": "string",
          "description": "the name of the column you want to use to save the id of the user who created the record",
          "nullable": true
        },
        "updaterId": {
          "type": "string",
          "description": "the name of the column you want to use to save the id of the user who updated the record",
          "nullable": true
        },
        "createdAt": {
          "type": "string",
          "description": "the name of the column you want to use to represent the created at moment",
          "nullable": true
        },
        "updatedAt": {
          "type": "string",
          "description": "the name of the column you want to use to represent the updated at moment",
          "nullable": true
        },
        "timezone": {
          "type": "string",
          "description": "the timezone to be used for date type fields",
          "nullable": true
        }
      }
    }
  }
}
```

#### Tables configuration example
Below you can find an example of table configuration.

```json
{
  "version": 1,
  "id": "authors",
  "name": "authors",
  "endpointBasePath": "/authors",
  "schema": {
    "type": "object",
    "required": [
      "name",
      "surname"
    ],
    "properties": {
      "id": {
        "type": "number"
      },
      "__STATE__": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "surname": {
        "type": "string"
      },
      "creatorId": {
        "type": "string",
        "description": "User id that has created this object"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time",
        "description": "Date of the request that has performed the object creation"
      },
      "updaterId": {
        "type": "string",
        "description": "User id that has requested the last change successfully"
      },
      "updatedAt": {
        "type": "string",
        "format": "date-time",
        "description": "Date of the request that has performed the last change"
      }
    }
  },
  "metadata": {
    "primaryKey": "id",
    "creatorId": "creatorId",
    "updaterId": "updaterId",
    "createdAt": "createdAt",
    "updatedAt": "updatedAt",
    "timezone": "Europe/Rome",
    "manageIdColumn": "true"
  }
}
```

### Column names conventions

The CRUD SQL follows the vendor convention on the column names:

- MSSQL: the output follows the case in input
- PostgreSQL: the default of the driver is to return the column names in lowercase
- Oracle: the default of the driver is to return the column names in uppercase

:::tip
In order to avoid any problem, we suggest to follow the same convention when configuring a table.
:::
