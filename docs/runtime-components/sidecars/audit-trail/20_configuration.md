---
id: configuration
title: Configuration
sidebar_label: Configuration
---



To setup the architecture described previously, you need to configure the following components:

- the Audit Trail sidecar;
- a [Kafka][kafka] cluster;
- the [Kafka2Rest][kafka2rest] service;
- the [CRUD Service][crud-service];
- a [MongoDB][mongodb] server.

## Sidecar

The `Audit Trail` sidecar is available in the marketplace and can be attached to any microservice in your project.

The only requirement for the sidecar to work is to [share a volume][k8s-shared-volume] with the main application container, so that logs are written to a shared log file, which is read by the sidecar to filter the audit logs based on their log level, enrich them with additional metadata and sends them to the Kafka topic.

To configure your sidecar and starts collecting the audit logs, you must:

1. Attach the sidecar to the microservice (see the [official documentation][console-managing-sidecars])
2. [Add a shared volume](#shared-volume)
3. Configure the sidecar [environmental variables](#environment-variables)

### Shared volume

Once you have attached a sidecar to your microservice, you have two options:

- customize your project configuration with [Kustomize][console-kustomize];
- customize the service deployment file using [Console Raw Manifest configuration][console-service-raw-manifest-configuration].

#### Customize with Kustomize

Open the GitLab repository containing your Console project configuration and perform the following steps for each project environment you want to make the changes:

1. Create a new YAML file with an arbitrary name - e.g. `patch.yaml` - under `overlays/<environment>`

2. Open the `overlays/<environment>/kustomization.yaml` file and add a new entry in the `patches` section, specifying the name of your microservice under `target/name` and the name of the file created at the previous step under `path`:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
patches:
  - target:
      kind: Deployment
      name: <service-name>
    path: patch.yaml
```  

4. In the `patch.yaml` file, add a new shared volume 

```yaml
- op: add
  path: /spec/template/spec/volumes/-
  value:
    name: logs
    emptyDir: {}
```

4. In the `patch.yaml` file, attach to each container the shared volume ensuring the `name` property matches the name you chose for the shared volume defined previously.

```yaml
# Let's assume the first container listed under `spec/template/spec/containers` in the deployment file is the main application container
- op: add 
  path: "/spec/template/spec/containers/0/volumeMounts/-" 
  value:
    mountPath: "/logs/"
    name: "logs"

# Let's assume the second container listed under `spec/template/spec/containers` in the deployment file is the sidecar container
- op: add 
  path: "/spec/template/spec/containers/1/volumeMounts/-" 
  value:
    mountPath: "/logs/"
    name: "logs"
```

5. In the `patch.yaml` file, override the service Dockerfile command to send logs both to standard output and to the file specified in the sidecar `LOG_FILE_PATH` environment variable.

```yaml
# Let's assume the first container listed under `spec/template/spec/containers` in the deployment file is the main application container
- op: add 
  path: "/spec/template/spec/containers/0/command" 
  value: ["/bin/sh", "-c"]
  args: ["node ./dist/index.js | tee /logs/application.log"]
```

6. From the Console, set the `LOG_FILE_PATH` environment variable of the sidecar with the absolute path of the log file, in the example `/logs/application.log`.

#### Customize with Console Raw Manifest

After enabling the [Raw Manifest configuration][console-service-raw-manifest-configuration] on your service, you should be able to edit the deployment file, called `configuration/<service-name>.deployment.yml`.

1. Under `spec/template/spec/volumes`, add a new shared volume.

```yml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      volumes:
      - name: logs
        emptyDir: {}
``` 

2. Attach to each container listed under `spec/template/spec/containers` the shared volume, ensuring the `name` property matches the name you chose for the shared volume defined previously.

```yml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: your-service
          image: ...
          volumeMounts:
          - name: logs
            mountPath: /logs/
        - name: audit-trail
          image: nexus.mia-platform.eu/mia-care/plugins/audit-trail:1.0.0
          volumeMounts:
          - name: logs
            mountPath: /logs/
      volumes:
      - name: logs
        emptyDir: {}
```

3. Set the `LOG_FILE_PATH` environment variable to the absolute path of a file located inside the mount patch (`/logs/` in our example); you can choose any name we want for the file, like `application.log`.

```yml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: your-service
          image: ...
          volumeMounts:
          - name: logs
            mountPath: /logs/
        - name: audit-trail
          image: nexus.mia-platform.eu/mia-care/plugins/audit-trail:1.0.0
          volumeMounts:
          - name: logs
            mountPath: /logs/
          env:
            - name: LOG_FILE_PATH
              value: /logs/application.log
      volumes:
      - name: logs
        emptyDir: {}
```

1. Ensure your service sends logs both to standard output and to the file specified in the sidecar `LOG_FILE_PATH` environment variable. You can simply change the Dockerfile default command (`CMD`) to sends it output to both the standard output (as by default) and the log file using `tee`. If you cannot edit the Dockerfile directly, for example because you are using a marketplace plugin, you can simply override the Dockerfile default command in the [microservice configuration `args` field][console-microservices-args].  

### Environment variables

To configure the sidecar you must set the following environment variables.
The required environment variables are highlighted in **bold**.
We strongly recommend using secrets to load sensitive information (like Kafka credentials and brokers address) into environment variables.

| Name                         | Required | Default | Version | Description                                                                                |
|------------------------------|----------|---------|---------|--------------------------------------------------------------------------------------------|
| AUDIT_TRAIL_LOG_LEVEL        | No       | 1100    | *       | The log level associated to audit logs.                                                    |
| **KAFKA_BROKERS**            | Yes      | -       | *       | A comma-separated list of Kafka brokers address.                                           |
| **KAFKA_CLIENT_ID**          | Yes      | -       | *       | The Kafka client ID, for example the identifier of the service the sidecar is attached to. |
| KAFKA_TOPIC                  |          | -       | *       | Name of the Kafka topic to send audit logs to.                                             |
| KAFKA_AUTH_MECHANISM         |          | PLAIN   | *       | Authentication mechanism, used only if `KAFKA_USERNAME` and `KAFKA_PASSWORD` are set.      |
| KAFKA_USERNAME               |          | -       | *       | Username of the Kafka credentials.                                                         |
| KAFKA_PASSWORD               |          | -       | *       | Password of the Kafka credentials                                                          |
| KAFKA_CONNECTION_TIMEOUT     | No       | 1000    | *       | Time in milliseconds to wait for a successful connection.                                  |
| KAFKA_AUTHENTICATION_TIMEOUT | No       | 10000   | *       | Time in milliseconds to wait for a successful authentication.                              |
| **LOG_FILE_PATH**            | Yes      | -       | *       | Absolute path of the log file inside the shared volume.                                    |
| **LOG_LEVEL**                | Yes      | -       | *       | Logging level for the sidecar.                                                             |


:::danger

When configuring your microservice, be careful to set a log level that is lower or equal than the `AUDIT_TRAIL_LOG_LEVEL`, otherwise the audit logs will be suppressed by the logger. 

:::

## Kafka

To collect the logs you just need to create a dedicated topic in a Kafka cluster.

After creating a new topic, you should configure the retention period, taking into account the amount of audit logs generated by the systems. When choosing the retention period, you need to find a balance between the availability of logs for later processing, accounting for the unavailability of the downstream services ([Kafka2Rest][kafka2rest] and the [CRUD Service][crud-service]), and the amount of logs generated by your services, which can vary between environments depending on the level of traffic and the configured log level.

A log will appear in Kafka as a message with a payload looking like this:

```json
{
  "version": "1.0.0",
  "timestamp": "2024-04-30T09:12:06.095Z",
  "checksum": {
    "algorithm": "sha512",
    "value": "e474e95adfb31ef4cac7d992732a43d65e3313c852bd5e318dd84087b39ab62b19ff4c5590a6d5d5055ee5e3669c384c55eff0f36fe090205bd67d92d4aa9381"
  },
  "metadata": {
    "level": 1100,
    "msg": "Hello World Audit Log",
    "event": "MiaCare/HelloWorld/v1",
    "severity": "INFO"
  },
  "message": "Hello World Audit Log",
  "rawLog": "{\"level\":1100,\"msg\":\"Hello World Audit Log\", ...}"
}
```

The audit logs are enriched with several fields before being sent from the sidecar to the Kafka topic:

- `version`: the version of the audit logs reference schema;
- `timestamp`: when the audit log was recorded ;
- `checksum`: this checksum is generated automatically from the original log (available in the `rawLog` field);
- `metadata`: this field contains all the log fields, including the ones passed as first argument to the logger;
- `message`: this field contains the original log message (currently the message must be in the log `msg` field);
- `rawLog`: the original log, as emitted by the application logger.

For more details, check the [data model overview][overview-data-model].

:::tip

If you need to record when the even occurred, you should pass it explicitly as field of the object passed as first argument to the logger, so it's recorded in the metadata and available later for querying.   

:::

## Kafka2Rest

The [Kafka2Rest][kafka2rest] service should authenticate with Kafka using [SASL/SCRAM][kafka-sasl-scram] with Transport Layer Security (TLS) in combination with dedicated credentials, that have exclusive access to the topic.

You can also configure a [validator processor][kafka2rest-validator-processor], to performs additional filtering on the audit logs, and a [body processor][kafka2rest-body-processor], to manipulate the audit log before sending it as payload of the POST to the [CRUD Service][crud-service].

## CRUD Service

The [CRUD Service][crud-service] should connect to MongoDB using dedicated credentials, which only allow insert or read operations, and must not be exposed.

You must create a CRUD collection with the custom fields described in the following table or you can easily import the fields from <a download target="_blank" href="/docs_files_to_download/audit-trail/audit_logs.json">this JSON file</a>

| Name        | Type      | Required | Nullable |
|-------------|-----------|----------|----------|
| `version`   | String    | No       | No       |
| `timestamp` | Date      | No       | No       |
| `metadata`  | RawObject | No       | No       |
| `checksum`  | RawObject | No       | No       |
| `message`   | String    | No       | No       |
| `rawLog`    | String    | No       | No       |

## Performance tuning

After you have setup all the components of the architecture, you need to estimate the amount of logs generated by your microservices and appropriately scale your infrastructure.

Once you have established you overall performance requirements, in terms of expected incoming traffic and amount of generated logs by each service, you should carry a load test to assign the proper resources to each component, starting with the sidecar, which has to read all the logs of the main application container, filter the audit logs and forward them to Kafka.

We recommend starting with vertical scaling, trying to assign more CPU resources to process incoming logs faster, and eventually resolve to scale horizontally with multiple replicas of the service.
According to our internal benchmarks, a sidecar with the following resources should be able process around 1000 logs/second:

| Service      | Version | CPU (req/lim) | RAM (req/lim) |
|--------------|---------|---------------|---------------|
| CRUD Service | 5.4.2   | 150/300       | 100/150       |
| Kafka2Rest   | 1.1.1   | 150/300       | 50/100        |
| Sidecar      | 1.0.0   | 150/300       | 50/100        |

Then you can focus on scaling appropriately the [Kafka2Rest][kafka2rest] and [CRUD Service][crud-service] services.

Starting with [Kafka2Rest][kafka2rest], you can use a conservative configuration, since logs forwarded to the Kafka topic can be processed asynchronously. If you opt for multiple replicas, for optimal performance you should configure the topic to have the same number of partitions, so each [Kafka2Rest][kafka2rest] replica can parallelize work processing logs from different partitions. 

Finally, you can look at the [CRUD Service][crud-service] and scale it to "match" the amount of requests generated by [Kafka2Rest][kafka2rest].
We expect that, in most cases, the default configuration will work fine.
For additional information and guidance, take a look at the [CRUD Service performance documentation][crud-service-performance].


[kafka]: https://kafka.apache.org/
[k8s-shared-volume]: https://kubernetes.io/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/
[kafka-sasl-scram]: https://docs.confluent.io/platform/current/kafka/authentication_sasl/authentication_sasl_scram.html
[mongodb]: https://www.mongodb.com

[console-kustomize]: /products/console/project-configuration/kustomize-your-configurations/index.md
[console-service-raw-manifest-configuration]: /products/console/api-console/api-design/services.md#raw-manifest-configuration
[console-managing-sidecars]: /products/console/design-your-projects/sidecars.md
[console-microservices-args]: /products/console/api-console/api-design/services.md#microservice-configuration
[crud-service]: /runtime-components/plugins/crud-service/10_overview_and_usage.md
[crud-service-performance]: /runtime-components/plugins/crud-service/40_performance_overview.md
[kafka2rest]: /runtime-components/plugins/crud-service/10_overview_and_usage.md
[kafka2rest-body-processor]: /runtime-components/plugins/kafka2rest-service/02_configuration.md#body-processors
[kafka2rest-validator-processor]: /runtime-components/plugins/kafka2rest-service/02_configuration.md#validator-processors

[overview-data-model]: /runtime-components/sidecars/audit-trail/10_overview.md#data-model
