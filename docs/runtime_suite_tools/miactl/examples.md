---
id: examples
title: Examples
sidebar_label: Examples
---
## Create and use a Context

You can have one or more context locally for interacting with one or more installation fo Mia-Platform Console. Below
you can find some examples on how to create multiple contexts and then selecting one of them.

Create a Context for a company on the cloud instance:

```sh
miactl context set paas-company --company-id <your-company-id>
```

Create a Context for specific project in a company on the cloud instance:

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

The list project command will list all poject that the current user can access in the selected company:

```sh
miactl project list
```

Or you can set a different company via flag:

```sh
miactl project list --company-id <your-company-id>
```

## Deploy Project

The deploy command allow you to trigger a new deploy pipeline for the current project in the project. The only
argument needed is the environment id that you want to deploy:

```sh
miactl deploy development
```

Additionally if your context don’t contain the project id you can select it via a flag:

```sh
miactl deploy development --project-id <your-project-id>
```

You can customize the way your project is deployed:

```sh
miactl deploy development --no-semver --revision tags/v1.0.0
```
