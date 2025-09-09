---
id: performance
title: User Manager performance
sidebar_label: Performance
---



This document contains information about performance tests of the **User Manager Service**.

## Job scheduler concurrency tests

A couple of concurrency tests are available for the job scheduler that handles the import and activation in Auth0 of multiple users. The tests goal is to verify that with many replicas of the microservice running there are no concurrency issues with the multiple job schedulers accessing the same job resources.

:::note

The bulk user import and activation, and so the job scheduler, are available since version **1.5.0** of the **User Manager Service**. 

:::

The tests consist in sending many requests in parallel to activate users or fetch jobs details to multiple User Manager replicas.


### Run the tests

Set the number of replicas of the User Manager service to at least four units. Run the scripts saved in the microservice repository in the `/scripts/tests/concurrency` folder.

### Tests output

Everything works smoothly, and no concurrency issues are found.

In particular the job scheduler is able to access and update the jobs correctly.
When a job handler fails, the job details persisted in MongoDB are not updated, the job is still pending and it is processed again in the next scheduled execution.

## CSV Bulk import load/stress tests

### Description

The tested endpoint is the [`PATCH /users/import`][patch-users-import]. It allows to import users from a CSV file, without activating them through an authentication service.

The results are collected from multiple tests sending a series of requests to the endpoint, and varying some conditions:
-  number of imported users
-  the **USER_IMPORT_BATCH_SIZE** environment variable
-  the CSV data, which may contain or not arrays
-  the CPU resources
-  the RAM resources

### Results

| Users | File size | Response Time | Batch size | CSV array | CPU            | RAM              | Outcome: Success/Total |
|-------|-----------|---------------|------------|-----------|----------------|------------------|------------------------|
| 10    | 1.5k      | 3.88s         | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 10/10                  |
| 50    | 7.4K      | 4.73s         | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 50/50                  |
| 100   | 15k       | 13.43s        | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 99/100                 |
| 200   | 30k       | 24.27s        | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 199/100                |
| 300   | 45K       | 25.88s        | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 299/300                |
| 500   | 75K       | 6.83s         | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/500                  |
| 1000  | 150k      | 10.37         | 250        | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/1000                 |
| 100   | 15k       | 15.80s        | 50         | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 99/100                 |
| 300   | 45K       | 28.73s        | 50         | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 299/300                |
| 500   | 75K       | 7.73s         | 50         | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/500                  |
| 1000  | 150K      |               | 1000       | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/1000                 |
| 500   | 75K       |               | 1000       | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/500                  |
| 300   | 45K       |               | 1000       | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/300                  |
| 300   | 45K       |               | 1000       | yes       | R=0m, L=50m    | R=50Mi, L=70Mi   | 299/100                |
| 300   | 45K       |               | 1000       | no        | R=0m, L=50m    | R=50Mi, L=70Mi   | 299/100                |
| 500   | 75K       | 44s           | 1000       | no        | R=0m, L=50m    | R=50Mi, L=70Mi   | 130/500                |
| 500   | 75K       | 57s           | 1000       | no        | R=0m, L=50m    | R=50Mi, L=70Mi   | 499/500                |
| 10000 | 787k      | 22s           | 1000       | no        | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/10000                |
| 2000  | 154K      | 22s           | 1000       | no        | R=0m, L=50m    | R=50Mi, L=70Mi   | 0/2000                 |
| 2000  | 154K      |               | 250        | no        | R=50m, L=100m  | R=100Mi, L=100Mi | 250/500                |
| 2000  | 154K      |               | 250        | no        | R=300m, L=300m | R=100Mi, L=100Mi | 0/2000                 |

:::info

The result outcome indicates the ratio between successfully imported users and the total amount of users to be imported.

:::

### Notes

The endpoint shows various problems when importing more than 50 users at a time due to performance issues.

## Auth0 bulk activation load/stress tests

### Description

The tested endpoint is the [`POST /jobs/bulk-activation`][post-bulk-users-activation]. It allows to activate multiple users in **Auth0** with an async operation.

### Results

| Users | Response Time | CPU         | RAM            | Outcome: Success/Total |
|-------|---------------|-------------|----------------|------------------------|
| 200   | async         | R=0m, L=50m | R=50Mi, L=70Mi | 200/200                |
| 300   | async         | R=0m, L=50m | R=50Mi, L=70Mi | 200/300                |
| 1000   | async         | R=0m, L=50m | R=50Mi, L=70Mi | 0/1000                 |

:::info

The results outcome indicates the ratio between successfully activated users and the total amount of users to be activated.

:::

### Notes

The endpoint can handle comfortably up to 200 users at a time, but it will fail to activate more than 200 users due to performance issues.

## Auth0 bulk change password load/stress tests

### Description

The tested endpoint is the [`POST /jobs/change-password/bulk`][post-bulk-change-password]. It allows to trigger multiple change-password events in **Auth0** with an async operation.

### Results

| Users | Time to completion | Rate Limit per second | CPU         | RAM            | Outcome: Success/Total |
|-------|--------------------|-----------------------|-------------|----------------|------------------------|
| 200   | 227s               | 1                     | R=0m, L=50m | R=50Mi, L=70Mi | 200/200                |
| 500   | 502s               | 1                     | R=0m, L=50m | R=50Mi, L=70Mi | 500/500                |
| 1000  | 1602s              | 1                     | R=0m, L=50m | R=50Mi, L=70Mi | 1000/1000              |
| 200   | 102s               | 2                     | R=0m, L=50m | R=50Mi, L=70Mi | 200/200                |
| 1000  | 503s               | 2                     | R=0m, L=50m | R=50Mi, L=70Mi | 1000/1000              |
| 200   | 68s                | 3                     | R=0m, L=50m | R=50Mi, L=70Mi | 143/200                |
| 200   | 43s                | 5                     | R=0m, L=50m | R=50Mi, L=70Mi | 106/200                |
| 200   | 22s                | 10                    | R=0m, L=50m | R=50Mi, L=70Mi | 146/200                |
| 1000  | 111s               | 10                    | R=0m, L=50m | R=50Mi, L=70Mi | 223/1000               |

### Notes

When the rate limit per second is too high some change-password events fail. This happens since the global rate limit of Auth0 Authentication API is exceeded. These tests uses the free tier of Auth0, which allows a maximum of [300 requests per minute][auth0-rate-limit].

The rate limit value can be configured with the environment variable [**AUTH0_BULK_CHANGE_PASSWORD_RATE_LIMIT_PER_SECOND**][environment-variables]. The default value is equal to 2 requests per second in order to avoid failures due to the Auth0 free tier rate limit. Higher values up to 10 can be set for this variable, but are only safe for bulk operations with few users.

[patch-users-import]: /runtime_suite/user-manager-service/30_usage.md#patch-usersimport
[post-bulk-users-activation]: /runtime_suite/user-manager-service/30_usage.md#post-jobsusersbulk-activation
[post-bulk-change-password]: /runtime_suite/user-manager-service/30_usage.md#post-jobschange-passwordbulk
[environment-variables]: /runtime_suite/user-manager-service/20_configuration.md#environment-variables
[auth0-rate-limit]: https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy/rate-limit-configurations
