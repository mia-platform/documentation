---
id: configuration
title: Configuration
sidebar_label: Configuration
---

The **AI-Compliance for Data Catalog** application enhances user experience by providing an AI-powered chat interface for accessing and exploring metadata in the Data Catalog.

For proper functionality, the application requires a CronJob that periodically updates a collection of documents. These documents form a knowledge base that the AI Assistant uses to answer user queries with comprehensive information about data lineage and cross-SoR (System of Record) relationships.

## Prerequisites

Before configuring the application, ensure that you have:

- Required API keys for the LLM service (OpenAI or compatible provider)
- MongoDB connection details with appropriate access privileges
- Console service account credentials with necessary permissions

## Configuration Steps

Follow these steps to properly configure the application in your project:

### 1. Add Public Environment Variables

Configure the following public environment variables:

- `CONSOLE_URL`: The Console URL containing your projects of interest (e.g., `https://console.cloud.mia-platform.eu`). The AI Compliance application needs this to invoke the Console API and retrieve project information for cross-product user queries.
- `CONSOLE_CLIENT_ID`: The client ID of the service account for the Company containing your projects. This authenticates requests from the AI Assistant to the Console API.

### 2. Create Secret for Service Connections

The application requires a secret named `mia-assistant-keys` in your Kubernetes cluster with the following keys:

- `llm.apiKey`: API key for the LLM service. The supported provider is Google Gemini.
- `mongo.url`: Connection URL for the MongoDB service
- `llm.embeddingsApiKey`: API key for the LLM embeddings service (can be the same as `llm.apiKey`)
- `console.clientSecret`: Client secret for the console service account (corresponding to the `CONSOLE_CLIENT_ID` variable)

#### Creating the Secret with mlp

If you are using [mlp](/runtime-components/tools/mlp/10_overview.md), create the secret by updating the `mlp.yaml` file in your configuration repository adding the following section:

```yaml
- name: "mia-assistant-keys"
  when: "always"
  data:
    - from: "literal"
      key: llm.apiKey
      value: {{OPENAI_LLM_API_KEY}}
    - from: "literal"
      key: mongo.url
      value: {{DATA_FABRIC_MONGODB_URL}}
    - from: "literal"
      key: llm.embeddingsApiKey
      value: {{OPENAI_LLM_API_KEY}}
    - from: "literal"
      key: console.clientSecret
      value: {{CONSOLE_CLIENT_SECRET}}
```

#### Creating the Secret manually

If you're not using mlp, you can create the secret directly using kubectl (if you have the necessary permissions):

```bash
kubectl create secret generic mia-assistant-keys \
  --from-literal=llm.apiKey=your_llm_api_key \
  --from-literal=mongo.url=your_mongodb_connection_string \
  --from-literal=llm.embeddingsApiKey=your_embeddings_api_key \
  --from-literal=console.clientSecret=your_console_client_secret \
  -n your-namespace
```

Make sure to replace `your_llm_api_key`, `your_mongodb_connection_string`, `your_embeddings_api_key`, and `your_console_client_secret` with the actual values and `your-namespace` with the namespace where your application is deployed.

### 3. Configure the AI Context Agent CronJob

The AI Context Agent periodically updates the `assistant-catalog-documents` collection, which is essential
for providing accurate responses to user queries. This collection serves as the knowledge base for the AI Assistant,
enabling it to provide contextually relevant answers about your data assets.

To set up the CronJob:

1. Navigate to the design area of the console and select **CronJobs**
2. Click **Create CronJob**
3. Use the following settings:
   - **Name**: `ai-context-agent`
   - **Docker image**: `nexus.mia-platform.eu/data-catalog/ai-context-agent:0.5.0`
   - **Schedule**: `0 18 * * *` (runs daily at 18:00 UTC, adjust as needed)
4. Insert this YAML configuration:

  ```yaml
  apiVersion: batch/v1
  kind: CronJob
  metadata:
    name: ai-context-agent
    labels:
      app: ai-context-agent
      app.kubernetes.io/name: ai-context-agent
      app.kubernetes.io/component: cronjob
      app.kubernetes.io/managed-by: mia-platform
      mia-platform.eu/stage: '{{STAGE_TO_DEPLOY}}'
  spec:
    concurrencyPolicy: Forbid
    successfulJobsHistoryLimit: 3
    failedJobsHistoryLimit: 1
    schedule: 0 18 * * *
    jobTemplate:
      spec:
        backoffLimit: 1
        template:
          metadata:
            name: ai-context-agent
            labels:
              app: ai-context-agent
              app.kubernetes.io/name: ai-context-agent
              app.kubernetes.io/component: cronjob
              app.kubernetes.io/managed-by: mia-platform
              mia-platform.eu/stage: '{{STAGE_TO_DEPLOY}}'
          spec:
            imagePullSecrets:
              - name: nexus-gcloud
            containers:
              - name: ai-context-agent
                image: nexus.mia-platform.eu/data-catalog/ai-context-agent:0.5.0
                env:
                  - name: DATA_CATALOG_URL
                    value: http://fabric-bff
                  - name: OPEN_LINEAGE_URL
                    value: http://fabric-bff/api/open-lineage
                  - name: LOG_LEVEL
                    value: '{{LOG_LEVEL}}'
                  - name: MONGO_URL
                    valueFrom:
                      secretKeyRef:
                        name: mia-assistant-keys
                        key: mongo.url
            restartPolicy: Never
  ```

## Verification

After completing the configuration:

1. Ensure the CronJob runs successfully at least once to populate the initial dataset
2. Verify that the `assistant-catalog-documents` collection is populated in MongoDB
3. Test the AI Assistant by asking a query related to your data catalog, such as "What data sources are available?" or "Show me the lineage of [specific data asset]"
