---
id: performance
title: Performance
sidebar_label: Performance
---



This section provides a brief overview of the service performance and recommendations about CPU and RAM requests and limits in order to reach optimal performances on common scenarios.

Results have been obtained through specific tests implementing a series of requests to the Notification Manager service.

Specifically, all the [default events][default-events] have been submitted randomly and repeatedly to the `POST /notification-events/` endpoint to measure CPU and RAM usage.

Following our suggested requests and limits, you can serve more users by simply scaling the service horizontally, i.e. increasing the number of replicas proportionally to the expected traffic.

## Test without notifications

This test suite helped us establish a baseline for the performance of the service when no notification is actually send.
We tested this scenario without configuring any notification setting.
Each concurrent user was configured to send a request every one to five seconds.
Each test was left running for 5 minutes.

### v2.0.0

| Users | Replicas | Requests Per Second | Average response time (in s) | Median response time (in s) | Min response time (in s) | Max response time (ms) |
|:-----:|:--------:|:-------------------:|:----------------------------:|:---------------------------:|:------------------------:|:----------------------:|
|   5   |    1     |         1.2         |              1               |             0.3             |           0.01           |           11           |
|   5   |    2     |          1          |              2               |             0.3             |           0.01           |           60           |
|  10   |    2     |         1.6         |              2               |             0.4             |           0.01           |           26           |

### v2.3.0

| Users | Replicas | Requests Per Second | Average response time (in ms) | Median response time (in s) | Min response time (in s) | Max response time (ms) |
|:-----:|:--------:|:-------------------:|:-----------------------------:|:---------------------------:|:------------------------:|:----------------------:|
|   5   |    1     |         1.6         |              0.2              |             0.1             |           0.05           |           3            |
|   5   |    2     |         1.5         |             0.18              |             0.1             |           0.05           |          1.5           |
|  10   |    2     |         2.7         |             0.15              |             0.1             |           0.05           |          1.7           |
|  25   |    2     |         8.1         |             0.35              |            0.15             |           0.05           |           7            |

## Test with notifications

This test suite was designed to measure the collective performance of the Notification Manager alongside the other services it depends on to send messages and set reminders.
Each concurrent user was configured to send a request every one to five seconds.

### v2.0.0

Each test sent on average two emails and two SMS messages and was left running for 5 minutes.

| Users | Replicas | Requests Per Second | Average response time (in s) | Median response time (in s) | Min response time (in s) | Max response time (s) |
|:-----:|:--------:|:-------------------:|:----------------------------:|:---------------------------:|:------------------------:|:---------------------:|
|   1   |    1     |          0          |              13              |              3              |            1             |          60           |
|   5   |    1     |         0.6         |              9               |              4              |            1             |          60           |
|   5   |    2     |         0.4         |              29              |             17              |            1             |          60           |

### v2.3.0

Each test sent on average one email and was left running for 5 minutes.

| Users | Replicas | Requests Per Second | Average response time (in s) | Median response time (in s) | Min response time (in s) | Max response time (s) |
|:-----:|:--------:|:-------------------:|:----------------------------:|:---------------------------:|:------------------------:|:---------------------:|
|   1   |    1     |         0.3         |             0.9              |             0.9             |           0.06           |          3.2          |
|   5   |    1     |          1          |             1.0              |            0.64             |           0.05           |          6.3          |
|  10   |    1     |         1.6         |             1.8              |              1              |           0.05           |         11.3          |
|  10   |    2     |         2.2         |             2.2              |             1.5             |           0.05           |         14.8          |

## Recommended configuration

The overall performance of the Notification Manager, in terms of response time, depends partially on the performance of the external services used to send messages and set reminders.
The following table provides a recommended configuration for the services that mostly affect the Notification Manager performance.
We recommending adding more replicas of each service, according to your usage scenario and level of traffic.

| Service                   | CPU Requests (in Mi) | CPU Limits (in Mi) | Memory Requests (in m) | Memory Limits (in m) | Notes                                                |
|---------------------------|----------------------|--------------------|------------------------|----------------------|------------------------------------------------------|
| Notification Manager      | 60                   | 120                | 60                     | 120                  |                                                      |
| Mail Notification Service | 25                   | 60                 | 50                     | 100                  |                                                      |
| SMS Service               | 100                  | 100                | 150                    | 150                  | Remember to configure the rate limits appropriately. |


[default-events]: /runtime-components/plugins/notification-manager-service/10_overview.md#default-events
