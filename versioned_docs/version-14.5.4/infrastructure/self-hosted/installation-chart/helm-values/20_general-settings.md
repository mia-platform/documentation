---
id: general-settings
title: General Settings
sidebar_label: General Settings
---



This document describes the required values that you will have to configure to work properly.

:::info
More specific configurations, such as those for the [Authentication Providers](/infrastructure/self-hosted/installation-chart/helm-values/25_authentication-provider.md), [Client-Side Database Encryption](/infrastructure/self-hosted/installation-chart/helm-values/40_mongodb-configurations-and-encryption.md), [File Storage](/infrastructure/self-hosted/installation-chart/helm-values/50_file-storage.md) and [Email Connectivity](/infrastructure/self-hosted/installation-chart/helm-values/60_email-setup.md) are described in separate documents.

If you want to fine tune resources for specific services the proper documentation can be found in [this page](/infrastructure/self-hosted/installation-chart/helm-values/30_service-specific-configurations.md).
:::

## Runtime, Storage and Networking configurations

### General configurations

|            Name            |  Type   |          Description           | Default | Optional |
| :------------------------: | :-----: | :----------------------------: | :-----: | :------: |
|     `configurations.consoleUrl`     | string |                                                       The URL where the console will be exposed                                                       |         |    ❌     |
|       `configurations.cmsUrl`       | string |                                                     The URL where the console CMS will be exposed                                                     |         |    ❌     |

### Docker and runtime specific configurations

|            Name            |  Type   |          Description           | Default | Optional |
| :------------------------: | :-----: | :----------------------------: | :-----: | :------: |
|      `imageCredentials`     |  [pull secret credentials](#pull-secret-credentials) | An object to generate the image pull secrets |         |    ✅    |
|      `imagePullSecrets`     |  array  | An array of `imagePullSecrets`               |  `[]`   |    ✅    |
| `defaultPodSecurityContext` | [pod security context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) | Override all the default pod security context per each workload with custom configuration | `{"runAsNonRoot": true, "runAsUser": 10000, "runAsGroup": 11000, "fsGroup": 12000}` |    ✅    |
| `useCDN` | boolean | Enable the use of a CDN for the static assets |   `true`   |    ✅     |

#### Pull secret credentials

|            Name            |  Type   |          Description           | Default | Optional |
| :------------------------: | :-----: | :----------------------------: | :-----: | :------: |
|     `registry`     |  string  |  The host of the registry where to pull the images, useful when you want to download images from a proxy registry |  `nexus.mia-platform.eu`  |    ✅    |

|     `name`     |  string  | name of the generated image pull secrets. It will be set as imagePullSecret in all the charts workload |  |    ✅    |
|     `username`     |  string  | Username to login to the container registry |  |    ✅    |
|     `password`     |  string  | Password to login to the container registry |  |    ✅    |
|      `email`       |  string  | Email of the user of the container registry |  |    ✅    |

### Storage connection configurations

#### Required

|                Name                 |  Type  |                                                                      Description                                                                      | Default | Optional |
| :---------------------------------: | :----: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :------: |
| `configurations.repositoryHostname` | string |                                The hostname of the docker repository where the services docker image will be uploaded                                 |         |    ❌     |
|     `configurations.mongodbUrl`     | string | The connection url to a mongodb server or cluster, more info can be found [here](/infrastructure/self-hosted/installation-chart/helm-values/40_mongodb-configurations-and-encryption.md#mongodb-configuration) |         |    ❌     |
|   `configurations.redis.hosts`   | array | An array of the hosts of a redis instance |  | ❌ |

#### Optional

|              Name              |  Type  |                     Description                     |                Default                 | Optional |
| :----------------------------: | :----: | :-------------------------------------------------: | :------------------------------------: | :------: |
| `configurations.redis.username` | string | The username used for redis instance authentication |  |    ✅     |
| `configurations.redis.password` | string |        The password used for redis instance         |  |    ✅     |
| `configurations.redis.tls` | boolean | tls connection to redis enabled | false |    ✅     |
| `configurations.redis.tlsCACert` | string | CA for the TLS configuration to connect to the redis instance. This is effective only if `configurations.redis.tls` set to `true`. |  |    ✅     |
| `configurations.redis.mode` | string | Configure the redis mode. Supported mode are `normal` and `sentinel` | normal |    ✅     |
| `configurations.redis.masterName` | string | redis master name. It only works used with `sentinel` mode |  |    ✅     |

### Self-Signed CA Bundles

If your Self-Hosted Console needs to interact with third party servers (e.g. MongoDB) with a self signed certificate you can provide the certification authority key material with the `additionalCABundle` configuration.

## Service account management configuration

Mia-Platform Console allows user to create custom Service Accounts to perform m2m authentication; to be able to properly sign service account session the Console requires a few specific configuration to be set with the `configurations.serviceAccountAuthProvider` key.

|         Name          |  Type  |                                Description                                 | Default | Optional |
| :-------------------: | :----: | :------------------------------------------------------------------------: | :-----: | :------: |
| `rsaPrivateKeyBase64` | string | Private key material for service account token signature encoded in Base64 |         |    ❌     |
|   `rsaPrivateKeyId`   | string |                           ID of the private key                            |         |    ❌     |
|  `rsaPrivateKeyPass`  | string |                        Password for the private key                        |         |    ❌     |
|    `clientIdSalt`     | string |                             salt for client id                             |         |    ❌     |
|    `jwtExpiresIn`     | string |          seconds defining the service account jwt expiration time          | `3600`  |    ✅     |

### How to generate secret values

For any doubt check out the [Client Credentials guide](/runtime-components/plugins/client-credentials/30_jwt_keys.md) which provides useful examples.

* `rsaPrivateKeyBase64`:
  * `ssh-keygen -t rsa -b 4096 -m PEM -f private.key`
  * digit your passphrase (it is required for `rsaPrivateKeyPass`)
    * to generate the password we recommend using `openssl rand -hex 128`
  * encode the private key in base64 (`cat <PRIVATE_KEY> | base64`)
* `rsaPrivateKeyId`: `openssl rand -hex 24`
* `rsaPrivateKeyPass`: the passphrase you used during private key generation
* `clientIdSalt`: `openssl rand -hex 256`

## Generated Service specific resource configuration

To fine tune resources configurations for services directly generated from Mia-Platform Console you can tune the following configurations under the `configurations.defaultCoreResources` key:

|     Name      |  Type  |                            Description                             |                        Default                        | Optional |
| :-----------: | :----: | :----------------------------------------------------------------: | :---------------------------------------------------: | :------: |
| `apiGateway`  | object | The default RAM request and limit for API Gateway inside projects  |  `{ memoryLimitMin: "5Mi", memoryLimitMax: "25Mi" }`  |    ❌     |
| `crudService` | object | The default RAM request and limit for CRUD Service inside projects | `{ memoryLimitMin: "70Mi", memoryLimitMax: "250Mi" }` |    ❌     |

### Examples

```yaml
mia-console:
  configurations:
    ...
    defaultCoreResources:
      apiGateway:
        memoryLimitMin: "100Mi"
        memoryLimitMax: "300Mi"
```

## Audit Logs configuration

From Console v13.7.0, you can configure where the Audit logs for the user activities performed in the application are stored.

The best practices for Audit Logs management advise to store audit trails in a different database.
For this reason, you can control a different connection string to be used to store audit trails with the `configurations.audit` key:

|                      Name                      |  Type   | Description |             Default             | Optional |
| :--------------------------------------------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------: | :------: |
|                 `mongodbUrl`                 | string  |A valid MongoDB url in the form of mongodb:// or mongo+srv:// that is going to be used to store audit in a different database from the application.                                                                                                                                                               |                                 |         |

## Additional optional configurations

|                      Name                      |  Type   | Description |             Default             | Optional |
| :--------------------------------------------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------: | :------: |
|                 `nameOverride`                 | string  |Set up a value if you don’t want to use `mia-console`                                                                                                                                                                  |                                 |    ✅     |
|               `fullnameOverride`               | string  |                                                                                                                                             Set up a value if you want to set a fixed name for the release and not using the generated one                                                                                                                                             |                                 |    ✅     |
|                   `logLevel`                   | string  |                                                                                                                                                                                 The log level to setup                                                                                                                                                                                 |             `info`              |    ✅     |
|    `configurations.multitinenantNamespace`     | string  |                                                                                                                                                                            The multitenant partial hostname                                                                                                                                                                            | `multitenant.svc.cluster.local` |    ✅     |
| `configurations.customServicesImagePullSecret` | string  |                                                                                                      The name of the `imagePullSecret` containing the credentials to the private docker repository (_deprecated_, we reccomend to use `configurations.servicesImagePullSecrets`)                                                                                                       |                                 |    ✅     |
|   `configurations.servicesImagePullSecrets`    |  array  | The names of `imagePullSecret` containing the credentials to the private docker repositories that will be used to pull the images of all services of the projects, this key take precendence over `configurations.customServicesImagePullSecret`. You have to specify the secrets for both your own services and the ones handled by Console (e.g. cms-backend, crud-service, ecc...). |       `["nexus-gcloud"]`        |    ✅     |
|   `configurations.publicVariablesFolderName`   | string  |                                                                                                                                                          The name of the folder in which all public variables will be stored                                                                                                                                                           |                                 |    ✅     |
|  `configurations.deployServiceJenkinsRetryMs`  | integer |                                                                                                                                                    Controls Deploy Service Jenkins retries if no build is found (minimum value: 1)                                                                                                                                                     |                                 |    ✅     |
|  `configurations.configurationsCleaner.maxConfigurationsRetentionNumber`  | integer | Max number of configurations per ref to be preserved (default 100, set to 0 to disable history cleanup)                                                                                                                                                   |                100                 |    ✅     |
|  `configurations.configurationsCleaner.schedule`  | crontab |  Cleaner crontab schedule     |                   `0 8 * * *`              |    ✅     |

### Optional Feature Toggle configurations

|                           Name                           |  Type   |                                                                      Description                                                                      | Default | Optional |
| :------------------------------------------------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :------: |
| `configurations.enableFastData` | boolean | Enables Fast Data configurator | `true`  |    ✅     |
| `configurations.enableDebugArea` | boolean | Enables debug area in Console | `true`  |    ✅     |
| `configurations.enableMergeConfiguration` | boolean | Enables Merge Configuration | `true`  |    ✅     |
| `configurations.projectTemplateArchiveUrl` | string | New project template url |         |    ✅     |
|      `configurations.enableBackofficeConfigurator`       | boolean |                                                            Enable Backoffice Configurator                                                             | `true`  |    ✅     |
|            `configurations.enableFlowManager`            | boolean |                                                                  Enable Flow Manager                                                                  | `true`  |    ✅     |

### Optional telemetry configurations

|                    Name                    |  Type   |                                                Description                                                | Default | Optional |
| :----------------------------------------: | :-----: | :-------------------------------------------------------------------------------------------------------: | :-----: | :------: |
|  `configurations.enablePrometheusMetrics`  | boolean |       enable prometheus to collect metrics. This is a beta feature and could have breaking changes.       | `false` |    ✅     |
| `configurations.telemetry.tracing.enabled` | boolean | enable opentelemetry to collect tracing. This is an experimental feature and could have breaking changes. | `false` |    ✅     |
| `configurations.telemetry.tracing.address` | string  |            opentelemetry server address. At the moment, it is only supported a zipkin server.             | `false` |    ✅     |
|  `configurations.telemetry.tracing.port`   | number  |              opentelemetry server port. At the moment, it is only supported a zipkin server.              | `false` |    ✅     |
