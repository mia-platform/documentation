/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/prop-types */

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import {
  useActivePlugin,
  useActiveVersion,
  useDocVersionSuggestions,
} from '@theme/hooks/useDocs';

const getVersionMainDoc = (version) =>
  version.docs.find((doc) => doc.id === version.mainDocId);

function DocVersionSuggestions() {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {pluginId} = useActivePlugin({
    failfast: true,
  });
  const activeVersion = useActiveVersion(pluginId);
  const {
    latestDocSuggestion,
    latestVersionSuggestion,
  } = useDocVersionSuggestions(pluginId); // No suggestion to be made

  if (!latestVersionSuggestion) {
    return <></>;
  } // try to link to same doc in latest version (not always possible)
  // fallback to main doc of latest version

  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  // CUSTOM_CHANGE: removed "unsupported" phrase and removed (current) from version label
  return (
    <div className="alert alert--warning margin-bottom--md" role="alert">
      {
        // TODO need refactoring
        activeVersion.name === 'current' ? (
          <div>
            This is unreleased documentation for {siteTitle}{' '}
            <strong>{activeVersion.label}</strong> version.
          </div>
        ) : (
          <div>
            This is documentation for {siteTitle}{' '}
            <strong>{activeVersion.label}</strong>.
          </div>
        )
      }
      <div className="margin-top--md">
        For up-to-date documentation, see the{' '}
        <strong>
          <Link
            // CUSTOM_CHANGE: we don't want to save selected version globally. In homepage the selected version must be the last
            // onClick={() =>
            //   savePreferredVersionName(latestVersionSuggestion.name)
            // }
            to={latestVersionSuggestedDoc.path}
          >
            latest version
          </Link>
        </strong>{' '}
        ({latestVersionSuggestion.label.replace('(Current)','')}).
      </div>
    </div>
  );
}

export default DocVersionSuggestions;
