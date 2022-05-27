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

To make the command work, also the following flags described in [options](./options.md) are required:

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
