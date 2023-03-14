---
id: performance
title: Performance
sidebar_label: Performance
---
In this section we provide some guidelines on how to configure the Form Service Backend for optimal performance and efficiency.

## Cache lookup

If you use the [form data CSV export](overview.md#form-data-csv-export) feature, available since version **1.7.0**, you should monitor the CPU and memory usage of your microservice to ensure the size of the cache does not negatively affect your service performance.

We ran some tests to evaluate the CPU and memory usage and response times depending on the cache size and state (if it's empty or full). We configured a single lookup on users, resolving their Auth0 ID in the full name. The size of the cache, meaning the number of its entries, corresponds to the total number of records from all the data sources configured in the lookups. So, for example, you configure two lookups for users and locations and you have 50000 users and 5000 locations, the number of cache entries you can expect is 55000 (50000 users plus 5000 locations).

The Form Service Backend microservice was configured as follows:

- CPU request: 50 m
- CPU limits: 200 m
- RAM request: 50 Mi
- RAM limits: 200 Mi 

The following table summarizes the results of the tests:

| Cache entries | Estimated cache size (in MiB) | Response time (cache empty) | Response time (cache full) |
|---------------|-------------------------------|-----------------------------|----------------------------|
| 5000          | 2                             | ~6 seconds                  | Less than 1 second         |
| 10000         | 5                             | ~7 seconds                  | Less than 1 second         |
| 50000         | 9                             | ~15 seconds                 | Less than 1 second         |
| 100000        | 12                            | ~40 seconds                 | Less than 1 second         |
| 250000        | 50                            | ~50 seconds                 | Less than 1 second         |
 
The main takeways from the tests are:

- memory usage grows proportionally with the size of the cache, so we recommend setting up the memory limits according to the size of the lookup dataset (in the example, the cache entries reflect the total number of users in the lookup data source);
- response time can grow significantly (by an order of magnitude) when the cache is empty, while we noticed a constant level of performance when the cache is full.

If you are dealing with hundreds of thousands or millions of lookup records, we strongly recommend running some load tests to find the best combination of CPU and memory request and limits.
