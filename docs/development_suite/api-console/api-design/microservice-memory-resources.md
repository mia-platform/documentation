In the field Memory Resources, you have to specify the minimum number of mebibytes (Mi) that the container needs and the maximum number of mebibytes (Mi) that it can use.

![memory-resources](img/memory-resources.png)

Memory Resource, which is measured in bytes, can be expressed as a plain integer or a fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.

The different suffixes, applied to different integers or a fixed-point integers, can express the same Memory Resource value. For example: 128974848, 129e6, 129M and 123Mi are approximately the same value.

If the maximum number of Memory Resources is not expressed, there could be two situations:

* The Container can use the whole memory available on the Node. In this case, the probability of the Container to be killed is higher.

* A default Memory Resource limit can be assigned to the Container if its relative namespace has a default memory limit.

To learn more about Memory Resources, please visit [this page](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#memory-units) of Kubernetes Docs.
