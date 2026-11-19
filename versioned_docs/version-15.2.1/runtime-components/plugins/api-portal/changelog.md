---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---



## [2.2.2] - 2025-05-14

### Fixed

- Fixed scroll in tags and filters with select

### Security

- Fix vulnerabilities

## [2.2.1] - 2025-05-07

### Fixed

- Fixed missing fallback language

## [2.2.0] - 2025-02-14

### Added

- Added global select to choose which server to send requests
- Added configurable logo in header and favicon
- Added configurable prefix to endpoints in order to support multiple API Portal

### Fixed

- Fixed loading when search input is emptied

## [2.1.2] - 2025-02-03

### Security

- Fix vulnerabilities

## [2.1.1] - 2024-11-26

### Security

- Added SBOM and docker image sign

## [2.1.0] - 2024-08-26

### Added

- Added support to Oauth 2.0 authorization

### Fixed

- Changed warning note on download modal
- Fix scroll

## [2.0.1] - 2024-07-11

### Added

- Added loading to download buttons while downloading

### Fixed

- Fixed filter function

## [2.0.0] - 2024-06-17

###  BREAKING CHANGES

- The service now fetches specifications from `/api/openapi/json`
- The service now fetches subswaggers from `/api/openapi/subswaggers`
- The service now fetches raw specifications for download from `/api/openapi/raw`
- Official Swagger Editor UI is now used throughout the application

## 1.16.13 - 2024-04-11

### Changed

- add `SWAGGER_VERSION` environment variable

## 1.16.12 - 2023-11-28

### Changed

- upgrade static-files to 3.3.1

## 1.16.11 - 2023-11-27

### Changed

- upgrade static-files to 3.3.0

## 1.16.10 - 2023-11-16

### Fixed

- ci to build image

### Changed

- API Portal Configuration doc updated

## 1.16.9 - 2023-11-16

### Fixed

- remove bad `base` tag in `index.html`

## 1.16.8 - 2023-10-24

### Fixed

- ci to build image

## 1.16.7 - 2023-10-6

### Changed

- Upgrade api-explorer version to 6.7.9

## 1.16.6 - 2023-03-15

### Changed

- Upgrade api-explorer version to 6.7.8

## 1.16.5 - 2023-02-17

### Changed

- Upgrade api-explorer version to 6.7.7

### Changed

- Capitalized anchor link titles

## 1.16.4 - 2022-06-07

### Changed

- Upgrade static-files version to 3.2.8

## 1.16.2 - 2022-04-15

### Changed

- Upgrade api-explorer version to 6.7.5

## 1.16.1 - 2022-04-08

### Changed

- Upgrade api-explorer version to 6.7.1

## 1.16.0 - 2022-03-30

### Changed

- Upgrade api-explorer version to 6.7.0

## 1.15.1 - 2022-02-15

### Fixed

- Docker image vulnerabilities

## 1.15.0 - 2022-01-20

### Added

- added anchors to explorer routes.

### Changed

- Upgrade api-explorer version to 6.6.10

## 1.14.4 - 2021-12-20

### Changed

- Upgrade api-explorer version to 6.6.9

## 1.14.3 - 2021-12-15

### Changed

- Upgrade api-explorer version to 6.6.8

## 1.14.2 - 2021-12-10

### Changed

- Upgrade api-explorer version to 6.6.6

## 1.14.1 - 2021-12-03

### Fixed

- Fixed unmount behavior for Qiankun
- Page title can be configured using props
- Upgrade api-explorer version to 6.6.5

## 1.14.0 - 2021-11-09

### Added

- qiankun integration.
- view mode support.
- updated `@mia-platform/api-explorer` to version 6.6.4
- view mode for authorization modal

### Fixed

- fix panel open on high cpu usage
- fix bearer token authentication in AuthForm
- UI fixes to header, sidebar and content

## 1.13.9 - 2021-09-22

### Fixes

- Security fixes: upgrade static-files image version

## 1.13.8 - 2021-09-16

### Added

- added documentation pages.

### Changed

- [ISSUE-28]: updated `@mia-platform/api-explorer` to version 6.5.8

## 1.13.7 - 2021-02-04

### Changed

- @mia-platform/api-explorer ^6.5.6

## 1.13.6 - 2020-12-02

### Changed

- @mia-platform/api-explorer ^6.5.6

## 1.13.5 - 2020-11-23

### Changed

- @mia-platform/api-explorer ^6.5.5

## 1.13.4 - 2020-11-04

### Changed

- updated api-explorer 6.5.3

## 1.13.3 - 2020-10-13

### Changed

- updated api-explorer 6.5.2

## 1.13.2 - 2020-10-05

### Fixed

- typo for it internationalization

## 1.13.1 - 2020-08-05

### Changed

- updated api-explorer 6.5.1

## 1.13.0 - 2020-07-28

### Changed

- @mia-platform/api-explorer ^6.5.0
- decrease for an error of lint `eslint-plugin-react` from `^7.12.4` to `7.12.3`. problem persist in `7.20.4`, see this [issue](https://github.com/yannickcr/eslint-plugin-react/issues/2728)

## 1.12.0 - 2020-07-08

### Changed

- @mia-platform/api-explorer ^6.4.1

### Changed

- remove option 'All' subswagger from category select by using `includeAll=false` query param

## 1.11.2 - 2020-06-24

### Updated

- @mia-platform/api-explorer ^6.3.6

### Fixed

- Custom multipart fields are ignored and not inserted in the request
- Render error when press enter in a integer/number field with content-type multipart/form-data

## 1.11.1 - 2020-06-12

### Fixed

- Added minWidth in Logo to fix the overlap with name project
in Safari e Firefox
- Form - handle field value when clear the input (unset for number and integer, empty string for type string)
- Form - render UI correctly when preview the image to upload

### Changed

- @mia-platform/api-explorer ^6.3.5

## 1.11.0 - 2020-06-03

### Changed

- Change position of Auth button & DownloadSchemas component

### Updates

- @mia-platform/api-explorer ^6.3.2 with new UI for the forms
- moved tags list on the left
- download API documentation as yaml

### Fixed

- changed string "Open Api 3" into "OpenAPI 3" and added alert for swagger 2

## 1.10.0 - 2020-05-19

### Added

- Add `DownloadModal` component to download swagger file in ApiViewer container

### Updates

- `reactord` 2.19.1

## 1.9.0 - 2020-04-16

### Changed

- Updated base API to download newer OpenAPI v3 schemas

## 1.8.0 - 2020-03-10

### Added

- integrated APIExplorer @6.1.0 adding support for `anyOf`, `oneOf`, `allOf` and `not` schemas

## 1.7.1 - 2020-02-11

### Changed

- new icon for authentication security input

### Fixed

- improved rendering performances disabling text conversion of openapi files

## 1.7.0 - 2019-12-01

### Changed

- Remove Menu from the Header
- api-explorer with new form

### Added

- Add button to authenticate all routes
- edit data form using a json

### Fixed

- choose type of data field

## [1.6.2] - 2019-10-5

### Added

- Add InputSearch component in Header

### Fixes

- Fixed window resize

## [1.6.1] - 2019-09-10

### Updates

- updated api-explorer

## [1.6.0] - 2019-07-31

### Added

- api search and method filter

### Updates

- update `reactord@1.8.0`
- update `api-explorer@5.8.4`.

### Fixes

- change error handling and fix subswagger URL

## [1.5.0] - 2019-07-22

### Updates

- updated api-explorer
- shows JsonSchema of request and response
- added category (subswagger) selection, restructured codebase
- updated reactor-design lib
- added tags filter

## [1.4.0] - 2019-07-05

### Restyling

- Restyled the whole API presentation, removed the sidebar and added the index bar to navigate through API tags.

## [1.3.0] 2019-06-27

### Added

- updated api-explorer
- shows the body when status code is 401

### Restyling

- response headers are shown in a more readable way

## [1.2.0] 2019-06-25

### Added

- Tag all apis in sidebar

## [1.1.0] 2019-06-19

### Added

- In the sidebar are shown the tags inserted in the swagger
- Support for multipart request

### Fixes

- It's shown the correct project name
