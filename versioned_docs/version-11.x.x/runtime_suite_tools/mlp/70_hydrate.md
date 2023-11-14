---
id: hydrate
title: hydrate Command
sidebar_label: Hydrate
---
The `hydrate` subcommand is an helper to fill kustomization.yml with resources and patches. It wraps the kustomization command:  
`kustomize edit add resource <file.yml>` and `kustomize edit add patch --path <file.yml>`.

It takes as parameters a list of paths and for each one adds to an already existing kustomization.yml in that folder every yml that founds at the same level, following this patterns:
 
- if the resource has suffix: `.patch.ya?ml` adds this resource to the patch section of kustomization.yml
- if the resource has suffix: `.ya?ml` adds this resources to the resources section of kustomization.yml
- ignores every other file in the directory

Example:  
`$ mlp hydrate configuration/ overlays/production/`
