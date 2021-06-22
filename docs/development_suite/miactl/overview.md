---
id: overview
title: Miactl
sidebar_label: Miactl
---

`miactl` is the command line interface to interact with **Mia-Platform Console**. It enables the management of Console project, resources and authentication directly from the command line.

:::caution
The cli is a living project in an *alpha stage*. Currently only few Console functionality are supported and their interface might change in the future.
:::

## Installation

The source code of `miactl` can be found in its [public repository](https://github.com/mia-platform/miactl) and it requires Go language (>= `v1.13`) to execute.

### Using Go

To download and install it onto your system use the `go get` command as follows

    go get -u github.com/mia-platform/miactl

This installs the cli in your `go` folder, whose location depends on your system.

### Mac OS

For Mac OS users it is also possible to exploit [`brew`](https://brew.sh/) to install `miactl`.

    brew install mia-platform/tap/miactl

### From Source Code

To experience cli cutting edge features it is recommended to download the repository and build it from source. This enable testing features that are developed but are not ready to enter the next stable version yet.

Required dependencies:
- `go`
- `git`
- `make`

Here are the instructions to build and test out the cli:

    git clone https://github.com/mia-platform/miactl.git
    cd miactl
    make test && make build

The last commands tests the package to ensure it works also on your machine and generates the cli executable in the `execs` folder within the repository directory.

## Shell Auto-Completion

Please read the dedicated page [here](autocompletion).

## Cli configuration

`miactl` adopts a yaml file for retaining some config details. This file is by default stored at `$HOME/.miaplatformctl.yaml` and its location can be configured through the `--config` flag available to any cli command.

When executing commands, some flags or results are stored in the configuration file. This is useful to avoid typing over and over the same flags when executing different commands using those common flags.
Persistent flags are listed below:
- `--apiBaseUrl` - Console base url (with trailing slash)
- `--apiCookie` - the session id that can be extracted from browser data
- `--apiKey` - the Console API key associated to your account
- `--apiToken` - the token obtained from the `miactl login` command
- `--ca-cert` - a filepath to an additional CA certificate to be used to verify Console connections
- `--project` - the project id on which it is desired to run commands
- `--config` - the filepath to the configuration file (defaults to `$HOME/.miaplatformctl.yaml`)

Other flags that can be set on all the commands are:
- `--insecure` - disable the verification of TLS certificates
- `-v` or `--verbose` - enable the verbose mode

For more details about any command of interest, please execute it using the `-h` or `--help` flag.
For example:

    miactl login -h

## Commands Reference

In this section are reported all the available commands. In case more details are needed, it is recommended to read the help section of each command. That reading can be found by using the `-h` flag on any command.

:::caution
The authentication interface has not been unified yet. For this reason `get projects` command requires the `apiCookie` and the `apiKey` to be set, while the other commands exploit the `apiToken` obtained through the `login` command to access Console APIs.
:::

### Login

To login with miactl it is first necessary to configure the Console to accept login requests from `miactl` and obtain your credentials details, which are the `username`, `password` and `provider-id`. For these actions, please ask to your Console Administrator.

Once the login from `miactl` is enabled, it is possible to login onto the Console through the cli using the follwing command:

    miactl login --username <user> --password <pwd> --provider-id <pid> [--apiBaseUrl <console-url>]

This command will retrieve a temporary token which will grant the access to the Console API.

:::note
After the login is performed correctly, the API token is stored in the cli configuration. This helps users, since it does not require them to insert the token directly in the command.
:::

:::tip
When using the cli and receiving an authorized error, please execute again the login command since the previous login token might have expired.
:::

### Deploy

Trigger a deploy pipeline though the Console. The result is shown in a tabular format, where the pipeline id can be found.

    miactl console deploy --project <pid> --environment <env> --revision <rev> [--apiToken <token>] [--deploy-all] [--force-no-semver]

### Status
Visualize the status of selected deploy pipeline that has been triggerred before. The `<pipelineId>` can be retrieved from the result of the `deploy` command. The result is shown in a tabular format.

    miactl console deploy status <pipelineId> [--project <pid>] [--environment <env>] [--apiToken <token>]