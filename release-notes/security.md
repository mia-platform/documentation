---
id: security-overview
title: Mia-Platform Console Security
sidebar_label: Security
---

To help prevent [supply-chain attacks](https://en.wikipedia.org/wiki/Supply_chain_attack), some Mia-Platform released artifacts are cryptographically signed so you can be sure to have downloaded are the ones built and distributed by Mia-Platform.

You can verify the signing in every moment to be sure that there was no tampering of the released artifact that you are about to install.

The public certificates that are required for the verification are available on this website and may depend on the artifact you need to verify. At this time of writing all the artifacts are signed using the same underling key.

## Container Images

Here you can find all the artifacts and the starting version when they are being signed and verifiable with `cosign`:

| Container Image                                                      | Starting Tag |
| -------------------------------------------------------------------- | ------------ |
| nexus.mia-platform.eu/console/scripts/marketplace-sync               | 10.5.1-rc.0  |
| nexus.mia-platform.eu/console/scripts/version-upgrader               | 9.5.1-rc.0   |
| nexus.mia-platform.eu/console/api-gateway                            | 0.2.9        |
| nexus.mia-platform.eu/api-portal/website                             | 2.1.1        |
| nexus.mia-platform.eu/core/authentication-service                    | 3.10.1       |
| nexus.mia-platform.eu/core/authorization-service                     | 2.4.3        |
| nexus.mia-platform.eu/console/backend                                | 30.4.1-rc.0  |
| nexus.mia-platform.eu/core/client-credentials                        | 3.4.1        |
| nexus.mia-platform.eu/mia-platform/crud-service                      | 7.2.2        |
| ghcr.io/mia-platform/crud-service                                    | 7.2.2        |
| nexus.mia-platform.eu/console/deploy-service                         | 7.3.2-rc.0   |
| nexus.mia-platform.eu/console/environments-variables                 | 3.6.1-rc.0   |
| nexus.mia-platform.eu/console/extensibility-manager                  | 1.7.0-rc.0   |
| nexus.mia-platform.eu/console/favorites-service                      | 2.2.0-rc.0   |
| nexus.mia-platform.eu/console/feature-toggle-service                 | 1.3.7        |
| nexus.mia-platform.eu/plugins/files-service                          | 2.10.2       |
| nexus.mia-platform.eu/console/kubernetes-service                     | 8.4.2-rc.0   |
| nexus.mia-platform.eu/backoffice/login-site                          | 8.1.3        |
| nexus.mia-platform.eu/plugins/ses                                    | 3.5.0        |
| nexus.mia-platform.eu/console/notification-provider                  | 2.2.5        |
| nexus.mia-platform.eu/core/swagger-aggregator                        | 3.8.2        |
| nexus.mia-platform.eu/console/aggregated-website                     | 1.4.34-rc.0  |
| nexus.mia-platform.eu/console/mia-craft-bff                          | 1.2.5        |
| nexus.mia-platform.eu/console/rbac-manager-bff                       | 1.16.4       |
| ghcr.io/rond-authz/rond                                              | 1.12.9       |
| nexus.mia-platform.eu/console/tenant-overview                        | 4.0.6        |
| nexus.mia-platform.eu/console/project-service                        | 2.0.15       |
| nexus.mia-platform.eu/console/scripts/bindings-cleaner               | 1.2.1        |
| nexus.mia-platform.eu/console/scripts/configuration-history-cleaner  | 0.3.2        |
| nexus.mia-platform.eu/console/license-metrics-generator              | 6.0.6        |
| nexus.mia-platform.eu/console/license-manager                        | 3.0.3        |
| nexus.mia-platform.eu/console/events-manager                         | 1.4.3        |
| nexus.mia-platform.eu/microlc/middleware                             | 3.3.3        |
| nexus.mia-platform.eu/console/mia-assistant                          | 0.7.2        |
| nexus.mia-platform.eu/back-kit/mfe-toolkit-on-prem                   | 1.2.18       |
| nexus.mia-platform.eu/data-catalog/agent                             | 0.7.0        |
| nexus.mia-platform.eu/back-kit/bk-web-components                     | >=1.5.23     |
| nexus.mia-platform.eu/backoffice/data-visualization                  | >=1.8.3      |
| nexus.mia-platform.eu/core/charts-service                            | >=2.0.2      |
| nexus.mia-platform.eu/console/api-gateway                            | >=0.2.7      |
| nexus.mia-platform.eu/core/flow-manager                              | >=2.6.6      |
| nexus.mia-platform.eu/fast-data/history/ingestion-reloader           | >=1.4.2      |
| nexus.mia-platform.eu/fast-data/history/ingestion-storer             | >=1.5.3      |
| nexus.mia-platform.eu/plugins/invoice-service                        | >=1.1.0-rc.0 |
| nexus.mia-platform.eu/core/jwt-token-validator                       | >=1.2.0      |
| nexus.mia-platform.eu/fast-data/projection-storer                    | >=1.3.5      |
| nexus.mia-platform.eu/ast-data/real-time-updater                     | >=7.9.1      |
| nexus.mia-platform.eu/fast-data/single-view-creator-plugin           | >=6.7.2      |
| nexus.mia-platform.eu/fast-data/single-view-trigger-generator-plugin | >=3.3.3      |
| nexus.mia-platform.eu/plugins/smtp-mail-notification-service         | >=3.5.0      |
| nexus.mia-platform.eu/backoffice/timeline                            | >=2.1.1      |
| nexus.mia-platform.eu/core/function-service                          | >= 2.3.3     |
| nexus.mia-platform.eu/core/proxy-manager                             | >=3.3.4      |
| nexus.mia-platform.eu/plugins/kafka2rest                             | >=1.1.2      |
| nexus.mia-platform.eu/plugins/rest2kafka                             | >=1.2.1      |
| nexus.mia-platform.eu/core/timer-service                             | >=2.1.4      |
| nexus.mia-platform.eu/core/api-gateway                               | >=5.0.3      |
| nexus.mia-platform.eu/plugins/rag-chatbot-api                        | >= 0.5.0     |

Our PEM-encoded public key can be [downloaded](/public-keys/mia-platform-pubkey-2023-10-01.pem), and you can see and example of verification of the signature using cosing:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
IMAGE=<image tag>
cosign verify --key "${KEY}" "${IMAGE}"
```

## Software Bill of Materials

Another affordance we provide for improving the transparency of our artifacts is providing a Software Bill of Materials (SBOM) for every artifact that are cryptographically signed using the in-toto attestation method.

Every signed artifacts has its attestation containing a SPDX SBOM in json format that you can verify and download using cosign:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
IMAGE=<image tag>
cosign verify-attestation --type spdxjson --key "${KEY}" "${IMAGE}"
```

This command will download the raw attestation verifying that nothing has been tampered, to see the actual payload you can pass the result to `jq` to extract the in-toto attestation containing the SPDX document:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
IMAGE=<image tag>
cosign verify-attestation --type spdxjson --key "${KEY}" "${IMAGE}" | jq '.payload | @base64d | fromjson'
```

Additionally with a tool like `grype` that can check a SBOM against a vulnerability database you can always check if a vulnerability has been found after the artifact build:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
IMAGE=<image tag>
cosign verify-attestation --type spdxjson --key "${KEY}" "${IMAGE}" | jq '.payload | @base64d | fromjson | .predicate' | grype
```
