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

- `--auth-name`, to set the name of the authentication to use (discover more on the [dedicated documentation section](#auth))
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--environment`, to set the environment scope for the command

:::warning
If you want to use `miactl` with a _Service Account_, **remember to specify** the  `--auth-name` flag, otherwise
_miactl_ will try to perform a _User Login_, opening the browser for authentication the user.
:::

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
miactl context auth NAME [flags]
```

Available flags:

- `--client-id string`: the client ID of the service account
- `--client-secret string`: the client secret of the service account
- `-h, --help`: help for auth
- `--jwt-json string`: path of the json containing the json config of a jwt service account

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

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one

### iam

The `company iam` subcommands are used for managing the RBAC permissions associated with a company. Only
**Company Owners** can modify, add or remove RBAC authorization to the company.

#### list

The `company iam list` subcommand allows you to view the list of all the different identity associated with the Company
specified in the current context. The output will show the **names**, **types** and **permissions** associated with
them.

Usage:

```sh
miactl company iam list [flags]
```

Available flags for the command:

- `--groups`, filter IAM entities to show only groups. Mutally exclusive with `users` and `serviceAccounts`
- `--serviceAccounts`, filter IAM entities to show only service accounts. Mutally exclusive with `users` and `groups`
- `--users`, filter IAM entities to show only users. Mutally exclusive with `groups` and `serviceAccounts`
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

##### users

The `company iam list users` subcommand allows you to view the list of all users that have access to your company
directly or via one or more groups.

Usage:

```sh
miactl company iam list users [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

##### groups

The `company iam list groups` subcommand allows you to view the list of all groups that are available in your company.

Usage:

```sh
miactl company iam list groups [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

##### serviceaccounts

The `company iam list serviceaccounts` subcommand allows you to view the list of all service accounts that are available
in your company.

Usage:

```sh
miactl company iam list serviceaccounts [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

#### add serviceaccount basic

The `company iam add serviceaccount basic` subcommand allows you to create a new service account for your Company.

Usage:

```sh
miactl company iam add serviceaccount basic NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--role`, the Company role for the service account

#### add serviceaccount jwt

The `company iam add serviceaccount jwt` subcommand allows you to create a new service account for your Company that will
use the jwt authorization method.

Usage:

```sh
miactl company iam add serviceaccount jwt NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--output`, optional flag to save the service account configuration as json in a file at the provided path
- `--role`, the Company role for the service account

#### add user

The `company iam add user` subcommand allows you to add a user in your Company with the given role.

Usage:

```sh
miactl company iam add user [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--email`, the email of the user to add
- `--role`, the Company role of the user

#### add group

The `company iam add group` subcommand allows you to add a group in your Company with the given role.

Usage:

```sh
miactl company iam add group NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--role`, the Company role of the user

#### add group-member

The `company iam add group-member` subcommand allows you to add one or more users to a group in your Company.

Usage:

```sh
miactl company iam add group-member [flags]
```

Available flags for the command:

- `--group-id`, the group id where to add the users
- `--user-email`, the list of user email to add to the group
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

#### edit user

The `company iam edit user` subcommand allows you to edit the role associated to a user in your Company.

Usage:

```sh
miactl company iam edit user [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--user-id`, the id of the user to edit
- `--role`, the new Company role of the user

#### edit serviceaccount

The `company iam edit serviceaccount` subcommand allows you to edit the role associated to a service account in
your Company.

Usage:

```sh
miactl company iam edit serviceaccount [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--service-account-id`, the id of the service account to edit
- `--role`, the new Company role of the service account

#### edit group

The `company iam edit group` subcommand allows you to edit the role associated to a group in your Company.

Usage:

```sh
miactl company iam edit group [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--group-id`, the id of the group to edit
- `--role`, the new Company role of the group

#### remove user

The `company iam remove user` subcommand allows you to remove a user from a company. Alternatively you can use the
`no-include-groups` flag for only remove the role directly associated to a user, but leave intact its groups memberships.

Usage:

```sh
miactl company iam remove user [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--user-id`, the id of the user to remove
- `--no-include-groups`, set this flag for keeping the user memberhip, and only remove the role attached to the user

#### remove group

The `company iam remove group` subcommand allows you to remove a group and all its memberships from a company.

Usage:

```sh
miactl company iam remove group [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--group-id`, the id of the group to remove

#### remove serviceaccount

The `company iam remove serviceaccount` subcommand allows you to remove a service account in your Company.

Usage:

```sh
miactl company iam remove serviceaccount [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--service-account-id`, the id of the service account to remove

#### remove group-member

The `company iam remove group-member` subcommand allows you to remove one or more users from a group in your Company.

Usage:

```sh
miactl company iam remove group-member [flags]
```

Available flags for the command:

- `--group-id`, the group id where to remove the users
- `--user-id`, the list of user ids to remove from the group
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

### rules

Rules command helps you manage different rules for configuration update for the whole Company or specific Projects.

:::tip
This feature is currently in closed preview and may be subject to breaking changes, reach out to your Mia-Platform referent
if you are interested in use it.
:::

#### list

List available rules for the Company or for a specific Project.

Usage:

```sh
miactl company rules list [flags]
```

Available flags for the command:

- `--company-id`, the id of the Company
- `--project-id`, the id of the Project (if provided the command will print available rules for the project,
  together with the rules inherited from the Company)

#### update

Helps you update rules for a Company or for a specific Project

Usage:

```sh
miactl company rules update [flags]
```

Available flags for the command:

- `--company-id`, the id of the Company
- `--project-id`, the id of the Project (if provided the command will update the rules for the specified Project only)
- `-f`, path to the file where the rules are saved

<details>
<summary>File example</summary>

```json
[
  {
    "roleIds": ["developer"],
    "disallowedRuleSet": [
    {"ruleId": "endpoint.security.edit"}
    ]
  }
]
```

</details>

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

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

### describe

The `project describe` subcommand allows you to inspect the current configuration of an Application Project in Console.

Specify the correct flags to indicate which revision/version/branch/tag to describe.

For Application Projects using Enhanced Workflow specify either the `revision` or `version` flag. For Projects using the standard workflow specify either the `branch` or `tag` flag.

If no configuration is found for the specified revision/version/branch/tag flag, an empty configuration is returned.

Usage:

```sh
miactl project describe [flags]
```

Flags available for this command:

- `--project-id`: required. The ID of the Application Project to describe
- `--revision`: for projects using Enhanced Workflow. The revision of the Application Project to describe
- `--version`: for projects using Enhanced Workflow. The version of the Application Project to describe
- `--branch`: for projects using the standard workflow. The branch of the Application Project to describe
- `--tag`: for projects using the standard workflow. The tag of the Application Project to describe
- `--output` or `-o`: output format. Allowed values: json, yaml (default is "json")

### apply

The `project apply` subcommand allows you to update an already existing Application Project configuration by providing a valid configuration file from your local machine. This command creates a new snapshot for the specified ref using the provided configuration overriding the previous configuration.

This feature is available only for Application Projects using Enhanced Workflow.

Usage:

```sh
miactl project apply [flags]
```

Flags available for this command:

- `--project-id`: required. The ID of the Application Project
- `--revision`: required. The revision of the Application Project
- `--file` or `-f`: required. The path to the configuration file. Supported formats for configuration file are yaml and json
- `--message` or `-m`: the custom message used to save the configuration. If not specified, a default message is used

### iam

The `project iam` subcommands are used for managing the RBAC permissions associated with a project. Only
**Company Owners** and **Project Administrators** can modify, add or remove RBAC authorization for a project.

#### list

The `project iam list` subcommand allows you to view the list of all the different identity that has access to a
project.

Usage:

```sh
miactl project iam list [flags]
```

Available flags for the command:

- `--groups`, filter IAM entities to show only groups. Mutally exclusive with `users` and `serviceAccounts`
- `--serviceAccounts`, filter IAM entities to show only service accounts. Mutally exclusive with `users` and `groups`
- `--users`, filter IAM entities to show only users. Mutally exclusive with `groups` and `serviceAccounts`
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

#### edit RESOURCE-NAME

The `project iam edit` subcommand allows you to alternatively update the role assigned to the current project or
one of its environment for one of the different `IAM` entity types:

- `group`
- `service account`
- `user`

Usage:

```sh
miactl project edit [user|group|serviceaccount] [flags]
```

Available flags for the command:

- `--groups`, filter IAM entities to show only groups. Mutally exclusive with `users` and `serviceAccounts`
- `--serviceAccounts`, filter IAM entities to show only service accounts. Mutally exclusive with `users` and `groups`
- `--users`, filter IAM entities to show only users. Mutally exclusive with `groups` and `serviceAccounts`
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--project-role`, the new role for the current project
- `--entity-id`, the entity id to change
- `--environment`, the environment where to change the role
- `--environment-role`, the new role for the selected environment

#### remove-role RESOURCE-NAME

The `project iam remove-role` subcommand allows you to alternatively delete the custom role assigned to one of the
different `IAM` entity types for the project or one of its environments.

Usage:

```sh
miactl project remove-role [user|group|serviceaccount] [flags]
```

Available flags for the command:

- `--groups`, filter IAM entities to show only groups. Mutally exclusive with `users` and `serviceAccounts`
- `--serviceAccounts`, filter IAM entities to show only service accounts. Mutally exclusive with `users` and `groups`
- `--users`, filter IAM entities to show only users. Mutally exclusive with `groups` and `serviceAccounts`
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--entity-id`, the entity id to change
- `--environment`, set the flag to the environment name for deleting the role for that environment

### import

The `project import` subcommand allows you to import kubernetes resource yaml definition in an empty Mia-Platform Console project.

The import function is lossy and some advanced configuration can be lost. We recommend to check the generated file
before trying a deploy to check if anything is amiss.

Usage:

```sh
miactl project import [flags]
```

Available flags for the command:

- `--filename`, file or folder path containing the resource definitions to import
- `--project-id`, to set the ID of the desired Project
- `--revision`, to specify the revision of the commit to deploy
- `--auth-name`, the name of the miactl auth to use
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company

## deploy

The `deploy` command allows you to manage the deployment of your Projects.

Available subcommands are the following ones:

```sh
  trigger       Trigger a deploy pipeline
  add status    Add a new deploy status
```

### trigger

This command allows you to trigger the deploy pipeline for the selected Project.

Usage:

```sh
miactl deploy trigger ENVIRONMENT [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--deploy-type`, to select a deploy type (default is `smart_deploy`)
- `--no-semver`, to force the deploy without `semver`
- `--revision`, to specify the revision of the commit to deploy

### add status

This command allows you to add a new deploy status for the selected trigger id pipelines of the Project,
only for those integration which trigger the pipeline with a trigger id (e.g. Jenkins integration).

Usage:

```sh
miactl deploy add status STATUS [flags]
```

where `STATUS` must be one of: `success`, `failed`, `canceled`, `skipped`.

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--trigger-id`, to specify the trigger id to update

## extensions

The `extensions` command allows you to manage Company extensions.

Available subcommands are the following ones:

```sh
  list        List registered extensions
  get         Retrieve data of a specific extension
  apply       Create or update an extension
  activate    Activate an extension
  deactivate  Deactivate an extension
  delete      Delete extension
```

### list

The `extensions list` command helps you gathering available extension in your Company

Usage:

```sh
miactl extensions list [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--resolve-details` to evaluate all the extension details including `visibilities`, `menu`, `category` and `permissions`

### get

The `extensions get` command helps you gathering information about a specific extension in your Company

Usage:

```sh
miactl extensions get [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--extension-id` to set the ID of the desired extension.
- `--output=json|yaml` to control the printed output format.

### apply

The `extensions apply` command can be used to register new extensions or update an existing one.

It accepts an Extension Manifest either in `yaml` or `json` format

<details>
<summary>Example JSON Manifest</summary>

```json
{
  "name": "Extension 1",
  "description": "My extension 1",
  "entry": "https://example.com/",
  "activationContexts": ["project"],
  "destination": {
    "id": "runtime",
    "path": "/"
  },
  "iconName": "PiHardDrives",
  "menu": {
    "id": "extension-1",
    "labelIntl": {
        "en": "SomeLabel",
        "it": "SomeLabelInItalian"
    },
    "order": 200.0,
  },
  "category": {
    "id": "workloads",
  }
}
```

</details>

<details>
<summary>Example YAML Manifest</summary>

```yaml
name: Extension 1
description: My extension 1
entry: https://example.com/
activationContexts:
  - project
destination:
  id: runtime
  path: "/"
iconName: PiHardDrives
menu:
  id: extension-1
  labelIntl:
    en: SomeLabel
    it: SomeLabelInItalian
  order: 200
category:
  id: workloads
```

</details>

Usage:

```sh
miactl extensions apply [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--file-path` (`-f`) **required** to specify the path to the extension manifest
- `--extension-id` to set the ID of the extension, required for updating an existing extension.

:::tip
In order to specify whether a create or an update is needed you have to use the `--extension-id`
flag or specify the `extensionId` property in the manifest file.

You can get the **extension id** by using the [extensions list](#list-5) command or
in the apply response after creating the extension.
:::

### activate

The `extensions activate` command can be used to activate an existing extension.

:::tip
Please note that, based on provided `contexts`, an extension can be activated for the whole Company or for specific Projects.

By using the `routes.locationId` option, you can specify where the extension is available, therefore
you can create an extension shown on the Project runtime and activate it for the whole Company context.
Such extension will be visible by all the Projects.

For further information checkout the [official documentation](/products/console/console-extensibility/activation.md).
:::

Usage:

```sh
miactl extensions activate [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--project-id` to set the ID of the desired project, if specified, the extension will be activated only for this
  project only
- `--extension-id` **required** to set the ID of the extension

### deactivate

The `extensions deactivate` command can be used to deactivate an existing extension.

:::tip
Please note that if an extension has been activated on the whole Company it can't be deactivated on a specific Project;
you have to deactivate on the whole Company and activate it on the desired Projects.
:::

Usage:

```sh
miactl extensions deactivate [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--project-id` to set the ID of the desired project, if specified, the extension will be deactivated only for this
  project only
- `--extension-id` **required** to set the ID of the extension.

### delete

The `extensions delete` command can be used to delete an existing extension.

Usage:

```sh
miactl extensions delete [flags]
```

Available flags for the command:

- `--company-id` to set the ID of the desired Company
- `--extension-id` **required** to set the ID of the extension, required for updating an existing extension.

## runtime

### environment list

The `runtime environment list` subcommand allows you to see all the environment associated to a given Project.

Usage:

```sh
miactl runtime environment list [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project

### api-resources

The `runtime api-resources` subcommand allows you to list all the currently supported resources that you can use on
the `list` command.

Usage:

```sh
miactl runtime api-resources [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one

### list RESOURCE-TYPE

The `runtime list` subcommand allows you to list all resources of a specific type that are running for the
environment associated to a given Project.

Use `miactl runtime api-resources` for a complete list of currently supported resources.

Usage:

```sh
miactl runtime list RESOURCE-TYPE [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--environment`, to set the environment scope for the command

### events

The `runtime events` subcommand allows you to see events that are associated with the specific resource in the
given environment.

Usage:

```sh
miactl runtime events RESOURCE-NAME [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--environment`, to set the environment scope for the command

### create job

The `runtime create job` subcommand allows you to manually create a job from a cronjob .

Usage:

```sh
miactl runtime create job [flags]
```

Available flags for the command:

- `--from`, to set the cronjob name from which the job will be created
- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--environment`, to set the scope for the command
- `--waitJobCompletion`, (default `false`) to wait for the job completion before exiting
- `--waitJobTimeoutSeconds`, (default `600`, 10 minutes) to set a maximum wait timeout for the job completion

### logs

The `runtime logs` subcommand allows you to fetch or stream logs of running pods in the current context using a
regex query.

You can write any regex compatible with RE2 excluding -C. The regex than will be used to filter down the list of
pods available in the current context and then the logs of all their containers will be displayed.

Usage:

```sh
miactl runtime logs POD-QUERY [flags]
```

Available flags for the command:

- `--endpoint`, to set the Console endpoint
- `--certificate-authority`, to provide the path to a custom CA certificate
- `--insecure-skip-tls-verify`, to disallow the check the validity of the certificate of the remote endpoint
- `--context`, to specify a different context from the currently selected one
- `--company-id`, to set the ID of the desired Company
- `--project-id`, to set the ID of the desired Project
- `--environment`, to set the environment scope for the command
- `--follow`, to keep open the stream and see the logs live as they will be produced

## marketplace

:::warning
This command and its subcommands are deprecated from Mia-Platform Console v14.0.0. Please use [catalog](#catalog) command instead.
:::

View and manage Marketplace items

All the subcommands inherit the following flags:

```sh
      --auth-name string               the name of the miactl auth to use
      --certificate-authority string   path to a cert file for the certificate authority for the selected endpoint
      --company-id string              the ID of the Company
  -c, --config string                  path to the config file default to $HOME/miactl/config
      --context string                 the name of the miactl context to use
      --endpoint string                the address and port of the Mia-Platform Console server
      --insecure-skip-tls-verify       if true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
  -v  --verbose                        increase the verbosity of the cli output
```

### list

List Marketplace items

#### Synopsis

List the Marketplace items that the current user can access.

#### Usage

```sh
miactl marketplace list --company-id company-id [FLAGS]...
```

#### Flags

- `--public` - if this flag is set, the command fetches not only the items from the requested company, but also the public Marketplace items from other companies.

### get

Get a Marketplace item

#### Synopsis

Get a single Marketplace item

You need to specify either:

- the companyId, itemId and version, via the respective flags (recommended). The company-id flag can be omitted if it is already set in the context.
- the ObjectID of the item with the flag object-id

Passing the ObjectID is expected only when dealing with deprecated Marketplace items missing the itemId and/or version fields.
Otherwise, it is preferable to pass the tuple companyId-itemId-version.

```bash
miactl marketplace get { --item-id item-id --version version } | --object-id objectID [FLAGS]...
```

### delete

Delete a Marketplace item

#### Synopsis

Delete a single Marketplace item

You need to specify either:

- the companyId, itemId and version, via the respective flags (recommended). The company-id flag can be omitted if it is already set in the context.
- the ObjectID of the item with the flag object-id

Passing the ObjectID is expected only when dealing with deprecated Marketplace items missing the itemId and/or version fields.
Otherwise, it is preferable to pass the tuple companyId-itemId-version.

```bash
miactl marketplace delete { --item-id item-id --version version } | --object-id object-id [flags]...
```

### apply

Create or update Marketplace items

#### Synopsis

Create or update one or more Marketplace items.

The flag -f accepts either files or directories. In case of directories, it explores them recursively.

Supported formats are JSON (.json files) and YAML (.yaml or .yml files).

The file can contain an image object with the following format:

```json
"image": {
  "localPath": "./someImage.png"
}
```

The localPath can be absolute or relative to the file location.
The image will be uploaded along with the Marketplace item.
Before being applied, the "image" key will be replaced with the "imageUrl" referring to the uploaded image.
You can retrieve the updated item with the "get" command.

You can also specify the "supportedByImage" in a similar way.

Be aware that the presence of both "image" and "imageUrl" and/or of both "supportedByImage" and "supportedByImageUrl" is ambiguous and raises an error.

```bash
miactl marketplace apply { -f file-path }... } [flags]
```

#### Examples

```bash

# Apply the configuration of the file myFantasticGoTemplate.json located in the current directory to the Marketplace
miactl marketplace apply -f myFantasticGoTemplate.json

# Apply the configurations in myFantasticGoTemplate.json and myFantasticNodeTemplate.yml to the Marketplace, with relative paths
miactl marketplace apply -f ./path/to/myFantasticGoTemplate.json -f ./path/to/myFantasticNodeTemplate.yml

# Apply all the valid configuration files in the directory myFantasticGoTemplates to the Marketplace
miactl marketplace apply -f myFantasticGoTemplates
```

#### Options

```bash
  -f, --file stringArray   paths to JSON/YAML files or folder of files containing a Marketplace item definition
  -h, --help               help for apply
```

### list-versions

List all the available versions of a specific Marketplace item.

#### Synopsis

The flag `--item-id` or `-i` accepts the `itemId` of the Item.

```bash
miactl marketplace list-versions -i some-item
```

## catalog

:::info
This command and its subcommands use APIs that are available from Mia-Platform Console v14.0.0. If you are using a previous Console version, use [marketplace](#marketplace) command instead.
:::

View and manage Catalog items

All the subcommands inherit the following flags:

```sh
      --auth-name string               the name of the miactl auth to use
      --certificate-authority string   path to a cert file for the certificate authority for the selected endpoint
      --company-id string              the ID of the Company
  -c, --config string                  path to the config file default to $HOME/miactl/config
      --context string                 the name of the miactl context to use
      --endpoint string                the address and port of the Mia-Platform Console server
      --insecure-skip-tls-verify       if true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
  -v  --verbose                        increase the verbosity of the cli output
```

### list

List Catalog items

#### Synopsis

List the Catalog items that the current user can access. Results are paginated and by default only the first page is shown.

#### Usage

```sh
miactl catalog list --company-id company-id [FLAGS]...
```

#### Flags

- `--public` - if this flag is set, the command fetches not only the items from the requested company, but also the public item type definitions from other companies.
- `--page` - specify the page to fetch, default is 1

### get

Get a Catalog item

#### Synopsis

Get a single Catalog item

You need to specify the companyId, itemId and version, via the respective flags (recommended). The company-id flag can be omitted if it is already set in the context.

```bash
miactl catalog get { --item-id item-id --version version } ...
```

### delete

Delete a Catalog item

#### Synopsis

Delete a single Catalog item

You need to specify the companyId, itemId and version, via the respective flags (recommended). The company-id flag can be omitted if it is already set in the context.

```bash
miactl catalog delete { --item-id item-id --version version } ...
```

### apply

Create or update Catalog items

#### Synopsis

Create or update one or more Catalog items.

The flag -f accepts either files or directories. In case of directories, it explores them recursively.

Supported formats are JSON (.json files) and YAML (.yaml or .yml files).

The file can contain an image object with the following format:

```json
"image": {
  "localPath": "./someImage.png"
}
```

The localPath can be absolute or relative to the file location.
The image will be uploaded along with the Marketplace item.
Before being applied, the "image" key will be replaced with the "imageUrl" referring to the uploaded image.
You can retrieve the updated item with the "get" command.

You can also specify the "supportedByImage" in a similar way.

Be aware that the presence of both "image" and "imageUrl" and/or of both "supportedByImage" and "supportedByImageUrl" is ambiguous and raises an error.

```bash
miactl catalog apply { -f file-path }... } [flags]
```

#### Examples

```bash

# Apply the configuration of the file myFantasticGoTemplate.json located in the current directory to the Catalog
miactl catalog apply -f myFantasticGoTemplate.json

# Apply the configurations in myFantasticGoTemplate.json and myFantasticNodeTemplate.yml to the Catalog, with relative paths
miactl catalog apply -f ./path/to/myFantasticGoTemplate.json -f ./path/to/myFantasticNodeTemplate.yml

# Apply all the valid configuration files in the directory myFantasticGoTemplates to the Catalog
miactl catalog apply -f myFantasticGoTemplates
```

#### Options

```bash
  -f, --file stringArray   paths to JSON/YAML files or folder of files containing a Marketplace item definition
  -h, --help               help for apply
```

### list-versions

List all the available versions of a specific Catalog item.

#### Synopsis

The flag `--item-id` or `-i` accepts the `itemId` of the Item.

```bash
miactl catalog list-versions -i some-item
```

## item type definition

:::info
This command and its subcommands use APIs that are only available from Mia-Platform Console v14.1.0.
:::

View and manage Item Type Definitions

All the subcommands inherit the following flags:

```sh
      --auth-name string               the name of the miactl auth to use
      --certificate-authority string   path to a cert file for the certificate authority for the selected endpoint
      --company-id string              the ID of the Company
  -c, --config string                  path to the config file default to $HOME/miactl/config
      --context string                 the name of the miactl context to use
      --endpoint string                the address and port of the Mia-Platform Console server
      --insecure-skip-tls-verify       if true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
  -v  --verbose                        increase the verbosity of the cli output
```

### list

List Item Type Definitions

#### Synopsis

List the Item Type Definitions that the current user can access. Results are paginated and by default only the first page is shown.

#### Usage

```sh
miactl itd list --company-id company-id [FLAGS]...
```

#### Flags

- `--public` - if this flag is set, the command fetches not only the items from the requested company, but also the public Catalog items from other companies.
- `--page` - specify the page to fetch, default is 1

### get

Get a Catalog item

#### Synopsis

Get an Item Type Definition

You need to specify the name via the respective flag. The company-id flag can be omitted if it is already set in the context and it is used as tenantId of the item type definition.

```bash
miactl itd get --name name
```

### delete

Delete an Item Type Definition

#### Synopsis

Delete an Item Type Definition

You need to specify the companyId and the item type definition name via the respective flags (recommended). The company-id flag can be omitted if it is already set in the context.

```bash
miactl itd delete --name name
```

### put

Create or update an Item Type Definition

#### Synopsis

Create or update an Item Type Definition.

You need to specify the flag --file or -f that accepts a file, and companyId. Supported formats are JSON (.json files) and YAML (.yaml or .yml files).

```bash
miactl itd put -f file-path
```

#### Examples

```bash

# Create the item type definition in file myFantasticPluginDefinition.json located in the current directory
miactl itd put --file myFantasticPluginDefinition.json

# Create the item type definition in file myFantasticPluginDefinition.json, with relative path
miactl itd put --file ./path/to/myFantasticPluginDefinition.json
```
