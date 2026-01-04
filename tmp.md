# Scenarios

## Promotion of a version from next to current AND promotion of a version from canary to next

Versions dropdown before:

- 1.4.0 (CANARY)
- 1.3.0 (NEXT)
- 1.2.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

Versions dropdown after:

- 1.x.x (CANARY)
- 1.4.0 (NEXT)
- 1.3.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

1. Run `yarn docusarus docs:version 1.4.0`
   1. `docs/` is copied to `versioned_docs/version-1.4.0/`
   2. `sidebars.json` is copied to `versioned_sidebars/version-1.4.0-sidebars.json`
   3. `1.4.0` is appended to `versions.json`
2. Edit `versionsMap.js`
   1. current `1.2.0` -> `1.3.0`
   2. next `1.3.0` -> `1.4.0`
   3. lts `1.1.0, 1.0.0`
3. Remove everything regarding version `1.2.0`
   1. delete `versioned_docs/version-1.2.0`
   2. delete `versioned_sidebars/version-1.2.0-sidebars.json`
   3. remove `1.2.0` from `versions.json`
4. Change any link to `/docs/1.3.0/...` to `/docs/...`

## Promotion of a version from next to current WITHOUT promotion of a version from canary to next

Versions dropdown before:

- 1.4.0 (CANARY)
- 1.3.0 (NEXT)
- 1.2.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

Versions dropdown after:

- 1.4.0 (CANARY)
- 1.3.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

1. Edit `versionsMap.js`
   1. current `1.2.0` -> `1.3.0`
   2. next `1.3.0` -> `null`
   3. lts `1.1.0, 1.0.0`
2. Remove everything regarding version `1.2.0`
   1. delete `versioned_docs/version-1.2.0`
   2. delete `versioned_sidebars/version-1.2.0-sidebars.json`
   3. remove `1.2.0` from `versions.json`
3. Change any link to `/docs/1.3.0/...` to `/docs/...`

## Promotion of an LTS version from next to current AND promotion of a version from canary to next

Versions dropdown before:

- 1.4.0 (CANARY)
- 1.3.0 (NEXT & LTS)
- 1.2.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

Versions dropdown after:

- 1.x.x (CANARY)
- 1.4.0 (NEXT)
- 1.3.0 (CURRENT & LTS)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

1. Run `yarn docusarus docs:version 1.4.0`
   1. `docs/` is copied to `versioned_docs/version-1.4.0/`
   2. `sidebars.json` is copied to `versioned_sidebars/version-1.4.0-sidebars.json`
   3. `1.4.0` is appended to `versions.json`
2. Edit `versionsMap.js`
   1. current `1.2.0` -> `1.3.0`
   2. next `1.3.0` -> `1.4.0`
   3. lts `1.3.0, 1.1.0, 1.0.0`
3. Remove everything regarding version `1.2.0`
   1. delete `versioned_docs/version-1.2.0`
   2. delete `versioned_sidebars/version-1.2.0-sidebars.json`
   3. remove `1.2.0` from `versions.json`
4. Change any link to `/docs/1.3.0/...` to `/docs/...`

## Promotion of a version from next to current AND promotion of an LTS version from canary to next

Versions dropdown before:

- 1.4.0 (CANARY & LTS)
- 1.3.0 (NEXT)
- 1.2.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

Versions dropdown after:

- 1.x.x (CANARY)
- 1.4.0 (NEXT & LTS)
- 1.3.0 (CURRENT)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

1. Run `yarn docusarus docs:version 1.4.0`
   1. `docs/` is copied to `versioned_docs/version-1.4.0/`
   2. `sidebars.json` is copied to `versioned_sidebars/version-1.4.0-sidebars.json`
   3. `1.4.0` is appended to `versions.json`
2. Edit `versionsMap.js`
   1. current `1.2.0` -> `1.3.0`
   2. next `1.3.0` -> `1.4.0`
   3. lts `1.4.0, 1.1.0, 1.0.0`
3. Remove everything regarding version `1.2.0`
   1. delete `versioned_docs/version-1.2.0`
   2. delete `versioned_sidebars/version-1.2.0-sidebars.json`
   3. remove `1.2.0` from `versions.json`
4. Change any link to `/docs/1.3.0/...` to `/docs/...`

## Promotion of an version from next to current AND promotion of a version from canary to next AND the previous current is an LTS

Versions dropdown before:

- 1.4.0 (CANARY)
- 1.3.0 (NEXT)
- 1.2.0 (CURRENT & LTS)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

Versions dropdown after:

- 1.x.x (CANARY)
- 1.4.0 (NEXT)
- 1.3.0 (CURRENT)
- 1.2.0 (LTS)
- 1.1.0 (LTS)
- 1.0.0 (LTS)

1. Run `yarn docusarus docs:version 1.4.0`
   1. `docs/` is copied to `versioned_docs/version-1.4.0/`
   2. `sidebars.json` is copied to `versioned_sidebars/version-1.4.0-sidebars.json`
   3. `1.4.0` is appended to `versions.json`
2. Edit `versionsMap.js`
   1. current `1.2.0` -> `1.3.0`
   2. next `1.3.0` -> `1.4.0`
   3. lts `1.2.0, 1.1.0, 1.0.0`
3. Change any link to `/docs/1.3.0/...` to `/docs/...`

## Release of a new patch of an LTS version
