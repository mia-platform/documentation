---
id: examples
title: Examples
sidebar_label: Examples
---
## Create and use a Context

You can have one or more context locally for interacting with one or more installation fo Mia-Platform Console. Below
you can find some examples on how to create multiple contexts and then selecting one of them.

Create a Context for a Company on the cloud instance:

```sh
miactl context set paas-company --company-id <your-company-id>
```

Create a Context for specific Project in a Company on the cloud instance:

```sh
miactl context set paas-project --company-id <your-company-id> --project-id <your-project-id>
```

Create a Context for connecting on a self hosted instance:

```sh
miactl context set example-console --endpoint https://example.com
```

Create a Context for connecting on a self hosted instance exposed via a self signed certificate:

```sh
miactl context set example-private --endpoint https://console.private --ca-cert /path/to/custom/private/ca.crt
```

Use the context named `paas-project`:

```sh
miactl context use paas-project
```

## List Projects

The `list project` command will list all Projects that the current user can access in the selected Company:

```sh
miactl project list
```

Or you can set a different Company via flag:

```sh
miactl project list --company-id <your-company-id>
```

## Deploy Project

The deploy command allows you to trigger a new deploy pipeline for the current Environment in the Project. The only
argument needed is the Environment ID that you want to deploy:

```sh
miactl deploy development --revision main
```

Additionally, if your context doesn’t contain the Project ID, you can select it via a flag:

```sh
miactl deploy development --project-id <your-project-id> --revision main
```

You can customize the way your Project is deployed:

```sh
miactl deploy development --no-semver --revision tags/v1.0.0
```
