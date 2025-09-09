---
id: configuration
title: Configuration
sidebar_label: Configuration
---



Due to licensing [CRUD SQL service](/runtime_suite/crud-postgresql/10_overview.md) requires packaging with third-party software, unless your DataSource are PostgreSQL or MSSQL databases whose support is already included in the docker image of the plugins.

## Service Configuration
The CRUD SQL needs some environment variables, and a configurations file to work.

### Environment variables

Below you can find all the environment variables that you can edit.

| Variable                | Type   | Required | Default value | Description                                                                                                                                                                                                                                                                                                                                                  |
|-------------------------|--------|----------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| USERID_HEADER_KEY       | String | -        | miauserid     | The name of the header that contains information of the user.                                                                                                                                                                                                                                                                                                |
| HTTP_PORT               | Int    | -        | 3000          | The port on which the application server will serve status requests (default 3000).                                                                                                                                                                                                                                                                          |
| TABLE_DEFINITION_FOLDER | String | &check;  | -             | Absolute path of a folder containing the tables JSON schemas.                                                                                                                                                                                                                                                                                                |
| LOG_LEVEL               | String | &check;  | -             | Specifies the log level to use.                                                                                                                                                                                                                                                                                                                              |
| DB_URL                  | String | &check;  | -             | Required. The connection string to connect to the database with username and password. <br /> Accepted formats: <br /> - `[sqlserver\|postgresql]://[user[:[password]]@]host[:port][/database][?<key1\>=<value1\>[&<key2\>=<value2\>]]` <br /> - `jdbc:[sqlserver\|postgresql]://[host]:[port];databaseName=[db-name];user=[db-user];password=[db-password]` |

### Tables configuration
The tables should be included in separate JSON files in the folder defined with the environment variable `TABLE_DEFINITION_FOLDER`. Each tables object requires the following fields:

| Name             | Type               | Required | Default value | Description                                                                                                                                                                                                     |
|------------------|--------------------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| version          | String             | -        | -             | Configuration file version.                                                                                                                                                                                     |
| id               | String             | -        | -             | Additional identifier that can be associated to the collection definition.                                                                                                                                      |
| name             | String             | &check;  | -             | The name of the table.                                                                                                                                                                                          |
| endpointBasePath | String             | &check;  | -             | The endpoint path, used as entry point to CRUD operations.                                                                                                                                                      |
| schema           | JSONSchemaStandard | &check;  | -             | The JSON Schema configuration of the fields to be included in the collection object.            |
| metadata         | Object             | &check;  | -             | Object that contains service support metadata to handle standard fields such as updatedAt or updaterId. |

:::info
For a more in-depth description of the configuration, you can refer to the [plugin configuration](/runtime_suite/crud-postgresql/20_configuration.md).
:::

## Template Setup

### Setup Nexus credentials

To use the Mia-Platform library you need access to the Mia-Platform Nexus repository. The project is already setup to use the repository but you have to provide valid access credentials.

To do this, create a copy of the `gradle.properties` file as follows:

```shell
cp gradle.properties gradle-local.properties
```

Then fill the requested credentials in the `gradle-local.properties` file.

### Install JDBC driver

To install a JDBC driver, update the `dependencies` section of the `app/build.gradle.kts` file by adding the required dependency.

For example add this line to use the JDBC driver for Oracle version 23:

```
implementation("com.oracle.database.jdbc:ojdbc8:23.3.0.23.09")
```

To install the dependency you can build the project in your IDE or run the following command in a terminal:

```bash
./gradlew installDist
```

### Update App file

Now you can modify the `App.kt` file in the `app/src/main/kotlin/eu/miaplatform/template/crud/` folder.

You have to provide to the `Server().start()` function a parameter that is the DataSource configured to connect to your database.

For example, if you used the Oracle JDBC driver, you can Configure a `OracleDataSource` instance with a valid connection string in a function like this:

```kotlin
private fun getDataSource(dbConnectionString: String): DataSource {
    val ds = OracleDataSource()
    ds.url = dbConnectionString
    return ds
}
```

and provide the DataSource like this:

```kotlin
fun main(): Unit = runBlocking {
    Server().start(getDataSource(System.getenv("DB_URL")))
}
```

## Local Testing

To run the application from the terminal run:
```bash
./gradlew clean run
```

The service will startup and expose CRUD APIs for the `books` table.
Please remember that the table must already exist in the database. If it is not present, create it with the following SQL query:

```SQL
CREATE TABLE books
(
    ID NUMBER,
    TITLE VARCHAR(100),
    AUTHOR VARCHAR(100),
    PRICE INTEGER,
    PUBLISHED BOOLEAN,
    SALESFORECAST INTEGER,
    LANGUAGE VARCHAR(100),
    RELEASEDATE TIMESTAMP,
    RELEASEPRICE DECIMAL(3),
    CREATORID VARCHAR(100),
    CREATEDAT TIMESTAMP,
    UPDATERID VARCHAR(100),
    UPDATEDAT TIMESTAMP,
    PRIMARY KEY(ID)
)
```

You can now make HTTP requests to the CRUD SQL service.

For example this request will create a record in the `books` table:

```bash
curl --request POST \
  --url http://localhost:3000/books \
  --header 'Content-Type: application/json' \
  --header 'userId: user' \
  --data '{
      "ID": 1,
      "TITLE": "book title",
      "AUTHOR": "book author"
    }'
```

This request will retrieve all records from the table:

```bash
curl http://localhost:3000/books/
```
