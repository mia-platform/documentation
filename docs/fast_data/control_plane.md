---
id: control_plane
title: Control Plane Configuration
sidebar_label: Control Plane
---

# Control Plane Documentation

## Overview

The **Control Plane** is a crucial component of the Mia Platform's Fast Data solution, designed to provide real-time management of microservices through a user-friendly web interface. This documentation aims to guide Mia Platform clients, primarily developers working in a microservices environment, in configuring and utilizing the Control Plane.

### Components

The Control Plane comprises two main parts:

1. **HTTP Controller:** A web server exposing a [json-rpc 2.0](https://www.jsonrpc.org/specification) compliant API. It enables clients to instruct the runtime to reach a desired state required by the API client.

2. **State Adapter:** Listens to commands invoked by the client through the `json-rpc` interface, compares parameters with the latest state, and patches the current persistence state with the next desired state. It also streams updates to the state channel pub/sub channel.

## Examples of Common Use Cases

One common use case involves the runtime control over the Single View Creator. When a user selects "pause" from the Control Plane's frontend, the Control Plane produces a Kafka message with the specific pause request. The same applies to a "resume" command. Any listeners that receive the Kafka message will apply the command only if it is addressed to them.

## Configuration

### Sample Configuration File

Here is an example of a configuration file for the Control Plane:

```json
{
  "runtimes": {
    "runtime-1": {
      "channels": {
        "state": {
          "type": "kafka",
          "configuration": {
            "bootstrap.servers": "{{KAFKA_BROKERS}}",
            "sasl.mechanism": "SCRAM-SHA-256",
            "sasl.password": "{{KAFKA_PASSWORD}}",
            "sasl.username": "{{KAFKA_USERNAME}}",
            "security.protocol": "SASL_SSL"
          },
          "producer": {
            "topic": "{{CONTROL_PLANE_ACTIONS_TOPIC}}"
          }
        }
      }
    }
  },
  "persistence": {
    "type": "mongodb",
    "configuration": {
      "url": "{{MONGODB_URL}}"
    },
    "collection": {
      "name": "fast-data.experiments.test-console.runtime-state"
    }
  },
  "settings": {
    "server": {
      "website": {
        "url": "/"
      }
    }
  }
}
```

In this configuration, specific details for the Control Plane environment, runtimes, and persistence are defined, allowing clients to tailor the Control Plane to their specific needs.

## Troubleshooting

In case of communication issues between the Control Plane and its frontend, a message will appear in the Monaco editor on the WebUI, alerting users to potential problems.
