---
id: rpc_plugin
title: RPC Plugin
sidebar_label: Rpc plugin
---



The RPC Plugin processor allows you to transform data using a custom-built RPC Plugin.
This is useful when you need to perform complex transformations that are not possible with the built-in processors.

## Configuration

To configure the RPC Plugin processor, you need to define a processor of type `rpc-plugin` in your configuration file.

The configuration requires the following parameters:

- `type` (*string*): The type of the processor, which should be set to `rpc-plugin`.
- `modulePath` (*string*): The local File System path to the RPC Plugin module.
- `initOptions` (*object*): The options to pass to the RPC Plugin during initialization. This object will be
passed as-is to the plugin.

## RPC Plugin Development

In order to create custom RPC plugin you need to:

- implement the `Processor` interface from the [`github.com/mia-platform/integration-connector-agent/entities`][pkg] package.
- build the plugin
- place the plugin in the local file system path specified in the `modulePath` configuration

### Implementing the Processor Interface

To implement the `Processor` interface, you need to define a struct that implements the following methods:

- `Init(config []byte) error`: This method is called to initialize the plugin with the provided
configuration options.
- `Process(input entities.PipelineEvent) (entities.PipelineEvent, error)`: This method is called to process the input event.

:::tip
You can find an example implementation of the `Processor` interface in the [examples/rpc-processor-plugin][example] directory.
:::


Example Implementation

```go
package main

import (
	"context"

	"github.com/mia-platform/integration-connector-agent/entities"
)

type MyProcessor struct {
	// Add any fields you need for your plugin
}

func (p *MyProcessor) Init(config []byte) error {
	// Initialize your plugin with the provided options
	return nil
}

func (p *MyProcessor) Process(input entities.PipelineEvent) (entities.PipelineEvent, error) {
	// Process the event and return the transformed event
	// If you want to filter the event, return nil
	return event, nil // or return a modified event
}
```

After implementing the `Processor` interface, you need to define the plugin entry point in the `main` function:

```go
package main

import (
	"log"

	rpcprocessor "github.com/mia-platform/integration-connector-agent/adapters/rpc-processor"
)

func main() {
	l, err := rpcprocessor.NewLogger("trace")
	if err != nil {
		log.Fatal(err)
	}

	processor := &CustomProcessor{
		logger: l,
	}
	rpcprocessor.Serve(&rpcprocessor.Config{
		Processor: processor,
		Logger:    l,
	})
}
```



### Building the Plugin

Once you have implemented the `Processor` interface and served it in the `main` function,
you can build it just like any other golang binary with:

```bash
go build -o my-rpc-plugin
```

### Use Docker to build and run the plugin

In order to place the plugin in the local file system path specified in the `modulePath` configuration,
you can use Docker to build and run the plugin. Here is an example Dockerfile:

```Dockerfile
FROM golang:alpine AS builder

WORKDIR /dist

COPY ./my-processor .

RUN go build -o ./processor ./plugin.go ./processor.go

FROM ghcr.io/mia-platform/integration-conector-agent

COPY --from=builder /dist/processor /var/run/processor
```

[pkg]: https://github.com/mia-platform/integration-connector-agent/tree/main/entities
[example]: https://github.com/mia-platform/integration-connector-agent/tree/main/examples/rpc-processor-plugin
