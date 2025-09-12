---
id: configuration
title: Configuration
sidebar_label: Configuration
---



Due to licensing _Data Catalog Agent_ requires packaging with third-party software, unless your datasources are PostgreSQL databases whose support is already included in the docker image of _Data Catalog Agent_.

In case only PostgreSQL is needed you can skip to the [cronjob configuration](#cronjob-configuration) section.

## Datasource support

Mia's _Data Catalog_ marketplace item upon creation, creates also a git repository containing:

1. a CI config file
2. a docker `Dockerfile`

the `Dockerfile` provides several build steps to include the datasource support you need. Supported datasources are:

- Oracle Database from 11 to 21
- PostgreSQL from 9.6 to 16
- Mysql from 5.7 to 8.2
- Mssql from 2017 to 2022

Upon inspection you'll notice that the `Dockerfile` contains targets for each database:

```Dockerfile
FROM ... AS data-catalog-agent-oracle

# rest of the file

FROM ... AS data-catalog-agent-mysql

# and so on...
```

Each push on the default branch or any tag starting with `v` will create a new docker image including the selected support. The default support is `postgres` but it can be changed:

1. by editing the `.gitlab-ci.yml` file overriding the initial value of the `DOCKER_TARGET` from `postgres` to the database you need to support
2. one-of change upon manually triggering the CI overriding the same variable `DOCKER_TARGET`

Your repository contains a `README.md` file which also contains a lists of operations needed to include drivers for `oracle`, `mysql`, `mssql` databases.

### Oracle Database: add support

**In the template repository**, to enable Oracle Database support actions are needed:

1. edit the value of `DOCKER_TARGET` variable in `.gitlab-ci.yml` to `oracle` or alternatively select it on manual run
2. embed oracle drivers (see [embed drivers](#embed-drivers))
3. [optional] add `tnsnames.ora` and/or `Oracle Wallet` (see [add tns/wallet](#add-tns-support)).

#### Embed drivers

**In the template repository**, download drivers from the [official page](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html) according with the version you need.

The following assets are needed:

1. ODBC driver
2. instantclient basiclite

```shell
# on unix
export ORACLE_CLIENT_VERSION="<VERSION>"
unzip -j instantclient-basiclite-linux.x64-${ORACLE_CLIENT_VERSION}dbru.zip "instantclient_*/lib*" -d lib/x86_64-unknown-linux-gnu/oracle
unzip -j instantclient-odbc-linux.x64-${ORACLE_CLIENT_VERSION}dbru.zip "instantclient_*/lib*" -d lib/x86_64-unknown-linux-gnu/oracle
```

create a symlink

```shell
export LIBSQORA_NAME=`ls lib/x86_64-unknown-linux-gnu/oracle | grep -E -i '^libsqora\.so\.'`
ln -s "${LIBSQORA_NAME}" lib/x86_64-unknown-linux-gnu/oracle/libsqora.so
```

#### Add TNS support

Oracle connectivity can be handled with `tnsnames.ora` files and/or wallets. The container expects such assets in the `/home/agent/oracle/admin` folder. The `TNS_ADMIN` is already set to `/home/agent/oracle/admin` and the container will copy the content of the `oracle/admin` folder in this repository.

Drop your wallet assets or `tnsnames.ora` file in `oracle/admin` to include them.

In case you want to use a wallet remind to [tune] the `sqlora.net` file registering the `/home/agent/oracle/admin` path:

> WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/home/agent/oracle/admin")))
> SSL_SERVER_DN_MATCH=yes

### MySQL: add support

**In the template repository**, ODBC driver for MySQL must be downloaded from the [official website](https://dev.mysql.com/downloads/connector/odbc/)
selecting:

1. version `8.3.0`
2. OS `Linux - Generic`
3. OS version `glibc 2.28 x86_64`

then run:

```shell
export MYSQL_NAME=mysql-connector-odbc-8.3.0-linux-glibc2.28-x86-64bit
tar -xvf ${MYSQL_NAME}.tar.gz ${MYSQL_NAME}/lib/libmyodbc8w.so
mv ${MYSQL_NAME}/lib/* lib/x86_64-unknown-linux-gnu/mysql
```

### MS SQL Server: add support

No further actions beside editing `.gitlab-ci.yml` are required.

### Mia CRUD Service: add support

By default, running the CI of this project produces an artifact with Mia CRUD Service support since it does not require any specific drivers.

### Salesforce SObjects API: add support

By default, running the CI of this project produces an artifact with Salesforce SObjects support since it does not require any specific drivers.

## Cronjob Configuration

From your project select `CronJobs` > `Create new CronJob`, insert a unique name for the job, an optional description, the full name of the docker image created by your CI job. It will come in the form `<URL TO REGISTRY>/data-catalog/agent:<TAG>`. Also insert a `CronJob schedule` using the [k8s syntax](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#writing-a-cronjob-spec).

By clicking on create, you need to configure:

1. the config map containing the configuration of the _Data Catalog Agent_
2. the cronjob yaml file

Create a new config map giving it a name of your choice (e.g., `data-catalog-agent-configuration`) and mount path `/home/agent/.config/dc/agent/`. We can now add it to the `CronJob` yaml manifest.

The prompted yaml for the `CronJob` should be edited as follows:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  ...
spec:
  ...
  jobTemplate:
    spec:
      ...
      template:
        ...
        spec:
          ...
          containers:
            containers:
            - name: ...
              ...
              env:
              - name: TNS_ADMIN # not required if it defaults to /home/agent/oracle/admin or no oracle support is needed
                value: /path/to/tns/admin/folder
              args: ["scan"] # add args here
              volumeMounts:
                - name: data-catalog-agent-configuration # reference a volume mount
                  mountPath: /home/agent/.config/dc/agent/
          volumes:
            - name: data-catalog-agent-configuration # use the name given to the config map
              configMap:
                name: data-catalog-agent-configuration
```

Now create a new file in the config map called `configuration.json`. This file must be a valid _Data Catalog Agent_ <a download target="_blank" href="/docs_files_to_download/data-catalog-agent/configuration.schema.json">configuration</a>.

## Data Catalog Agent Configuration

:::caution
The configuration is read from a file which must be located ad `~/.config/dc/agent/configuration.json` where `~` is the user's home folder (`$HOME`). Such location can be overridden via the environment variable `DC_AGENT_CONFIGURATION_FILEPATH` which must contain a filepath to a valid configuration file.
:::

The configuration has the following main sections:

1. connections
2. target

```json
{
  "connections": {
    ...
  },
  "target": {
    ...
  }
}
```

Secretable fields are marked in the following sections.

## Connections

A list of entries to connect to datasources via supported integration methods. The general recipe is:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "<INTEGRATION_METHOD>",
      "configuration": {
        // depends on the integration method
      },
      "settings": {
        // depends on the integration method
      }
    }
  }
}
```

Available integration methods are:

- [`odbc`](https://en.wikipedia.org/wiki/Open_Database_Connectivity)
- `http`

Such drivers come often in the form of a [`dynamic shared object`](https://en.wikipedia.org/wiki/Shared_library) and must be embedded with the binary and available at runtime (see the template repository README file).

A non-required object `settings` can be added to the connection configuration to define the following additional properties: 
  - `namespace`: string that overrides the default connection name;
  - `batchSize`: number that defines the number of tables that can be paginated in a odbc query. if not specified, 1000 tables for query will be retrieved.
  - `columnBatchSize`: number that defines the number of columns that are expected to be processed by each batch iteration. if not specified, 20 columns for batch will be used.

### PostgreSQL

To configure a **PostgreSQL** ODBC connection use:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {  // 👈 pick a name
      "type": "odbc",
      "configuration": {
        "vendor": "postgres",
        "params": {
          "uid": "test_user",
          "pwd": "password",
          "database": "<DATABASE_NAME>"
        }
      }
    }
  }
}
```

or use an inline ODBC connection string

```json
{
  "connections": {
    "<CONNECTION_NAME>": {  // 👈 pick a name
      "type": "odbc",
      "configuration": {
        "vendor": "postgres",
        "params": "DRIVER=postgres;SERVER=0.0.0.0;PORT=5432;DATABASE=db;UID=user;PWD=pwd;"
      }
    }
  }
}
```

Other keys are `host` and `port` which for a **PostgreSQL** connection are defaulted to `0.0.0.0` and `5432`. Any other configuration parameter can be appended using the key `flags` which must be a semicolon separated string.

#### Secretable fields

`uid`, `pwd` or `params` support [secrets resolution](/products/fast_data/configuration/secrets_resolution.md).

### Oracle

To configure an **Oracle** ODBC connection use:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {  // 👈 pick a name
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": {
          "uid": "test_user",
          "pwd": "password",
          "dbq": "<SERVICE_NAME>"
        }
      }
    }
  }
}
```

or use an inline ODBC connection string and also set the TNS_ADMIN environment variable
to access a `tnsnames.ora` file where the DBQ name can be resolved

```json
{
  "connections": {
    "<CONNECTION_NAME>": {  // 👈 pick a name
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": {
          "uid": "test_user",
          "pwd": "password",
          // 👇 this must be defined in your tnsnames.ora file
          "dbq": "DRIVER=oracle;UID=user;PWD=p4ssw0rd;DBQ=DATABASE_NAME"
        }
      }
    }
  }
}
```

`SERVICE_NAME` is an entry of your [`tnsnames.ora`](https://docs.oracle.com/en/database/oracle/oracle-database/18/netrf/local-naming-parameters-in-tnsnames-ora-file.html#GUID-12C94B15-2CE1-4B98-9D0C-8226A9DDF4CB) file. Such file **MUST** be available when running the binary and its location **MUST** be exported to an environment variable unless defaulted to `/home/agent/oracle/admin`.

in case you don't want to add the environment variable, the content of one entry of the `tnsnames.ora` file can be inlined such as:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": {
          ...,
          "dbq": "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=0.0.0.0)(PORT=5041))(CONN ..."
        }
      }
    }
  }
}
```

Other keys are:

- `version` which can be neglected **UNLESS USING ORACLE 11g** since it [does not support](https://docs.oracle.com/database/121/LNPLS/release_changes.htm#LNPLS113) pagination via `OFFSET ? ROWS FETCH FIRST ? ROWS ONLY`.

  :::caution

  `version` MUST be explicit at `configuration` level.
  ```json
  {
    "type": "odbc",
    "configuration": {
      "vendor": "oracle",
      "version": 11,
      "params": { /** ... */ }
    }
  }
  ```
  :::

- `flags` which will be added, as a string, to the connection like `"flags": "DBA=R;"`, for the available flags check [oracle documentation: 25.4.1 Format of the Connection String](https://docs.oracle.com/en/database/oracle/oracle-database/21/adfns/odbc-driver.html#GUID-618B141E-DD46-4907-99C2-486E801CA878).

- `options` field for _oracle_ odbc configurations: this field defines the tables that will be used for retrieve the metadata.
  If not specified, `user` option will be used as default. Three options available:

  - `user`: tables `user_tables`, `user_views` and `user_mviews` will be used. No filter needs to be specified since they default to the user's schema.
    ```json
    {
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": { /** ... */ },
        "options": {
          "user"
        }
      }
    }
    ```
  - `all`: tables `all_tables`, `all_views` and `all_mviews` will be used. Optionally, a list of schemas needs to be provided in `owners` field to filter the desired schemas.
    ```json
    {
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": { /** ... */ },
        "options": {
          "all": {
            "owners": ["some_schema_name"]
          }
        }
      }
    }
    ```
  - `dba`: tables `dba_tables`, `dba_views` and `dba_mviews` will be used. Optionally, a list of schemas needs to be provided in `owners` field to filter the desired schemas.
    ```json
    {
      "type": "odbc",
      "configuration": {
        "vendor": "oracle",
        "params": { /** ... */ },
        "options": {
          "dba": {
            "owners": ["some_schema_name"]
          }
        }
      }
    }
    ```

    :::caution 

    In this case, remember that password needs to be written in the form of `<password> AS SYSDBA`.

    ::: 

Connection with an [oracle wallet](https://docs.oracle.com/en/database/oracle/oracle-database/19/dbimi/using-oracle-wallet-manager.html#GUID-D0AA8373-B0AC-4DD8-9FA9-403E345E5A71) is also [supported](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/connect-prepare-oci-wallets.html#GUID-EFAFA00E-54CC-47C7-8C71-E7868279EF3B):

Preparation must be done on the template repository:

1. The whole wallet content must be available under the same path of the `tnsnames.ora` (they usually come together)
2. The file `sqlora.net` inside the wallet must be updated to reflect the `TNS_ADMIN` path
   > WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/path/to/folder")))
   > SSL_SERVER_DN_MATCH=yes

Also the environment variable must be set:

1. The `TNS_ADMIN` environment variable must be set **explicitly** unless defaulted to `/home/agent/oracle/admin`

#### Secretable fields

`uid`, `pwd` or `params` support [secrets resolution](/products/fast_data/configuration/secrets_resolution.md).

### MS SQL server

To configure a **MS SQL Server** ODBC connection use:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "odbc",
      "configuration": {
        "vendor": "mssql",
        "params": {
          "uid": "test_user",
          "pwd": "password",
          "database": "<DATABASE_NAME>"
        }
      }
    }
  }
}
```

or use an inline ODBC connection string:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "odbc",
      "configuration": {
        "vendor": "mssql",
        "params": "Driver=mssql;Server=0.0.0.0,1433;Database=db;Uid=user;Pwd=p4ssw0rd;TrustServerCertificate=yes;"
      }
    }
  }
}
```

Other keys are `host` and `port` which for a **PostgreSQL** connection are defaulted to `0.0.0.0` and `1433`. Any [extra connection property](https://learn.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver16) can be added via the key `flags` which will be added, as a string, to the connection, as a semicolon separated string. It is quite useful, for local development purposes to add the flag `"TrustServerCertificate=yes"`.

#### Secretable fields

`uid`, `pwd` or `params` support [secrets resolution](/products/fast_data/configuration/secrets_resolution.md).

### MySQL

To configure a **MySQL** ODBC connection use:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "odbc",
      "configuration": {
        "vendor": "mysql",
        "params": {
          "uid": "test_user",
          "pwd": "password",
          "database": "<DATABASE_NAME>"
        }
      }
    }
  }
}
```

or use an inline ODBC connection string:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "odbc",
      "configuration": {
        "vendor": "mysql",
        "params": "DRIVER=mysql;SERVER=0.0.0.0;PORT=3306;DATABASE=db;UID=user;PWD=p4ssw0rd;"
      }
    }
  }
}
```

Other keys are `host` and `port` which for a **PostgreSQL** connection are defaulted to `0.0.0.0` and `3306`. Any [extra connection property](https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-configuration-connection-parameters.html) can be added via the key `flags` which will be added, as a string, to the connection, as a semicolon separated string.

#### Secretable fields

`uid`, `pwd` or `params` support [secrets resolution](/products/fast_data/configuration/secrets_resolution.md).

### Mia CRUD Service

To configure a **Mia CRUD Service** connection use:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "http",
      "configuration": {
        "vendor": "mia-crud-service",
        "params": {
          "baseUrl": "http://mia-crud-service:3000",
          "endpoint": "/-/schemas",
          "healthcheck": "/-/healthz",
          "headers": {
            "accept": "application/x-ndjson"
          }
        }
      }
    }
  }
}
```

The driver basically calls the `/-/schemas` URL to extract all the data models from MongoDB. Since the response is, of course, a JSON Schema, some information in the `ddl` object may be missing, like the `size` of the properties.

Additionally, the version of the CRUD Service is obtained from the `/-/healthz` endpoint.

In case custom `tls` parameters are required such as a custom root CA or an insecure HTTPS connection,
use the parameter `tls` with keys `insecure` and/or `certificate`:

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "http",
      "configuration": {
        ...,
        "params": {
          "tls": {
            "insecure": true
          }
        }
      }
    }
  }
}
```

or

```json
{
  "connections": {
    "<CONNECTION_NAME>": {
      "type": "http",
      "configuration": {
        ...,
        "params": {
          "tls": {
            "certificate": {
              "type": "file",
              "path": "/path/to/root/CA"
            }
          }
        }
      }
    }
  }
}
```

### Salesforce SObjects

To configure a **Salesforce SObjects** HTTP connection you can use two authentication methods:

* [jwt-bearer](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5):
  ```json
  {
    "connections": {
      "<CONNECTION_NAME>": {
        "type": "http",
        "configuration": {
          "vendor": "salesforce-sobjects",
          "params": {
            "authenticationFlow": "jwt-bearer",
            "baseUrl": "https://my-subdomain.my.salesforce.com",
            "clientId": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "privateKey": "/path/to/private-key/key.pem",
            "username": "my-user@email.com",
            "apiVersion": "59.0"
          }
        }
      }
    }
  }
  ```
* [username-password](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_username_password_flow.htm&type=5): (**deprecated**)
  ```json
  {
    "connections": {
      "<CONNECTION_NAME>": {
        "type": "http",
        "configuration": {
          "vendor": "salesforce-sobjects",
          "params": {
            "authenticationFlow": "username-password",
            "baseUrl": "https://my-subdomain.my.salesforce.com",
            "apiVersion": "31.0",
            "clientId": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "clientSecret": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "username": "my-user@email.com",
            "password": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
            "securityToken": "XXXXXXXXXXXXXXXXXXXXXXXXXX"
          }
        }
      }
    }
  }
  ```

> The range of supported `apiVersion` goes from `31.0` to `59.0` 

The driver uses the [Salesforce SObjects API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm) to retrieve the schema from all the `SObject`s you have. Make sure the user you configure has the right permissions to retrieve all the `SObject`s you need.

If not all the `SObjects` are retrieved you'll have to follow these steps to expose them through the API:

**For custom `SObjects`**

- Go to your Salesforce dashboard
- Access Setup
- Access the "Permission Sets" section
- Create a new Permission Set (e.g. API for Custom Objects) with license type "Salesforce API Integration"
- Click on "Object Settings" inside the new Permission Set, then, for each custom SObject, update the visibility in the desired way (e.g. View All, Modify All)
- Assign the new Permission Set to the user with "Salesforce Integration" user license and "Salesforce API Only System Integrations" profile

**For standard `SObjects`**

- Go to your Salesforce dashboard
- Access Setup
- Access the "Permission Sets" section
- Create a Permission Set (e.g. API for Standard Objects) without specifying a license type
- Click on "Object Settings" inside the new Permission Set, then, for each standard SObject, update the visibility in the desired way (e.g. View All, Modify All)
- Assign the new Permission Set to the user with "Salesforce Integration" user license and "Salesforce API Only System Integrations" profile

#### JWT Authorization

To be able to connect to the Salesforce API using the JWT Bearer flow you will need to follow the next steps.

1. Follow the steps one and two from this guide: https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5
2. Then you'll need to upload your self-signed certificate in PEM format (step 5 from the guide). If you don't have a certificate follow these instructions:
   1. Generate a rsa key with the command `openssl genrsa -out tls/key.pem`
   2. Then create a request to sign the certificate with this command `openssl req -new -key tls/key.pem -out tls/sf_connect.csr`
   3. Sign the request with you private key with `openssl x509 -signkey tls/key.pem -in tls/sf_connect.csr -req -out tls/sf_connect.crt`
   4. Upload the generated certificate (`tls/sf_connect.crt`)
3. Now you need to enable the OAuth2 mechanism following the 10th step from the guide, creating a connected app and all.
4. Finally you need to enable the JWT access with the step 14 of the guide.
   
Now you should have everything you need to fill out the configuration parameters. If you are using a testing instance you'll need to set the param `loginUrl` to `https://test.salesforce.com/`.

#### Secretable fields

`clientId`, `username`, `clientSecret`, `password`, `securityToken` or `privateKey` support [secrets resolution](/products/fast_data/configuration/secrets_resolution.md).

## Targets

There are 5 different targets available:

1. [**default**] `stdout`
2. `mia-open-lineage`
3. `mongodb`
4. `file`
5. `mia-console` (**deprecated**)

For each listed connection, after metadata is retrieved, `agent` **sequentially** sends data to the target as:

- `json` for `stdout` and `file`
- [`ndjson`](https://github.com/ndjson/ndjson-spec) for `mia-console`
- [`BSON`](https://bsonspec.org/) for `mongodb`
- an extended version of [Open Lineage](https://openlineage.io/), serialized according to the selected database type for `mia-open-lineage`

The final content is an `array` of models, where the format of its records changes accordingly to the target: 

- `stdout`, `file`, `mongodb` and `mia-console`: the models are written in the native agent format, which is defined in the following <a download target="_blank" href="/docs_files_to_download/data-catalog-agent/agent.model.schema.json">JSON schema</a>;
- `mia-open-lineage`: the models are written in a format that is supported by the [Data Catalog](/products/data_catalog/overview.mdx) application, as defined in the following <a download target="_blank" href="/docs_files_to_download/data-catalog-agent/catalog.model.schema.json">JSON schema</a>;

### Standard Output 

To explicitly configure the `stdout` target use:

```json
{
  ...,
  "target": {
    "type": "stdout"
  }
}
```

### Mia OpenLineage

The Mia OpenLineage target enables Data Catalog Agent to feed data from external sources to the [Data Catalog](/products/data_catalog/overview.mdx) application. This
target may write the extracted schemas into different data sources, depending on the configuration.

:::note
Currently, only MongoDB (v5+) is supported as `type` in configuration object of `mia-open-lineage` target.
:::

To configure the `mia-open-lineage` target use:

```json
{
  // ...
  "target": {
    "type": "mia-open-lineage",
    "configuration": {
      "type": "mongodb",
      "url": "mongodb://test:27017/?replicaSet=rs", // 👈 database connection string: in case of MongoDB, the database MUST be a replica set
      "database": "test_database", // 👈 if defined, it will be used as database where to store the models
      "collection": "open-lineage-datasets", // 👈 if defined, it will be used as collection where to store the models
    }
  }
}
```

The target will write the content of the connections to a MongoDB replica set database, in the collection selected or by default in the one named as `open-lineage-datasets`.
This collection must be same to the one configured for [`open-lineage` service](/products/data_catalog/data_catalog_open_lineage.mdx#datasets-persistence-layer). Therefore, it is
recommended to just configure the _connection string_ and the _database_ properties, leaving the _collection_ to its default value.

:::tip
To enforce document validation on datasets collection, please ensure that [Data Catalog Configuration Scripts](/products/data_catalog/database_setup.mdx) is run at least once before launching the agent.
:::

### MongoDB

The MongoDB target enables Data Catalog Agent to feed data from external sources directly into a MongoDB collection. 

To configure the `mongodb` target use:

```json
{
  // ...
  "target": {
    "type": "mongodb",
    "url": "mongodb://test:27017/?replicaSet=rs", // 👈 mongodb connection string: the database MUST be a replica set
    "database": "test_database", // 👈 if defined, it will be used as default database to store the models
    "collection": "agent_collection", // 👈 if defined, it will be used as default collection to store the models
  }
}
```

The target will write the content of the connections to a MongoDB replica set database, in the collection selected or by default in the one named as `open-lineage-datasets`.

### File

To configure the `file` target use:

```json
{
  ...,
  "target": {
    "type": "file"
  }
}
```

which will save output files in the folder `./output`. To override this use:

```json
{
  ...,
  "target": {
    "type": "file",
    "dir": "/path/to/dir"
  }
}
```

### Mia Console

:::caution
This target has been **deprecated** in favour of [`mia-open-lineage`](#mia-openlineage) to support [Data Catalog](/products/data_catalog/overview.mdx) solution.
:::

To configure the `mia-console` target use:

```json
{
  ...,
  "target": {
    "type": "mia-console",
    "baseUrl": "https://my-server-url", // 👈 mia console base url
    "projectId": "1234", // 👈 models are pushed towards the project with this id
    "apiKey": "1234", // 👈 mia console api key, may vary across test/preview/prod environments
    "credentials": {
      // machine to machine credentials
    }
  }
}
```

credentials are used to [obtain](https://mia-platform.eu/blog/client-credentials-m2m-authentication-oauth/) an access token. In order to do that you must provide:

```json
{
  ...,
  "target": {
    ...,
    "credentials": {
      "clientId": "1234",
      "clientKeyId": "123",
      "privateKey": {"type": "file", "path": "tls/key.pem"} // 👈 either a file system path or an rsa private key inlined with `\n`
    }
  }
}
```

on `type` `mia-console` the auth endpoint can be customized using `oauthTokenEndpoint`. The service endpoint hosted on `mia-console` can be overridden in 2 ways:

1. customizing the revision using the field `revision`
2. or customizing the overall url using the field `dataCatalogEndpoint`

#### Secretable fields

`clientId`, `clientKeyId`, or `privateKey` support secrets
