---
id: commands
title: Commands
sidebar_label: Commands
---
This section explores a summary of the `miactl` commands and their functionalities.

:::tip

You can also display a complete help message on the command line by using the `--help` flag postponed to any `miactl`
command or subcommand.  
This way you can also be sure of the available features of the `miactl` version you currently have installed.

:::

## context

This command allows you to manage `miactl` contexts.

The context resource includes the following information:

- **Name:** the name of the context, decided by the user
- **API Base URL:** the base URL of the respective Console endpoint
- **Company ID:** the ID of a Company
- **Project ID:** the ID of a Project belonging to the Company
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
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

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

### auth

The `context auth` subcommand allows you to setup the Console Service Account you want to use to authenticate to the Console.

```sh
miactl context auth [flags]
```

Available flags:
`--client-id string`: the client ID of the service account
`--client-secret string`: the client secret of the service account
`-h, --help`: help for auth
`--jwt-json string`: path of the json containing the json config of a jwt service account

## company

This command allows you to manage `miactl` Companies.

To access the resources, you need an account with the correct permissions.

### list

The `company list` subcommand allows you to view the list of Companies that you are currently enrolled in. The
output will shot the **names**, **IDs**, and the default **Git Provider** and **Pipeline Type** of the Companies.

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

This command allows you to manage `miactl` Projects.

To access the resources, you need an account with the correct permissions.

### list

The `project list` subcommand allows you to view the list of Projects belonging to the Company specified in the current
context. The output will show the **names**, **IDs**, and **Configuration Git paths** of the Projects.

Usage:

```sh
miactl project list [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

## deploy

This command allows you to trigger the deploy pipeline for the selected Project.

Usage:

```sh
miactl deploy ENVIRONMENT [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--deploy-type`, to select a deploy type (default is `smart_deploy`)
- `--no-semver`, to force the deploy without `semver`
- `--revision`, to specify the revision of the commit to deploy

## serviceaccount

### create basic

The `serviceaccount create basic` subcommand allows you to create a new service account for your Company.

Usage:

```sh
miactl serviceaccount create basic NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--role`, the Company role for the service account

### create jwt

The `serviceaccount create jwt` subcommand allows you to create a new service account for your Company that will
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
- `--company-id`, to set the ID of the desired Company
- `--output`, optional flag to save the service account json description in a file at the provided path
- `--role`, the Company role for the service account

## runtime

### environment list

The `runtime environment list` subcommand allows you to see all the environment associated to a given Project.

Usage:

```sh
miactl runtime environment list [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

### list RESOURCE-TYPE

The `runtime list` subcommand allows you to list all resources of a specific type that are running for the
environment associated to a given Project.

Usage:

```sh
miactl runtime list RESOURCE-TYPE ENVIRONMENT [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

### events

The `runtime events` subcommand allows you to see events that are associated with the specific resource in the
given environment.

Usage:

```sh
miactl runtime events ENVIRONMENT RESOURCE-NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

### create job

The `runtime create job` subcommand allows you to manually create a job from a cronjob .

Usage:

```sh
miactl runtime create job ENVIRONMENT [flags]
```

Available flags for the command:

- `--from`, to set the cronjob name from which the job will be created
- `--endpoint`, to set the Console endpoint (default is `https://console.cloud.mia-platform.eu`)
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

## marketplace

View and manage Marketplace items

**WARNING: This command is a beta and may not be stable. Use at your own risk.**

All the subcommands inherit the following flags:

```
      --auth-name string               the name of the miactl auth to use
      --certificate-authority string   path to a cert file for the certificate authority for the selected endpoint
      --company-id string              the ID of the Company
  -c, --config string                  path to the config file default to $HOME/miactl/config
      --context string                 the name of the miactl context to use
      --endpoint string                the address and port of the Mia-Platform Console server
      --insecure-skip-tls-verify       if true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --verbose                        increase the verbosity of the cli output
```

### list

List Marketplace items

#### Synopsis

List the Marketplace items that the current user can access.

**WARNING: This command is a beta and may not be stable. Use at your own risk.**

```
miactl marketplace list [flags]
```

### get

Get a Marketplace item

#### Synopsis

Get a single Marketplace item by its ID

**WARNING: This command is a beta and may not be stable. Use at your own risk.**

```
miactl marketplace get resource-id [flags]
```

### delete

Delete a Marketplace item

#### Synopsis

Delete a single Marketplace item by its ID

**WARNING: This command is a beta and may not be stable. Use at your own risk.**

```
miactl marketplace delete resource-id [flags]
```

### apply

Create or update Marketplace items

#### Synopsis

Create or update one or more Marketplace items.

**WARNING: This command is a beta and may not be stable. Use at your own risk.**

The flag -f accepts either files or directories. In case of directories, it explores them recursively.

Supported formats are JSON (.json files) and YAML (.yaml or .yml files).

The file can contain an image object with the following format:
"image": {
	"localPath": "./someImage.png"
}
The localPath can be absolute or relative to the file location.
The image will be uploaded along with the Marketplace item.
Before being applied, the "image" key will be replaced with the "imageUrl" referring to the uploaded image.
You can retrieve the updated item with the "get" command.

You can also specify the "supportedByImage" in a similar way.

Be aware that the presence of both "image" and "imageUrl" and/or of both "supportedByImage" and "supportedByImageUrl" is ambiguous and raises an error .

```
miactl marketplace apply { -f file-path }... } [flags]
```

#### Examples


```

# Apply the configuration of the file myFantasticGoTemplate.json located in the current directory to the Marketplace
miactl marketplace apply -f myFantasticGoTemplate.json

# Apply the configurations in myFantasticGoTemplate.json and myFantasticNodeTemplate.yml to the Marketplace, with relative paths
miactl marketplace apply -f ./path/to/myFantasticGoTemplate.json -f ./path/to/myFantasticNodeTemplate.yml

# Apply all the valid configuration files in the directory myFantasticGoTemplates to the Marketplace
miactl marketplace apply -f myFantasticGoTemplates
```

#### Options

```
  -f, --file stringArray   paths to JSON/YAML files or folder of files containing a Marketplace item definition
  -h, --help               help for apply
```
