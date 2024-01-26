---
id: template_create
title: Create a new template
sidebar_label: Create templates
---

Can't find a specific template? You can create a new one. Below you will find the suggested guidelines for the development of a template from which Console users can create microservices. 

For specific information on how to build a Marketplace item and upload it to the Mia-Platform Console, head to the [Contributing Overview](../contributing_overview) documentation.

## The target

Your template should make the creation of microservices easier by providing a specific technology ready-to-use model.

## Required features

The features that your template should always have.

### Test

The template should always include the integration test. Even just to show where to manage and how to run tests.  
Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/master/tests/index.test.js) to see an example.

### Health routes

Each template, or the eventual service library from which depends, should expose health routes.
These routes provide information on the health of the systems, and let to carry out debugging checks.

:::info
For example, in all Node.js templates, health routes are exposed by [LC-39](https://github.com/mia-platform/lc39)
:::

:::caution
Incorrect setting of health routes can cause disservices.
:::

### Environment variables

Your template has to let an easy reading of the environment variables. Furthermore, for each variable, it should provide the capability to define a defaults name and value.

To works correctly, each template, or the eventual service library from which depends, needs some specific environment variables:

* `USERID_HEADER_KEY`
* `USER_PROPERTIES_HEADER_KEY`
* `GROUPS_HEADER_KEY`
* `CLIENTTYPE_HEADER_KEY`
* `BACKOFFICE_HEADER_KEY`
* `MICROSERVICE_GATEWAY_SERVICE_NAME`

Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/255233ce35ec7748bb4120057dc36fcd2bb3f983/Dockerfile#L29-L30) to see an example.

### Dockerfile

Your template has to have a Dockerfile built with the best practices.

Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/master/Dockerfile) to see an example.

:::info
To get an idea of Dockerfile best practice read this [article](https://www.docker.com/blog/intro-guide-to-dockerfile-best-practices/).
:::

### Interpolations string

Your template always has to include interpolations strings to allow service customization properly. The values of these string are provided by Console.
The required strings are:

* `mia_template_service_name_placeholder` - The name of the service.
* `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` - The service description.
* `%CUSTOM_PLUGIN_IMAGE_NAME%` - The known docker image, only in the case you have defined in the template an own build pipeline.

The optional are:

* `mia_template_project_id_placeholder`  - The id of the Console project
* `%CUSTOM_PLUGIN_PROJECT_NAME%` - The name (label) of the Console project.
* `%CUSTOM_PLUGIN_CREATOR_USERNAME%` - The username of the user who created the service.
* `%CUSTOM_PLUGIN_PROJECT_FULL_PATH%` - The full Gitlab path.
* `%GITLAB_PROJECT%` - The name of the Gitlab project entered by the user.
* `%GITLAB_GROUP%` - The name of the user-entered Gitlab group.
* `%GITLAB_BASE_URL%` - The URL base of Gitlab.
* `%NEXUS_HOSTNAME%` - The Nexus hostname.

Check out the [Spring boot service template](https://github.com/mia-platform-marketplace/SpringBoot-Custom-Plugin-Template/blob/20c40e72f8261c9156f1a9f03028316af1ab7dad/Dockerfile#L15-L17) to see an example.

### Lint

In order to keep code clean, readable, and consistent, we suggest the use of a lint.

For example, [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/255233ce35ec7748bb4120057dc36fcd2bb3f983/package.json#L24-L25) use [ESLint](https://github.com/eslint/eslint) configured with [ESLint Mia config](https://github.com/mia-platform/eslint-config-mia).

## Ignore files

In order to avoid that certain files are uploaded to the template repository, is a good practice define properly an ignore file for git, npm, docker, etc.

Check out the [React template](https://github.com/mia-platform-marketplace/React-App-Template) to see an example.

## Best practices

A set of rules that would be appropriate to follow.

### CI/CD (Continuous Integration and Continuous Deployment)

A working CI pipeline guarantee that your template, before the integration, is automatically tested and with a consistent code style. Furthermore, you can automatize the build phase.

GitLab provides a dedicated [CI/CD tool](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/), while GitHub leverages leverages third-party integrations.

To improve the security of your template, it's important to keep dependencies updated. In order to do this, you can use tools like  [Dependabot](https://dependabot.com/) or [Renovate bot](https://docs.renovatebot.com/).

### Pre-commit hook

In the context of Continuous Integration, Pre-commit hooks are useful for identifying simple issues before submission to code review.

You can run hooks on every commit to automatically point out issues in code such as missing semicolons, trailing whitespace, etc. A hook can automatically run tests. Know these issues before of code review allows a code reviewer to focus on the architecture of a change while not wasting time with trivial style nitpicks. Furthermore, they keep the repository clean from bad code.

Check out the [Git Hooks page](https://githooks.com/) to see how to use hooks in git.

### Makefile

The template should have a makefile, or a valid alternative, for the versioning and the automatic execution of scripts to create builds, run test, tag a release, etc.

Check out the [Node.js service template package.json](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/blob/master/package.json) to see an example.

### Logging

The template should be able to generate logs in JSON format, using appropriate levels. You can follow our [guidelines for logs](/development_suite/api-console/api-design/guidelines-for-logs.md). Coherent logging allows you to properly view logs in [*Log & monitoring* section of Console](/development_suite/overview-dev-suite.md#log-monitoring) and to use them to create custom dashboards.

* The template should provide a logger.
* If exposes routes, it should generate logs for incoming and completed request.

## Documentation

Write clear and useful documentation is as important as to write good code. This will help who is using your template.

When the service is [created on the Console](/development_suite/api-console/api-design/services.md#manage-microservices), born a new repository with his own readme and changelog. In order to handle these files in a separate way, your template has to have a `.mia-template` folder with the following documentations files:

* `README.md`  
  This will be the readme of the service that explains how to use it. How to run tests, make a release, etc.
* `CHANGELOG.md`  
  This will be the changelog that highlights the updates and developments of your service.

In the root folder, the same files provide information about the template.

Check out the [Node.js service template](https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Template/tree/master/.mia-template) to see an example.

### Routes documentation

The template should be able to expose auto-generated documentation for each endpoint. It should exist a dedicated endpoint where show the API documentation.

In order to properly view API documentation in the [*Documentation Portal* of the Console](/console/project-configuration/documentation-portal.md), it should be exposed in [OAS3(Swagger) format](https://swagger.io/specification/).
