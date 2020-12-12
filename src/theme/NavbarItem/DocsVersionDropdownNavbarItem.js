/* eslint-disable react/prop-types */

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import DefaultNavbarItem from './DefaultNavbarItem';
import {
  useVersions,
  useLatestVersion,
  useActiveDocContext,
} from '@theme/hooks/useDocs';

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}) {

  const activeDocContext = useActiveDocContext(docsPluginId);

  const {activeVersion}=activeDocContext

  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);

  function getItems() {
    const versionLinks = versions.map((version) => {
      // We try to link to the same doc, in another version
      // When not possible, fallback to the "main doc" of the version
      const versionDoc =
        activeDocContext?.alternateDocVersions[version.name] ||
        getVersionMainDoc(version);


      return {
        fromDropdownVersions: true,
        isNavLink: true,
        label: version.label,
        to: versionDoc.path,
        isActive: () => {
          if(!activeVersion && version.name==="current") {
            return true
        }
          return version === activeDocContext?.activeVersion
        },
        // CUSTOM_CHANGE: we don't want to save selected version globally. In homepage the selected version must be the last
        // onClick: () => {
        //   savePreferredVersionName(version.name);
        // },
      };
    });
    const items = [
      ...dropdownItemsBefore,
      ...versionLinks,
      ...dropdownItemsAfter,
    ]; // We don't want to render a version dropdown with 0 or 1 item
    // If we build the site with a single docs version (onlyIncludeVersions: ['1.0.0'])
    // We'd rather render a button instead of a dropdown

    if (items.length <= 1) {
      return undefined;
    }

    return items;
  }

  // CUSTOM_CHANGE: we don't want to use version saved globally
  const preferredVersion=null

  const dropdownVersion = activeDocContext.activeVersion ?? preferredVersion ?? latestVersion; // Mobile is handled a bit differently

  // CUSTOM_CHANGE: Version ${dropdownVersion.label}`;
  const dropdownLabel = mobile ? "Versions" : `Version ${dropdownVersion.label}`;
  /*const dropdownTo = mobile ?
    undefined :
    getVersionMainDoc(dropdownVersion).path;
  */
  // CUSTOM_CHANGE: "to" set as undefined to avoid to allow click on Parent version navbaer item
  return (
    <DefaultNavbarItem
      {...props}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
      items={getItems()}
      label={dropdownLabel}
      mobile={mobile}
      to={undefined}
    />
  );
}
