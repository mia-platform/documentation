---
id: security-overview
title: Mia-Platform Console Security
sidebar_label: Security
---

To help prevent [supply-chain attacks], some Mia-Platform released artifacts are cryptographically signed so you can
be sure to have downloaded are the ones built and distributed by Mia-Platform.

You can verify the signing in every momento to be sure that there was no tampering of the released artifact that you
are about to install.

The public certificates that are required for the verification are available on this website and may depend on the
artifact you need to verify. At this time of writing all the artifacts are signed using the same underling key.

## Container Images

Here you can find all the artifacts and the starting version when they are being signed and verifiable with `cosign`:

| Container Image | Starting Tag |
| --- | --- |
| nexus.mia-platform.eu/console/backend | v10.0.0 |

Our PEM-encoded public key can be downloaded [here] and you can see and example of verification of the signature
using cosing:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
cosign verify --key "${KEY}" nexus.mia-platform.eu/console/backend:v10.0.0
```

## Software Bill of Materials

Another affordance we provide for improving the transparency of our artifacts is providing a Software Bill of
Materials (SBOM) for every artifact that are cryptographically signed using the in-toto attestation method.

Every signed artifacts has its attestation containing a SPDX SBOM in json format that you can verify and download
using cosign:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
cosign verify-attestation --type spdxjson --key "${KEY}" nexus.mia-platform.eu/console/backend:v10.0.0
```

This command will download the raw attestation verifying that nothing has been tampered, to see the actual payload
you can pass the result to `jq` to extract the in-toto attestation containing the SPDX document:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
cosign verify-attestation --type spdxjson --key "${KEY}" nexus.mia-platform.eu/console/backend:v10.0.0 | jq '.payload | @base64d | fromjson'
```

Additionally with a tool like `grype` that can check a SBOM against a vulnerability database you can always check if
a vulnerability has been found after the artifact build:

```shell
KEY=https://docs.mia-platform.eu/public-keys/mia-platform-pubkey-2023-10-01.pem
cosign verify-attestation --type spdxjson --key "${KEY}" nexus.mia-platform.eu/console/backend:v10.0.0 | jq '.payload | @base64d | fromjson | .predicate' | grype
```

[supply-chain attacks]: https://en.wikipedia.org/wiki/Supply_chain_attack
[here]: /public-keys/static/public-keys/mia-platform-pubkey-2023-10-01.pem "Mia-Platform PEM-encoded public key"
