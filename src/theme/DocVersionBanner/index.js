import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useActivePlugin,
  useDocVersionSuggestions,
} from '@docusaurus/plugin-content-docs/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useDocsPreferredVersion,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import {satisfies} from 'semver'
import versionsMap from '../../../versionsMap.json'

function CanaryVersionLabel() {
  return (
    <div>
        { 'This is unreleased documentation for the Mia-Platform Console version currently under development.' }
        { 'This ' }
        <b>{ 'Canary' }</b>
        { ' documentation is visible only in development mode.' }
    </div>
  )
}

function NextVersionLabel() {
  return (
    <div>
      { 'This is the documentation for the Mia-Platform Console version currently available ' }
      <b>{ 'in Preview.' }</b>
    </div>
  )
}

function LtsVersionLabel() {
  return (
    <div>
      { 'This is the documentation for a ' }
      <b>{ 'stable version' }</b>
      { ' of the Mia-Platform Console.' }
    </div>
  )
}

function UnreleasedVersionLabel({siteTitle, versionMetadata}) {
  return (
    <Translate
      description="The label used to tell the user that he's browsing an unreleased doc version"
      id="theme.docs.versions.unreleasedVersionLabel"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
      }}
    >
      {
        'This is unreleased documentation for {siteTitle} {versionLabel} version.'
      }
    </Translate>
  );
}

function UnmaintainedVersionLabel({siteTitle, versionMetadata}) {
  return (
    <Translate
      description="The label used to tell the user that he's browsing an unmaintained doc version"
      id="theme.docs.versions.unmaintainedVersionLabel"
      values={{
        siteTitle,
        versionLabel: <b>{versionMetadata.label}</b>,
      }}
    >
      {
        'This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.'
      }
    </Translate>
  );
}

const BannerLabelComponents = {
  canary: CanaryVersionLabel,
  next: NextVersionLabel,
  lts: LtsVersionLabel,
  unreleased: UnreleasedVersionLabel,
  unmaintained: UnmaintainedVersionLabel,
};

function BannerLabel(props) {
  let bannerType = props.versionMetadata.banner;

  // If we are in development mode, the version called 'current' is the canary version
  const isCanary = process.env.NODE_ENV !== "production" && props.versionMetadata.version === 'current'

  if (isCanary) {
    bannerType = 'canary'
  } else if (versionsMap.next === props.versionMetadata.version) {
    bannerType = 'next'
  } else if (versionsMap.lts.some((range) => satisfies(props.versionMetadata.version, range))) {
    bannerType = 'lts'
  }

  const BannerLabelComponent = BannerLabelComponents[bannerType];
  return <BannerLabelComponent {...props} />;
}

function LatestVersionSuggestionLabel({versionLabel, to, onClick}) {
  return (
    <Translate
      description="The label used to tell the user to check the latest GA version"
      id="theme.docs.versions.latestVersionSuggestionLabel"
      values={{
        versionLabel,
        latestVersionLink: (
          <b>
            <Link onClick={onClick} to={to}>
              <Translate
                description="The label used for the latest version suggestion link label"
                id="theme.docs.versions.latestVersionLinkLabel"
              >
                { "latest GA version" }
              </Translate>
            </Link>
          </b>
        ),
      }}
    >
      { 'For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).' }
    </Translate>
  );
}

function DocVersionBannerEnabled({className, versionMetadata}) {
  const {siteConfig: {title: siteTitle}} = useDocusaurusContext();
  const {pluginId} = useActivePlugin({failfast: true});

  const getVersionMainDoc = (version) => version.docs.find((doc) => doc.id === version.mainDocId);

  const {savePreferredVersionName} = useDocsPreferredVersion(pluginId);
  const {latestDocSuggestion, latestVersionSuggestion} = useDocVersionSuggestions(pluginId);

  // Try to link to same doc in latest version (not always possible), falling back to main doc of latest version
  const latestVersionSuggestedDoc = latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--warning margin-bottom--md',
      )}
      role="alert"
    >
      <div>
        <BannerLabel siteTitle={siteTitle} versionMetadata={versionMetadata} />
      </div>

      <div className="margin-top--md">
        <LatestVersionSuggestionLabel
          onClick={() => savePreferredVersionName(latestVersionSuggestion.name)}
          to={latestVersionSuggestedDoc.path}
          versionLabel={latestVersionSuggestion.label}
        />
      </div>
    </div>
  );
}

export default function DocVersionBanner({className}) {
  const versionMetadata = useDocsVersion();

  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }

  return null;
}
