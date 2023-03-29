---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---
## [0.7.3] - 2023-03-27

### Versioning

- Dev dependencies updated

### Fixed

- router does not force anymore a default path -> either the exact route or server-side middleware to reroute

## [0.7.2] - 2023-03-13

### Versioning

- `monaco-editor` to v0.36.1

###  Changed

- Full micro-lc configuration can now be edited from Advanced tab
- Changed placeholder icons
- When creating compose applications with inline config, templates can no longer be chosen
- When editing compose applications, config type can no longer be changed

### Fixed

- Advanced tab blue dot behavior rectified

## [0.7.1] - 2023-03-07

### Fixed

- Fixed docs URL

### Changed

- Compose `inline` mode temporarely cannot be chosen

## [0.7.0] - 2023-02-28

### Changed

- Reviewed page creation flow

### Fixed

- `monaco-editor` should resize when viewport changes
- `monaco-editor` checks both whether an incoming config update is not its own and doesn't match the current config hash
- Better handling of broken configuration input
- `console.css` moved outside of the js bundle

### Versioning

- Dev dependencies updated

## [0.6.2] - 2023-02-15

### Versioning

- Updated preview to 0.3.0

### Fixed

- Removed module preload in production (<https://github.com/umijs/qiankun/issues/1957>)
- Fixed editor height

### Changed

- Removed button shortcuts tooltips

## [0.6.1] - 2023-02-14

- Disabled Vite module preload in production

## [0.6.0] - 2023-02-14

- Applied new placeholder UI
- Placeholder will no longer show if endpoint is missing

## [0.5.0] - 2023-02-13

- Beta release
