---
id: manage-a-kustomize-project
title: Manage a Kustomize project
sidebar_label: Manage a Kustomize project
---

The basic building blocks of Kustomize are the environment overlays. Overlays are folders inside your project's git repository located at the path `overlays/`. Each environment can have its overlay and should be placed inside `overlays/%envId%/` (where `%envId%` is the runtime environment identifier). These runtime environment overlays can contain the following types of files:

* `kustomization.yaml`: file that contains the directives that define the resulting configuration for the services deployed in the selected environment `%envId%`. Here, you can specify both the new resources to add and the base resources to patch. For more info see [here](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#kustomize-feature-list).

* `%resourceName%.yaml` (put your actual resource name instead of `%resourceName%`): files containing the new resources to add to your base configuration.

* `%patchName%.patch.yaml` (put your actual patch name instead of `%patchName%`): files containing possible partial modifications to your base project configuration.
