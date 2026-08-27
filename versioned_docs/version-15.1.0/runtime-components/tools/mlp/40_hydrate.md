---
id: hydrate
title: Hydration Logic
sidebar_label: Hydrate
---

The `hydrate` subcommand is an helper to fill kustomization configuration files with resources and patches.

For doing so without launching multiple commands with different parameters, and leaving the user being able to add
specific patches that needs custom targeting will only add files that conform to specific regex and we will skip files
that are already present in the relative section in the file.

The first regex will match any file that ends with `.patch.yaml` or `.patch.yml` and the files `patch.yaml`
and `patch.yml`. These files will be assumed that they contains a strategic-merge-style patch and they will be
added to the `patches` section of the kustomize file.

The other regex will match every file that has the `yaml` or `yml` extensions that has not been matched in the previous
regex.  
These files will be added to the `resources` section.
