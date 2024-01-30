---
id: performance
title: Requests and limits
sidebar_label: Performance
---
This section provides a brief overview of the service performance and recommendations about CPU and RAM requests and limits in order to reach optimal performances on common scenarios.

Results have been obtained through specific tests implementing a series of requests to the PDF Service.

Specifically, the following APIs have been tested to measure CPU and RAM usage:

- `POST /merge`
- `POST /url`
- `POST /template`

## Legend
- `Replicas`: The number of static (or dynamic) replicas of PDF Service.
- `Users`:  The number of users that use the service simultaneously (each user make a new request every second).
- `RPS`: The number of the requests that the PDF Service can handle per second.
- `Failures`:  The rate of the requests that fails during the test.

NB: Some tested configurations saturate the service making it unusable. For these tests, the result is reported as a dash symbol.

## Merge
| Replicas | Users | CPU Request | CPU Limit | Memory Request | Memory Limit | RPS | Failures |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1 | 150 | 300 | 150 | 300 | 0.5 | 0% |
| 1 | 5 | 150 | 300 | 150 | 300 | 2.5 | 0% |
| 1 | 5 | 300 | 500 | 300 | 500 | 2.8 | 0% |
| 1 | 10 | 300 | 500 | 300 | 500 | 5 | 5% |
| 1 | 20 | 500 | 1000 | 500 | 1000 | 10 | 1% |
| 1 | 50 | 500 | 1000 | 500 | 1000 | 17 | 0% |

## URL

| Replicas | Users | CPU Request | CPU Limit | Memory Request | Memory Limit | RPS | Failures |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1 | 150 | 300 | 150 | 300 | 0.2 | 0% |
| 1 | 5 | 150 | 300 | 150 | 300 | 0.2 | 2% |
| 1 | 5 | 300 | 500 | 300 | 500 | 0.5 | 0% |
| 1 | 10 | 300 | 500 | 300 | 500 | 0.4 | 0% |
| 1 | 20 | 500 | 1000 | 500 | 1000 | - | - |
| 1 - 3 | 20 | 500 | 1000 | 500 | 1000 | 2.5 | 0% |
| 1 | 50 | 500 | 1000 | 500 | 1000 | - | - |
| 1 - 5 | 50 | 500 | 1000 | 500 | 1000 | 3 | 0% |

## Template

| Replicas | Users | CPU Request | CPU Limit | Memory Request | Memory Limit | RPS | Failures |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 1 | 150 | 300 | 150 | 300 | 0.3 | 0% |
| 1 | 5 | 150 | 300 | 150 | 300 | 0.9 | 0% |
| 1 | 5 | 300 | 500 | 300 | 500 | 1.3 | 0% |
| 1 | 10 | 300 | 500 | 300 | 500 | 1.5 | 0% |
| 1 | 20 | 500 | 1000 | 500 | 1000 | 3 | 3% |
| 1 | 50 | 500 | 1000 | 500 | 1000 | - | - |
| 1 - 3 | 50 | 500 | 1000 | 500 | 1000 | 9 | 0% |
