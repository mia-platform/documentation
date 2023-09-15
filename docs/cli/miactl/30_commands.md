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
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--company-id`, to set the ID of the desired company
- `--project-id`, to set the ID of the desired project

### use

The `context use` subcommand allows you to select an existing context as the current one.

```sh
miactl context use CONTEXT [flags]
```

`CONTEXT` must be the name of an existing context.

This command does not include any additional flags besides the default ones.

### list

The `context list` subcommand allows you see all the context available in the current configuration file selected.

```sh
miactl context list
```

## company

This command allows you to manage `miactl` companies.

To access the resources, you need an account with the correct permissions.

### list

The `company list` subcommand allows you to view the list of companies that you are currently enrolled in. The
output will shot the **names**, **IDs**, and the default **git provider** and **pipeline type** of the companies.

Usage:

```sh
miactl company list [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one

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

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired company

## deploy

This command allows you to trigger the deploy pipeline for the selected project.

Usage:

```sh
miactl deploy ENVIRONMENT [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired company
- `--project-id`, to set the ID of the desired project
- `--deploy-type`, to select a deploy type (default is `smart_deploy`)
- `--no-semver`, to force the deploy without `semver`
- `--revision`, to specify the revision of the commit to deploy

## serviceaccount

### create basic

The `serviceaccount create basic` subcommand allows you to create a new service account for your company.

Usage:

```sh
miactl serviceaccount create basic NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired company
- `--role`, the company role for the service account

### create jwt

The `serviceaccount create jwt` subcommand allows you to create a new service account for your company that will
use the jwt authorization method.

Usage:

```sh
miactl serviceaccount create jwt NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired company
- `--output`, optional flag to save the service account json description in a file at the provided path
- `--role`, the company role for the service account

## runtime

### environment list

The `runtime environment list` subcommand allows you to see all the environment associated to a given project.

Usage:

```sh
miactl runtime environment list [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired company
- `--project-id`, to set the ID of the desired project
