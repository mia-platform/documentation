/*
* This file is based on the original SearchBar component: https://github.com/facebook/docusaurus/blob/v2.4.0/packages/docusaurus-theme-search-algolia/src/theme/SearchBar/index.tsx
*/

/* eslint-disable react/prop-types */
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {DocSearchButton, useDocSearchKeyboardEvents} from '@docsearch/react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import {
  isRegexpStringMatch,
  useSearchLinkCreator,
} from '@docusaurus/theme-common';
import {
  useAlgoliaContextualFacetFilters,
  useSearchResultUrlProcessor,
} from '@docusaurus/theme-search-algolia/client';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {createPortal} from 'react-dom';
import translations from '@theme/SearchTranslations';

let DocSearchModal = null;
function Hit({
  hit,
  children,
}) {
  return <Link to={hit.url}>{children}</Link>;
}
function ResultsFooter({state, onClose}) {
  const createSearchLink = useSearchLinkCreator();

  return (
    <Link onClick={onClose} to={createSearchLink(state.query)}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{count: state.context.nbHits}}
      >
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}
function mergeFacetFilters(f1, f2) {
  const normalize = (f) =>
    typeof f === 'string' ? [f] : f;
  return [...normalize(f1), ...normalize(f2)]
}
function DocSearch({contextualSearch, externalUrlRegex, customStyle = {}, placeholder = 'Search', ...props}) {
  const {siteMetadata} = useDocusaurusContext();
  const processSearchResultUrl = useSearchResultUrlProcessor();

  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters();

  const configFacetFilters =
    props.searchParameters?.facetFilters ?? [];

  const facetFilters = contextualSearch    ? // Merge contextual search filters with config filters
      mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)    : // ... or use config facetFilters
      configFacetFilters;

  // We let user override default searchParameters if she wants to
  const searchParameters = {
    ...props.searchParameters,
    facetFilters,
  };

  const history = useHistory();
  const searchContainer = useRef(null);
  const searchButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState(undefined);

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([
      import('@docsearch/react/modal'),
      import('@docsearch/react/style'),
      import('./styles.css'),
    ]).then(([{DocSearchModal: Modal}]) => {
      DocSearchModal = Modal;
    });
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      searchContainer.current = document.createElement('div');
      document.body.insertBefore(
        searchContainer.current,
        document.body.firstChild,
      );
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded, setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    searchContainer.current?.remove();
  }, [setIsOpen]);

  const onInput = useCallback(
    (event) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true);
        setInitialQuery(event.key);
      });
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery],
  );

  const navigator = useRef({
    navigate({itemUrl}) {
      // Algolia results could contain URL's from other domains which cannot
      // be served through history and should navigate with window.location
      if (isRegexpStringMatch(externalUrlRegex, itemUrl)) {
        window.location.href = itemUrl;
      } else {
        history.push(itemUrl);
      }
    },
  }).current;

  const transformItems = useRef(
    (items) =>
      props.transformItems        ? // Custom transformItems
          props.transformItems(items)        : // Default transformItems
          items.map((item) => ({
            ...item,
            url: processSearchResultUrl(item.url),
          })),
  ).current;

  const resultsFooterComponent =
    useMemo(
      () =>
        // eslint-disable-next-line react/no-unstable-nested-components, react/display-name
        (footerProps) =>
          <ResultsFooter {...footerProps} onClose={onClose} />,
      [onClose],
    );

  const transformSearchClient = useCallback(
    (searchClient) => {
      searchClient.addAlgoliaAgent(
        'docusaurus',
        siteMetadata.docusaurusVersion,
      );

      return searchClient;
    },
    [siteMetadata.docusaurusVersion],
  );

  if(!props.avoidKeyboardShortcuts) {
    useDocSearchKeyboardEvents({
      isOpen,
      onOpen,
      onClose,
      onInput,
      searchButtonRef,
    });
  }
  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          crossOrigin="anonymous"
          href={`https://${props.appId}-dsn.algolia.net`}
          rel="preconnect"
        />
      </Head>

      <DocSearchButton
        onClick={onOpen}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onTouchStart={importDocSearchModalIfNeeded}
        placeholder={placeholder}
        ref={searchButtonRef}
        style={{...customStyle}}
        translations={translations.button}
      />

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            hitComponent={Hit}
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            navigator={navigator}
            onClose={onClose}
            transformItems={transformItems}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && {
              resultsFooterComponent,
            })}
            {...props}
            placeholder={translations.placeholder}
            searchParameters={searchParameters}
            translations={translations.modal}
          />,
          searchContainer.current,
        )}
    </>
  );
}

// This component add the `avoidKeyboardShortcuts` prop to the default SearchBar component.
// In our use case, it avoid a double search bar using `cmd+k` in homepage (which has two different search bar)
export default function SearchBar({avoidKeyboardShortcuts, customStyle, placeholder}) {
  const {siteConfig} = useDocusaurusContext();
  return <DocSearch {...siteConfig.themeConfig.algolia} avoidKeyboardShortcuts={avoidKeyboardShortcuts} customStyle={customStyle} placeholder={placeholder} />;
}
