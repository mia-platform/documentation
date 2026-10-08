---
id: microservice-memory-resources
title: Service Memory Resources
sidebar_label: Define memory resources
---

In the field Memory Resources, you have to specify the minimum (_Request_) number of mebibytes (Mi) that the container needs and the maximum (_Limit_) number of mebibytes (Mi) that it can use.

![memory-resources](img/memory-resources.png)

Memory Resource, which is measured in bytes, can be expressed as a plain integer or a fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.

The different suffixes, applied to different integers or fixed-point integers, can express the same Memory Resources value. For example: 128974848, 129e6, 129M and 123Mi are approximately the same value.

:::info
In the microservice detail of Mia-Platform Console, you can only express the Memory Resource value in Mi.
:::

If the maximum number of Memory Resources is not expressed, there could be two situations:

- The Container can use the whole memory available on the Node. In this case, the probability of the Container to be killed is higher.

- A default Memory Resource limit can be assigned to the Container if its relative namespace has a default memory limit.

You can use interpolated variables to value the memory resources (e.g. `{{MEMORY_MIN}}`). The variables should contain only numerical values.

:::note
The check about that _Limit_ have to be greater than _Request_ won't be done if you use interpolated variables.
:::

:::info
To learn more about Memory Resources, please visit [this page](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#memory-units) of Kubernetes Docs.
:::
