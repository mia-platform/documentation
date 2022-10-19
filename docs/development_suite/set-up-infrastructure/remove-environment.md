---
id: remove-environment
title: Delete an Environment
sidebar_label: Delete an Environment
---

After you have followed the steps needed to remove an environment from your Console project, you are tasked with properly cleanup your project on your Git provider from the resources and pipelines needed for that environment.

## Cleanup the Pipeline

In your CI tool (more specifically in your CI file or via UI) you have to remove the steps/checks that have been previously added for handling the deleted environment.

## Cleanup Git Provider

Inside the Git repository, you have to manually remove the folders and files that you have previously added for the deleted environment.

### Plain Project

In a plain project, you can find the folder inside `configurations`. Additionally, you have to delete the `<environment-name>.env` file inside the `variables` folder.

### Kustomize Project

In a Kustomize project, all files are located inside the `overlays` subfolder that is typically named like the runtime environment.
