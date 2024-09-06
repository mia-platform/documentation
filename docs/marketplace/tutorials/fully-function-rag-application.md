---
id: fully-functioning-rag-application
title: Create a fully functioning RAG application
sidebar_label: Create a fully functioning RAG application
---

In this tutorial we will see how to create a fully functioning RAG application in a Mia-Platform project in few minutes, from setting up the services needed and how to generate embeddings from any webpage in order to easily set up a Chatbot ready to assist you and help me on the subject.

To do so, we are going to use the Marketplace application `AI RAG Chat` that includes the [_AI RAG Template_](../../runtime_suite_templates/ai-rag-template/10_overview_and_usage.md), the service that leverages [OpenAI](https://openai.com/) APIs to create Chatbot, and the _AI RAG Chat_, a small frontend application written in React that includes a quick chat system to communicate with the service.

Also, we will install the [API Documentation Aggregator](../../runtime_suite_applications/api-documentation-aggregator/10_overview.md) application and the [API Portal](../../runtime_suite/api-portal/) from the templates, to easily send HTTP requests to the AI RAG Template service to generate the embeddings.

Other prerequisites are the following:

- a connection string to a MongoDB Atlas instance (unfortunately, MongoDB on-premise installation still does not support the retrieval of embeddings from documents)
- an API key to communicate with OpenAI

## 1. Install the required applications

We start on a new project by creating two applications: the **API Documentation Aggregator** and the **AI RAG Chat**.

From the design section, click on _Application_ on the sidebar, then click on _Create new Application_.

Search and select the **API Documentation Aggregator** first. It will install the [_API Gateway_](../../runtime_suite/api-gateway/10_overview.md) and the [_Swagger Aggregator_](../../runtime_suite/swagger-aggregator/10_overview.md), plus several endpoints to expose the Swagger UI to see the APIs exposed by the services configured and to retrieve the OpenAPI complaint schema.

:::note
The [API Documentation Aggregator](../../runtime_suite_applications/api-documentation-aggregator/10_overview.md) is not required to have the Chatbot working, but it is really helpful to use the _AI RAG Template_ APIs to generate the embeddings. You can also follow the instructions [in this tutorial](../../console/tutorials/configure-marketplace-components/api-portal.mdx).
:::

Then, it's time for the **AI RAG Chat**. It will prompt to create the _API Gateway_ (but, in this case, you will use the existing one, with the available listener), the _AI RAG Template_ and the _AI RAG Template Chat_, plus several endpoints to expose the service APIs to send your questions and to generate the embeddings.

Finally, from the sidebar click the _Microservices_, and from there click to _Create new microservice_. Select _From Marketplace_ and in the page search and create a new [API Portal](../../runtime_suite/api-portal/10_overview.md).

After creating these services, you can safely save the configuration. 

## 2. Configure the AI Rag Template service

The next step is to configure the _AI RAG Template_ service. From the design section, move to the _Microservices_ page and select the service (the default name is _ai-rag-template_ but you might have changed its name). From there, you can click on the _Environment Variables_ tab where you have to modify the following values:

- `MONGODB_CLUSTER_URI`, which is the full connection string to MongoDB
- `EMBEDDING_API_KEY`, an API key to use when communicating to OpenAI when generating services, which is the same of the OpenAI API key
- `LLM_API_KEY`, an API key to use when communicating to OpenAI when generating services, which is the same of the OpenAI API key

:::note
`EMBEDDING_API_KEY` and `LLM_API_KEY` are the same API Key that you can generate from [OpenAI](https://platform.openai.com).
:::

:::warning
Since these are information that you don't want to have visible to anyone, it is preferrable to include store these information as [project variables](../../console/project-configuration/manage-environment-variables/index.md).
:::

After updating the environment variables of the service, it is time to update the config map: click to the _ConfigMaps & Secrets_ tab and you will be redirected to the Config Map configuration page.

The _AI RAG Template_ is created with a precompiled config map that includes all the required keys, but the values needed to be included.

The following is the suggested configuration:

```json
{
  "llm": {
    "name": "gpt-4o-mini"
  },
  "embeddings": {
    "name": "text-embedding-3-small"
  },
  "vectorStore": {
    "dbName": "rag-database",
    "collectionName": "rag-collection",
    "indexName": "vector_index",
    "relevanceScoreFn": "cosine",
    "embeddingKey": "embedding",
    "textKey": "text",
    "maxDocumentsToRetrieve": 3
  }
}
```

To be more specific:

- the `llm.name` key is the LLM model amongst those available from [OpenAI](https://platform.openai.com/docs/models), suggested are `gpt-4o` and `gpt-4o-mini`
- the `embeddings.name` key is the Embedding model used to generate embeddings, amongst those available from [OpenAI](https://platform.openai.com/docs/models/embeddings), the suggested is `text-embedding-3-small`
- the `vectorStore.dbName` is the name of the database where the embeddings will be saved
- the `vectorStore.collectionName` is the name of the collection where the embeddings will be saved
- the `vectorStore.indexName` is the name of the [MongoDB Search Vector Index](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/), with `vector_index` as suggested name; this is particular index that the service will automatically create or update at the startup
- the `vectorStore.relevanceScoreFn` is the name of the _similarity search function_ used to retrieve the embedding documents; MongoDB includes three different available functions: `cosine` (suggested), `euclidean` and `dotProduct`
- the `vectorStore.embeddingKey` is the name of the field where to save the embedding of a single document, in shape of a multidimentional array; we suggest to use the default value `embedding`
- the `vectorStore.textKey` is the name of the field that contains the original text used to be transformed in embeddings, and that will be used to help the chatbot to return the answer; we suggest to use the default value `text`
- the `vectorStore.maxDocumentsToRetrieve` is the max number of documents that will be extracted and used to help the chatbot to return the answer; default value is `3` but it is usually suggested to use a value between `2` and `5`, depending on how big is the collection of the documentation

After having configured the config map, we can save the configuration and move to the deploy.

## 3. Deploy the configuration and generate embeddings

From the _deploy_ section, when can deploy the new configuration. After verifying that the services are up, when can verify that the application is up, by accessing to the chatbot frontend, accessible to the automatically generated endpoint `/` (e.g. if the project is located in host `https://my-project.console.my-company.com`, the frontend will be accessible this very same URL).

The frontend will show a page with an input field where we can communicate with the chatbot. At this time, we do not have any embedding, and because of that specific questions will not give us the response we expect.

We head to the swagger UI of the _API Portal_, accessible at the endpoint `/documentations/api-portal` to see the list of all the APIs exposed by the configured services. We can see that there are two APIs with the tag _Embeddings_: `POST api/embeddings/generate` and `GET api/embeddings/status`. 

The former, is a request to generate the embeddings starting from a webpage: the service will download the page, extract all the test and generate embeddings from it. Then it will search for links on that same page: any hyperlink with the same domain (and that follow the path of an additional filter) will be downloaded and scraped as explained, creating a recursive mechanism that will generate embeddings from the entire website.

Generating embeddings is an asynchronous task: this means that the response is given to the user right away but the process of generation is not completed, instead it works on the background.

However it is not possible to run multiple generation processes at time. This is why the _AI RAG Template_ includes the `GET api/embeddings/status` API, that can be called to see if the service is still running or not:

- the repsonse `{"status": "running"}` means that the process is still ongoing
- the response `{"status": "idle"}` means that there currently are not processes (which meanse: the previous process has finished)

Having these information in mind, we can start generating our embeddings. We run the API by expanding the `api/embeddings/generate` card and by clicking to `Try it out`. Then we change by modifying the request body including:

- an `url`, mandatory, which is the starting page that we want to generate embeddings from
- a `filterPath`, optional, which is a more specific path that will used as a filter when we find new page to download and analyze

Let's try with a piece of the Mia-Platform documentation:

```json
{
    "url": "https://docs.mia-platform.eu/docs/fast_data/what_is_fast_data",
    "filterPath": "https://docs.mia-platform.eu/docs/fast-data"
}
```

We click on the `Execute` button and we receive an immediate response that says that the embedding generation has started. At this point, we simply have to wait that for the process to end, by sending requests to the `/api/embeddings/status` API.

:::info
Process might request from few seconds to several minutes: it depends on how many webpages have to be downloaded and scraped.

It is a good idea to check the service logs, to be sure that everything is going smoothly.
:::

## 4. Enjoy

Once the process is over, there's no need to re-deploy or restart any service: after a few moments, the MongoDB Vector Index will be updated and the frontend application is ready to give us meaningful answers based on the embeddings generated.

## Troubleshooting

### I have generated the embeddings but the chatbot still does not answer correctly to my questions

Check the logs of the _AI RAG Template_: at the very beginning it should says whether the MongoDB Vector Search Index has been created or not: while the service tries to create the embeddings at the startup, it might happen that this process fails (e.g. database temporarily not accessible or the collection does not exists yet) but the service starts anyway.

In that case, please restart the pod of the service or manually create/update the index.

### The frontend is not visible

Make sure you have configured correctly the ingress route [as example with Traefik](https://docs.mia-platform.eu/docs/infrastructure/paas/tools/traefik).
