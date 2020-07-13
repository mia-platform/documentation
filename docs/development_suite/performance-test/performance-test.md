# Performance Testing

This guide will help you run APIs performance testing.
Website performance testing will not be described here.

## What a performance testing is

Performance testing aims to describe how your infrastructure performs under a particular workload.
So, the output of these tests will show you if your infrastructure can handle the workload.

## Metrics

During tests some metrics should be monitored:

- k8s nodes status: during tests, do all nodes still remain available?
- k8s nodes resources: how many resources are consumed during the tests?
- k8s pods status: are all pods ok or some pods have been restarted? Why?
- k8s pods resources: how many resources are consumed per pod?
- k8s pods CPU throttling: Do some pods request more CPU?
- req/sec average and percentiles: how many req/sec reach your infrastructure?
- bytes/sec average and percentiles: how many bytes/sec reach your infrastructure?
- req count grouped by status code: which is the failure rate?
- req count with TCP errors: how many request fails for non HTTP problem?
- monitoring/log system status: how many logs are you producing?
- connected users/socket: how many connections are concurrently made?
- failure rate: how many request are not 2xx?

## Tools

Depending on the metrics you want to gather, you can use different tools:

- Prometheus: k8s monitoring
- ELK: log monitoring

### Which tools can I use?

There're lot of tools you can use to run performance testing:

- <a href="https://jmeter.apache.org/" target="_blank">JMeter</a>
- <a href="https://locust.io/" target="_blank">locust</a>
- <a href="https://k6.io/" target="_blank">k6</a>
- <a href="https://github.com/wg/wrk" target="_blank">wrk</a>

All tools are good.

## Run

### Before

Before running a performance test, you should ask yourself some questions:

- which APIs would you test?
- is there a cache?
- is there a rate limit?
- are the APIs under login?
- are the APIs under HTTPS?
- would you use KeepAlive or would you rather recreate the connection every time?
- would you use gzip?
- which is the expected response body size?
- which is the expected request body size?
- are you use the redirect from HTTP to HTTPS?

These questions are not easy to answer and there is not one right response: it depends on your business.

For example if your client is a mobile one, the usage of KeepAlive can be wrong because the mobile connection is not so stable as a M2M one. So, we recommend you to avoid using KeepAlive if you deal with a client Mobile. If you deal with M2M, we recommend you instead to use it.

### Identify your `use case`

There's no "I want to test everything in all possible cases". Initially at least. You should think which `use cases` are most important and critical.

### Identify the `run case`

Before starting with 20M users, start small: 5 users can be a good choice. From this kind of `run case`, you can think to the next one depending on how the infrastructure reacts to the test.

For example these `run cases`:

- 5 users
- 30 users
- 50 users
- 100 users
- 300 users
- 1000 users
- 3000 users
- 5000 users
- 10000 users
- 15000 users
- ...

Another thing to change from a run to another is the number of replicas of your pods. Again, here you should start from 1 replica and increse if necessary.

#### When to stop the `run case`

Collecting metrics is important. The most important one is the `failure rate`.
Depending on your context, you can tolerate 0.1%, 0.5%, 1% or 5%. Monitoring this metric you can stop running your `run cases` as soon as you reach your tolerance treshold.

### Start

In order to simulate traffic, you have to run those tests from multiple external machines. But before going this way, consider to run your tests from only one machine: this will simplify your process and allow you to gather some preliminary results. You might avoid a distributed test.

If you want to perform these tests from multiple machines, consider to follow these rules:

- create VM with a OS you know (Ubuntu for example)
- create VM with 4 CPU and 16GB at least
- create VM in the same subnet
- create VM in the same subnet for the cluster-ingress
- use private ip where possible
- disable all firewall
- remove limits imposed by OS (`ulimit -n` for example)

### Output

During tests, remember to always gather results and metrics. In the end, you can summarize the numbers.

These kind of tests should answer the question `how much do we hold?`. It is not easy to answer this question.
Always contextualize your answer: "in this use case, with 5000 users the req/sec are 1000 with a failure rate under 0.5%".
