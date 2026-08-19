---
id: assistant
title: Mia-Assistant
sidebar_label: Assistant
---

Mia-Platform Console includes *Mia Assistant*, an AI-based application that can be interrogated on anything included in the official [Mia-Platform Documentation](/) and to use the [Mia-Platform Console MCP Server](https://github.com/mia-platform/console-mcp-server) to receive help on the Mia-Platform Console company and projects, allowing to gather information about configurations, deployments, kubernetes status.

## MongoDB requirements

To fetch information of the official documentation of the Mia-Platform Suite, Mia-Assistant relies on the [RAG technique](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) on a set of embeddings that contains the Mia-Platform documentation.

These embeddings are included in a specific Docker Image named _mia-assistant-embeddings_, available on the official Mia-Platform Container registry. This image contains a script that extracts the embeddings of the documentation related to the installed Mia-Platform version, and stores them in a MongoDB collection named `assistant-documents`.

The Mia-Assistant service, at startup, will create (or update) an an [Atlas Vector Search index](https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/vector-search-quick-start/) on it, partially based on the configuration included at the Assistant startup.

:::info
Please mind that Atlas Vector Search indexes are available only on MongoDB Atlas instance with version 6.0.11, 7.0.2 or higher.

MongoDB's Vector Search indexes are not available on previous versions or on MongoDB Entreprise Server edition. If you don't meet these requirements, unfortunately the service will not work.

Please refer to the official MongoDB official documentation to have more information regarding this.
:::

### AI Provider Configuration

Mia-Assistant allow using Embedding Models and Large Language Models from these providers:

- [**OpenAI**](https://openai.com/api/), which includes models of the GPT family and embedding models `text-embedding-3-small` and `text-embedding-3-large`
- [**Azure**](https://ai.azure.com/), which allow deployment of several models from several companies
- [**Vertex AI**](https://cloud.google.com/products/gemini-enterprise-agent-platform?hl=en) (rebranded in _Gemini Enterprise Agent Platform_), which allow hosting of several models from several companies

While LLMs are required to the Assistant to function (producing text, meaning reading questions and producing answers), the Embedding Models are required to have access to the Mia-Platform Documentation

## Mia-Assistant Configuration

The configuration regarding the Assistant is included inside the `assistant` object, which is composed by:
In order for the service to correctly start up, please ensure the following properties configured:

| Name | Type | Description | Default | Required |
|:----:|:----:|:-----------:|:-------:|:--------:|
| `enabled`         | boolean | If set to `true`, the Mia-Assistant will be enabled               | `false` | ❌ |
| `keys`            | object  | The configuration for the API Keys and Credentials for specified Models          |         | ✅ |
| `llm`             | object  | The configuration of the related LLM used under the hood          |         | ✅ |
| `embeddings`      | object  | The configuration of the related Embeddings used under the hood   |         | ❌ |

### LLM and Embeddings Model Configuration

You can choose one or multiple LLMs providers to be used from the Mia-Assistant. The supported ones are:

- `azure`
- `openai`
- `vertex`
- `google_anthropic_vertex`

The Assistant can be configured to have multiple LLM available, allowing the user using the Mia-Assistant to choose which LLM use based on their need. It is also possible to include different LLM coming from different AI Providers: the `llms` key expect an array of objects where
the different LLM configurations can included, as shown in the example above.

Note that both `vertex` and `google_anthropic_vertex` cannot be configured to use different credentials for LLM and Embeddings models. Credentials for these models is defined in the field `keys.vertexAICredentials`.

As Embedding model you can choose one of the following supported types:

- `azure`
- `openai`

The `embeddings` key is an object, since you can have configure one embedding model in use.

:::info
The embeddings are available only with the `text-embedding-3-large` embedding model provided by OpenAI, and available via OpenAI API or Azure AI Foundry. If you don't have access to either services, the RAG technique could not work, and the Mia-Assistant cannot rely on the Documentation for helping carrying tasks on projects.
:::

:::info
You can omit the `embeddings` key if you don't want the support of the Mia-Platform Documentation
in the Mia-Assistant and use it only as a general purpose knowledge with the capabilities of the MCP Server.
:::

Here an example to configure Mia-Assistant with different LLM providers:

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      keys:
        azureLlmApiKey: azure-apiKey
        vertexAICredentials: vertex-credentials
      llms:
        # OpenAI LLM configuration example
        - type: openai
          name: gpt-5.4
          displayName: GPT-5.4
        # Azure LLM configuration example
        - type: azure
          name: gpt-5.4
          displayName: GPT-5.4
          deploymentName: gpt-5.4
          apiVersion: 2024-12-01-preview
          url: https://test.openai.azure.com/
        # Gemini models hosted on Vertex AI LLM configuration example
        - type: vertex
          name: gemini-3.1-pro-preview
          displayName: Gemini 3.1 Pro (Preview)
          project: my-gcp-project
          location: global
        # Non-Gemini model hosted on Vertex AI LLM configuration example
        - type: google_anthropic_vertex
          name: claude-sonnet-4-6
          displayName: Claude Sonnet 4.6
          project: my-gcp-project
          location: global
          # ...
      embeddings:
        # Azure embedding model configuration example
        type: azure,
        apiKey: embeddings-apiKey
        apiVersion: 2025-01-01-preview
        deploymentName: text-embedding-3-large
        name: text-embedding-3-large
        url: https://test.openai.azure.com
```

Different AI providers require different authentication secrets (such as API keys or private keys). These must be included inside the `keys` key. It is in form of an object where different
values must be included to support authentication with different providers. More details
on how to do this is shown in the following sub-paragraphs.

#### Using OpenAI

:::info
OpenAI is the default AI Provider for both LLMs and embedding models. If `type` key is omitted, it automatically defaults to `openai`.
:::

Azure models requires to be deployed via Azure AI Foundry. You have to set the name of the model in the `name` key, and you can add `displayName` for a more readable name of the model to be shown in Mia-Assistant (defaults to the `name` value).

The API Key used to authenticate must be included inside `keys.openaiLlmApiKey`. This value will
be encoded in base64 and included in a kubernetes service.

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      keys:
        openaiLlmApiKey: your-apiKey
      llms:
        - type: openai
          name: gpt-5.4
          displayName: GPT-5.4
          # ...
      embeddings:
        type: openai,
        name: text-embedding-3-large,
        # ...
```

#### Using Azure

Azure models requires to be deployed via Azure AI Foundry. The configuration requires then the `deploymentName`, the `apiVersion` and the `url` of said deployment. This goes for each LLM configured and for the embedding model.

The API Key used to authenticate must be included inside `keys.azureLlmApiKey`. This value will
be encoded in base64 and included in a kubernetes service.

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      keys:
        azureLlmApiKey: your-apiKey
      llms:
        - type: azure
          name: gpt-5.4
          displayName: GPT-5.4
          deploymentName: gpt-5.4
          apiVersion: 2024-12-01-preview
          url: https://test.openai.azure.com/
        # ...
      embeddings:
        type: azure,
        apiKey: embeddings-apiKey
        apiVersion: 2025-01-01-preview
        deploymentName: text-embedding-3-large
        name: text-embedding-3-large
        url: https://test.openai.azure.com
```

#### Using Gemini Enterprise Agent Platform (Vertex AI)

Gemini models require the type `vertex`. Other models available via Google Model Garden (such as Claude services) require the type `google_anthropic_vertex`.

You have to set the name of the model in the `name` key, and you can add `displayName` for a more readable name of the model to be shown in Mia-Assistant (defaults to the `name` value).
Moreover, the `project` (which is the GCP project of the service account used to authenticate) and the `location` of the model to use must be included for each LLM model.

The API Key used to authenticate must be included inside `keys.vertexAICredentials`, and should include the JSON with the required information of the service account to authenticate to the Google Cloud Provider instance. This value will be encoded in base64 and included in a kubernetes service.

```yaml
mia-console:
  configurations:
    # ...
    assistant:
      enabled: true,
      # ...
      keys:
        vertexAICredentials: my-vertex-ai-credentials
      llms:
        - type: vertex, # Gemini models
          name: gemini-3.1-pro-preview
          displayName: Gemini 3.1 Pro (Preview)
          project: my-gcp-project
          location: global
        - type: google_anthropic_vertex, # Vertex deployed models
          name: claude-haiku-4-5
          displayName: Claude Haiku 4.5
          project: my-gcp-project
          location: global
          # ...
      embeddings:
        # ...
```
