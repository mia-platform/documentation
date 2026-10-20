---
id: documentation_hub
title: Documentation Hub
sidebar_label: Documentation Hub
---

# Documentation Hub

The **Documentation Hub** is a single place to browse and export every exportable artifact your product has generated, grouped by the section of your compliance file they belong to. Open it from the project sidebar.

## Browsing the catalog

The Hub shows seven cards, one per section:

- **Requirements**
- **Software Design**
- **Software Development**
- **Verification**
- **Risk Analysis**
- **Traceability**
- **Product**

Each card shows how many records it currently holds for the active version. A section that has nothing to export yet is marked **Not available yet**, with a note that downloads for it will come in a future release.

The Hub is visible to **every project member, including Viewers**: anyone can see what exists, even if they cannot export it.

## Downloading

Open a card to download its contents, or an individual record inside it. Items download in their native format (for example, a unit test report keeps the format you chose when exporting it elsewhere in the product); a section with more than one item is downloaded as a zip archive.

Not every member can download. If you don't have permission to export a section's content, its download controls are visible but disabled:

- **Viewer role**: download controls are disabled everywhere in the Hub, with a tooltip explaining that downloading isn't available for Viewers.
- **No read access to a section**: if your role doesn't carry read access to a particular SDLC section, that section's downloads stay disabled for you specifically, with a tooltip explaining why.

The **Verification** card's test list defaults to unit-level tests; switching test type re-queries just that card without reloading the rest of the catalog.

## Download History

Every download from the Hub — and every report or SBOM downloaded from its own page elsewhere in the product — is recorded. Open **Download History** from the Hub to see:

- Document name, format, date, who downloaded it, and its size.
- Filters to search by document, user, or version, and to narrow by section, downloaded-by, or download date.
- A **re-download** action on each row, so you can fetch the exact same file again without navigating back to where it came from.

This gives every project member visibility into who exported what, and when, as part of your record of who has handled regulated artifacts.
