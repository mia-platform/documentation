---
id: sbom
title: Software Bill Of Materials (SBOM)
sidebar_label: SBOM
---

# Software Bill Of Materials (SBOM)

When developing Software as a Medical Device (SaMD), the Software Bill of Materials (SBOM) is a crucial tool for enhancing transparency, security, and compliance. A SBOM is an inventory of all the software components, libraries, and dependencies that make up a particular software item and includes information like versioning, licensing and known vulnerabilities. Much like a bill of materials in hardware manufacturing, it provides a detailed mapping of what constitutes the software.

Medical device software must adhere to strict regulatory standards, such as those outlined by the FDA, EU MDR, ISO 13485 and ISO 62304. A SBOM helps ensuring that all components are accounted for, facilitating traceability and reducing the risk of security vulnerabilities that could arise from third-party software. Knowing exactly what components are used and their relationships allows developers to easily assess potential risks and vulnerabilities and promptly identify and remediate any issue in third-party libraries or proprietary components. This is particularly important in ensuring the security and safety of medical devices, where vulnerabilities in software can directly impact patient health.

Furthermore, the SBOM is vital for maintaining ongoing compliance during the entity software lifecycle. As software updates and patches are rolled out, a SBOM ensures that developers and regulators can track changes in the software’s composition, offering a transparent view of the evolving system and ensuring that changes do not introduce new risks.

In summary, the SBOM is a fundamental component of SaMD development. It serves as a safeguard for both patient safety and product integrity by offering visibility into the software’s structure, making it easier to manage risks, maintain compliance, and ensure the overall quality of the medical device.

## How to download the SBOM

P4SaMD can automatically generate the aggregated SBOM of all the custom services included in the system design of a system version.

As a user, you can download the SBOM from the *Software Items* section by clicking on the `Download complete SBOM` button.

## What's in the SBOM

The generated SBOM, currently available as Excel file, provides an inventory of all software items dependencies and contains the following sections:

- `Info`: document generation metadata, including when it was generated (in `dd/mm/yyyy` format) and who generated it (user name and email address);
- `SBOM Report`: the list software items dependencies, with the following information:
  - software item name and version
  - library name and version
  - licensing information
- `Missing SBOMs` (optional): a list of software items (name and version) for which a SBOM was not available at time of generation.

## How to generate a SBOM

P4SaMD is designed to automatically collect the SBOM of each custom service through a webhook and currently supports the [CycloneDX][cyclone-dx] format.

You can easily generate the SBOM inside a CI/CD pipeline with tools like [syft][syft]:

```shell
syft "/path/to/your/source/code" -o cyclonedx-json=gl-sbom-report.cdx.json
```

To submit the generated SBOM file to P4SaMD you send an HTTP request to the P4SaMD `POST /webhook/sboms/` endpoint:

```shell
curl -X POST \
  ${P4SAMD_BACKEND_URL}/webhook/sboms/${CI_PROJECT_ID}/${CI_COMMIT_TAG} \
  -H "secret:${P4SAMD_API_KEY}" \
  -H "Content-Type:application/json" \
  --data-binary "@${P4SAMD_SBOM_FILE}"
```

where:

- `P4SAMD_BACKEND_URL` is the base URL of your P4SaMD backend service;
- `CI_PROJECT_ID` is the ID of the repository associated to the software item;
- `CI_COMMIT_TAG` is the name of the tag representing the version of the software item (should follow [semantic versioning][semantic-versioning]);
- `P4SAMD_API_KEY` is the API key required to authenticate with P4SaMD;
- `P4SAMD_SBOM_FILE`: absolute or relative path to the SBOM file created previously with [syft][syft] or similar tools.

Using the webhook you can easily integrate P4SaMD in your existing DevOps infrastructure and collect all the relevant SBOMs, ensuring they are always up-to-date in P4SaMD.

### Troubleshooting

If the CI/CD pipeline fails, when you download the complete SBOM report some information may be missing or outdated, since the SBOM of one or more software items could be missing or outdated.

If P4SaMD never collected the SBOM of a software item included in the system design, its name and version will be reported in the SBOM report under the `Missing SBOMs` section, so the developers are aware of the issue.

If P4SaMD collected the SBOM for a software item version, which was later changed but not correctly processed by P4SaMD, the complete SBOM report may contain outdated information.
This issue could arise during the development phase of the software lifecycle, when the software dependencies may be updated, but should not affect stable versions.

To further mitigate these risks you can adopt additional measures, like:

- design your CI/CD pipeline to fail as soon as the BOM generation or submission encounter some errors and prevent the build and release of the software version;

- add a step in your CI/CD pipeline to be executed when the pipeline fails and send some automatic alerts:
 
 ```yaml
 notify_failure:
  stage: notify
  script:
    - 'if [ "$CI_PIPELINE_STATUS" == "failed" ]; then ... fi'
  when: on_failure
 ```


[cyclone-dx]: https://cyclonedx.org/
[syft]: https://github.com/anchore/syft
[semantic-versioning]: https://semver.org
