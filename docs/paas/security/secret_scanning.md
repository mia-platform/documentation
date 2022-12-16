---
id: secret_scanning
title: Secret Scanning
sidebar_label: Secret scanning
---

Secret scanning provides the ability to detect secrets accidentally committed to remote repositories.
The check is performed by running the pipeline and a secret being pushed to a remote repository will cause the pipeline to fail.

The results of the analysis are shown in a report in the pipeline and can be download as a JSON file.

## Configuration

Secret scanning can be enabled by setting to `true` the `ENABLE_SECRET_SCAN` CI/CD variable in the settings of the GitLab project or group on which you want to enable the feature.

## Customization

Secret Detection can be customized by defining the following CI/CD variables:

|                 **Variable**          | **Default** | **Description**                                                      |
| ------------------------------------- | ----------- | -------------------------------------------------------------------- |
| SECRET_DETECTION_EXCLUDED_PATHS	    | ""          | Exclude vulnerabilities from a comma-separated list of paths.        |
| SECRET_DETECTION_HISTORIC_SCAN	    | FALSE       | Enables scanning of previous commits                                 |
| SECRET_DETECTION_IMAGE_SUFFIX         | ""          | Suffix added to the image name.                                      |
| SECRET_DETECTION_LOG_OPTIONS          | ""          | git log option to define commit ranges.                              |