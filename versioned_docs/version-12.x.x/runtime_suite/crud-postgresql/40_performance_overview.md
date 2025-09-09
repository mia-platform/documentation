---
id: performance_overview
title: Requests and limits
sidebar_label: Performance Overview
---



Here is described a performance test run with [Artillery](https://www.artillery.io/).

## Setup
The CRUD SQL is configured to connect to a MSSQL Server 2019 and deployed with the following resources:
- CPU request: 200m
- CPU limit: 500m
- Memory request: 300Mi
- Memory limit: 500Mi

The table used for the test has the following characteristics:
- number of records: 10
- response size ~3KB

The test consists in requests to the `GET /books` API.

## Results 

Results have been obtained through specific tests implementing a series of requests to the CRUD SQL.
The service has been deployed in a test environment and exposed online through the Mia-Platform Console.
The API that has been tested to verify CRUD SQL performances is:

`GET /books`: used to download a set of data from the _books_ SQL table, this has been tested without filters and pagination.

| Users | Requests Per User | Response OK | Response KO | min response time (ms) | avg response time (ms) | max response time  (ms) |
|:-----:|:-----------------:|:-----------:|:-----------:|:----------------------:|:----------------------:|:-----------------------:|
|   5   |        100        |     500     |      0      |           59           |          215           |           612           |
|  50   |        100        |    5000     |      0      |           36           |          1022          |          2295           |
|  100  |        100        |    10000    |      0      |           39           |          1086          |          2104           |
| 1000  |        100        |   100000    | 844 (users) |           33           |          1556          |          9992           |
