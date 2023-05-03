---
id: performance
title: Requests and limits
sidebar_label: Performance
---
This section provides a brief overview of the service performance and recommendations about CPU and RAM requests and limits in order to reach optimal performances on common scenarios.

Results have been obtained through specific tests implementing a series of requests to the Appointment Manager Service.

Specifically, the following APIs have been tested to measure CPU and RAM usage when dynamically computing slots:

- `GET /calendar/count`: return the number of events for all resources in a given period;
- `GET /calendar/`: return the events (availabilities with slots, exceptions and appointments) for all resources in a given period;
- `GET /slots/`: return the slots for a resource in a given period.

We designed the tests so that, following our suggested requests and limits, you can serve more users by simply scaling the service horizontally, i.e. increasing the number of replicas proportionally to the expected traffic.

## Scenarios

The performance of the Appointment Manager, and the aforementioned endpoints in particular, depend on the following variables:

- the period: we simulated a client fetching calendar events for a single day, week or month;
- the number of resources: we simulated a client fetching events for 5 or 25 resources;
- the availability frequency and duration: we simulated a daily availability from 7:00 to midnight for each resource;
- the slot duration: we simulated slots having a fixed duration of 15 minutes in the first test suite and variable duration (15, 30 and 60 minutes) in the second.

### Variable resources

In the first test suite we focus on how the number of resources affects the performance.

The following table summarizes our findings:

| Users | Resources | Daily slots | Weekly slots | Monthly slots | Requests Per Second | CPU Requests | CPU Limits | Memory Requests | Memory Limits |
|:-----:|:---------:|:-----------:|:------------:|:-------------:|:-------------------:|:------------:|:----------:|:---------------:|:-------------:|
|   1   |     5     | 340         | 2380         | 10540         | 1                   | 250          | 1000       | 100             | 250           |     
|   5   |     5     | 340         | 2380         | 10540         | 3                   | 250          | 1000       | 100             | 250           |   
|   5   |     5     | 340         | 2380         | 10540         | 3                   | 500          | 1500       | 100             | 250           |
|   10  |     5     | 340         | 2380         | 10540         | 6                   | 500          | 1500       | 100             | 250           |
|   20  |     5     | 340         | 2380         | 10540         | 8                   | 500          | 1500       | 100             | 250           |
|   1   |    25     | 1700        | 11900        | 52700         | 1                   | 500          | 1500       | 100             | 250           | 
|   5   |    25     | 1700        | 11900        | 52700         | <1                  | 500          | 1500       | 100             | 250           |

We recommend starting with a single replica configured as follows:

- CPU request: 500 Mi
- CPU limit: 1500 Mi
- RAM request: 100 m
- RAM limit: 250 m

and adding more replicas as needed according to the number of *users* and *resources*.

### Variable slots

In the next test suites we focus on how the number of slots affects the performance, averaging the number of resources to ten in all test cases.

#### 15 minutes

| Users | Resources | Daily slots | Weekly slots | Monthly slots | Requests Per Second | CPU Requests | CPU Limits | Memory Requests | Memory Limits |
|:-----:|:---------:|:-----------:|:------------:|:-------------:|:-------------------:|:------------:|:----------:|:---------------:|:-------------:|
|   1   | 10        | 680         | 4760         | 21080         | 1                   | 250          | 1000       | 100             | 200           |     
|   5   | 10        | 680         | 4760         | 21080         | 4                   | 250          | 1000       | 100             | 200           |   
|   10  | 10        | 680         | 4760         | 21080         | 6                   | 250          | 1000       | 100             | 200           |
|   20  | 10        | 680         | 4760         | 21080         | 6                   | 250          | 1000       | 100             | 200           |
|   50  | 10        | 680         | 4760         | 21080         | 6                   | 250          | 1000       | 100             | 200           |

#### 30 minutes

| Users | Resources | Daily slots | Weekly slots | Monthly slots | Requests Per Second | CPU Requests | CPU Limits | Memory Requests | Memory Limits |
|:-----:|:---------:|:-----------:|:------------:|:-------------:|:-------------------:|:------------:|:----------:|:---------------:|:-------------:|
|   1   | 10        | 340         | 2380         | 10540         | 1                   | 250          | 1000       | 100             | 200           |     
|   5   | 10        | 340         | 2380         | 10540         | 4                   | 250          | 1000       | 100             | 200           |   
|   10  | 10        | 340         | 2380         | 10540         | 6                   | 250          | 1000       | 100             | 200           |
|   20  | 10        | 340         | 2380         | 10540         | 8                   | 250          | 1000       | 100             | 200           |
|   50  | 10        | 340         | 2380         | 10540         | 5                   | 250          | 1000       | 100             | 200           |

#### 60 minutes

| Users | Resources | Daily slots | Weekly slots | Monthly slots | Requests Per Second | CPU Requests | CPU Limits | Memory Requests | Memory Limits |
|:-----:|:---------:|:-----------:|:------------:|:-------------:|:-------------------:|:------------:|:----------:|:---------------:|:-------------:|
|   1   | 10        | 170         | 1190         | 5270          | 1                   | 250          | 1000       | 100             | 200           |     
|   5   | 10        | 170         | 1190         | 5270          | 4                   | 250          | 1000       | 100             | 200           |   
|   10  | 10        | 170         | 1190         | 5270          | 6                   | 250          | 1000       | 100             | 200           |
|   20  | 10        | 170         | 1190         | 5270          | 8                   | 250          | 1000       | 100             | 200           |
|   50  | 10        | 170         | 1190         | 5270          | 8                   | 250          | 1000       | 100             | 200           |

### Variable CPU requests and limits

For the third test suite, we scaled up and down the microservice CPU requests and limits to assess the minimum CPU requirements.

| Users | Resources | Daily slots | Weekly slots | Monthly slots | Requests Per Second | Average response time (ms) | 90%ile (ms) | CPU Requests | CPU Limits | Memory Requests | Memory Limits | Warnings |
|:-----:|:---------:|:-----------:|:------------:|:-------------:|:-------------------:|:--------------------------:|:-----------:|:------------:|:----------:|:---------------:|:-------------:|:---------|
|   5   | 10        | 680         | 4760         | 21080         | 3                   | 330                        | 970         | 500          | 1000       | 50              | 150           | None |
|   5   | 10        | 680         | 4760         | 21080         | 3                   | 721                        | 1900        | 250          | 500        | 50              | 150           | None |
|   5   | 10        | 680         | 4760         | 21080         | 2                   | 1431                       | 3700        | 200          | 400        | 50              | 150           | CPU throttling, <1% failures |
|   5   | 10        | 680         | 4760         | 21080         | 1                   | 1635                       | 3600        | 150          | 300        | 50              | 150           | Pod restart, CPU throttling, 1% failures |

## Minimum and recommended configurations

The following table provides some recommendations, based on the results of the load tests. We suggest you start with the best matching configuration, according to the number of expected simultaneous users. The *single user* configuration represents the minimum requirements, according to our internal tests. You can easily start from any of the following configurations and then fine tune it according to your specific needs.

| Number of concurrent users | CPU Requests | CPU Limits | Memory Requests | Memory Limits |
|:--------------------------:|:------------:|:----------:|:---------------:|:-------------:|
| Single user                | 50           | 100        | 50              | 100           |
| 2-5 users                  | 250          | 500        | 50              | 100           |
| 5-15 users                 | 500          | 1000       | 100             | 150           |
| 20+ users                  | 1000         | 1500       | 100             | 150           |
