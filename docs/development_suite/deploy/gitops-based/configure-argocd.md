---
id: configure-argocd
title: Deploy with ArgoCD
sidebar_label: Deploy with ArgoCD
---

To deploy with [ArgoCD](https://argoproj.github.io/cd/) you need to have it installed in your cluster.

Once you have it properly set up create a new application (and create the necessary namespace for your Project).

## Configure repository access

When creating the new application you need to configure the repository access in order to let ArgoCD download the configuration

### GitLab support

On GitLab you can create a project Access Token: head to the repository settings or Access Token management and create a new access token. The **Reporter** role is enough, paired with the `read_repository` permission.

Once you have done this, copy the access token and define write the repository URL in argo as: `https://[access-token-name]:[access-token-value]@gitlab-host.com/path/to/the/repo.git`
