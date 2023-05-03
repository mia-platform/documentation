---
id: deploy
title: deploy Command
sidebar_label: Deploy
---
The `deploy` command deploys the specified files in a given namespace of a Kubernetes cluster.

Flags:

- `--filename` or `-f`: file and/or folder paths containing data to interpolate
- `--deploy-type` (default to `deploy_all`): set the deployment type (accepted values: `deploy_all`, `smart_deploy`)
- `--force-deploy-when-no-semver`: flag used to force deploy of services that are not following semantic versioning.
- `--ensure-namespace` (default to `true`): set if the namespace existence should be ensured. By default it is set to true so that the namespace existence is checked and, if it not exists, created. If set to false, it throws if namespace not already exists.

To make the command work, also the following flags described in [options](./25_options.md) are required:

- `--namespace`: to specify the namespace in which the resources are deployed
- The set of flags required to connect to the Kubernetes cluster

## Resources application order

By default resources to be deployed are applied in a [default order](https://github.com/mia-platform/mlp/blob/main/pkg/resourceutil/sort.go) based on their `Kind`. It can be overridden by annotating the target resource with `mia-platform.eu/apply-before-kinds`.  
This annotation takes a comma-separated list of kinds for which the resource must be applied before. If some of the specified kinds is not managed in the default order listing they are ignored. Any resource having this annotation falls outside the kind-based sorting logic and therefore cannot be applied after other resources having in their `mia-platform.eu/apply-before-kinds` annotation its kind.
Below there is an example of a resource that must be applied before `Pod`s and `Deployment`s:
``` yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
  annotations:
    mia-platform.eu/apply-before-kinds: Pod, Deployment
spec:
  template:
    spec:
      containers:
        - name: busybox
          image: busybox 
          command:
            - sleep
          args:
            - 30s
```

## Await resources completion

During the deploy phase resources are applied sequentially one after the other. `mlp` allows to wait for the completion of a resource using the annotation `mia-platform.eu/await-completion` on the specific resource to be awaited. The annotation value should be a duration string as expected by the [`time.ParseDuration`](https://pkg.go.dev/time#ParseDuration) (e.g. `100ms`, `10s`, `1m`) function that specifies the time to wait for completion before a timeout error is triggered. 

The resources supported by this annotation:

- **Job**: the resource will be applied by `mlp` then the tool will listen to cluster events until the job status becomes `Completed`
- **ExternalSecret**: this [CRD](https://external-secrets.io/v0.5.4/api-externalsecret/) will be applied and then `mlp` will watch cluster events until the resource `.status.refreshTime` is updated

## Delete resources before applying them

By annotating a resource with `mia-platform.eu/delete-before-apply`, having arbitrary value, the user can force `mlp` to delete the corresponding resource on the cluster before re-creating it. If the annotated resource is not already present on the cluster no additional operations will occur.
