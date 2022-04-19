---
id: log
title:  Guidelines for logs
sidebar_label: Guidelines for logs
---
The objective of these guidelines is to guarantee uniformity between the logs from all services that run in a single project, regardless of whether they are custom or core.

## Log Parsers

When configuring a custom service you can select a _Log Parser_; each log parser supports a specific logging format but they share the same purpose: allow log collection and processing
from your Kubernetes cluster to the ELK Stack. 

Mia-Platform Console provides a series of log parsers that can be selected from the Console and will be used to properly parse and process your service logs:

 - `mia-json`: which processes all logs as JSON parsing all the keys to store them;
 - `mia-nginx`: a custom Nginx parser;
 - `mia-plain`: a plain text parser;
 - _Not Collected_: prevents all logs from the Kubernetes Pod to be collected and processed.

## JSON Logging format

When a service uses the label with value `mia-json`, all of its key/values are collected and stored in elastic, however if you want to perform queries on the logs using Kibana you'll need to create indexes.

A set of preconfigured indexes come with each Console project, these indexes run on a specific set of keys. The following document provides a list of available log keys (following the [Elastic Common Schema](https://www.elastic.co/guide/en/ecs/current/index.html) specifications) that can be used, some of these (the one where **indexed** is shown) are indexed.

:::info
Each project has a set of preconfigured indexes, if you need custom indexes ask your Mia-Platform representative.
:::

The following are guidelines, drawn from [guidelines and best practices suggested by Elastic](https://www.elastic.co/guide/en/ecs/1.4/ecs-guidelines.html), which should be followed when application logs are generated:

* Field names have to be in **camelCase**
* Field names must not contain special characters
* Field names should be singular or plural according to the content of the field
* Whenever it makes sense prefer nesting your fields in structured objects
* Avoid using abbreviations in field names as much as possible

:::note
When creating a new server consider offload the setup of the logging facilities to Mia-Platform service libraries:

* for **Node.js** services you can use [lc39](https://github.com/mia-platform/lc39) and [custom-plugin-lib](https://github.com/mia-platform/custom-plugin-lib);
* for **Go** services you can use [glogger](https://github.com/mia-platform/glogger);
:::

### Use the appropriate logging level

It is important to always use the correct log level; Each level has a value expressed in tenths.
To choose which is the appropriate level, one should rely on the following criteria:

| name          | level | description                                                                                                                                       |
| ------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ```trace```   | 10    | used to trace the operations flow of the application (do not use in production)                                                                   |
| ```debug```   | 20    | to report information that may be useful in troubleshooting (do not use in production)                                                            |
| ```info```    | 30    | in cases where the service has to give information about the branch of code in execution                                                          |
| ```warning``` | 40    | in cases of recoverable error, the service can continue to process the request                                                                    |
| ```error```   | 50    | in cases of not recoverable error and error for which the processing of the request (but not the service) must be interrupted                     |
| ```fatal```   | 60    | in cases of unexpected and not recoverable error, and as a result of which the service must stop its execution                                    |

:::note
It is important to put in logs the right information that can be used to track operations, highlight problems and allow troubleshooting.
It is equally important to pay close attention to what is written in logs, avoiding, under any circumstance, to insert any private or sensitive value that can lead to privacy-related issues or incidents.
:::

### Mandatory Fields

In each log, the following fields have to be always present:

| name        | type   | description                                                                      |
| ----------- | ------ | -------------------------------------------------------------------------------- |
| ```msg```   | string | the text message specific for each log                                           |
| ```reqId``` | string | taken from the platform headers and necessary to trace the flow of each request; |
| ```time```  | number | that signals the moment when it was generated in Unix timestamp                  |
| ```level``` | number | this marks the importance level of a log                                         |

:::info
All these fields are **indexed**.
:::

:::warning
The `reqId` field is extremely useful to trace operations following a single request and is considered mandatory since most of times services expose APIs.
However, if the concept of request tracing is not applicable it can be ignored.
:::

### Mandatory Logs

Each service exposing APIs must necessarily generate the logs shown in the table below, specifying the following fields in addition to the mandatory field specified above.

| **Event**         | **Level**   | **Field**                                              |
| ----------------- | ----------- | ------------------------------------------------------ |
| Incoming request  | ```trace``` | ```host```, ```url```                                  |
| Request completed | ```info```  | ```host```, ```http```, ```responseTime```,  ```url``` |

:::info
All these fields are **indexed**.
:::

:::note
If the service is not REST but takes its inputs from another source, the same criteria has to be applied;
Use a ```trace``` log when the event processing starts, and a ```info``` log when the event ends;
The final log should contain as much useful information as possible.
:::

### ECS Field Definition

The following are examples taken from ECS documentation. None of the fields are mandatory, however it is important to use standard keys, whenever applicable.

#### Errors

If you want to create error logs we recommend this structure
When an error log has been generated, the passed object must necessarily have the key ```error```,
whose value has to be an object of the form specified by ECS for the [Error Fields](https://www.elastic.co/guide/en/ecs/1.4/ecs-error.html),
which are shown in the table below:

| **Field**              | **Description**                                                                                                                                   | **Level** |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| ```error.code```       | Error code describing the error.            type: ```keyword```                                                                                   | core      |
| ```error.id```         | Unique identifier for the error.        type: ```keyword```                                                                                       | core      |
| ```error.message```    | Error message.      type: ```text```                                                                                                              | core      |
| ```error.stackTrace``` | The stack trace of this error in plain text.    type: ```keyword```       Multi-fields: ```error.stackTrace.text``` (type: ```text```)            | extended  |
| ```error.type```       | The type of the error, for example the class name of the exception.       type: ```keyword```       example: ```java.lang.NullPointerException``` | extended  |

:::info
All these fields are **indexed**.
:::

#### [*Host*](https://www.elastic.co/guide/en/ecs/1.4/ecs-host.html)

| **Field**           | **Description**                                                                                                                                                                                                     | **Level** |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| ```host.hostname``` | Hostname of the host.     It normally contains what the ```hostname``` command returns on the host machine.     type: ```keyword```                                                                                 | core      |
| ```host.name```     | Name of the host.      It can contain what ```hostname``` returns on Unix systems, the fully qualified domain name, or a name specified by the user. The sender decides which value to use.     type: ```keyword``` | core      |
| ```host.uptime```   | Seconds the host has been up.      type: ```long```      example: ```1325```                                                                                                                                        | extended  |

:::info
All these fields are **indexed**.
:::

#### [*HTTP*](https://www.elastic.co/guide/en/ecs/1.4/ecs-http.html)

| **Field**                                | **Description**                                                                                                                                                                                                                                                                                     | **Level** |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| ```http.request.body.bytes``` (**indexed**) | Size in bytes of the request body.      type: ```long```     example: ```887```                                                                                                                                                                                                                     | extended  |
| ```http.request.bytes``` (**indexed**) | Total size in bytes of the request (body and headers).     type: ```long```      example: ```1437```                                                                                                                                                                                                | extended  |
| ```http.request.method``` (**indexed**) | HTTP request method.      The field value must be normalized to lowercase for querying. See the documentation section "Implementing ECS".      type: ```keyword```      example: ```get```, ```post```, ```put```                                                                                   | extended  |
| ```http.request.referrer``` (**indexed**) | Referrer for this HTTP request.      type: ```keyword```     example: ```https://blog.example.com/```                                                                                                                                                                                               | extended  |
| ```http.request.userAgent.device.name``` | Name of the device.     type: ```keyword```      example: ```iPhone```                                                                                                                                                                                                                              | extended  |
| ```http.request.userAgent.name``` | Name of the user agent.      type: ```keyword```       example: ```Safari```                                                                                                                                                                                                                        | extended  |
| ```http.request.userAgent.original``` (**indexed**)   | Unparsed user_agent string.      type: ```keyword```        Multi-fields: ```http.request.userAgent.original.text``` (type: ```text```)      example: ```Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1``` | extended  |
| ```http.request.userAgent.version``` | Version of the user agent.      type: ```keyword```     example: ```12.0```.                                                                                                                                                                                                                        | extended  |
| ```http.response.body.bytes``` (**indexed**) | Size in bytes of the response body.     type: ```long```      example: ```887```                                                                                                                                                                                                                    | extended  |
| ```http.response.bytes``` (**indexed**) | Total size in bytes of the response (body and headers).      type: ```long```      example: ```1437```                                                                                                                                                                                              | extended  |
| ```http.response.status_code``` (**indexed**) | HTTP response status code.      type: ```long```     example: ```404```                                                                                                                                                                                                                             | extended  |
| ```http.version``` | HTTP version.      type: ```keyword```      example: ```1```                                                                                                                                                                                                                                        | extended  |

#### [*URL*](https://www.elastic.co/guide/en/ecs/1.4/ecs-url.html)

 | **Field**          | **Description**                                                                                                                                                                                                                                                                                                                                                                     | **Level** |
 | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
 | ```url.domain```   | Domain of the url, such as [www.elastic.com](https://www.elastic.co/).         In some cases a URL may refer to an IP and/or port directly, without a domain name.    In this case, the IP address would go to the ```domain``` field.          type: ```keyword```            example: ```www.elastic.co```                                                                        | extended  |
 | ```url.fragment``` | Portion of the url after the ```#```, such as "top".      The ```#``` is not part of the fragment.      type: ```keyword```                                                                                                                                                                                                                                                         | extended  |
 | ```url.full```     | If full URLs are important to your use case, they should be stored in ```url.full```, whether this field is reconstructed or present in the event source.      type: ```keyword```      Multi-fields: ```url.full.text``` (type: ```text```).      example: ```https://www.elastic.co:443/search?q=elasticsearch#top```                                                             | extended  |
 | ```url.path```     | Path of the request, such as "/search".      type: ```keyword```                                                                                                                                                                                                                                                                                                                    | extended  |
 | ```url.port```     | Port of the request, such as 443.      type: ```long```     example: ```443```                                                                                                                                                                                                                                                                                                      | extended  |
 | ```url.query```    | The query field describes the query string of the request, such as "q=elasticsearch".     The ```?``` is excluded from the query string. If a URL contains no ```?```, there is no query field. If there is a ```?``` but no query, the query field exists with an empty string. The ```exists``` query can be used to differentiate between the two cases.     type: ```keyword``` | extended  |
 | ```url.scheme```   | Scheme of the request, such as "https".      Note: The ```:``` is not part of the scheme.      type: ```keyword```      example: ```https```.                                                                                                                                                                                                                                       | extended  |

:::info
All these fields are **indexed**.
:::
