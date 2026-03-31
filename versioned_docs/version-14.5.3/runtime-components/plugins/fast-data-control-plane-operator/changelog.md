---
id: changelog
title: Changelog
sidebar_label: CHANGELOG
---



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-01-28

### Breaking Change

- Control Plane Operator now starts accepting connections incoming from Fast Data workloads only after
it has connected itself to the main Control Plane instance.
Consequently, Fast Data workloads must be updated to the version supporting this behavior.
For more details, please read the page detailing services compatibility under the [Runtime Management](/products/fast_data/runtime_management/compatibility_matrix.md) section of Fast Data product.

## [0.1.1] - 2024-12-04

### Added

- Add Fast Data connection in the pipelines passed to the Control Plane

## [0.1.0] - 2024-10-10

- Initial release of the Control Plane Operator
