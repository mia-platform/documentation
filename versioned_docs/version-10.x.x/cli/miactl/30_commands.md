---
id: commands
title: Commands
sidebar_label: Commands
---
This section explores the `miactl` commands and their functionalities.

## context

This command allows you to manage `miactl` contexts.

The context resource includes the following information:

- **Name:** the name of the context, decided by the user
- **API Base URL:** the base URL of the respective Console endpoint
- **Company ID:** the ID of a company
- **Project ID:** the ID of a project belonging to the company
- **CA Cert:** the path to a custom CA certificate

Contexts are stored in the `miactl` configuration file, that can be found in `$HOME/.config/miactl/config.yaml`.
The configuration file, along with its directory, will be created automatically at your first CLI usage.

### set

The `context set` subcommand allows you to either add a new context, or edit an existing context.

```sh
miactl context set CONTEXT [flags]
```

`CONTEXT` is the context name.

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--ca-cert`, to provide the path to a custom CA certificate
- `--company-id`, to set the ID of the desired company
- `--project-id`, to set the ID of the desired project

### use

The `context use` subcommand allows you to select an existing context as the current one.

```sh
miactl context use CONTEXT [flags]
```

`CONTEXT` must be the name of an existing context.

This command does not include any additional flags besides the default ones.

## project

This command allows you to manage `miactl` projects.

To access the resources, you need an account with the correct permissions.

### list

The `project list` subcommand allows you to view the list of projects belonging to the company specified in the current
context. The output will show the **names**, **IDs**, and **Configuration Git paths** of the projects.

Usage:

```sh
miactl project list [flags]
```

Available flags for the command:

- `--ca-cert`, to override the path to the custom CA certificate
- `--company-id`, to set the company ID from command line
- `--context`, to specify a different context from the current one
- `--endpoint`, to override the Console endpoint
- `--insecure`, to skip certificate check

## deploy

This command allows you to trigger the deploy pipeline for the selected project.

Usage:

```sh
miactl deploy ENVIRONMENT [flags]
```

Available flags for the command:

- `--ca-cert`, to override the path to the custom CA certificate
- `--company-id`, to set the company ID from command line
- `--context`, to specify a different context from the current one
- `--deploy-type`, to select a deploy type (default is `smart_deploy`)
- `--endpoint`, to override the Console endpoint
- `--no-semver`, to force the deploy without `semver`
- `--insecure`, to skip certificate check
- `--project-id`, to set the project ID from command line
- `--revision`, to specify the revision of the commit to deploy (default `HEAD`)
