---
id: e2e-tests
title: E2E Tests
sidebar_label: E2E Tests
---


**End-to-end Tests**, often abbreviated in **E2E Tests**, are a category of tests designed to replicate user interactions with an application, ensuring the seamless integration of all system components. These tests emulate the actions of a genuine user who, engaging with the user interface, executes a sequence of operations.

# E2E Tests in P4SaMD
Mia-Care P4SaMD makes use of [Playwright](https://playwright.dev/) as tool to manage the **System Testing** phase.
[Playwright](https://playwright.dev/) is an open-source library dedicated to end-to-end test automation. Developed by Microsoft, it aims to streamline and enhance the creation, execution, and maintenance of end-to-end tests for improved efficiency.

## Functional requirements
During the design phase of e2e testing, developers define a test suite that covers all the functional requirements of the application. Each e2e test is then designed to verify specific behaviors or scenarios corresponding to a functional requirement.

The goal of mapping each e2e test to a functional requirement is to ensure that all requirements are adequately tested and that the application meets user expectations in terms of functionalities. Additionally, this practice helps identify any discrepancies between the requirements and the application's implementation, allowing for timely detection and resolution of any bugs.

### Example
For example, let us suppose a functional requirement of the application is *"Users should be able to log in using their credentials"*. An e2e test associated with this requirement might include the following actions:

1. opening the browser and navigating to the login page;
2. entering the user's credentials (username and password) into the respective fields;
3. clicking the login button;
4. verifying that the user is successfully authenticated and redirected to the main page of the application.

This way, the e2e test covers the functional requirement of user login and ensures that the application can handle this scenario correctly.

## Setup of E2E Tests
The tool-chain needed to run the e2e test suite in Mia-Care P4SaMD is composed by two main components:
1. E2E Test Repository: the repository that contains the source code describing the test suite. The repository can be found in the Gitlab group of the project at this path: `Tests > E2E Tests`. This repository already includes a Node.js project with Playwright pre-installed that is used to run the test suite;
2. E2E Test Pipeline: the pipeline that runs the test suite using Playwright.

:::info
If you need to configure environment variables that may vary based on the environment, you can add and manage them in the CI/CD variables section: `Settings > CI/CD > Variables`.
:::

## Run the E2E tests suite
The e2e tests are triggered from the execution of a pipeline the `E2E Tests` repository. The execution of the tests will generate also a report that is saved in the pipeline artifacts.

When generating the report, make sure to download the version-specific report that corresponds to the project version. Therefore, it is advisable to apply the same tag as the project to the E2E Test repository. For instance, if you're currently working on version `v1.0.0`, ensure that the E2E Test repository is tagged with `v1.0.0`.



