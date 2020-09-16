/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import DefaultNavbarItem from "./DefaultNavbarItem";
import {
  useVersions,
  useLatestVersion,
  useActiveDocContext,
} from "@theme/hooks/useDocs";

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  ...props
}) {
  const activeDocContext = useActiveDocContext(docsPluginId);
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);

  function getItems() {
    // We don't want to render a version dropdown with 0 or 1 item
    // If we build the site with a single docs version (onlyIncludeVersions: ['1.0.0'])
    // We'd rather render a buttonb instead of a dropdown
    if (versions.length <= 2) {
      return undefined;
    }

    // Remove "Next" version, users shouldn't see it
    const filteredVersions = versions.slice(1);

    return filteredVersions.map((version, index) => {
      // We try to link to the same doc, in another version
      // When not possible, fallback to the "main doc" of the version
      const versionLabel =
        version.label[0] === "5" ? "5.10.x" : "6.0.x (latest)";

      const versionDoc =
        activeDocContext?.alternateDocVersions[version.name] ||
        getVersionMainDoc(version);
      return {
        fromDropdownVersions: true,
        isNavLink: true,
        label: versionLabel,
        to: versionDoc.path,
        isActive: () => version === activeDocContext?.activeVersion,
      };
    });
  }

  const dropdownVersion = activeDocContext.activeVersion ?? latestVersion; // Mobile is handled a bit differently

  const versionLabel =
    dropdownVersion.label[0] === "5" ? "5.10.x" : "6.0.x (Latest)";

  const dropdownLabel = mobile ? "Versions" : `Version ${versionLabel}`;
  const dropdownTo = mobile
    ? undefined
    : getVersionMainDoc(dropdownVersion).path;
  //const activeDocContext = useActiveDocContext(docsPluginId);

  return (
    <DefaultNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={getItems()}
    />
  );
}
