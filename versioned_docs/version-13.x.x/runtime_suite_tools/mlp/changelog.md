---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.0.1] - 2025-03-18

### Changed

- update to go 1.24.1
- update jlp to v0.6.1
- update cobra to 1.9.1
- update pflag to 1.0.6
- update kubernetes libraries to 0.31.7
- update kustomize libraries to 0.19.0

## [v2.0.0] - 2025-01-30

### Changed

- complete rewrite of the cli
- update to go 1.23.5
- update external-secrets to v0.11.0
- update kubernetes libraries to 0.31
- use configmap instead of secret as inventory storage

### Added

- wait for resource status after apply

### Fixed

- hydrate command now add metadata to kustomize file to avoid "empty kubernetes file"
	errors during deploy

## [v2.0.0-rc.1] - 2025-01-23

### Changed

- update to go 1.23.5
- update testify to v1.10.0
- update kubernetes libraries to 0.31.5
- update jlp to v0.6.0
- update external-secrets to v0.11.0

## [v2.0.0-rc] - 2024-10-08

### Fixed

- hanging if no resources has been applied successfully in a step
- error if a group/kind of a resource saved in the old inventory format is not availbale anymore in the cluster
	now we skip the resource because we cannot retrieve it

## [v2.0.0-beta.2] - 2024-10-04

### Changed

- update to go 1.23.2

### Fixed

- hydrate command now add metadata to kustomize file to avoid "empty kubernetes file"
	errors during deploy

## [v2.0.0-beta.1] - 2024-09-19

### Changed

- update to go 1.23.1
- update kubernetes libraries to 0.30

## [v2.0.0-beta] - 2024-07-25

### Changed

- complete rewrite of the cli
- changed interpolation implementation for better mantainability
- use configmap instead of secret as inventory storage
- update to go 1.22.5

### Added

- wait for resource status after apply

## [v1.2.3] - 2023-08-24

### Fixed

- correctly manage resources with kind Mapping

## [v1.2.2] - 2023-06-05

### Fixed

- gvk field tag to kind in resource-deployment secret

## [v1.2.1] - 2023-06-01

### Fixed

- correctly manage when resource is empty in namespace

## [v1.2.0] - 2023-02-13

### Added

- default order for `SecretProviderClass` resource kind
- new annotation `mia-platform.eu/apply-before-kinds` to override default resources application order
- support for jobs annotation `mia-platform.eu/await-completion` for waiting job completion after it has been applied
	on the cluster
- support for resource `ExternalSecrets` for the annotation `mia-platform.eu/await-completion`
- add some debugging logs
- add support to kubernetes version 1.23

### Fixed

- fixed a bug in `createPatch` that caused all annotations to be deleted in the resulting patch if the target resource
	was annotated with `kubectl.kubernetes.io/last-applied-configuration`
- fixed a bug that will panic if multiple patch files would be filtered out when hydrating kustomize files

## [v1.1.0] - 2022-03-17

### Changed

- update to go 1.17

### Added

- ignore patches already in kustomization.yaml
- match as patch patch.ya?ml

### Fixes

- smart deploy don't force deploy pods on first update

## [v1.0.3] - 2022-02-07

### Added

- support arm arch
- run image as the root user

## [v1.0.2] - 2022-02-07

### Added

- improve error message when convert resource from yaml to json
- fix: splitting error on --- inside file

### Changed

- set QPS and burst for request to 500

## [v1.0.1] - 2022-02-03

### Added

- feat: increase api-server throttling options

## [v1.0.0] - 2021-12-28

- stable release

## v0.5.0 - 2021-08-24

## Added

- add flag to skip namespace ensure when deploy

## v0.4.1 - 2021-03-30

### Fixed

- fix annotation length by using an unique name,
	`mia-platform.eu/dependenciesChecksum`, for all dependencies and its value is a object of key-values of all
	the dependencies.

## v0.4.0 - 2021-03-17

### Added

- Add deploy type support, `smart deploy` or `deploy all`.

### Fixes

- fix quote in configmap strings

## v0.3.2 - 2021-01-22

### Fixed

- interpolation of variables inside single quotes

## v0.3.1 - 2020-11-25

### Added

- Add manual resource deletion

## v0.3.0 - 2020-11-02

### Added

- Add label `"app.kubernetes.io/managed-by": "mia-platform"`
- Unset original resource namespace
- Add resource deletion if no longer deployed with `mlp`

## v0.2.0 - 2020-10-20

### Added

- Add Job creation from CronJob

## v0.1.1 - 2020-10-14

### Changed

- Ignore unreadable or missing files passed as inputs to subcommands

## v0.1.0 - 2020-10-13

### Added

- Initial Release 🎉🎉🎉

[Unreleased]: https://github.com/mia-platform/mlp/compare/v2.0.1...HEAD
[v2.0.1]: https://github.com/mia-platform/mlp/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/mia-platform/mlp/compare/v2.0.0-rc.1...v2.0.0
[v2.0.0-rc.1]: https://github.com/mia-platform/mlp/compare/v2.0.0-rc...v2.0.0-rc.1
[v2.0.0-rc]: https://github.com/mia-platform/mlp/compare/v2.0.0-beta.2...v2.0.0-rc
[v2.0.0-beta.2]: https://github.com/mia-platform/mlp/compare/v2.0.0-beta.1...v2.0.0-beta.2
[v2.0.0-beta.1]: https://github.com/mia-platform/mlp/compare/v2.0.0-beta...v2.0.0-beta.1
[v2.0.0-beta]: https://github.com/mia-platform/mlp/compare/v1.2.3...v2.0.0-beta
[v1.2.3]: https://github.com/mia-platform/mlp/compare/v1.2.2...v1.2.3
[v1.2.2]: https://github.com/mia-platform/mlp/compare/v1.2.1...v1.2.2
[v1.2.1]: https://github.com/mia-platform/mlp/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/mia-platform/mlp/compare/v1.1.0...v1.2.0
[v1.1.0]: https://github.com/mia-platform/mlp/compare/v1.0.3...v1.1.0
[v1.0.3]: https://github.com/mia-platform/mlp/compare/v1.0.2...v1.0.3
[v1.0.2]: https://github.com/mia-platform/mlp/compare/v1.0.1...v1.0.2
[v1.0.1]: https://github.com/mia-platform/mlp/compare/v1.0.0...v1.0.1
[v1.0.0]: https://github.com/mia-platform/mlp/compare/v1.0.0
