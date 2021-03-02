---
id: advanced
title: Advanced
sidebar_label: Advanced
---

If you need it, you can customize some configuration of the services used by Fast Data.

### Projections Changes

You can choose to use a collection you have already created in the CRUD section through advanced configuration.  

In order to do that, your collection is supposed to have the following fields (apart from the default ones):

```json
[
    {"name":"type","type":"string","required":false,"nullable":false},
    {"name":"changes","type":"Array_RawObject","required":false,"nullable":false},
    {"name":"identifier","type":"RawObject","required":true,"nullable":false},
    {"name":"doneAt","type":"Date","required":false,"nullable":false}
]
```

You also need to have the following additional indexes:

Add an index with *name* `type_change_state`, *type* `normal`, *unique* `false`.  
You need to add the following index fields:

- *name* `type`, *order* `ASCENDENT`
- *name* `changes.state`, *order* `ASCENDENT`

Add another index with *name* `type_identifier`, *type* `normal`, *unique* `true`.  
You need to add the following index fields:

- *name* `type`, *order* `ASCENDENT`
- *name* `identifier`, *order* `ASCENDENT`

After that, you need to set your collection as the one to be used by the Real-Time Updater. To do that, go to the `Advanced` section of the `Design` area in Console, open `fast-data` from menù and open the `projections.json` file.
Here, you should write a configuration object:

```json
{
    "projectionsChangesCollectionName": "my-custom-projections-changes-collection-name"
}
```

Doing this, **all** the Systems of Records services will write changes into the collection with the name you set.

### Kafka configuration

As default all the Systems of Records services will use the same Kafka Group Id, Sasl Username e Password that you have set in the [Envs section](./set_up_fast_data#set-up-environment-variables).  
If you need tu customize these variables for some Systems of Record, you can do that going to the `Advanced` section of the `Design` area in Console. Open `fast-data` from menu and open the `projections.json` file and write a configuration such as the following:

```json
{
    "systems": {
        "my-system-id-1": {
            "kafka": {
                "groupId": "my-custom-group-id",
                "saslUsername": "{{MY_SASL_USERNAME}}",
                "saslPassword": "{{MY_SASL_PASSWORD}}",
                "saslMechanism": "plain"
            }
        }
    }
}
```

:::info
`kafka.saslMechanism` defines the authentication mechanism used to interact with Kafka, the accepted values are: plain, scram-sha-256 or scram-sha-512.
:::

`my-system-id-1` is the name of the system which you want to customize the kafka configuration. System not specified in this file will use the default values.

:::warning
You should not set write username and password as plain text in advanced files. Use always interpolation and set them in [Envs section](../development_suite/set-up-infrastructure/env-var).
:::
