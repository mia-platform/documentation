---
id: unit-tests
title: Unit Tests
sidebar_label: Unit Tests
---

**Unit Testing** is a software testing layer by which individual units of source code are tested to determine whether they are correct for use. You should rely on unit testing as a first method to identify code bugs and malfunctions. Moreover, Unit Testing is often implemented following *Test Driven Development* (TDD) practices.

Given the nature of the *Unit Testing*, each implementation of unit tests differs on the basis of the type of the *Software Item* considered, as well as the language, the framework and, finally, to the tool used to perform the tests of unit. As we will see in the following chapter, Mia-Care P4saMD offers a SDK for some of the main languages and framework used in the development of cloud-native software.

## Unit Testing in P4SaMD

Every microservice created from a Mia-Care template is equipped with a GitLab CI pipeline that executes tests and generates a corresponding report. The structure of the report is framework-dependent. Below is a list of available report generators for each framework.

| Framework | Test Runner | Report Generator|
|:----------|-------------|------|
| Node | Jest | Jest |
| Springboot | JUnit | Surefire |

The unit tests report is generated each time a new tag is created on the microservice repository or when a new commit is performed on the `master` branch. When a tag or master branch is pushed to GitLab, the triggered pipeline will generate the unit tests report and save it as an artifact of the pipeline.

During the version report generation, the unit tests report will be retrieved from GitLab, processed, and then saved in the Documentations repository. [For further information about test documentation please refer to the related section](../reports/tests.md).

:::info
The artifact will be retained in GitLab for one year from its generation.
:::