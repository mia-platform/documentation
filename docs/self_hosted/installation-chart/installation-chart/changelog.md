---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [9.1.4-rc.10] - 25-05-2023

### Fixed

- removed cms visibility for marketplace creatorId and updaterId

## [9.1.4-rc.9] - 25-05-2023

### Updated

- marketplace-sync@5.5.5

## [9.1.4-rc.8] - 25-05-2023

### Updated

- websites@1.2.11

## [9.1.4-rc.7] - 24-05-2023

### Updated

- kubernetes-service@6.0.2

## [9.1.4-rc.6] - 23-05-2023

### Updated

- websites@1.2.10

## [9.1.4-rc.5] - 23-05-2023

### Updated

- websites@1.2.9

## [9.1.4-rc.4] - 23-05-2023

### Updated

- websites@1.2.8
- marketplace-sync@5.5.4

## [9.1.4-rc.3] - 22-05-2023

### Updated

- websites@1.2.7

## [9.1.4-rc.2] - 22-05-2023

### Updated

- marketplace-sync@v5.5.3

## [9.1.4-rc.1] - 22-05-2023

### Updated

- marketplace-sync@v5.5.2

## [9.1.4-rc.0] - 22-05-2023

### Updated

- services and configuration for v11.1.0

## [9.1.3] - 15-05-2023

### Fixed

- kubernetes-service to 6.0.0

## [9.1.2] - 12-05-2023

## [9.1.2-rc.0] - 12-05-2023

### Updated

- aggregated-website@1.2.4

## [9.1.1] - 12-05-2023

### Fixed

- aggregate websites rollback to 1.2.2

## [9.1.0] - 11-05-2023

## [9.1.0-rc.11] - 11-05-2023

### Updated

- backend-service@27.1.2
- aggregated-website@1.2.3

## [9.1.0-rc.10] - 10-05-2023

### Updated

- console-version-upgrader@8.0.0

## [9.1.0-rc.9] - 10-05-2023

### Updated

- backend-service@27.1.1

## [9.1.0-rc.8] - 10-05-2023

### Updated

- aggregated-website@1.2.2

## [9.1.0-rc.7] - 10-05-2023

### Updated

- backend@27.1.0

## [9.1.0-rc.6] - 09-05-2023

### Added

- miactl application for authentication service

### Changed

- set env FT_REJECT_MISSING_CA to true for kubernetes-service

### Updated

- backend@27.0.1

## [9.1.0-rc.5] - 09-05-2023

### Fixed

- tenant overview `DEFAULT_VIEWS_CONFIGURATION_FILE_PATH` value

## [9.1.0-rc.4] - 08-05-2023

### Fixed

- missing tenant overview env

## [9.1.0-rc.3] - 08-05-2023

### Fixed

- control panel configuration migration

## [9.1.0-rc.2] - 08-05-2023

### Fixed

- tenant overview rond volume creation

## [9.1.0-rc.1] - 08-05-2023

### Fixed

- Bindings cleaner envs

## [9.1.0-rc.0] - 08-05-2023

### Added

- Rönd injection for tenant overview microservice

### Changed

- modified Real-Time Updater CPU request and limit to better align them with the real service usage

### Upgrade

- tenant-overview@3.0.0
- backend@27.0.0
- websites@1.2.0

## [9.0.17-rc.1] - 08-05-2023

### Changed

- update deploy-service@v5.4.1
- update backend@26.5.3

## [9.0.16] - 2023-05-05

### Changed

- `internal_userWebhookSecretKey` renamed to `internal_enableSelfServiceRegistration` to control whether the authenticion service exposes user creation/deletion webhooks

## [9.0.15] - 2023-05-04

### Changed

- update marketplace-sync@v5.5.0
- update deploy-service@v5.4.0
- update backend@26.5.2

### Fixed

- fixed wrong FT_REJECT_MISSING_CA to true

## [9.0.14] - 2023-05-03

### Added

- new CONSOLE_URL env to backend deployment
- rönd injection in tenant overview bff for new control panel

### Updated

- mail notification service image version
- envoy gateway @ 0.2.1 with mongo configuration for groups resolution
- license metrics generator @ 6.0.4
- console version ugprader @ 7.7.0

## [9.0.13] - 2023-04-14

## [9.0.12] - 2023-04-14

### Changed

- change `license-manager-service` name to `license-manager`
- add `senderAddress` as required if `mailSender` is defined

## [9.0.11] - 2023-04-13

### Updated

- console configuration migration
- use console api gateway with custom envoy filters `nexus.mia-platform.eu/console/api-gateway:0.1.0`

### Fixed

- `mailSender` configuration saves credentials in secret
- improved `tlsSecure` and `tlsIgnore` default value support for `mailSender` SMTP configuration

## [9.0.10] - 2023-04-07

## [9.0.9] - 2023-04-07

## [9.0.8] - 2023-04-07

- added `SERVICE_ACCOUNTS_COLLECTION_NAME` env on `bindings-cleaner`

## [9.0.7] - 2023-03-30

### Fixed

- authorization service env `TRUST_MIA_USER_HEADERS` set to `true`

### Changed

- remove `USERINFO_URL` on `authorization-service`

### Updated

- backend@26.2.1
- project-service@2.0.9

## [9.0.6] - 2023-03-28

### Updated

- aggregated-website@1.1.121

## [9.0.5] - 2023-03-28

### Fixed

- fix missing backend env var

## [9.0.4] - 2023-03-28

### Update

- marketplace-sync to v5.3.5

## [9.0.3] - 2023-03-28

### Fixed

- add CA bundle and annotation checksums to client credentials

## [9.0.2] - 2023-03-16

- added the SERVICE_ACCOUNTS_COLLECTION_NAME env var in licenseMetrics definition

## [9.0.1] - 2023-03-16

### Fixed

- updated version for console license metrics generator

## [9.0.0] - 2023-03-16

### BREAKING CHANGES

- required `serviceAccountAuthProvider` configuration to support service account creation in console

### Removed

- audit now is removed from values

### Updated

-  updated the console-version-upgrader env vars
- `core/swagger-aggregator@3.4.14`
- `api-portal/website@1.16.6`
- upgrade envoy api-gateway to version `1.24.2`

### Added

- license manager service
- license metrics cronjob
- `internal_userWebhookSecretKey` to control the secret key used to authenticate webhook client application, this is meant for SaaS internal use only, if left empty webhooks will not be exposed

## [8.3.7] - 2023-03-07

### Updated

- websites@1.1.116

## [8.3.6] - 2023-03-06

### Updated

- backend@25.5.2

## [8.3.5] - 2023-03-01

### Fixed

- provider types env for marketplace categories

## [8.3.4] - 2023-03-01

### Fixed

- provider types env for backend

## [8.3.3] - 2023-03-01

- ci fixes

## [8.3.2] - 2023-03-01

### Updated

- websites

## [8.3.1] - 2023-03-01

### Updated

- services for new console version

## [8.3.0] - 2023-02-16

### Added

- mail service configurations

### Added

- `enableBackofficeConfigurator` FT

### Updated

- all services for 10.5.0

### Changed

- using crud service image OSS from github

## [8.2.22] - 2023-02-09

### Fixed

- typo corrected renamed nodeSelectors in nodeSelector

### Added

- feature toggle service configuration (currently disabled, will not release any new resources)

## [8.2.21] - 2023-02-01

### Updated

- marketplace-sync@5.1.4

## [8.2.20] - 2023-02-01

### Updated

- websites@1.1.111

## [8.2.19] - 2023-02-01

### Updated

- websites@1.1.110

## [8.2.18] - 2023-02-01

### Updated

- websites@1.1.109

## [8.2.17] - 2023-01-31

### Updated

- websites@1.1.108

## [8.2.16] - 2023-01-31

### Updated

- websites@1.1.107

## [8.2.15] - 2023-01-31

### Fixed

- app version

## [8.2.14] - 2023-01-31

### Added

- support of config shepherd for envoy configuration

### Updated

- marketplace-sync@5.1.3
- version-upgrader@7.3.0
- backend@25.3.1
- deploy-service@5.2.4
- environment-variables@3.4.3
- kubernetes-service@4.0.0
- project-service@2.0.7

## [8.2.13] - 2023-01-19

### Updated

- webistes@1.1.106

## [8.2.12] - 2023-01-19

### Updated

- marketplace-sync@5.1.2

## [8.2.11] - 2023-01-18

### Updated

- marketplace-sync@5.1.1

## [8.2.10] - 2023-01-18

### Removed

- unused endpoints from api gateway to reduce ConfigMap size

## [8.2.9] - 2023-01-18

### Updated

- services and policies

## [8.2.8] - 2022-12-21

### Updated

- notification-provider@2.0.8

## [8.2.7] - 2022-12-20

### Fixed

- policies for company creation

### Updated

- websites@1.1.104

## [8.2.6] - 2022-12-16

### Updated

- config with rond security routes fixes (removed all fallbacks)

## [8.2.5] - 2022-12-16

### Updated

- deploy-service@5.2.2
- kubernetes-service@3.6.3
- websites@1.1.103

## [8.2.4] - 2022-12-15

### Added

- add service monitor to services using rond sidecar

### Updated

- marketplace-sync@5.0.3

## [8.2.3] - 2022-12-15

### Updated

- marketplace-sync@5.0.2

## [8.2.2] - 2022-12-15

### Added

- Added `enableRuntimeServiceClusterSelection` FT to enable selection from supported runtime providers during cluster setup
- runtime services CMS page

## [8.2.1] - 2022-12-15

### Updated

- marketplace-sync@5.0.1

## [8.2.0] - 2022-12-15

### Fixed

- marketplace scripts MONGODB_URL variable provisioning from secret

### Added

- run console-version-upgrader and marketplace-sync also on post-install hook
- mount `additionalCABundle` inside migrate-clusters hook template file

### Removed

- remove unused mongoCleaner hook

## Updated

- consoleVersionUpgrader@7.2.0
- all console services
- envoy 1.24.0

## [8.1.14] - 2022-11-25

### Updated

- backend@25.1.2

## [8.1.13] - 2022-11-25

### Updated

- backend@25.1.2

## [8.1.12] - 2022-11-25

### Updated

- backend@25.1.1

## [8.1.11] - 2022-11-24

### updated

- websites@1.1.101
- marketplace-sync@4.5.3

## [8.1.10] - 2022-11-24

### Security Fix

- fixed security vulnerability due to rond being skipped on RBAC Manager Bff causing privile escalation

## [8.1.8] - 2022-11-23

### Fixed

- fix audit console cronjob env var

## [8.1.7] - 2022-11-23

### Fixed

- fix audit console cronjob

### Updated

- configuration update
- enable FT_ENABLE_KEYBOARD_SHORTCUTS
- marketplaceSync@4.5.2
- backend@25.1.0
- crud-service@6.1.1
- deploy-service@5.1.3
- environments-variable@3.3.3
- favorites-service@2.0.5
- files-service@2.6.4
- kubernetes-service@3.6.0
- notification-provider@2.0.7
- website@1.1.100
- mia-craft-bff@1.2.2
- rbac-manager-bff@1.4.3
- rond@1.5.1
- tenant-overview@2.2.3
- project-service@2.0.5
- audit@5

### Removed

- Removed k8s secret volume from `auditConsole`

## [8.1.9] - 2022-11-24

- backporting 


## [8.1.6] - 2022-11-15

### Updated

- backend@25.0.0
- k8s-service@3.5.4

## [8.1.5] - 2022-11-09

### Updated

- backend@24.1.1

## [8.1.4] - 2022-11-09

### Updated

- console version upgrader @ 7.0.1

## [8.1.3] - 2022-11-08

### Added

- `SERVICE_URL_TO_GENERATE_COMPANY_BINDINGS` and `CREATE_COMPANY_DEFAULT_ROLE` for backend
- expose api-gateway metrics with PodMonitor

### Changed

- renamed env var `SERVICE_URL_TO_GENERATE_BINDINGS` to `SERVICE_URL_TO_GENERATE_PROJECT_BINDINGS` for backend
- update consoleVersionUpgrader to 7.0.0

## [8.1.2] - 2022-10-27

### Updated

- websites@1.1.98

## [8.1.1] - 2022-10-25

### Fixed

- api-gateway lua script

## [8.1.0] - 2022-10-20

### Added

- added migrateClustersJob

### Removed

- removed `mia-k8s-service` secret
- removed `.Values.configurations.clusters`
- removed `.Values.apiGateway.dnsmasq`

### Changed

- `kubernetes-service` do not mount secret in environments variables
- replace nginx api-gateway with envoy

### Updated

- console-version-upgrader@6.3.3
- infrastructure@2.10.2
- backend@23.1.3
- websites@1.1.93
- all services

## [8.0.21] - 2022-10-06

### Updated

- Console configurations

## [8.0.20] - 2022-10-06

### Updated

- marketplace-sync@4.3.7

## [8.0.19] - 2022-10-05

### Updated

- websites@1.1.92

## [8.0.18] - 2022-10-05

### Updated

- backend@23.1.2

## [8.0.17] - 2022-10-05

### Fixed

- fixed FT for new ConfigMaps and Secrets UX/UI

## [8.0.16] - 2022-10-05

### Added

- enabled FT for new ConfigMaps and Secrets UX/UI

## [8.0.15] - 2022-10-04

- console-version-upgrader@6.2.3

## [8.0.14] - 2022-10-04

- website@1.1.91
- backend@23.1.1
- rond@1.4.2
- deploy-service@5.1.0

## [8.0.13] - 2022-09-28

- backend@23.0.2

## [8.0.12] - 2022-09-27

- website@1.1.90

## [8.0.11] - 2022-09-26

- website@1.1.89

## [8.0.10] - 2022-09-22

- website@1.1.88

## [8.0.9] - 2022-09-22

- backend@23.0.1

## [8.0.8] - 2022-09-20

- websites@1.1.87

## [8.0.7] - 2022-09-16

- websites@1.1.86

## [8.0.6] - 2022-09-16

### Updated

- websites@1.1.85
- marketplace-sync@4.3.6

## [8.0.5] - 2022-09-08

### Updated

- console-version-upgrader@6.2.2

## [8.0.4] - 2022-09-08

### Updated

- websites@1.1.82
- console-version-upgrader@6.2.1

## [8.0.3] - 2022-09-07

### Updated

- console-project-service@2.0.2

## [8.0.2] - 2022-09-07

### Updated

- marketplace-sync@4.3.5

## [8.0.1] - 2022-09-07

### Updated

- backend@23.0.0

## [8.0.0] - 2022-09-07

### BREAKING CHANGES

- For the docker image, the `name` property has been renamed to `repository`

### Added

- set env FT_REJECT_MISSING_CA to false for kubernetes-service
- This chart can now be updated from Renovate!

### Updated

- console configuration
- websites@1.1.81
- deploy-service@5.0.4
- environments-variables@3.3.0
- favorites-service@2.0.2
- notification-provider@2.0.4
- k8s-service@3.4.0
- rbac-manager-bff@1.4.0
- rond@1.4.0
- console-version-upgrader@6.2.0

## [7.3.1] - 2022-08-08

### Fixed

- added ca-bundles var for console version upgrader script
- added git ssl CA validation vars

## [7.3.0] - 2022-07-22

### Downgrade

- swagger-aggregator@3.4.4

### Removed

- remove orchestratorType configuration. Now it's suppported vanilla k8s.

### Fixed

- bindings cleaner var `PROJECT_COLLECTION_NAME`

### Updated

- deploy-service@5.0.3

## [7.2.4] - 2022-07-20

### Fixed

- add environments-variables variables CRUD_HOST, PROVIDERS_CRUD_BASE_PATH, CREDENTIALS_CRUD_BASE_PATH

## [7.2.3] - 2022-07-19

### Updated

- console configuration
- backend@22.0.0
- websites@1.1.80
- api-portal@1.16.4
- cms-backend@5.1.2
- deploy-service@5.0.2
- environments-variables@3.2.1
- k8s-service@3.3.0
- login-site@7.2.1
- websites@1.1.78
- rbac-standalone@1.3.0
- rbac-sidecars@1.3.0
- rbac-manager-bff@1.3.3
- marketplace-sync@4.3.3

### Changed

- Removed NODE_TLS_REJECT_UNAUTHORIZED from `kubernetes-service`

### Removed

- Feature toggle FT_ENABLE_DEDICATED_AUTH_PROVIDER for backend, environment and deploy services

## [7.2.2] - 2022-07-14

### Fixed

- missing CA bundles for files-service and all rbac-service instances

## [7.2.1] - 2022-07-11

### Changed

- improve json schema validation


## [7.2.0] - 2022-07-11

### Added

- Configuration for bitbucket, keycloak and generic provider

## [7.1.4] - 2022-07-08

### Changed

- appVersion 9.4.1

## [7.1.3] - 2022-07-08

### Updated

- websites@1.1.77

## [7.1.2] - 2022-07-06

### Fixed

- missing environment variable to backend

## [7.1.1] - 2022-07-06

### Updated

- version-upgrader@6.1.1 - fix Dockerfile
- marketplace-sync@4.3.2 - fix Dockerfile

## [7.1.0] - 2022-07-06

### Added

- `enableMergeConfiguration` value to control `FT_ENABLE_MERGE_CONFIGURATION`
- enabled `FT_ENABLE_SINGLE_VIEW_CONFIGURATION_SECTION` on backend to show Configurations section in Fast Data Single View

### Updated

- website@1.1.76
- version-upgrader@6.1.0
- backend@21.0.2
- authorization-service@2.4.1
- marketplace-sync@4.3.1

## [7.0.2] - 2022-06-23

### Updated

- deploy-service@5.0.1
- kubernetes-service@3.2.8

## [7.0.1] - 2022-06-22

### Updated

- websites@1.1.75

## [7.0.0] - 2022-06-21

### Breaking Change

- Changed `deployServiceWebhookRetryMs` to `deployServiceJenkinsRetryMs`

### Updated

- migrated from rbac to rönd v1.2.1
- backend@20.1.1
- deploy-service@5.0.0
- kubernetes-service@3.2.7
- websites@1.1.73

## [6.1.10] - 2022-06-06

- environment-variables@3.1.4

## [6.1.8] - 2022-06-06

- environment-variables@3.1.3

## [6.1.8] - 2022-06-06

- fix: topology missing matchLabels field for backend

## [6.1.7] - 2022-06-06

- fix: topology missing matchLabels field

## [6.1.6] - 2022-06-06

- fix: pod security policy api version

## [6.1.5] - 2022-06-06

### Updated

- backend@20.0.0
- environment-variables@3.1.2 for security vulnerabilities fix
- crud-service@5.3.1
- files-service@2.5.0 for security vulnerabilities fix
- swagger-aggregator@3.4.5 for security vulnerabilities fix
- websites@1.1.72
- marketplace-sync@4.2.4

## [6.1.4] - 2022-05-31

- fix: semver check on k8s version in GKE and EKS

## [6.1.3] - 2022-05-26

### Updated

- marketplace-sync@4.2.3

## [6.1.2] - 2022-05-26

### Added

- FT_ENABLE_MONGODB_VIEWS to backend

## [6.1.1] - 2022-05-26

### Updated

- websites@1.1.70

## [6.1.0] - 2022-05-26

### Removed

- FT_ENABLE_RBAC_SIDECAR_INJECTION and FT_ENABLE_RBAC_PROJECTS_FILTERING feature-toggles
- Removed ENABLE_FAST_DATA_AUTOMATION

### Updated

- k8s-service@3.2.6
- favorites-service@2.0.1
- projects-service@2.0.1
- v1-adapter@4.1.2
- backend@19.4.1
- tenantOverview@2.2.0
- authenticationService@2.6.0
- marketplace-sync@4.2.2
- deployService@4.6.0
- websites@1.1.69

### Added

- bindingsCleaner@1.0.0
- add `microsoft` as auth provider

## [6.0.6] - 2022-05-11

### Updated

- marketplace-sync@4.1.3

## [6.0.5] - 2022-05-11

### Updated

- v1-adapter@4.1.1
- marketplace-sync@4.1.2 (reverted to Node16 due to conflicts with user set to container in chart)

## [6.0.4] - 2022-05-10 [DO NOT USE]

### Updated

- marketplace-sync@4.1.1

## [6.0.3] - 2022-05-10

### Updated

- rbac-manager-bff latest v1.3.2
- rbac-service latest to v1.2.0
- version-upgrader @6.0.0
- marketplace-sync @4.1.0
- backend@19.3.0
- crud-service@5.2.3
- website@1.1.68
- tenant-overview@2.1.1

### Added

- added `CONFIGURATIONS_COLLECTION_NAME` env to console version upgrader
- enabled `FT_ENABLE_FAST_DATA_CREATE_PC_IN_CONFIGURATION` ft on backend

## [6.0.2] - 2022-05-04

### Updated

- websites 1.1.67

## [6.0.1] - 2022-05-03

### Added

- Added `DOCKER_IMAGE_REGISTRY_HOST` to marketplace sync based on registryHost

### Updated

- console-version-upgrader v5.0.1
- websites 1.1.66
- backend 19.2.0

## [6.0.0] - 2022-04-27

### Added

- Added `PERMISSION_COLLECTION` constant for console version upgrader

### BREAKING CHANGES

- Changed `gitProviders` to `authProviders`
- Removed `providerToUpgradeFromV7ToV8`

### Removed

- `enablePublicVariables` toggle

### Fixed

- fix: rbac-standalone status routes and oas path
- rbac binding creation on project creation configuation based on internal FT
- added missing rbac-manager-bff sidecar
- use correct api version for CronJob resources based on the k8s version

### Updated

- login-site@7.2.0
- console-version-upgrader@5.0.0
- rbac-service@1.0.0
- rbac-manager-bff@1.3.1
- tenant-overview@2.1.0
- backend@19.1.0
- websites@1.1.65
- marketplace-sync@4.0.3

## [5.13.9] - 2022-04-20

### Fixed

- App Version

## [5.13.8] - 2022-04-19

### Fixed

- disabled project binding creation on project creation based on FT

## [5.13.7] - 2022-04-08

- marketplace-sync@3.6.3

## [5.13.6] - 2022-04-08

### Updated

- backend@18.0.0

## [5.13.5] - 2022-04-08 [Invalid Tag]

### Updated

- websites@1.1.62
- console-version-upgrader@4.4.2

## [5.13.4] - 2022-04-07

### Updated

- backend@17.4.1

## [5.13.3] - 2022-04-07

### Fixed

- add checksum/cabundle annotation to services missing it

## [5.13.2] - 2022-04-06
### Updated

- marketplace-sync v3.6.2

## [5.13.1] - 2022-04-05

### Updated

- Added `additionalCABundle` mount to hook Jobs


## [5.13.0] - 2022-04-05

### Updated

- audit-console@3.0.0
- added `FT_ENABLE_ENVOY` environment variable to backend service

### Added

- added `deployServiceWebhookRetryMs` to control deploy service webhook trigger retry

### Updated

- rbac-service v0.8.3
- rbac-manager-bff v1.3.0
- marketplace-sync v3.6.1
- backend v17.4.0
- aggregated-website@1.1.61

## [5.12.7] - 2022-03-31

### Updated

- [backport] Added `additionalCABundle` mount to hook Jobs

## [5.12.6] - 2022-03-31
### Updated

- Added `filesStorageS3ForcePathStyle` and `filesStorageS3SignatureVersion` variables for files service (Oracle Bucket Storage support)

## [5.12.5] - 2022-03-30
### Updated

- Added `additionalCABundle` mount to V1Adapter, CMSBackend and Audit-Console

## [5.12.4] - 2022-03-30
### Updated

- Added `filesStorageS3Endpoint` variable for files service (Oracle Bucket Storage support)
- Added `additionalCABundle` mount to CrudService

## [5.12.3] - 2022-03-29

### Updated

- kubernetes-service@3.2.4
- console-version-upgrader@4.4.1

## [5.12.2] - 2022-03-24

### Updated

- marketplace-sync@3.5.3

## [5.12.1] - 2022-03-23

### Fixed

- added GROUPS_COLLECTION_NAME to console-version-upgrader

## [5.12.0] - 2022-03-23

### Added

- added env var ENABLE_USER_MANAGER for the backend service
- `userSettingsURL` to configure User Setting page

### Changed

- App Version v8.8.0

### Updated

- cms-site@9.14.4
- marketplace-sync@3.5.2
- console-version-upgrader@4.4.0
- api portal@1.15.1
- deploy-service@4.5.0
- environment-variables@3.1.1
- kubernetes-service@3.2.3
- rbac-manager-bff@1.1.0
- rbac-service@0.8.2
- project-service@2.0.0
- backend@17.3.1
- websites@1.1.60
- authentication-service@2.5.0

## [5.11.15] - 2022-03-04

### Fixed

- update tenant-overview@2.0.2

## [5.11.14] - 2022-03-03

### Added

- enabled import from DDL for Fast Data projections

## [5.11.13] - 2022-03-02

### Updated

- aggregated-website@1.1.58

## [5.11.12] - 2022-03-02

### Updated

- marketplace-sync@3.4.2

## [5.11.11] - 2022-03-02

### Downgrade

- cms-site v9.14.2

## [5.11.10] - 2022-03-02

### Fixed

- added missing `ROLES_COLLECTION_NAME` env to console-version-upgrader

## [5.11.9] - 2022-03-01

### Updated

- console-version-upgrader@4.3.1
- environment-variables-service@3.1.0
- backend@17.2.0
- deploy-service@4.4.1
- website@1.1.57

## [5.11.8] - 2022-02-22

### Updated

- kubernetes-service v3.2.2


## [5.11.7] - 2022-02-22

### Removed

- authproviders based configuration generation

## [5.11.6] - 2022-02-22

### Removed

- default for authproviders

## [5.11.5] - 2022-02-22

### Updated

- rbac-manager-bff@1.0.6

## [5.11.4] - 2020-02-15

### Updated

- rbac-manager-bff@1.0.5

## [5.11.3] - 2022-02-11

### Updated

- websites@1.1.56

## [5.11.2] - 2022-02-10

### Updated

- websites@1.1.55

## [5.11.1] - 2022-02-09

### Updated

- kubernetes-service@3.2.0

## [5.11.0] - 2022-02-09

### Updated

- tenant-overview@2.0.1
- rbac-manager-bff@1.0.4
- marketplace-sync@3.4.1
- website@1.1.54
- backend@17.1.0
- kubernetes-service@3.2.0

### Removed

- Removed `FT_ENABLE_MIA_CRAFT` ft
- remove microservice-gateway service
- `enableCrudEncryptionAndSensitivity` ft

## [5.10.0] - 2022-01-27

### Added

- `enableFastDataLowCode` FT

## [5.9.1] - 2022-01-26

### Updated

- version-upgrader@4.2.0

## [5.9.0] - 2022-01-26

### Removed

- removed `FT_ENABLE_MARKETPLACE_RESOURCES_DATA_MODEL` and `FT_ENABLE_MARKETPLACE_APPLICATIONS`
- removed `enableSmartDeploy` FT

### Updated

- website@1.1.52
- backend@17.0.1
- rbac-manager-bff@1.0.3
- marketplace-sync@3.4.0


### Added

- `PodDisruptionBudget` support added  
- `CONSOLE_METADATA_CRUD_BASE_PATH` env to backend

## [5.8.4] - 2022-01-14

### Updated

- websites@1.1.51
- rbac-manager-bff@1.0.2
- backend@16.1.1

## [5.8.3] - 2022-01-12

## Fixed

- `enableSaveConfigurationOnCrud` values backend FT to save configuration on CRUD, needed by tenant overview.

## [5.8.2] - 2022-01-11

### Updated

- websites@1.1.50

### Fixed

- value backend env FT_ENABLE_TENANT_OVERVIEW based on FT
 
## [5.8.1] - 2022-01-10

### Fixed

- added CRUD_SERVICE_NAME env to tenant-overview-bff

## [5.8.0] - 2022-01-10

### Changed

- enableTenantOverview switched from `false` to `true` as default
- enableRBACManager switched from `false` to `true` as default

### Updated

- deploy-service@4.3.0
- tenant-overview-bff@2.0.0
- `rbac-manager-bff` v1.0.1
- websites@1.1.49
- backend@16.1.0

### Removed

- `enableK8sSecretsInServices` feature toggle
- `enableK8sSecretsInServicesVariables` feature toggle
- `enableK8sSecretsInServices` and `enableK8sSecretsInServicesVariables` toggles
- Removed environment variable `FT_ENABLE_INFRASTRUCTURE_WEBSITE` from backend service
- Removed `HOMEPAGE_WITH_METRICS` feature toggle
- Removed `FT_ENABLE_PROJECTS_CARDS_WITH_K8S_METRICS` feature toggle
- `enableProjectOverview` feature toggle

## [5.7.3] - 2021-12-27

### Updated

- backend@16.0.1
- platform@8.4.1

## [5.7.2] - 2021-12-27

### Fixed

- missing update to `authentication service` version from `2.3.x` to `2.4.x`

## [5.7.1] - 2021-12-27

### Updated

- websites@1.1.48

## [5.7.0] - 2021-12-23

### Added

- `redisUsername` and `redisPassword` authentication support

## [5.6.7] - 2021-12-20

### Updated

- update `aggregated-website` to `1.1.47`

## [5.6.6] - 2021-12-20

### Added

- added fields defaultBranch and Features Toggles to projects CRUD

## [5.6.5] - 2021-12-20

### Updated

- backend@16.0.0 to fix wrong versioning

### Fixed

- added missing env to backend

## [5.6.4] - 2021-12-10

### Updated

- backend@15.3.0
- website@1.1.46
- marketplace-sync@3.3.1

### Removed

- Removed `enableFlowManagerVisualizer` feature toggle

## [5.6.3] - 2021-12-10

### Updated

- backend@15.2.2

## [5.6.2] - 2021-12-01

### Updated

- website@1.1.43

## [5.6.1] - 2021-12-01

### Updated

- backend@15.2.1
- websites@1.1.42

## [5.6.0] - 2021-11-30

### Removed

- removed variable internal_enableLargeConfigMapManagement as planned in the process of FT removal

### Updated

- website@1.1.41
- marketplace-sync@3.3.0
- project-service@1.1.0
- kubernetes-service@3.1.1
- notification-provider@2.0.3
- favorites-service@2.0.0
- backend@15.2.0

## [5.5.3] - 2021-11-16

### Fixed

- disabled RBAC Feature Toggle since still in development


## [5.5.2] - 2021-11-11

### Updated

- backend@15.1.1

## [5.5.1] - 2021-11-11

### Updated

- marketplace-sync@3.2.1

## [5.5.0] - 2021-11-11

### Added

- `enableRBACManager` feature toggle and `rbac-manager-bff` service (version latest)

### Updated

- crud-service@5.0.1
- websites@1.1.40
- appVersion@8.2.1

## [5.4.7] - 2021-11-04

### Updated

- console CMS configuration

## [5.4.6] - 2021-11-04

- console/project-service@1.0.1

## [5.4.5] - 2021-11-03

- k8s-service@3.1.0

## [5.4.4] - 2021-11-03

- fix project service image name

## [5.4.3] - 2021-11-03

### Updated 

- environment-variables@3.0.0
- project-service@1.0.0
- favorites-service@1.2.0
- marketplace-sync@3.1.0
- backend@15.1.0
- websites@1.1.39

## [5.4.2] - 2021-10-27

### Updated

- websites@1.1.38 to prevent click-jacking

## [5.4.1] - 2021-10-25

### Changed

- correctly mount secret in license audit script

## [5.4.0] - 2021-10-20

- backendService enabled FT_ENABLE_SERVICE_METRICS_GATHERING
- added audit console

## [5.3.1] - 2021-10-18

- version-upgrader@4.1.2

## [5.3.0] - 2021-10-18

### Added

- projects field in favorites model

### Updated

- favorites-service@1.1.0
- crud-service@5.0.0
- cms-backend@5.1.0
- v1-adapter@4.1.0
- version-upgrader@4.1.1
- backend@15.0.1
- websites@1.1.36

## [5.2.2] - 2021-10-05

### Updated

- `backend`@14.2.2

## [5.2.1] - 2021-10-04

### Removed

- removed unused gitProvider related environment variables from backend and deploy-service

## [5.2.0] - 2021-10-01

### Added

- `enableCrudEncryptionAndSensitivity` FT to enable Crud encryption and sensitivy feature

## [5.1.0] - 2021-09-30

### Updated

- `authenticaton service` updated to 2.3.0
- `consoleVersionUpgrader` @ v4.0.1
- `api-gateway` to 4.2.0
- `dnsmasq` to 1.0.3
- `api-portal` to 1.13.9
- `cms-backend` to 5.0.0
- `cms-site` to 9.14.2
- `crud-service` to 4.4.0
- `kubernetes-service` to 3.0.0
- `login-site` to 7.1.3
- `environmentsVariables` to 2.1.0
- `websites` to 1.1.35
- `deploy-service` to 4.2.0
- `backendService` to 14.2.1

### Added

- `consoleVersionUpgrader` now needs a new variable `providerToUpgradeFromV7ToV8` when upgrading from v7 to v8 and if more than one `gitProviders` are present
-  each `provider` now accept a new field label to eventually be shown to the final user. 

## [5.0.5] - 2021-09-16

- `websites@1.1.34`

## [5.0.4] - 2021-09-16

### Fixed

- fix correctly hpa to not downscale pod replicas scaled horizontally

## [5.0.3] - 2021-09-16

### Updated

- `backendService@14.1.1`

## [5.0.2] - 2021-09-15

- new `/api/providers` in swagger aggregator
- `uptime_robot` clientType

## [5.0.1] - 2021-09-15

### Updated

- `backendService@14.1.0`
- `websites@1.1.33`

## [5.0.0] - 2021-09-10

### BREAKING

- renamed `customServicesImagePullSecrets` into `servicesImagePullSecrets`. In this field both custom services pull secrets and core services pull secrets are expected to be defined.

### Updated

- `backendService` @13.0.0

## [4.4.6] - 2021-09-06

### Updated

- `backendService`@12.0.5
- platform 7.9.3

## [4.4.5] - 2021-08-02

### Updated

- `websites`@1.1.30
- `backendService`@12.0.4
- platform 7.9.2

## [4.4.4] - 2021-08-31

### Updated

- `consoleVersionUpgrader` @3.0.4

## [4.4.3] - 2021-08-30

### Updated

- `websites` @1.1.29

## [4.4.2] - 2021-08-27

### Updated

- `websites` @1.1.28
- `backendService` @12.0.3

## [4.4.1] - 2021-08-26

### Updated

- `consoleVersionUpgrader` @3.0.3

## [4.4.0] - 2021-08-26

### Updated

- `consoleVersionUpgrader` @3.0.2

### Added

- `enableMarketplaceApplication` flag to enable or not the Application area. Default is `false`.

## [4.3.3] - 2021-08-25

- `backendServices` @12.0.2

## [4.3.2] - 2021-08-25

- `websites` @1.1.27

## [4.3.1] - 2021-08-25

- `consoleVersionUpgrader` @3.0.1

## [4.3.0] - 2021-08-25

### Removed

- Services page from Console CMS, which referred to a deprecated collection

### Changed

- `Services Preview` page of Console CMS has been renamed to `Marketplace` and the aclExpression has been removed

## [4.2.4] - 2021-08-25

### Updated

- `backendService` @12.0.1

## [4.2.3] - 2021-08-24

### Updated

- `consoleVersionUpgrader` @3.0.0

## [4.2.2] - 2021-08-24

### Updated

- `consoleVersionUpgrader` @2.1.2

### Fixed

- added missing envs to `consoleVersionUpgrader`

## [4.2.1] - 2021-08-24

### Updated

- `consoleVersionUpgrader` @2.1.1

## [4.2.0] - 2021-08-24

### Removed

- backendService ft `FT_ENABLE_CUSTOM_REAL_TIME_UPDATER` removed

### Added

- `enableMarketplaceSync` flag to allow control on the marketplace sync script execution

### Updated

- `deployService` @4.1.5
- `consoleVersionUpgrader` @2.1.0
- `marketplaceSync` @3.0.0
- `websites` @1.1.26
- `backedService`@12.0.0

## [4.1.1] - 2021-07-27

### Fixed

- fix env var name `EXPOSE_METRICS` in backend service

## [4.1.0] - 2021-07-27

### Added

- expose prometheus metrics from backend service

## [4.0.2] - 2021-07-26

- `backendService` @11.1.3
- `appVersion` 7.8.3

## [4.0.1] - 2021-07-20

### Update

- update console services configuration

## [4.0.0] - 2021-07-19

### BREAKING CHANGES

- add `registryHost` as options for easier setup of a registry mirror for installation

### Fixed

- fix proxy of request id for v1-adapter

## [3.12.7] - 2021-07-16

- `backendService` @11.1.2

## [3.12.6] - 2021-07-15

- `marketplaceCategories` @2.9.2

## [3.12.5] - 2021-07-15

- `websites` @1.1.25

## [3.12.4] - 2021-07-14

- `backendService` @11.1.1

## [3.12.3] - 2021-07-14 [DO NOT USE]

### Updated

- `notificationProvider` @2.0.2
- `authenticationService` @2.2.0
- `backendService` @11.1.0
- `marketplaceCategories` @2.9.1
- `websites` @1.1.24

## [3.12.2] - 2021-06-29

### Updated

- `filesService`@2.2.0
- `crudService`@4.0.0
- `kubernetesService`@2.5.0
- `websites`@1.1.23
- `marketplaceCategories` @2.8.0
- `backendService` @11.0.0

## [3.12.1] - 2021-06-23

### Updated

- `backendService`@10.5.3

## [3.12.0] - 2021-06-22

### Added

- add hpa to all console services

## [3.11.7] - 2021-06-21

- `backendService`@10.5.2

## [3.11.6] - 2021-06-21

- `websites`@1.1.22

## [3.11.5] - 2021-06-17

### Updated

- `websites`@1.1.21
- `backendService`@10.5.1

## [3.11.4] - 2021-06-16

### Updated

- `marketplaceCategories` @2.7.0
- `kubernetesService` @2.4.0
- `loginSite` @7.1.2
- `websites` @1.1.20
- `backendService` @10.5.0 with `FT_ENABLE_CUSTOM_REAL_TIME_UPDATER` true

## [3.11.3] - 2021-06-04

### Updated

- `websites`@1.1.19

## [3.11.2] - 2021-06-03

### Updated

- `backendService`@10.4.3

## [3.11.1] - 2021-06-01

### Updated

- `kubernetesService` @2.3.0

## [3.11.0] - 2021-06-01

### Added

- `enableTenantOverview` FT to enable or disable the new tenant-overview-bff service.
- `tenantOverviewBff` @1.0.0

### Updated

- `marketplaceCategories` @2.6.0
- `websites` @1.1.18
- `backendService` @10.4.2
- `deployService` @4.1.3

## [3.10.1] - 2021-06-01

### Updated

- `backendService`@10.3.2

## [3.10.0] - 2021-05-26

### Added

- add authentication for additional clients
- `enableDebugArea` feature toggle

### Updated

- `backendService`@10.3.1
- `crudService`@3.2.3
- `websites`@1.1.16
- `marketplaceCategories`@2.5.5

## [3.9.1] - 2021-05-19

### Updated

- script `marketplaceCategories` @2.5.4

## [3.9.0] - 2021-05-18

### Added

- `enableFlowManagerVisualizer` feature toggle

### Updated

- script `marketplaceCategories` @2.5.3
- `websites` @1.1.14
- `backend` @10.2.1

## [3.8.3] - 2021-05-17

- `websites` @1.1.13

## [3.8.2] - 2021-05-17

- `websites` @1.1.12

## [3.8.1] - 2021-05-17

### Updated

- script `marketplaceCategories` @2.5.2
- `websites` @1.1.11

## [3.8.0] - 2021-05-13

### Added

- script `consoleVersionUpgrader` @2.0.1

### Updated

- `cms-site` to v9.14.0
- `backend` to v10.1.0
- `websites` to v1.1.10
- `marketplaceCategories` to v2.5.1
- `realTimeUpdater`: increased CPU request to `40m` and limit to `200m`
- `deployService` to v4.1.2
- `miaCraftBff` to v1.2.0

## [3.7.7] - 2021-05-06

### Fixed

- fixed deploy with change in console secret

## [3.7.6] - 2021-04-27

- update `websites` to v1.1.8

## [3.7.5] - 2021-04-27

### Fixed

- fixed `marketplaceSyncFilters` typo

### Updated

- updated `deploy-service` to v4.1.1
- updated `mia-craft-bff` to v1.1.1
- update `websites` to v1.1.7
- update `marketplace-sync` hook to v2.4.2
- update `backend` to v9.0.0

## [3.7.4] - 2021-04-21

### Updated

- update `websites` to v1.1.6
- update `backend` to v8.3.2

## [3.7.3] - 2021-04-21

### Updated

- update `deploy-service` to v4.1.0
- update `kubernetes-service` to v2.2.0
- update `websites` to v1.1.5
- update `marketplace-sync` hook to v2.4.1
- update `backend` to v8.3.1

### Added

- using `enableFastData` value will now enable single view feature
- `internal_enableLargeConfigMapManagement` to enable management of config map greater than 1 MB (this is for internal use only, may be subject to unexpected breaking changes).

## [3.7.2] - 2021-04-12

### Updated

- update `backend` to v8.2.1
- update `websites` to v1.1.3
- update `marketplace-sync` hook to v2.4.0

### Added

- support to zero downtime for console aggregated websites

## [3.7.1] - 2021-04-07

### Added

- `enableSmartDeploy` feature toggle

## [3.7.0] - 2021-04-07

### Updated

- update `kubernetes-service` to v2.1.1
- update `authorization-service` to v2.0.2
- update `websites` to v1.1.1
- update `backend` to v8.1.0
- update `deploy-service` to v4.0.1
- update `marketplace-sync` hook to v2.3.0

### Fixed

- added missing `FT_ENABLE_K8S_SECRETS_IN_SERVICES` in deploy service env definition

### Added

- add `marketplaceSyncFilters` to allow specifying custom marketplace update filters
- add `publicVariablesFolderName` property to set backend env var `UNSECRETED_VARIABLES_FOLDER_NAME`

## [3.6.1] - 2021-04-02

### Updated

- update `backend` to v8.0.2

## [3.6.0] - 2021-03-31

### Added

- `enableMiaCraft` feature toggle
- `mia-craft-bff` service v1.1.0

### Updated

- update `backend` to v8.0.1
- update `websites` to v1.1.0

## [3.5.6] - 2021-03-25

### Updated

- update `backend` to v7.3.1

## [3.5.5] - 2021-03-23

### Updated

- update `backend` to v7.3.0

## [3.5.4] - 2021-03-22

### Updated

- update `marketplace-sync` hook to v2.2.0

## [3.5.3] - 2021-03-18

#### Updated

- update `backend` to v7.2.0
- update `aggregated-website` to 1.0.25

## [3.5.2] - 2021-03-15

Mia-Platform v7.2.3

### Added

- add env var `FT_ENABLE_FAST_DATA_SINGLE_VIEWS` to backend template
- add env var `FT_ENABLE_SMART_DEPLOY` to backend template
- add env var `FT_ENABLE_MIA_CRAFT` to backend template

### Updated

- update `backend` to v7.1.0
- update `cms-backend` to v4.0.3
- update `crud-service` to v3.2.2
- update `microservice-gateway` to v6.0.5
- update `swagger-aggregator` to v3.2.1
- update `v1-adapter` to 3.3.2
- update `aggregated-website` to 1.0.24

## [3.5.1] - 2021-03-10

### Fixed

- fix log parser label key

## [3.5.0] - 2021-03-09

### Added

- backend service environment variables for real-time updater resources.

### Updated

- update `backend` to v7.0.0
- update `websites` to v1.0.23

## [3.4.2] - 2021-03-04

### Updated

- update `backend` to v6.6.1

## [3.4.1] - 2021-03-04

### Updated

- update `websites` to v1.0.22

## [3.4.0] - 2021-03-01

### Added

- added `enablePublicVariables` toggle

### Updated

- update `websites` to v1.0.21
- update `backend` to v6.6.0
- update `deploy-service` to v3.1.0

## [3.3.0] - 2021-02-17

### Added

- added `enableK8sSecretsInServicesVariables` toggle

### Updated

- update `authentication-service` to v2.0.2
- update `api-portal` to v1.13.7
- update `marketplace-sync` to v2.1.1
- update `websites` to v1.0.19
- update `backend` to 6.5.0

## [3.2.1] - 2021-02-09

**Release platform v7.0.0**

### Updated

- update `backend` to 6.4.1

## [3.2.0] - 2021-02-09

### Added

- add `enableFastData` in configuration

### Updated

- update `websites` to 1.0.18

## [3.1.7] - 2021-02-09

### Changed

- Enable Fast Data by default

## [3.1.6] - 2021-02-09

### Updated

- update `backend` to 6.4.0
- update `cms-backend` to 4.0.2
- update `cms-site` to 9.13.0
- update `crud-service` to 3.2.1
- update `v1-adapter` to 3.3.1
- update `websites` to 1.0.17
- update `marketplace-sync` to v2.1.0

## [3.1.5] - 2021-02-04

### Updated

- updated `backend` to 6.3.1

## [3.1.4] - 2021-02-02

- updated `marketplace-sync` to v2.0.1

## [3.1.3] - 2021-02-02

### Updated

- updated `marketplace-sync` to v2.0.0
- updated `backend` to 6.3.0
- updated `websites` to 1.0.14

## [3.1.2] - 2021-01-28

### Updated

- updated `backend` to 6.2.0
- updated `websites` to 1.0.12

## [3.1.1] - 2021-01-25

### Updated

- updated `websites` to 1.0.9

## [3.1.0] - 2021-01-25

### Updated

- updated `backend` to 6.1.0
- updated `websites` to 1.0.9

## [3.0.16] - 2021-01-25

### Added

- added `enableK8sSecretsInServices` toggle

### Updated

- updated `backend` to 6.0.0
- updated `websites` to 1.0.8
- updated `deploy-service` to 3.0.0
- updated `kubernetes-service` to 2.1.0
- updated `microservice-gateway` to 6.0.4

## [3.0.15] - 2021-01-20

### Updated

- updated `backend` to 5.7.1

## [3.0.14] - 2021-01-13

### Updated

- updated `backend` to 5.7.0
- updated `websites` to 1.0.6
- updated `swagger-aggregator` to 3.2.0
- updated `v1-adapter` to 3.3.0

## [3.0.13] - 2021-01-05

Platform version v6.14.0

### Updated

- updated `backend` to 5.6.0
- updated `websites` to 1.0.5
- updated `cms-site` to 9.12.4
- updated `marketplace-sync` script to 1.2.2

## [3.0.12] - 2020-12-22

### Updated

- updated `backend` to 5.5.1

## [3.0.11] - 2020-12-10

### updated

- updated `marketplace-sync` script to 1.2.1

## [3.0.10] - 2020-12-10

### fixed

- fixed liveness and readiness probes to `backend` and `crud-service`

### updated

- updated `notifications-provider` to 2.0.1
- updated `marketplace-sync` script to 1.2.0
- updated `api-portal` to 1.13.6
- updated `authentication-service` to 2.0.1
- updated `backend` to 5.5.0
- updated `crud-service` to 3.2.0
- updated `swagger-aggregator` to 3.1.0
- updated `v1-adapter` to 3.2.4
- updated `aggregated-website` to 1.0.4
- updated crud collection `services`
- updated cmsProperties

## [3.0.9] - 2020-11-23

### Added

- add variables to v1-adapter to enable lookup export

## [3.0.8] - 2020-11-23

### updated

- updated `backend` to 5.4.0
- updated `api-portal` to 1.13.5
- updated `cms-site` to 9.12.2
- updated `files-service` to 2.1.0
- updated `microservice-gateway` to 6.0.2
- updated `v1-adapter` to 3.2.2

### Added

- add properties to services collection and cms page

## [3.0.7] - 2020-11-12

### udpated

- updated `backend` to 5.3.1
- updated `websites` to 1.0.3

## [3.0.6] - 2020-11-11

### updated

- updated `websites` to 1.0.2
- updated `backend` to 5.3.0
- updated `authorization-service` to 2.0.1

## [3.0.5] - 2020-10-26

### updated

- updated `websites` to 1.0.1

## [3.0.4] - 2020-10-23

### Added

- new required configuration `CONFIGURATIONS_SERVICE_HOST` for `deploy-service`

### Updated

- updated `deploy-service` to 2.0.1

## [3.0.3] - 2020-10-23

### Fixed

- added missing `v1-adapter` env vars

## [3.0.2] - 2020-10-23

### Fixed

- added missing `v1-adapter` configmap

## [3.0.1] - 2020-10-23

### Fixed

- fix values schema

## [3.0.0] - 2020-10-23

### BREAKING CHANGES

- removed `deploy-website`
- removed `infrastructure-website`
- removed `metrics-dashboard`
- removed `monitoring-dashboard`
- removed `test-debug-website`
- removed `website`

### Added

- added unique pod `websites` to aggregate console microfrontend to v1.0.0

### Updated

- updated `backend` to 5.2.0
- updated `api-portal `to 1.13.3
- updated `authentication-service` to 2.0.0
- updated `authorization-service` to 2.0.0
- updated `cms-backend` to 4.0.1
- updated `crud-service` to 3.1.1
- updated `files-service` to 2.0.1
- updated `microservice-gateway` to 6.0.1
- updated `swagger-aggregator` to 3.0.1
- updated `v1-adapter` to 3.0.1
- updated `deploy-service` to 2.0.0
- updated `kubernetes-service` to 2.0.0
- updated `notification-provider` to 2.0.0
- updated `environment-variables-service` to 2.0.0

## [2.4.8] - 2020-10-19

### Fixed

- context security in hooks are now under `podSecurityPolicyEnabled` FT

## [2.4.7] - 2020-10-15

### Fixed

- change app version

## [2.4.6] - 2020-10-15

### Updated

- updated backend to 5.1.0
- updated infrastructure-website to 1.3.3
- updated website to 1.32.2

## [2.4.5] - 2020-10-12

### Fixed

- fix marketplace hook env variable

## [2.4.4] - 2020-10-12

### Fixed

- fix label indentation

## [2.4.3] - 2020-10-12

### Fixed

- fix labels in marketplaceCategories and mongoCleaner hook

## [2.4.2] - 2020-10-05

### Added

- update script for Marketplace categories update

### Changed

- update service configuration
- upgrade console backend to 5.0.0
- upgrade console website to 1.32.1
- upgrade environments-variables to 1.0.3
- upgrade metrics dashboard to 1.2.0

### Removed

- environment variable `ENABLE_CREATE_PROJECT_ON_INFRASTRUCTURE_WEBSITE` on backend service

### Added

- add `doNotUse_DisableStrictContentTypeCheckInMicroserviceGateway` config value

## [2.4.1] - 2020-09-29

### Changed

- update backend to 4.2.1

## [2.4.0] - 2020-09-16

PLATFORM VERSION TO v6 🥳🎉

### Added

- add FT_ENABLE_PROJECTS_CARDS_WITH_K8S_METRICS to backend service set to true

### Changed

- update service configuration
- update projects and tenants crud fields
- upgrade swagger-aggregator to 2.5.0
- upgrade website to 1.31.0
- upgrade backend to 4.2.0

## [2.3.0] - 2020-09-14

### Changed

- `podSecurityPolicyEnabled` configuration now turn off event the `securityContext` blocks

## [2.2.12] - 2020-09-14

### Changed

- upgrade backend to 4.1.2
- upgrade website to 1.30.1

## [2.2.11] - 2020-09-10

### Changed

- upgrade backend to 4.1.1

## [2.2.10] - 2020-09-09

### Changed

- upgrade infrastructure-website to 1.3.2

## [2.2.9] - 2020-09-09

### Changed

- changed the annotations and labels of pods, to decrease the amount of creation between
  upgrades
- upgrade cms-site to 9.10.0
- upgrade backend to 4.1.0
- upgrade website to 1.30.0
- upgrade crud-service to 2.1.7
- upgrade kubernetes-service to 2.1.5
- upgrade microservice-gateway to 5.2.0

## [2.2.8] - 2020-09-03

### Changed

- upgrade website to 1.29.1

## [2.2.7] - 2020-09-03

### Changed

- update config files of all services
- upgrade backend to 4.0.0
- upgrade cms-site to 9.9.0
- upgrade files-service to 1.3.0
- upgrade metrics-dashboard to 1.1.0
- upgrade swagger-aggregator to 2.4.1
- upgrade website to 1.29.0

## [2.2.6] - 2020-08-27

### Changed

- fix cms configuration for tenant defaultTemplateId field
- add `x-ft-use-git-provider` header to proxy in environment-variables-service

## [2.2.5-3] - 2020-09-07

### Added

- add custom override for export-service hostname

## [2.2.5-2] - 2020-09-07

### Changed

- allow deployment back to kubernetes 1.11

## [2.2.5-1] - 2020-09-03

### Added

- add support for default jenkins endpoint

## [2.2.5] - 2020-08-06

### Changed

- upgrade website to 1.4.0
- upgrade backend to 3.5.0
- upgrade kubernetes-service to 1.5.0
- upgrade api-portal to 1.13.1

## [2.2.4] - 2020-08-03

### Added

- add `workflow` scope to github

## [2.2.3] - 2020-08-03

### Changed

- upgrade cms-site to 9.8.2

## [2.2.2] - 2020-07-27

### Changed

- upgrade swagger-aggregator to 2.3.0
- upgrade api-portal to 1.12.0

## [2.2.1] - 2020-07-24

### Changed

- upgrade console backend to 3.4.1
- upgrade console website to 1.27.0
- updated crud-service, swagger-aggegator and cms-backend configurations

## [2.2.0] - 2020-07-21

### Added

- add new configuration `customServicesImagePullSecrets` to specify multiple image pull secrets

### Changed

- fix wrong name of the env in the console backend for setting up custom image pull secret

## [2.1.1] - 2020-07-21

### Changed

- upgrade authentication-service to 1.1.4

## [2.1.0] - 2020-07-21

### Added

- values schema validation
- documentation
- NOTES.txt for a summary at the end of the deployment

### Changed

- improved defaults values
- unify definition for docker image name and deployment replicas function for centralization of default values

## [2.0.1] - 2020-07-20

### Changed

- update authentication-service to 1.1.3

## [2.0.0] - 2020-07-17

### Added

- `imagePullPolicy` for every service can be customized

### Changed

- configuration for authenticationService now is generated and allow for multiple providers and different settings for cms and console endpoints
- upgrade authentication-service to v1.1.2
- upgrade login-site to v7.1.1

## [1.1.2] - 2020-07-16

### Added

- private CA Bundle for self signed endpoints

## [1.1.1] - 2020-07-09

### Changed

- change name of psp resources

## [1.1.0] - 2020-07-09

### Added

- add cms to console project!
- upgrade version to v5.10.0

### Changed

- wrong separator for export-service externalname
- use correct name for export-service in v1-adapter deployment
- use configurable multitenant namespace name

## [1.0.0] - 2020-07-08

### Added

- Initial Release 🎉🎉🎉

[Unreleased]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.17-rc.1...main
[9.0.17-rc.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.16...v9.0.17-rc.1
[9.0.16]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.15...v9.0.16
[9.0.15]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.14...v9.0.15
[9.0.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.13...v9.0.14
[9.0.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.12...v9.0.13
[9.0.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.11...v9.0.12
[9.0.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.10...v9.0.11
[9.0.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.9...v9.0.10
[9.0.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.8...v9.0.9
[9.0.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.7...v9.0.8
[9.0.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.6...v9.0.7
[9.0.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.5...v9.0.6
[9.0.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.4...v9.0.5
[9.0.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.3...v9.0.4
[9.0.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.2...v9.0.3
[9.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.1...v9.0.2
[9.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v9.0.0...v9.0.1
[9.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.7...v9.0.0
[8.3.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.6...v8.3.7
[8.3.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.5...v8.3.6
[8.3.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.4...v8.3.5
[8.3.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.3...v8.3.4
[8.3.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.2...v8.3.3
[8.3.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.1...v8.3.2
[8.3.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.3.0...v8.3.1
[8.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.22...v8.3.0
[8.2.22]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.21...v8.2.22
[8.2.21]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.20...v8.2.21
[8.2.20]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.19...v8.2.20
[8.2.19]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.18...v8.2.19
[8.2.18]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.17...v8.2.18
[8.2.17]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.16...v8.2.17
[8.2.16]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.15...v8.2.16
[8.2.15]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.14...v8.2.15
[8.2.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.13...v8.2.14
[8.2.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.12...v8.2.13
[8.2.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.11...v8.2.12
[8.2.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.10...v8.2.11
[8.2.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.9...v8.2.10
[8.2.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.8...v8.2.9
[8.2.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.7...v8.2.8
[8.2.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.6...v8.2.7
[8.2.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.5...v8.2.6
[8.2.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.4...v8.2.5
[8.2.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.3...v8.2.4
[8.2.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.2...v8.2.3
[8.2.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.1...v8.2.2
[8.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.2.0...v8.2.1
[8.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.14...v8.2.0
[8.1.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.13...v8.1.14
[8.1.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.12...v8.1.13
[8.1.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.11...v8.1.12
[8.1.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.10...v8.1.11
[8.1.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.9...v8.1.10
[8.1.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.8...v8.1.9
[8.1.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.7...v8.1.8
[8.1.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.6...v8.1.7
[8.1.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.5...v8.1.6
[8.1.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.4...v8.1.5
[8.1.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.3...v8.1.4
[8.1.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.2...v8.1.3
[8.1.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.1...v8.1.2
[8.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.1.0...v8.1.1
[8.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.21...v8.1.0
[8.0.22]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.21...v8.0.22
[8.0.21]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.20...v8.0.21
[8.0.20]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.19...v8.0.20
[8.0.19]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.18...v8.0.19
[8.0.18]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.17...v8.0.18
[8.0.17]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.16...v8.0.17
[8.0.16]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.15...v8.0.16
[8.0.15]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.14...v8.0.15
[8.0.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.13...v8.0.14
[8.0.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.12...v8.0.13
[8.0.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.11...v8.0.12
[8.0.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.10...v8.0.11
[8.0.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.9...v8.0.10
[8.0.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.8...v8.0.9
[8.0.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.7...v8.0.8
[8.0.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.6...v8.0.7
[8.0.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.5...v8.0.6
[8.0.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.4...v8.0.5
[8.0.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.3...v8.0.4
[8.0.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.2...v8.0.3
[8.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.1...v8.0.2
[8.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v8.0.0...v8.0.1
[8.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.3.1...v8.0.0
[7.3.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.3.0...v7.3.1
[7.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.2.4...v7.3.0
[7.2.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.2.3...v7.2.4
[7.2.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.2.2...v7.2.3
[7.2.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.2.1...v7.2.2
[7.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.2.0...v7.2.1
[7.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.1.4...v7.2.0
[7.1.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.1.3...v7.1.4
[7.1.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.1.2...v7.1.3
[7.1.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.1.1...v7.1.2
[7.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.1.0...v7.1.1
[7.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.0.2...v7.1.0
[7.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.0.1...v7.0.2
[7.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v7.0.0...v7.0.1
[7.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.10...v7.0.0
[6.1.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.9...v6.1.10
[6.1.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.8...v6.1.9
[6.1.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.7...v6.1.8
[6.1.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.6...v6.1.7
[6.1.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.5...v6.1.6
[6.1.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.4...v6.1.5
[6.1.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.3...v6.1.4
[6.1.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.2...v6.1.3
[6.1.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.1...v6.1.2
[6.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.1.0...v6.1.1
[6.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.6...v6.1.0
[6.0.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.5...v6.0.6
[6.0.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.4...v6.0.5
[6.0.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.3...v6.0.4
[6.0.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.2...v6.0.3
[6.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.1...v6.0.2
[6.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v6.0.0...v6.0.1
[6.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.9...v6.0.0
[5.13.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.8...v5.13.9
[5.13.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.7...v5.13.8
[5.13.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.6...v5.13.7
[5.13.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.5...v5.13.6
[5.13.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.4...v5.13.5
[5.13.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.3...v5.13.4
[5.13.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.2...v5.13.3
[5.13.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.1...v5.13.2
[5.13.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.13.0...v5.13.1
[5.13.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.12.4...v5.13.0
[5.12.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.12.3...v5.12.4
[5.12.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.12.2...v5.12.3
[5.12.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.12.1...v5.12.2
[5.12.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.12.0...v5.12.1
[5.12.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.15...v5.12.0
[5.11.15]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.14...v5.11.15
[5.11.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.13...v5.11.14
[5.11.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.12...v5.11.13
[5.11.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.11...v5.11.12
[5.11.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.10...v5.11.11
[5.11.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.9...v5.11.10
[5.11.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.8...v5.11.9
[5.11.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.7...v5.11.8
[5.11.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.6...v5.11.7
[5.11.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.5...v5.11.6
[5.11.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.4...v5.11.5
[5.11.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.3...v5.11.4
[5.11.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.2...v5.11.3
[5.11.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.1...v5.11.2
[5.11.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.11.0...v5.11.1
[5.11.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.10.0...v5.11.0
[5.10.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.9.1...v5.10.0
[5.9.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.9.0...v5.9.1
[5.9.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.8.4...v5.9.0
[5.8.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.8.3...v5.8.4
[5.8.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.8.2...v5.8.3
[5.8.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.8.1...v5.8.2
[5.8.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.8.0...v5.8.1
[5.8.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.7.3...v5.8.0
[5.7.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.7.2...v5.7.3
[5.7.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.7.1...v5.7.2
[5.7.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.7.0...v5.7.1
[5.7.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.7...v5.7.0
[5.6.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.6...v5.6.7
[5.6.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.5...v5.6.6
[5.6.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.4...v5.6.5
[5.6.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.3...v5.6.4
[5.6.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.2...v5.6.3
[5.6.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.1...v5.6.2
[5.6.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.6.0...v5.6.1
[5.6.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.5.3...v5.6.0
[5.5.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.5.2...v5.5.3
[5.5.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.5.1...v5.5.2
[5.5.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.5.0...v5.5.1
[5.5.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.7...v5.5.0
[5.4.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.6...v5.4.7
[5.4.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.5...v5.4.6
[5.4.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.4...v5.4.5
[5.4.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.3...v5.4.4
[5.4.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.2...v5.4.3
[5.4.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.1...v5.4.2
[5.4.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.4.0...v5.4.1
[5.4.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.3.1...v5.4.0
[5.3.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.3.0...v5.3.1
[5.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.2.2...v5.3.0
[5.2.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.2.1...v5.2.2
[5.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.2.0...v5.2.1
[5.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.1.0...v5.2.0
[5.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.5...v5.1.0
[5.0.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.4...v5.0.5
[5.0.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.3...v5.0.4
[5.0.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.2...v5.0.3
[5.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.1...v5.0.2
[5.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v5.0.0...v5.0.1
[5.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.6...v5.0.0
[4.4.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.5...v4.4.6
[4.4.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.4...v4.4.5
[4.4.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.3...v4.4.4
[4.4.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.2...v4.4.3
[4.4.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.1...v4.4.2
[4.4.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.4.0...v4.4.1
[4.4.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.3.3...v4.4.0
[4.3.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.3.2...v4.3.3
[4.3.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.3.1...v4.3.2
[4.3.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.3.0...v4.3.1
[4.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.2.4...v4.3.0
[4.2.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.2.3...v4.2.4
[4.2.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.2.2...v4.2.3
[4.2.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.2.1...v4.2.2
[4.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.2.0...v4.2.1
[4.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.1.1...v4.2.0
[4.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.1.0...v4.1.1
[4.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.0.2...v4.1.0
[4.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.0.1...v4.0.2
[4.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v4.0.0...v4.0.1
[4.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.7...v4.0.0
[3.12.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.6...v3.12.7
[3.12.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.5...v3.12.6
[3.12.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.4...v3.12.5
[3.12.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.2...v3.12.4
[3.12.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.1...v3.12.2
[3.12.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.12.0...v3.12.1
[3.12.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.7...v3.12.0
[3.11.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.6...v3.11.7
[3.11.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.5...v3.11.6
[3.11.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.4...v3.11.5
[3.11.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.3...v3.11.4
[3.11.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.2...v3.11.3
[3.11.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.1...v3.11.2
[3.11.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.11.0...v3.11.1
[3.11.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.10.1...v3.11.0
[3.10.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.10.0...v3.10.1
[3.10.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.9.1...v3.10.0
[3.9.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.9.0...v3.9.1
[3.9.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.8.3...v3.9.0
[3.8.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.8.2...v3.8.3
[3.8.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.8.1...v3.8.2
[3.8.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.8.0...v3.8.1
[3.8.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.7...v3.8.0
[3.7.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.6...v3.7.7
[3.7.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.5...v3.7.6
[3.7.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.4...v3.7.5
[3.7.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.3...v3.7.4
[3.7.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.2...v3.7.3
[3.7.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.1...v3.7.2
[3.7.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.7.0...v3.7.1
[3.7.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.6.1...v3.7.0
[3.6.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.6.0...v3.6.1
[3.6.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.5...v3.6.0
[3.5.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.4...v3.5.5
[3.5.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.3...v3.5.4
[3.5.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.2...v3.5.3
[3.5.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.1...v3.5.2
[3.5.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.5.0...v3.5.1
[3.5.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.4.2...v3.5.0
[3.4.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.4.1..v3.4.2
[3.4.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.4.0...v3.4.1
[3.4.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.3.0...v3.4.0
[3.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.2.1...v3.3.0
[3.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.2.0...v3.2.1
[3.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.8...v3.2.0
[3.1.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.7...v3.1.8
[3.1.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.6...v3.1.7
[3.1.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.5...v3.1.6
[3.1.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.4...v3.1.5
[3.1.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.3...v3.1.4
[3.1.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.2...v3.1.3
[3.1.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.1...v3.1.2
[3.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.1.0...v3.1.1
[3.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.16...v3.1.0
[3.0.16]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.15...v3.0.16
[3.0.15]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.14...v3.0.15
[3.0.14]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.13...v3.0.14
[3.0.13]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.12...v3.0.13
[3.0.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.11...v3.0.12
[3.0.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.10...v3.0.11
[3.0.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.9...v3.0.10
[3.0.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.8...v3.0.9
[3.0.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.7...v3.0.8
[3.0.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.6...v3.0.7
[3.0.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.5...v3.0.6
[3.0.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.4...v3.0.5
[3.0.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.3...v3.0.4
[3.0.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.2...v3.0.3
[3.0.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.1...v3.0.2
[3.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v3.0.0...v3.0.1
[3.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.8...v3.0.0
[2.4.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.7...v2.4.8
[2.4.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.6...v2.4.7
[2.4.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.5...v2.4.6
[2.4.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.4...v2.4.5
[2.4.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.3...v2.4.4
[2.4.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.2...v2.4.3
[2.4.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.1...v2.4.2
[2.4.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.4.0...v2.4.1
[2.4.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.3.0...v2.4.0
[2.3.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.12...v2.3.0
[2.2.12]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.11...v2.2.12
[2.2.11]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.10...v2.2.11
[2.2.10]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.9...v2.2.10
[2.2.9]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.8...v2.2.9
[2.2.8]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.7...v2.2.8
[2.2.7]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.6...v2.2.7
[2.2.6]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.5...v2.2.6
[2.2.5-3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.5-2...v2.2.5-3
[2.2.5-2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.5-1...v2.2.5-2
[2.2.5-1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.5...v2.2.5-1
[2.2.5]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.4...v2.2.5
[2.2.4]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.3...v2.2.4
[2.2.3]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.2...v2.2.3
[2.2.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.1...v2.2.2
[2.2.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.2.0...v2.2.1
[2.2.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.1.1...v2.2.0
[2.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.1.0...v2.1.1
[2.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.0.1...v2.1.0
[2.0.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v2.0.0...v2.0.1
[2.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v1.1.2...v2.0.0
[1.1.2]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v1.1.1...v1.1.2
[1.1.1]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v1.1.0...v1.1.1
[1.1.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/compare/v1.0.0...v1.1.0
[1.0.0]: https://git.tools.mia-platform.eu/platform/devops/console-helm-chart/-/tags/v1.0.0
