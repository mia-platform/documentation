---
id: configuration
title: CSV Fast Data Connector
sidebar_label: Configuration
---
This microservice allows you to fetch data from CSV files and deliver it with validation to the Fast Data.

In order to achieve this, CSV file specifications must be described in a ConfigMap in the Console by means of a JSON schema. In this way both validation of input data and custom mapping to projections are provided, ensuring the columns in the input file match the corresponding properties of associated projection.


## Environment variables

|         Name         | Required |                                                                     Description                                                                     |   Default value   |
|:--------------------:|:--------:|:---------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------:|
|      HTTP_PORT       |  false   |                                                             Port exposed by the service                                                             |       3000        |
|      LOG_LEVEL       |   true   |                                                              Level to use for logging	                                                              |         -         |
| FILES_NAMES_REGEXES  |   true   |        a comma-separated list of ***regex*** for filenames. Only files matching these regexes will be fetched from the bucket and processed.        |         -         |
|    FILES_SERVICE     |   true   |                                                   url of the files-service used to download files                                                   |         -         |
|  INPUT_FILES_SCOPE   |   true   |                                                                                                                                                     |                   |
|  OUTPUT_FILES_SCOPE  |   true   |                                                                                                                                                     |                   |
| PUSH_GATEWAY_SERVICE |  false   |                                                           url of the push-gateway service                                                           |         -         |
|    KAFKA_BROKERS     |   true   |                                                  comma separated list of names for Kafka Brokers.                                                   |         -         |
|    KAFKA_GROUP_ID    |   true   |                                                                 the Kafka group ID.                                                                 |         -         |
|   KAFKA_CLIENT_ID    |   true   |                                                                the Kafka client ID.                                                                 |         -         |
| KAFKA_SASL_USERNAME  |   true   |                                                                 the Kafka username.                                                                 |         -         |
| KAFKA_SASL_PASSWORD  |   true   |                                                                 the Kafka password.                                                                 |         -         |
| KAFKA_SASL_MECHANISM |   true   |                                                      the Kafka sasl authentication mechanism.                                                       |         -         |
|    SCHEMA_FOLDER     |  false   | path of the folder containing json schema definitions for the optional validation and mapping between CSV columns and the entity object properties. | /local/resources/ |
|      TOPIC_MAP       |   true   |                          JSON string describing the mapping between the name of the projections and the name of the topic.                          |         -         |
|   LAUNCH_MECHANISM   |   true   |                                                       could be either `cronjob` or `polling`.                                                       |         -         |
|      SCHEDULING      |   true   |                            in case of a polling mechanism, the cronjob string for the scheduling of the import process.                             |         -         |


:::note
In case of duplicated CSV files (files with the same filename), the import process will consider them in the order they were written to the storage, with last written as the most recently updated one.
:::

## Configuration

This service will simply look up for files in the bucket whose names match at least one of the `FILES_NAMES_REGEXES`, search for them in the bucket managed by the files-service and process them, validating each CSV line against the JSON schema provided in the folder `SCHEMA_FOLDER`.

To better manage the csv files and maintain a clean environment, it uses the **_multi-bucket_** functionality of the Files Service.
It is therefore important to add the Files Service in the cluster and provide it a multi-bucket configuration.

:::caution
Files Service supports multi-bucket configuration starting from the version `v2.7.0`.
:::

### Validation and mapping

JSON schema validation files are mandatory. In fact, without them it would be impossible to infer the data structure of the entities involved (e.g., the id of the future projection which is also the key of the Kafka message).
JSON Schemas must be named after the projection to map, following this pattern: `${projectionName}_schema.json`. A quick example: if the projection _employees_ were to be mapped, its JSON schema file would be named `employees_schema.json`.

The schema has to describe an object type which properties correspond to the CSV columns in the file.

In order to bond a specific CSV column to a different name for the corresponding property in the projection, the property `projectionProperty` can be added too.

:::note
The csv-connector will map only those properties that are specified in the JSON Schema. Any other columns found in the csv file will not be taken into account.
:::

For every object property in the JSON Schema, additional metadata info can be provided:
* `x-isKey`: boolean specifying wether the property represents the id of the object;
* `x-projectionProperty`: string describing the name that this property will have in the projection object (namely, the mapping between the csv column and the projection property);
* `x-isDelete`: boolean that specifies if the object represented is to be deleted or not.

Let's say we want to map some CSV data describing the entity `employees` into its projection documents. We should first specify the filename regex expression in the **FILES_NAMES_REGEXES** environment variable for the csv source file (e.g, the regex `(\.csv)$` for the source file _employees.csv_) and then insert this file in the path described in the **SCHEMA_FOLDER** variable. The mapping file *employees_schema.json* could be something like this:

```json title="employees_schema.json"
{
  "title": "employees",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "x-isKey": true
    },
    "first_name": {
      "type": "string",
      "x-projectionProperty": "firstName"
    },
    "last_name": {
      "type": "string",
      "x-projectionProperty": "lastName"
    },
    "role": {
      "type": "string",
      "enum": ["developer", "manager", "system administrator"]
    },
    "salary": {
      "type": "number"
    },
    "delete": {
      "type": "boolean",
      "x-isDelete" : "true"
    }
  },
  "required": ["id", "first_name", "last_name", "role", "salary", "delete"],
  "additionalProperties": false
}
```

The properties `first_name`, `last_name` and `role` are columns expected to be found in the CSV source file. The first two declare also the mapping with the projection properties. The third one specifies only the data validation (the name of the projection property will remain the same).

If we now want to add a json schema for another CSV file to process (e.g., for a new entity called `offices`), we need to add a file similar to *employees_schema.json* in the mapping folder. We should then make sure that the **FILES_NAMES_REGEXES** can still apply or add a new one to the list.

:::Caution
The service will process only the files whose names match **FILES_NAMES_REGEXES** regex expression. If other mapping files are inserted in the mapping folder whose names aren't related to those csv files specified, they will not be taken into account and therefore no CSV files will be read for those specifications.
:::


### Kafka configuration

Details of Kafka topics must be provided too. In the environment variable **TOPIC_MAP** the link between the entities (namely, projections names) and the topics is specified.

Following the example of this page, **TOPIC_MAP** will follow this template:
```json
{
	"employees": "topic.employess",
	"offices": "topic.offices"
}
```
