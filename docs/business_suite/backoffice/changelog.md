---
id: changelog
title: CHANGELOG
sidebar_label: CHANGELOG
---
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2022-05-25

### Added

- `navigationType` can be specified in `bk-table` in prop `browseOnRowSelect`, specifying the desired navigation method.
- `bk-form-modal` and `bk-form-drawer` are implemented in lit
- `bk-card` footer accepts dynamic configurations with handlebars notation
- it is allowed to search numbers
- nested objects visualization supports file upload/download

## [1.0.1] - 2022-05-12

### Added

- `Table` accepts (template, configMap) pairs in custom components properties.
- `Table` accepts `onCellClickBuilder`, building `onClick` callback for cells.
- property `customActions` in `bk-table` accepts (`template`, `configMap`) pairs for values depending on table row.
- `bk-table` accepts `openFileInViewerRegex`, determining which file cells are clickable, opening the file inside the native viewer of the browser.
- support to subsets of operators in `bk-filter-drawer` + support to `string` enum fields.
- new `bk-layout-container` component allows to render multiple configurations within the same plugin.
- `bk-tabs` migrated to lit components.
- `bk-tabs` can pipe custom events to the `EventBus`.
- date filters now support key `$today` as value, indicating the current date

## [1.0.0] - 2022-04-22

### Added

- added new component `Chip`
- building custom component inside `Table` handles undefined context in handlebars
- `Pagination` supports `buttonsOnly` modality, only displaying previous button, next button and page size menu
- property `allowNavigation` in `bk-form-card`, `bk-form-drawer` and `bk-form-modal` accepts values true, false, 'show-editor'
- `bk-button` accepts property `navigationStrategy` which allows to disable/hide the button in navigation
- key `showInViewer` in `formOptions` inside the data-schema and key `showInViewer` in `downloadFile`'s meta allow to display supported files (PDFs) inside the browser, while property `showPdfInBrowser` in `bk-file-client` is no longer needed
- added new component `bk-chip`
- `bk-crud-client` can retrieve `http` responses and append the content to the `success` event payload
- `bk-state-adapter` allows carrying some state to another plugin + new documentation on `plugin navigation`
- if a negative page total count is received, `bk-pagination` only displays previous button, next button and page-size menu, omitting current page, page total and skip all buttons

## [0.10.7] - 2022-04-08

### BREAKING CHANGES

- `lookupQueries` require a new key `propertyType` that specifies the type of the `property` field that is queried if this is not `string`.
  How to fix: add a new key `propertyType` in each filter inside `lookupQueries`, with the type of the queried property.

### Added

- added new property `computeOptionKey` to `Form` and `Table` that allows to compute the key to use when retrieving options for `lookup`s and `multilookup`s
- `Table` supports custom components in the actions column
- `lookup`s and `multi-lookup`s fields are resolved when navigating nested objects/arrays in `bk-table`, `bk-form-drawer` and `bk-form-modal`
- `bk-table` supports custom components in the actions column via the prop `customActions`
- `lookupQueries` now support queries based on fields that are not included as properties in the `data-schema`. Key `propertyType` added to `lookupQueries`, indicating the type of the property being filtered
- `bk-tabs` supports handlebars in filters with array value
- `bk-crud-lookup-client` supports `extraLookupKeys`, which specifies extra fields to retrieve data from CRUD collections
- `bk-pagination` is now a lit component

## [0.10.6] - 2022-04-01

### BREAKING CHANGES

- `crud-client` interacts with `window.history` using `replaceState` instead of `pushState` allowing plugin navigation. (very low impact)

### Added

- It is now possible to specify the hiddenLabel visualization option in dataschema properties to hide the table column name.
- It is now possible to specify the sortable visualization option in dataschema properties to enable/disable the table column sort.
- Moved search-bar logic to web components
- `object` visualization template
- `bk-crud-lookup-client` now supports searchLookups event, searching lookups against a text value
- `bk-crud-client` now supports search queries on lookups
- removed `bk-search-bar` component
- `bk-file-client` can be configured to request in-browser PDF visualization instead of requesting download
- `bk-pdf-viewer` component allows to visualize PDF files in-browser
- added new `bk-search-bar` component that allows text search
- Add new web component `bk-dynamic-title`
- Add new web component `bk-list`
- Add new web component `bk-url-parameters`

## [0.10.5] - 2022-03-17

### Added

- Added new component `Generic Button`
- Added `between` filter
- Dynamic href are resolved for link add-ons.
- Added new components `NavigationBackArrow` and `Breadcrumbs`
- It is now possible to specify dynamic links for href in link addons.
- It is now possible to navigate and edit nested objects.
- `dataSchema` supports type `object` format `localized-text` and renders the object according with the browser language
- It is now possible to specify a `between` operator for date fields in filters.
- Form card component `bk-form-card`
- Subtitle for `form-modal` and `form-drawer`
- `nativeDownload` on `bk-export` enables native browser file download aliasing the export service
- Add new web component `bk-generic-button` - it handles configurable onCLick action.
- `bk-dynamic-title` component
- Add new web component `bk-navigation-nack-arrow` and `bk-breadcrumbs` to handle nested objects navigation.

## [0.10.4] - 2022-02-21

### Fixed

- Avoid FontAwesome's CSS collision

### Added

- fetchOptions for dependent fields is run on on-blur event

## [0.10.3] - 2022-01-28

### Fixed

- when `null` object reaches a table it is correctly printed as an italic placeholder string

### Added

- `Table` and `Form` now receive already resolved lookup data
- `Form` receives options and fetchOptions properties for dependent lookup and multilookup fields
- Options for lookup fields are now fetched live as the user is typing, instead of being retrieved all at once
- If key is turned on --> duplicate keeps the state. If state is passed as not undefined, creating drags it along as well
- Unresolved lookups can be set to display a custom error message on `bk-table`, `bk-form-drawer` and `bk-form-modal`
- It is now possible to specify dependencies between lookup and multilookup fields specifying `lookupDeps` inside `lookupOptions` in the dataSchema.
- It is now possible to specify `lookupAddTrailingSlash` in `lookupOptions` which controls whether or not a trailing `/` is added to the url when the lookup data is queried. Defaults to `true`.

## [0.10.2] - 2022-01-14

### Fixed

- It is now possible to paste content in `Editor` without scrolling back to the top

### Added

- `Form` allows to visualize `object`s and `array`s either as table or MonacoEditor, when attached to modal viewer
- `allowObjectAsTable` property/attribute added to `bk-form-modal`
- `bk-add-new-button` now accepts an initialValues prop that gets forwarded to the `add-new` event.

## [0.10.1] - 2021-12-17

### Fixed

- [Issue-38](https://git.tools.mia-platform.eu/platform/backoffice/headless-cms/-/issues/38) definitive delete sends `__STATE__` to CRUD jointly with delete by id request
  
## [0.10.0] - 2021-12-10

### Fixed

- `filterForm` now correctly supports live search in lookup fields
- readonly form drawer doesn't overwrite configurations/data-schema
- Query builder now starts off from a fresh query every time and creates it with the current query object, any other query parameter will be removed
- `bk-tabs` now expects every tab to have also a `key` property in tab objects, objects with no `key` property are deprecated, this is to keep consistency with links exchanged between users with different ACL rules
- `bk-form-drawer` now correctly passes language to its inner components
- `bk-filter-form` now correctly supports live search in lookup fields

### BREAKING CHANGES

- Tabs props now expect `defaultActiveKey` as `string` instead of `defaultActiveIndex`, `tabs` has to be provided as a `Record<string, Tab>` instead of an array of tabs
- `using-drawer` event is now `using-form-container`

### Added

- Created new Editor component
- Created new format `editor` for the form
- Created modal as form container
- save is enabled on form drawer if entries are not touched and relative config is enabled
- `readOnly` and `disabled` properties can be configured separately on `form-drawer` `insert` or `update` opening mode
- Created bk-form-modal component

## [0.9.0] - 2021-11-08

### Changed

- `form` now correctly validates `fileInput` `required` prop
- date, lookup, file, and form addon properties are now automatically excluded from queries generated
by free-text search
- drawer confirmation modal before close is configurable from prop `requireConfirm`
- drawer actions is configurable for each action from prop `closeOnClick`

### BREAKING CHANGES

- Table maxLines has no default value

### Added

- Table fill parent size if no maxLines has been specified

## [0.8.1] - 2021-10-26

### Fixed

- `bk-file-manager` now correctly sends `create-data` event after uploading following a `create-data-with-file`

### Added

- `table` now supports `defaultSortedProp` and `defaultSortOrder` props to mark a column as already sorted when generating headers
- `bk-table` now supports `initialSortProperty` and `initialSortDirection` props to provide a bootstrap sorting order to table

## [0.8.0] - 2021-10-22

### Fixed

- `bk-form-drawer` should not overwrite default locales when merging user config

### Changed

- Data are now refreshed after an HTTP POST triggered by a table row action

### Added

- Form now supports file input fields
- `bk-form-drawer` can now accept a `readonlyOnView` prop, when true, will use a readonly form to represent the selected data
- `bk-form-drawer` now communicates with file manager to handle multiple file upload linked to a record while creating/updating a record

## [0.7.0] - 2021-10-07

### BREAKING CHANGES

- `bk-file-picker-drawer`, `bk-form-drawer`, and `bk-filter-drawer` locale labels are now lowercase

### Added

- When creating a new event, `bk-calendar` can now pass a configurable payload alongside with `startDate` and `endDate`
- When creating a new event, `bk-calendar` can now pass a configurable payload alongside with `startDate` and `endDate`

## [0.6.0] - 2021-09-29

### Changed

- Changed calendar component props interfaces

### Added

- Components use `headers` custom prop to inject headers on http clients

## [0.5.0] - 2021-09-23

### Fixed

- Lookup queries must involve only fields declared within the `dataSchama`
- Href links are limited to current page domain. no external ref allowed
- `email` text field validation did occur twice

### Added

- Drawer component now can render custom data actions in the header
- Confirmation ConfirmationModal component
- `bk-form-drawer` awaits a success/error on their transaction before to close. On error it stays open
- Custom actions are available on `bk-form-drawer` component
- Added `bk-confirm-modal` Confirmation ConfirmationModal component
- Custom actions now can trigger the `bk-confirm-modal` by specifying `requireConfirm` and customize the messages in the modal if provided in the object
- `bk-form-drawer` uses `bk-confirm-modal` to ask confirmation before closing if fields are touched

## [0.4.0] - 2021-09-16

### Fixed

- Filters on array properties that are not multilookup are now supported
- `bk-filters-drawer` will now wait for lookup data if there is at least one lookup property
  in the data schema

### BREAKING CHANGES

- `bk-notification` component props were modified. Three props are now available: `successEventMap`, `errorEventMap` and `customEventMap` event maps
  `crud-client` and `crud-lookup-client` changed prop name from `schema` to `dataSchema`
- Naming convention moved to `bk-`component-name even for `clients` and `file-picker-drawer`

### Added

- Documentation automation
- Filters marked as hidden are not written in the URL

## [0.3.0] - 2021-09-09

### BREAKING CHANGES

- Form links now have to be declared in the `properties` property of the data schema. Property `formLinks`
  is no longer supported.
- Form titles and subtitles now have to be declared in the `properties` property of the data schema.
  Properties `title`, `subtitle` and `subtitlePosition` of `data-schema`'s `FormOptions` are no longer supported.

### Added

- Properties can be hidden from FiltersForm with property `filtersOptions.hidden` in data schema.
- Table `rowActions` support `download-file` event when a file is available in row
- Table `browseOnSelectRow` supports browsing away by clicking the row
- Add-new-button `browseOnButtonClick` supports browsing away by clicking the button
- Form web-components now support custom localized labels

## [0.2.0] - 2021-09-03

## [0.2.0-alpha.6] - 2021-09-02

### Fixed

- Tabs now support values with `|` in them
- Patch now works on $set $unset

## [0.2.0-alpha.5] - 2021-09-02

### Fixed

- `__STATE__` property has been removed from query parameters `_q` and moved to `_st`. Conflicting `__STATE__` changes are defaulted in favour of the selected tab `__STATE__` filter
- Fixed filters on lookup-client

### Added

- Tabs support `currentUser` on queries

## [0.2.0-alpha.4] - 2021-08-30

### Fixed

- Table lookup and multilookup resolve
- Monaco now correctly load in prod build
- Required complex objects now properly validate

### Changed

- The only supported format both in input and output is now only ISO8601 in every component using dates
- Only changed values are sent to patch
- Edited form output formatting for Dates

### Added

- File picker now handle the download of a previously uploaded file
- On update data, `null` fields are used for the `$unset`
- From file drawer is now possible to download the previously uploaded file
- From file drawer is now possible to delete the previously uploaded file

## [0.2.0-alpha.3] - 2021-08-23

### Fixed

- Fixed date input formatting when format was date-time, time
- Live search in form lookup and multilookup field is now applied to label instead of value
- Fixed multiple lookup on same datasource
- Fixed scroll on top of the drawer when is visible
- Fixed filter duplication reload when there was a filter configured in DataSchema
- Fixed date input formatting when format was date-time, time
- Fixed multiple lookup on same datasource
- Standardized locale for drawer web components
- Aligned test general behavior for eventBus and subscription

### Changed

- Dependencies upgrade
- Removed matchMedia mock
- Jest default testEnvironment = 'jsdom'
- Font awesome icons as peer dependency
- Removed peerDependencies from devDependencies
- Reordered scripts
- Now form accept a React.Ref object
- Dependencies upgrade
- Removed testSetup
- At boot, the table loading spinner is activated

### BREAKING CHANGES

- The entry point for bk-web-components is now exposed under `/{DOCKER_IMAGE_VERSION}/bk-web-components.esm.js` path

### Added

- React Table component supports cell visualization on type: `object` and format: `file`
- Added filter support to array types
- Added support to includeSome/includeAll/includeExactly operators in array filters
- Form localization
- Form links target property is now configurable
- Support for readonly properties in form
- File picker component
- Inserted `lookupQueries` in `lookupOptions`
- More efficient components behavior thanks to `useMemo` and `useCallback`
- CrudQueryConverter now supports includeSome/includeAll/includeExactly array operators in filter queries
- Added delete support on file-client
- Added `file-manger` web-component - it handles transactions between `file-client` and `crud-client`
  on collections having a property with format `file`
- Support for multiple queries in `and` in Tabs component.
- File picker with drawer component
- Inserted `filters` prop in `crud-lookup-client`
- The sort property in the url are managed by the table

## [0.2.0-alpha.2] - 2021-08-05

### Fixed

- Fix read only in date inputs.
- Aligned CRUD client format (string) with Calendar events format (date).

### Added

- Support to string formats `date-time` and `time` in form.
