---
id: assistant
title: Mia-Assistant
sidebar_label: Assistant
---



Mia-Platform Console includes *Mia Assistant*, an AI-based application that can be interrogated on anything included in the official [Mia-Platform Documentation](https://docs.mia-platform.eu).

## MongoDB configuration

Mia-Assistant relies on a MongoDB vector store collection, that is automatically populated during deployment.

However, the Helm Chart is not yet capable of creating the vector store collection and the necessary indexes for it to work; so you have to manually create a collection named `assistant-documents` and configure an [Atlas Vector Search index](https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/vector-search-quick-start/) on it.

:::info
Please mind that Atlas Vector Search indexes are available only on MongoDB Atlas instance with version 6.0.11, 7.0.2 or higher.

Unfortunately, MongoDB's Vector Search indexes are not available on previous versions or on MongoDB Entreprise Server edition. If you don't meet these requirements, unfortunately the service will not work.

Please refer to the official MongoDB official documentation to have more information regarding this.
:::

You can create the index in two ways:

- with a script with the official MongoDB drivers that connects to MongoDB and prepare the embeddings for you, [as explained in the MongoDB official documentation](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-type/#procedure)
- manually, connecting to your MongoDB Atlas cluster and creating the index from the Atlas web application, [as explained in this guide](https://mongodb-developer.github.io/search-lab/docs/vector-search/create-index)

It is important that the index have this structure:

```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "euclidean",
      "type": "vector"
    },
    {
      "path": "__STATE__",
      "type": "filter"
    }
  ]
}
```

:::caution
The structure of the index is mandatory, otherwise the documents cannot be extracted from the collection.
:::

### OpenAI Configuration

The Mia-Assistant service can be configured via Helm Chart using the `.assistant` value.

:::info
At the moment, the only supported models are the ones developed by [OpenAI](https://platform.openai.com/docs/models/overview).
:::

The Helm Chart will require including the API key for both the embedding model and the large language model used. For OpenAI models, these two API keys are the same and can be created from the [OpenAI API keys page](https://platform.openai.com/api-keys). After logging in with the credentials of your company, you can create the API Key that must be included in the `assistant` object inside the Helm chart and that will be used by the Mia-Assistant service.

The service is already configured to use the following models:

- [`text-embedding-3-small`](https://platform.openai.com/docs/guides/embeddings) as Embedding model
- [`gpt-3.5-turbo`](https://platform.openai.com/docs/models/gpt-3-5-turbo) as Large Language Model (LLM)

:::info
Please note that using these models has a cost, which is detailed on the [Pricing](https://openai.com/api/pricing/) page of the OpenAI documentation.

When registering with OpenAI, you also have to set up a billing plan in order to use OpenAI services with the Mia-Assistant.
:::

## Mia-Assistant Configuration

The configuration regarding the Assistant is included inside the `assistant` object, which is composed by:
In order for the service to correctly start up, please ensure the following properties configured:

| Name | Type | Description | Default | Required |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `enabled`         | boolean | If set to `true`, the Mia-Assistant will be enabled               | `false` | ❌ |
| `keys.llm`        | string  | The API key for the Large Language Model                          |         | ✅ |
| `keys.embeddings` | string  | The API key for the Embedding Model                               |         | ✅ |
| `llm`             | object  | The configuration of the related LLM used under the hood          |         | ✅ |
| `embeddings`      | object  | The configuration of the related Embeddings used under the hood   |         | ✅ |

### LLM and Embeddings Model Configuration

You can choose any LLMs/Embedding provider to be used under the hood from the supported ones:

- `azure`
- `openai`
- `vertex`

Here an example to configure LLM/Embedding with different providers:

Azure:

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      llm:
        type": "azure",
        apiVersion": "2025-01-01-preview",
        deploymentName": "gpt-4o-mini",
        name": "gpt-4o-mini",
        url": "https://test.openai.azure.com/"
      embeddings:
        type": "azure",
        apiVersion": "2025-01-01-preview",
        deploymentName": "text-embedding-3-large",
        name": "text-embedding-3-large",
        url": "https://test.openai.azure.com/"
```

OpenAI:

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      llm:
        type": "openai",
        name": "gpt-4o-mini",
      embeddings:
        type": "openai",
        name": "text-embedding-3-large",
```

Vertex:

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      llm:
        type": "vertex",
        name": "gpt-4o-mini",
      embeddings:
        type": "vertex",
        name": "text-embedding-3-large",
```
