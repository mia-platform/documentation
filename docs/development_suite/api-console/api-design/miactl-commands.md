---
id: miactl-commands
title:  Manage Your Project With Miactl
sidebar_label: CLI Commands
---

With [miactl][docs-miactl] you can manage your Project configurations locally on your machine.  
This is particularly useful in a few scenarios, such as:

- troubleshooting misconfiguration issues
- migrate the Project configuration into another Project
- create templates bundling together workload configurations to quickly kickstart similar Projects
- use AI to edit configuration or fix misconfigurations

To make these and many more operations possible through the `miactl project describe` and `miactl project apply` commands.

## Describe

The `miactl project describe` command shows the current configuration of a specific revision of an Application Project. More details in the [command documentation][docs-miactl-project-describe].

Specify the target `revision`, `version`, `branch` or `tag` depending on whether the Application Project is using the Enhanced Workflow or not, to get the entire `json` or `yaml` configuration for that Application Project.

```bash
miactl project describe --project-id <PROJECT_ID> --revision main -o yaml > my-project.yaml
```

## Apply

:::warning
This command only supports Application Projects using Enhanced Workflow. 
:::

With the `miactl project apply` command you can apply a configuration from a local file on top of an already existing Application Project. Both `json` and `yaml` file format are supported.

Executing this command saves the provided configuration as latest snapshot for the specified revision. You can see it from the [Revision History page][docs-revision-history].

```bash
miactl project apply --project-id <PROJECT_ID> --revision main -f my-project.yaml
```

## Examples

### Migrate a Project from a Company to another one

Migrating an already existing Application Project (namely Project in Company A) into a newly created Application Project (namely Project in Company B) is as simple as:

```bash
# 1. Describe the project A (old project)
miactl project describe --project-id <PROJECT_ID_A> --revision main -o yaml > project-to-migrate.yaml

# 2. Apply the project configuration to Project B (new project)
miactl project apply --project-id <PROJECT_ID_B> --revision main -f project-to-migrate.yaml
```

:::info
In order to make the new Project working as expected, ensure to migrate Providers, Secrets, ..., in the new Company as well.
:::

[docs-miactl]: ../../../cli/miactl/overview
[docs-miactl-project-describe]: https://docs.mia-platform.eu/docs/cli/miactl/commands#describe
[docs-miactl-project-apply]: https://docs.mia-platform.eu/docs/cli/miactl/commands#apply
[docs-revision-history]: ../../../development_suite/set-up-infrastructure/revisions-and-versions#revision-history
