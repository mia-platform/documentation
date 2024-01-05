---
id: integration-tests
title: Integration Tests
sidebar_label: Integration Tests
---

**Integration Testing** is a testing layer in which multiple software modules they are combined and then tested as a group. According to testing best-practice, it should occur after **Unit Testing** and before **System Testing**.

# Integration Testing in P4SaMD

Mia-Care P4SaMD makes use of [Newman](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/) as tool to manage the **Integration Testing** phase.

The *Integration Testing* phase provides that the different software modules are combined in order to test their interaction, through the execution of flows which test a software functionality, partially or entirely. In the context of Mia-Care P4saMD, the modules correspond to microservices. To verify the integration between microservices they must be released in a runtime and must be reached and questionable by Newman. The tool-chain needed to run the integration test suite in Mia-Care P4SaMD is composed by two main components:
1. The Integration Tests Pipeline: the pipeline is triggered every time a new tag is created. It triggers the Integration Tests Service for the test suite run and collect ans save the results of the suite in the documentation folder. 
2. The Integration Tests Service: the Newman test source code will be recovered and ran by a specific microservice called *Integration Tests Service*, which is available in the Mia-Care Marketplace dedicated to SaMD. This service will take care of performing the individual tests and drawing up the report with the results of the test suite. Furthermore, the service will act as entry point for the test suite, since it will be exposed through a **protected** endpoint that will be called by Integration Test Pipeline to start test suite run.

:::info
Please note that, every time an integration test suite is ran, the `integration-tests-service` should be deployed together with the modules (microservices) involved in the test suite. 
:::

## Configuration

### Setup of the Integration Tests Service

The Integration Tests Service is a service that can be created from the Mia-Care Marketplace dedicated to SaMD.
Once created, the service must be configured so that it can retrieve the code of the Newman tests that represent the test suite to be executed. The configuration is performed by setting up the following environment variables:

| Variable Name | Required | Description | Example | Note |
| :--: | :--: | :--: | :--: | :--: |
| **GITLAB_HOST_URL** | Yes | The hostname of the Gitlab instance containing Newman test suite | `https://gitlab.example.com` | |
| **GITLAB_ACCESS_TOKEN** | Yes | The Access Token to access Gitlab instance | `38m29d-example-token-dj3920` | Since this is an access token, it is strongly recommended to save the value within the secret section of Mia-Platform IDP and to refer to the value of the variable through the classic notation for interpolation. [More information here](https://docs.mia-platform.eu/docs/console/project-configuration/manage-environment-variables/). |
| **GITLAB_PROJECT_ID** | Yes | The `Integration Tests` repository project ID. | `123456` | |
| **GITLAB_BRANCH** | Yes | The `Integration Tests` repository branch that contains the test suite you want to run | `main` | |

Once the Integration Tests Service has been correctly configured, you need to expose the service through a endpoint protected with an API Key. To get more information on how to create a protected endpoint please refer to the [official Mia-Platform IDP documentation](https://docs.mia-platform.eu/docs/development_suite/api-console/api-design/endpoints#what-is-an-endpoint).

## Setup of the Integration Tests Pipeline
The Integration Tests Pipeline is already provided by Mia-Care and it is available in the repository `Integration Tests` of the [Gitlab group](../gitlab/repositories.md) of the project. However, the Integration Tests Pipeline needs to be configured in order to trigger the Integration Tests Service that will run the test suite. To do so, you need to setup the following environment variables in the Gitlab repository `Integration Tests`. Once opened the `Integration Tests` repository, you can find the variables section at this path: `Settings > CI/CD > Variables`.

| Variable Name | Required | Description | Example | Note |
| :--: | :--: | :--: | :--: | :--: |
| **INTEGRATION_SERVICE_API_KEY** | Yes | The API Key to call the Integration Tests Service endpoint | `dxnie-api-key-dh2809` | It is the API Key created to protect the Integration Tests Service endpoint [at this stage](#setup-of-the-integration-tests-service) |
| **INTEGRATION_SERVICE_URL** | Yes | The URL of the Integration Tests Service endpoint | `https://your-project-hostname/integration-test-service` | It is the URL created to expose the Integration Tests Service endpoint [at this stage](#setup-of-the-integration-tests-service) |

## Test suite creation 

The suggested way to create a test suite with Newman is through the Postman application. In the `Tests` tab, it is possible to define a test suite for the selected request.

![Postman](img/postman.png)

Once the test suite is created, it needs to be exported. You have to export both the collection and the environment configuration. You can follow this [guide](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/) to accomplish this.

Once created, the test suite must be included in the Integration Tests repository. The Integration Tests repository includes a folder called `tests`. Within that folder, you should create a separate folder for each service you intend to test. Inside each new folder, you can place the `collection.json` and `environment.json` files.

```
.
├── tests
│   ├── service-to-test
│   └── another-service-to-test
├── .gitlab-ci.yml
```

:::tip
Organize your tests by service. In Postman, create a collection for each service and keep their exports separated.
:::

Then, you need to update the Integration Tests Pipeline to run all the tests. The Integration Tests Pipeline is implemented in the `gitlab-ci.yml`.

For each sub-folder you created in the `tests` folder, you need to add a new item in the `matrix` field of the pipeline. The item is composed of the following fields:
| Variable Name | Required | Description | Example | Note |
| :--: | :--: | :--: | :--: | :--: |
| **TEST_NAME** | Yes | The name of the sub-folder in the `tests` folder containing the tests for a particular service | `service-to-test` | |
| **TEST_BASE_URL** | No | If passed, it will be used in the tests as the `baseUrl` variable | `service-name` | |

Here an example of the `.gitlab-ci.yml` correctly configured:
```yml
include:
  - project: 'mia-care/pipelines-templates'
    file: 'samd/integration-tests/newman-template.yml'


.microservices-to-test:
  parallel:
    matrix:
      - TEST_NAME: "service-to-test"
        TEST_BASE_URL: "service-name"
```

## Test execution
To execute the integration tests for a specific version of the project, you need to manually create a new tag in the `Integration Tests` repository. The tag's name must be  `<project-version>-noartifacts`.

The tag creation will trigger the `integration-tests-service` which in turn, upon test completion, will initiate the creation of another tag named `<project-version>-artifacts`. This tag generates the Newman report and stores it in the pipeline artifacts.