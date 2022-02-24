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
