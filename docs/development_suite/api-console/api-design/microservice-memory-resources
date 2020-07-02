In the field Memory Resources, you have to specify the minimum number of mebibytes (Mi) that the container needs and the maximum number of mebibytes (Mi) that it can use.

![]()

Memory Resource, which is measured in bytes, can be expressed as a plain integer or a fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.

The different suffixes, applied to different integers or a fixed-point integers, can express the same Memory Resource value. For example, 128974848, 129e6, 129M and 123Mi are approximately the same value.

If the maximum number of Memory Resources is not expressed, there could be two situations:

* The Container can use the whole memory available on the Node.

* The Container can be assigned to a default Memory Resource limit if the relative namespace has a default memory limit

If you do not specify a memory limit for a Container, one of the following situations applies:

The Container has no upper bound on the amount of memory it uses. The Container could use all of the memory available on the Node where it is running which in turn could invoke the OOM Killer. Further, in case of an OOM Kill, a container with no resource limits will have a greater chance of being killed.

The Container is running in a namespace that has a default memory limit, and the Container is automatically assigned the default limit. Cluster administrators can use a LimitRange to specify a default value for the memory limit.


To learn more about Memory Resources, please visit [this page](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#memory-units) of Kubernetes Docs.
