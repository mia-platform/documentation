---
id: apis
title: APIs
sidebar_label: APIs
---



The following documents includes a comprehensible list of the available APIs exposed by the service.

When running the service, the application exposes a Swagger UI at the `/docs` endpoint.

### Chat Endpoint (`/chat/completions`)

The `/chat/completions` endpoint generates responses to user queries based on provided context and chat history. It leverages information from the configured Vector Store to formulate relevant responses, enhancing the conversational experience.

***Example***:


Request

```curl
curl 'http://localhost:3000/chat/completions' \
  -H 'content-type: application/json' \
  --data-raw '{"chat_query":"Design a CRUD schema for an online store selling merchandise items","chat_history":[]}'
```




Response

```json
{
    "message": "For an online store selling merchandise items, we can design a CRUD schema for a `Product` entity with the following properties: ...",
    "references": [
        {
            "content": "### Create CRUD to Read and Write Table Data  \n...",
            "url": "../../microfrontend-composer/tutorials/basics"
        },
        {
            "content": "### Create CRUD to Read and Write Table Data  \n...",
            "url": "../../microfrontend-composer/tutorials/basics"
        },
        {
            "content": "### Create a CRUD for persistency  \n...",
            "url": "../../console/tutorials/configure-marketplace-components/flow-manager"
        },
        {
            "content": "### Create a CRUD for persistency  \n...",
            "url": "../../console/tutorials/configure-marketplace-components/flow-manager"
        }
    ]
}
```



### Embedding Endpoints

#### Generate from website (`/embeddings/generate`)

The `/embeddings/generate` endpoint is a HTTP POST method that takes as input:

- `url` (string, *required*), a web URL used as a starting point
- `filterPath` (string, not required), a more specific web URL that the one specified above

- crawl the webpage
- check for links on the same domain (and, if included, that begins with the `filterPath`) of the webpage and store them in a list
- scrape the page for text
- generate the embeddings using the [configured embedding model](#configuration)
- start again from every link still in the list

> **NOTE**:
> This method can be run only one at a time, as it uses a lock to prevent multiple requests from starting the process at the same time.
>
> No information are returned when the process ends, either as completed or stopped because of an error.

***Eg***:


Request

```curl
curl 'http://localhost:3000/embedding/generate' \
  -H 'content-type: application/json' \
  --data-raw '{"url":"https://docs.mia-platform.eu/", "domain": "../../runtime_suite_templates" }'
```




Response in case the runner is idle

```json
200 OK
{
    "statusOk": "true"
}
```



Response in case the runner is running

```json
409 Conflict
{
    "detail": "A process to generate embeddings is already in progress." 
}
```


#### Generate from file (`/embeddings/generateFromFile`)

The `/embeddings/generateFromFile` endpoint is a HTTP POST method that takes as input:

- `file` (binary, *required*), a file to be uploaded containing the text that will be transformed into embeddings.

The file must be of format:

- a text file (`.txt`)
- a markdown file (`.md`, `.mdx`)
- a PDF file (`.pdf`)
- a zip file (formats available: `.zip`, `.tar`, `.gz`) containing files of the same formats as above (folders and other files will be skipped).

For this file, of each file inside the archive, the text will be retrieved, chunked and the embeddings generated.

> **NOTE**:
> This method can be run only one at a time, as it uses a lock to prevent multiple requests from starting the process at the same time.
>
> No information are returned when the process ends, either as completed or stopped because of an error.

***Eg***:


Request

```curl
curl -X 'POST' \
  'https://rag-app-test.console.gcp.mia-platform.eu/api/embeddings/generateFromFile' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@my-archive.zip;type=application/zip'
```




Response in case the runner is idle

```json
200 OK
{
    "statusOk": "true"
}
```



Response in case the runner is running

```json
409 Conflict
{
    "detail": "A process to generate embeddings is already in progress." 
}
```


#### Generation status (`/embeddings/status`)

This request returns to the user information regarding the [embeddings generation runner](#generate-embedding-endpoint-embeddingsgenerate). Could be either `idle` (no process currently running) or `running` (a process of generating embeddings is actually happenning).

***Eg***:


Request

```curl
curl 'http://localhost:3000/embedding/status' \
  -H 'content-type: application/json' \
```




Response

```json
200 OK
{
    "status": "idle"
}
```


### Metrics Endpoint (`/-/metrics`)

The `/-/metrics` endpoint exposes the metrics collected by Prometheus.
