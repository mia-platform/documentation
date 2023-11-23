---
id: overview
title: Single View Creator Configuration
sidebar_label: Single View Creator
---

# Single View Creator

The Single View Creator is the service that keeps the Single View updated with data retrieved from Projections. 
This service is available as a plugin or as a template:
- [plugin](/fast_data/configuration/single_view_creator/plugin.md): it allows you to use the Single View Creator as a black-box. You just need to configure it through the Config Maps and environment variables
- [template](/fast_data/configuration/single_view_creator/template.md): it gives you access to the source code of the Single View Creator, which will be hosted on a Git repository. You will need to update its dependencies and maintain the code. 

:::tip
We strongly recommend using the plugin. The template is supposed to be used only for advanced use cases where the plugin cannot be used. 
:::

## Environment Variables

| Name                                | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default value       |
| ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| CONFIGURATION_FOLDER                | -        | Folder where configuration files are mounted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | /home/node/app/src/ |
| LOG_LEVEL                           | &check;  | Level to use for logging                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | -                   |
| HTTP_PORT                           | -        | Port exposed by the service                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 3000                |
| TYPE                                | &check;  | Identifies the type of projection changes that need to be read. It should be the same as the Single View name you want to update.                                                                                                                                                                                                                                                                                                                                                                                           | -                   |
| SCHEDULING_TIME                     | -        | a quantity of time in milliseconds, every X milliseconds the service wake up and check if there are some projections changes in `NEW` state to work on. The service continue working until no more new projections changes are found, if so he goes to sleep for X milliseconds.                                                                                                                                                                                                                                            | 60000               |
| PROJECTIONS_MONGODB_URL             | &check;  | MongoDB connection string where projections are stored. Must be a valid uri                                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                   |
| SINGLE_VIEWS_MONGODB_URL            | &check;  | MongoDB connection string where single view must be stored. Must be a valid uri                                                                                                                                                                                                                                                                                                                                                                                                                                             | -                   |
| PROJECTIONS_CHANGES_MONGODB_URL     | -        | The db from where projections changes are read. If not set, `PROJECTIONS_MONGODB_URL` is used.                                                                                                                                                                                                                                                                                                                                                                                                                              | -                   |
| PROJECTIONS_CHANGES_DATABASE        | &check;  | The db from where projections changes are read.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -                   |
| PROJECTIONS_DATABASE                | &check;  | The db from where projections are read. If not set, `PROJECTIONS_CHANGES_DATABASE` is used.                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                   |
| PROJECTIONS_CHANGES_COLLECTION      | -        | if you have set a custom projection change collection name from advanced, then set its name. Otherwise, it is `fd-pc-SYSTEM_ID` where `SYSTEM_ID` is the id of the System of Records this single view creator is responsible for.                                                                                                                                                                                                                                                                                           | -                   |
| SINGLE_VIEWS_DATABASE               | &check;  | The db from where single views are written.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                   |
| SINGLE_VIEWS_COLLECTION             | &check;  | It must be equals to the Single View name the service is in charge of keeping updated.                                                                                                                                                                                                                                                                                                                                                                                                                                      | -                   |
| SINGLE_VIEWS_PORTFOLIO_ORIGIN       | &check;  | should be equals to the `SYSTEM_ID` you have set in `PROJECTIONS_CHANGES_COLLECTION`                                                                                                                                                                                                                                                                                                                                                                                                                                        | -                   |
| SINGLE_VIEWS_ERRORS_COLLECTION      | &check;  | Name of a MongoDB CRUD you want to use as collection for single view errors.                                                                                                                                                                                                                                                                                                                                                                                                                                                | -                   |
| KAFKA_CONSUMER_GROUP_ID             | -        | **@deprecated** - in favor of KAFKA_GROUP_ID. The Kafka consumer group identifier                                                                                                                                                                                                                                                                                                                                                                                                                                           | -                   |
| KAFKA_GROUP_ID                      | -        | defines the Kafka group id (it is suggested to use a syntax like ```{'{tenant}.{environment}.{projectName}.{system}.{singleViewName}.single-view-creator'}```)                                                                                                                                                                                                                                                                                                                                                              | -                   |
| KAFKA_CLIENT_ID                     | -        | The Kafka client identifier                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                   |
| KAFKA_BROKERS_LIST                  | -        | **@deprecated** - in favor of KAFKA_BROKERS. list of brokers the service needs to connect to                                                                                                                                                                                                                                                                                                                                                                                                                                | -                   |
| KAFKA_BROKERS                       | -        | list of brokers the service needs to connect to                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | -                   |
| KAFKA_SASL_MECHANISM                | -        | The Kafka SASL mechanism to be used. Can be one of the following: "plain", "PLAIN", "scram-sha-256", "SCRAM-SHA-256", "scram-sha-512", "SCRAM-SHA-512"                                                                                                                                                                                                                                                                                                                                                                      | plain               |
| KAFKA_SASL_USERNAME                 | -        | username to use for logging into Kafka                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | -                   |
| KAFKA_SASL_PASSWORD                 | -        | password to use for logging into Kafka                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | -                   |
| KAFKA_SVC_EVENTS_TOPIC              | -        | topic used to queue Single View Creator state changes (e.g. single view creation). This feature is deprecated in favor of KAFKA_SV_UPDATE_TOPIC and it will be removed soon                                                                                                                                                                                                                                                                                                                                                 | -                   |
| SEND_BA_TO_KAFKA                    | -        | true if you want to send to Kafka the `before-after` information about the update changes of the single view. This feature is deprecated in favor of ADD_BEFORE_AFTER_CONTENT using the 'sv-update' event and it will be removed soon                                                                                                                                                                                                                                                                                       | false               |
| KAFKA_BA_TOPIC                      | -        | topic where to send the `before-after` messages which represent the single view document before and after a change. This feature is deprecated in favor of ADD_BEFORE_AFTER_CONTENT using the 'sv-update' event and it will be removed soon                                                                                                                                                                                                                                                                                 | -                   |
| SEND_SV_UPDATE_TO_KAFKA             | -        | true if you want to send to Kafka the `sv-update` message about the update changes of the single view                                                                                                                                                                                                                                                                                                                                                                                                                       | false               |
| ADD_BEFORE_AFTER_CONTENT            | -        | true if you want to add the _before_ and _after_ content to the `sv-update` message, works only if `SEND_SV_UPDATE_TO_KAFKA` is set to true                                                                                                                                                                                                                                                                                                                                                                                 | false               |
| KAFKA_SV_UPDATE_TOPIC               | -        | topic where to send the `sv-update` message                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | -                   |
| UPSERT_STRATEGY                     | -        | (v3.1.0 or higher) Strategy name or file path to update/insert Single View records, for more info checkout [Upsert and Delete strategies](/fast_data/configuration/single_view_creator/upsert_delete_strategies.md).                                                                                                                                                                                                                                                                                                                                                       | replace             |
| DELETE_STRATEGY                     | -        | (v3.1.0 or higher) Strategy name or file path to delete Single View records, for more info checkout [Upsert and Delete strategies](/fast_data/configuration/single_view_creator/upsert_delete_strategies.md).                                                                                                                                                                                                                                                                                                                                                              | delete              |
| SINGLE_VIEWS_MAX_PROCESSING_MINUTES | -        | (v3.4.2 or higher) time to wait before processing again a Projection with state IN_PROGRESS                                                                                                                                                                                                                                                                                                                                                                                                                                 | 30                  |
| CA_CERT_PATH                        | -        | The path to the CA certificate, which should include the file name as well, e.g. `/home/my-ca.pem`                                                                                                                                                                                                                                                                                                                                                                                                                          | -                   |
| ER_SCHEMA_FOLDER                    | -        | The path to the ER Schema folder, e.g. `/home/node/app/erSchema`                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -                   |
| AGGREGATION_FOLDER                  | -        | The path to the Aggregation folder, e.g. `/home/node/app/aggregation`                                                                                                                                                                                                                                                                                                                                                                                                                                                       | -                   |
| USE_AUTOMATIC                       | -        | Whether to use the low code architecture for the Single View Creator service or not                                                                                                                                                                                                                                                                                                                                                                                                                                         | -                   |
| PROJECTIONS_CHANGES_SOURCE          | -        | System to use to handle the Projection Changes, supported methods are KAFKA or MONGO                                                                                                                                                                                                                                                                                                                                                                                                                                        | MONGO               |
| KAFKA_PROJECTION_CHANGES_TOPICS     | -        | Comma separated list of projection changes topics                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | -                   |
| KAFKA_PROJECTION_UPDATE_TOPICS      | -        | Comma separated list of projection update topics                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | -                   |
| SV_TRIGGER_HANDLER_CUSTOM_CONFIG    | -        | Path to the config defining SV-Patch actions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | -                   |
| READ_TOPIC_FROM_BEGINNING           | -        | Available from v.5.5.0 of the Single View Creator Plugin. If set to true, the Single View Creator will start reading from messages in the Projection Changes topic from the beginning, instead of the message with the latest commmitted offset. This will happen only the first time connecting to the topic, and it has effect only if ```PROJECTIONS_CHANGES_SOURCE``` is set to <i>KAFKA</i>.                                                                                                                           | false               |
| USE_UPDATE_MANY_SV_PATCH            | -        | Use the MongoDB ```updateMany``` operation instead of the ```findOneAndUpdate``` with cursors in the sv patch operation. This will speed up the Single View creation/update process but it will not fire the kafka events of Single View Creation/Update. As a natural consequence, if enabled, the following environment vairables will be ignored: ```SEND_BA_TO_KAFKA```, ```KAFKA_BA_TOPIC```, ```SEND_SV_UPDATE_TO_KAFKA```, ```KAFKA_SV_UPDATE_TOPIC```, ```ADD_BEFORE_AFTER_CONTENT```, ```KAFKA_SVC_EVENTS_TOPIC``` | false               |
| KAFKA_CONSUMER_MAX_WAIT_TIME_MS     | -        | (v6.2.1 or higher) The maximum amount of time in milliseconds the server will block before answering the fetch request if there isn't sufficient data to immediately satisfy the requirement given by minBytes [1 byte]                                                                                                                                                                                                                                                                                                     | 500                 |
| SV_UPDATE_VERSION                   | -        | (v6.2.1 or higher) Define which version of the `sv-update` event should be emitted by the service. Accepted values are `v1.0.0` and `v2.0.0`. By default, for retro-compatibility, version `v1.0.0` is employed                                                                                                                                                                                                                                                                                                             | v1.0.0              |

If you do not want to use Kafka in the Single View Creator, you can just not set the environment variable *KAFKA_CLIENT_ID* or *KAFKA_BROKERS*. If one of them is missing, Kafka will not be configured by the service (requires *single-view-creator-lib* `v9.1.0` or higher)


## Consuming from Kafka

As you can see, the Single View Creator lets you configure what channel is used as input through the `PROJECTIONS_CHANGES_SOURCE` environment variable. The default channel is MongoDB for the [Projection Changes](/fast_data/inputs_and_outputs.md#projection-changes) but this might not always be what you need. The service gives you the alternative to listen from Apache Kafka instead, this can be useful in two different cases:

- You want to use the [Single View Trigger Generator](/fast_data/single_view_trigger_generator.md) to produce [`sv-trigger`](/fast_data/inputs_and_outputs.md#single-view-trigger-message) messages.
- You want to configure the [Single View Patch](/fast_data/configuration/single_view_creator/patch.md) cycle which reads [`pr-update`](/fast_data/inputs_and_outputs.md#projection-update-message) messsages from the Real-Time Updater.

In both of the cases you have to configure all the required environment variables related to kafka. First you need to configure the `KAFKA_BROKERS` and `KAFKA_GROUP_ID`, then you probably need to configure your authentication credentials with `KAFKA_SASL_MECHANISM`, `KAFKA_SASL_USERNAME` and `KAFKA_SASL_PASSWORD`.

Once this is done remember to set the `PROJECTIONS_CHANGES_SOURCE` environment variable to `KAFKA` and to check out the configuration page of the system you need to complete the necessary steps.

## Handling Connections with Self Signed Certificates 

Sometimes MongoDB or Kafka instances may have a TLS connection with a self-signed certification authority.

Since service version `3.9.0`, you can include additional certification authority certificates by providing the absolute path of a certification file in the environment variable `CA_CERT_PATH`. This file should be included in your project as [a Secret](/development_suite/api-console/api-design/services.md#secrets).

## Error handling

When generating a Single View, every error that occurs is saved in MongoDB, with a format that satisfies the schema requirements of the CRUD service, so that you can handle those errors using the Console. The fields of the error messages when they are first created are:

- `_id`: a unique identifier of the record, automatically generated
- `portfolioOrigin`: a value concerning the origin of the error, defaults to `UNKNOWN_PORTFOLIO_ORIGIN`
- `type`: the Single View type
- `identifier`: the id of the projection changes
- `errorType`: the error details
- `createdAt`: the time of creation
- `creatorId`: set to `single-view-creator`
- `__STATE__`: set to `PUBLIC`
- `updaterId`: set to `single-view-creator`
- `updatedAt`: the time of creation

It is highly recommended to use a TTL index to enable the automatic deletion of older messages, which can be done directly using the Console, as explained [here](/development_suite/api-console/api-design/crud_advanced.md#indexes).

## Read from multiple databases

To read data from multiple databases you need to leverage on custom function from the mapping configuration.  
First of all, you need to create a config map and we suggest creating at least two files: one for the database connection and the other for custom functions.

The connection file could be like the following:

```javascript
// secondDB.js
const { MongoClient } = require('mongodb');

const url = '{{MONGODB_URL_2}}';
const client = new MongoClient(url);

let connected = false

module.exports = async function (){
    if (!connected) {
        await client.connect();
        connected = true
    }
    return client
}
```

The above code uses the database driver and exports a function to retrieve the connected client.  
This module works like a singleton, indeed the client is created once and the state, e.g. the `connected` variable, lives for the entire duration of the Node.js process (remember that `require` a module is always evaluated once by Node.js).  
Because this is a config map, the `{{MONGODB_URL_2}}` will be interpolated at deploy time. Remember to set it up in the environment variables section.


Then in a custom function file, you can retrieve the connected client and use it for reading data:

```javascript
// fieldFromSecondDB.js
const getClient = require('./secondDB.js')

module.exports = async function (logger, db, dependenciesMap){
    const client = await getClient()
    return client.db().collection('collection').findOne();
}
```

Finally, you can use the custom function in the mapping configuration:

```json
{
   "version":"1.1.0",
   "config":{
      "SV_CONFIG":{
         "dependencies":{
            "PEOPLE":{
               "type":"projection",
               "on":"_identifier"
            },
            "MARRIAGE":{
               "type":"projection",
               "on":"PEOPLE_TO_MARRIAGE"
            },
            "PEOPLE":{
               "type":"projection",
               "on":"MARRIAGE_b_TO_PEOPLE"
            }
         },
         "mapping":{
            "name":"PEOPLE.name",
            "marriedWith":"PEOPLE.name",
            "fieldFromSecondDB":"__fromFile__[fieldFromSecondDB]"
         }
      }
   }
}
```
