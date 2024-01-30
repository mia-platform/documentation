---
id: secret_scanning
title: Secret Scanning
sidebar_label: Secret scanning
---

Secret scanning provides the ability to detect secrets accidentally committed to remote repositories.
The check is performed by running the pipeline and a secret being pushed to a remote repository will cause the pipeline to fail.

:::caution
Secret scanning is only available on the GitLab instance of Mia-Platform. If you are using a different GitLab instance, this feature may not be available or may have different functionality. 
:::

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

:::warning
If SECRET_DETECTION_HISTORIC_SCAN is not enabled, only the last commit will be checked against secret scanning.

When SECRET_DETECTION_HISTORIC_SCAN is in use with Mia-Platform pipelines, it is also required to set the GIT_DEPTH variable to 0 or the pipeline will otherwise break.
:::

## Handling False Positives in Secret Detection using Inline Comments

False positives might occur when using secret detection tools, where test secrets are identified as potential leaks.
To address this issue, one might use the above documented `SECRET_DETECTION_EXCLUDED_PATHS` variable or use inline comments to ignore false positives.

To ignore a false positive using inline comments, follow these steps:

* Identify the specific line of code that is generating the false positive.
* Place an inline comment on the same line as the false positive. The comment must start with `gitleaks-ignore`
* Add a reason for the ignore, for example, "gitleaks-ignore: this is a test secret"
* Commit the changes and push them to the repository.
* Gitleaks will now ignore the false positive and not flag it as a potential leak.

It's important to note that inline comments are only effective for the specific line of code that they are placed on. If the same false positive occurs on multiple lines, separate inline comments must be added to each line. Additionally, it's important to document the reason for the ignore, so that other members of the team can understand why this specific false positive was ignored.

It's also important to keep in mind that ignoring false positives should be used sparingly and only when necessary, as it may lead to missing real security issues. It's important to have a well-defined process for identifying and handling false positives, to avoid missing real issues.



