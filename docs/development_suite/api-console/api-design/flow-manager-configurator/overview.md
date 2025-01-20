---
id: overview
title: Overview
sidebar_label: Overview
---

The Flow Manager Configurator is a tool that allows to easily configure Flow Manager services thanks to its intuitive graphical interface.

## Supported Versions

The Flow Manager Configurator supports many Flow Manager versions, starting from version `2.0.0`.

In case the Flow Manager version is not included in the supported version list, the Configurator will show a warning banner and the user will not be able to link the service.

:::warning
The Configurator does not support versions interpolated using variables. In this case it will show the same warning banner described above.
:::

![Unsupported Version](img/unsupported-version.png)

## Link

Each Flow Manager service can be manually linked at any time, this allows the usage of the Flow Manager Configurator in order to build the service configuration.

:::info
Once the Flow Manager service is linked, a commit is required in order to properly handle the service configuration. After the commit, indeed, the config map of the Flow Manager service will no longer be editable as it is completely controlled by the Configurator tool.
:::

![Link Service](img/link-service.png)

There are some cases in which the Flow Manager service cannot be linked to the Configurator, those cases are:
- missing environment variable `CONFIGURATIONS_FILE_PATH`
- wrong `CONFIGURATIONS_FILE_PATH` value
- missing config map
- invalid config map content (does not match JSON schema)

For each of these cases the Configurator will show an error with a badge describing the error.

## Unlink

Each linked Flow Manager service can be manually unlinked at any time, without losing any previously saved configuration.

:::warning
Unlinking a flow with unsaved changes will cause the loss of those changes.
:::

:::info
As per the link process, a commit is required to regain access to the JSON configuration.
:::

![Unlink Service](img/unlink-service.png)

## Readonly Mode

The *Readonly* mode allows the user to visualize the flow defined in the configuration for those Flow Manager services still not linked to the Configurator. The user can still use the searchbar, the [highlight mode](#highlight-mode) and download the flow image.

No edits are allowed in this mode.

![Readonly Mode](img/readonly-mode.png)

## Highlight Mode

The highlight mode allows the user to focus on a subset of states, logic blocks, and events of the flow. The following rules are applied:
- Click on a turned off state &rarr; the state is highlighted. In the new layout, clicking on the state highlights both the state and the logic block (which consists of the command and external executor).
- Click on a turned off event (i.e. edge)
  - Case source and target states turned off &rarr; nothing is highlighted
  - Case source and target states highlighted &rarr; the event is highlighted
  - Case only source state is highlighted &rarr; the event and every following state, logic block and event is highlighted up to the first bifurcation encountered
  - Case only target state is highlighted &rarr; the event and every previous state, logic block and event is highlighted up to the first bifurcation encountered
- Click on an highlighted state &rarr; the state, its incoming events and every following state, logic block and event is turned off if they are not highlighted by another branch
- Click on an highlighted event &rarr; the event is turned off and every following state, logic block and event is turned off if they are not highlighted by another branch

![Highlight Mode](img/highlight-mode.png)
