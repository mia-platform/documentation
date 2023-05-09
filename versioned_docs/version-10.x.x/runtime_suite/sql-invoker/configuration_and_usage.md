---
id: configuration_and_usage
title: SQL Invoker
sidebar_label: Configuration and Usage
---
SQL Invoker is designed to invoke stored procedure and/or stored function. In this moment, the service supports only:

- Stored procedures that does not return result sets and consequently:
  - performs database side effects
  - get results from `INOUT` and `OUT` parameters

In future releases, the service will support:

- Stored procedures that returns result sets
- Stored functions that returns result sets

The service will read configuration files contained within the directory specified in the `PROFILE_FILES_PATH` directory.

## Environment variables

The variables to be set are the following:

- `HTTP_PORT`: The port exposed by the service
- `PROFILE_FILES_PATH`: The dir in which are located the stored procedures/functions
- `DB_USER`: The database username
- `DB_PASSWORD`: The database password
- `DB_URI`: JDBC uri specifying also the schema at the end. Ex: `jdbc:mariadb://localhost:3306/testdb`
- `DB_DRIVER`: The JDBC driver class name. Example for MariaDB: `org.mariadb.jdbc.Driver`

## Stored functions/procedures file structure

Files contained within the `PROFILE_FILES_PATH` have the following format:

```json
{
    "name": "testdb.TEST_STORED_PROCEDURE_PRESENT",
    "parameters": [
        {
         "name": "in",
         "dataType": "INTEGER",
         "parameterType": "IN"
        },
        {
         "name": "in_out",
         "dataType": "INTEGER",
         "parameterType": "INOUT"
        },
        {
         "name": "out",
         "dataType": "INTEGER",
         "parameterType": "OUT"
        }
    ]
}
```

- `name`: The name of schema and the stored procedure/function concatenated with a dot, as you would invoke it using SQL.
- `parameters`: An array containing objects describing parameters, as described below:
  - `name`: The parameter name
  - `dataType`: The SQL data type of the parameter
  - `parameterType`: One of `IN`, `INOUT`, `OUT` string.

## Endpoints

The service will read each file contained in the `PROFILE_FILES_PATH` directory and will expose for each one and endpoint.
The endpoint name corresponds to the property `name` of the file.

For example the file described in the paragraph above will expose the `\testdb.TEST_STORED_PROCEDURE_PRESENT` endpoint.

## REST API live documentation

The service offers an interactive documentation of the API via Swagger,
at the route `/documentation` of the running SQL Invoker.

[pipeline]: https://git.tools.mia-platform.eu/platform/core/sql-invoker/badges/master/pipeline.svg
[coverage]: https://git.tools.mia-platform.eu/platform/core/sql-invoker/badges/master/coverage.svg
[git-link]: https://git.tools.mia-platform.eu/platform/core/sql-invoker/commits/master
